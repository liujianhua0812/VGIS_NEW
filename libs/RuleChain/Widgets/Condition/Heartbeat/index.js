
module.exports =  {
    name: "heartbeat",
    label: "dict.ruleChain.widgets.heartbeat.label",
    description: "dict.ruleChain.widgets.heartbeat.description",
    type: "",
    inputs: 1,
    outputs: 2,
    executor: require('./executor')
}