const Sequelize = require('sequelize')
/**
 * 模型分组的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('device_relation', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        instanceId: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        templateId: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        psTaskId: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        mTaskId: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        mScheduleId: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        aScheduleId: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        timestamps: true
    });
};
