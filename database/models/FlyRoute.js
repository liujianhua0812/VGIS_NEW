const Sequelize = require('sequelize')
/**
 * 层级表的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('fly_route', {
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
        route: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        }
    }, {
        timestamps: true
    });
};
