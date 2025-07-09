
module.exports =  {
    name: "read series latest value",
    label: "dict.ruleChain.widgets.readSeriesLatestValue.label",
    description: "dict.ruleChain.widgets.readSeriesLatestValue.description",
    inputs: 0,
    outputs: 1,
    executor: require('./executor')
}