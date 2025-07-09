<template>
    <vgis-card title="开机组合图">
        <v-chart :option="chartOption" autoresize></v-chart>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import {getMultipleSeriesHistoryValues, getNodesByModel} from "@/assets/js/api/hierarchy";
import {getQuartile} from "@/utils/Statistics";
import {interpolate} from "@/utils/TimeSeriesManager";

export default {
    name: "DailyVacantRatio",
    props: {
        timeRange: Array,
        compressors: Array
    },
    components: {
        VgisCard
    },
    watch: {
        timeRange: {
            handler (newValue) {
                this.refreshData()
            },
            deep: true
        },
        compressors: {
            handler (newValue) {
                this.refreshData()
            },
            deep: true
        }
    },
    computed: {
        chartOption () {
            let records = {}, ticks = {}
            for(let instanceId in this.records) {
                let status = this.records[instanceId]["运行状态"] ? this.records[instanceId]["运行状态"].values : []
                let air = this.records[instanceId]["供气量"] ? this.records[instanceId]["供气量"].values : []
                ticks = status.reduce((result, item) => {
                    result[new Date(item.time).format("yyyy-MM-dd hh:mm:ss")] = true
                    return result
                }, {})
                ticks = air.reduce((result, item) => {
                    result[new Date(item.time).format("yyyy-MM-dd hh:mm:ss")] = []
                    return result
                }, {})
            }
            ticks = Object.keys(ticks).map(item => new Date(item)).sort((i1, i2) => i1 - i2)

            for(let instanceId in this.records) {
                let status = interpolate(this.records[instanceId]["运行状态"] ? this.records[instanceId]["运行状态"].values : [], ticks)
                let air = interpolate(this.records[instanceId]["供气量"] ? this.records[instanceId]["供气量"].values : [], ticks)
                records = Object.entries(status).reduce((result, [time, value]) => {
                    let key = new Date(time).format("yyyy-MM-dd hh:mm:ss")
                    if (!result[key]) {
                        result[key] = {
                            device: 0,
                            air: 0
                        }
                    }
                    if (parseInt(value) === 1) {
                        result[key].device += 1
                    }
                    return result
                }, records)
                records = Object.entries(air).reduce((result, [time, value]) => {
                    let key = new Date(time).format("yyyy-MM-dd hh:mm:ss")
                    if (!result[key]) {
                        result[key] = {
                            device: 0,
                            air: 0
                        }
                    }
                    value = parseFloat(value)
                    if (!isNaN(value)) {
                        result[key].air += value
                    }
                    return result
                }, records)
            }

            records = Object.entries(Object.values(records).filter(item => item.device > 0).reduce((result, item) => {
                if (!result[item.device]) {
                    result[item.device] = []
                }
                result[item.device].push(item.air)
                return result
            }, {})).map(item => ({
                count: parseInt(item[0]),
                values: item[1]
            })).sort((i1, i2) => i1.count - i2.count)

            return {
                grid: {
                    left: 30,
                    top: 50,
                    right: 10,
                    bottom: 30
                },
                tooltip: {
                    show: true
                },
                xAxis: {
                    type: "category",
                    data: records.map(item => item.count),
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
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    name: "供气量m³",
                    type: "value",
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
                },
                series: [{
                    type: "boxplot",
                    data: records.map(category => getQuartile(category.values)),
                    itemStyle: {
                        color: "transparent",
                        borderColor: "#40A9FF",
                        borderCap: "square"
                    },
                    dimensions: 1
                }]
            }
        }
    },
    data () {
        return {
            records: []
        }
    },
    methods: {
        refreshData () {
            let [startDate, endDate] = this.timeRange
            if (!endDate) {
                endDate = new Date()
            }
            if (!startDate) {
                startDate = new Date(endDate.getTime())
                startDate.setMonth(startDate.getMonth() - 1)
            }

            getNodesByModel("AirCompressor").then(result => {
                let compressors = result.data
                getMultipleSeriesHistoryValues(compressors.map(item => item.id), ["运行状态", "供气量"], {
                    startAt: startDate,
                    endAt: endDate
                }).then(result => {
                    this.records = result.data
                })
            })
        }
    },
    created() {
        this.refreshData()
    }
}
</script>

<style scoped>

</style>