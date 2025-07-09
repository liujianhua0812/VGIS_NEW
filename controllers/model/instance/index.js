const Op = require('sequelize').Op
const messages = require('../../../libs/Error').messages
const ProtocolTemplate = require('../../../libs/ProtocolTemplate')
const ExcelJS = require('exceljs')

exports.index = async (ctx, next) => {
    const ModelInstance = global.db.models.model_instance
    let query = {}
    if (ctx.request.query.query) {
        query = {
            [Op.or]: [{
                name: {
                    [Op.iLike]: `%${ctx.request.query.query.split('').join('%')}%`
                }
            }, {
                instanceId: {
                    [Op.iLike]: `%${ctx.request.query.query.split('').join('%')}%`
                }
            }]
        }
    }
    query.modelId = ctx.params.modelId
    let instances = await ModelInstance.findAll({
        where: query,
        order: [['instanceId', 'ASC']]
    })
    ctx.body = {
        data: instances
    }
}

exports.export = async (ctx, next) => {
    const ModelInstance = global.db.models.model_instance
    const AttributeValue = global.db.models.attribute_value
    const Attribute = global.db.models.static_attribute
    const Model = global.db.models.model
    const Unit = global.db.models.unit

    let query = {}
    if (ctx.request.query.query) {
        query = {
            [Op.or]: [{
                name: {
                    [Op.iLike]: `%${ctx.request.query.query.split('').join('%')}%`
                }
            }, {
                instanceId: {
                    [Op.iLike]: `%${ctx.request.query.query.split('').join('%')}%`
                }
            }]
        }
    }
    query.modelId = ctx.params.modelId
    let model = await Model.findByPk(query.modelId, {
        include: [{
            model: Attribute,
            include: [Unit]
        }]
    })

    let instances = await ModelInstance.findAll({
        where: query,
        order: [['instanceId', 'ASC']],
        include: [AttributeValue]
    })

    const workbook = new ExcelJS.Workbook();
    workbook.creator = ctx.session.current_user.uid;
    workbook.lastModifiedBy = ctx.session.current_user.uid;
    workbook.created = new Date();
    workbook.modified = new Date();

    const sheet = workbook.addWorksheet("Sheet 1")
    sheet.properties.defaultColWidth = 35
    sheet.properties.defaultRowHeight = 20

    let header = sheet.addRow(["Name", "Tag"].concat(model.static_attributes.map(attr => `${attr.name}${attr.unit ? ` (Unit: ${attr.unit.name})` : ''}`)))
    header.font = { bold: true }
    header.fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor:{
            argb:'ECF5FF'
        },
    }
    header.alignment = { vertical: 'middle', horizontal: 'center' }

    let indexMap = model.static_attributes.reduce((result, attr, index) => {
        result[attr.id] = index + 2
        return result
    }, {})

    for(let i = 0; i < instances.length; i++) {
        let instance = instances[i]
        let rowData = [instance.name, instance.instanceId]
        for(let j = 0; j < instance.attribute_values.length; j++) {
            let value = instance.attribute_values[j]
            rowData[indexMap[value.attributeId]] = value.value
        }
        let row = sheet.addRow(rowData)
        row.alignment = { vertical: 'middle', horizontal: 'center' }
    }

    ctx.body = await workbook.xlsx.writeBuffer();
}

