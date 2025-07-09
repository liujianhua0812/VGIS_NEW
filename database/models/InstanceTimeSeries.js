const Sequelize = require('sequelize')
/**
 * 模型动态属性的定义
 */
module.exports = function (sequelize, DataTypes) {
    const splitter = '|-|*|&|^|'
    return sequelize.define('instance_time_series', {
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
        seriesId: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        calculationMethod: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        timestamps: true
    });
};
