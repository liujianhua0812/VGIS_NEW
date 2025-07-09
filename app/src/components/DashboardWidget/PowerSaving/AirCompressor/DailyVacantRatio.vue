<template>
    <vgis-sub-card title="日占空比">
        <v-chart :option="chartOption" autoresize></v-chart>
    </vgis-sub-card>
</template>

<script>
import { getSeriesHistoryValues } from "@/assets/js/api/hierarchy";
import VgisSubCard from "@/components/DashboardWidget/Shared/vgis-sub-card.vue";

export default {
    name: "DailyVacantRatio",
    props: {
        timeRange: Array,
        compressor: Object
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
                    left: 30,
                    top: 50,
                    right: 10,
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
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    name: "日占空比%",
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
                    type: "bar",
                    symbolSize: 0,
                    itemStyle: {
                        color: "#40A9FF"
                    },
                    data: this.records.map(item => [item.date, item.value]),
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
        calculateActiveHours (records) {
            let [startDate, endDate] = this.timeRange
            if (!endDate) {
                endDate = new Date()
            }
            if (!startDate) {
                startDate = new Date(endDate.getTime())
                startDate.setMonth(startDate.getMonth() - 1)
            }

            let result = {}
            for(let i = new Date(startDate.getTime()); i.getTime() <= endDate.getTime(); i.setDate(i.getDate() + 1)) {
                result[i.format("yyyy-MM-dd")] = {
                    value: 0
                }
            }

            let interpolated = []
            for(let i = 0; i < records.length; i++) {
                let record = records[i]
                if (i === 0) {
                    interpolated.push({
                        time: new Date(record.time).format("yyyy-MM-dd 00:00:00"),
                        value: "0"
                    })
                }
                else {
                    let last = new Date(interpolated[interpolated.length - 1].time).format("yyyy-MM-dd")
                    let now = new Date(record.time).format("yyyy-MM-dd")
                    if (now !== last) {
                        interpolated.push({
                            time: new Date(record.time).format("yyyy-MM-dd 00:00:00"),
                            value: interpolated[interpolated.length - 1].value
                        })
                    }
                }
                interpolated.push({
                    time: record.time,
                    value: record.value
                })
            }
            let stat = {}
            for(let i = 0; i < interpolated.length; i++) {
                let record = interpolated[i], last = interpolated[i - 1]
                let date = new Date(record.time).format("yyyy-MM-dd")
                if (!stat[date]) {
                    stat[date] = {
                        value: 0
                    }
                }
                else if (record.value === "1" && last.value === "1") {
                    stat[date].value += new Date(record.time) - new Date(last.time)
                }
                else if (record.value === "0" && last.value === "1") {
                    stat[date].value += new Date(record.time) - new Date(last.time)
                }
            }

            result = Object.entries(Object.assign(result, stat)).map(entry => ({
                date: entry[0],
                value: entry[1].value / (1000 * 60 * 60) / 24 * 100
            })).sort((i1, i2) => i1.date - i2.date)

            return result
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
            let name = "运行状态"
            getSeriesHistoryValues(this.compressor.id, [name], {
                startAt: startDate,
                endAt: endDate
            }).then(result => {
                this.records = this.calculateActiveHours(result.data[name] ? result.data[name].values : [])
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