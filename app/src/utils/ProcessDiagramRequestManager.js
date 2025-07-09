import {getMultipleAttributeValues, getMultipleSeriesLatestValues} from "@/assets/js/api/hierarchy";

export default class ProcessDiagramRequestManager {

    onceMaps = {}
    loopMaps = {}
    loops = {}

    constructor() {}

    register (model, instance, type, name, realtime, interval, callback) {
        if (!this.onceMaps[model]) {
            this.onceMaps[model] = {}
        }
        if (!this.onceMaps[model][type]) {
            this.onceMaps[model][type] = {
                instances: {},
                names: {},
                callbacks: []
            }
        }
        this.onceMaps[model][type].instances[instance] = true
        this.onceMaps[model][type].names[name] = true
        this.onceMaps[model][type].callbacks.push({
            instance,
            name,
            handler: callback
        })

        if (realtime) {
            if (!this.loopMaps[interval]) {
                this.loopMaps[interval] = {}
            }
            if (!this.loopMaps[interval][model]) {
                this.loopMaps[interval][model] = {}
            }
            if (!this.loopMaps[interval][model][type]) {
                this.loopMaps[interval][model][type] = {
                    instances: {},
                    names: {},
                    callbacks: []
                }
            }
            this.loopMaps[interval][model][type].instances[instance] = true
            this.loopMaps[interval][model][type].names[name] = true
            this.loopMaps[interval][model][type].callbacks.push({
                instance,
                name,
                handler: callback
            })
        }
    }

    generateAttributeTask (info) {
        let callbacks = info.callbacks
        return new Promise((resolve, reject) => {
            getMultipleAttributeValues(
                Object.keys(info.instances),
                Object.keys(info.names)
            ).then(result => {
                console.log("attribute result", result.data)
            })
        })
    }

    splitSeriesResult (data, instance, name) {
        if (data[instance]) {
            return data[instance].find(item => item.name === name)
        }
        return null
    }

    async generateSeriesTask (info) {
        let callbacks = info.callbacks
        return new Promise((resolve, reject) => {
            getMultipleSeriesLatestValues(
                Object.keys(info.instances),
                Object.keys(info.names)
            ).then(result => {
                for(let i = 0; i < callbacks.length; i++) {
                    let callback = callbacks[i]
                    let instance = callback.instance, name = callback.name
                    let handler = callback.handler
                    handler(this.splitSeriesResult(result.data, instance, name))
                }
                resolve(result.data)
            })
        })
    }

    stop () {
        for(let loopId in this.loops) {
            clearInterval(loopId)
        }
    }

    start () {
        let onceTasks = []
        for(let model in this.onceMaps) {
            if (this.onceMaps[model]["attribute"]) {
                onceTasks.push(this.generateAttributeTask(this.onceMaps[model]["attribute"]))
            }
            if (this.onceMaps[model]["series"]) {
                onceTasks.push(this.generateSeriesTask(this.onceMaps[model]["series"]))
            }
        }

        if (onceTasks.length > 0) {
            Promise.all(onceTasks).then(() => {})
        }
        let that = this
        for(let interval in this.loopMaps) {
            function execute () {
                let periodicalTasks = []
                let batch = that.loopMaps[interval]
                for(let model in batch) {
                    if (batch[model]["attribute"]) {
                        periodicalTasks.push(that.generateAttributeTask(batch[model]["attribute"]))
                    }
                    if (batch[model]["series"]) {
                        periodicalTasks.push(that.generateSeriesTask(batch[model]["series"]))
                    }
                }
                Promise.all(periodicalTasks).then(() => {})
            }

            let loopId = setInterval(execute, parseInt(interval))
            this.loops[loopId] = true
        }
    }

    restart () {
        this.stop()
        this.start()
    }
}