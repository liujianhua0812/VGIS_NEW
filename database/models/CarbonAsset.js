
const Sequelize = require('sequelize')
/**
 * 模型示例静态属性的取值的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('carbon_asset', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        assetId: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        typeId: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        dealAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        carbon: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        recorderId: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        timestamps: true
    });
};