exports.create = async (ctx, next) => {
    const Model = global.db.models.model
    const StaticAttribute = global.db.models.static_attribute
    const ModelInstance = global.db.models.model_instance
    const AttributeValue = global.db.models.attribute_value
    const InstanceRelation = global.db.models.instance_relation
    const Protocol = global.db.models.protocol
    const Label = global.db.models.label
    const Has = global.db.models.has
    const transaction = await global.db.transaction()
    let model = await Model.findByPk(ctx.params.modelId, {
        include: [StaticAttribute, {
            model: Model,
            as: 'Targets'
        }, {
            model: Model,
            as: 'Sources'
        }]
    })
    for(let i = 0; i < model.static_attributes.length; i++) {
        let attr = model.static_attributes[i]
        if (!ctx.request.body.attribute_values[attr.id] && ctx.request.body.attribute_values[attr.id] !== 0) {
            if (attr.defaultValue) {
                if (['Date', 'DateTime', 'Time'].includes(attr.dataType) && attr.useRealTime) {
                    ctx.request.body.attribute_values[attr.id] = new Date()
                }
                else {
                    ctx.request.body.attribute_values[attr.id] = attr.defaultValue
                }
            }
            else if (['Date', 'DateTime', 'Time'].includes(attr.dataType) && attr.useRealTime) {
                ctx.request.body.attribute_values[attr.id] = new Date()
            }
        }
    }
    let instance = await ModelInstance.create(Object.assign({ rank: 0, published: true }, ctx.request.body, ctx.params), { transaction })
    await AttributeValue.bulkCreate(Object.entries(ctx.request.body.attribute_values).map(item => ({
        attributeId: item[0],
        value: item[1],
        instanceId: instance.id
    })), {
        transaction,
        updateOnDuplicate: ['attributeId', 'instanceId']
    })
    let parentIds = [], childrenIds = []
    for(let i = 0; i < model.Targets.length; i++) {
        let target = model.Targets[i]
        if (ctx.request.body.relations[target.id]) {
            if (target.model_relation.relationType === 'Contain') {
                childrenIds = childrenIds.concat(ctx.request.body.relations[target.id])
            }
            else {
                parentIds = parentIds.concat(ctx.request.body.relations[target.id])
            }
        }
    }

    await InstanceRelation.bulkCreate(parentIds.map(id => ({
        parentId: id,
        childId: instance.id
    })).concat(childrenIds.map(id => ({
        parentId: instance.id,
        childId: id
    }))), {
        transaction
    })
    await Protocol.bulkCreate((await ProtocolTemplate.generateFull(instance)).map(item => Object.assign({}, item, {instanceId: instance.id})), {
        transaction
    })

    // 处理Label
    let labels = ctx.request.body.labels
    if (labels && labels.length > 0) {
        let _labels = await Label.findAll({
            where: {
                name: {
                    [Op.in]: labels
                }
            },
            transaction
        })
        let labelMap = labels.reduce((result, item) => {
            result[item] = item
            return result
        }, {})
        for(let i = 0; i < _labels.length; i++) {
            delete labelMap[_labels[i].name]
        }
        _labels = _labels.concat(await Label.bulkCreate(Object.values(labelMap).map(item => ({name: item})), {
            transaction
        }))
        await Has.destroy({
            where: {
                instanceId: instance.id,
                labelId: {
                    [Op.in]: _labels.map(item => item.id)
                }
            },
            transaction
        })
        await Has.bulkCreate(_labels.map(item => ({
            instanceId: instance.id,
            labelId: item.id
        })), {
            transaction
        })
    }
    try {
        await transaction.commit()
        ctx.body = {
            data: {}
        }
    }
    catch (err) {
        await transaction.rollback()
        throw err;
    }
}

exports.update = async (ctx, next) => {
    const ModelInstance = global.db.models.model_instance
    const Label = global.db.models.label
    const Has = global.db.models.has
    let instance = await ModelInstance.findByPk(ctx.params.instanceId)
    let labels = ctx.request.body.labels
    if (labels) {
        let _labels = await Label.findAll({
            where: {
                name: {
                    [Op.in]: labels
                }
            }
        })
        let labelMap = labels.reduce((result, item) => {
            result[item] = item
            return result
        }, {})
        for(let i = 0; i < _labels.length; i++) {
            delete labelMap[_labels[i].name]
        }
        _labels = _labels.concat(await Label.bulkCreate(Object.values(labelMap).map(item => ({name: item}))))
        await Has.destroy({
            where: {
                instanceId: instance.id
            }
        })
        await Has.bulkCreate(_labels.map(item => ({
            instanceId: instance.id,
            labelId: item.id
        })))
    }
    Object.assign(instance, ctx.request.body)
    instance.updatedAt = new Date()
    instance = await instance.save()
    ctx.body = {
        data: instance
    }
}

exports.destroy = async (ctx, next) => {
    const Instance = global.db.models.model_instance
    const InstanceRelation = global.db.models.instance_relation
    let relation = await InstanceRelation.findOne({
        where: {
            parentId: ctx.params.instanceId
        }
    })
    if (!relation) {
        let instance = await Instance.findByPk(ctx.params.instanceId)
        await instance.destroy()
        ctx.body = {
            data: {}
        }
    }
    else {
        throw new Error(messages.controller.instance.DELETION_RESTRICTION_FAILED)
    }

}
