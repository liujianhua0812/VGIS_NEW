const Sequelize = require('sequelize')
/**
 * 模型的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('model', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        modelId: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            defaultValue: Sequelize.UUIDV4
        },
        published: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        icon: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        groupId: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        type: {
            type: DataTypes.VIRTUAL,
            get () {
                return 'Model'
            }
        }
    }, {
        timestamps: true,
        hooks: {
            async afterSave (instance, options) {
                // TODO: 在这里更新MQTT Manager的subscribe逻辑
                global.mqttmanager.update().then(r => console.log("MQTT updated."))
            },
            async beforeDestroy (instance, options) {
                // TODO: 在这里更新MQTT Manager的subscribe逻辑
                global.mqttmanager.update().then(r => console.log("MQTT updated."))
            }
        }
    });
};
