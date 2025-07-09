const Op = require('sequelize').Op

exports.index = async (ctx, next) => {
    const ModelRelation = global.db.models.model_relation
    const Model = global.db.models.model
    const model = await Model.findByPk(ctx.params.modelId, {
        include: [{
            model: Model,
            as: 'Targets'
        }]
    })
    ctx.body = {
        data: model.Targets
    }
}

exports.create = async (ctx, next) => {
    const ModelRelation = global.db.models.model_relation
    let relation = await ModelRelation.findOne({
        where: {
            sourceId: ctx.params.modelId,
            targetId: ctx.request.body.targetId
        }
    })
    if (!relation) {
        relation = await ModelRelation.create(Object.assign(ctx.request.body, ctx.params))
    }
    ctx.body = {
        data: {}
    }
}

exports.update = async (ctx, next) => {
    const Model = global.db.models.model
    let model = await Model.findByPk(ctx.params.relationId)
    Object.assign(model, ctx.request.body)
    if (ctx.request.body.groupId === 'null') {
        model.groupId = null
    }
    model = await model.save()
    ctx.body = {
        data: model
    }
}

exports.destroy = async (ctx, next) => {
    const ModelRelation = global.db.models.model_relation
    let relation = await ModelRelation.findByPk(ctx.params.relationId)
    await relation.destroy()
    ctx.body = {
        data: {}
    }
}
