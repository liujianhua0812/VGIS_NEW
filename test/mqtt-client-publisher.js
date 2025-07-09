const mqtt = require('mqtt')
const publisher = mqtt.connect("mqtt://192.168.1.154")

// Attribute instance/:instanceId/attribute
// Series instance/:instanceId/series

publisher.on("connect", function () {
    console.log("connected")
    setInterval(function () {
        // 参考下面的脚本写vgis自己的
        const instanceId = '1c2d47c9-3396-4af1-ac1d-594e5e4702d6'

        publisher.publish(`instance/${instanceId}/data/attributes`, JSON.stringify({
            "DS2 Operation Capacity": 230 + Math.floor(Math.random() * 50),
            "CPF1 Operation Capacity": 1500 + Math.floor(Math.random() * 50)
        }))

        publisher.publish(`instance/${instanceId}/data/series`, JSON.stringify({
            "data": [
                {
                    "name": "Closed Sour Wells",
                    "value": Math.floor(Math.random() * 100)
                },
                {
                    "name": "Closed Sweet Wells",
                    "value": Math.floor(Math.random() * 10)
                }
            ]
        }))

    }, 5000)
})