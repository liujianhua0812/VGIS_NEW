require('../libs/Date')()
const Op = require('sequelize').Op
let config = require('../config')
let dbconfig = config.database.postgres;
const timeout = 3000
let db = null
const Meta = require("../database/models/series_value_metas")

let targetModels = ["电表", "可再生能源电表", "水表", "蒸汽表", "天然气表"]

async function clearData() {
    db = await require('../database')(
        dbconfig.dbname,
        dbconfig.username,
        dbconfig.password,
        dbconfig.config
    )
    let Model = db.models.model
    let models = await Model.findAll({
        where: {
            name: {
                [Op.in]: targetModels
            }
        }
    })
    for (let i = 0; i < models.length; i++) {
        let model = models[i]
        let SeriesValue = db.models[Meta.getTableId(model.id)]
        await SeriesValue.destroy({
            where: {}
        })
    }
}

async function populate() {
    let START_DATE = new Date(2024, 0, 1)
    let END_DATE = new Date(2025, 12, 1)
    let Model = db.models.model
    let Instance = db.models.model_instance
    let TimeSeries = db.models.time_series
    let models = await Model.findAll({
        where: {
            name: {
                [Op.in]: targetModels
            }
        },
        include: [TimeSeries]
    })

    let time = new Date(), data = []

    function getValue(series) {
        if (series.name === "电量") {
            return 150
        } else if (series.name === "用水量") {
            return 15
        } else if (series.name === "用气量") {
            return 50
        } else if (series.name === "用汽量") {
            return 1
        } else {
            return 2
        }
    }


    let dates = []
    for (let k = new Date(START_DATE.getTime()); k <= new Date(END_DATE.getTime()); k.setMinutes(k.getMinutes() + 10)) {
        dates.push(new Date(k.getTime()))
    }

    for (let i = 0; i < models.length; i++) {
        let model = models[i]
        let SeriesValue = db.models[Meta.getTableId(model.id)]
        let instances = await Instance.findAll({
            where: {
                modelId: model.id
            }
        })
        data = []
        for (let j = 0; j < instances.length; j++) {
            let instance = instances[j]
            for (let k = 0; k < model.time_series.length; k++) {
                let series = model.time_series[k]
                if (!series.isVirtual) {
                    let value = Math.random() * getValue(series)
                    for (let l = 0; l < dates.length; l++) {
                        data.push({
                            instanceId: instance.id,
                            seriesId: series.id,
                            time: dates[l],
                            value: parseFloat(value.toFixed(series.precision || 2))
                        })
                        value += Math.random() * getValue(series)
                    }
                }
            }
        }
        let BATCH = 50000
        for (let j = 0; j < data.length; j += BATCH) {
            await SeriesValue.bulkCreate(data.slice(j, j + BATCH))
        }
        console.log(`Data for [${model.name}] populated.`)
    }
}

console.log("Start populating data.")

clearData().then(result => {
    console.log("Old data cleared.")
    populate().then(result => {
        console.log(`Series data for meters populated!`)
    })
})
