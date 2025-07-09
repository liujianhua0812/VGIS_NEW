const mqtt = require('mqtt')
const {updateInstanceAttributes, updateInstanceSeries} = require("../controllers/instance/data")

const eqSet = (xs, ys) =>
    xs.size === ys.size &&
    [...xs].every((e) => ys.has(e));

class MQTTManager {
    constructor(config) {
        //key: url
        this.config = config
        // key: url
        // value: {instanceId: [subscribe array]}
        this.mqtt2instance = {}
    }

    async getInstancesMap() {
        let protocols = await global.db.models.protocol.findAll({
            where: {
                protocolType: "MQTT",
                isInterface: true,
                isActive: true
            }
        })
        this.mqtt2instance = protocols.reduce((result, protocol, index) => {
            const instanceId = protocol.instanceId
            if (!result[instanceId]) {
                result[instanceId] = []
            }
            if (protocol.configuration.channel) {
                result[instanceId].push(protocol.configuration.channel)
            }
            else if (protocol.name === "Series") {
                result[instanceId].push(`instance/${instanceId}/data/series`)
            }
            else if (protocol.name === "Attribute") {
                result[instanceId].push(`instance/${instanceId}/data/attributes`)
            }
            else {
                console.log(`Error in protocol parse for MQTT instanceId = ${instanceId}`)
            }
            return result
        }, {})
    }

    async start() {
        try {
            const client = await mqtt.connect(this.config.baseUrl, this.config.options)
            let that = this
            client.on('connect', async function () {
                console.log("MQTT Client connected.")
                await that.update()
            })
            client.on('message', async function (topic, message) {
                await that.extractMessage(topic, message)
            })
            this.client = client
        }
        catch (err) {
            console.log(`[MQTT client failed to connect to ${this.config.baseUrl}]`)
            console.log(err)
        }
    }

    close() {
        if (this.client) {
            this.client.end()
        }
    }

    async restart() {
        if (this.client) {
            this.client.end()
        }
        await this.start()
    }

    async update() {
        const oldInstanceMap = this.mqtt2instance
        await this.getInstancesMap()
        const newInstanceMap = this.mqtt2instance

        // console.log("Pre Setting", oldInstanceMap)
        // console.log("New Setting", newInstanceMap)

        // unsubscribe all old channels
        for(let instanceId in oldInstanceMap) {
            for(let i = 0; i < oldInstanceMap[instanceId].length; i++) {
                this.client.unsubscribe(oldInstanceMap[instanceId][i])
            }
        }
        // subscribe new channels
        for(let instanceId in newInstanceMap) {
            for(let i = 0; i < newInstanceMap[instanceId].length; i++) {
                this.client.subscribe(newInstanceMap[instanceId][i])
            }
        }
    }

    async extractMessage(topic, message) {
        // console.log(topic, JSON.parse(message.toString()))
        try {
            const regex = /^instance\/([^?\/]+)\/data\/(attributes|series)$/;
            const instanceId = topic.match(regex)[1]
            const type = topic.match(regex)[2]
            switch (type) {
                case "attributes":
                    updateInstanceAttributes(instanceId, JSON.parse(message.toString()), 'MQTT').then((res) => {
                        console.log("Attributes Update Finished:", res)
                    })
                    break;
                case "series":
                    updateInstanceSeries(instanceId, JSON.parse(message.toString()), 'MQTT').then((res) => {
                        console.log("Series Update Finished:", res)
                    })
                    break;
                default:
                    console.log("Unknown topic name in MQTT", topic)
                    break;
            }
        }
        catch (err) {
            console.log("Error in processing MQTT client message", topic, message)
        }
    }
}

exports.MQTTManager = MQTTManager;