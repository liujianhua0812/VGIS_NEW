const Sequelize = require('sequelize')
/**
 * 数据表的定义
 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('dashboard_template', {
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
    project: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    thumbnail: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    timestamps: true
  });
};
