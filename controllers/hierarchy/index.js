const {Op} = require("sequelize");
exports.index = async (ctx, next) => {
    //挂在model所需的child数目临界值，超过这一数目则挂model
    const childNumThreshold = 1

    const Model = global.db.models.model;
    const ModelInstance = global.db.models.model_instance;
    const InstanceRelation = global.db.models.instance_relation;
    const Label = global.db.models.label;

    let modelInstances = await ModelInstance.findAll({
        include: [{
            model: Model,
            include: [{
                model: Label,
            }],
            where: {
                published: true
            }
        }, {
            model: Label
        }],
        where: {
            published: true
        }
    })
    let instanceRelations = await InstanceRelation.findAll()

    let relationsMap = instanceRelations.reduce((result, instanceRelation) => {
        if (!result[instanceRelation.childId]) {
            result[instanceRelation.childId] = {}
        }
        result[instanceRelation.childId][instanceRelation.parentId] = instanceRelation.parentId
        return result
    }, {})

    //构建InstanceId-InstanceName,modelId, modelName, modelTag表
    let instanceMap = modelInstances.reduce((result, modelInstance) => {
        result[modelInstance.id] = {
            id: modelInstance.id,
            name: modelInstance.name,
            tag: modelInstance.instanceId,
            poi: true,
            modelId: modelInstance.modelId,
            threeDViewPoint: modelInstance.threeDViewPoint,
            modelName: modelInstance.model.name,
            modelTag: modelInstance.model.modelId,
            modelLabels: modelInstance.model.labels,
            instanceLabels: modelInstance.labels,
            parentId: modelInstance.id in relationsMap ? relationsMap[modelInstance.id] : null
        }
        return result
    }, {})

    //计数，记录在同一个parentId & 同一个modelId的子节点的数目，后续插入model需要用到
    let countMap = {}
    for (const [key, value] of Object.entries(instanceMap)) {
        let parentId = value.parentId
        const child_modelId = value.modelId
        if (!parentId) {
            //记录所有无父节点的情况
            parentId = null
        }
        for(let id in parentId) {
            if (!(id in countMap)) {
                countMap[id] = {}
            }
            if (child_modelId in countMap[id]) {
                countMap[id][child_modelId] += 1
            } else {
                countMap[id][child_modelId] = 1
            }
        }
    }

    let dataInput = []

    //dataInput-数组，构建树用到
    //childParentSet-有父节点的集合，后续用来找根节点
    //addedModelNode-parentId和ModelId，判断model是否已插入，如果已插入则跳过，避免重复插入
    let addedModelNode = new Set()
    for (const [key, value] of Object.entries(instanceMap)) {
        const childId = key
        const parentId = value.parentId
        const instanceName = value.name
        const instanceTag = value.tag
        const modelId = value.modelId
        const modelName = value.modelName
        const modelLabels = getLabelsArray(value.modelLabels)
        const instanceLabels = JoinLabels(value.modelLabels, value.instanceLabels)
        const modelTag = value.modelTag
        const viewPoint = value.threeDViewPoint

        if (parentId) {
            for(let id in parentId) {
                if (id in countMap && modelId in countMap[id] &&
                    countMap[id][modelId] > childNumThreshold) {
                    //insert Model, child-model
                    dataInput.push({
                        id: childId,
                        parentId: id + modelId,
                        tag: instanceTag,
                        name: instanceName,
                        poi: instanceMap[childId].poi,
                        modelId: modelId,
                        type: modelName,
                        labels: instanceLabels,
                        viewPoint
                    })

                    //insert model
                    if (!addedModelNode.has(id + modelId)) {
                        //model-parent
                        dataInput.push({
                            id: id + modelId,
                            parentId: id,
                            tag: modelTag,
                            name: modelName,
                            poi: false,
                            modelId: modelId,
                            type: modelName,
                            labels: modelLabels,
                        })
                        addedModelNode.add(id + modelId)
                    }
                } else {
                    //insert instance only
                    dataInput.push({
                        id: childId,
                        parentId: id,
                        tag: instanceTag,
                        name: instanceName,
                        poi: instanceMap[childId].poi,
                        modelId: modelId,
                        type: modelName,
                        labels: instanceLabels,
                        viewPoint
                    })
                }
            }
        }
        else {
            dataInput.push({
                id: childId,
                parentId: parentId,
                tag: instanceTag,
                name: instanceName,
                poi: instanceMap[childId].poi,
                modelId: modelId,
                type: modelName,
                labels: instanceLabels,
                viewPoint
            })
        }
    }

    let data = list_to_tree(dataInput);
    sortNodesAndChildren(data)
    ctx.body = {data}
}

function sortNodesAndChildren(nodes) {
    nodes.sort((a, b) => {
        if (a.poi ^ b.poi) {
            return a.poi - b.poi
        } else {
            return a.name.trim().localeCompare(b.name.trim())
        }
    })
    nodes.forEach(node => {
        if (node.children) {
            sortNodesAndChildren(node.children);
        }
    })
}

//从数组中构建树
function list_to_tree(list) {
    let map = {}, node, roots = [];

    // console.log(list)

    list.map((element, index) => {
        map[element.id] = index;
        element.children = [];
    })

    list.map(element => {
        node = element;
        if (node.parentId !== null) {
            // console.log(node.parentId, map[node.parentId])
            // if you have dangling branches check that map[node.parentId] exists
            if (!list[map[node.parentId]].children) {
                list[map[node.parentId]].children = []
            }
            list[map[node.parentId]].children.push(node);
        } else {
            roots.push(node)
        }
        // delete node.id
        delete node.parentId
        // delete node.modelId
        if (node.children.length === 0) {
            delete node.children
        }
    })

    return roots;
}

