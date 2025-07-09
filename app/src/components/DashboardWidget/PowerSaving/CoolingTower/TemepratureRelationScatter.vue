<template>
    <vgis-sub-card title="出水温度-室外湿球温度关系散点图">
        <v-chart :option="chartOption" autoresize></v-chart>
    </vgis-sub-card>
</template>

<script>
import VgisSubCard from "@/components/DashboardWidget/Shared/vgis-sub-card.vue"
import {getSeriesHistoryValues} from "@/assets/js/api/hierarchy";
import {getTimeSeriesList} from "@/assets/js/api/model-series";

export default {
    name: "TemperatureRelationScatter",
    props: {
        timeRange: Array,
        tower: Object
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
        tower: {
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
            let that = this
            return {
                grid: {
                    left: 45,
                    right: 10,
                    top: 50,
                    bottom: 45
                },
                tooltip: {
                    show: true,
                    formatter (params) {
                        return `
                            <div><b>出水温度：</b>${parseFloat(params.data[0].toFixed(that.series1.precision || 2))}${that.series1.unit ? that.series1.unit.name : ""}</div>
                            <div><b>室外湿球温度：</b>${parseFloat(params.data[1].toFixed(that.series2.precision || 2))}${that.series2.unit ? that.series2.unit.name : ""}</div>
                        `
                    }
                },
                xAxis: {
                    name: `出水温度${this.series1.unit ? this.series1.unit.name : ""}`,
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
                    name: `室外湿球温度${this.series2.unit ? this.series2.unit.name : ""}`,
                    type: "value",
                    axisLine: {
                        show: false
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
                        align: "center",
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
            series1: {},
            series2: {},
            records1: [],
            records2: []
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
            Promise.all([
                getSeriesHistoryValues(this.tower.id, ["出水温度"], {
                    startAt: startDate,
                    endAt: endDate
                }),
                getSeriesHistoryValues("总场站", ["室外湿球温度"], {
                    startAt: startDate,
                    endAt: endDate
                })
            ]).then(results => {
                this.records1 = results[0].data["出水温度"] ? results[0].data["出水温度"].values : []
                this.records2 = results[1].data["室外湿球温度"] ? results[1].data["室外湿球温度"].values : []
            })
        },
        getSeries () {
            Promise.all([
                getTimeSeriesList(this.tower.modelId),
                getTimeSeriesList("233", { name: "总场站" })
            ]).then(results => {
                this.series1 = results[0].data.find(item => item.name === "出水温度")
                this.series2 = results[1].data.find(item => item.name === "室外湿球温度")
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