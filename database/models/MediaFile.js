const Sequelize = require('sequelize')
const encrypt = require('../../libs/encrypt')
/**
 * 文件的定义
 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('media_file', {
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    contentType: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    modelId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    instanceId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    assetId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    extraStr: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    extra: {
      type: DataTypes.VIRTUAL,
      get () {
        try {
          return JSON.parse(this.getDataValue('extraStr'))
        }
        catch (err) {
          return this.getDataValue('extraStr')
        }
      },
      set (value) {
        this.setDataValue('extraStr', JSON.stringify(value))
      }
    }
  }, {
    timestamps: true
  })
};
