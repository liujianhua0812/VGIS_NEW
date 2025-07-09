const Sequelize = require('sequelize')
/**
 * 数据表字段值记录
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('field_value', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        recordId: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        tableId: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        fieldId: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        value: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        timestamps: true
    });
};
