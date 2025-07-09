const messages = require('../../libs/Error').messages

exports.verifyGroup = async (groupId, type) => {
  const DashboardGroup = global.db.models.dashboard_group
  // 如果有groupId，则进行判断
  if (groupId && groupId !== "null") {
    // 修正当前的dashboardType
    let dashboardType = type === "Template" ? "Template" : "Dashboard"
    // 取得parent
    let parent = await DashboardGroup.findByPk(groupId)
    // 如果parent不存在，或类型不对，则返回false
    if (!parent || parent.dashboardType !== dashboardType) {
      return false
    }
  }
  return true
}

exports.create = async (ctx, next) => {
  const DashboardGroup = global.db.models.dashboard_group
  if (!(await exports.verifyGroup(ctx.request.body.groupId, ctx.request.body.dashboardType))) {
    throw new Error(messages.controller.dashboard.INVALID_GROUP)
  }
  let group = await DashboardGroup.create(ctx.request.body)
  ctx.body = {
    data: group
  }
}

exports.update = async (ctx, next) => {
  const DashboardGroup = global.db.models.dashboard_group
  let group = await DashboardGroup.findByPk(ctx.params.groupId)
  if (!group) {
    throw new Error(messages.controller.shared.ITEM_NOT_FOUND)
  }
  if (!(await exports.verifyGroup(ctx.request.body.groupId, group.dashboardType))) {
    throw new Error(messages.controller.dashboard.INVALID_GROUP)
  }
  delete ctx.request.body.dashboardType
  Object.assign(group, ctx.request.body)
  if (ctx.request.body.groupId === 'null') {
    group.groupId = null
  }
  group = await group.save()
  ctx.body = {
    data: group
  }
}

exports.destroy = async (ctx, next) => {
  const DashboardGroup = global.db.models.dashboard_group
  let group = await DashboardGroup.findByPk(ctx.params.groupId)
  if (!group) {
    throw new Error(messages.controller.shared.ITEM_NOT_FOUND)
  }
  await group.destroy()
  ctx.body = {
    data: {}
  }
}
