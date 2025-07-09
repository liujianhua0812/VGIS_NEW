
const Sequelize = require('sequelize')
/**
 * 模型示例静态属性的取值的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('asset_type', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM("买入", "卖出"),
            allowNull: false
        }
    }, {
        timestamps: true
    });
};

