const messages = require('../../../libs/Error').messages
const {Op, Sequelize} = require("sequelize");
const later = require("later")
const CreateTask = require('../../tasks/maintenance').create

exports.index = async (ctx, next) => {
    let MaintenanceSchedule = global.db.models.maintenance_schedule
    let PersonRelation = global.db.models.person_relation
    let DeviceRelation = global.db.models.device_relation
    let Instance = global.db.models.model_instance
    let User = global.db.models.user

    let page = parseInt(ctx.request.query.page)
    let pagination = parseInt(ctx.request.query.pagination)
    page = isNaN(page) ? 1 : page
    pagination = isNaN(pagination) ? 10 : pagination

    let query = {}
    if (ctx.request.query.timeRange) {
        // TODO: 一个优化点——这个地方应该把非周期任务实际的调度日期也算进来
        query= {
            [Op.or]: [{
                endAt: {
                    [Op.gte]: ctx.request.query.timeRange[0] || undefined
                },
            }, {
                endAt: null
            }],
            [Op.or]: [{
                startAt: {
                    [Op.lte]: ctx.request.query.timeRange[1] || undefined
                },
            }, {
                startAt: null
            }]
        }
    }

    if (ctx.request.query.enabled) {
        query.enabled = ctx.request.query.enabled === "true"
    }

    let ids = [], filterById = false
    if (ctx.request.query.solver) {
        filterById = true
        ids = ids.concat((await PersonRelation.findAll({
            where: {
                userId: ctx.request.query.solver
            }
        })).map(item => item.mScheduleId))
    }

    if (ctx.request.query.device) {
        filterById = true
        ids = ids.concat((await DeviceRelation.findAll({
            where: {
                instanceId: ctx.request.query.device,
                mScheduleId: {
                    [Op.ne]: null
                }
            }
        })).map(item => item.mScheduleId))
    }
    if (filterById) {
        query.id = {
            [Op.in]: ids
        }
    }

    let records = await MaintenanceSchedule.findAll({
        where: query,
        offset: (page - 1) * pagination,
        limit: pagination,
        include: [{
            model: PersonRelation,
            include: [{
                model: User,
                attributes: ["id", "realName"]
            }]
        }, {
            model: DeviceRelation,
            include: [{
                model: Instance
            }]
        }],
        order: [
            ["startAt", "DESC"],
            ["endAt", "DESC"]
        ]
    })
    let total = await MaintenanceSchedule.count({ where: query })
    for(let i = 0; i < records.length; i++) {
        let record = records[i]
        record.dataValues.readable = global.maintenance_scheduler.translateSchedule(record)
    }
    return ctx.body = {
        data: records,
        pagination: {
            page,
            pagination,
            total,
            total_page: Math.ceil(total / pagination)
        }
    }
}

exports.calendar = async (ctx, next) => {
    let MaintenanceSchedule = global.db.models.maintenance_schedule
    let PersonRelation = global.db.models.person_relation
    let User = global.db.models.user
    let DeviceRelation = global.db.models.device_relation
    let Instance = global.db.models.model_instance

    let startAt = new Date(ctx.request.query.startAt)
    let endAt = new Date(ctx.request.query.endAt)

    let query = {
        enabled: true,
        [Op.or]: [{
            endAt: {
                [Op.gte]: startAt
            },
        }, {
            endAt: null
        }],
        [Op.or]: [{
            startAt: {
                [Op.lte]: endAt
            },
        }, {
            startAt: null
        }],
        [Op.or]: [{
            periodical: false,
            scheduledAt: {
                [Op.gte]: startAt,
                [Op.lte]: endAt
            }
        }, {
            periodical: true,
        }]
    }

    if (ctx.request.query.device) {
        let ids = (await DeviceRelation.findAll({
            where: {
                instanceId: ctx.request.query.device,
                mScheduleId: {
                    [Op.ne]: null
                }
            }
        })).map(item => item.mScheduleId)
        query.id = {
            [Op.in]: ids
        }
    }

    let records = await MaintenanceSchedule.findAll({
        where: query,
        include: [{
            model: PersonRelation,
            include: [{
                model: User,
                attributes: ["id", "realName"]
            }]
        }, {
            model: DeviceRelation,
            include: [{
                model: Instance
            }]
        }]
    })

    let result = []
    for(let i = 0; i < records.length; i++) {
        let schedule = {
            info: records[i],
            timetable: {}
        }
        if (schedule.info.periodical) {
            let sched = later.parse.cron(schedule.info.period)
            let sStartAt = schedule.info.startAt || startAt
            let sEndAt = schedule.info.endAt || endAt
            for(let i = new Date(Math.max(startAt.getTime(), sStartAt.getTime())); i.getTime() < Math.min(endAt.getTime(), sEndAt.getTime()); i.setHours(i.getHours() + 1)) {
                let _startAt = new Date(i.getTime())
                let _endAt = new Date(i.getTime())
                _endAt.setHours(_endAt.getHours() + 1)
                _endAt.setSeconds(_endAt.getSeconds() - 1)
                if (_endAt > Math.min(endAt.getTime(), sEndAt.getTime())) {
                    _endAt = new Date(Math.min(endAt.getTime(), sEndAt.getTime()))
                    _endAt.setSeconds(_endAt.getSeconds() - 1)
                }
                schedule.timetable[i.format("yyyy-MM-dd hh")] = later.schedule(sched).next(Number.MAX_SAFE_INTEGER - 1, _startAt, _endAt).length
            }
        }
        else {
            schedule.timetable[schedule.info.scheduledAt.format("yyyy-MM-dd hh")] = 1
        }
        result.push(schedule)
    }

    return ctx.body = {
        data: result
    }
}

