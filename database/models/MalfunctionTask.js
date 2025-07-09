const Sequelize = require('sequelize')
/**
 * 模型分组的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('malfunction_task', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        levelId: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM("传感器故障", "机组导出故障", "需求不满足故障"),
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM("pending", "solved", "undetermined"),
            allowNull: true
        },
        module: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        solution: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        handledAt: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        solveTime: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
    }, {
        timestamps: true
    });
};
