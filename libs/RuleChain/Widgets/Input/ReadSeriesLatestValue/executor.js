let readSeriesData = require("../../../../../controllers/hierarchy/series").show

module.exports =  async function (context = {}, config, inputs = [], outputs) {
    let input = inputs[0]
    let StaticAttribute = global.db.models.time_series

    let series = await StaticAttribute.findOne({
        where: {
            id: config.series[1],
            modelId: config.series[0]
        }
    })

    let before = config.period.realtime ? new Date() : config.period.endAt
    let after = config.period.realtime ? new Date(before.getTime()) : config.period.startAt
    if (config.period.realtime) {
        after.setSeconds(after.getSeconds() - config.period.gapSecond)
    }

    let ctx = {
        params: {
            instanceId: config.instance,
        },
        request: {
            body: {
                seriesNames: [series.name],
                before,
                after
            }
        }
    }

    let next = async function (error) {}

    await readSeriesData(ctx, next)

    let result = ctx.body.data[0]

    if (result && result.time) {
        result = { time: result.time, value: result.value }
    }
    else {
        result = null
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