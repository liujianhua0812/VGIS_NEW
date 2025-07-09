const Sequelize = require('sequelize')
/**
 * 模型示例的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('model_instance', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        instanceId: {
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
        modelId: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        rank: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        threeDViewPointStr: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        threeDViewPoint: {
            type: DataTypes.VIRTUAL,
            get () {
                try {
                    let str = this.getDataValue('threeDViewPointStr')
                    return str ? JSON.parse(str) : {}
                }
                catch (err) {
                    return {}
                }
            },
            set (value) {
                this.setDataValue('threeDViewPointStr', JSON.stringify(value))
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
