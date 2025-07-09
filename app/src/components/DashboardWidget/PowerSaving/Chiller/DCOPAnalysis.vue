<template>
    <v-chart :option="chartOption" autoresize></v-chart>
</template>

<script>
import {getTimeSeriesList} from "@/assets/js/api/model-series";
import {getSeriesHistoryValues} from "@/assets/js/api/hierarchy";
import {interpolate} from "@/utils/TimeSeriesManager";

export default {
    name: "COPAnalysis",
    props: {
        timeRange: Array,
        chillers: Array
    },
    watch: {
        chillers: {
            handler (newValue) {
                this.refreshData()
            },
            deep: true
        },
        timeRange: {
            handler (newValue) {
                this.refreshData()
            },
            deep: true
        }
    },
    computed: {
        chartOption() {
            let buckets = [{
                name: "[0, 2)",
                count: 0
            }, {
                name: "[2, 4)",
                count: 0
            }, {
                name: "[4, 6)",
                count: 0
            }, {
                name: "[6, 8)",
                count: 0
            }, {
                name: "[8, 10)",
                count: 0
            }, {
                name: "[10, 12)",
                count: 0
            }]
            buckets = this.COP.reduce((result, item) => {
                let index = Math.floor(parseFloat(item.value) / 2)
                if (index < result.length && index >= 0) {
                    result[index].count++
                }
                return result
            }, buckets)

            let records = {}, ticks = {}
            ticks = this.workload.reduce((result, item) => {
                result[new Date(item.time).format("yyyy-MM-dd hh:mm:ss")] = true
                return result
            }, {})
            ticks = this.temperature.reduce((result, item) => {
                result[new Date(item.time).format("yyyy-MM-dd hh:mm:ss")] = []
                return result
            }, {})
            ticks = this.COP.reduce((result, item) => {
                result[new Date(item.time).format("yyyy-MM-dd hh:mm:ss")] = []
                return result
            }, {})
            ticks = Object.keys(ticks).map(item => new Date(item)).sort((i1, i2) => i1 - i2)
            let workload = interpolate(this.workload, ticks)
            let temperature = interpolate(this.temperature, ticks)
            let cop = interpolate(this.COP, ticks)
            records = ticks.map(item => {
                let key = item.format("yyyy-MM-dd hh:mm:ss")
                return {
                    cop: cop[key],
                    temperature: temperature[key],
                    workload: workload[key],
                }
            })

            return {
                grid: [{
                    left: 20,
                    top: 40,
                    bottom: 40,
                    width: 150,
                    reverse: true
                }, {
                    left: 250,
                    right: 70,
                    top: 40,
                    bottom: 40,
                }],
                tooltip: [{
                    show: true
                }, {
                    show: false,
                    gridIndex: 1
                }],
                visualMap: {
                    min: 18,
                    max: 30,
                    dimension: 2,
                    orient: 'vertical',
                    right: 0,
                    top: 'center',
                    calculable: true,
                    inRange: {
                        color: ["#6A00FF", "#003CFF", "#15FC00", "#FFF600", "#FF5900", "#FF0000"]
                    },
                    seriesIndex: 1,
                    textGap: 0,
                    textStyle: {
                        color: "rgba(255, 255, 255, 0.40)"
                    }
                },
                xAxis: [{
                    type: "value",
                    gridIndex: 0,
                    inverse: true,
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: "rgba(255, 255, 255, 0.25)",
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: "rgba(255, 255, 255, 0.25)",
                        }
                    },
                    axisLabel: {
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12
                    }
                }, {
                    type: "value",
                    gridIndex: 1,
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: "rgba(255, 255, 255, 0.25)",
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: "rgba(255, 255, 255, 0.25)",
                        }
                    },
                    axisLabel: {
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12
                    }
                }],
                yAxis: [{
                    type: "category",
                    data: buckets.map(item => item.name),
                    gridIndex: 0,
                    position: "right",
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "rgba(255, 255, 255, 0.25)",
                        }
                    },
                    axisLabel: {
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    nameLocation: "end",
                    nameGap: 20,
                    nameTextStyle: {
                        align: "center",
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12
                    }
                }, {
                    min: 0,
                    max: 12,
                    type: "value",
                    gridIndex: 1,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "rgba(255, 255, 255, 0.25)",
                        }
                    },
                    axisLabel: {
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    nameLocation: "end",
                    nameGap: 20,
                    nameTextStyle: {
                        align: "center",
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12
                    }
                }],
                series: [{
                    type: "bar",
                    data: buckets.map(item => item.count),
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    itemStyle: {
                        color: "#40A9FF"
                    }
                }, {
                    type: "scatter",
                    data: records.map(item => [item.workload, item.cop, item.temperature]),
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                }]
            }
        }
    },
    data() {
        return {
            series: {},
            COP: [],
            workload: [],
            temperature: []
        }
    },
    methods: {
        getSeries () {
            getTimeSeriesList("Chiller").then(result => {
                this.series = result.data.find(item => item.name === "COP") || {}
            })
        },
        refreshData () {
            let [startDate, endDate] = this.timeRange
            if (!endDate) {
                endDate = new Date()
            }
            if (!startDate) {
                startDate = new Date(endDate.getTime())
                startDate.setMonth(startDate.getMonth() - 1)
            }
            if (this.chillers.length > 0) {
                getSeriesHistoryValues(this.chillers[0].id, ["DCOP", "负荷率", "冷却水供水温度"], {
                    startAt: startDate,
                    endAt: endDate
                }).then(result => {
                    this.COP = result.data["DCOP"] ? result.data["DCOP"].values : []
                    this.workload = result.data["负荷率"] ? result.data["负荷率"].values : []
                    this.temperature = result.data["冷却水供水温度"] ? result.data["冷却水供水温度"].values : []
                })
            }
        }
    },
    created() {
        this.getSeries()
        this.refreshData()
    }
}
</script>

<style scoped>

</style>