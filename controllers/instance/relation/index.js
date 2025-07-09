

exports.index = async (ctx, next) => {
    let Instance = global.db.models.model_instance
    let relation = await Instance.findByPk(ctx.params.instanceId, {
        include: [{
            model: Instance,
            as: 'Parents'
        }, {
            model: Instance,
            as: 'Children'
        }]
    })
    ctx.body = {
        data: relation
    }
}

exports.create = async (ctx, next) => {
    let Model = global.db.models.model
    let Instance = global.db.models.model_instance
    let Relation = global.db.models.instance_relation
    let instance = await Instance.findByPk(ctx.params.instanceId)
    let model = await Model.findByPk(instance.modelId, {
        include: [{
            model: Model,
            as: 'Targets'
        }, {
            model: Model,
            as: 'Sources'
        }]
    })
    let parentIds = [], childrenIds = []
    for(let i = 0; i < model.Targets.length; i++) {
        let target = model.Targets[i]
        if (ctx.request.body.relations[target.id]) {
            if (target.model_relation.relationType === 'Contain') {
                childrenIds = childrenIds.concat(ctx.request.body.relations[target.id])
            }
            else {
                parentIds = parentIds.concat(ctx.request.body.relations[target.id])
            }
        }
    }
    await Relation.bulkCreate(parentIds.map(id => ({
        parentId: id,
        childId: instance.id
    })).concat(childrenIds.map(id => ({
        parentId: instance.id,
        childId: id
    }))))
    instance.updatedAt = new Date()
    await instance.save()
    ctx.body = {}
}

exports.destroy = async (ctx, next) => {
    let Instance = global.db.models.model_instance
    let Relation = global.db.models.instance_relation
    let relation = await Relation.findByPk(ctx.params.relationId)
    let parent = await Instance.findByPk(relation.parentId)
    let child = await Instance.findByPk(relation.childId)
    parent.updatedAt = child.updatedAt = new Date()
    await parent.save()
    await child.save()
    await relation.destroy()
    ctx.body = {}
}
