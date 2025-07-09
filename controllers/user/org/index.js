
exports.index = async (ctx, next) => {
    let Org = ctx.app.db.models.org
    ctx.body = {
        data: await Org.findAll({
            order: [["prName", "ASC"]]
        })
    }
}