function JoinLabels(label1, label2) {
    let result = {}, arr = []
    label1.map(label => {
        result[label.id] = label.name
    })
    label2.map(label => {
        if (!(label.id in result)) {
            result[label.id] = label.name
        }
    })
    for (const [key, value] of Object.entries(result)) {
        // 获取id的情况
        // arr.push({
        //     id: key,
        //     name: value
        // })

        //只需要label的name
        arr.push(value)
    }
    return arr
}

function getLabelsArray(labels) {
    let arr = []
    labels.map(label => {
        // 获取id的情况
        // arr.push({
        //     id: label.id,
        //     name: label.name
        // })

        //只需要label的name
        arr.push(label.name)
    })
    return arr
}


exports.group = async (ctx, next) => {
    const ModelInstance = global.db.models.model_instance
    const Model = global.db.models.model
    let model = await Model.findOne({
        where: {
            [Op.or]: [{
                name: ctx.request.query.model
            }, {
                modelId: ctx.request.query.model
            }]
        }
    })
    ctx.body = {
        data: await ModelInstance.findAll({
            where: {
                modelId: model.id
            }
        })
    }
}

exports.parent = async (ctx, next) => {
    const ModelInstance = global.db.models.model_instance
    const InstanceRelation = global.db.models.instance_relation
    const Model = global.db.models.model

    let instance = await ModelInstance.findOne({
        where: {
            [Op.or]: [{
                id: ctx.params.instanceId
            }, {
                name: ctx.params.instanceId
            }, {
                instanceId: ctx.params.instanceId
            }]
        },
        include: [Model]
    })

    let relations = await InstanceRelation.findAll({
        where: {}
    })

    let relationMap = relations.reduce((result, item) => {
        result[item.childId] = item.parentId
        return result
    }, {})

    let routes = [], id = instance.id
    while(relationMap[id]) {
        routes.push(relationMap[id])
        id = relationMap[id]
    }

    let parents = await ModelInstance.findAll({
        where: {
            id: {
                [Op.in]: routes
            }
        },
        include: [Model]
    })

    let instanceMap = parents.reduce((result, item) => {
        result[item.id] = item
        return result
    }, {})

    parents = routes.map(item => instanceMap[item])

    ctx.body = {
        data: parents
    }
}

exports.show = async (ctx, next) => {
    const ModelInstance = global.db.models.model_instance
    const AttributeValue = global.db.models.attribute_value
    const StaticAttribute = global.db.models.static_attribute
    const TimeSeries = global.db.models.time_series
    const Model = global.db.models.model
    const Unit = global.db.models.unit
    const Label = global.db.models.label
    const PID = global.db.models.pid
    const Table = global.db.models.data_table
    let instance = await ModelInstance.findOne({
        where: {
            [Op.or]: [{
                id: ctx.params.instanceId
            }, {
                name: ctx.params.instanceId
            }, {
                instanceId: ctx.params.instanceId
            }]
        },
        include: [{
            model: AttributeValue,
            include: [{
                model: StaticAttribute,
                include: [Unit, Label]
            }]
        }, {
            model: Model,
            include: [{
                model: TimeSeries,
                include: [Unit]
            }, {
                model: Table
            }]
        }, PID]
    })
    if (instance) {
        for (let i = 0; i < instance.pids.length; i++) {
            instance.pids[i].dataValues.map = new Buffer(instance.pids[i].dataValues.map, 'base64').toString()
        }
    }
    ctx.body = {
        data: instance
    }
}

exports.children = async (ctx, next) => {
    const ModelInstance = global.db.models.model_instance
    const Model = global.db.models.model
    const AttributeValue = global.db.models.attribute_value
    const StaticAttribute = global.db.models.static_attribute
    let query = {}
    if (ctx.request.query.model) {
        let model = await Model.findOne({
            where: {
                [Op.or]: [{
                    name: ctx.request.query.model
                }, {
                    modelId: ctx.request.query.model
                }]
            }
        })
        if (model) {
            query.modelId = model.id
        }
    }
    let instance = await ModelInstance.findOne({
        where: {
            instanceId: ctx.params.instanceId
        }
    })
    let children = []
    if (instance) {
        children = await instance.getChildren({
            where: query,
            include: [{
                model: AttributeValue,
                include: [StaticAttribute]
            }]
        })
    }
    return ctx.body = {
        data: children
    }
}

exports.metadata = async (ctx, next) => {
    let result = {}
    const instanceId = ctx.params.instanceId
    const ModelInstance = global.db.models.model_instance
    const Model = global.db.models.model;

    const modelInstance = await ModelInstance.findByPk(instanceId)

    if (modelInstance) {
        result["instanceId"] = instanceId
        result["name"] = modelInstance.name

        const model = await Model.findByPk(modelInstance.modelId)
        result["modelName "] = model.name
        // result["modelIcon"] = model.icon
    }

    ctx.body = {
        data: result
    }
}

exports.data_tables = require('./data_table')

exports.attributes = require('./attribute')

exports.attribute_multiple = require('./attribute-multiple')

exports.series = require('./series')

exports.series_multiple = require('./series-multiple')

exports.pids = require('./pid')
