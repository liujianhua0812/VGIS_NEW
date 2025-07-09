const {messages} = require("../../../libs/Error");
const Op = require('sequelize').Op
const {rsaPrivateDecrypt} = require("../../../libs/SecurityUtil")
const executor = require("../../../libs/RuleChain/Widgets/executor")
const Meta = require('../../../database/models/series_value_metas')

const checkActiveSecurityPostAction = async (instanceId, args, protocolType, protocolName) => {
    let protocol = await global.db.models.protocol.findOne({
        where: {
            instanceId: instanceId,
            isInterface: true,
            protocolType: protocolType,
            name: protocolName,
            isActive: true
        }

    })

    if (protocol) {
        //if protocol is active
        if(protocol.configuration.security){
            //if enable security
            try {
                const decrypted = rsaPrivateDecrypt(protocol.configuration.privateKey, args.token);
                if(decrypted !== instanceId){
                    console.log(`Security Validation failed for ${instanceId} protocolType ${protocolType} ${protocolName}`)
                    return [false, null, null]
                }else{
                    console.log("Security Validation Pass")
                }
            }catch (err){
                console.log(`Error in security validation for ${instanceId} protocolType ${protocolType} ${protocolName}`, err)
                return [false, null, null]
            }
        }

        //post action on args
        if(protocol.postAction){
            try {
                let postFunction = new Function("return " + protocol.postAction)
                return [true, postFunction()(args), protocol];
            } catch (err) {
                console.log(`Error in post action for ${instanceId}`, err)
                return [true, args, protocol]
            }
        }else{
            // console.log(`Not found valid post action for ${instanceId}`)
            return [true, args, protocol]
        }
    } else {
        console.log(`Not found valid protocol for ${instanceId} protocolType ${protocolType} ${protocolName}`)
        return [false, null, null];
    }
}

const executeChains = async (context, chains, data) =>{
    let ruleChains = await global.db.models.rule_chain.findAll({
        where:{
            id: chains
        }
    })
    ruleChains.map(chain => {
        try {
            executor(context, chain.configuration.drawflow.Home.data, data)
        } catch (err) {
            console.log("Error in rule chain executor\n", err)
        }
    })
}

const updateInstanceAttributes = async (instanceId, paramsBodyParams, protocolType) => {
    try {
        let [isActive, paramsBody, protocol] = await checkActiveSecurityPostAction(instanceId, paramsBodyParams, protocolType, 'Attribute')
        if(!isActive){
            return "Not found valid protocol"
        }
        const ModelInstance = global.db.models.model_instance
        const StaticAttribute = global.db.models.static_attribute
        const AttributeValue = global.db.models.attribute_value
        const modelInstance = await ModelInstance.findOne({
            where: {
                [Op.or]: [{instanceId: instanceId}, {id: instanceId}]
            }
        })

        const validAttributes = await StaticAttribute.findAll({
            where: {
                modelId: modelInstance.modelId,
                name: {
                    [Op.in]: Object.keys(paramsBody)
                }
            }
        })

        let validAttributesMap = {}
        validAttributes.map(validAttribute => {
            validAttributesMap[validAttribute.name] = validAttribute.id
        })

        //execute chains
        const context = {
            instance: modelInstance,
            data: paramsBody
        }
        // console.log(context.data)
        await executeChains(context, protocol.chains, paramsBody)

        let result = {}
        //let records = []
        for (let staticAttributeName in paramsBody) {
            if (staticAttributeName in validAttributesMap) {
                //valid attribute name
                const attributeId = validAttributesMap[staticAttributeName]

                let [attribute_value, created] = await AttributeValue.findOrCreate({
                    where: {
                        instanceId: modelInstance.id,
                        attributeId: attributeId
                    },
                    defaults: {
                        value: paramsBody[staticAttributeName]
                    }
                })

                if (!created) {
                    Object.assign(attribute_value, {
                        instanceId: modelInstance.id,
                        attributeId,
                        value: paramsBody[staticAttributeName]
                    })
                    await attribute_value.save()
                    result[staticAttributeName] = {code: 1, msg: "Update successfully"}
                } else {
                    result[staticAttributeName] = {code: 1, msg: "Create successfully"}
                }
            } else {
                result[staticAttributeName] = {code: -1, msg: "Invalid Attribute Name"}
            }
        }
        return result
    } catch (err) {
        console.error(err)
        throw new Error(messages.controller.instance.DATA_INTERFACE_ERROR)
    }
}

