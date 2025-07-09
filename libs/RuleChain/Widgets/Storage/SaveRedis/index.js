
module.exports =  {
    name: "save redis",
    label: "dict.ruleChain.widgets.saveRedis.label",
    description: "dict.ruleChain.widgets.saveRedis.description",
    inputs: 0,
    outputs: 1,
    executor: require('./executor')
}