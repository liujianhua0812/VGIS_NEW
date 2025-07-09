
class SeriesGraphNode {

    constructor(series, instance, type = "series") {
        this.type = type
        this.series = series
        this.instance = instance
        this.dependencies = {}
        this.visited = false
    }

    isVirtual () {
        return this.series.isVirtual
    }

    getNodeId () {
        return `${this.type}@${this.series.id}@${this.instance.id}`
    }

    setDependency (seriesId, instanceId, type) {
        this.dependencies[`${type}@${seriesId}@${instanceId}`] = true
    }

    toJSON () {
        return {
            id: this.getNodeId(),
            name: `${this.type}@${this.instance.name}@${this.series.name}`,
            isVirtual: this.series.isVirtual,
            dependencies: this.dependencies
        }
    }
}

class VirtualSeriesCalculator {
    static ConstructGraph (series, attributes, instances, relations) {
        let allInstanceMap = instances.reduce((result, item) => {
            result[item.id] = item
            return result
        }, {})

        let parentMap = relations.reduce((result, item) => {
            if (allInstanceMap[item.childId] && allInstanceMap[item.parentId]) {
                if (!result[item.childId]) {
                    result[item.childId] = item.parentId
                }
            }
            return result
        }, {})

        let childrenMap = relations.reduce((result, item) => {
            if (allInstanceMap[item.childId] && allInstanceMap[item.parentId]) {
                if (!result[item.parentId]) {
                    result[item.parentId] = {}
                }
                let child = allInstanceMap[item.childId]
                if (!result[item.parentId][child.modelId]) {
                    result[item.parentId][child.modelId] = {}
                }
                result[item.parentId][child.modelId][item.childId] = true
            }
            return result
        }, {})

        let seriesModelMap = series.reduce((result, item) => {
            if (!result[item.modelId]) {
                result[item.modelId] = {}
            }
            result[item.modelId][item.id] = item
            return result
        }, {})

        let attributeModelMap = attributes.reduce((result, item) => {
            if (!result[item.modelId]) {
                result[item.modelId] = {}
            }
            result[item.modelId][item.id] = item
            return result
        }, {})

        let instanceModelMap = instances.reduce((result, item) => {
            if (!result[item.modelId]) {
                result[item.modelId] = {}
            }
            item.instance_time_series = (item.instance_time_series || []).reduce((res, config) => {
                res[config.seriesId] = config
                return res
            }, {})
            result[item.modelId][item.id] = item
            return result
        }, {})

        function getDescendants (instanceId, modelId) {
            let result = []
            if (childrenMap[instanceId]) {
                for(let key in childrenMap[instanceId]) {
                    if (key === modelId) {
                        result = result.concat(Object.keys(childrenMap[instanceId][key]))
                    }
                    for(let childId in childrenMap[instanceId][key]) {
                        result = result.concat(getDescendants(childId, modelId))
                    }
                }
            }
            return Object.keys(result.reduce((res, id) => {
                res[id] = true
                return res
            }, {}))
        }

        function getInstanceId (instanceId, modelId, type = "self") {
            if (type === "all" || type[0] === "all") {
                return instanceModelMap[modelId] || []
            }
            else if (type === "child" || type[0] === "child") {
                try {
                    return Object.keys(childrenMap[instanceId][modelId] || {})
                }
                catch (err) {
                    return []
                }
            }
            else if (type === "descendant" || type[0] === "descendant") {
                return getDescendants(instanceId, modelId)
            }
            else if (type === "self" || type[0] === "self") {
                return instanceId
            }
            else if (type === "parent" || type[0] === "parent") {
                let parentId = parentMap[instanceId]
                if ((allInstanceMap[parentId] && allInstanceMap[parentId]).modelId === modelId) {
                    return parentId
                }
                return null
            }
            else if (type === "ancestor" || type[0] === "ancestor") {
                let parentId = parentMap[instanceId]
                while (parentId) {
                    if ((allInstanceMap[parentId] && allInstanceMap[parentId]).modelId === modelId) {
                        return parentId
                    }
                    parentId = parentMap[parentId]
                }
                return null
            }
            else {
                return type
            }
        }

        function isValidCustomization (custom, series) {
            try {
                let data = JSON.parse(custom.calculationMethod)
                let fallback = JSON.parse(series.calculationMethod)
                let checkMap = {}
                for(let i = 0; i < fallback.series.length; i++) {
                    let item = fallback.series[i]
                    checkMap[item.name] = true
                }
                for(let i = 0; i < fallback.series.length; i++) {
                    let item = data.series[i]
                    if (checkMap[item.name]) {
                        delete checkMap[item.name]
                    }
                    else {
                        return false
                    }
                }
                return !Object.keys(checkMap).length;
            }
            catch (err) {
                return false
            }
        }

        let vertices = {}

        for(let modelId in attributeModelMap) {
            let attrList = attributeModelMap[modelId]
            if (instanceModelMap[modelId]) {
                for(let attrId in attrList) {
                    let attribute = attrList[attrId]
                    for(let instanceId in instanceModelMap[modelId]) {
                        let instance = instanceModelMap[modelId][instanceId]
                        let node =  new SeriesGraphNode(attribute, instance, "attribute")
                        vertices[node.getNodeId()] = node
                    }
                }
            }
        }

        for(let modelId in seriesModelMap) {
            let seriesList = seriesModelMap[modelId]
            if (instanceModelMap[modelId]) {
                for(let seriesId in seriesList) {
                    let series = seriesList[seriesId]
                    for(let instanceId in instanceModelMap[modelId]) {
                        let instance = instanceModelMap[modelId][instanceId]
                        let node =  new SeriesGraphNode(series, instance, "series")
                        if (series.isVirtual) {
                            let custom = instance.instance_time_series[seriesId]
                            if (isValidCustomization(custom, series)) {
                                custom = JSON.parse(custom.calculationMethod)
                                let fallback = JSON.parse(series.calculationMethod)

                                let nameMap = fallback.series.reduce((result, item) => {
                                    if (item.type === "attribute") {
                                        result[item.name] = [item.attribute[1], item.attribute[0], item.defaultInstanceId, "attribute"]
                                    }
                                    else {
                                        result[item.name] = [item.series[1], item.series[0], item.defaultInstanceId, "series"]
                                    }
                                    return result
                                }, {})

                                for(let i = 0; i < custom.series.length; i++) {
                                    let item = custom.series[i]
                                    // 如果指定了编号的，则按编号论
                                    if (item.instanceId) {
                                        nameMap[item.name][2] = item.instanceId
                                        if (item.instanceId instanceof Array) {
                                            for(let j = 0; j < item.instanceId.length; j++) {
                                                if (item.type === "attribute") {
                                                    node.setDependency(item.attribute[1], item.instanceId[j], "attribute")
                                                }
                                                else {
                                                    node.setDependency(item.series[1], item.instanceId[j], "series")
                                                }
                                            }
                                        }
                                        else {
                                            if (item.type === "attribute") {
                                                node.setDependency(item.attribute[1], item.instanceId, "attribute")
                                            }
                                            else {
                                                node.setDependency(item.attribute[1], item.instanceId, "series")
                                            }
                                        }
                                    }
                                    // 如果有没指定编号的，则说明自定义不完善，记作待完善配置
                                    else {
                                        item = nameMap[item.name]
                                        let specialId = getInstanceId(instance.id, item[1], item[2])
                                        if (specialId) {
                                            item[2] = specialId
                                            if (specialId instanceof Array) {
                                                for(let j = 0; j < specialId.length; j++) {
                                                    node.setDependency(item[0], specialId[j], item[3])
                                                }
                                            }
                                            else {
                                                node.setDependency(item[0], specialId, item[3])
                                            }
                                        }
                                    }
                                }
                                node.nameMap = nameMap
                            }
                            else {
                                try {
                                    let fallback = JSON.parse(series.calculationMethod)
                                    let nameMap = fallback.series.reduce((result, item) => {
                                        if (item.type === "attribute") {
                                            result[item.name] = [item.attribute[1], item.attribute[0], null, "attribute"]
                                        }
                                        else {
                                            result[item.name] = [item.series[1], item.series[0], null, "series"]
                                        }
                                        return result
                                    }, {})

                                    for(let i = 0; i < fallback.series.length; i++) {
                                        let item = fallback.series[i]
                                        // 如果指定了编号的，则按编号论
                                        let specialId = getInstanceId(instance.id, item.type === "attribute" ? item.attribute[0] : item.series[0], item.defaultInstanceId)
                                        if (specialId) {
                                            nameMap[item.name][2] = specialId
                                            if (specialId instanceof Array) {
                                                for(let j = 0; j < specialId.length; j++) {
                                                    if (item.type === "attribute") {
                                                        node.setDependency(item.attribute[1], specialId[j], "attribute")
                                                    }
                                                    else {
                                                        node.setDependency(item.series[1], specialId[j], "series")
                                                    }
                                                }
                                            }
                                            else {
                                                if (item.type === "attribute") {
                                                    node.setDependency(item.attribute[1], specialId, "attribute")
                                                }
                                                else {
                                                    node.setDependency(item.series[1], specialId, "series")
                                                }
                                            }
                                        }
                                    }
                                    node.nameMap = nameMap
                                }
                                catch (err) {}
                            }
                        }
                        vertices[node.getNodeId()] = node
                    }
                }
            }
        }

        return vertices
    }

