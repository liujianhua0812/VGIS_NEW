const messages = require('../../../libs/Error').messages
const {Op, Sequelize} = require("sequelize");

exports.index = async (ctx, next) => {
    let Factor = global.db.models.conversion_factor
    let FactorValue = global.db.models.factor_value
    let Unit = global.db.models.unit

    let page = parseInt(ctx.request.query.page)
    let pagination = parseInt(ctx.request.query.pagination)
    page = isNaN(page) ? 1 : page
    pagination = isNaN(pagination) ? 10 : pagination

    let query = {}
    if (ctx.request.query.timeRange) {
        query= {
            endAt: {
                [Op.gte]: ctx.request.query.timeRange[0] || undefined
            },
            startAt: {
                [Op.lte]: ctx.request.query.timeRange[1] || undefined
            }
        }
    }

    if (ctx.request.query.factorId) {
        query.factorId = ctx.request.query.factorId
    }
    else if (ctx.request.query.factor) {
        if (!(ctx.request.query.factor instanceof Array)) {
            ctx.request.query.factor = [ctx.request.query.factor]
        }
        let factors = await Factor.findAll({
            attributes: ["id", "name"],
            where: {
                name: {
                    [Op.in]: ctx.request.query.factor
                }
            }
        })
        query.factorId = {
            [Op.in]: factors.map(item => item.id)
        }
    }

    let records = await FactorValue.findAll({
        where: query,
        offset: (page - 1) * pagination,
        limit: pagination,
        include: [{
            model: Factor,
            include: [Unit]
        }],
        order: [
            ["startAt", ctx.request.query.order === "DESC" ? "DESC" : "ASC"],
            ["endAt", ctx.request.query.order === "DESC" ? "DESC" : "ASC"]
        ]
    })
    let total = await FactorValue.count({ where: query })
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

/**
 * 获得全部的当前正在生效的转换因子
 * @param ctx
 * @param next
 * @returns {Promise<{data: Model<any, TModelAttributes>[]}>}
 */
exports.show = async (ctx, next) => {
    let FactorValue = global.db.models.factor_value
    let date = new Date(ctx.request.query.date)
    if (isNaN(date.getTime())) {
        date = new Date()
    }
    return ctx.body = {
        data: await FactorValue.findAll({
            where: {
                startAt: {
                    [Op.lte]: date
                },
                [Op.or]: [{
                    endAt: null
                }, {
                    endAt: {
                        [Op.gte]: date
                    }
                }]
            }
        })
    }
}

exports.create = async (ctx, next) => {
    let FactorValue = global.db.models.factor_value
    let duplicate = await FactorValue.findOne({
        where: {
            factorId: ctx.request.body.factorId,
            endAt: {
                [Op.gte]: ctx.request.body.startAt
            },
            startAt: {
                [Op.lte]: ctx.request.body.endAt
            }
        }
    })
    if (duplicate) {
        throw new Error(messages.controller.factor.DUPLICATE_FACTOR_VALUE)
    }
    let record = await FactorValue.create(ctx.request.body)
    return ctx.body = {
        data: record
    }
}

exports.update = async (ctx, next) => {
    let FactorValue = global.db.models.factor_value
    let duplicate = await FactorValue.findOne({
        where: {
            id: {
                [Op.ne]: ctx.params.recordId
            },
            factorId: ctx.request.body.factorId,
            endAt: {
                [Op.gte]:ctx.request.body.startAt
            },
            startAt: {
                [Op.lte]: ctx.request.body.endAt
            }
        }
    })
    if (duplicate) {
        throw new Error(messages.controller.factor.DUPLICATE_FACTOR_VALUE)
    }
    let record = await FactorValue.findByPk(ctx.params.recordId)
    if (record) {
        Object.assign(record, ctx.request.body)
    }
    record = await record.save()
    return ctx.body = {
        data: record
    }
}

exports.destroy = async (ctx, next) => {
    let FactorValue = global.db.models.factor_value
    let record = await FactorValue.findByPk(ctx.params.recordId)
    if (record) {
        await record.destroy()
    }
    return ctx.body = {}
}