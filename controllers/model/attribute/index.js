const Op = require('sequelize').Op
const messages = require('../../../libs/Error').messages

exports.index = async (ctx, next) => {
    const StaticAttribute = global.db.models.static_attribute
    const Label = global.db.models.label
    const Unit = global.db.models.unit
    let attributes = await StaticAttribute.findAll({
        where: {
            modelId: ctx.params.modelId
        },
        include: [Label, Unit],
        order: [['rank', 'ASC']]
    })
    ctx.body = {
        data: attributes
    }
}

exports.create = async (ctx, next) => {
    const StaticAttribute = global.db.models.static_attribute
    const Label = global.db.models.label
    const Unit = global.db.models.unit
    const Has = global.db.models.has
    let attribute = await StaticAttribute.findOne({
        where: {
            modelId: ctx.params.modelId,
            name: ctx.request.body.name
        }
    })
    if (attribute) {
        throw new Error(messages.database.static_attribute.DUPLICATE_ATTRIBUTE)
    }
    else {
        ctx.request.body.rank = await StaticAttribute.count({ where: { modelId: ctx.params.modelId } })
        // 处理Unit
        delete ctx.request.body.unitId
        let unit = ctx.request.body.unit
        if (unit) {
            let _unit = await Unit.findOne({where: {name: unit}})
            if (!_unit) {
                _unit = await Unit.create({name: unit})
            }
            ctx.request.body.unitId = _unit.id
        }

        attribute = await StaticAttribute.create(Object.assign(ctx.request.body, ctx.params))
        // 处理Label
        let labels = ctx.request.body.labels
        if (labels && labels.length > 0) {
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
                    attributeId: attribute.id,
                    labelId: {
                        [Op.in]: _labels.map(item => item.id)
                    }
                }
            })
            await Has.bulkCreate(_labels.map(item => ({
                attributeId: attribute.id,
                labelId: item.id
            })))
        }
    }
    ctx.body = {
        data: {}
    }
}

exports.update = async (ctx, next) => {
    const Attribute = global.db.models.static_attribute
    const Label = global.db.models.label
    const Unit = global.db.models.unit
    const Has = global.db.models.has
    // TODO: 这里应该能够清空数值，并进行数值校验
    let attribute = await Attribute.findByPk(ctx.params.attributeId)
    if (ctx.request.body.name && ctx.request.body.name !== attribute.name) {
        let exist = await Attribute.findOne({
            where: {
                id: {
                    [Op.ne]: attribute.id
                },
                name: ctx.request.body.name
            }
        })
        if (exist) {
            throw new Error(messages.database.static_attribute.DUPLICATE_ATTRIBUTE)
        }
    }
    attribute.unitId = null
    delete ctx.request.body.unitId
    let unit = ctx.request.body.unit
    if (unit) {
        let _unit = await Unit.findOne({where: {name: unit}})
        if (!_unit) {
            _unit = await Unit.create({name: unit})
        }
        ctx.request.body.unitId = _unit.id
    }
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
                attributeId: attribute.id
            }
        })
        await Has.bulkCreate(_labels.map(item => ({
            attributeId: attribute.id,
            labelId: item.id
        })))
    }
    Object.assign(attribute, ctx.request.body)
    attribute = await attribute.save()
    ctx.body = {
        data: attribute
    }
}

exports.destroy = async (ctx, next) => {
    const StaticAttribute = global.db.models.static_attribute
    let attribute = await StaticAttribute.findByPk(ctx.params.attributeId)
    await attribute.destroy()
    ctx.body = {
        data: {}
    }
}
