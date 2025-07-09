const Sequelize = require('sequelize')
/**
 * 系统设置的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('system', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        setting: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        timestamps: true
    });
};
