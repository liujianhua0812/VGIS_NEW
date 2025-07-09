const {Op} = require("sequelize");

exports.index = async (ctx, next) => {
    const Series = global.db.models.time_series
    const Unit = global.db.models.unit
    let query = {}

    let series = await Series.findAll({
        where: query,
        include: [Unit]
    })
    return ctx.body = {
        data: series
    }
}