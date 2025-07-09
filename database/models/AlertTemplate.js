const Sequelize = require('sequelize')
/**
 * 告警模板的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('alert_template', {
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
        modelId: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        template: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        timestamps: true
    });
};
