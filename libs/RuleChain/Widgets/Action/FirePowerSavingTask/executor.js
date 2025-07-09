const RichText = require('../../../../Richtext')

module.exports = async function (context, config, inputs = [], outputs) {
    let AlertTemplate = global.db.models.alert_template
    let Task = global.db.models.power_saving_task
    let PersonRelation = global.db.models.person_relation
    let DeviceRelation = global.db.models.device_relation

    let transaction = await global.db.transaction()
    let template = await AlertTemplate.findByPk(config.templateId, {
        include: [PersonRelation, DeviceRelation],
        transaction
    })

    let input = inputs[0]

    let result = null, error = null

    if (template) {
        if (config.test) {
             result = {
                name: template.name,
                level: template.level,
                color: template.color,
                subject: RichText.composeDefault(template.subject, context),
                content: RichText.composeDefault(template.template, context),
                checked: false,
                checkedBy: null,
                instanceId: context.instance.id
            }
        }
        else {
            result = await Task.create({
                description: RichText.composeDefault(template.template, context),
                status: "pending",
                module: config.module,
            }, {
                transaction
            })
            if (template.person_relations.length > 0) {
                await PersonRelation.bulkCreate(template.person_relations.map(item => ({
                    userId: item.userId,
                    psTaskId: result.id
                })), {
                    transaction
                })
            }
            if (template.device_relations.length > 0) {
                await DeviceRelation.bulkCreate(template.device_relations.map(item => ({
                    instanceId: item.instanceId,
                    psTaskId: result.id
                })), {
                    transaction
                })
            }

            try {
                await transaction.commit()
            }
            catch (err) {
                await transaction.rollback()
                error = err.message
            }
        }
    }
    else {
        error = "INVALID_TEMPLATE"
    }
    for(let i = 0; i < outputs.length; i++) {
        outputs[i].result = input
    }
    return {
        input,
        result,
        canceled: false,
        error: error
    }
}