const Sequelize = require('sequelize')
/**
 * 模型示例关系的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('instance_relation', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        childId: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        parentId: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        timestamps: true
    });
};
