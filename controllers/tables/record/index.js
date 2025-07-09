const Sequelize = require("sequelize");
const Op = Sequelize.Op
const {messages} = require("../../../libs/Error");
const Meta = require('../../../database/models/metas')

function is_valid_date (date) {
    if (!date) return false
    if (date instanceof Array) {
        if (date.length === 0 || date.length > 2) return false
        if (date.length === 1) {
            return !isNaN(new Date(date[0]).getTime())
        }
        else {
            return !isNaN(new Date(date[0]).getTime()) || !isNaN(new Date(date[1]).getTime())
        }
    }
    else {
        return !isNaN(new Date(date).getTime())
    }
}

function date2query (date) {
    if (!(date instanceof Array)) {
        return new (date)
    }
    else {
        if (date.length === 2) {
            if (is_valid_date(date[0]) && is_valid_date(date[1])) {
                return { [Op.between]: date.map(item => new Date(item)) }
            }
            else if (is_valid_date(date[0])) {
                return { [Op.gte]: new Date(date[0]) }
            }
            else if (is_valid_date(date[1])) {
                return { [Op.lte]: new Date(date[1]) }
            }
        }
        else {
            return { [Op.gte]: new Date(date[0]) }
        }
    }
}

async function filterRecord (ctx) {
    const DataTable = global.db.models.data_table
    const TableField = global.db.models.table_field
    const ModelInstance = global.db.models.model_instance
    const Model = global.db.models.model
    const TableRelation = global.db.models.table_relation

    let page = parseInt(ctx.query.page), pagination = parseInt(ctx.query.pagination);
    page = !isNaN(page) && page > 0 ? page : 1
    pagination = !isNaN(pagination) && pagination > 0 ? pagination : Number.MAX_SAFE_INTEGER

    Object.assign(ctx.request.body, ctx.params, ctx.request.query)

    let table = await DataTable.findOne({
        where: {
            [Op.or]: [{
                name: ctx.params.tableId
            }, {
                id: ctx.params.tableId
            }]
        },
        include: [TableField]
    })

    let fieldMap = table.table_fields.reduce((result, field) => {
        result[field.name] = field
        return result
    }, {})

    let RealTable = global.db.models[Meta.getTableId(table.id)]
    let filters = {}

    // 基础筛选器：instanceId和modelId
    if (ctx.request.body.instanceId || ctx.request.body.modelId) {
        let modelId = ctx.request.body.modelId
        let instances = []
        if (ctx.request.body.instanceId) {
            instances = await ModelInstance.findAll({
                where: {
                    [Op.or]: [{
                        instanceId: ctx.request.body.instanceId instanceof Array ? {[Op.in]: ctx.request.body.instanceId} : ctx.request.body.instanceId
                    }, {
                        id: ctx.request.body.instanceId instanceof Array ? {[Op.in]: ctx.request.body.instanceId} : ctx.request.body.instanceId
                    }]
                }
            })
            modelId = instances[0].modelId
        } else {
            let model = await Model.findOne({
                where: {
                    [Op.or]: [{
                        modelId: ctx.request.body.modelId
                    }, {
                        id: ctx.request.body.modelId
                    }]
                }
            })
            if (model) {
                instances = await ModelInstance.findAll({
                    where: {
                        modelId: model.id
                    }
                })
            }
        }
        let relation = await TableRelation.findOne({
            where: {
                modelId: modelId,
                tableId: table.id
            }
        })
        filters[Meta.getFieldId(relation.fieldId)] = {
            [Op.in]: instances.map(item => item.instanceId)
        }
    }
    // 根据综合筛选器获取备选的recordId
    let valueFilters = ctx.request.body.filters ? ctx.request.body.filters : []

    for(let i = 0 ; i < valueFilters.length; i++) {
        let filter = valueFilters[i]
        let field = fieldMap[filter.name]
        if (field && field.filterable) {
            switch (field.dataType) {
                case "String":
                case "Text":
                    filters[Meta.getFieldId(field.id)] = {
                        [Op.iLike]: `%${filter.value.split("").join("%")}%`
                    }
                    break
                case "Enum":
                    filters[Meta.getFieldId(field.id)] = {
                        [Op.in]: filter.value instanceof Array ? filter.value : [ filter.value ]
                    }
                    break
                case "Boolean":
                    filters[Meta.getFieldId(field.id)] = filter.value.toString().toLowerCase()
                    break
                case "Integer":
                    filters[Meta.getFieldId(field.id)] = filter.value instanceof Array ? { [Op.between]: filter.value } : filter.value
                    break
                case "Decimal":
                    filters[Meta.getFieldId(field.id)] = filter.value instanceof Array ? { [Op.between]: filter.value } : filter.value
                    break
                case "Date":
                    if (is_valid_date(filter.value)) {
                        filters[Meta.getFieldId(field.id)] = date2query(filter.value)
                    }
                    break
                case "Time":
                    if (is_valid_date(filter.value)) {
                        filters[Meta.getFieldId(field.id)] = date2query(filter.value)
                    }
                    break
                case "DateTime":
                    if (is_valid_date(filter.value)) {
                        filters[Meta.getFieldId(field.id)] = date2query(filter.value)
                    }
                    break
            }
        }
    }

    let sorter = ctx.request.body.sorter
    if (sorter) {
        let key = Meta.getFieldId(sorter)
        let order = ctx.request.body.order === "ASC"? "ASC" : "DESC"
        sorter = [[key, order]]
    }
    else {
        sorter = undefined
    }

    let records = await RealTable.findAll({
        attributes: ctx.request.body.fields && ctx.request.body.fields.length > 0 ? ctx.request.body.fields : undefined,
        where: filters,
        limit: pagination,
        order: sorter,
        offset: (page - 1) * pagination
    })
    let total = await RealTable.count({
        attributes: ctx.request.body.fields && ctx.request.body.fields.length > 0 ? ctx.request.body.fields : undefined,
        where: filters
    })

    return {
        records,
        pagination: {
            page: page,
            total: total,
            pagination: pagination,
            totalPage: Math.ceil(total / pagination)
        }

    }
}

