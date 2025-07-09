let Widgets = require('./index')
let Stack = require('../../../libs/Stack')
let I18n = require('i18n').I18n
let SettingUtils = require('../../../libs/Setting')

module.exports =  async function (context, chain, data, test = false) {
    let widgetMap = {}, result = {}
    for(let i = 0; i < Widgets.length; i++) {
        let group = Widgets[i].widgets
        for(let j = 0; j < group.length; j++) {
            let widget = group[j]
            widgetMap[widget.name] = widget
        }
    }
    if (!context) {
        context = {
            data,
            instance: {}
        }
    }

    let graph = {}
    for(let id in chain) {
        graph[id] = {
            id,
            name: chain[id].html,
            executor: widgetMap[chain[id].html].executor,
            locale: widgetMap[chain[id].html].locale || {},
            config: chain[id].data,
            next: [],
            prev: []
        }
        for(let output in chain[id].outputs) {
            let index = parseInt(output.slice(7)) - 1
            let connections = chain[id].outputs[output].connections
            graph[id].next[index] = {
                connections: connections.map(conn => ({
                    node: conn.node,
                    input: parseInt(conn.output.slice(6)) - 1
                }))
            }
        }
        for(let input in chain[id].inputs) {
            let index = parseInt(input.slice(6)) - 1
            let conn = chain[id].inputs[input].connections[0]
            graph[id].prev[index] = conn ? {
                node: conn.node,
                output: parseInt(conn.input.slice(7)) - 1
            } : null
        }
        graph[id].inlet = graph[id].prev.length
    }
    // console.log(JSON.stringify(graph, null, 4))
    let stack = new Stack()
    function hasNext(node) {
        for(let i = 0; i < node.next.length; i++) {
            if (node.next[i].connections.length > 0) {
                return true
            }
        }
        return false
    }

    for(let key in graph) {
        let node = graph[key]
        if (!hasNext(node)) {
            stack.push(node)
        }
    }
    while(!stack.isEmpty()) {
        // console.log("=================")
        let current = stack.top()
        // console.log("current: ", current.id, current.name)
        // 如果没有输入，说明已经到头了，将传入的假数据作为该节点的输出
        if (current.prev.length === 0) {
            // console.log("Input node, executed")
            current = stack.pop()
            if (test) {
                current.config.test = true
            }
            result[current.id] = await current.executor(context, current.config, [data], current.next)
            continue
        }
        let counter = 0
        for(let i = 0; i < current.prev.length; i++) {
            let prevLink = current.prev[i]
            // console.log(prevLink, "prev link")
            let prevNode = graph[prevLink.node]
            let output = prevNode.next[prevLink.output]
            // console.log(output, "output")
            // 如果前置节点已经输出，则统计这样的节点
            if (output.result) {
                counter++
            }
            // 否则如果output没有结果，说明这个节点还没有入栈过，将其入栈
            else if (!output.result) {
                stack.push(prevNode)
            }
            // 如果output标记为canceled，则当前节点放弃执行了（如分支条件中直接放弃该分支），直接出栈放弃
            else if (output.canceled) {
                result[current.id] = { canceled: true }
                // console.log("Path truncated, execution canceled.")
                for(let j = 0; j < current.next.length; j++) {
                    current.next[j].canceled = true
                }
                stack.pop()
                break
            }
        }
        // console.log("prev check", counter === current.prev.length)
        // 如果所有前置节点都已经计算出结果
        if (counter === current.prev.length) {
            // 将当前任务节点出栈并执行
            // console.log("Input met, executing.")
            current = stack.pop()
            if (test) {
                current.config.test = true
            }
            result[current.id] = await current.executor(context, current.config, current.prev.map(item => graph[item.node].next[item.output].result), current.next)
        }
        // console.log("=================")
    }
    console.log("Chain execution finished!")
    let locale = await SettingUtils.getLocale()
    for(let nodeId in result) {
        if (result[nodeId].error) {
            let i18n = new I18n({
                locales: ["cn", "en"],
                staticCatalog: graph[nodeId].locale
            })
            i18n.setLocale(locale)
            result[nodeId].error = i18n.__(result[nodeId].error)
        }
    }
    return result
}