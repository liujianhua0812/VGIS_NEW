const Sequelize = require("sequelize")
const {Op} = Sequelize

exports.index = async (ctx, next) => {
    let Task = global.db.models.power_saving_task
    let PersonRelation = global.db.models.person_relation
    let User = global.db.models.user

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

    let solverId = null
    if (ctx.request.query.meOnly === "true") {
        solverId = ctx.session.current_user.user.id
    }
    else if (ctx.request.query.solver) {
        solverId = ctx.request.query.solver
    }
    if (solverId) {
        let taskIds = (await PersonRelation.findAll({
            where: {
                userId: solverId
            }
        })).map(item => item.psTaskId)
        query.id = {
            [Op.in]: taskIds
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

exports.moduleStat = async (ctx, next) => {
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
            "module",
            [Sequelize.fn("COUNT", "*"), "total"]
        ],
        where: query,
        group: "module"
    })

    ctx.body = {
        data: stat
    }
}

exports.create = async (ctx, next) => {

}

exports.update = async (ctx, next) => {
    let Task = global.db.models.power_saving_task
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
                psTaskId: record.id
            },
            transaction
        })
        await PersonRelation.bulkCreate(ctx.request.body.solver.map(id => ({
            userId: id,
            psTaskId: record.id
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
    let Task = global.db.models.power_saving_task
    let record = await Task.findByPk(ctx.params.taskId)
    if (record) {
        await record.destroy()
    }
    return ctx.body = {}
}