<template>
    <vgis-sub-card title="频率分布图">
        <v-chart :option="chartOption" autoresize></v-chart>
    </vgis-sub-card>
</template>

<script>
import VgisSubCard from "@/components/DashboardWidget/Shared/vgis-sub-card.vue";
import {getSeriesHistoryValues} from "@/assets/js/api/hierarchy";
import {getTimeSeriesList} from "@/assets/js/api/model-series";

export default {
    name: "FrequencyDistribution",
    props: {
        timeRange: Array,
        pump: Object
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
        pump: {
            handler (newValue) {
                this.refreshData()
            },
            deep: true
        }
    },
    computed: {
        chartOption () {
            if (!this.series.id) {
                return {}
            }
            let gap = this.series.max - this.series.min
            if (isNaN(gap) || gap === 0) {
                return {}
            }
            let buckets = [], interval = (this.series.max - this.series.min) / 10
            for(let i = 0; i < 10; i++) {
                buckets.push({
                    range: `[${this.series.min + i * interval}, ${this.series.min + (i + 1) * interval})`,
                    value: 0
                })
            }
            for(let i = 0; i < this.frequencies.length; i++) {
                let record = this.frequencies[i]
                let value = parseFloat(record.value)
                let index = Math.floor((value - this.series.min) / interval)
                if (buckets[index]) {
                    buckets[index].value++
                }
            }
            return {
                tooltip: {
                    show: true
                },
                grid: {
                    right: 20,
                    left: 30,
                    top: 50,
                    bottom: 60
                },
                xAxis: {
                    name: "频率Hz",
                    type: "category",
                    data: buckets.map(item => item.range),
                    axisLabel: {
                        color: "rgba(255, 255, 255, 0.60)",
                        fontSize: 12,
                        rotate: 30
                    },
                    axisLine: {
                        lineStyle: {
                            color: "rgba(255, 255, 255, 0.25)"
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: "rgba(255, 255, 255, 0.25)"
                        }
                    },
                    nameLocation: "end",
                    nameGap: 20,
                    nameTextStyle: {
                        align: "right",
                        verticalAlign: "top",
                        padding: [20, 0, 0, 0],
                        color: "rgba(255, 255, 255, 0.60)",
                        fontSize: 12
                    }
                },
                yAxis: {
                    name: "数量",
                    type: "value",
                    nameLocation: "end",
                    nameGap: 20,
                    nameTextStyle: {
                        align: "right",
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12
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
                    type: "bar",
                    data: buckets.map(item => item.value),
                    itemStyle: {
                        color: "#40A9FF"
                    }
                }
            }
        }
    },
    data () {
        return {
            series: {},
            frequencies: []
        }
    },
    methods: {
        getSeries () {
            getTimeSeriesList(this.pump.modelId).then(result => {
                this.series = result.data.find(item => item.name === "频率") || {}
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
            getSeriesHistoryValues(this.pump.id, ["频率"], {
                startAt: startDate,
                endAt: endDate
            }).then(result => {
                this.frequencies = result.data["频率"].values
            })
            // let frequencies = []
            // for(let i = 0; i < 150; i += 10) {
            //     frequencies.push({
            //         range: `(${i}, ${i + 10}]`,
            //         value: Math.round(10 + Math.random() * 60)
            //     })
            // }
            // this.frequencies = frequencies
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