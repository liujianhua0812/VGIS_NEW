
exports.index = async (ctx, next) => {
    const Unit = global.db.models.unit
    ctx.body = {
        data: await Unit.findAll()
    }
}
