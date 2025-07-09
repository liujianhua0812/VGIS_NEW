const Sequelize = require('sequelize')
/**
 * 标签-动态静态属性关系的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('has', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        attributeId: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        seriesId: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        instanceId: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        modelId: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        labelId: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        timestamps: true
    });
};
