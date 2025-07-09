const { Op } = require('sequelize')

exports.show = async (ctx, next) => {
    const ModelInstance = global.db.models.model_instance
    const Model = global.db.models.model
    let instance = await ModelInstance.findOne({
        where: {
            [Op.or]: [{
                id: ctx.params.instanceId
            }, {
                instanceId: ctx.params.instanceId
            }]
        },
        include: [Model]
    })
    let icon = instance.model.icon
    ctx.body = icon
}