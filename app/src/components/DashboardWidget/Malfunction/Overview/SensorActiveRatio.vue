<template>
    <vgis-sub-card title="各系统传感器在线率">
        <v-chart :option="chartOption" autoresize></v-chart>
    </vgis-sub-card>
</template>

<script>
import VgisSubCard from "@/components/DashboardWidget/Shared/vgis-sub-card.vue";

export default {
    name: "SensorActiveRatio",
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
                grid: {
                    top: 45,
                    left: 30,
                    right: 10,
                    bottom: 30,
                },
                tooltip: {
                    show: true
                },
                xAxis: {
                    type: "category",
                    data: this.records.map(item => item.name),
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
                    name: "在线率%",
                    type: "value",
                    max: 100,
                    min: 0,
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
                    type: "bar",
                    data: this.records.map(item => item.data),
                    itemStyle: {
                        color: "#40A9FF"
                    }
                }
            }
        }
    },
    data () {
        return {
            records: [{
                name: "冷站",
                data: 30
            }, {
                name: "空压站",
                data: 63
            }, {
                name: "锅炉",
                data: 75
            }, {
                name: "制氮机",
                data: 72
            }, {
                name: "纯水机",
                data: 74
            }, {
                name: "除湿机",
                data: 70
            }]
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
            for(let i = 0; i < this.records.length; i++) {
                this.records[i].data = Math.round(70 + Math.random() * 30)
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