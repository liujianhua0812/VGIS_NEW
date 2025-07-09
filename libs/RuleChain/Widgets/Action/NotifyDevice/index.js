
module.exports =  {
    name: "notify device",
    label: "dict.ruleChain.widgets.notifyDevice.label",
    description: "dict.ruleChain.widgets.notifyDevice.description",
    type: "",
    inputs: 1,
    outputs: 1,
    executor: require('./executor'),
    locale: {
        cn: {
            INVALID_MESSAGE: "消息格式错误！",
            CONNECTION_FAILED: "MQTT连接失败！"
        },
        en: {
            INVALID_MESSAGE: "Incorrect message format!",
            CONNECTION_FAILED: "Connection failed!"
        }
    }
}