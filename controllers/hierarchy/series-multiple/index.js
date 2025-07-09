let querySeries = require('../series').querySeries
let messages = require('../../../libs/Error').messages

exports.show = async (ctx, next) => {
    try {
        ctx.request.body.order = "DESC"
        ctx.request.body.startAt = new Date(0)
        ctx.request.body.endAt = ctx.request.body.before ? ctx.request.body.before : new Date()
        ctx.body = {
            data: await querySeries(ctx, true, false)
        }
    } catch (err) {
        console.error(err)
        throw new Error(messages.controller.hierarchy.DATA_INTERFACE_ERROR)
    }
}

exports.index = async (ctx, next) => {
    try {
        ctx.body = {
            data: await querySeries(ctx, false, false)
        }
    } catch (err) {
        console.error(err)
        throw new Error(messages.controller.hierarchy.DATA_INTERFACE_ERROR)
    }
}
