<template>
    <vgis-sub-card title="排气温度图">
        <v-chart :option="chartOption" autoresize></v-chart>
    </vgis-sub-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import VgisSubCard from "@/components/DashboardWidget/Shared/vgis-sub-card.vue";
import {getSeriesHistoryValues} from "@/assets/js/api/hierarchy";

export default {
    name: "AirTemperature",
    props: {
        timeRange: Array,
        compressor: Object
    },
    components: {
        VgisSubCard,
        VgisCard
    },
    watch: {
        timeRange: {
            handler (newValue) {
                this.refreshData()
            },
            deep: true
        },
        compressor: {
            handler (newValue) {
                this.refreshData()
            },
            deep: true
        }
    },
    computed: {
        chartOption () {
            return {
                grid: {
                    left: 40,
                    top: 50,
                    right: 10,
                    bottom: 30
                },
                tooltip: {
                    show: true,
                    trigger: "axis"
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
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    name: "排气温度℃",
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
                    type: "line",
                    symbolSize: 0,
                    lineStyle: {
                        color: "#40A9FF",
                        width: 3,
                    },
                    data: this.records.map(item => [item.time, item.value]),
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
            let name = "排气温度"
            getSeriesHistoryValues(this.compressor.id, [name], {
                startAt: startDate,
                endAt: endDate
            }).then(result => {
                this.records = result.data[name] ? result.data[name].values : []
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