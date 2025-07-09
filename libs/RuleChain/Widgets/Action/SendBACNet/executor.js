const bacnet = require('node-bacnet');

module.exports = async function (context, config, inputs = [], outputs) {
    let input = inputs[0]
    for(let i = 0; i < outputs.length; i++) {
        outputs[i].result = input
    }
    try {
        const client = new bacnet();

        // TODO: 这里根据现场的实际配置回来加一下控制逻辑
        let result = client.writePropertyMultiple(`${config.ipAddress}:${config.port}`)

        return {
            result,
            canceled: false
        }
    }
    catch(err) {
        return {
            canceled: false,
            error: err
        }
    }
}