const Op = require('sequelize').Op
const messages = require('../../libs/Error').messages
const DashboardGroupController = require('../dashboard_group')

exports.index = async (ctx, next) => {
  const DashboardGroup = global.db.models.dashboard_group
  const Dashboard = global.db.models.dashboard
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
  if (ctx.request.query.published) {
    query.published = ctx.request.query.published === "true"
  }
  let models = await Dashboard.findAll({
    where: query,
    attributes: ["id", "name", "thumbnail", "published", "groupId"]
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
        dashboardType: "Dashboard"
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
  const Dashboard = global.db.models.dashboard
  let dashboard = await Dashboard.findByPk(ctx.params.dashboardId)
  ctx.body = {
    data: dashboard
  }
}

exports.create = async (ctx, next) => {
  const Dashboard = global.db.models.dashboard
  delete ctx.request.body.groupId
  if (!(await DashboardGroupController.verifyGroup(ctx.request.body.groupId, "Dashboard"))) {
    throw new Error(messages.controller.dashboard.INVALID_GROUP)
  }
  let dashboard = await Dashboard.create(Object.assign(ctx.request.body))
  ctx.body = {
    data: dashboard
  }
}

exports.update = async (ctx, next) => {
  const Dashboard = global.db.models.dashboard
  let dashboard = await Dashboard.findByPk(ctx.params.dashboardId)
  if (!dashboard) {
    throw new Error(messages.controller.shared.ITEM_NOT_FOUND)
  }
  if (!(await DashboardGroupController.verifyGroup(ctx.request.body.groupId, "Dashboard"))) {
    throw new Error(messages.controller.dashboard.INVALID_GROUP)
  }
  Object.assign(dashboard, ctx.request.body)
  if (ctx.request.body.groupId === 'null') {
    dashboard.groupId = null
  }
  dashboard = await dashboard.save()
  ctx.body = {
    data: dashboard
  }
}

exports.destroy = async (ctx, next) => {
  const Dashboard = global.db.models.dashboard
  let dashboard = await Dashboard.findByPk(ctx.params.dashboardId)
  if (!dashboard) {
    throw new Error(messages.controller.shared.ITEM_NOT_FOUND)
  }
  await dashboard.destroy()
  ctx.body = {
    data: {}
  }
}

exports.template = require('./template')
