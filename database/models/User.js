const Sequelize = require('sequelize')
const encrypt = require('../../libs/encrypt')
/**
 * 用户表的定义
 */
module.exports = function (sequelize, DataTypes) {
    let User = sequelize.define('user', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        realName: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        gender: {
            type: DataTypes.ENUM("男", "女"),
            allowNull: true
        }
    }, {
        timestamps: true
    })

    User.validatePassword = encrypt.validatePassword
    User.validateConfirmPassword = encrypt.validateConfirmPassword
    return User
};