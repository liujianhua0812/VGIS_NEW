<template>
    <vgis-sub-card title="冷站节能分析">
        <div class="selectors">
            <el-radio class="custom-radio" v-for="item in types" :label="item" v-model="selection" @change="refreshData"></el-radio>
        </div>
        <v-chart :option="chartOption" autoresize></v-chart>
    </vgis-sub-card>
</template>

<script>
import VgisSubCard from "@/components/DashboardWidget/Shared/vgis-sub-card.vue";
import {getSeriesHistoryValues} from "@/assets/js/api/hierarchy";

export default {
    name: "PowerSavingAnalysis",
    props: {
        station: Object,
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
        },
        station: {
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
                    top: 40,
                    right: 50,
                    bottom: 30
                },
                tooltip: {
                    trigger: "axis"
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
                    type: "value",
                    name: this.selection,
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
                        align: "left",
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12
                    }
                },
                series: [{
                    type: "line",
                    symbolSize: 0,
                    lineStyle: {
                        color: "#40A9FF",
                        width: 3,
                    },
                    data: this.records.map(item => [item.time, item.value]),
                    markLine: {
                        symbol: "none",
                        data: [{
                            yAxis: 95,
                            label: {
                                color: "#FA541C",
                                formatter: "引导值",
                                position: "end"
                            },
                            lineStyle: {
                                color: "#FA541C"
                            }
                        }, {
                            yAxis: 95,
                            label: {
                                color: "#FA541C",
                                formatter: "95",
                                position: "start"
                            },
                            lineStyle: {
                                color: "#FA541C"
                            }
                        }, {
                            yAxis: 100,
                            label: {
                                color: "#52C41A",
                                formatter: "合格值",
                                position: "end"
                            },
                            lineStyle: {
                                color: "#52C41A"
                            }
                        }, {
                            yAxis: 100,
                            label: {
                                color: "#52C41A",
                                formatter: "100",
                                position: "start"
                            },
                            lineStyle: {
                                color: "#52C41A"
                            }
                        }]
                    }
                }]
            }
        }
    },
    data () {
        return {
            selection: "冷站EER",
            types: ["冷站EER", "冷机COP", "冷却水WTF", "冷冻水WTF", "冷却水泵WTF", "冷却塔WTF"],
            records: []
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

            getSeriesHistoryValues(this.station.id, [this.selection], {
                startAt: startDate,
                endAt: endDate
            }).then(result => {
                this.records = result.data[this.selection] ? result.data[this.selection].values : []
            })
        }
    },
    created() {
        this.refreshData()
    }
}
</script>

<style lang="scss">
    .selectors .custom-radio {
        margin-right: 16px;
        margin-bottom: 8px;

        .el-radio__label {
            color: #FFFFFF;
            font-family: "HarmonyOS Sans SC";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
        }
    }
</style>