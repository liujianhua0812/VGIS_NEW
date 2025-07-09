<template>
    <vgis-sub-card title="各系统历史故障率">
        <v-chart :option="chartOption" autoresize></v-chart>
    </vgis-sub-card>
</template>

<script>
import VgisSubCard from "@/components/DashboardWidget/Shared/vgis-sub-card.vue";

export default {
    name: "DeviceSetMalfunctionHistory",
    props: {
        timeRange: Array
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
        }
    },
    computed: {
        chartOption () {
            return {
                grid: [{
                    top: 45,
                    left: 30,
                    right: 10,
                    bottom: 25,
                }],
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
                        name: item.name,
                        itemStyle: {
                            color: item.color
                        }
                    })),
                    top: 0,
                    left: "center"
                },
                tooltip: {
                    show: true,
                    trigger: "axis",
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
                    name: "故障率%",
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
                series: this.monthData.map(item => ({
                    type: "line",
                    name: item.name,
                    data: item.data.map(record => [record.date, record.value]),
                    symbolSize: 0,
                    lineStyle: {
                        color: item.color,
                        width: 3
                    }
                }))
            }
        }
    },
    data () {
        return {
            monthData: [{
                name: "冷站",
                color: "#40A9FF",
                data: []
            }, {
                name: "空压站",
                color: "#13C2C2",
                data: []
            }, {
                name: "锅炉",
                color: "#52C41A",
                data: []
            }, {
                name: "制氮机",
                color: "#FADB14",
                data: []
            }, {
                name: "纯水机",
                color: "#FA8C16",
                data: []
            }, {
                name: "除湿机",
                color: "#EB2F96",
                data: []
            }]
        }
    },
    methods: {
        refreshData () {
            function getMonthData () {
                let result = []
                for(let i = new Date(startDate.getTime()); i.getTime() <= endDate.getTime(); i.setDate(i.getDate() + 1)) {
                    let date = new Date(i.getTime())
                    result.push({
                        date,
                        value: 10 + Math.random() * 20
                    })
                }
                return result
            }

            let [startDate, endDate] = this.timeRange
            if (!endDate) {
                endDate = new Date()
            }
            if (!startDate) {
                startDate = new Date(endDate.getTime())
                startDate.setMonth(startDate.getMonth() - 1)
            }
            for(let i = 0; i < this.monthData.length; i++) {
                this.monthData[i].data = getMonthData()
            }
        }
    },
    created() {
        this.refreshData()
    }
}
</script>

<style scoped>

</style>