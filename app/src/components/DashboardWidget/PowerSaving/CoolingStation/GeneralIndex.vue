<template>
    <vgis-sub-card title="指标总览" style="position: relative;">
        <v-chart :option="chartOption" @click="redirectTo" autoresize></v-chart>
        <v-chart :option="legendOption" style="position: absolute; width: calc(100% - 48px); height: 50px; bottom: 24px;"></v-chart>
    </vgis-sub-card>
</template>

<script>
import VgisSubCard from "@/components/DashboardWidget/Shared/vgis-sub-card.vue";
import {getSeriesHistoryValues} from "@/assets/js/api/hierarchy";
import {toFixedValue} from "@/utils/Statistics";

export default {
    name: "GeneralIndex",
    props: {
        timeRange: Array,
        station: Object
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
        legendOption () {
            return {
                grid: {
                    show: false
                },
                legend: {
                    show: true,
                    left: "center",
                    bottom: 0,
                    itemWidth: 12,
                    itemHeight: 12,
                    itemGap: 14,
                    icon: "rect",
                    textStyle: {
                        color: "#FFFFFF"
                    },
                    data: [{
                        name: "优秀",
                        itemStyle: {
                            color: "#0E4A3B",
                            borderColor: "#2FAE08",
                            borderWidth: 1
                        }
                    }, {
                        name: "良好",
                        itemStyle: {
                            color: "#0A3985",
                            borderColor: "#2174FF",
                            borderWidth: 1
                        }
                    }, {
                        name: "仍需优化",
                        itemStyle: {
                            color: "#433A39",
                            borderColor: "#E17800",
                            borderWidth: 1
                        }
                    }, {
                        name: "急需优化",
                        itemStyle: {
                            color: "#36183B",
                            borderColor: "#B30808",
                            borderWidth: 1
                        }
                    }]
                },
                xAxis: {
                    type: "category",
                    data: [1, 2, 3],
                    show: false
                },
                yAxis: {
                    type: "value",
                    show: false
                },
                series: [{
                    name: "优秀",
                    type: "line",
                    data: []
                }, {
                    name: "良好",
                    type: "line",
                    data: []
                }, {
                    name: "仍需优化",
                    type: "line",
                    data: []
                }, {
                    name: "急需优化",
                    type: "line",
                    data: []
                }]
            }
        },
        chartOption () {
            return {
                series: [{
                    type: "tree",
                    data: this.tree,
                    orient: 'vertical',
                    top: '10%',
                    left: '8%',
                    bottom: '22%',
                    right: '20%',
                    symbolSize: 7,
                    label: {
                        width: 132,
                        fontSize: 14,
                        borderWidth: 1,
                        borderColor: "#FFFFFF",
                        color: "#FFFFFF",
                        padding: 8,
                        borderRadius: 8,
                        formatter (params) {
                            return `{name|${params.name}}\n{value|${params.value}}`
                        },
                        rich: {
                            name: {
                                align: "center"
                            },
                            value: {
                                align: "center",
                                padding: [4, 0, 0, 0]
                            }
                        }
                    },
                    expandAndCollapse: false,
                    edgeShape: 'polyline',
                    edgeForkPosition: '63%',
                    initialTreeDepth: 3
                }]
            }
        }
    },
    data () {
        // TODO: 颜色判断
        return {
            tree: [{
                name: "冷站EER",
                value: 0,
                label: {
                    borderColor: "#2174FF",
                    backgroundColor: "#0A3985",
                },
                children: [{
                    name: "冷机COP",
                    value: 0,
                    to: "/ps/cooling/chiller",
                    label: {
                        borderColor: "#2FAE08",
                        backgroundColor: "#0E4A3B",
                    },
                }, {
                    name: "冷却水WTF",
                    value: 0,
                    to: "/ps/cooling/system",
                    label: {
                        borderColor: "#2FAE08",
                        backgroundColor: "#0E4A3B",
                    },
                    children: [{
                        name: "冷却水泵WTF",
                        value: 0,
                        to: "/ps/cooling/pump",
                        label: {
                            borderColor: "#E17800",
                            backgroundColor: "#433A39",
                        },
                    }, {
                        name: "冷却塔WTF",
                        value: 0,
                        to: "/ps/cooling/tower",
                        label: {
                            borderColor: "#B30808",
                            backgroundColor: "#36183B",
                        },
                    }]
                }, {
                    name: "冷冻水WTF",
                    value: 0,
                    to: "/ps/freezing/system",
                    label: {
                        borderColor: "#2FAE08",
                        backgroundColor: "#0E4A3B",
                    },
                }]
            }]
        }
    },
    methods: {
        redirectTo (params) {
            if (params.data.to) {
                this.$router.push(params.data.to)
            }
        },
        flushData (tree, data) {
            for(let i = 0; i < tree.length; i++) {
                if (data[tree[i].name] || data[tree[i].name] === 0) {
                    tree[i].value = toFixedValue(data[tree[i].name], 2)
                }
                if (tree[i].children) {
                   this.flushData(tree[i].children, data)
                }
            }
        },
        average (records) {
            let total = 0, count = 0
            for(let i = 0; i < records.length; i++) {
                let value = parseFloat(records[i].value)
                if (!isNaN(value)) {
                    total += value
                    count += 1
                }
            }
            return count ? total / count : 0
        },
        refreshData () {
            let [startDate, endDate] = this.timeRange
            if (!endDate) {
                endDate = new Date()
            }
            if (!startDate) {
                startDate = new Date(endDate.getTime())
                startDate.setMonth(startDate.getMonth() - 1)
            }
            getSeriesHistoryValues(this.station.id, ["总供冷功率", "总用电功率", "冷机总用电功率", "冷冻水泵总用电功率", "冷却水泵总用电功率", "冷却塔总用电功率"], {
                startAt: startDate,
                endAt: endDate
            }).then(result => {
                let averageTC = this.average(result.data["总供冷功率"] ? result.data["总供冷功率"].values : [])
                let averageTP = this.average(result.data["总用电功率"] ? result.data["总用电功率"].values : [])
                let averageTPC = this.average(result.data["冷机总用电功率"] ? result.data["冷机总用电功率"].values : [])
                let averageTPCP = this.average(result.data["冷冻水泵总用电功率"] ? result.data["冷冻水泵总用电功率"].values : [])
                let averageTPFP = this.average(result.data["冷却水泵总用电功率"] ? result.data["冷却水泵总用电功率"].values : [])
                let averageTPCT = this.average(result.data["冷却塔总用电功率"] ? result.data["冷却塔总用电功率"].values : [])

                let stat = {
                    "冷站EER": averageTP ? averageTC / averageTP : 0,
                    "冷机COP": averageTPC ? averageTC / averageTPC : 0,
                    "冷却水WTF": (averageTPCP + averageTPCT) ? averageTC / (averageTPCP + averageTPCT) : 0,
                    "冷冻水WTF": averageTPFP ? averageTC / averageTPFP : 0,
                    "冷却水泵WTF": averageTPCP ? averageTC / averageTPCP : 0,
                    "冷却塔WTF": averageTPCT ? averageTC / averageTPCT : 0,
                }

                this.flushData(this.tree, stat)
            })
        }
    }
}
</script>

<style scoped>

</style>