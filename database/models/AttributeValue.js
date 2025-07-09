
const Sequelize = require('sequelize')
/**
 * 模型示例静态属性的取值的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('attribute_value', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        value: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        attributeId: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        instanceId: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        timestamps: true
    });
};

