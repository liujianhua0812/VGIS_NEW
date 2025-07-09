const Sequelize = require('sequelize')
const { Op } = Sequelize
const Meta = require("../../database/models/series_value_metas");

exports.general = async (ctx, next) => {
    let Instance = global.db.models.model_instance
    let Alert = global.db.models.alert
    let Account = global.db.models.account

    let recordsSum = 0
    for(let name in global.db.models) {
        if (name.match(/^vgis_.*$/)) {
            recordsSum += await global.db.models[name].count()
        }
    }

    return ctx.body = {
        data: {
            instance: await Instance.count(),
            alert: await Alert.count(),
            event: recordsSum,
            user: await Account.count()
        }
    }
}

exports.series = async (ctx, next) => {
    let endDate = new Date(ctx.request.query.endAt), startDate = new Date(ctx.request.query.startAt)
    let TimeSeries = global.db.models.time_series
    let Model = global.db.models.model

    let models = await Model.findAll({})

    let result = {}, format = "yyyy-MM-dd hh:00:00"
    for(let i = 0; i < models.length; i++) {
        let model = models[i]
        let SeriesValue = global.db.models[Meta.getTableId(model.id)]
        let records = await SeriesValue.findAll({
            attributes: [
                [ Sequelize.fn("DATE_TRUNC", "hour", Sequelize.col('time')), "time_h" ],
                [ Sequelize.fn("COUNT", Sequelize.col('id')), "count" ]
            ],
            where: {
                time: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                }
            },
            group: [ "time_h" ],
            order: [[ "time_h", "ASC" ]]
        })
        for(let i = 0; i < records.length; i++) {
            let record = records[i].dataValues
            let time = record.time_h
            let count = parseInt(record.count)
            if (!result[time.format(format)]) {
                result[time.format(format)] = 0
            }
            result[time.format(format)] += count
        }
    }

    // startDate.setDate(startDate.getDate() - 7)
    return ctx.body = {
        data: Object.entries(result).map(entry => ({ time_h: new Date(entry[0]), count: entry[1] })).sort((i1, i2) => i1.time_h - i2.time_h)
    }
}

exports.alert = async (ctx, next) => {
    let Alert = global.db.models.alert
    let endDate = new Date(), startDate = new Date(0)
    // startDate.setDate(startDate.getDate() - 7)
    return ctx.body = {
        data: await Alert.findAll({
            attributes: [
                [ Sequelize.fn("DATE_TRUNC", "day", Sequelize.col('createdAt')), "date" ],
                [ Sequelize.fn("COUNT", Sequelize.col('id')), "count" ]
            ],
            where: {
                createdAt: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                }
            },
            group: [ "date" ],
            order: [[ "date", "ASC" ]]
        })
    }
}

exports.instance = async (ctx, next) => {
    let Instance = global.db.models.model_instance
    let Model = global.db.models.model
    return ctx.body = {
        data: await Model.findAll({
            attributes: [
                "id",
                "name",
                [ Sequelize.fn("COUNT", "model_instances.id"), "count" ]
            ],
            include: [{
                attributes: [],
                model: Instance
            }],
            group: [Sequelize.col("model.id"), Sequelize.col("model.name")]
        })
    }
}