<template>
    <vgis-sub-card title="冷机COP">
        <v-chart :option="chartOption" autoresize></v-chart>
    </vgis-sub-card>
</template>

<script>
import VgisSubCard from "@/components/DashboardWidget/Shared/vgis-sub-card.vue";
import {getMultipleSeriesHistoryValues, getSeriesHistoryValues} from "@/assets/js/api/hierarchy";
import {getTimeSeriesList} from "@/assets/js/api/model-series";
import {toFixedValue} from "@/utils/Statistics";

export default {
    name: "COP",
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
                color: [
                    "#40A9FF",
                    "#13C2C2",
                    "#52C41A",
                    "#FAAD14",
                    "#FA8C16"
                ],
                grid: {
                    top: 60,
                    left: 20,
                    right: 10
                },
                legend: {
                    show: true,
                    textStyle: {
                        fontSize: 12,
                        lineHeight: 16,
                        color: "rgba(255, 255, 255, 0.40)",
                    },
                    icon: "rect",
                    itemHeight: 3,
                    itemWidth: 12,
                    data: this.monthData.map(item => ({
                        name: item.name
                    })),
                    bottom: 15,
                    left: "center"
                },
                tooltip: {
                    show: true,
                    trigger: "axis",
                    formatter (params) {
                        return params.map(item => `<b>${item.seriesName}</b>：${toFixedValue(item.value[1], that.series.precision)}`).join("<br/>")
                    }
                },
                xAxis: {
                    type: "time",
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
                series: this.monthData.map((item, index) => ({
                    type: "line",
                    name: item.name,
                    data: item.data.map(record => [new Date(record.time), record.value]),
                    symbolSize: 0,
                    lineStyle: {
                        width: 3
                    }
                }))
            }
        }
    },
    data () {
        return {
            series: {},
            monthData: []
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
                getMultipleSeriesHistoryValues(this.chillers.map(item => item.id), ["COP"], {
                    startAt: startDate,
                    endAt: endDate
                }).then(result => {
                    this.monthData = this.chillers.map(item => ({
                        name: item.name,
                        data: result.data[item.instanceId] && result.data[item.instanceId]["COP"] ? result.data[item.instanceId]["COP"].values : []
                    }))
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