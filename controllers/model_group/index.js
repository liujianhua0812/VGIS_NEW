const messages = require('../../libs/Error').messages

exports.create = async (ctx, next) => {
    const ModelGroup = global.db.models.model_group
    let exist = await ModelGroup.findOne({
        where: {
            name: ctx.request.body.name,
            groupId: ctx.request.body.groupId || null
        }
    })
    if (!exist) {
        let group = await ModelGroup.create(ctx.request.body)
        ctx.body = {
            data: group
        }
    }
    else {
        throw new Error(messages.database.model_group.DUPLICATE_GROUP)
    }
}

exports.update = async (ctx, next) => {
    const ModelGroup = global.db.models.model_group
    let group = await ModelGroup.findByPk(ctx.params.groupId)
    let oldName = group.name
    Object.assign(group, ctx.request.body)
    if (ctx.request.body.groupId === 'null') {
        model.groupId = null
    }
    let exist = await ModelGroup.findOne({
        where: {
            name: ctx.request.body.name,
            groupId: ctx.request.body.groupId || null
        }
    })
    if (!exist) {
        group = await group.save()
        ctx.body = {
            data: group
        }
    }
    else {
        throw new Error(messages.database.model_group.DUPLICATE_GROUP)
    }
}

exports.destroy = async (ctx, next) => {
    const ModelGroup = global.db.models.model_group
    let group = await ModelGroup.findByPk(ctx.params.groupId)
    await group.destroy()
    ctx.body = {
        data: {}
    }
}
