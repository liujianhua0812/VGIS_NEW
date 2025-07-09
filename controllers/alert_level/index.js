exports.index = async (ctx, next) => {
    let AlertLevel = global.db.models.alert_level
    let records = await AlertLevel.findAll({
        order: [["level", "ASC"]]
    })
    return ctx.body = {
        data: records
    }
}