    static GetDependenciesFromGraph (graph, series, instance, type = "series") {
        let nodeId = `${type}@${series.id}@${instance.id}`
        let node = graph[nodeId]
        if (!node || !node.isVirtual()) {
            return []
        }
        let result = {}
        for(let key in node.dependencies) {
            let dep = graph[key]
            if (dep) {
                result[key] = true
                if (dep.isVirtual()) {
                    let res = VirtualSeriesCalculator.GetDependenciesFromGraph(graph, dep.series, dep.instance, dep.type)
                    for(let i = 0; i < res.length; i++) {
                        result[res[i]] = true
                    }
                }
            }
        }
        return Object.keys(result)
    }

    static CalculateByGraph (graph, series, instance, order = "DESC", type = "series") {
        let node = graph[`${type}@${series.id}@${instance.id}`]
        let result = {}
        if (node) {
            if (node.visited || !node.isVirtual()) {
                node.visited = true
                return node.values
            }

            try {
                let fallback = JSON.parse(series.calculationMethod)
                let expression = fallback.expression
                let nameMap = node.nameMap

                let recordMap = {}
                for(let name in nameMap) {
                    let [_seriesId, modelId, instanceId, type] = nameMap[name]
                    if (instanceId instanceof Array) {
                        recordMap[name] = {
                            type,
                            values: instanceId.map(id => {
                                let dep = graph[`${type}@${_seriesId}@${id}`]
                                return VirtualSeriesCalculator.CalculateByGraph(graph, dep.series, dep.instance, order, dep.type)
                            })
                        }
                    }
                    else {
                        let dep = graph[`${type}@${_seriesId}@${instanceId}`]
                        recordMap[name] = {
                            type,
                            values: VirtualSeriesCalculator.CalculateByGraph(graph, dep.series, dep.instance, order, dep.type)
                        }
                    }
                }

                let records = VirtualSeriesCalculator.Calculate(expression, recordMap, order)
                result.data = records
                result.stat = VirtualSeriesCalculator.GetStat(records)
                node.values = result
                node.visited = true
            }
            catch (err) {
                console.log(err)
                node.values = null
                node.visited = true
                return null
            }
        }
        return result
    }

