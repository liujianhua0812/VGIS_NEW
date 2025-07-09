
module.exports =  {
    name: "transform",
    label: "dict.ruleChain.widgets.transform.label",
    description: "dict.ruleChain.widgets.transform.description",
    inputs: 1,
    outputs: 1,
    executor: require('./executor'),
    locale: {
        cn: {
            INVALID_EXECUTOR: "执行失败，请检查您的脚本！"
        },
        en: {
            INVALID_EXECUTOR: "Execution failed, please check your script!"
        }
    }
}