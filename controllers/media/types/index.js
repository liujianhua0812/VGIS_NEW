
exports.index = async (ctx, next) => {
  let Media = global.db.models.media_file
  ctx.body = {
    data: (await Media.findAll({
      attributes: ['contentType'],
      group: "contentType"
    })).map(item => item.contentType)
  }
}
