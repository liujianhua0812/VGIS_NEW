const Sequelize = require('sequelize')
const executor = require("../../../libs/RuleChain/Widgets/executor");
const Op = Sequelize.Op

exports.index = async (ctx, next) => {
    let Alert = global.db.models.alert
    let Instance = global.db.models.model_instance
    let Relation = global.db.models.instance_relation
    let instance = await Instance.findOne({
        where: {
            [Op.or]: [{
                id: ctx.params.instanceId
            }, {
                instanceId: ctx.params.instanceId
            }]
        }
    })
    let relations = await Relation.findAll()
    let childrenMap = relations.reduce((result, relation) => {
        if (!result[relation.parentId]) {
            result[relation.parentId] = []
        }
        result[relation.parentId].push(relation.childId)
        return result
    }, {})

    function getSubtree(node) {
        let result = [node]
        if (childrenMap[node]) {
            for(let i = 0; i <childrenMap[node].length; i++) {
                result = result.concat(getSubtree(childrenMap[node][i]))
            }
        }
        return result
    }

    if (!instance) {
        throw new Error("")
    }
    let instances = getSubtree(instance.id)

    console.log(instances)
    let alerts = await Alert.findAll({
        where: {
            instanceId: {
                [Op.in]: instances
            }
        },
        order: [["createdAt", "DESC"]]
    })
    ctx.body = {
        data: alerts
    }
}

exports.update = async (ctx, next) => {
    let Alert = global.db.models.alert
    let alert = await Alert.findOne({
        where: {
            id: ctx.params.alertId,
            instanceId: ctx.params.instanceId,
        }
    })
    alert.checked = true
    alert.checkedBy = ctx.session.current_user.id
    await alertChains(alert.templateId)
    await alert.save()
    ctx.body = {}
}

const alertChains = async (alertTemplateId)=>{
    if(!alertTemplateId) return;
    let template = await global.db.models.alert_template.findOne({
        where: {
            id: alertTemplateId
        }
    })

    let ruleChains = await global.db.models.rule_chain.findAll({
        where:{
            id: template.chains
        }
    })
    ruleChains.map(chain => {
        console.log("Executing...")
        try {
            executor(null, chain.configuration.drawflow.Home.data, {})
        } catch (err) {
            console.log("Error in rule chain executor\n", err)
        }
    })
}

exports.destroy = async (ctx, next) => {
    let AlertTemplate = global.db.models.alert_template
    let template = await AlertTemplate.findOne({
        where: {
            id: ctx.params.templateId,
            modelId: ctx.params.modelId,
        }
    })
    await template.destroy()
    ctx.body = {}
}