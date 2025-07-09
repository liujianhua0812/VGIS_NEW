const Sequelize = require('sequelize')
/**
 * 规则链的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('rule_chain', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        configStr: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        configuration: {
            type: DataTypes.VIRTUAL,
            get () {
                try {
                    return JSON.parse(this.getDataValue('configStr'))
                }
                catch (er) {
                    return {}
                }
            },
            set (value) {
                this.setDataValue("configStr", JSON.stringify(value) || "{}")
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        modelId: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        instanceId: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        timestamps: true
    });
};
