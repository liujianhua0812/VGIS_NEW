
module.exports =  {
    name: "save sql",
    label: "dict.ruleChain.widgets.saveSQL.label",
    description: "dict.ruleChain.widgets.saveSQL.description",
    inputs: 1,
    outputs: 1,
    executor: require('./executor'),
    locale: {
        cn: {
            SQL_FAILED: "SQL查询失败，请检查您的语句和配置！",
        },
        en: {
            SQL_FAILED: "SQL execution failed, please check your command and config!"
        }
    }
}