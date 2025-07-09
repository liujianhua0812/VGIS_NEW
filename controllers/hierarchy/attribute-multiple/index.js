const {messages} = require("../../../libs/Error");
const query_attribute = require('../attribute').query_attribute

exports.index = async (ctx, next) => {
    try {
        ctx.body = {
            data: await query_attribute(ctx.request.body.instanceIds, ctx.request.body.labelSelectors, ctx.request.body.attributeNames, false)
        }
    } catch (err) {
        console.error(err)
        throw new Error(messages.controller.hierarchy.DATA_INTERFACE_ERROR)
    }

}