    static GetStat (records) {
        let stat = {}
        let tickMap = {}, ticks = []
        for(let i = 0; i < records.length; i++) {
            ticks.push(records[i].time)
            tickMap[records[i].time.format("yyyy-MM-dd hh:mm:ss")] = true
        }
        stat.tickMap = tickMap
        stat.ticks = ticks
        return stat
    }

    static GetValue(series, time) {
        if (series instanceof Array) {
            return series.map(item => item[time.format("yyyy-MM-dd hh:mm:ss")])
        }
        return series[time.format("yyyy-MM-dd hh:mm:ss")]
    }

    static InterpolateSeries(series, ticks, type) {
        let sIndex = 0, tIndex = 0
        if (series.length === 0) {
            return []
        }
        if (type === "attribute") {
            return ticks.reduce((result, item) => {
                result[item.format("yyyy-MM-dd hh:mm:ss")] = series
                return result
            }, {})
        }
        let result = {}
        while(sIndex < series.length || tIndex < ticks.length) {
            if (sIndex >= series.length) {
                result[ticks[tIndex].format("yyyy-MM-dd hh:mm:ss")] = series[series.length - 1].value
                tIndex++
            }
            else if (tIndex >= ticks.length) {
                result[new Date(series[sIndex].time).format("yyyy-MM-dd hh:mm:ss")] = series[sIndex].value
                sIndex++
            }
            else if (new Date(series[sIndex].time) < ticks[tIndex]) {
                result[new Date(series[sIndex].time).format("yyyy-MM-dd hh:mm:ss")] = series[sIndex].value
                sIndex++
            }
            else if (new Date(series[sIndex].time) > ticks[tIndex]) {
                result[ticks[tIndex].format("yyyy-MM-dd hh:mm:ss")] = series[sIndex].value
                tIndex++
            }
            else {
                result[new Date(series[sIndex].time).format("yyyy-MM-dd hh:mm:ss")] = series[sIndex].value
                tIndex++
            }
        }
        return result
    }

