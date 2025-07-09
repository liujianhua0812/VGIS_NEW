const messages = require('../../../libs/Error').messages
const {Op, Sequelize} = require("sequelize");

exports.index = async (ctx, next) => {
    let Price = global.db.models.electricity_price

    let page = parseInt(ctx.request.query.page)
    let pagination = parseInt(ctx.request.query.pagination)
    page = isNaN(page) ? 1 : page
    pagination = isNaN(pagination) ? 10 : pagination

    let records = await Price.findAll({
        offset: (page - 1) * pagination,
        limit: pagination,
        order: [
            ["month", "DESC"]
        ]
    })
    let total = await Price.count({})
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

exports.update = async (ctx, next) => {
    let Price = global.db.models.electricity_price
    let record = await Price.findOne({
        where: {
            month: ctx.request.body.month
        }
    })
    if (record) {
        Object.assign(record, ctx.request.body)
        record = await record.save()
    }
    else {
        record = await Price.create(ctx.request.body)
    }
    return ctx.body = {
        data: record
    }
}

exports.destroy = async (ctx, next) => {
    let Price = global.db.models.electricity_price
    let record = await Price.findByPk(ctx.params.recordId)
    if (record) {
        await record.destroy()
    }
    return ctx.body = {}
}