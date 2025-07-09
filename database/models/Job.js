const Sequelize = require('sequelize')
/**
 * 岗位表的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('job', {
        prId: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
        },
        prName: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        prCode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        prOrgcode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        prOrgid: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        prSupposcode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        prLevel: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        prStatus: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        timestamps: true
    })
};