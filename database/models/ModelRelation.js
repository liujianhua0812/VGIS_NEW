const Sequelize = require('sequelize')
/**
 * 模型关系的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('model_relation', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        sourceId: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        targetId: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        relationType: {
            type: DataTypes.ENUM('Contain', 'Belong To'),
            allowNull: false,
            defaultValue: 'Contain'
        }
    }, {
        timestamps: true
    });
};
