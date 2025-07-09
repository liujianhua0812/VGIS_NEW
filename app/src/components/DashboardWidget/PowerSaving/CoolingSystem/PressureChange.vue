<template>
    <vgis-card title="供回水压差变化">
        <v-chart :option="chartOption" autoresize></v-chart>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import {getQuartile} from "@/utils/Statistics";
import {getSeriesHistoryValues} from "@/assets/js/api/hierarchy";

export default {
    name: "TemperatureChange",
    props: {
        system: Object,
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
                grid: [{
                    left: 20,
                    width: "60%"
                }, {
                    left: "63%",
                    right: 20
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
                        name: item.label,
                        itemStyle: {
                            color: item.color
                        }
                    })),
                    bottom: 20,
                    left: "26%",
                    width: "60%",
                },
                tooltip: {
                    show: true,
                    trigger: "axis"
                },
                xAxis: [{
                    type: "time",
                    gridIndex: 0,
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
                }, {
                    type: "category",
                    gridIndex: 1,
                    data: this.monthData.map(item => item.label),
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
                }],
                yAxis: [{
                    type: "value",
                    gridIndex: 0,
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
                    }
                }, {
                    type: "value",
                    gridIndex: 1,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "rgba(255, 255, 255, 0.25)",
                        }
                    },
                    axisLabel: {
                        show: false
                    },
                    nameLocation: "end",
                    nameGap: 20,
                    nameTextStyle: {
                        align: "right",
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12
                    }
                }],
                series: this.monthData.map(item => ({
                    type: "line",
                    name: item.label,
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    data: item.data.map(record => [record.time, record.value]),
                    symbolSize: 0,
                    lineStyle: {
                        color: item.color,
                        width: 3
                    }
                })).concat([{
                    type: "boxplot",
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    data: this.monthData.map(category => getQuartile(category.data.map(record => record.value))),
                    itemStyle: {
                        color: "transparent",
                        borderColor: "#40A9FF",
                        borderCap: "square"
                    },
                    dimensions: 1
                }])
            }
        }
    },
    data () {
        return {
            monthData: [{
                name: "总管供回水压差",
                label: "系统",
                color: "#40A9FF",
                data: []
            }, {
                name: "冷机供回水压差",
                label: "冷机",
                color: "#13C2C2",
                data: []
            }, {
                name: "水泵至冷机压差",
                label: "水泵至冷机",
                color: "#52C41A",
                data: []
            }, {
                name: "冷机至水泵压差",
                label: "冷机至水泵",
                color: "#FAAD14",
                data: []
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

            getSeriesHistoryValues(this.system.id, this.monthData.map(item => item.name), {
                startAt: startDate,
                endAt: endDate
            }).then(result => {
                for(let i = 0; i < this.monthData.length; i++) {
                    if (result.data[this.monthData[i].name]) {
                        this.monthData[i].data = result.data[this.monthData[i].name].values.map(item => ({
                            time: new Date(item.time),
                            value: parseFloat(item.value)
                        }))
                    }
                }
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