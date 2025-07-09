const Sequelize = require('sequelize')
/**
 * 告警的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('alert', {
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
        level: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        subject: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        checked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        checkedBy: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        instanceId: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        templateId: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        timestamps: true
    });
};
