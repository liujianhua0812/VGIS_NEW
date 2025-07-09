const Sequelize = require('sequelize')
/**
 * 模型分组的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('maintenance_task', {
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
            allowNull: false,
            defaultValue: "pending"
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
