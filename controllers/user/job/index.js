
exports.index = async (ctx, next) => {
    let Job = ctx.app.db.models.job
    ctx.body = {
        data: await Job.findAll({
            order: [["prName", "ASC"]]
        })
    }
}
