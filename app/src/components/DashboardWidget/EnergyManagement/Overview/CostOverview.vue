<template>
    <div class="chart-container">
        <v-chart :option="comparisonOption" autoresize style="height: 100%; width: 300px;"></v-chart>
        <v-chart :option="componentOption" autoresize style="height: 100%;"></v-chart>
        <v-chart :option="facilityOption" autoresize style="height: 100%;"></v-chart>
    </div>
</template>

<script>
export default {
    name: "CostOverview",
    props: {
        timeRange: Array
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
                        data: [this.curr, this.last],
                        type: 'bar',
                        barWidth: 16,
                        itemStyle: {
                            color: "#25BE8E"
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
                        data: this.energyRatio,
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
                        data: this.deviceRatio,
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
            curr: 20578,
            last: 20566,
            energyRatio: [
                { value: 1048, name: '电', itemStyle: { color: "#25BE8E" } },
                { value: 735, name: '天然气', itemStyle: { color: "#D1E851" }  },
                { value: 580, name: '蒸汽', itemStyle: { color: "#DD7C56" }  },
                { value: 484, name: '水', itemStyle: { color: "#566FDD" }  }
            ],
            deviceRatio: [
                { value: 1048, name: '生产设备', itemStyle: { color: "#25BE8E" } },
                { value: 735, name: '冷站', itemStyle: { color: "#D1E851" }  },
                { value: 580, name: '空压站', itemStyle: { color: "#DD7C56" }  },
                { value: 484, name: '热源', itemStyle: { color: "#566FDD" }  }
            ]
        }
    },
    methods: {
        refreshData () {
            let random = Math.round(Math.random() * 500)
            this.curr += random
            this.last -= random
            for(let i = 0; i < this.energyRatio.length; i++) {
                this.energyRatio[i].value += random
            }
            for(let i = 0; i < this.deviceRatio.length; i++) {
                this.deviceRatio[i].value += random
            }
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