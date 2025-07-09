const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Meta = require('../../../../database/models/series_value_metas')

exports.index = async (ctx, next) => {
  const Instance = global.db.models.model_instance
  const TimeSeries = global.db.models.time_series
  let instance = await Instance.findOne({
    where: {
      [Op.or]: [{
        id: ctx.params.instanceId
      }, {
        instanceId: ctx.params.instanceId
      }]
    }
  })
  const SeriesValue = global.db.models[Meta.getTableId(instance.id)]
  let series = await TimeSeries.findByPk(ctx.params.seriesId)
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
  let data = await SeriesValue.findAll({
    attributes: ["value", [Sequelize.fn('COUNT', Sequelize.col("id")), "count"]],
    where: {
      seriesId: ctx.params.seriesId,
      instanceId: instance.id
    },
    group: "value",
    order: [["count", "DESC"]]
  })
  ctx.body = {
    data: data.map(item => item.value)
  }
}
