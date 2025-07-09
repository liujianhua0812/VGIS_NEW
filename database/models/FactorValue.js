
const Sequelize = require('sequelize')
/**
 * 模型示例静态属性的取值的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('factor_value', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        startAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        endAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        value: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        factorId: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        timestamps: true
    });
};

