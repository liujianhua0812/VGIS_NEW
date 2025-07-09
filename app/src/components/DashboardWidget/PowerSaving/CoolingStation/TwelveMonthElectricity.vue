<template>
    <vgis-sub-card title="逐12个月累计电量">
        <v-chart style="margin-top: 24px; height: calc(100% - 24px);" :option="chartOption" autoresize></v-chart>
    </vgis-sub-card>
</template>

<script>
import VgisSubCard from "@/components/DashboardWidget/Shared/vgis-sub-card.vue";
import {getMultipleSeriesHistoryValues, getNodeChildren} from "@/assets/js/api/hierarchy";

export default {
    name: "TwelveMonthElectricity",
    props: {
        station: Object,
        year: Number
    },
    components: {
        VgisSubCard
    },
    watch: {
        year (newValue) {
            this.refreshData()
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
                    left: 55,
                    top: 84,
                    right: 30
                },
                tooltip: {
                    show: true,
                    trigger: "axis"
                },
                legend: {
                    show: true,
                    left: 0,
                    top: 0,
                    icon: "rect",
                    itemWidth: 13,
                    itemHeight: 13,
                    itemGap: 16,
                    textStyle: {
                        fontSize: 14,
                        lineHeight: 22,
                        color: "rgba(255, 255, 255, 0.40)",
                    },
                },
                xAxis: {
                    type: "category",
                    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(item => `${new Date(this.year - 1, item).format('yy.MM')}~${new Date(this.year, item - 1).format('yy.MM')}`),
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12,
                        rotate: 30
                    },
                    axisLine: {
                        lineStyle: {
                            color: "rgba(255, 255, 255, 0.25)",
                        }
                    },
                    splitLine: {
                        show: false
                    },
                },
                yAxis: {
                    name: "用电kWh",
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
                        align: "right",
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12
                    }
                },
                series: this.records.map(category => ({
                    type: "bar",
                    name: category.name,
                    stack: "总量",
                    data: category.data,
                    itemStyle: {
                        color: category.color
                    }
                }))
            }
        }
    },
    data () {
        return {
            records: [{
                name: "冷却泵",
                color: "#40A9FF",
                data: []
            }, {
                name: "冷冻泵",
                color: "#BAE637",
                data: []
            }, {
                name: "冷却塔",
                color: "#F759AB",
                data: []
            }, {
                name: "冷机",
                color: "#FFA940",
                data: []
            }],
            meters: []
        }
    },
    methods: {
        refreshData () {
            if (this.station && this.station.id) {
                getNodeChildren(this.station.instanceId, "ElectricityMeter").then(result => {
                    this.meters = result.data
                    let thisYear = this.year, lastYear = thisYear - 1
                    getMultipleSeriesHistoryValues(this.meters.map(item => item.instanceId), ["电量"], {
                        aggregation: "month",
                        method: "latest",
                        startAt: new Date(lastYear, 0, 1),
                        endAt: new Date(thisYear, 11, 31)
                    }).then(result => {
                        let records = this.meters.reduce((res, meter) => {
                            let attr = meter.attribute_values.find(item => item.static_attribute.name === "监测设备")
                            let attrValue = attr ? attr.value : ""
                            if (res[attrValue]) {
                                let records = result.data[meter.instanceId] && result.data[meter.instanceId]["电量"] ? result.data[meter.instanceId]["电量"].values : []
                                let dateMap = records.reduce((map, item) => {
                                    let value = parseFloat(item.value)
                                    if (!isNaN(value)) {
                                        map[new Date(item.time).format("yyyy-MM")] = value
                                    }
                                    return map
                                }, {})
                                for(let i = 0; i < 12; i++) {
                                    let curr = new Date(thisYear, i, 1), last = new Date(thisYear, i - 12, 1)
                                    if (dateMap.hasOwnProperty(curr.format("yyyy-MM")) && dateMap.hasOwnProperty(last.format("yyyy-MM"))) {
                                        if (!res[attrValue].data[i] && res[attrValue].data[i] !== 0) {
                                            res[attrValue].data[i] = 0
                                        }
                                        res[attrValue].data[i] += dateMap[curr.format("yyyy-MM")] - dateMap[last.format("yyyy-MM")]
                                    }
                                }
                            }
                            return res
                        }, this.records.reduce((result, item) => {
                            result[item.name] = item
                            return result
                        }, {}))
                        this.records = Object.values(records)
                    })
                })
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