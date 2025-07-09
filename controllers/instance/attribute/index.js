exports.index = async (ctx, next) => {
    let AttributeValue = global.db.models.attribute_value
    let attributes =  await AttributeValue.findAll({
        where: {
            instanceId: ctx.params.instanceId
        }
    })
    ctx.body = {
        data: attributes
    }
}

exports.update = async (ctx, next) => {
    let AttributeValue = global.db.models.attribute_value
    let ModelInstance = global.db.models.model_instance
    let instance = await ModelInstance.findByPk(ctx.params.instanceId)
    // TODO: 这里应该能够清空数值，并进行数值校验
    let attribute =  await AttributeValue.findOne({
        where: {
            instanceId: ctx.params.instanceId,
            attributeId: ctx.params.attributeId,
        }
    })
    if (attribute) {
        attribute.value = ctx.request.body.value
        attribute = await attribute.save()
    }
    else {
        attribute = await AttributeValue.create({
            instanceId: ctx.params.instanceId,
            attributeId: ctx.params.attributeId,
            value: ctx.request.body.value
        })
    }
    instance.updatedAt = new Date()
    await instance.save()
    ctx.body = {
        data: attribute
    }
}

exports.destroy = async (ctx, next) => {
    let AttributeValue = global.db.models.attribute_value
    await AttributeValue.destroy({
        where: {
            instanceId: ctx.params.instanceId,
            attributeId: ctx.params.attributeId,
        }
    })
    ctx.body = {}
}
