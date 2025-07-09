require('../libs/Date')()
const Op = require('sequelize').Op
let config = require('../config')
let dbconfig = config.database.postgres;
const timeout = 3000
let db = null
const Meta = require('../database/models/series_value_metas')
let targetModels = ["冷却塔", "冷却水泵", "冷冻水泵", "总场站", "冷站", "冷机", "空压站", "空压机", "分水器", "集水器", "冷冻水系统", "冷却水系统", "供气末端", "纯水机", "制氮机", "锅炉"]

async function clearData () {
  db = await require('../database')(
      dbconfig.dbname,
      dbconfig.username,
      dbconfig.password,
      dbconfig.config
  )
  let Model = db.models.model
  let Instance = db.models.model_instance
  let TimeSeries = db.models.time_series
  let models = await Model.findAll({
    where: {
      name: {
        [Op.in]: targetModels
      }
    }
  })
  let instances = await Instance.findAll({
    where: {
      modelId: {
        [Op.in]: models.map(item => item.id)
      }
    },
    include: [{
      model: Model,
      include: [{
        model: TimeSeries
      }]
    }]
  })
  for(let i = 0; i < models.length; i++) {
    let SeriesValue = db.models[Meta.getTableId(models[i].id)]
    await SeriesValue.destroy({
      where: {
        instanceId: {
          [Op.in]: instances.map(item => item.id)
        },
        seriesId: {
          [Op.in]: instances.reduce((result, item) => result.concat(item.model.time_series.map(series => series.id)), [])
        }
      }
    })
  }
}

async function populate () {
  let Model = db.models.model
  let Instance = db.models.model_instance
  let TimeSeries = db.models.time_series
  let SeriesValue = db.models.series_value
  let models = await Model.findAll({
    where: {
      name: {
        [Op.in]: targetModels
      }
    },
    include: [TimeSeries]
  })

  function getValue (series) {
    if (series.dataType === "Boolean") {
      return Math.round(Math.random())
    }
    if (series.dataType === "Decimal") {
      if ((series.min || series.min === 0) && (series.max || series.max === 0)) {
        return (series.min + (series.max - series.min) * Math.random()).toFixed(series.precision || 3)
      }
      else if (series.min || series.min === 0) {
        return (series.min + 100 * Math.random()).toFixed(series.precision || 3)
      }
      else if (series.max || series.max === 0) {
        return (series.max * Math.random()).toFixed(series.precision || 3)
      }
      else {
        return (Math.random() * 100).toFixed(series.precision || 3)
      }
    }
    return (Math.random() * 100).toFixed(series.precision || 3)
  }

  let time = new Date(), data = []
  for(let i = 0; i < models.length; i++) {
    let model = models[i]
    let SeriesValue = db.models[Meta.getTableId(model.id)]
    let instances = await Instance.findAll({
      where: {
        modelId: model.id
      }
    })
    data = []
    for(let j = 0; j < instances.length; j++) {
      let instance = instances[j]
      for(let k = 0; k < model.time_series.length; k++) {
        let series = model.time_series[k]
        if (!series.isVirtual) {
          data.push({
            instanceId: instance.id,
            seriesId: series.id,
            time,
            value: getValue(series)
          })
        }
      }
    }
    await SeriesValue.bulkCreate(data)
  }
}

console.log("Start populating data.")

clearData().then(result => {
  console.log("Old data cleared.")
  setInterval(function () {
    populate().then(result => {
      console.log(`Series data populated at [${new Date().format('yyyy-MM-dd hh:mm:ss')}]`)
    })
  }, timeout)
})