exports.create = async (ctx, next) => {
    let MaintenanceSchedule = global.db.models.maintenance_schedule
    let PersonRelation = global.db.models.person_relation
    let DeviceRelation = global.db.models.device_relation
    let Instance = global.db.models.model_instance
    let transaction = await global.db.transaction()
    if (ctx.request.body.instantly) {
        ctx.request.body.scheduledAt = new Date()
        ctx.request.body.enabled = true
        ctx.request.body.executed = true
    }
    if (!ctx.request.body.periodical) {
        delete ctx.request.body.period
        delete ctx.request.body.tickInPeriod
    }
    let record = await MaintenanceSchedule.create(ctx.request.body, {
        transaction
    })

    if (ctx.request.body.device) {
        await DeviceRelation.bulkCreate(ctx.request.body.device.map(id => ({
            instanceId: id,
            mScheduleId: record.id
        })), {
            transaction
        })
    }
    if (ctx.request.body.solver) {
        await PersonRelation.bulkCreate(ctx.request.body.solver.map(id => ({
            userId: id,
            mScheduleId: record.id
        })), {
            transaction
        })
    }
    try {
        await transaction.commit()
        record = await MaintenanceSchedule.findByPk(record.id, {
            include: [PersonRelation, DeviceRelation]
        })
        // 立即执行
        if (ctx.request.body.instantly) {
            let job = global.maintenance_scheduler.getCreateTaskJobFromSchedule(record)
            await job()
        }
        else {
            global.maintenance_scheduler.addSchedule(record)
        }
        return ctx.body = {
            data: record
        }
    }
    catch (err) {
        await transaction.rollback()
        throw err
    }
}

exports.update = async (ctx, next) => {
    let MaintenanceSchedule = global.db.models.maintenance_schedule
    let PersonRelation = global.db.models.person_relation
    let DeviceRelation = global.db.models.device_relation
    let Instance = global.db.models.model_instance

    let transaction = await global.db.transaction()
    let record = await MaintenanceSchedule.findByPk(ctx.params.scheduleId, {
        transaction
    })
    if (record) {
        if (ctx.request.body.instantly) {
            ctx.request.body.scheduledAt = new Date()
            ctx.request.body.executed = true
        }
        if (!ctx.request.body.periodical) {
            delete ctx.request.body.period
            delete ctx.request.body.tickInPeriod
        }
        Object.assign(record, ctx.request.body)
    }
    if (ctx.request.body.device) {
        await DeviceRelation.destroy({
            where: {
                mScheduleId: record.id
            },
            transaction
        })
        await DeviceRelation.bulkCreate(ctx.request.body.device.map(id => ({
            instanceId: id,
            mScheduleId: record.id
        })), {
            transaction
        })
    }
    if (ctx.request.body.solver) {
        await PersonRelation.destroy({
            where: {
                mScheduleId: record.id
            },
            transaction
        })
        await PersonRelation.bulkCreate(ctx.request.body.solver.map(id => ({
            userId: id,
            mScheduleId: record.id
        })), {
            transaction
        })
    }
    record = await record.save({
        transaction
    })
    try {
        await transaction.commit()
        record = await MaintenanceSchedule.findByPk(record.id, {
            include: [PersonRelation, DeviceRelation]
        })
        if (ctx.request.body.instantly) {
            let job = global.maintenance_scheduler.getCreateTaskJobFromSchedule(record)
            await job()
        }
        else {
            global.maintenance_scheduler.addSchedule(record)
        }
        return ctx.body = {
            data: record
        }
    }
    catch (err) {
        console.log(err)
        await transaction.rollback()
        throw err
    }
}

exports.destroy = async (ctx, next) => {
    let MaintenanceSchedule = global.db.models.maintenance_schedule
    let record = await MaintenanceSchedule.findByPk(ctx.params.scheduleId)
    if (record) {
        await record.destroy()
        global.maintenance_scheduler.removeSchedule(record)
    }
    return ctx.body = {}
}

exports.bulkDestroy = async (ctx, next) => {
    let MaintenanceSchedule = global.db.models.maintenance_schedule
    if (ctx.request.query.recordIds) {
        if (!(ctx.request.query.recordIds instanceof Array)) {
            ctx.request.query.recordIds = [ctx.request.query.recordIds]
        }
    }
    else {
        ctx.request.query.recordIds = []
    }
    await MaintenanceSchedule.destroy({
        where: {
            id: {
                [Op.in]: ctx.request.query.recordIds
            }
        }
    })
    global.maintenance_scheduler.bulkRemoveSchedule(ctx.request.query.recordIds)
    return ctx.body = {}
}