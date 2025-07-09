<template>
    <div class="chart-container">
        <v-chart :option="comparisonOption" autoresize style="height: 100%; width: 300px;"></v-chart>
        <v-chart :option="componentOption" autoresize style="height: 100%;"></v-chart>
        <v-chart :option="facilityOption" autoresize style="height: 100%;"></v-chart>
    </div>
</template>

<script>
export default {
    name: "CarbonOverview",
    props: {
        timeRange: Array
    },
    computed: {
        comparisonOption () {
            return {
                grid: {
                    top: 0,
                    bottom: 30
                },
                xAxis: {
                    type: 'category',
                    data: ['实际值', '指标值'],
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#FFFFFF"
                        }
                    },
                    axisLabel: {
                        color: "#FFFFFF"
                    }
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    }
                },
                series: [
                    {
                        data: [20578, 20566],
                        type: 'bar',
                        barWidth: 16,
                        itemStyle: {
                            color: "#8E56DD"
                        },
                        label: {
                            show: true,
                            position: "top",
                            textStyle: {
                                color: "#FFFFFF"
                            }
                        }
                    }
                ]
            }
        },
        componentOption () {
            return {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    right: 10,
                    top: "middle",
                    icon: "circle",
                    itemWidth: 12,
                    itemGap: 24,
                    itemStyle: {
                        borderWidth: 0,
                    },
                    textStyle: {
                        color: "rgba(255, 255, 255, 0.60)",
                        fontSize: 12,
                    }
                },
                series: [
                    {
                        type: 'pie',
                        center: ["50%", "50%"],
                        radius: '70%',
                        data: [
                            { value: 1048, name: '电', itemStyle: { color: "#8E56DD" } },
                            { value: 735, name: '天然气', itemStyle: { color: "#D54941" }  },
                            { value: 580, name: '蒸汽', itemStyle: { color: "#E37318" }  },
                            { value: 484, name: '水', itemStyle: { color: "#E851B3" }  }
                        ],
                        label: {
                            show: false
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        itemStyle: {
                            borderWidth: 1,
                            borderColor: '#FFFFFF'
                        }
                    }
                ]
            }
        },
        facilityOption () {
            return {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    right: 10,
                    top: "middle",
                    icon: "circle",
                    itemWidth: 12,
                    itemGap: 24,
                    itemStyle: {
                        borderWidth: 0,
                    },
                    textStyle: {
                        color: "rgba(255, 255, 255, 0.60)",
                        fontSize: 12,
                    }
                },
                series: [
                    {
                        type: 'pie',
                        center: ["50%", "50%"],
                        radius: '70%',
                        data: [
                            { value: 1048, name: '生产设备', itemStyle: { color: "#8E56DD" } },
                            { value: 735, name: '冷站', itemStyle: { color: "#D54941" }  },
                            { value: 580, name: '空压站', itemStyle: { color: "#E37318" }  },
                            { value: 484, name: '热源', itemStyle: { color: "#E851B3" }  }
                        ],
                        label: {
                            show: false
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        itemStyle: {
                            borderWidth: 1,
                            borderColor: '#FFFFFF'
                        }
                    }
                ]
            }
        }
    },
    data () {
        return {

        }
    }
}
</script>

<style scoped>
.chart-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>