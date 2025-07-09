require('../libs/Date')()
const Op = require('sequelize').Op
let config = require('../config')
let dbconfig = config.database.postgres;
const timeout = 3000
let db = null
const Meta = require('../database/models/series_value_metas')

let targetSeries = ["能耗指标", "产量"]

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
    let TopStation = await Model.findOne({
        where: {
            name: "总场站"
        }
    })
    let SeriesValue = db.models[Meta.getTableId(TopStation.id)]
    let series = await TimeSeries.findAll({
        where: {
            modelId: TopStation.id,
            name: {
                [Op.in]: targetSeries
            }
        }
    })
    let instances = await Instance.findAll({
        where: {
            modelId: TopStation.id
        }
    })
    await SeriesValue.destroy({
        where: {
            instanceId: {
                [Op.in]: instances.map(item => item.id)
            },
            seriesId: {
                [Op.in]: series.map(item => item.id)
            }
        }
    })
}

clearData().then(result => {
    console.log("Series data cleared.")
})
