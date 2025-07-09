<template>
    <vgis-card title="空压站比能量图">
        <v-chart :option="chartOption" autoresize></v-chart>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import {getSeriesHistoryValues} from "@/assets/js/api/hierarchy";
import {getTimeSeriesList} from "@/assets/js/api/model-series";

export default {
    name: "SpecificEnergy",
    props: {
        station: Object,
        timeRange: Array
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
        }
    },
    computed: {
        chartOption () {
            let that = this
            return {
                grid: {
                    left: 45,
                    top: 50,
                    right: 10,
                    bottom: 30
                },
                tooltip: {
                    show: true,
                    trigger: "axis",
                    formatter ([params]) {
                        return `
                            <div>
                                <b>时间：</b>
                                ${params.data[0].format("yyyy-MM-dd hh:mm:ss")}
                            </div>
                            <div>
                                <b>${that.series.name}：</b>
                                ${parseFloat(params.data[1].toFixed(that.series.precision || 2))}
                                ${that.series.unit ? that.series.unit.name : ""}
                            </div>
                        `
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
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    name: `${this.series.name} ${this.series.unit ? this.series.unit.name : ""}`,
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
                    data: this.records.map(item => [new Date(item.time), parseFloat(item.value)]),
                }]
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
            getTimeSeriesList("AirCompressionStation").then(result => {
                this.series = result.data.find(item => item.name === "比能量") || {}
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
            if (this.station) {
                getSeriesHistoryValues(this.station.id, ["比能量"], {
                    startAt: startDate,
                    endAt: endDate
                }).then(result => {
                    this.records = result.data["比能量"].values
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