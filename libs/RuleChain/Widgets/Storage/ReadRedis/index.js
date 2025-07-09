
module.exports =  {
    name: "read redis",
    label: "dict.ruleChain.widgets.readRedis.label",
    description: "dict.ruleChain.widgets.readRedis.description",
    inputs: 0,
    outputs: 1,
    executor: require('./executor')
}