const {Op, Sequelize} = require("sequelize");

exports.index = async (ctx, next) => {
    let Task = global.db.models.maintenance_task
    let PersonRelation = global.db.models.person_relation
    let User = global.db.models.user
    let DeviceRelation = global.db.models.device_relation
    let Instance = global.db.models.model_instance

    let page = parseInt(ctx.request.query.page)
    let pagination = parseInt(ctx.request.query.pagination)
    page = isNaN(page) ? 1 : page
    pagination = isNaN(pagination) ? 10 : pagination

    let sorter = ctx.request.query.sorter || "createdAt"
    let order = ctx.request.query.order === "ascending" ? "ASC NULLS LAST" : "DESC NULLS LAST"

    let query = {}

    if (ctx.request.query.status) {
        query.status = ctx.request.query.status
    }

    if (ctx.request.query.createdAt) {
        query.createdAt = {
            [Op.gte]: ctx.request.query.createdAt[0] || undefined,
            [Op.lte]: ctx.request.query.createdAt[1] || undefined
        }
    }

    if (ctx.request.query.handledAt) {
        query.handledAt = {
            [Op.gte]: ctx.request.query.handledAt[0] || undefined,
            [Op.lte]: ctx.request.query.handledAt[1] || undefined
        }
    }

    let solverId = null, ids = [], filterById = false
    if (ctx.request.query.meOnly === "true") {
        solverId = ctx.session.current_user.user.id
    }
    else if (ctx.request.query.solver) {
        solverId = ctx.request.query.solver
    }
    if (solverId) {
        filterById = true
        ids = ids.concat((await PersonRelation.findAll({
            where: {
                userId: solverId
            }
        })).map(item => item.mTaskId))
    }

    if (ctx.request.query.device) {
        filterById = true
        ids = ids.concat((await DeviceRelation.findAll({
            where: {
                instanceId: ctx.request.query.device,
                mTaskId: {
                    [Op.ne]: null
                }
            }
        })).map(item => item.mTaskId))
    }
    if (filterById) {
        query.id = {
            [Op.in]: ids
        }
    }

    let records = await Task.findAll({
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
        order: [[sorter, order]]
    })

    let total = await Task.count({ where: query })
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

exports.show = async (ctx, next) => {
    let Task = global.db.models.maintenance_task
    let StaticAttribute = global.db.models.static_attribute
    let AttributeValue = global.db.models.attribute_value
    let PersonRelation = global.db.models.person_relation
    let User = global.db.models.user
    let DeviceRelation = global.db.models.device_relation
    let Instance = global.db.models.model_instance
    let Model = global.db.models.model
    let Media = global.db.models.media_file

    let task = await Task.findByPk(ctx.params.taskId, {
        include: [{
            model: PersonRelation,
            include: [{
                model: User,
                attributes: ["id", "realName"]
            }]
        }, {
            model: DeviceRelation,
            include: [{
                model: Instance,
                include: [{
                    model: Model,
                    include: StaticAttribute
                }, AttributeValue]
            }]
        }]
    })

    let instances = task.device_relations.map(item => item.model_instance)

    let files = await Media.findAll({
        where: {
            [Op.or]: [{
                instanceId: {
                    [Op.in]: instances.map(item => item.id)
                }
            }, {
                modelId: {
                    [Op.in]: instances.map(item => item.modelId)
                }
            }]
        },
        attributes: ["id", "name", "contentType", "extraStr", "extra", "modelId", "instanceId", "createdAt", "updatedAt"]
    })

    let fileMap = files.reduce((result, file) => {
        if (file.instanceId) {
            if (!result[file.instanceId]) {
                result[file.instanceId] = []
            }
            result[file.instanceId].push(file)
        }
        else if (file.modelId) {
            if (!result[file.modelId]) {
                result[file.modelId] = []
            }
            result[file.modelId].push(file)
        }
        return result
    }, {})

    function getAttributeValues (instance) {
        let attributes = instance.model.static_attributes.map(item => ({
            id: item.id,
            name: item.name,
            value: item.dataValues.default
        }))

        let attributeMap = attributes.reduce((result, item) => {
            result[item.id] = item
            return result
        }, {})

        for(let i = 0; i < instance.attribute_values.length; i++) {
            let value = instance.attribute_values[i]
            if (attributeMap[value.attributeId]) {
                attributeMap[value.attributeId].value = value.value
            }
        }
        return attributes
    }

    for(let i = 0; i < task.device_relations.length; i++) {
        let instance = task.device_relations[i].model_instance
        task.device_relations[i].model_instance.dataValues.attributes = getAttributeValues(instance)
        task.device_relations[i].model_instance.dataValues.documents = [].concat(fileMap[instance.id] || []).concat(fileMap[instance.modelId] || [])
    }

    return ctx.body = {
        data: task,
    }
}

exports.generalStat = async (ctx, next) => {
    let Task = global.db.models.power_saving_task

    let query = {}

    if (ctx.request.query.createdAt) {
        query.createdAt = {
            [Op.gte]: ctx.request.query.createdAt[0] || undefined,
            [Op.lte]: ctx.request.query.createdAt[1] || undefined
        }
    }

    let stat = await Task.findOne({
        attributes: [
            [Sequelize.fn("COUNT", "*"), "total"],
            [Sequelize.fn("AVG", Sequelize.col("solveTime")), "averageSolveTime"],
        ],
        where: query,
    })

    ctx.body = {
        data: stat
    }
}

exports.periodStat = async (ctx, next) => {
    let Task = global.db.models.power_saving_task

    let query = {}

    if (ctx.request.query.createdAt) {
        query.createdAt = {
            [Op.gte]: ctx.request.query.createdAt[0] || undefined,
            [Op.lte]: ctx.request.query.createdAt[1] || undefined
        }
    }

    let stat = await Task.findAll({
        attributes: [
            [Sequelize.fn("DATE", Sequelize.col("createdAt")), "date"],
            [Sequelize.fn("COUNT", "*"), "total"]
        ],
        where: query,
        group: "date"
    })

    ctx.body = {
        data: stat
    }
}

exports.create = async (ctx, next) => {
    let job = global.maintenance_scheduler.getCreateTaskJobFromSchedule(Object.assign({}, ctx.request.body, {
        person_relations: (ctx.request.body.solver || []).map(id => ({
            userId: id
        })),
        device_relations: (ctx.request.body.device || []).map(id => ({
            instanceId: id
        }))
    }))
    await job()
    return ctx.body = {
        data: {}
    }
}

exports.update = async (ctx, next) => {
    let Task = global.db.models.maintenance_task
    let PersonRelation = global.db.models.person_relation
    let transaction = await global.db.transaction()
    let record = await Task.findByPk(ctx.params.taskId, {
        transaction
    })
    if (record) {
        Object.assign(record, ctx.request.body)
    }
    if (ctx.request.body.solver) {
        await PersonRelation.destroy({
            where: {
                mTaskId: record.id
            },
            transaction
        })
        await PersonRelation.bulkCreate(ctx.request.body.solver.map(id => ({
            userId: id,
            mTaskId: record.id
        })), {
            transaction
        })
    }
    record = await record.save({
        transaction
    })
    try {
        await transaction.commit()
        return ctx.body = {
            data: record
        }
    }
    catch (err) {
        await transaction.rollback()
        throw err
    }
}

exports.destroy = async (ctx, next) => {
    let Task = global.db.models.maintenance_task
    let record = await Task.findByPk(ctx.params.taskId)
    if (record) {
        await record.destroy()
    }
    return ctx.body = {}
}