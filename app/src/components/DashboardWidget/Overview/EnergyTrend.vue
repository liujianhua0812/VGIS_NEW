<template>
    <vgis-card title="能耗趋势">
        <v-chart :option="chartOption" autoresize></v-chart>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import {getMultipleSeriesHistoryValues, getNodesByModel, getSeriesHistoryValues} from "@/assets/js/api/hierarchy";
import {getTimeSeriesList} from "@/assets/js/api/model-series";
import {toFixedValue} from "@/utils/Statistics";

export default {
    name: "EnergyTrend",
    components: {
        VgisCard
    },
    computed: {
        chartOption () {
            return {
                grid: {
                    show: false,
                    right: 10,
                    left: 50,
                    top: 40,
                    bottom: 30
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
                    name: "万kWh",
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
                        align: "right",
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12
                    },
                },
                tooltip: {
                    show: true,
                    trigger: "axis"
                },
                series: [{
                    type: "line",
                    name: "今日",
                    symbol: "none",
                    data: this.toDifferentiateValue(this.today),
                    lineStyle: {
                        width: 3,
                        color: "#FF9500"
                    }
                }, {
                    type: "line",
                    name: "昨日",
                    symbol: "none",
                    data: this.toDifferentiateValue(this.yesterday),
                    lineStyle: {
                        width: 3,
                        color: "#3CB1FB"
                    }
                }, {
                    type: "line",
                    name: "去年今日",
                    symbol: "none",
                    data: this.toDifferentiateValue(this.lastYear),
                    lineStyle: {
                        width: 3,
                        color: "#07A872"
                    }
                }]
            }
        }
    },
    data () {
        let today = [], yesterday = [], lastYear = []
        return {
            date: "",
            series: "",
            today, yesterday, lastYear
        }
    },
    methods: {
        toDifferentiateValue (records) {
            if (records.length === 0) {
                return records
            }
            let date = records[0][0].format("yyyy-MM-dd")
            let dateMap = records.reduce((res, [date, value]) => {
                res[date.format("yyyy-MM-dd hh")] = value
                return res
            }, {})
            let result = []
            for(let i = 0; i < 24; i++) {
                let currentHour = new Date(`${date} ${`${i}`.padStart(2, "0")}:00:00`).format("yyyy-MM-dd hh")
                let nextHour = new Date(`${date} ${`${i + 1}`.padStart(2, "0")}:00:00`).format("yyyy-MM-dd hh")
                if (dateMap.hasOwnProperty(currentHour) && dateMap.hasOwnProperty(nextHour)) {
                    result.push([new Date(`${this.date} ${`${i}`.padStart(2, "0")}:00:00`), toFixedValue(dateMap[nextHour] - dateMap[currentHour], this.series.precision || 2)])
                }
            }
            return result
        },
        getSeries () {
            getTimeSeriesList("StationTop").then(result => {
                this.series = result.data.find(item => item.name === "总能耗")
            })
        },
        refreshData () {
            let now = new Date()

            let today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

            this.date = today.format("yyyy-MM-dd")

            let todayEnd = new Date(today.getTime())
            todayEnd.setDate(todayEnd.getDate() + 1)
            todayEnd.setHours(todayEnd.getHours() + 1)
            todayEnd.setSeconds(todayEnd.getSeconds() - 1)

            let yesterday = new Date(today.getTime())
            yesterday.setDate(yesterday.getDate() - 1)
            let yesterdayEnd = new Date(today.getTime())
            yesterdayEnd.setHours(yesterdayEnd.getHours() + 1)
            yesterdayEnd.setSeconds(yesterdayEnd.getSeconds() - 1)

            let todayInLastYear = new Date(today.getTime())
            todayInLastYear.setFullYear(todayInLastYear.getFullYear() - 1)
            let todayInLastYearEnd = new Date(todayEnd.getTime())
            todayInLastYearEnd.setFullYear(todayInLastYearEnd.getFullYear() - 1)

            Promise.all([
                getSeriesHistoryValues("总场站", ["总能耗"], {
                    startAt: today,
                    endAt: todayEnd,
                    aggregation: "hour",
                    method: "earliest"
                }),
                getSeriesHistoryValues("总场站", ["总能耗"], {
                    startAt: yesterday,
                    endAt: yesterdayEnd,
                    aggregation: "hour",
                    method: "earliest"
                }),
                getSeriesHistoryValues("总场站", ["总能耗"], {
                    startAt: todayInLastYear,
                    endAt: todayInLastYearEnd,
                    aggregation: "hour",
                    method: "earliest"
                }),
            ]).then(([tData, yData, yLData]) => {
                this.today = (tData.data["总能耗"] ? tData.data["总能耗"].values : []).map(item => {
                    return [
                        new Date(item.time),
                        parseFloat(item.value) / 10000
                    ]
                })
                this.yesterday = (yData.data["总能耗"] ? yData.data["总能耗"].values : []).map(item => {
                    return [
                        new Date(item.time),
                        parseFloat(item.value) / 10000
                    ]
                })
                this.lastYear = (yLData.data["总能耗"] ? yLData.data["总能耗"].values : []).map(item => {
                    return [
                        new Date(item.time),
                        parseFloat(item.value) / 10000
                    ]
                })
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