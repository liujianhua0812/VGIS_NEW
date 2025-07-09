
const Sequelize = require('sequelize')
const PREFIX = "vgis"

exports.PREFIX = PREFIX

exports.getTableId = function (modelId = "") {
  return `${PREFIX}_${modelId.replace(/-/g, "")}`
}

exports.defineOne = async (sequelize, DataTypes, model) => {
  let schema = {
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    time: {
      type: DataTypes.DATE,
      primaryKey: true,
      allowNull: false
    },
    value: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    seriesId: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    instanceId: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }
  await sequelize.define(`${PREFIX}_${model.id.replace(/-/g, "")}`, schema, {
    timestamps: false,
    freezeTableName: true
  });
  // TODO: 将数据表改造成TimescaleDB的hypertable
}

exports.define = async (sequelize, DataTypes) => {
  let Model = sequelize.models.model
  let TimeSeries = sequelize.models.time_series

  let models = await Model.findAll({
    include: [TimeSeries]
  })

  for(let i = 0; i < models.length; i++) {
    let model = models[i]
    await exports.defineOne(sequelize, DataTypes, model)
  }

  return sequelize
}
