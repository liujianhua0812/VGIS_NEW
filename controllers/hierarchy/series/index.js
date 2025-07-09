const Sequelize = require('sequelize')
const VirtualSeriesCalculator = require("../../../libs/VirtualSeriesCalculator");
const Op = Sequelize.Op
const messages = require('../../../libs/Error').messages
const Meta = require("../../../database/models/series_value_metas");

function
aggregate_array(arr, method) {
    if (!method) {
        return arr[0].data
    } else if (method === 'sum') {
        arr = arr.map(e => Number(e.data))
        return arr.reduce((partialSum, a) => partialSum + a, 0);
    } else if (method === 'max') {
        arr = arr.map(e => Number(e.data))
        return Math.max(...arr);
    } else if (method === 'min') {
        arr = arr.map(e => Number(e.data))
        return Math.min(...arr)
    } else if (method === 'avg') {
        arr = arr.map(e => Number(e.data))
        return arr.reduce((partialSum, a) => partialSum + a, 0) / arr.length;
    } else if (method === 'latest') {
        let latest_v = arr[0].data, latest_time = new Date(arr[0].time)
        arr.map(e => {
            if (new Date(e.time) > latest_time) {
                latest_time = new Date(e.time)
                latest_v = e.data
            }
        })
        return latest_v
    } else if (method === 'earliest') {
        let earliest_v = arr[0].data, earliest_time = new Date(arr[0].time)
        arr.map(e => {
            if (new Date(e.time) < earliest_time) {
                earliest_time = new Date(e.time)
                earliest_v = e.data
            }
        })
        return earliest_v
    } else {
        console.error("Aggregate function is not supported!")
        throw new Error(messages.controller.hierarchy.DATA_INTERFACE_ERROR)
    }
}

/**
 * 获得特定instance的特定一组series在特定时间范围内的取值
 * 支持按照时间聚合，以及指定聚合方式
 * @param ctx
 * @param {boolean} latest 是否查询最新series数据
 * @param {boolean} singleInstance 是否只查询单个 instance 的结果
 * @returns {Promise<{}>}
 */
