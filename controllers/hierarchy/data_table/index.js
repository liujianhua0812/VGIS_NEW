const {Op} = require("sequelize");
const {messages} = require("../../../libs/Error");
const Meta = require('../../../database/models/metas')
const filterRecord = require('../../tables/record').filterRecord

exports.index = async (ctx, next) => {
  const ModelInstance = global.db.models.model_instance
  const Model = global.db.models.model
  const Table = global.db.models.data_table
  const TableField = global.db.models.table_field

  let instance = await ModelInstance.findOne({
    where: {
      instanceId: ctx.params.instanceId
    },
    include: [{
      model: Model,
      include: [{
        model: Table,
        include: [TableField]
      }]
    }]
  })

  ctx.body = {
    data: instance.model.data_tables
  }
}

exports.records = async (ctx, next) => {
  try {
    const DataTable = global.db.models.data_table
    const TableField = global.db.models.table_field
    const Unit = global.db.models.unit

    ctx.request.body.instanceId = ctx.request.body.filters ? ctx.request.body.filters.instanceId : ''

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
    throw new Error(messages.controller.hierarchy.DATA_INTERFACE_ERROR)
  }
}
