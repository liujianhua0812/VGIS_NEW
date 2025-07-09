
module.exports =  {
    name: "switch",
    label: "dict.ruleChain.widgets.switch.label",
    description: "dict.ruleChain.widgets.switch.description",
    type: "",
    inputs: 1,
    outputs: 1,
    executor: require('./executor'),
    locale: {
        cn: {
            INVALID_INPUT: "输入数据格式错误，无法正确执行判断！",
            NO_MATCH: "数值未匹配到任何分支！"
        },
        en: {
            INVALID_INPUT: "Unable to match value due to invalid input!",
            NO_MATCH: "No match!"
        }
    }
}