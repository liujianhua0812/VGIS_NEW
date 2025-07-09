const Sequelize = require('sequelize')
const Op = Sequelize.Op

exports.index = async (ctx, next) => {
    let AlertTemplate = global.db.models.alert_template
    let PersonRelation = global.db.models.person_relation
    let User = global.db.models.user
    let DeviceRelation = global.db.models.device_relation
    let Instance = global.db.models.model_instance
    let templates = await AlertTemplate.findAll({
        where: {
            modelId: ctx.params.modelId
        },
        include: [{
            model: PersonRelation,
            include: [{
                model: User,
                attributes: ["id", "realName"]
            }]
        }, {
            model: DeviceRelation,
            include: [{
                model: Instance
            }]
        }],
    })

    ctx.body = {
        data: templates
    }
}

exports.create = async (ctx, next) => {
    let AlertTemplate = global.db.models.alert_template
    let PersonRelation = global.db.models.person_relation
    let DeviceRelation = global.db.models.device_relation
    let Instance = global.db.models.model_instance
    let transaction = await global.db.transaction()

    let record = await AlertTemplate.create(Object.assign(ctx.params, ctx.request.body), {
        transaction
    })

    if (ctx.request.body.device) {
        await DeviceRelation.bulkCreate(ctx.request.body.device.map(id => ({
            instanceId: id,
            templateId: record.id
        })), {
            transaction
        })
    }
    if (ctx.request.body.solver) {
        await PersonRelation.bulkCreate(ctx.request.body.solver.map(id => ({
            userId: id,
            templateId: record.id
        })), {
            transaction
        })
    }

    try {
        await transaction.commit()
        return ctx.body = {
            data: record
        }
    }
    catch (err) {
        await transaction.rollback()
        throw err
    }
}

exports.update = async (ctx, next) => {
    let AlertTemplate = global.db.models.alert_template
    let PersonRelation = global.db.models.person_relation
    let DeviceRelation = global.db.models.device_relation
    let Instance = global.db.models.model_instance

    let transaction = await global.db.transaction()

    let record = await AlertTemplate.findOne({
        where: {
            id: ctx.params.templateId,
            modelId: ctx.params.modelId,
        },
        transaction
    })
    Object.assign(record, ctx.request.body)

    if (ctx.request.body.device) {
        await DeviceRelation.destroy({
            where: {
                templateId: record.id
            },
            transaction
        })
        await DeviceRelation.bulkCreate(ctx.request.body.device.map(id => ({
            instanceId: id,
            templateId: record.id
        })), {
            transaction
        })
    }
    if (ctx.request.body.solver) {
        await PersonRelation.destroy({
            where: {
                templateId: record.id
            },
            transaction
        })
        await PersonRelation.bulkCreate(ctx.request.body.solver.map(id => ({
            userId: id,
            templateId: record.id
        })), {
            transaction
        })
    }

    record = await record.save({
        transaction
    })
    try {
        await transaction.commit()
        return ctx.body = {
            data: record
        }
    }
    catch (err) {
        await transaction.rollback()
        throw err
    }
}

exports.destroy = async (ctx, next) => {
    let AlertTemplate = global.db.models.alert_template
    let template = await AlertTemplate.findOne({
        where: {
            id: ctx.params.templateId,
            modelId: ctx.params.modelId,
        }
    })
    await template.destroy()
    ctx.body = {}
}