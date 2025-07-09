
module.exports =  {
    name: "notify device",
    label: "dict.ruleChain.widgets.sendHTTP.label",
    description: "dict.ruleChain.widgets.sendHTTP.description",
    type: "",
    inputs: 1,
    outputs: 1,
    executor: require('./executor')
}