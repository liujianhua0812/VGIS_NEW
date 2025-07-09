<template>
    <vgis-card title="供回水温差变化">
        <v-chart :option="chartOption" autoresize></v-chart>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import {getSeriesHistoryValues, getStaticAttributeValues} from "@/assets/js/api/hierarchy";
import { getQuartile } from "@/utils/Statistics";

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
                    bottom: 40,
                    width: "60%",
                }, {
                    left: "63%",
                    right: 20,
                    bottom: 40,
                }],
                tooltip: {
                    show: true
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
                series: this.monthData.map((item, index) => ({
                    type: "line",
                    name: item.label,
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    data: item.data.map(record => [record.time, record.value]),
                    symbolSize: 0,
                    lineStyle: {
                        color: item.color,
                        width: 3
                    },
                    markLine: index === 0 ? {
                        data: [{
                            yAxis: this.designTemperature,
                            label: {
                                formatter: "设计温度",
                                position: "end"
                            }
                        }, {
                            yAxis: this.designTemperature,
                            label: {
                                formatter: `${this.designTemperature}`,
                                position: "start"
                            }
                        }],
                        lineStyle: {
                            color: "#FA541C"
                        },
                        symbol: "none",
                        label: {
                            color: "#FA541C"
                        }
                    } : {}
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
                name: "总管供回水温差",
                label: "温度",
                color: "#40A9FF",
                data: []
            }],
            designTemperature: "",
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
        },
        getDesignTemperature () {
            getStaticAttributeValues(this.system.id, ["设计温度"]).then(result => {
                if (result.data[0]) {
                    this.designTemperature = parseFloat(result.data[0].value)
                }
            })
        }
    },
    created() {
        this.refreshData()
        this.getDesignTemperature()
    }
}
</script>

<style scoped>

</style>