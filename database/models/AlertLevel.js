const Sequelize = require('sequelize')
/**
 * 告警的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('alert_level', {
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
    }, {
        timestamps: true
    });
};
