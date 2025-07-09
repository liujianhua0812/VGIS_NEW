<template>
    <vgis-card title="故障告警趋势图">
        <v-chart :option="chartOption" autoresize></v-chart>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import {getTaskStatByPeriod} from "@/assets/js/api/malfunction-tasks";

export default {
    name: "TaskTrend",
    props: {
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
            return {
                grid: {
                    top: 50,
                    bottom: 40,
                    left: 25,
                    right: 10
                },
                xAxis: {
                    type: "category",
                    data: this.records.map(item => item.date.format("MM.dd")),
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
                    name: "告警个数",
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
                    type: "line",
                    data: this.records.map(item => item.value),
                    symbolSize: 0,
                    lineStyle: {
                        color: "#40A9FF",
                        width: 3
                    }
                }
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
            getTaskStatByPeriod({ createdAt: this.timeRange }).then(result => {
                let dateMap = result.data.reduce((result, item) => {
                    result[new Date(item.date).format("yyyyMMdd")] = parseInt(item.total)
                    return result
                }, {})
                let [startDate, endDate] = this.timeRange
                if (!endDate) {
                    endDate = new Date()
                }
                if (!startDate) {
                    startDate = new Date(endDate.getTime())
                    startDate.setMonth(startDate.getMonth() - 1)
                }
                let records = []
                for(let i = new Date(startDate.getTime()); i.getTime() <= endDate.getTime(); i.setDate(i.getDate() + 1)) {
                    records.push({
                        date: new Date(i.getTime()),
                        value: dateMap[i.format("yyyyMMdd")] || 0
                    })
                }
                this.records = records
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