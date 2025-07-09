const Sequelize = require('sequelize')
/**
 * 单位的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('unit', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        timestamps: true
    });
};
