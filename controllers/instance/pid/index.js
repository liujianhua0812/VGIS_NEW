const fs = require('fs').promises

exports.index = async (ctx, next) => {
  let PID = global.db.models.pid
  let pids = await PID.findAll({
    where: {
      nodeId: ctx.params.instanceId
    }
  })
  for(let i = 0; i < pids.length; i++) {
    pids[i].dataValues.map = new Buffer(pids[i].dataValues.map, 'base64').toString()
  }
  ctx.body = {
    data: pids
  }
}

exports.show = async (ctx, next) => {
  let PID = global.db.models.pid
  let pid = await PID.findByPk(ctx.params.pidId)
  pid.dataValues.map = new Buffer(pid.map, 'base64').toString()
  ctx.body = {
    data: pid
  }
}

exports.create = async (ctx, next) => {
  let PID = global.db.models.pid
  let pid = ctx.request.files.pid
  let pidData = await fs.readFile(pid.path)
  let data = await PID.create({
    name: ctx.request.body.name,
    nodeId: ctx.params.instanceId,
    map: pidData.toString("base64")
  })
  ctx.body = {}
}

exports.update = async (ctx, next) => {
  let PID = global.db.models.pid
  let pid = ctx.request.files.pid
  let pidData = await fs.readFile(pid.path)
  let record = await PID.findByPk(ctx.params.pidId)
  Object.assign(record, {
    name: ctx.request.body.name,
    map: pidData.toString("base64")
  })
  await record.save()
  ctx.body = {}
}

exports.destroy = async (ctx, next) => {
  let PID = global.db.models.pid
  let pid = await PID.findByPk(ctx.params.pidId)
  if (pid) {
    await pid.destroy()
  }
  ctx.body = {}
}
