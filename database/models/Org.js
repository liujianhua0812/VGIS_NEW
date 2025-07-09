const Sequelize = require('sequelize')
/**
 * 组织表的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('org', {
        prId: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
        },
        prParentid: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        prInvented: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        prOrgtyde: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        prName: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        prOrgcode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        prStatus: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
    }, {
        timestamps: true
    })
};