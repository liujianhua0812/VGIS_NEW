const Sequelize = require('sequelize')
/**
 * 模型动态点位的监测数据的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('series_value', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        time: {
            type: DataTypes.DATE,
            primaryKey: true,
            allowNull: false
        },
        value: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        seriesId: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        instanceId: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        timestamps: true
    });
};

