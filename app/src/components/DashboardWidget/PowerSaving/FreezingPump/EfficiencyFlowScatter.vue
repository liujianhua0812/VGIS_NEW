<template>
    <vgis-sub-card title="效率-流量散点图">
        <v-chart :option="chartOption" autoresize></v-chart>
    </vgis-sub-card>
</template>

<script>
import VgisSubCard from "@/components/DashboardWidget/Shared/vgis-sub-card.vue"
import {getNodeParents, getSeriesHistoryValues} from "@/assets/js/api/hierarchy";
import {getTimeSeriesList} from "@/assets/js/api/model-series";

export default {
    name: "LiftFlowScatter",
    props: {
        timeRange: Array,
        pump: Object
    },
    components: {
        VgisSubCard
    },
    watch: {
        timeRange: {
            handler (newValue) {
                this.refreshData()
            },
            deep: true
        },
        pump: {
            handler (newValue) {
                this.refreshData()
            },
            deep: true
        }
    },
    computed: {
        chartOption () {
            let dateMap = {}
            for(let i = 0; i < this.records1.length; i++) {
                let record = this.records1[i]
                dateMap[new Date(record.time).format('yyyy-MM-dd hh:mm:ss')] = {
                    series1: parseFloat(record.value)
                }
            }
            for(let i = 0; i < this.records2.length; i++) {
                let record = this.records2[i]
                if (!dateMap[new Date(record.time).format('yyyy-MM-dd hh:mm:ss')]) {
                    dateMap[new Date(record.time).format('yyyy-MM-dd hh:mm:ss')] = {
                        series2: parseFloat(record.value)
                    }
                }
                else {
                    dateMap[new Date(record.time).format('yyyy-MM-dd hh:mm:ss')].series2 = parseFloat(record.value)
                }
            }
            let data = []
            for(let dateString in dateMap) {
                let item = dateMap[dateString]
                if (!isNaN(item.series1 * item.series2)) {
                    data.push([item.series1, item.series2])
                }
            }
            return {
                grid: {
                    left: 30,
                    right: 10,
                    top: 50,
                    bottom: 45
                },
                tooltip: {
                    show: true
                },
                xAxis: {
                    name: `${this.series1.name} ${this.series1.unit ? this.series1.unit.name : ""}`,
                    type: "value",
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        color: "rgba(255, 255, 255, 0.60)",
                        fontSize: 12
                    },
                    axisLine: {
                        lineStyle: {
                            color: "rgba(255, 255, 255, 0.1)"
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: "rgba(255, 255, 255, 0.25)"
                        }
                    },
                    nameLocation: "center",
                    nameGap: 20,
                    nameTextStyle: {
                        align: "center",
                        color: "rgba(255, 255, 255, 0.60)",
                        fontSize: 12
                    }
                },
                yAxis: {
                    name: `${this.series2.name} ${this.series2.unit ? this.series2.unit.name : ""}`,
                    type: "value",
                    axisLine: {
                        show: false,
                        onZero: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12
                    },
                    splitLine: {
                        lineStyle: {
                            color: "rgba(255, 255, 255, 0.25)"
                        }
                    },
                    nameGap: 20,
                    nameTextStyle: {
                        align: "left",
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12
                    }
                },
                series: {
                    type: "scatter",
                    data,
                    itemStyle: {
                        color: "#40A9FF"
                    }
                }
            }
        }
    },
    data () {
        return {
            chiller: {},
            series1: {},
            series2: {},
            records1: [],
            records2: []
        }
    },
    methods: {
        getSeries () {
            getTimeSeriesList("FreezingPump").then(result => {
                this.series1 = result.data.find(item => item.name === "效率") || {}
            })
            getTimeSeriesList("FreezingSystem").then(result => {
                this.series2 = result.data.find(item => item.name === "冷机平均流量") || {}
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
            getNodeParents(this.pump.id).then(result => {
                let parents = result.data
                let system = parents.find(item => item.model.modelId === "FreezingSystem")
                if (system) {
                    getSeriesHistoryValues(system.id, ["冷机平均流量"], {
                        startAt: startDate,
                        endAt: endDate
                    }).then(result => {
                        this.records2 = result.data["冷机平均流量"].values
                    })
                }
            })
            getSeriesHistoryValues(this.pump.id, ["效率"], {
                startAt: startDate,
                endAt: endDate
            }).then(result => {
                this.records1 = result.data["效率"].values
            })
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