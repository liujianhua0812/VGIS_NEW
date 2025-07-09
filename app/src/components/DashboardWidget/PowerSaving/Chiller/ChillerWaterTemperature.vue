<template>
    <vgis-card title="冷机进出口水温分析">
        <chiller-selector :preset="stationChillers" class="m-t-16" v-model="chillers" :default-all="false" :least="1" :multiple="false"></chiller-selector>
        <v-chart style="height: calc(100% - 24px)" :option="chartOption" autoresize></v-chart>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import ChillerSelector from "@/components/DashboardWidget/PowerSaving/Chiller/ChillerSelector.vue";
import {getMultipleSeriesHistoryValues, getSeriesHistoryValues} from "@/assets/js/api/hierarchy";
export default {
    name: "ChillerWaterTemperature",
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
        }
    },
    computed: {
        chartOption () {
            return {
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
                    data: this.dailyData.map(item => ({
                        name: item.name,
                        itemStyle: {
                            color: item.color
                        }
                    })),
                    bottom: 15,
                    left: "center"
                },
                tooltip: {
                    show: true
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
                    name: "温度℃",
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
                series: this.dailyData.map((item, index) => ({
                    type: "scatter",
                    name: item.name,
                    data: item.data.map(record => [record.time, record.value]),
                    itemStyle: {
                        color: item.color,
                        width: 3
                    }
                }))
            }
        }
    },
    data () {
        return {
            chillers: [],
            dailyData: [{
                name: "冷冻水供水温度",
                color: "#40A9FF",
                data: []
            }, {
                name: "冷冻水回水温度",
                color: "#52C41A",
                data: []
            }, {
                name: "冷却水供水温度",
                color: "#FA8C16",
                data: []
            }, {
                name: "冷却水回水温度",
                color: "#FA541C",
                data: []
            }]
        }
    },
    methods: {
        refreshData () {
            let chiller = this.chillers[0]
            if (chiller) {
                let [startDate, endDate] = this.timeRange
                if (!endDate) {
                    endDate = new Date()
                }
                if (!startDate) {
                    startDate = new Date(endDate.getTime())
                    startDate.setMonth(startDate.getMonth() - 1)
                }
                getSeriesHistoryValues(encodeURIComponent(chiller.instanceId), this.dailyData.map(item => item.name), {
                    startAt: startDate,
                    endAt: endDate
                }).then(result => {
                    for(let i = 0; i < this.dailyData.length; i++) {
                        if (result.data[this.dailyData[i].name]) {
                            this.dailyData[i].data = result.data[this.dailyData[i].name].values.map(item => ({
                                value: parseFloat(item.value),
                                time: new Date(item.time)
                            }))
                        }
                        else {
                            this.dailyData[i].data = []
                        }
                    }
                })
            }
        }
    }
}
</script>

<style scoped>

</style>