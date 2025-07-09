const Sequelize = require('sequelize')
const encrypt = require('../../libs/encrypt')
/**
 * 用户表的定义
 */
module.exports = function (sequelize, DataTypes) {
    let Account = sequelize.define('account', {
        accountNo: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        accountName: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        encryptedPassword: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        appPwd: {
            type: DataTypes.VIRTUAL,
            get() {
                return this.getDataValue('encryptedPassword')
            },
            set(value) {
                if (value) {
                    this.setDataValue('encryptedPassword', encrypt.encryptPassword(value))
                }
                else {
                    this.setDataValue('encryptedPassword', null)
                }
            }
        },
        uid: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('activated', 'deactivated', 'deleted'),
            allowNull: false,
            defaultValue: 'deactivated'
        },
        lastSignInAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        lastSignInIp: {
            type: DataTypes.STRING(80),
            allowNull: true
        },
        roleId: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        isSuper: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        isInternal: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        timestamps: true
    })
    Account.validatePassword = encrypt.validatePassword
    Account.confirmPassword = encrypt.validateConfirmPassword
    return Account
};
