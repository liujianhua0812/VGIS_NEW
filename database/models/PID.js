const Sequelize = require('sequelize')
const encrypt = require("../../libs/encrypt");
/**
 * 层级表的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('pid', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        nodeId: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        map: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        published: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        isDefault: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        timestamps: true
    });
};