// 升级思路：拆分汇算SeriesValues和分组的工作，两部分独立进行，节省掉目前的大循环
let querySeries = async function (ctx, latest, singleInstance) {
    const Model = global.db.models.model
    const ModelInstance = global.db.models.model_instance
    const StaticAttribute = global.db.models.static_attribute
    const AttributeValue = global.db.models.attribute_value
    const TimeSeries = global.db.models.time_series
    const InstanceRelation = global.db.models.instance_relation
    const InstanceTimeSeries = global.db.models.instance_time_series
    const Unit = global.db.models.unit

    let startAt = new Date(ctx.request.body.startAt)
    let endAt = new Date(ctx.request.body.endAt)

    if (isNaN(startAt.getTime())) {
        startAt = new Date(0)
    }

    if (isNaN(endAt.getTime())) {
        endAt = null
    }


    let timeFilter = {
        [Op.gte]: startAt
    }
    if (endAt) {
        timeFilter[Op.lte] = endAt
    }
    ctx.request.body.instanceIds = ctx.request.body.instanceIds.map(item => decodeURIComponent(item))
    // 一次性取回所有的instance
    let instances = await ModelInstance.findAll({
        where: {
            [Op.or]: [
                {
                    instanceId: ctx.request.body.instanceIds
                },
                {
                    id: ctx.request.body.instanceIds
                },
                {
                    name: ctx.request.body.instanceIds
                }
            ]
        },
        include: [{
            model: InstanceTimeSeries,
            include: [TimeSeries]
        }]
    })

    let relations = await InstanceRelation.findAll({
        where: {}
    })

    let allSeries = await TimeSeries.findAll({
        where: {}
    })

    let allInstances = await ModelInstance.findAll({
        where: {},
        include: [Model]
    })

    let allAttributes = await StaticAttribute.findAll({
        where: {}
    })

    let instanceModelMap = allInstances.reduce((result, item) => {
        if (!result[item.modelId]) {
            result[item.modelId] = []
        }
        result[item.modelId].push(item.id)
        return result
    }, {})

    let result = {}
    let instanceMap = instances.reduce((result, instance) => {
        result[instance.id] = instance
        return result
    }, {})

    let series = await TimeSeries.findAll({
        where: {
            modelId: instances.map(item => item.modelId),
            [Op.or]: [
                {
                    name: ctx.request.body.seriesNames
                },
                {
                    id: ctx.request.body.seriesNames
                }
            ]
        },
        include: [Unit]
    })

    // modelMap用来记录目标点位的配置项目，可作为下面计算点位的计算参考
    let modelMap = series.reduce((result, sery) => {
        if (!result[sery.modelId]) {
            result[sery.modelId] = {}
        }
        result[sery.modelId][sery.id] = sery
        return result
    }, {})

    // 拼凑出需要的数据结构
    for (let i = 0; i < instances.length; i++) {
        let instance = instances[i]
        let group = modelMap[instance.modelId]
        result[instance.id] = Object.values(group).reduce((result, sery) => {
            result[sery.id] = {
                name: sery.name,
                unit: sery.unit ? sery.unit.name : null,
                values: []
            }
            return result
        }, {})
    }

    let instanceIds = instances.map(item => item.id)
    let seriesIds = series.map(item => item.id)

    // 一次性取回所有的value
    //time聚合参数
    const timeScale = ctx.request.body.aggregation ? Sequelize.fn('date_trunc', ctx.request.body.aggregation, Sequelize.col('time')) : 'time'

    /** 使用json_object_agg获取，在聚合的时间范围内的，时间和日期数值集合 e.g.
     * 查询语句：
     * SELECT date_trunc('week', "time") AS "timestamp",
     * json_object_agg("time", "value"),
     * "seriesId",
     * "instanceId"
     * FROM "series_values" AS "series_value"
     * WHERE "series_value"."instanceId" IN ('76dfb3a4-c1dd-4987-908f-6a6e56daf1aa')
     * AND "series_value"."seriesId" IN ('9aad7e1f-86c1-47bc-9f74-d78291a7ee68')
     * AND "series_value"."time" BETWEEN '1970-01-01 08:00:00.000 +08:00' AND '2023-05-22 17:15:05.962 +08:00'
     * GROUP BY "instanceId", "seriesId", "timestamp"
     * ORDER BY "timestamp" DESC;
     * 查询结果：
     * "2022-12-12 00:00:00+08"    "{ ""2022-12-18T08:00:00+08:00"" : ""24"", ""2022-12-17T08:00:00+08:00"" : ""24"", ""2022-12-16T08:00:00+08:00"" : ""24"" }"    "9aad7e1f-86c1-47bc-9f74-d78291a7ee68"
     * "2022-10-17 00:00:00+08"    "{ ""2022-10-17T08:00:00+08:00"" : ""24"", ""2022-10-19T08:00:00+08:00"" : ""24"", ""2022-10-18T08:00:00+08:00"" : ""24"" }"    "9aad7e1f-86c1-47bc-9f74-d78291a7ee68"
     * "2022-10-10 00:00:00+08"    "{ ""2022-10-16T08:00:00+08:00"" : ""24"", ""2022-10-14T08:00:00+08:00"" : ""24"", ""2022-10-15T08:00:00+08:00"" : ""24"" }"    "9aad7e1f-86c1-47bc-9f74-d78291a7ee68"
     */
    const valueScale = Sequelize.fn('json_object_agg', Sequelize.col('time'), Sequelize.col('value'))

    let values = []
    if (ctx.request.body.aggregation) {
        for(let modelId in modelMap) {
            let SeriesValue = global.db.models[Meta.getTableId(modelId)]
            values = values.concat(await SeriesValue.findAll({
                where: {
                    instanceId: instanceIds,
                    seriesId: Object.keys(modelMap[modelId]),
                    time: timeFilter
                },
                attributes: [
                    [timeScale, 'timestamp'],
                    [valueScale, 'value'],
                    "seriesId",
                    "instanceId"
                ],
                order: [
                    [timeScale, ctx.request.body.order ? ctx.request.body.order : 'DESC']
                ],
                group: ['instanceId', 'seriesId', 'timestamp'],
                limit: ctx.request.body.limit,
                offset: ctx.request.body.offset
            }))
        }
    }
    else {
        for(let modelId in modelMap) {
            let SeriesValue = global.db.models[Meta.getTableId(modelId)]
            values = values.concat(await SeriesValue.findAll({
                where: {
                    instanceId: instanceIds,
                    seriesId: Object.keys(modelMap[modelId]),
                    time: timeFilter
                },
                attributes: [
                    "id",
                    ["time", "timestamp"],
                    "value",
                    "seriesId",
                    "instanceId"
                ],
                order: [
                    [timeScale, ctx.request.body.order ? ctx.request.body.order : 'DESC']
                ],
                limit: ctx.request.body.limit,
                offset: ctx.request.body.offset
            }))
        }
    }

    for (let i = 0; i < values.length; i++) {
        let value = values[i]

        let seriesValuesArray = []
        if (ctx.request.body.aggregation) {
            for (let key in value.value) {
                if (value.value.hasOwnProperty(key)) {
                    seriesValuesArray.push( {data: value.value[key], time: key} );
                }
            }
        }
        result[value.instanceId][value.seriesId].values.push({
            id: value.id,
            value: ctx.request.body.aggregation ? aggregate_array(seriesValuesArray, ctx.request.body.method) : value.value,
            time: value.dataValues.timestamp
        })
    }

    let dependencyGraph = VirtualSeriesCalculator.ConstructGraph(allSeries, allAttributes, allInstances, relations)

    let referencedSeries = [], referencedAttributes = []

    for(let i = 0; i < series.length; i++) {
        for (let j = 0; j < instances.length; j++) {
            let dependencies = VirtualSeriesCalculator.GetDependenciesFromGraph(dependencyGraph, series[i], instances[j])
            referencedAttributes = referencedAttributes.concat(dependencies.filter(item => item.slice(0, 9) === "attribute"))
            referencedSeries = referencedSeries.concat(dependencies.filter(item => item.slice(0, 6) === "series"))
        }
    }

    let _referencedSeries = await TimeSeries.findAll({
        where: {
            id: {
                [Op.in]: referencedSeries.map(item => item.split("@")[1])
            }
        }
    })

    let referencesModelMap = _referencedSeries.reduce((result, sery) => {
        if (!result[sery.modelId]) {
            result[sery.modelId] = {}
        }
        result[sery.modelId][sery.id] = sery
        return result
    }, {})

    // 这里只取非virtual的部分
    let query = referencedSeries.filter(item => dependencyGraph[item] && !dependencyGraph[item].isVirtual()).map(item => {
        let [type, seriesId, instanceId] = item.split("@")
        return {
            seriesId,
            instanceId
        }
    })

    let attrQuery = referencedAttributes.filter(item => dependencyGraph[item] && !dependencyGraph[item].isVirtual()).map(item => {
        let [type, attributeId, instanceId] = item.split("@")
        return {
            attributeId,
            instanceId
        }
    })

    // 如果存在虚拟点位，则进行计算
    if (query.length + attrQuery.length > 0) {
        let referencedAttributeValues = (await AttributeValue.findAll({
            where: {
                [Op.or]: attrQuery
            },
            include: [StaticAttribute]
        })).reduce((result, item) => {
            let type = "attribute"
            result[`${type}@${item.attributeId}@${item.instanceId}`] = VirtualSeriesCalculator.parseValue(item.value, item.static_attribute.dataType)
            return result
        }, {})

        let fallbackAttributeValues = (await StaticAttribute.findAll({
            where: {
                id: {
                    [Op.in]: attrQuery.map(item => item.attributeId)
                }
            }
        })).reduce((result, item) => {
            result[item.id] = VirtualSeriesCalculator.parseValue(item.defaultValue, item.dataType)
            return result
        }, {})

        referencedAttributeValues = attrQuery.reduce((result, item) => {
            let type = "attribute"
            if (!result.hasOwnProperty(`${type}@${item.attributeId}@${item.instanceId}`)) {
                result[`${type}@${item.attributeId}@${item.instanceId}`] = fallbackAttributeValues[item.attributeId] || null
            }
            return result
        }, referencedAttributeValues)

        let referencedValues = []

        if (ctx.request.body.aggregation) {
            for(let modelId in referencesModelMap) {
                let SeriesValue = global.db.models[Meta.getTableId(modelId)]
                referencedValues = referencedValues.concat(await SeriesValue.findAll({
                    where: {
                        [Op.or]: query,
                        time: timeFilter
                    },
                    attributes: [
                        [timeScale, 'timestamp'],
                        [valueScale, 'value'],
                        "seriesId",
                        "instanceId"
                    ],
                    order: [
                        [timeScale, ctx.request.body.order ? ctx.request.body.order : 'DESC']
                    ],
                    group: ['instanceId', 'seriesId', 'timestamp'],
                    limit: ctx.request.body.limit,
                    offset: ctx.request.body.offset
                }))
            }
        }
        else {
            for(let modelId in referencesModelMap) {
                let SeriesValue = global.db.models[Meta.getTableId(modelId)]
                referencedValues = referencedValues.concat(await SeriesValue.findAll({
                    where: {
                        [Op.or]: query,
                        time: timeFilter
                    },
                    attributes: [
                        "id",
                        ["time", "timestamp"],
                        "value",
                        "seriesId",
                        "instanceId"
                    ],
                    order: [
                        [timeScale, ctx.request.body.order ? ctx.request.body.order : 'DESC']
                    ],
                    limit: ctx.request.body.limit,
                    offset: ctx.request.body.offset
                }))
            }
        }

        let referencedSeriesValues = referencedValues.reduce((result, record) => {
            let type = "series", time = null, parsedVal = null
            let nodeId = `${type}@${record.seriesId}@${record.instanceId}`
            let node = dependencyGraph[nodeId]
            if (ctx.request.body.aggregation) {
                time = new Date(record.dataValues.timestamp)
                let seriesValuesArray = []
                for (let key in record.value) {
                    if (record.value.hasOwnProperty(key)) {
                        seriesValuesArray.push({
                            data: VirtualSeriesCalculator.parseValue(record.value[key], node.series.dataType),
                            time: key
                        });
                    }
                }
                parsedVal = aggregate_array(seriesValuesArray, ctx.request.body.method)
            }
            else {
                time = new Date(record.dataValues.timestamp)
                parsedVal = VirtualSeriesCalculator.parseValue(record.value, node.series.dataType)
            }

            if (!result[nodeId]) {
                result[nodeId] = {
                    data: []
                }
            }
            result[nodeId].data.push({
                time,
                value: parsedVal
            })
            return result
        }, {})

        // 预处理每个序列的数值
        for(let key in referencedSeriesValues) {
            referencedSeriesValues[key].stat = VirtualSeriesCalculator.GetStat(referencedSeriesValues[key].data)
            if (dependencyGraph[key]) {
                dependencyGraph[key].values = referencedSeriesValues[key]
            }
        }

        for(let key in referencedAttributeValues) {
            if (dependencyGraph[key]) {
                dependencyGraph[key].values = referencedAttributeValues[key]
            }
        }

        // 针对每个目标序列，计算其数值
        for(let i = 0; i < series.length; i++) {
            let _series = series[i]
            if (_series.isVirtual) {
                for(let j = 0; j < instances.length; j++) {
                    let instance = instances[j]
                    if (result[instance.id][_series.id]) {
                        let records = VirtualSeriesCalculator.CalculateByGraph(dependencyGraph, _series, instance, ctx.request.body.order ? ctx.request.body.order : 'DESC')
                        result[instance.id][_series.id].values = records ? records.data : []
                    }
                }
            }
        }
    }

    for (let instanceId in result) {
        let instance = instanceMap[instanceId]
        result[instanceId] = Object.values(modelMap[instance.modelId]).reduce((res, sery) => {
            res[sery.name] = result[instanceId][sery.id]
            return res
        }, {})
    }

    let responseResult = Object.keys(result).reduce((res, instanceId) => {
        res[instanceMap[instanceId].instanceId] = result[instanceId]
        return res
    }, {})

    //封装结果
    if (latest) {
        //只取最新数据时需要重新封装
        for (let instanceId in responseResult) {
            let latest_result = []
            for (let key in responseResult[instanceId]) {
                let value = responseResult[instanceId][key]
                latest_result.push({
                    name: value.name,
                    unit: value.unit,
                    value: value.values[0] ? value.values[0].value : null,
                    time: value.values[0] ? value.values[0].time : null
                })
            }
            responseResult[instanceId] = latest_result
        }
    }
    //单个Instance抽取结果
    if (singleInstance) {
        for (let instanceId in responseResult) {
            responseResult = responseResult[instanceId]
        }
    }
    return responseResult
}

exports.querySeries = querySeries

exports.index = async (ctx, next) => {
    try {
        ctx.request.body.instanceIds = [ctx.params.instanceId]
        ctx.body = {
            data: await querySeries(ctx, false, true)
        }
    } catch (err) {
        console.error(err)
        throw new Error(messages.controller.hierarchy.DATA_INTERFACE_ERROR)
    }
}

exports.show = async (ctx, next) => {
    try {
        ctx.request.body.instanceIds = [ctx.params.instanceId]
        ctx.request.body.order = "DESC"
        ctx.request.body.startAt = ctx.request.body.after ? ctx.request.body.after : new Date(0)
        ctx.request.body.endAt = ctx.request.body.before ? ctx.request.body.before : new Date()
        ctx.body = {
            data: await querySeries(ctx, true, true)
        }
    } catch (err) {
        console.error(err)
        throw new Error(messages.controller.hierarchy.DATA_INTERFACE_ERROR)
    }
}

