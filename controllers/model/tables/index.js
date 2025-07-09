const {messages} = require("../../../libs/Error");
const {Op} = require("sequelize");
const Meta = require('../../../database/models/metas')
let filterRecord = require('../../tables/record').filterRecord

exports.showTables = async (ctx, next) => {
    try {
        const TableRelation = global.db.models.table_relation
        const DataTable = global.db.models.data_table

        let queryResult = await TableRelation.findAll({
            where:{
                modelId: ctx.params.modelId
            },
            include: DataTable
        })

        let result = []
        queryResult.map(res=>{
            result.push({
                id: res.id,
                tableId: res.tableId,
                tableName: res.data_table.name,
                fieldId: res.fieldId
            })
        })

        return ctx.body = {
            data: result
        }
    }catch (err){
        console.log(err)
        throw new Error(messages.controller.table.DATA_INTERFACE_ERROR)
    }
}


exports.showTableRecords = async (ctx, next) => {
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
    } catch (err) {
        console.log(err)
        throw new Error(messages.controller.table.DATA_INTERFACE_ERROR)
    }
}
