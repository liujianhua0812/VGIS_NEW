
module.exports =  {
    name: "custom condition",
    label: "dict.ruleChain.widgets.customCondition.label",
    description: "dict.ruleChain.widgets.customCondition.description",
    inputs: 1,
    outputs: 2,
    executor: require('./executor'),
    locale: {
        cn: {
            INVALID_CHECKER: "判别器未能正确执行，请检查您的脚本！",
            INVALID_RETURN: "判别器返回值不是布尔类型！"
        },
        en: {
            INVALID_CHECKER: "Execution failed, please check your script!",
            INVALID_RETURN: "Checker return non-boolean value!"
        }
    }
}