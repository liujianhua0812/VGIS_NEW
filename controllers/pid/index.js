let fs = require('fs').promises
const Op = require('sequelize').Op
/**
 * 获取特定区域的PID图
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
exports.index = async (ctx, next) => {
    let PID = global.db.models.pid
    let query = {}
    if (ctx.request.query.name) {
        query = {
            name: {
                [Op.iLike]: `%${ctx.request.query.name.split('').join('%')}%`
            }
        }
    }
    if (["true", "false"].includes(ctx.request.query.published)) {
        query.published = ctx.request.query.published === "true"
    }
    let pid = await PID.findAll({
        where: query,
        order: [
            ["isDefault", "DESC"],
            ["createdAt", "DESC"]
        ]
    })
    ctx.body = {
        data: pid
    }
}

/**
 * 获取特定区域的PID图
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
exports.show = async (ctx, next) => {
    let PID = global.db.models.pid
    let Instance = global.db.models.model_instance
    let Model = global.db.models.model
    let Point = global.db.models.pid_anchor_point
    let pid = await PID.findByPk(ctx.params.diagramId, {
        include: [Point, {
            model: Instance,
            include: [Model]
        }]
    })
    let anchor_points = pid.pid_anchor_points
    pid = Object.assign({}, pid.dataValues, {
        model_instance: pid.model_instance
    })
    let points = []
    for(let i = 0; i < anchor_points.length; i++) {
        let configuration = JSON.parse(anchor_points[i].configurationStr)
        let type = anchor_points[i].type
        if (type === "control") {
            delete configuration.encryptedPassword
            delete configuration.password
            delete configuration.confirmPassword
        }
        delete anchor_points[i].dataValues.configurationStr
        points.push(Object.assign({}, anchor_points[i].dataValues, { configuration }))
    }
    pid.pid_anchor_points = points
    pid.map = new Buffer(pid.map, 'base64').toString()
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
        nodeId: null,
        map: pidData.toString("base64")
    })
    ctx.body = {}
}

exports.update = async (ctx, next) => {
    let PID = global.db.models.pid
    let Point = global.db.models.pid_anchor_point
    let record = await PID.findByPk(ctx.params.diagramId)
    if (ctx.request.body.rules) {
        await Point.destroy({
            where: {
                diagramId: ctx.params.diagramId
            }
        })
        await Point.bulkCreate(ctx.request.body.rules.map(item => {
            delete item.configuration.extra
            item.diagramId = ctx.params.diagramId
            return item
        }))
    }
    if (ctx.request.body.isDefault) {
        await PID.update({
            isDefault: false
        }, {
            where: {}
        })
    }
    Object.assign(record, ctx.request.body)
    await record.save()
    ctx.body = {}
}

exports.destroy = async (ctx, next) => {
    let PID = global.db.models.pid
    await PID.destroy({
        where: {
            id: ctx.params.diagramId
        }
    })
    ctx.body = {}
}

exports.points = require("./point")