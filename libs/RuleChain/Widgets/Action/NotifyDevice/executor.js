let mqtt = require('mqtt')
let RichText = require('../../../../Richtext')

module.exports = async function (context, config, inputs = [], outputs) {
    let input = inputs[0]
    let message = config.template

    for(let i = 0; i < outputs.length; i++) {
        outputs[i].result = input
    }

    if (config.type === "JSON") {
        try {
            message = RichText.composeDefault(message, context)
            message = JSON.parse(message)
            message = JSON.stringify(message)
        }
        catch (err) {
            return {
                input,
                result: message,
                canceled: false,
                error: "INVALID_MESSAGE"
            }
        }
    }
    else {
        message = RichText.composeDefault(message, context)
    }

    try {
        let timeout = parseInt(config.timeout)
        let options = {
            reconnectPeriod: 0
        }
        if (!isNaN(timeout) && timeout > 0) {
            options.connectTimeout = timeout * 1000
        }
        if (config.username || config.password) {
            options.username = config.username
            options.password = config.password
        }

        let client = mqtt.connect(config.mqtt, options)

        let timerPromise = new Promise((resolve, reject) => {
            setTimeout(function () {
                reject(new Error())
            }, options.connectTimeout || 30000)
        })

        let mqttPromise = new Promise((resolve, reject) => {
            client.on("connect", () => {
                client.publish(config.channel, message)
                client.end()
            })

            client.on("end", () => {
                resolve()
            })

            client.on("error", (error) => {
                reject(error)
            })
        })

        await Promise.race([mqttPromise, timerPromise])
    }
    catch (err) {
        return {
            input,
            result: message,
            canceled: false,
            error: "CONNECTION_FAILED"
        }
    }

    return {
        input,
        result: message,
        canceled: false,
        error: null
    }
}