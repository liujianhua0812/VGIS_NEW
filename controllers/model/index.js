const Meta = require("../../database/models/series_value_metas");
const Sequelize = require("sequelize");
const messages = require('../../libs/Error').messages
const Op = require('sequelize').Op

exports.index = async (ctx, next) => {
    const ModelGroup = global.db.models.model_group
    const Model = global.db.models.model
    let query = {}
    if (ctx.request.query.query) {
        query = {
            [Op.or]: [{
                name: {
                    [Op.iLike]: `%${ctx.request.query.query.split('').join('%')}%`
                }
            }, {
                modelId: {
                    [Op.iLike]: `%${ctx.request.query.query.split('').join('%')}%`
                }
            }]
        }
    }
    let models = await Model.findAll({ where: query })
    if (ctx.request.query.query) {
        let nodes = [].concat(models)
        nodes.sort((n1, n2) => n1.updatedAt - n2.updatedAt)
        ctx.body = {
            data: nodes
        }
    }
    else if (ctx.request.query.flat) {
        ctx.body = {
            data: models
        }
    }
    else {
        let groups = await ModelGroup.findAll({})
        let nodes = models.concat(groups)
        nodes.sort((n1, n2) => n1.updatedAt - n2.updatedAt)
        let parentMap = nodes.reduce((result, node) => {
            result[node.id] = []
            return result
        }, {})
        for(let i = 0; i < nodes.length; i++) {
            if (nodes[i].groupId) {
                parentMap[nodes[i].groupId].push(nodes[i])
            }
        }
        for(let i = 0; i < nodes.length; i++) {
            nodes[i].dataValues.children = parentMap[nodes[i].id]
        }
        ctx.body = {
            data: nodes.filter(item => !item.groupId)
        }
    }
}

exports.show = async (ctx, next) => {
    const Model = global.db.models.model
    const StaticAttribute = global.db.models.static_attribute
    const TimeSeries = global.db.models.time_series
    const ModelRelation = global.db.models.model_relation
    const Label = global.db.models.label
    const Unit = global.db.models.unit
    let model = await Model.findByPk(ctx.params.modelId, {
        include: [
            {
                model: StaticAttribute,
                include: [Label, Unit]
            },
            {
                model: TimeSeries,
                include: [Label, Unit]
            },
            {
                model: Model,
                as: 'Targets'
            },
            {
                model: Model,
                as: 'Sources'
            },
            {
                model: Label
            }
        ]
    })
    ctx.body = {
        data: model
    }
}

exports.create = async (ctx, next) => {
    const Model = global.db.models.model
    const Label = global.db.models.label
    const Has = global.db.models.has
    let model = await Model.create(Object.assign(ctx.request.body, { published: true }))
    // 处理Label
    let labels = ctx.request.body.labels
    if (labels && labels.length > 0) {
        let _labels = await Label.findAll({
            where: {
                name: {
                    [Op.in]: labels
                }
            }
        })
        let labelMap = labels.reduce((result, item) => {
            result[item] = item
            return result
        }, {})
        for(let i = 0; i < _labels.length; i++) {
            delete labelMap[_labels[i].name]
        }
        _labels = _labels.concat(await Label.bulkCreate(Object.values(labelMap).map(item => ({name: item}))))
        await Has.destroy({
            where: {
                modelId: model.id,
                labelId: {
                    [Op.in]: _labels.map(item => item.id)
                }
            }
        })
        await Has.bulkCreate(_labels.map(item => ({
            modelId: model.id,
            labelId: item.id
        })))
        await Meta.defineOne(global.db, Sequelize.DataTypes, model)
        await global.db.sync()
    }
    ctx.body = {
        data: model
    }
}

exports.update = async (ctx, next) => {
    const Model = global.db.models.model
    const Label = global.db.models.label
    const Has = global.db.models.has
    let model = await Model.findByPk(ctx.params.modelId)
    Object.assign(model, ctx.request.body)
    if (ctx.request.body.groupId === 'null') {
        model.groupId = null
    }
    model = await model.save()
    let labels = ctx.request.body.labels
    if (labels) {
        let _labels = await Label.findAll({
            where: {
                name: {
                    [Op.in]: labels
                }
            }
        })
        let labelMap = labels.reduce((result, item) => {
            result[item] = item
            return result
        }, {})
        for(let i = 0; i < _labels.length; i++) {
            delete labelMap[_labels[i].name]
        }
        _labels = _labels.concat(await Label.bulkCreate(Object.values(labelMap).map(item => ({name: item}))))
        await Has.destroy({
            where: {
                modelId: model.id
            }
        })
        await Has.bulkCreate(_labels.map(item => ({
            modelId: model.id,
            labelId: item.id
        })))
    }
    ctx.body = {
        data: model
    }
}

exports.destroy = async (ctx, next) => {
    const Model = global.db.models.model
    const ModelRelation = global.db.models.model_relation
    let relation = await ModelRelation.findOne({
        where: {
            targetId: ctx.params.modelId,
            relationType: "Belong To"
        }
    })
    if (!relation) {
        let model = await Model.findByPk(ctx.params.modelId)
        await model.destroy()
        if (global.db.models[Meta.getTableId(ctx.params.modelId)]) {
            await global.db.models[Meta.getTableId(ctx.params.modelId)].drop()
            await global.db.sync()
        }
        ctx.body = {
            data: {}
        }
    }
    else {
        throw new Error(messages.controller.model.DELETION_RESTRICTION_FAILED)
    }
}

exports.attribute = require('./attribute')

exports.series = require('./series')

exports.relation = require('./relation')

exports.instance = require('./instance')

exports.tables = require('./tables')

exports.rule_chains = require('./rule_chains')

exports.alerts = require('./alerts')

exports.alert_templates = require('./alert_templates')

exports.threeD = require('./3d')