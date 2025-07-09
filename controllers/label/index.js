
exports.index = async (ctx, next) => {
    const Label = global.db.models.label
    ctx.body = {
        data: await Label.findAll({
            order: [['name', 'ASC']]
        })
    }
}
