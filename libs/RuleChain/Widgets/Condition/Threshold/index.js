
module.exports =  {
    name: "threshold",
    label: "dict.ruleChain.widgets.threshold.label",
    description: "dict.ruleChain.widgets.threshold.description",
    type: "",
    inputs: 1,
    outputs: 2,
    executor: require('./executor'),
    locale: {
        cn: {
            INVALID_INPUT: "输入数据格式错误，无法正确执行阈值判断！"
        },
        en: {
            INVALID_INPUT: "Unable to check threshold due to invalid input!"
        }
    }
}