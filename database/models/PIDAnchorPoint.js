const Sequelize = require('sequelize')
const encrypt = require("../../libs/encrypt");
/**
 * 层级表的定义
 */
module.exports = function (sequelize, DataTypes) {
    let Point = sequelize.define('pid_anchor_point', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        diagramId: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        xPath: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        type: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        configurationStr: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '{}'
        },
        configuration: {
            type: DataTypes.VIRTUAL,
            get() {
                try {
                    return JSON.parse(this.getDataValue('configurationStr'))
                } catch (err) {
                    return {}
                }
            },
            set(value) {
                if (this.getDataValue("type") === "control" && value.validator === "password") {
                    value.encryptedPassword = encrypt.encryptPassword(value.password)
                }
                this.setDataValue('configurationStr', JSON.stringify(value || {}))
            }
        },
    }, {
        timestamps: true
    });

    Point.validatePassword = encrypt.validatePassword
    Point.validateConfirmPassword = encrypt.validateConfirmPassword

    return Point
};
