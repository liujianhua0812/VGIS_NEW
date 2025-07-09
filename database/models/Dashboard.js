const Sequelize = require('sequelize')
/**
 * 数据面板的定义
 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('dashboard', {
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    groupId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    project: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    thumbnail: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    timestamps: true
  });
};
