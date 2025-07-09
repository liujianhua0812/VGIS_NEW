<template>
    <vgis-card title="能耗平均趋势">
        <v-chart :option="chartOption" autoresize></v-chart>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import {getMultipleSeriesHistoryValues, getNodeChildren, getSeriesHistoryValues} from "@/assets/js/api/hierarchy";
import {calculateUpperAndLowerBound, toFixedValue} from "@/utils/Statistics";

export default {
    name: "EnergyAverageTrend",
    components: {
        VgisCard
    },
    computed: {
        chartOption () {
            let trend = this.trend
            let { upper, lower } = calculateUpperAndLowerBound(trend.map(item => item.value))

            return {
                tooltip: {
                    show: true,
                    trigger: "axis",
                    formatter ([params]) {
                        return `<b>${params.name}: </b>${toFixedValue(params.value, 2).toLocaleString()} kWh`
                    }
                },
                grid: {
                    right: 24,
                    left: 40,
                    top: 50,
                    bottom: 60
                },
                xAxis: {
                    type: "category",
                    data: trend.map(item => item.date),
                    axisLabel: {
                        color: "rgba(255, 255, 255, 0.60)",
                        fontSize: 12,
                        rotate: 30
                    },
                    axisLine: {
                        lineStyle: {
                            color: "rgba(255, 255, 255, 0.25)"
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: "rgba(255, 255, 255, 0.25)"
                        }
                    }
                },
                yAxis: {
                    name: "万kWh",
                    max: upper,
                    min: lower,
                    type: "value",
                    nameLocation: "end",
                    nameGap: 20,
                    nameTextStyle: {
                        align: "right",
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12
                    },
                    axisLabel: {
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12,
                        formatter (value) {
                            return value / 10000
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: "rgba(255, 255, 255, 0.25)"
                        }
                    }
                },
                series: {
                    type: "bar",
                    data: trend.map(item => item.value),
                    itemStyle: {
                        color: "#2174FF"
                    }
                }
            }
        }
    },
    data () {
        return {
            trend: []
        }
    },
    methods: {
        refreshData () {
            let now = new Date()
            let startAt = new Date(now.getFullYear() - 1, 0, 1)
            let endAt = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0)
            getSeriesHistoryValues("总场站", ["总能耗"], {
                startAt,
                endAt,
                aggregation: "month",
                method: "latest"
            }).then(result => {
                let dateKey = "yy.MM"
                let records = result.data["总能耗"] ? result.data["总能耗"].values : []
                let dateMap = records.reduce((map, item) => {
                    let value = parseFloat(item.value)
                    if (!isNaN(value)) {
                        map[new Date(item.time).format(dateKey)] = value
                    }
                    return map
                }, {})
                let res = []
                for(let i = 0; i < 12; i++) {
                    let curr = new Date(now.getFullYear(), i, 1), last = new Date(now.getFullYear(), i - 12, 1), labelLast = new Date(now.getFullYear(), i - 11, 1)
                    let item = {}
                    item.date = `${labelLast.format(dateKey)}-${curr.format(dateKey)}`
                    if (dateMap.hasOwnProperty(curr.format(dateKey)) && dateMap.hasOwnProperty(last.format(dateKey))) {
                        item.value = dateMap[curr.format(dateKey)] - dateMap[last.format(dateKey)]
                    }
                    res.push(item)
                }
                this.trend = res
            })
        }
    },
    created () {
        this.refreshData()
    }
}
</script>

<style scoped>

</style>