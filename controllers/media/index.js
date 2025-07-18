const Op = require('sequelize').Op
let fs = require('fs').promises
const messages = require('../../libs/Error').messages

exports.index = async (ctx, next) => {
  let Media = global.db.models.media_file
  let Instance = global.db.models.model_instance
  let query = {}
  let fileIds = ctx.request.query.fileIds

  let page = parseInt(ctx.request.query.page)
  let pagination = parseInt(ctx.request.query.pagination)
  if (isNaN(page) || page < 1) page = 1
  if (isNaN(pagination)) pagination = 40
  let offset = (page - 1) * pagination

  if (ctx.request.query.instanceId) {
    let instance = await Instance.findOne({
      where: {
        [Op.or]: [{
          id: ctx.request.query.instanceId
        }, {
          name: ctx.request.query.instanceId
        }, {
          instanceId: ctx.request.query.instanceId
        }]
      }
    })
    if (instance) {
      query = {
        [Op.or]: [{
          instanceId: instance.id
        }, {
          modelId: instance.modelId
        }]
      }
    }
  }

  if (fileIds) {
    if (!(fileIds instanceof Array)) {
      fileIds = [ fileIds ]
    }
    query.id = {
      [Op.in]: fileIds
    }
  }
  let type = ctx.request.query.type
  if (type) {
    if (!(type instanceof Array)) {
      type = [ type ]
    }
    query.contentType = {
      [Op.in]: type
    }
  }
  if (ctx.request.query.query) {
    query.name = {
      [Op.iLike]: `%${ctx.request.query.query.split('').join('%')}%`
    }
  }
  if (ctx.request.query.modelId) {
    query.modelId = ctx.request.query.modelId
  }

  let data = await Media.findAll({
    attributes: ["id", "name", "contentType", "extraStr", "extra", "modelId", "instanceId", "uploaderid", "createdAt", "updatedAt"],
    where: query,
    limit: pagination,
    offset,
    include: [{
      model: global.db.models.user,
      as: 'uploader',
      attributes: ['realName'],
      required: false
    }]
  })
  let total = await Media.count({
    where: query
  })
  ctx.body = {
    data,
    pagination: {
      page,
      pagination,
      total,
      totalPage: Math.ceil(total / pagination)
    }
  }
}

exports.show = async (ctx, next) => {
  let Media = global.db.models.media_file
  let file = await Media.findByPk(ctx.params.mediaId)
  ctx.body = Buffer.from(file.content, "base64")
}

exports.create = async (ctx, next) => {
  let Media = global.db.models.media_file
  if (ctx.request.files && ctx.request.files.file) {
    let file = ctx.request.files.file
    let data = await fs.readFile(file.path)
    let media = await Media.create({
      name: file.name,
      contentType: file.type,
      content: data.toString("base64"),
      modelId: ctx.request.body.modelId || null,
      instanceId: ctx.request.body.instanceId || null,
      uploaderid: ctx.session.current_user ? ctx.session.current_user.uid : null,
    })
    delete media.dataValues.content
    ctx.body = {
      data: media
    }
  }
  else {
    throw new Error(messages.controller.media.NO_ATTACHMENT_FOUND)
  }
}

exports.destroy = async (ctx, next) => {
  let Media = global.db.models.media_file
  let file = await Media.findByPk(ctx.params.mediaId)
  if (file) {
    await file.destroy()
  }
  return ctx.body = {}
}

exports.types = require('./types')
