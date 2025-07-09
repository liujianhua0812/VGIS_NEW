const {Op} = require("sequelize");

exports.index = async (ctx, next) => {
    const ModelInstance = global.db.models.model_instance
    const AttributeValue = global.db.models.attribute_value
    let instances = await ModelInstance.findAll({
        where: {
            modelId: ctx.params.modelId
        },
        include: [AttributeValue],
        order: [['instanceId', 'ASC']]
    })
    ctx.body = {
        data: instances
    }
}

exports.show = async (ctx, next) => {
    const ModelInstance = global.db.models.model_instance
    const AttributeValue = global.db.models.attribute_value
    const PID = global.db.models.pid
    const Label = global.db.models.label
    const Protocol = global.db.models.protocol
    let RuleChain = global.db.models.rule_chain
    let instance = await ModelInstance.findByPk(ctx.params.instanceId, {
        include: [AttributeValue, PID, Protocol, {
            model: ModelInstance,
            as: 'Parents'
        }, {
            model: ModelInstance,
            as: 'Children'
        }, {
            model: Label
        }]
    })

    let chainIds = instance.protocols.reduce((result, protocol) => {
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
    for(let i = 0; i < instance.protocols.length; i++) {
        let prot = instance.protocols[i].dataValues
        prot.chains = (prot.chains || "").split(",").filter(item => chains[item]).map(item => chains[item])
    }

    ctx.body = {
        data: instance
    }
}

exports.attribute = require('./attribute')

exports.series = require('./series')

exports.protocol = require('./protocol')

exports.data = require('./data')

exports.relation = require('./relation')

exports.table = require('./table')

exports.pid = require('./pid')

exports.icon = require('./icon')

exports.rule_chains = require('./rule_chains')

exports.alerts = require('./alerts')