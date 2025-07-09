<template>
    <vgis-card title="两器趋近温度分析">
        <chiller-selector :preset="stationChillers" class="m-t-16" v-model="chillers" :default-all="false" :least="1" :multiple="false"></chiller-selector>
        <v-chart style="height: calc(100% - 24px)" :option="chartOption" autoresize></v-chart>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import ChillerSelector from "@/components/DashboardWidget/PowerSaving/Chiller/ChillerSelector.vue";
import {getTimeSeriesList} from "@/assets/js/api/model-series";
import {getMultipleSeriesHistoryValues, getSeriesHistoryValues} from "@/assets/js/api/hierarchy";
import {getQuartile} from "@/utils/Statistics";
export default {
    name: "TemperatureComparison",
    props: {
        stationChillers: Array,
        timeRange: Array
    },
    components: {
        ChillerSelector,
        VgisCard
    },
    watch: {
        chillers: {
            handler (newValue) {
                this.refreshData()
            },
            deep: true
        },
        timeRange: {
            handler (newValue) {
                this.refreshData()
            },
            deep: true
        }
    },
    computed: {
        chartOption () {
            if (this.chillers.length < 1) {
                return {}
            }
            return {
                grid: {
                    top: 60,
                    left: 30,
                    right: 10,
                    bottom: 40
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
                    data: this.records.map(item => ({
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
                    type: "category",
                    data: this.records.map(item => item.name.replace("趋近温度", "")),
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
                    name: "趋近温度",
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
                series: {
                    type: "boxplot",
                    data: this.records.map(category => getQuartile(category.values.map(record => parseFloat(record.value)))),
                    itemStyle: {
                        color: "transparent",
                        borderColor: "#40A9FF",
                        borderCap: "square"
                    },
                    dimensions: 1
                }
            }
        }
    },
    data () {
        return {
            chillers: [],
            records: []
        }
    },
    methods: {
        getSeries () {
            getTimeSeriesList("Chiller").then(result => {
                this.series = result.data.find(item => item.name === "COP") || {}
            })
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
            if (this.chillers.length > 0) {
                getSeriesHistoryValues(this.chillers[0].id, ["蒸发器趋近温度", "冷凝器趋近温度"], {
                    startAt: startDate,
                    endAt: endDate
                }).then(result => {
                    this.records = Object.values(result.data)
                })
            }
        }
    },
    created() {
        this.getSeries()
        this.refreshData()
    }
}
</script>

<style scoped>

</style>