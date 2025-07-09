const Sequelize = require('sequelize')
/**
 * 用户角色表的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('resources', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        parentId: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        application: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        timestamps: false
    });
};