exports.filterRecord = filterRecord

exports.showRecord = async (ctx, next) => {
    try {
        const DataTable = global.db.models.data_table
        const TableField = global.db.models.table_field
        const Unit = global.db.models.unit

        let table = await DataTable.findOne({
            where: {
                [Op.or]: [{
                    name: ctx.params.tableId
                }, {
                    id: ctx.params.tableId
                }]
            },
            include: [{
                model: TableField,
                include: [Unit]
            }]
        })

        let fieldMap = table.table_fields.reduce((result, field) => {
            result[Meta.getFieldId(field.id)] = field
            return result
        }, {})

        ctx.request.body.fields = ctx.request.body.fields ? (ctx.request.body.fields instanceof Array ? ctx.request.body.fields : [ctx.request.body.fields]) : [];

        let { records, pagination } = await filterRecord(ctx)

        return ctx.body = {
            data: records.map(record => {
                let result = {}
                for(let key in record.dataValues) {
                    if (fieldMap[key]) {
                        result[fieldMap[key].id] = {
                            recordId: record.id,
                            value: record.dataValues[key],
                            fieldId: fieldMap[key].id,
                            fieldName: fieldMap[key].name,
                            unit: fieldMap[key].unit ? fieldMap[key].unit.name : null
                        }
                    }
                }
                return {
                    id: record.id,
                    tableId: table.id,
                    field_values: result
                }
            }),
            pagination
        }
    }catch (err){
        console.log(err)
        throw new Error(messages.controller.table.DATA_INTERFACE_ERROR)
    }
}

exports.createRecord = async (ctx, next) => {
    try {
        let RealTable = global.db.models[Meta.getTableId(ctx.params.tableId)]
        let data = {}
        for (let e in ctx.request.body) {
            let fieldData = ctx.request.body[e]
            data[Meta.getFieldId(fieldData.fieldId)] = fieldData.value
        }
        let record = await RealTable.create(data)
        return ctx.body = {
            data: record
        }
    }catch (err){
        console.log(err)
        throw new Error(messages.controller.table.DATA_INTERFACE_ERROR)
    }
}

exports.updateRecord = async (ctx, next) => {
    try {
        let RealTable = global.db.models[Meta.getTableId(ctx.params.tableId)]
        let data = {}
        for (let e in ctx.request.body) {
            let fieldData = ctx.request.body[e]
            data[Meta.getFieldId(fieldData.fieldId)] = fieldData.value
        }
        await RealTable.update(data, {
            where: {
                id: ctx.params.recordId
            }
        })
        return ctx.body = {
            code: 1,
            msg: "Updated successfully"
        }
    }catch (err){
        console.log(err)
        throw new Error(messages.controller.table.DATA_INTERFACE_ERROR)
    }
}

exports.destroyRecord = async (ctx, next) => {
    let RealTable = global.db.models[Meta.getTableId(ctx.params.tableId)]
    try {
        await RealTable.destroy({
            where: {
                id: ctx.params.recordId
            }
        })
        // transaction has been committed. Do something after the commit if required.
        return ctx.body = {
            code: 1,
            msg: "Deleted successfully"
        }
    } catch (err) {
        // do something with the err.
        console.log(err)
        throw new Error(messages.controller.table.DATA_INTERFACE_ERROR)
    }
}
