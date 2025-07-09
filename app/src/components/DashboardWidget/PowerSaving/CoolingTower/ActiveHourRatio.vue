<template>
    <vgis-card title="冷却塔开机小时数占比">
        <v-chart :option="chartOption" autoresize></v-chart>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import {getHierarchy, getMultipleSeriesHistoryValues, getNodesByModel} from "@/assets/js/api/hierarchy";
import {getModelInstanceList} from "@/assets/js/api/model-instance";
import {toFixedValue} from "@/utils/Statistics";

export default {
    name: "ActiveHourRatio",
    props: {
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
                color: [
                    "#40A9FF",
                    "#13C2C2",
                    "#52C41A",
                    "#FAAD14",
                    "#FA8C16"
                ],
                tooltip: {
                    trigger: 'item',
                    formatter (params) {
                        return `${toFixedValue(params.value, 2)}h (${params.percent}%)`
                    }
                },
                legend: {
                    orient: 'horizontal',
                    left: "center",
                    bottom: 20,
                    icon: "circle",
                    itemWidth: 12,
                    itemGap: 24,
                    itemStyle: {
                        borderWidth: 0,
                    },
                    textStyle: {
                        color: "#8C8C8C",
                        fontSize: 12,
                    }
                },
                series: [
                    {
                        type: 'pie',
                        center: ["50%", "45%"],
                        radius: '65%',
                        data: this.records,
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
            records: []
        }
    },
    methods: {
        calculateActiveHours (records) {
            let result = 0
            for(let i = 1; i < records.length; i++) {
                let record = records[i], last = records[i - 1]
                if (record.value === "1" && last.value === "1") {
                    result += (new Date(record.time) - new Date(last.time))
                }
                else if (record.value === "0" && last.value === "1") {
                    result += (new Date(record.time) - new Date(last.time))
                }
            }
            result = result / (1000 * 60 * 60)
            return result
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
            getNodesByModel("CoolingTower").then(result => {
                let towers = result.data
                getMultipleSeriesHistoryValues(towers.map(item => item.instanceId), ["运行状态"], {
                    startAt: startDate,
                    endAt: endDate
                }).then(result => {
                    this.records = towers.map(tower => ({
                        name: tower.name,
                        value: this.calculateActiveHours(result.data[tower.instanceId] && result.data[tower.instanceId]["运行状态"] ? result.data[tower.instanceId]["运行状态"].values : [])
                    }))
                })
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