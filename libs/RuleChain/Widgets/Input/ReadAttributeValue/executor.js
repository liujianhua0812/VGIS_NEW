
module.exports =  async function (context = {}, config, inputs = [], outputs) {
    let input = inputs[0]
    let AttributeValue = global.db.models.attribute_value
    let StaticAttribute = global.db.models.static_attribute

    let value = await AttributeValue.findOne({
        where: {
            instanceId: config.instance,
            attributeId: config.attribute[1]
        }
    })

    let attribute = await StaticAttribute.findOne({
        where: {
            id: config.attribute[1],
            modelId: config.attribute[0]
        }
    })

    let result = null
    if (value && value.value) {
        result = value.value
    }
    else if (attribute.defaultValue) {
        result = attribute.defaultValue
    }

    if (result) {
        if (attribute.dataType === "Integer") {
            result = parseInt(result)
        }
        if (attribute.dataType === "Decimal") {
            result = parseFloat(result)
        }
        if (["Date", "Time", "DateTime"].includes(attribute.dataType)) {
            result = new Date(result)
        }
    }

    for(let i = 0; i < outputs.length; i++) {
        outputs[i].result = result
    }
    return {
        input,
        result: input,
        canceled: false,
        error: null
    }
}