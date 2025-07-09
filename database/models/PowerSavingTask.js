const Sequelize = require('sequelize')
/**
 * 模型分组的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('power_saving_task', {
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
