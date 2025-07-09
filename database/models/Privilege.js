const Sequelize = require('sequelize')
/**
 * 用户角色表的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('privilege', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        resourceId: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        actionId: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        roleId: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        timestamps: false
    });
};
