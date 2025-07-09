const ModbusProtocolType = require('../../../libs/ProtocolManager').ModbusProtocolType
const Op = require('sequelize').Op

exports.index = async (ctx, next) => {
    let Protocol = global.db.models.protocol
    let RuleChain = global.db.models.rule_chain
    let protocols = await Protocol.findAll({
        where: {
            instanceId: ctx.params.instanceId
        }
    })
    let chainIds = protocols.reduce((result, protocol) => {
        let chains = protocol.chains || ""
        return result.concat(chains.split(","))
    }, [])
    let chains = await RuleChain.findAll({
        where: {
            id: {
                [Op.in]: chainIds
            }
        },
        attributes: ["id", "name", "instanceId", "modelId", "description"]
    })
    chains = chains.reduce((result, item) => {
        result[item.id] = item
        return result
    }, {})
    for(let i = 0; i < protocols.length; i++) {
        let prot = protocols[i].dataValues
        prot.chains = (prot.chains || "").split(",").filter(item => chains[item]).map(item => chains[item])
    }
    ctx.body = {
        data: protocols
    }
}

exports.test = async (ctx, next) => {
    let Protocol = global.db.models.protocol
    let protocol = null
    if (ctx.params.protocolId) {
        protocol = await Protocol.findByPk(ctx.params.protocolId)
    }
    else {
        protocol = ctx.request.body
    }
    let result = await global.peripheralManager.testConnection(
        ModbusProtocolType[protocol.protocolType.replace(' ', '')],
        protocol.configuration
    )
    ctx.body = {
        data: result
    }
}

exports.create = async (ctx, next) => {
    let Protocol = global.db.models.protocol
    let protocol = await Protocol.create(Object.assign({}, ctx.params, ctx.request.body))
    ctx.body = {
        data: protocol
    }
}

exports.update = async (ctx, next) => {
    let Protocol = global.db.models.protocol
    let protocol = await Protocol.findByPk(ctx.params.protocolId)
    delete ctx.request.body.configurationStr
    Object.assign(protocol, ctx.request.body)
    if (ctx.request.body.chains) {
        protocol.chains = ctx.request.body.chains.join(",")
    }
    await protocol.save()
    ctx.body = {
        data: {}
    }
}

exports.destroy = async (ctx, next) => {
    let Protocol = global.db.models.protocol
    let protocol = await Protocol.findByPk(ctx.params.protocolId)
    await protocol.destroy()
    ctx.body = {
        data: {}
    }
}
