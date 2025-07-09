
exports.index = async (ctx, next) => {
    let RuleChain = global.db.models.rule_chain
    let chains = await RuleChain.findAll({
        where: {
            modelId: ctx.params.modelId
        }
    })
    ctx.body = {
        data: chains
    }
}