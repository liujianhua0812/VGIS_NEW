const fs = require('fs').promises
const Op = require('sequelize').Op

exports.index = async (ctx, next) => {
  let PID = global.db.models.pid
  let Instance = global.db.models.model_instance
  let instance = await Instance.findOne({
    where: {
      [Op.or]: [{
        id: ctx.params.instanceId
      }, {
        instanceId: ctx.params.instanceId
      }]
    }
  })
  let pids = await PID.findAll({
    attributes: ["id", "name", "nodeId"],
    where: {
      nodeId: instance.id
    }
  })
  ctx.body = {
    data: pids
  }
}

exports.show = async (ctx, next) => {
  let PID = global.db.models.pid
  let Instance = global.db.models.model_instance
  let instance = await Instance.findOne({
    where: {
      [Op.or]: [{
        id: ctx.params.instanceId
      }, {
        instanceId: ctx.params.instanceId
      }]
    }
  })
  let pid = await PID.findOne({
    where: {
      nodeId: instance.id,
      name: ctx.params.pidId
    }
  })
  pid.dataValues.map = new Buffer(pid.map, 'base64').toString()
  ctx.body = {
    data: pid
  }
}
