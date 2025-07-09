const Meta = require("../../../../database/models/series_value_metas");

exports.index = async (ctx, next) => {
    let Instance = global.db.models.model_instance
    let instance = await Instance.findByPk(ctx.params.instanceId)
    let SeriesValue = global.db.models[Meta.getTableId(instance.modelId)]

    let series =  await SeriesValue.findAll({
        where: {
            instanceId: ctx.params.instanceId,
            seriesId: ctx.params.seriesId
        },
        order: [['time', 'DESC']]
    })
    ctx.body = {
        data: series.reduce((result, record) => {
            result[record.seriesId] = record
            return result
        }, {})
    }
}

exports.create = async (ctx, next) => {
    let Instance = global.db.models.model_instance
    let time = new Date(ctx.request.body.time)
    delete ctx.request.body.time
    let instance = await Instance.findByPk(ctx.params.instanceId)
    let SeriesValue = global.db.models[Meta.getTableId(instance.modelId)]
    let series =  await SeriesValue.bulkCreate(Object.entries(ctx.request.body).map(entry => ({
        time,
        instanceId: ctx.params.instanceId,
        seriesId: entry[0],
        value: entry[1]
    })))
    instance.updatedAt = new Date()
    await instance.save()
    ctx.body = {
        data: series
    }
}

exports.update = async (ctx, next) => {
    let Instance = global.db.models.model_instance
    let instance = await Instance.findByPk(ctx.params.instanceId)
    let SeriesValue = global.db.models[Meta.getTableId(instance.modelId)]
    let record = await SeriesValue.findByPk(ctx.params.valueId)
    Object.assign(record, ctx.request.body)
    instance.updatedAt = new Date()
    await instance.save()
    record = await record.save()
    ctx.body = {
        data: record
    }
}

exports.destroy = async (ctx, next) => {
    let Instance = global.db.models.model_instance
    let instance = await Instance.findByPk(ctx.params.instanceId)
    let SeriesValue = global.db.models[Meta.getTableId(instance.modelId)]
    let record = await SeriesValue.findByPk(ctx.params.valueId)
    instance.updatedAt = new Date()
    await instance.save()
    record = await record.destroy()
    ctx.body = {
        data: {}
    }
}
