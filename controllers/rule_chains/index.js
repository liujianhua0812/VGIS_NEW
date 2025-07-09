
let executor = require('../../libs/RuleChain/Widgets/executor')

exports.index = async (ctx, next) => {

}

exports.show = async (ctx, next) => {
    let RuleChain = global.db.models.rule_chain
    let chain = await RuleChain.findByPk(ctx.params.chainId)
    ctx.body = {
        data: chain
    }
}

exports.create = async (ctx, next) => {
    let RuleChain = global.db.models.rule_chain
    let chain = await RuleChain.create(ctx.request.body)
    ctx.body = {
        data: chain
    }
}

exports.test = async (ctx, next) => {
    let RuleChain = global.db.models.rule_chain
    let chain = ctx.request.body.chain.drawflow.Home.data

    let context = ctx.request.body.data
    let data = ctx.request.body.data.data
    let contentType = ctx.request.body.data.contentType

    if (contentType === "application/json") {
        try {
            data = JSON.parse(data)
        }
        catch (err) {}
    }

    let result = await executor(context, chain, data, true)
    ctx.body = {
        data: result
    }
}

exports.update = async (ctx, next) => {
    let RuleChain = global.db.models.rule_chain
    let chain = await RuleChain.findByPk(ctx.params.chainId)
    Object.assign(chain, ctx.request.body)
    chain = await chain.save()
    ctx.body = {
        data: chain
    }
}

exports.destroy = async (ctx, next) => {
    let RuleChain = global.db.models.rule_chain
    let chain = await RuleChain.findByPk(ctx.params.chainId)
    await chain.destroy()
    ctx.body = {}
}