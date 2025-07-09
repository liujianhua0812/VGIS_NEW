const Op = require('sequelize').Op
const messages = require('../../../libs/Error').messages

exports.index = async (ctx, next) => {
    const Model = global.db.models.model
    const TimeSeries = global.db.models.time_series
    const Label = global.db.models.label
    const Unit = global.db.models.unit
    let query = [{
        modelId: ctx.params.modelId
    }, {
        id: ctx.params.modelId
    }]
    if (ctx.request.query.name) {
        query.push({
            name: ctx.request.query.name
        })
    }
    let model = await Model.findOne({
        where: {
            [Op.or]: query
        },
    })
    if (!model) {
        return ctx.body = {
            data: []
        }
    }
    let series = await TimeSeries.findAll({
        where: {
            modelId: model.id
        },
        include: [Label, Unit],
        order: [['rank', 'ASC']]
    })
    ctx.body = {
        data: series
    }
}

exports.create = async (ctx, next) => {
    const TimeSeries = global.db.models.time_series
    const Label = global.db.models.label
    const Unit = global.db.models.unit
    const Has = global.db.models.has
    let series = await TimeSeries.findOne({
        where: {
            modelId: ctx.params.modelId,
            name: ctx.request.body.name
        }
    })
    if (series) {
        throw new Error(messages.database.time_series.DUPLICATE_SERIES)
    }
    else {
        ctx.request.body.rank = await TimeSeries.count({ where: { modelId: ctx.params.modelId } })
        // 处理Unit
        delete ctx.request.body.unitId
        let unit = ctx.request.body.unit
        if (unit) {
            let _unit = await Unit.findOne({where: {name: unit}})
            if (!_unit) {
                _unit = await Unit.create({name: unit})
            }
            ctx.request.body.unitId = _unit.id
        }

        series = await TimeSeries.create(Object.assign(ctx.request.body, ctx.params))
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
                    seriesId: series.id,
                    labelId: {
                        [Op.in]: _labels.map(item => item.id)
                    }
                }
            })
            await Has.bulkCreate(_labels.map(item => ({
                seriesId: series.id,
                labelId: item.id
            })))
        }
    }
    ctx.body = {
        data: {}
    }
}

exports.update = async (ctx, next) => {
    const Series = global.db.models.time_series
    const Label = global.db.models.label
    const Unit = global.db.models.unit
    const Has = global.db.models.has
    let series = await Series.findByPk(ctx.params.seriesId)
    if (ctx.request.body.name && ctx.request.body.name !== series.name) {
        let exist = await Series.findOne({
            where: {
                id: {
                    [Op.ne]: series.id
                },
                name: ctx.request.body.name,
                modelId: ctx.params.modelId
            }
        })
        if (exist) {
            throw new Error(messages.database.time_series.DUPLICATE_SERIES)
        }
    }
    series.unitId = null
    delete ctx.request.body.unitId
    let unit = ctx.request.body.unit
    if (unit) {
        let _unit = await Unit.findOne({where: {name: unit}})
        if (!_unit) {
            _unit = await Unit.create({name: unit})
        }
        ctx.request.body.unitId = _unit.id
    }
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
                seriesId: series.id
            }
        })
        await Has.bulkCreate(_labels.map(item => ({
            seriesId: series.id,
            labelId: item.id
        })))
    }
    Object.assign(series, ctx.request.body)
    series = await series.save()
    ctx.body = {
        data: series
    }
}

exports.destroy = async (ctx, next) => {
    const TimeSeries = global.db.models.time_series
    let series = await TimeSeries.findByPk(ctx.params.seriesId)
    await series.destroy()
    ctx.body = {
        data: {}
    }
}

exports.domain = require('./domain')
