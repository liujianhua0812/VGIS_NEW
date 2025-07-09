const Op = require('sequelize').Op
const messages = require('../../../libs/Error').messages
const DashboardGroupController = require('../../dashboard_group')

exports.index = async (ctx, next) => {
  const DashboardGroup = global.db.models.dashboard_group
  const DashboardTemplate = global.db.models.dashboard_template
  let query = {}
  if (ctx.request.query.query) {
    query = {
      [Op.or]: [{
        name: {
          [Op.like]: `%${ctx.request.query.query}%`
        }
      }]
    }
  }
  let models = await DashboardTemplate.findAll({
    where: query,
    attributes: ["id", "name", "thumbnail", "groupId"]
  })
  if (ctx.request.query.query) {
    let nodes = [].concat(models)
    nodes.sort((n1, n2) => n1.updatedAt - n2.updatedAt)
    ctx.body = {
      data: nodes
    }
  }
  else {
    let groups = await DashboardGroup.findAll({
      where: {
        dashboardType: "Template"
      },
      attributes: ["id", "name", "groupId"]
    })
    let nodes = models.concat(groups)
    nodes.sort((n1, n2) => n1.updatedAt - n2.updatedAt)
    let parentMap = nodes.reduce((result, node) => {
      result[node.id] = []
      return result
    }, {})
    for(let i = 0; i < nodes.length; i++) {
      if (nodes[i].groupId) {
        parentMap[nodes[i].groupId].push(nodes[i])
      }
    }
    for(let i = 0; i < nodes.length; i++) {
      nodes[i].dataValues.children = parentMap[nodes[i].id]
    }
    ctx.body = {
      data: nodes.filter(item => !item.groupId)
    }
  }
}

exports.show = async (ctx, next) => {
  const DashboardTemplate = global.db.models.dashboard_template
  let template = await DashboardTemplate.findByPk(ctx.params.templateId)
  ctx.body = {
    data: template
  }
}

exports.create = async (ctx, next) => {
  const DashboardTemplate = global.db.models.dashboard_template
  if (!(await DashboardGroupController.verifyGroup(ctx.request.body.groupId, "Template"))) {
    throw new Error(messages.controller.dashboard.INVALID_GROUP)
  }
  let template = await DashboardTemplate.create(Object.assign(ctx.request.body))
  ctx.body = {
    data: template
  }
}

exports.update = async (ctx, next) => {
  const DashboardTemplate = global.db.models.dashboard_template
  let template = await DashboardTemplate.findByPk(ctx.params.templateId)
  if (!template) {
    throw new Error(messages.controller.shared.ITEM_NOT_FOUND)
  }
  if (!(await DashboardGroupController.verifyGroup(ctx.request.body.groupId, "Template"))) {
    throw new Error(messages.controller.dashboard.INVALID_GROUP)
  }
  Object.assign(template, ctx.request.body)
  if (ctx.request.body.groupId === "null") {
    template.groupId = null
  }
  template = await template.save()
  ctx.body = {
    data: template
  }
}

exports.destroy = async (ctx, next) => {
  const DashboardTemplate = global.db.models.dashboard_template
  let template = await DashboardTemplate.findByPk(ctx.params.templateId)
  if (!template) {
    throw new Error(messages.controller.shared.ITEM_NOT_FOUND)
  }
  await template.destroy()
  ctx.body = {
    data: {}
  }
}