    static parseValue(value, type) {
        let result = value
        if (result === null) {
            return result
        }
        switch (type) {
            case "Integer":
                result = parseInt(value)
                if (isNaN(result)) {
                    result = value
                }
                break
            case "Decimal":
                result = parseFloat(value)
                if (isNaN(result)) {
                    result = value
                }
                break
            case "Boolean":
                result = 0 + parseInt(value)
                if (isNaN(result)) {
                    result = value
                }
                break
        }
        return result
    }

    static Calculate (expression, nameMap, order) {
        try {
            // 获得所有待计算的时间
            let ticks = Object.keys(Object.values(nameMap).reduce((result, item) => {
                let type = item.type
                item = item.values
                if (type === "series") {
                    if (item instanceof Array) {
                        for(let i = 0; i < item.length; i++) {
                            Object.assign(result, item[i] ? item[i].stat.tickMap : {})
                        }
                    }
                    else {
                        Object.assign(result, item ? item.stat.tickMap : {})
                    }
                }
                return result
            }, {})).map(item => new Date(item)).sort((i1, i2) => i1 - i2)

            let seriesMap = {}

            for(let key in nameMap) {
                if (nameMap[key]) {
                    let type = nameMap[key].type, values = nameMap[key].values
                    if (type === "attribute") {
                        if (values instanceof Array) {
                            seriesMap[key] = values.map(item => VirtualSeriesCalculator.InterpolateSeries(item, ticks, type))
                        }
                        else {
                            seriesMap[key] = VirtualSeriesCalculator.InterpolateSeries(nameMap[key] ? values : [], ticks, type)
                        }
                    }
                    else {
                        if (!values.data) {
                            seriesMap[key] = values.map(item => VirtualSeriesCalculator.InterpolateSeries(item ? item.data : [], ticks, type))
                        }
                        else {
                            seriesMap[key] = VirtualSeriesCalculator.InterpolateSeries(nameMap[key] ? values.data : [], ticks, type)
                        }
                    }
                }
            }

            let records = []
            for(let i = 0; i < ticks.length; i++) {
                let time = ticks[i]
                let recordMap = {}, valid = true
                for(let key in nameMap) {
                    recordMap[key] = VirtualSeriesCalculator.GetValue(seriesMap[key], time)
                    if (!recordMap[key] && recordMap[key] !== 0) {
                        valid = false
                    }
                }
                if (valid) {
                    let _exp = expression
                    for(let key in recordMap) {
                        _exp = _exp.replace(new RegExp(`\\{\\{${key}}}`, "g"), recordMap[key] instanceof Array ? JSON.stringify(recordMap[key]) : recordMap[key])
                    }
                    try {
                        let res = eval(_exp)
                        if (!isNaN(res)) {
                            records.push({
                                time,
                                value: res
                            })
                        }
                    }
                    catch (err) {
                        console.log(err)
                    }
                }
            }
            return records
        }
        catch (err) {
            return []
        }
    }
}

module.exports = VirtualSeriesCalculator