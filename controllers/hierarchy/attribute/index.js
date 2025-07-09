const Op = require('sequelize').Op
const messages = require('../../../libs/Error').messages

/**
 * 查询Instance的Attribute
 *
 * @param {Array} instanceIds 要查询的instance id列表
 * @param {Array} labelSelectors 要查询的属性的标签列表
 * @param {Array} attributeNames 要查询的属性名列表
 * @param {boolean} singleInstance 是否只查询单个Instance
 * @return {Object} 返回值描述
 */
const query_attribute = async function (instanceIds, labelSelectors, attributeNames, singleInstance) {
    const AttributeValue = global.db.models.attribute_value
    const StaticAttribute = global.db.models.static_attribute
    const Unit = global.db.models.unit
    const ModelInstance = global.db.models.model_instance
    const Label = global.db.models.label

    const instances = await ModelInstance.findAll({
        where: {
            [Op.or]: [{
                instanceId: instanceIds
            }, {
                id: instanceIds
            }]
        },
        attributes: ["id", "name", "modelId", "instanceId"]
    })

    if (instances.length === 0) {
        throw new Error(messages.controller.shared.NOT_EXIST)
    }

    const instance = instances[0]

    let staticAttributes = await StaticAttribute.findAll(
        {
            where: {
                modelId: instance.modelId,
                name: attributeNames && attributeNames.length > 0 ? attributeNames : {[Op.ne]: null}
            },
            include: [{
                model: Label,
                where: labelSelectors && labelSelectors.length > 0 ? {name: labelSelectors} : null
            }, Unit],
            attributes: ["name", "id", "defaultValue"]
        }
    )

    let defaultAttributeMap = staticAttributes.reduce((result, attr) => {
        result[attr.id] = attr
        return result
    }, {})

    const filteredId = new Set(staticAttributes.map(item => item.id))

    let attributeValues = await AttributeValue.findAll({
        attributes: ["value", "attributeId", "instanceId"],
        where: {
            instanceId: instances.map(item => item.id),
            attributeId: Array.from(filteredId)
        },
        include: [
            {
                model: StaticAttribute,
                include: [Unit]
            }
        ]
    })

    if (singleInstance) {
        return attributeValues.map(value => ({
            name: value.static_attribute.name,
            value: value.value,
            unit: value.static_attribute.unit ? value.static_attribute.unit.name : null
        }))
    } else {
        attributeValues = attributeValues.reduce((result, record) => {
            if (!result[record.instanceId]) {
                result[record.instanceId] = {}
            }
            result[record.instanceId][record.attributeId] = record.value
            return result
        }, {})

        return instances.reduce((result, instance) => {
            result[instance.instanceId] = staticAttributes.reduce((res, attr) => {
                res[attr.name] = {
                    name: attr.name,
                    value: (attributeValues[instance.id] && (attributeValues[instance.id][attr.id] || attributeValues[instance.id][attr.id] === 0)) ? attributeValues[instance.id][attr.id] : (defaultAttributeMap[attr.id] ? defaultAttributeMap[attr.id].defaultValue : null),
                    unit: attr.unit ? attr.unit.name : null
                }
                return res
            }, {})
            return result
        }, {})
    }
}

exports.query_attribute = query_attribute

exports.index = async (ctx, next) => {
    try {
        ctx.body = {
            data: await query_attribute([ctx.params.instanceId], ctx.request.body.labelSelectors, ctx.request.body.attributeNames, true)
        }
    } catch (err) {
        console.error(err)
        throw new Error(messages.controller.hierarchy.DATA_INTERFACE_ERROR)
    }

}
