const Sequelize = require('sequelize')
/**
 * 数据表的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('data_table', {
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
