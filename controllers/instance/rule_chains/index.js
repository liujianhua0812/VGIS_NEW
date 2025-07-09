
exports.index = async (ctx, next) => {
    let Instance = global.db.models.model_instance
    let Model = global.db.models.model
    let RuleChain = global.db.models.rule_chain
    let instance = await Instance.findByPk(ctx.params.instanceId)
    let modelChains = await RuleChain.findAll({
        where: {
            modelId: instance.modelId
        }
    })
    let instanceChains = await RuleChain.findAll({
        where: {
            instanceId: instance.id
        }
    })
    ctx.body = {
        data: modelChains.concat(instanceChains)
    }
}