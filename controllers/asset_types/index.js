const messages = require('../../libs/Error').messages
const {Op, Sequelize} = require("sequelize");

exports.index = async (ctx, next) => {
    let AssetType = global.db.models.asset_type
    let records = await AssetType.findAll({})
    return ctx.body = {
        data: records
    }
}