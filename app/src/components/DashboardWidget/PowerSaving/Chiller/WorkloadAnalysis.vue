<template>
    <vgis-card title="开机负荷率分析图">
        <chiller-selector :preset="stationChillers" class="m-t-16" v-model="chillers" :default-all="false" :least="1" :multiple="false"></chiller-selector>
        <v-chart style="height: calc(100% - 24px)" :option="chartOption" autoresize></v-chart>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import ChillerSelector from "@/components/DashboardWidget/PowerSaving/Chiller/ChillerSelector.vue";
import {getTimeSeriesList} from "@/assets/js/api/model-series";
import {getSeriesHistoryValues} from "@/assets/js/api/hierarchy";
import {interpolate} from "@/utils/TimeSeriesManager";
export default {
    name: "CoolerWaterTemperature",
    components: {
        ChillerSelector,
        VgisCard
    },
    props: {
        stationChillers: Array,
        timeRange: Array
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
            let records = {}, ticks = {}
            ticks = this.efficiency.reduce((result, item) => {
                result[new Date(item.time).format("yyyy-MM-dd hh:mm:ss")] = true
                return result
            }, {})
            ticks = this.workload.reduce((result, item) => {
                result[new Date(item.time).format("yyyy-MM-dd hh:mm:ss")] = []
                return result
            }, {})
            ticks = Object.keys(ticks).map(item => new Date(item)).sort((i1, i2) => i1 - i2)
            let workload = interpolate(this.workload, ticks)
            let efficiency = interpolate(this.efficiency, ticks)
            records = ticks.map(item => {
                let key = item.format("yyyy-MM-dd hh:mm:ss")
                return {
                    efficiency: efficiency[key],
                    workload: workload[key],
                }
            })

            return {
                grid: {
                    top: 60,
                    left: 25,
                    right: 10
                },
                tooltip: {
                    show: true
                },
                xAxis: {
                    name: "供冷率%",
                    type: "value",
                    min: "dataMin",
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
                    },
                    nameLocation: "center",
                    nameGap: 30,
                    nameTextStyle: {
                        align: "center",
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12
                    }
                },
                yAxis: {
                    name: "负荷率%",
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
                        onZero: false,
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
                series: {
                    type: "scatter",
                    data: records.map(item => [item.efficiency, item.workload]),
                    itemStyle: {
                        color: "#40A9FF"
                    }
                }
            }
        }
    },
    data () {
        return {
            chillers: [],
            sEfficiency: {},
            sWorkload: {},
            efficiency: [],
            workload: []
        }
    },
    methods: {
        getSeries () {
            getTimeSeriesList("Chiller").then(result => {
                this.sEfficiency = result.data.find(item => item.name === "供冷功率")
                this.sWorkload = result.data.find(item => item.name === "负荷率")
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
                getSeriesHistoryValues(this.chillers[0].id, ["供冷功率", "负荷率"], {
                    startAt: startDate,
                    endAt: endDate
                }).then(result => {
                    this.efficiency = result.data["供冷功率"] ? result.data["供冷功率"].values : []
                    this.workload = result.data["负荷率"] ? result.data["负荷率"].values : []
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