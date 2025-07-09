
const Sequelize = require('sequelize')
const PREFIX = "vgis"

function transform (field, DataTypes) {
  switch (field.dataType) {
    case "String":
      return DataTypes.STRING(255)
    case "Text":
      return DataTypes.TEXT
    case "Enum":
      return DataTypes.ENUM(...field.candidate)
    case "Integer":
      return DataTypes.INTEGER
    case "Decimal":
      return DataTypes.DOUBLE
    case "Date":
    case "Time":
    case "DateTime":
      return DataTypes.DATE
    case "Boolean":
      return DataTypes.BOOLEAN
    case "File":
      return DataTypes.STRING(255)
  }
}

exports.PREFIX = PREFIX

exports.getFieldId = function (fieldId = "") {
  return fieldId.replace(/-/g, "")
}

exports.getTableId = function (tableId = "") {
  return `${PREFIX}_${tableId.replace(/-/g, "")}`
}

exports.getUniqueKeyId = function (tableId = "", fieldId) {
  return `${tableId.replace(/-/g, "")}_${fieldId.replace(/-/g, "")}_unique_key`
}

exports.transform = transform

exports.defineField = (field) => {
  return {
    type: transform(field, Sequelize.DataTypes),
    allowNull: !field.required
  }
}

exports.defineOne = async (sequelize, DataTypes, table) => {
  let schema = {
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
  }
  sequelize.define(`${PREFIX}_${table.id.replace(/-/g, "")}`, schema, {
    timestamps: false,
    freezeTableName: true
  });
}

exports.define = async (sequelize, DataTypes) => {
  let DataTable = sequelize.models.data_table
  let TableField = sequelize.models.table_field

  let tables = await DataTable.findAll({
    include: [TableField]
  })

  for(let i = 0; i < tables.length; i++) {
    let table = tables[i]
    let schema = Object.assign({
      id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
    }, table.table_fields.reduce((result, field) => {
      result[exports.getFieldId(field.id)] = exports.defineField(field)
      return result
    }, {}))
    sequelize.define(exports.getTableId(table.id), schema, {
      timestamps: false,
      freezeTableName: true
    });
  }

  return sequelize
}
