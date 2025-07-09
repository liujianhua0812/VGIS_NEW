const messages = require('../../libs/Error').messages
const {Op, Sequelize} = require("sequelize");

exports.stat = async (ctx, next) => {
    let AssetType = global.db.models.asset_type
    let CarbonAsset = global.db.models.carbon_asset

    let types = await AssetType.findAll({})
    let typeMap = types.reduce((result, item) => {
        result[item.id] = item.name
        return result
    }, {})

    let query = {}
    if (ctx.request.query.year) {
        let year = parseInt(ctx.request.query.year)
        if (!isNaN(year)) {
            query = {
                dealAt: {
                    [Op.gte]: new Date(year, 0, 1),
                    [Op.lt]: new Date(year + 1, 0, 1)
                }
            }
        }
    }

    let stat = await CarbonAsset.findAll({
        where: query,
        attributes: [
            [Sequelize.fn("SUM", Sequelize.col("price")), "total_price"],
            [Sequelize.fn("SUM", Sequelize.col("carbon")), "total_carbon"],
            "typeId"
        ],
        group: "typeId"
    })
    stat = stat.reduce((result, item) => {
        result[typeMap[item.typeId]] = {
            carbon: item.dataValues.total_carbon,
            price: item.dataValues.total_price,
        }
        return result
    }, {})
    ctx.body = {
        data: stat
    }
}

exports.index = async (ctx, next) => {
    let AssetType = global.db.models.asset_type
    let CarbonAsset = global.db.models.carbon_asset
    let MediaFile = global.db.models.media_file
    let User = global.db.models.user

    let page = parseInt(ctx.request.query.page)
    let pagination = parseInt(ctx.request.query.pagination)
    page = isNaN(page) ? 1 : page
    pagination = isNaN(pagination) ? 10 : pagination

    let query = {}
    if (ctx.request.query.dealAt) {
        query= {
            dealAt: {
                [Op.gte]: ctx.request.query.dealAt[0] || undefined,
                [Op.lte]: ctx.request.query.dealAt[1] || undefined
            }
        }
    }

    if (ctx.request.query.typeId) {
        query.typeId = ctx.request.query.typeId
    }

    let records = await CarbonAsset.findAll({
        where: query,
        offset: (page - 1) * pagination,
        limit: pagination,
        include: [{
            model: User,
            attributes: ["realName"]
        }, {
            model: AssetType
        }, {
            model: MediaFile,
            attributes: ["id", "name", "contentType", "assetId"]
        }],
        order: [
            ["dealAt", "DESC"]
        ]
    })
    let total = await CarbonAsset.count({ where: query })
    return ctx.body = {
        data: records,
        pagination: {
            page,
            pagination,
            total,
            total_page: Math.ceil(total / pagination)
        }
    }
}

exports.create = async (ctx, next) => {
    let CarbonAsset = global.db.models.carbon_asset
    let MediaFile = global.db.models.media_file
    ctx.request.body.recorderId = ctx.session.current_user.user.id
    let record = await CarbonAsset.create(ctx.request.body)
    await MediaFile.update({
        assetId: record.id
    }, {
        where: {
            id: {
                [Op.in]: ctx.request.body.attachments
            }
        }
    })
    return ctx.body = {
        data: record
    }
}

exports.update = async (ctx, next) => {
    let CarbonAsset = global.db.models.carbon_asset
    let MediaFile = global.db.models.media_file
    let attachments = ctx.request.body.attachments || []
    let record = await CarbonAsset.findByPk(ctx.params.assetId)
    if (record) {
        ctx.request.body.recorderId = ctx.session.current_user.user.id
        Object.assign(record, ctx.request.body)
        record = await record.save()
        await MediaFile.update({
            assetId: record.id
        }, {
            where: {
                id: {
                    [Op.in]: attachments
                }
            }
        })
        await MediaFile.destroy({
            where: {
                assetId: record.id,
                id: {
                    [Op.notIn]: attachments
                }
            }
        })
    }
    return ctx.body = {
        data: record || {}
    }
}

exports.destroy = async (ctx, next) => {
    let CarbonAsset = global.db.models.carbon_asset
    let MediaFile = global.db.models.media_file
    let record = await CarbonAsset.findByPk(ctx.params.assetId)
    if (record) {
        await record.destroy()
        await MediaFile.destroy({
            where: {
                assetId: record.id
            }
        })
    }
    return ctx.body = {}
}

exports.bulkDestroy = async (ctx, next) => {
    let CarbonAsset = global.db.models.carbon_asset
    let MediaFile = global.db.models.media_file
    if (ctx.request.query.recordIds) {
        if (!(ctx.request.query.recordIds instanceof Array)) {
            ctx.request.query.recordIds = [ctx.request.query.recordIds]
        }
    }
    else {
        ctx.request.query.recordIds = []
    }
    await CarbonAsset.destroy({
        where: {
            id: {
                [Op.in]: ctx.request.query.recordIds
            }
        }
    })
    await MediaFile.destroy({
        where: {
            assetId: {
                [Op.in]: ctx.request.query.recordIds
            }
        }
    })
    return ctx.body = {}
}