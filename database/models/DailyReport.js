const Sequelize = require('sequelize')
/**
 * 日报的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('daily_report', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        timestamps: true
    });
};
