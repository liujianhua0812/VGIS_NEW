<template>
    <vgis-sub-card title="用气量">
        <v-chart :option="chartOption" autoresize></v-chart>
    </vgis-sub-card>
</template>

<script>
import VgisSubCard from "@/components/DashboardWidget/Shared/vgis-sub-card.vue";

export default {
    name: "AirConsumption",
    components: {
        VgisSubCard
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
                    type: "category",
                    data: this.records.map(item => item.date.format("MM-dd")),
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
                    name: "用气量m³",
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
                    data: this.records.map(item => item.value),
                }]
            }
        }
    },
    data () {
        let records = []
        let now = new Date()
        for(let i = 0; i < 10; i++) {
            let date = new Date(now.getTime())
            date.setDate(i + 1)
            records.push({
                date,
                value: Math.random() * 120
            })
        }

        return {
            records
        }
    }
}
</script>

<style scoped>

</style>