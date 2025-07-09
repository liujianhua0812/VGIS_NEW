
exports.show = async (ctx, next) => {
    let Instance = global.db.models.model_instance
    let Series = global.db.models.time_series
    let InstanceSeries = global.db.models.instance_time_series

    let series = await InstanceSeries.findOne({
        where: {
            instanceId: ctx.params.instanceId,
            seriesId: ctx.params.seriesId
        }
    })

    return ctx.body = {
        data: series
    }
}


exports.update = async (ctx, next) => {
    let Instance = global.db.models.model_instance
    let Series = global.db.models.time_series
    let InstanceSeries = global.db.models.instance_time_series

    let series = await InstanceSeries.findOne({
        where: {
            instanceId: ctx.params.instanceId,
            seriesId: ctx.params.seriesId
        }
    })

    if (series) {
        series.calculationMethod = JSON.stringify(ctx.request.body)
        series = await series.save()
    }
    else {
        series = await InstanceSeries.create({
            instanceId: ctx.params.instanceId,
            seriesId: ctx.params.seriesId,
            calculationMethod: JSON.stringify(ctx.request.body)
        })
    }

    return ctx.body = {
        data: series
    }
}

exports.destroy = async (ctx, next) => {
    let InstanceSeries = global.db.models.instance_time_series
    await InstanceSeries.destroy({
        where: {
            instanceId: ctx.params.instanceId,
            seriesId: ctx.params.seriesId
        }
    })

    return ctx.body = {}
}