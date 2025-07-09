const Sequelize = require('sequelize')
const Op = Sequelize.Op
const ExcelJS = require('exceljs')
const Meta = require("../../../database/models/series_value_metas");

exports.index = async (ctx, next) => {
    let Instance = global.db.models.model_instance
    let instance = await Instance.findByPk(ctx.params.instanceId)
    let SeriesValue = global.db.models[Meta.getTableId(instance.modelId)]

    let page = parseInt(ctx.request.query.page)
    let pagination = parseInt(ctx.request.query.pagination)

    page = isNaN(page) || page < 1 ? 1 : page
    pagination = isNaN(pagination) || pagination < 1 ? 1 : pagination

    let offset = (page - 1) * pagination, limit = pagination

    let series =  await SeriesValue.findAll({
        attributes: ["time"],
        where: {
            instanceId: ctx.params.instanceId
        },
        group: ["time"],
        order: [["time", "desc"]],
        offset,
        limit
    })

    if (series.length === 0) {
        let total = 0
        return ctx.body = {
            data: series,
            pagination: {
                page: page,
                total: total,
                pagination: pagination,
                totalPage: Math.ceil(total/pagination)
            }
        }
    }

    let min = Math.min(...series.map(item => item.time))
    let max = Math.max(...series.map(item => item.time))

    let total = (await SeriesValue.findAll({
        attributes: ["time"],
        attribute: [Sequelize.fn('COUNT', "time")],
        where: {
            instanceId: ctx.params.instanceId
        },
        group: ["time"]
    })).length

    series = await SeriesValue.findAll({
        where: {
            instanceId: ctx.params.instanceId,
            time: {
                [Op.between]: [new Date(min), new Date(max)]
            }
        },
    })

    series = series.reduce((result, record) => {
        let time = new Date(record.time).format('yyyy-MM-dd hh:mm:ss')
        if (!result[time]) {
            result[time] = {}
        }
        result[time][record.seriesId] = {
            id: record.id,
            value: record.value
        }
        return result
    }, {})
    series = Object.entries(series).map(entry => ({
        time: new Date(entry[0]),
        data: entry[1]
    }))

    ctx.body = {
        data: series,
        pagination: {
            page: page,
            total: total,
            pagination: pagination,
            totalPage: Math.ceil(total/pagination)
        }
    }
}

exports.latest = async (ctx, next) => {
    let Instance = global.db.models.model_instance
    let instance = await Instance.findByPk(ctx.params.instanceId)
    let SeriesValue = global.db.models[Meta.getTableId(instance.modelId)]

    let series =  await SeriesValue.findAll({
        attributes: ["seriesId", [Sequelize.fn("MAX", Sequelize.col("time")), "time"]],
        where: {
            instanceId: ctx.params.instanceId
        },
        group: ["seriesId"],
        order: [["time", "desc"]],
    })

    series = await SeriesValue.findAll({
        where: {
            instanceId: ctx.params.instanceId,
            [Op.or]: series.map(item => ({
                seriesId: item.seriesId,
                time: item.time
            }))
        }
    })

    ctx.body = {
        data: series
    }
}

exports.show = async (ctx, next) => {
    let Instance = global.db.models.model_instance
    let instance = await Instance.findByPk(ctx.params.instanceId)
    let SeriesValue = global.db.models[Meta.getTableId(instance.modelId)]

    let query = {
        instanceId: ctx.params.instanceId,
        seriesId: ctx.params.seriesId,
    }

    if (ctx.request.query.startAt || ctx.request.query.endAt) {
        query.time = {
            [Op.between]: [
                ctx.request.query.startAt ? new Date(ctx.request.query.startAt) : new Date(0),
                ctx.request.query.endAt ? new Date(ctx.request.query.endAt) : new Date(),
            ]
        }
    }

    let page = parseInt(ctx.request.query.page)
    let pagination = parseInt(ctx.request.query.pagination)

    page = isNaN(page) || page < 1 ? 1 : page
    pagination = isNaN(pagination) || pagination < 1 ? 1 : pagination

    let data =  await SeriesValue.findAll({
        where: query,
        order: [['time', 'DESC']],
        offset: (page - 1) * pagination,
        limit: pagination
    })

    let total = await SeriesValue.count({
        where: query
    })

    ctx.body = {
        data,
        pagination: {
            page: page,
            total: total,
            pagination: pagination,
            totalPage: Math.ceil(total/pagination)
        }
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
        data: {}
    }
}

