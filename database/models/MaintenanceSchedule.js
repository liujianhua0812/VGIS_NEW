const Sequelize = require('sequelize')
/**
 * 模型分组的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('maintenance_schedule', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        periodical: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        period: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        tickInPeriod: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        scheduledAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        startAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        endAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        executed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    }, {
        timestamps: true
    });
};
