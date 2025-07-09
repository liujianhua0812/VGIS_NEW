const Sequelize = require('sequelize')
/**
 * 数据表记录
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('table_relation', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        tableId: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        modelId: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        fieldId: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        timestamps: true
    });
};
