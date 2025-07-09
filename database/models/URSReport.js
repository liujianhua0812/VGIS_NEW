const Sequelize = require('sequelize')
/**
 * 月报的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('urs_report', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        month: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        timestamps: true
    });
};
