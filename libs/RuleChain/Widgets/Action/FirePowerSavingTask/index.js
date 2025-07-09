
module.exports =  {
    name: "fire power saving task",
    label: "dict.ruleChain.widgets.firePowerSavingTask.label",
    description: "dict.ruleChain.widgets.firePowerSavingTask.description",
    type: "",
    inputs: 1,
    outputs: 1,
    executor: require('./executor'),
    locale: {
        cn: {
            INVALID_TEMPLATE: "告警模板不存在！",
            INVALID_INSTANCE: "目标对象不存在！",
        },
        en: {
            INVALID_TEMPLATE: "Alert template does not exist!",
            INVALID_INSTANCE: "Target instance does not exist!"
        }
    }
}