exports.importTemplate = async (ctx, next) => {
    let Model = global.db.models.model
    let ModelInstance = global.db.models.model_instance
    let TimeSeries = global.db.models.time_series
    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet('Data');

    let instance = await ModelInstance.findByPk(ctx.params.instanceId, {
        include: [{
            model: Model,
            include: [{
                model: TimeSeries,
                where: {
                    id: ctx.params.seriesId
                }
            }]
        }]
    })

    sheet.addRow(['Time'].concat(instance.model.time_series.map(item => item.name)));
    ctx.set('Content-Type', 'application/vnd.openxmlformats');
    ctx.set("Content-Disposition", "attachment; filename=template.xlsx");
    ctx.body = await workbook.xlsx.writeBuffer()
}

exports.import = async (ctx, next) => {
    let TimeSeries = global.db.models.time_series
    let ModelInstance = global.db.models.model_instance
    let Model = global.db.models.model

    let instance = await ModelInstance.findByPk(ctx.params.instanceId, {
        include: [{
            model: Model,
            include: [{
                model: TimeSeries,
                where: {
                    id: ctx.params.seriesId
                }
            }]
        }]
    })

    let SeriesValue = global.db.models[Meta.getTableId(instance.modelId)]

    let series = instance.model.time_series[0]

    if (series) {
        let template = ctx.request.files.template

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(template.path);

        const worksheet = workbook.getWorksheet('Data');

        let data = []
        for(let i = 2; i <= worksheet.rowCount; i++) {
            try {
                let time = new Date(worksheet.getCell(i, 1).value)
                let value = worksheet.getCell(i, 2).value
                if (!isNaN(time.getTime())) {
                    data.push({
                        time,
                        value,
                        instanceId: ctx.params.instanceId,
                        seriesId: ctx.params.seriesId
                    })
                }
            }
            catch (err) {}
        }

        await SeriesValue.bulkCreate(data)
        if (data.length > 0) {
            instance.updatedAt = new Date()
            await instance.save()
        }
    }

    ctx.body = {
        data: {}
    }
}

exports.update = async (ctx, next) => {
    let Instance = global.db.models.model_instance
    let time = new Date(ctx.request.body.time)
    delete ctx.request.body.time
    delete ctx.request.body.id
    let instance = await Instance.findByPk(ctx.params.instanceId)
    let SeriesValue = global.db.models[Meta.getTableId(instance.modelId)]
    let series =  await SeriesValue.findAll({
        where: {
            instanceId: ctx.params.instanceId,
            time
        }
    })
    for(let i = 0; i < series.length; i++) {
        if(ctx.request.body[series[i].seriesId]) {
            series[i].value = ctx.request.body[series[i].seriesId]
            delete ctx.request.body[series[i].seriesId]
        }
    }
    await SeriesValue.bulkCreate(series.map(item => item.dataValues), {
        updateOnDuplicate: ['value']
    })
    await SeriesValue.bulkCreate(Object.entries(ctx.request.body).map(entry => ({
        time,
        instanceId: ctx.params.instanceId,
        seriesId: entry[0],
        value: entry[1]
    })))
    instance.updatedAt = new Date()
    await instance.save()
    ctx.body = {
        data: {}
    }
}

exports.destroy = async (ctx, next) => {
    let Instance = global.db.models.model_instance
    let instance = await Instance.findByPk(ctx.params.instanceId)
    let SeriesValue = global.db.models[Meta.getTableId(instance.modelId)]
    let series =  await SeriesValue.destroy({
        where: {
            instanceId: ctx.params.instanceId,
            id: {
                [Op.in]: ctx.request.body.ids
            }
        }
    })
    instance.updatedAt = new Date()
    await instance.save()
    ctx.body = {
        data: []
    }
}

exports.value = require('./value')

exports.domain = require('./domain')

exports.configure = require('./configure')