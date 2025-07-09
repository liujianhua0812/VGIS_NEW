
const Sequelize = require('sequelize')
/**
 * 模型示例静态属性的取值的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('conversion_factor', {
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
        unitId: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        timestamps: true
    });
};

