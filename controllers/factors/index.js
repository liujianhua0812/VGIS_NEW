
const {Op, Sequelize} = require("sequelize");

exports.index = async (ctx, next) => {
    let Factor = global.db.models.conversion_factor
    let Unit = global.db.models.unit

    let factors = await Factor.findAll({
        include: [Unit]
    })
    return ctx.body = {
        data: factors
    }
}

exports.values = require("./values")