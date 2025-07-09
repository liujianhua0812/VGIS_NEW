const Sequelize = require('sequelize')
const Meta = require('../../../../database/models/series_value_metas')

exports.index = async (ctx, next) => {
  const TimeSeries = global.db.models.time_series
  let series = await TimeSeries.findByPk(ctx.params.seriesId)
  const SeriesValue = global.db.models[Meta.getTableId(series.modelId)]
  if (series.dataType === "Enum") {
    return ctx.body = {
      data: series.candidates
    }
  }
  else if (series.dataType === "Boolean") {
    return ctx.body = {
      data: [true, false]
    }
  }
  let orderKey = ctx.request.query.orderKey || "count"
  let order = ctx.request.query.order || "DESC"
  let data = await SeriesValue.findAll({
    attributes: ["value", [Sequelize.fn('COUNT', Sequelize.col("id")), "count"]],
    where: {
      seriesId: ctx.params.seriesId
    },
    group: "value",
    order: [[orderKey, order]]
  })
  ctx.body = {
    data: data.map(item => item.value)
  }
}
