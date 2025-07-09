<template>
    <vgis-sub-card title="冷却塔效率散点图">
        <v-chart :option="chartOption" autoresize></v-chart>
    </vgis-sub-card>
</template>

<script>
import VgisSubCard from "@/components/DashboardWidget/Shared/vgis-sub-card.vue"
import { getSeriesHistoryValues } from "@/assets/js/api/hierarchy";
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
            let that = this
            return {
                grid: {
                    left: 45,
                    right: 10,
                    top: 50,
                    bottom: 55
                },
                tooltip: {
                    show: true,
                    formatter (params) {
                        let unit = that.series.unit ? that.series.unit.name : ""
                        return `
                            <div><b>时间：</b>${new Date(params.data[0]).format("yyyy-MM-dd hh:mm:ss")}</div>
                            <div><b>效率：</b>${parseFloat(params.data[1].toFixed(that.series.precision || 2))}${unit}</div>
                        `
                    }
                },
                xAxis: {
                    name: "时间",
                    type: "time",
                    min: "dataMin",
                    max: "dataMax",
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
                    nameGap: 30,
                    nameTextStyle: {
                        align: "center",
                        color: "rgba(255, 255, 255, 0.60)",
                        fontSize: 12
                    }
                },
                yAxis: {
                    name: "效率%",
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
                        align: "right",
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12
                    }
                },
                series: {
                    type: "scatter",
                    data: this.records.map(item => [new Date(item.time).getTime(), parseFloat(item.value)]),
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
        refreshData () {
            let [startDate, endDate] = this.timeRange
            if (!endDate) {
                endDate = new Date()
            }
            if (!startDate) {
                startDate = new Date(endDate.getTime())
                startDate.setMonth(startDate.getMonth() - 1)
            }
            getSeriesHistoryValues(this.tower.id, ["效率"], {
                startAt: startDate,
                endAt: endDate
            }).then(result => {
                this.records = result.data["效率"] ? result.data["效率"].values : []
            })
        },
        getSeries () {
            getTimeSeriesList(this.tower.modelId).then(result => {
                this.series = result.data.find(item => item.name === "效率")
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