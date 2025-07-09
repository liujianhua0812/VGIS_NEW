<template>
    <vgis-sub-card title="冷机平均COP">
        <v-chart :option="chartOption" autoresize></v-chart>
    </vgis-sub-card>
</template>

<script>
import VgisSubCard from "@/components/DashboardWidget/Shared/vgis-sub-card.vue";
import {getMultipleSeriesHistoryValues} from "@/assets/js/api/hierarchy";
import {getTimeSeriesList} from "@/assets/js/api/model-series";
import {toFixedValue} from "@/utils/Statistics";

export default {
    name: "AverageCOP",
    props: {
        timeRange: Array,
        chillers: Array
    },
    components: {
        VgisSubCard
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
        chartOption () {
            let that = this
            return {
                grid: {
                    top: 60,
                    left: 20,
                    right: 10
                },
                tooltip: {
                    show: true,
                    formatter (params) {
                        return `<b>${params.name}</b><br/>${toFixedValue(params.value, that.series.precision)}`
                    }
                },
                xAxis: {
                    type: "category",
                    data: this.records.map(item => item.name),
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
                },
                yAxis: {
                    name: "COP值",
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
                    nameLocation: "end",
                    nameGap: 20,
                    nameTextStyle: {
                        align: "center",
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12
                    }
                },
                series: {
                    type: "bar",
                    data: this.records.map(item => item.value),
                    itemStyle: {
                        color: "#40A9FF"
                    }
                }
            }
        }
    },
    data () {
        return {
            series: {},
            records: []
        }
    },
    methods: {
        getSeries () {
            getTimeSeriesList("Chiller").then(result => {
                this.series = result.data.find(item => item.name === "COP") || {}
            })
        },
        average (records) {
            let total = 0, count = 0
            for(let i = 0; i < records.length; i++) {
                let value = parseFloat(records[i].value)
                if (!isNaN(value)) {
                    total += value
                    count += 1
                }
            }
            return count ? total / count : 0
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
                getMultipleSeriesHistoryValues(this.chillers.map(item => item.id), ["供冷功率", "耗电功率"], {
                    startAt: startDate,
                    endAt: endDate
                }).then(result => {
                    this.records = this.chillers.map(item => {
                        let stat = {
                            name: item.name,
                            value: 0
                        }

                        if (!result.data[item.instanceId]) {
                            return stat
                        }

                        let averageC = this.average(result.data[item.instanceId]["供冷功率"] ? result.data[item.instanceId]["供冷功率"].values : [])
                        let averageP = this.average(result.data[item.instanceId]["耗电功率"] ? result.data[item.instanceId]["耗电功率"].values : [])

                        if (averageP) {
                            stat.value = averageC / averageP
                        }

                        return stat
                    })
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