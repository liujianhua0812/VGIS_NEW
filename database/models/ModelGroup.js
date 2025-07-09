const Sequelize = require('sequelize')
/**
 * 模型分组的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('model_group', {
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
        groupId: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        type: {
            type: DataTypes.VIRTUAL,
            get () {
                return 'ModelGroup'
            }
        }
    }, {
        timestamps: true
    });
};
