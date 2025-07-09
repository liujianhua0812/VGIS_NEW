<template>
    <vgis-card>
        <template slot="header">
            <div class="flex align-items-center justify-content-between">
                指标关系对比
                <div class="selector-group">
                    <vgis-simple-date-selector class="m-r-17" style="width: 200px;" v-model="dateRange"></vgis-simple-date-selector>
                    X
                    <vgis-index-selector class="m-l-4 m-r-17" style="width: 80px;" v-model="point1"></vgis-index-selector>
                    Y
                    <vgis-index-selector class="m-l-4" style="width: 80px;" v-model="point2"></vgis-index-selector>
                </div>
            </div>
        </template>
        <v-chart :option="chartOption" autoresize></v-chart>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import VgisSimpleDateSelector from "@/components/DashboardWidget/Shared/vgis-simple-date-selector.vue";
import VgisIndexSelector from "@/components/DashboardWidget/Shared/vgis-index-selector.vue";
import {getSeriesHistoryValues} from "@/assets/js/api/hierarchy";
import {getModelInstanceDetail} from "@/assets/js/api/model-instance";

export default {
    name: "IndexComparison",
    components: {
        VgisIndexSelector,
        VgisSimpleDateSelector,
        VgisCard
    },
    computed: {
        chartOption () {
            if (this.point1.length === 0 || this.point2.length === 0) {
                return {}
            }
            let that = this
            let dateMap = {}
            for(let i = 0; i < this.series1.length; i++) {
                let record = this.series1[i]
                dateMap[record.time.format('yyyy-MM-dd hh:mm:ss')] = {
                    series1: record.value
                }
            }
            for(let i = 0; i < this.series2.length; i++) {
                let record = this.series2[i]
                if (!dateMap[record.time.format('yyyy-MM-dd hh:mm:ss')]) {
                    dateMap[record.time.format('yyyy-MM-dd hh:mm:ss')] = {
                        series2: record.value
                    }
                }
                else {
                    dateMap[record.time.format('yyyy-MM-dd hh:mm:ss')].series2 = record.value
                }
            }
            let data = []
            for(let dateString in dateMap) {
                let item = dateMap[dateString]
                if (!isNaN(item.series1 * item.series2)) {
                    data.push([item.series1, item.series2])
                }
            }
            return {
                grid: {
                    left: 40,
                    right: 24,
                    top: 50,
                    bottom: 60
                },
                tooltip: {
                    show: true,
                    formatter (params) {
                        return `
                            <div><b>${that.info1.name}：</b>${parseFloat(params.data[0].toFixed(that.series1.precision || 2))}${that.info1.unit || ""}</div>
                            <div><b>${that.info2.name}：</b>${parseFloat(params.data[1].toFixed(that.series2.precision || 2))}${that.info2.unit || ""}</div>
                        `
                    }
                },
                xAxis: {
                    name: `${this.info1.name} ${that.info1.unit || ""}`,
                    type: "value",
                    nameLocation: "center",
                    nameGap: 30,
                    nameTextStyle: {
                        align: "center",
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        color: "rgba(255, 255, 255, 0.60)",
                        fontSize: 12
                    },
                    axisLine: {
                        lineStyle: {
                            color: "rgba(255, 255, 255, 0.1)"
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: "rgba(255, 255, 255, 0.25)"
                        }
                    }
                },
                yAxis: {
                    name: `${this.info2.name} ${that.info2.unit || ""}`,
                    type: "value",
                    nameLocation: "end",
                    nameGap: 20,
                    nameTextStyle: {
                        align: "left",
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12
                    },
                    splitLine: {
                        lineStyle: {
                            color: "rgba(255, 255, 255, 0.25)"
                        }
                    }
                },
                series: {
                    type: "scatter",
                    data,
                    itemStyle: {
                        color: "#2174FF"
                    }
                }
            }
        }
    },
    watch: {
        dateRange: {
            handler (val) {
                this.getData()
            },
            deep: true
        },
        point1: {
            handler (val) {
                this.getData()
            },
            deep: true
        },
        point2: {
            handler (val) {
                this.getData()
            },
            deep: true
        }
    },
    data () {
        return {
            dateRange: [],
            point1: [],
            point2: [],
            series1: [],
            series2: [],
            info1: "",
            info2: "",
        }
    },
    methods: {
        getData () {
            if (this.dateRange.length < 2 || !this.point1.length || !this.point2.length) {
                this.series1 = []
                this.series2 = []
                return
            }
            Promise.all([
                getSeriesHistoryValues(this.point1[this.point1.length - 2], [this.point1[this.point1.length - 1]], {
                    startAt: this.dateRange[0],
                    endAt: this.dateRange[1]
                }),
                getSeriesHistoryValues(this.point2[this.point2.length - 2], [this.point2[this.point2.length - 1]], {
                    startAt: this.dateRange[0],
                    endAt: this.dateRange[1]
                }),
            ]).then(results => {
                this.info1 = {
                    name: Object.keys(results[0].data)[0],
                    unit: Object.values(results[0].data)[0].unit
                }
                this.series1 = Object.values(results[0].data)[0].values.map(item => {
                    item.value = parseFloat(item.value)
                    item.time = new Date(item.time)
                    return item
                })
                this.info2 = {
                    name: Object.keys(results[1].data)[0],
                    unit: Object.values(results[1].data)[0].unit
                }
                this.series2 = Object.values(results[1].data)[0].values.map(item => {
                    item.value = parseFloat(item.value)
                    item.time = new Date(item.time)
                    return item
                })
                console.log(this.info2)
            })
        }
    }
}
</script>

<style scoped>
    .selector-group {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: rgba(255, 255, 255, 0.90);
        font-family: "HarmonyOS Sans SC";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
    }
</style>
