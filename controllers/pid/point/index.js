const {Op} = require("sequelize");
const executor = require("../../../libs/RuleChain/Widgets/executor");
const encrypt = require("../../../libs/encrypt");
const messages = require('../../../libs/Error').messages

exports.index = async (ctx, next) => {
    let Point = global.db.models.pid_anchor_point
    let pid = await Point.findAll({
        where: {
            diagramId: ctx.params.diagramId
        }
    })
    ctx.body = {
        data: pid
    }
}

exports.execute = async (ctx, next) => {
    let Point = global.db.models.pid_anchor_point
    let Instance = global.db.models.model_instance
    let Model = global.db.models.model
    let RuleChain = global.db.models.rule_chain
    let point = await Point.findByPk(ctx.params.pointId)
    if (point.type === "control") {
        let config = point.configuration
        if (config.validator === "password" && !encrypt.validatePassword(config.encryptedPassword, ctx.request.body.password)) {
            throw new Error(messages.controller.pid.INVALID_PASSWORD)
        }
        let instance = await Instance.findByPk(point.configuration.instance, {
            include: [Model]
        })
        let chain = await RuleChain.findOne({
            where: {
                id: point.configuration.chain
            }
        })
        if (chain && instance) {
            let context = {
                instance,
                data: {}
            }
            let data = {}

            let result = await executor(context, chain.configuration.drawflow.Home.data, data, false)
        }
    }
    return ctx.body = {
        data: {}
    }
}