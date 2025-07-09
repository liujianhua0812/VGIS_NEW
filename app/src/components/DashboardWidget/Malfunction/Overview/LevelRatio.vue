<template>
    <vgis-card title="各等级故障占比">
        <v-chart :option="chartOption" autoresize></v-chart>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import {getTaskStatByLevel} from "@/assets/js/api/malfunction-tasks";

export default {
    name: "LevelRatio",
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
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'horizontal',
                    left: "center",
                    bottom: 20,
                    icon: "circle",
                    itemWidth: 12,
                    itemGap: 12,
                    itemStyle: {
                        borderWidth: 0,
                    },
                    textStyle: {
                        color: "#8C8C8C",
                        fontSize: 12,
                    }
                },
                color: [
                    "#FADB14",
                    "#FA8C16",
                    "#F5222D"
                ],
                series: [
                    {
                        type: 'pie',
                        center: ["50%", "40%"],
                        radius: '80%',
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
        refreshData () {
            let [startDate, endDate] = this.timeRange
            if (!endDate) {
                endDate = new Date()
            }
            if (!startDate) {
                startDate = new Date(endDate.getTime())
                startDate.setMonth(startDate.getMonth() - 1)
            }

            getTaskStatByLevel({
                createdAt: this.timeRange
            }).then(result => {
                this.records = result.data.map(item => ({
                    value: item.count,
                    name: item.name,
                    itemStyle: {
                        color: item.color
                    }
                }))
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