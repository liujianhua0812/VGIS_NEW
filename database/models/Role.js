const Sequelize = require('sequelize')
/**
 * 用户角色表的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('role', {
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
        defaultEntry: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        timestamps: false
    });
};