exports.updateInstanceAttributes = updateInstanceAttributes
exports.attributesHTTP = async (ctx, next) => {
    ctx.body = {
        data: await updateInstanceAttributes(ctx.params.instanceId, ctx.request.body, 'HTTP')
    }
    return next()
}
exports.attributesCoAP = async (ctx, next) => {
    ctx.body = {
        data: await updateInstanceAttributes(ctx.params.instanceId, ctx.request.body, 'CoAP')
    }
    return next()
}

const updateInstanceSeries = async (instanceId, requestBodyParams, protocolType) => {
    try {
        let [isActive, requestBody, protocol] = await checkActiveSecurityPostAction(instanceId, requestBodyParams, protocolType, 'Series')
        if(!isActive){
            return "Not found valid protocol"
        }

        let paramsBody = {}

        try {
            requestBody.data.map(e => {
                if (!e.time) {
                    paramsBody[e.name] = {value: e.value, time: new Date()}
                } else {
                    paramsBody[e.name] = {value: e.value, time: new Date(e.time)}
                }
            })
        }
        catch (err) {
            throw new Error("Invalid MQTT Message")
        }

        const ModelInstance = global.db.models.model_instance
        const TimeSeries = global.db.models.time_series
        const modelInstance = await ModelInstance.findOne({
            where: {
                [Op.or]: [{instanceId: instanceId}, {id: instanceId}]
            }
        })
        const SeriesValue = global.db.models[Meta.getTableId(modelInstance.modelId)]

        const validTimeSeries = await TimeSeries.findAll({
            where: {
                modelId: modelInstance.modelId,
                name: {
                    [Op.in]: Object.keys(paramsBody)
                }
            }
        })

        let validTimeSeriesMap = {}
        validTimeSeries.map(timeSeries => {
            validTimeSeriesMap[timeSeries.name] = timeSeries.id
        })

        let result = {}
        let records = []
        for (let name in paramsBody) {
            if (name in validTimeSeriesMap) {
                const seriesId = validTimeSeriesMap[name]
                records.push({
                    seriesId: seriesId,
                    instanceId: modelInstance.id,
                    time: paramsBody[name].time,
                    value: paramsBody[name].value
                })

                result[name] = {code: 1, msg: "Update successfully"}
            } else {
                result[name] = {code: -1, msg: "Invalid Series Name"}
            }
        }

        //execute chains
        const context = {
            instance: modelInstance,
            data: requestBody.data
        }
        await executeChains(context, protocol.chains, requestBody.data)

        await SeriesValue.bulkCreate(records, {
            updateOnDuplicate: ['value', 'time'],
            returning: true
        })

        return result

    } catch (err) {
        console.error(err)
        throw new Error(messages.controller.instance.DATA_INTERFACE_ERROR)
    }
}

exports.updateInstanceSeries = updateInstanceSeries
exports.seriesHTTP = async (ctx, next) => {
    ctx.body = {
        data: await updateInstanceSeries(ctx.params.instanceId, ctx.request.body, 'HTTP')
    }
    return next()
}
exports.seriesCoAP = async (ctx, next) => {
    ctx.body = {
        data: await updateInstanceSeries(ctx.params.instanceId, ctx.request.body, 'CoAP')
    }
    return next()
}

exports.updateSeries = async (instanceId, seriesId, value, protocolId) => {
    let protocol = await global.db.models.protocol.findOne({
        where: {
            id: protocolId
        }
    })

    const modelInstance = await global.db.models.model_instance.findOne({
        where: {
            [Op.or]: [{
                instanceId: instanceId
            }, {
                id: instanceId
            }]
        }
    })

    const timeSeries = await global.db.models.time_series.findOne({
        where: {
            id: seriesId
        }
    })

    //execute rule chain
    const context = {
        instance: modelInstance,
        data: [{
            name: timeSeries.name,
            value: value
        }]
    }
    await executeChains(context, protocol.chains, context.data)

    //写入数据库
    const SeriesValue = global.db.models[Meta.getTableId(modelInstance.modelId)]
    SeriesValue.create({
        seriesId,
        instanceId,
        time: new Date(),
        value: value
    }).then(value => {
        console.log(value.dataValues)
    })
}