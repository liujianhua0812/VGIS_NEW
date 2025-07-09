const Sequelize = require('sequelize')
/**
 * 模型示例的数据传输协议的定义
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('protocol', {
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
        sampleInterval: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        protocolType: {
            type: DataTypes.ENUM('HTTP', 'Modbus Serial', 'Modbus TCP', 'MQTT', 'CoAP'),
            allowNull: false,
            defaultValue: 'HTTP'
        },
        isInterface: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        configurationStr: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '{}'
        },
        configuration: {
            type: DataTypes.VIRTUAL,
            get() {
                try {
                    return JSON.parse(this.getDataValue('configurationStr'))
                } catch (err) {
                    return {}
                }
            },
            set(value) {
                this.setDataValue('configurationStr', JSON.stringify(value || {}))
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        documentation: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        postAction: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        chains: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        timestamps: true,
        hooks: {
            // async beforeSave(instance,options){
            //     //test only - for encrypt function please ignore
            //     const {generateKeyPair} = require("../../libs/SecurityUtil")
            //     const key = await generateKeyPair(2048)
            //     instance.configuration = {
            //         security: true,
            //         privateKey: key.privateKey,
            //         publicKey: key.publicKey
            //     }
            // },
            async afterSave (instance, options) {
                await global.peripheralManager.PeripheralMastersUpdate()
                global.mqttmanager.update().then(r => console.log("MQTT updated."))
            },
            async beforeDestroy(instance, options) {
                await global.peripheralManager.PeripheralMastersUpdate()
                global.mqttmanager.update().then(r => console.log("MQTT updated."))
            }
        }
    });
};

