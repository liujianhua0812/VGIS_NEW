const Sequelize = require('sequelize')
const encrypt = require('../../libs/encrypt')
/**
 * 用户-岗位关系表的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user_job', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        uid: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        orgId: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        jobId: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        timestamps: true
    })
};