
module.exports =  {
    name: "send bacnet command",
    label: "dict.ruleChain.widgets.sendBACNet.label",
    description: "dict.ruleChain.widgets.sendBACNet.description",
    type: "",
    inputs: 1,
    outputs: 1,
    executor: require('./executor')
}