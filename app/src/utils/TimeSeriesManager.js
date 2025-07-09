
class TimeSeriesRequest {

    constructor(type, instances, series, callback) {
        this.type = type
        this.instances = instances
        this.series = series
        this.callback = callback
        this.caller = caller
    }
}

export function interpolate(series, ticks) {
    let sIndex = 0, tIndex = 0
    if (series.length === 0) {
        return []
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

class TimeSeriesManager {

    requests = []

    constructor() {

    }

    // MEMO: 已知查询Series的数据接口，同一个类型的面板，查询内容和周期是完全一致的

    // 注册请求，由Manager另行按周期汇总发起查询
    register(type, instance, series, callback) {

    }

    // 取消注册，避免资源浪费
    unregister (config) {

    }

    __updateScheduler () {

    }

}