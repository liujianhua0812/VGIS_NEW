module.exports = {
    name: "input",  // 组件唯一标识（用于在流程链中引用）
    label: "dict.ruleChain.widgets.input.label",  // 组件显示名称（国际化键值）
    description: "dict.ruleChain.widgets.input.description",  // 组件描述（国际化键值）
    inputs: 0,      // 输入端口数量：0 表示该组件是流程的“起点”，无需依赖其他组件
    outputs: 1,     // 输出端口数量：1 表示该组件执行后可将结果传递给 1 个后续组件
    executor: require('./executor')  // 关联执行器（即第一段代码的逻辑）
};