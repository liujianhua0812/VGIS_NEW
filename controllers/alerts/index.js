const Sequelize = require('sequelize')
const { Op } = Sequelize

exports.index = async (ctx, next) => {
    let Alert = global.db.models.alert
    let Instance = global.db.models.model_instance
    let Model = global.db.models.model
    let Relation = global.db.models.instance_relation
    let query = {}
    let filterMap = {}
    let containChildren = ctx.request.query.cc === "true"
    let checked = ctx.request.query.status

    let page = parseInt(ctx.request.query.page)
    let pagination = parseInt(ctx.request.query.pagination)
    page = isNaN(page) ? 1 : page
    pagination = isNaN(pagination) ? 10 : pagination

    if (checked) {
        query = {
            checked: checked === "true"
        }
    }
    if (ctx.request.query.event) {
        query = {
            name: ctx.request.query.event
        }
    }
    if (containChildren) {
        filterMap = (await Relation.findAll()).reduce((result, item) => {
            if (!result[item.parentId]) {
                result[item.parentId] = []
            }
            result[item.parentId].push(item.childId)
            return result
        }, {})
    }

    function getSubNodes (nodes) {
        let result = nodes
        for(let i = 0; i < nodes.length; i++) {
            let node = nodes[i]
            if (filterMap[node]) {
                result = result.concat(getSubNodes(filterMap[node]))
            }
        }
        return result
    }

    let modelResult = [], instanceResult = []
    if (ctx.request.query.modelId) {
        let model = await Model.findOne({
            where: {
                [Op.or]: [
                    { id: ctx.request.query.modelId },
                    { modelId: ctx.request.query.modelId }
                ]
            },
            include: [Instance]
        })
        let instances = model.model_instances.map(item => item.id)
        modelResult = containChildren ? getSubNodes(instances) : instances
    }
    if (ctx.request.query.instanceId) {
        let instance = await Instance.findOne({
            where: {
                [Op.or]: [
                    { id: ctx.request.query.instanceId },
                    { instanceId: ctx.request.query.instanceId }
                ]
            }
        })
        instanceResult = containChildren ? getSubNodes([instance.id]) : [instance.id]
    }
    if (ctx.request.query.instanceId && ctx.request.query.modelId) {
        let temp = new Set(instanceResult)
        let intersect = new Set(modelResult.filter(i => temp.has(i)))
        query.instanceId = {
            [Op.in]: [...intersect]
        }

    }
    else if (ctx.request.query.instanceId) {
        query.instanceId = {
            [Op.in]: instanceResult
        }
    }
    else if (ctx.request.query.modelId) {
        query.instanceId = {
            [Op.in]: modelResult
        }
    }


    if (ctx.request.query.startAt || ctx.request.query.endAt) {
        if (ctx.request.query.startAt && ctx.request.query.endAt) {
            query.createdAt = {
                [Op.gte]: new Date(ctx.request.query.startAt),
                [Op.lte]: new Date(ctx.request.query.endAt)
            }
        }
        else if (ctx.request.query.startAt) {
            query.createdAt = {
                [Op.gte]: new Date(ctx.request.query.startAt)
            }
        }
        else {
            query.createdAt = {
                [Op.lte]: new Date(ctx.request.query.endAt)
            }
        }
    }
    let data = await Alert.findAll({
        where: query,
        include: [Instance],
        offset: (page - 1) * pagination,
        limit: pagination
    })
    let total = await Alert.count({
        where: query
    })
    ctx.body = {
        data,
        pagination: {
            page,
            pagination,
            total,
            total_page: Math.ceil(total / pagination)
        }
    }
}

exports.update = async (ctx, next) => {

}