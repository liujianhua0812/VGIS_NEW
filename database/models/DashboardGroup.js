const Sequelize = require('sequelize')
/**
 * 日报的定义
 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('dashboard_group', {
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    dashboardType: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Dashboard"
    },
    groupId: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    timestamps: true
  });
};
