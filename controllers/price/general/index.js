const messages = require('../../../libs/Error').messages
const {Op, Sequelize} = require("sequelize");

exports.index = async (ctx, next) => {
    let Price = global.db.models.general_energy_price

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

    if (ctx.request.query.energy) {
        if (!(ctx.request.query.energy instanceof Array)) {
            ctx.request.query.energy = [ctx.request.query.energy]
        }
        query.energy = {
            [Op.in]: ctx.request.query.energy
        }
    }

    let records = await Price.findAll({
        where: query,
        offset: (page - 1) * pagination,
        limit: pagination,
        order: [
            ["startAt", ctx.request.query.order === "DESC" ? "DESC" : "ASC"],
            ["endAt", ctx.request.query.order === "DESC" ? "DESC" : "ASC"]
        ]
    })
    let total = await Price.count({ where: query })
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

exports.create = async (ctx, next) => {
    let Price = global.db.models.general_energy_price
    let duplicate = await Price.findOne({
        where: {
            energy: ctx.request.body.energy,
            endAt: {
                [Op.or]: [{
                    [Op.gt]: ctx.request.body.startAt
                }, {
                    [Op.eq]: null
                }]
            },
            startAt: {
                [Op.or]: [{
                    [Op.lte]: ctx.request.body.endAt
                }, {
                    [Op.eq]: null
                }]
            }
        }
    })
    if (duplicate) {
        throw new Error(messages.controller.price.DUPLICATE_PRICE)
    }
    let record = await Price.create(ctx.request.body)
    return ctx.body = {
        data: record
    }
}

exports.update = async (ctx, next) => {
    let Price = global.db.models.general_energy_price
    let duplicate = await Price.findOne({
        where: {
            id: {
                [Op.ne]: ctx.params.recordId
            },
            energy: ctx.request.body.energy,
            endAt: {
                [Op.or]: [{
                    [Op.gt]: ctx.request.body.startAt
                }, {
                    [Op.eq]: null
                }]
            },
            startAt: {
                [Op.or]: [{
                    [Op.lte]: ctx.request.body.endAt
                }, {
                    [Op.eq]: null
                }]
            }
        }
    })
    if (duplicate) {
        throw new Error(messages.controller.price.DUPLICATE_PRICE)
    }
    let record = await Price.findByPk(ctx.params.recordId)
    if (record) {
        Object.assign(record, ctx.request.body)
    }
    record = await record.save()
    return ctx.body = {
        data: record
    }
}

exports.destroy = async (ctx, next) => {
    let Price = global.db.models.general_energy_price
    let record = await Price.findByPk(ctx.params.recordId)
    if (record) {
        await record.destroy()
    }
    return ctx.body = {}
}