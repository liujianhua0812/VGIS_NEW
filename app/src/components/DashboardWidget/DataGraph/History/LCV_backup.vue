<template>
    <vgis-card>
        <v-chart ref="chart" :option="chartOption" autoresize></v-chart>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import {getHierarchy, getNodeDetail, getNodeParents, getSeriesHistoryValues} from "@/assets/js/api/hierarchy";
import {downloadFile} from "@/utils";

export default {
    name: "LineChartView",
    props: {
        timeRange: Array,
        point: Object
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
        },
        point: {
            handler (newValue) {
                this.getPaths()
                this.refreshData()
            },
            deep: true
        },
    },
    computed: {
        chartOption () {
            let [startDate, endDate] = this.timeRange
            if (!endDate) {
                endDate = new Date()
            }
            if (!startDate) {
                startDate = new Date(endDate.getTime())
                startDate.setMonth(startDate.getMonth() - 1)
            }
            let that = this
            return {
                grid: {
                    top: 100,
                    left: 50,
                    right: 50,
                    bottom: 20
                },
                title: {
                    text: `${this.point.name}变化折线图`,
                    subtext: `${startDate.format("yyyy-MM-dd hh:mm:ss")} 至 ${endDate.format("yyyy-MM-dd hh:mm:ss")}\n设备设施：${this.parents.reverse().map(item => item.name).concat(this.instance.name).join("/")}`,
                    left: "center",
                    textStyle: {
                        color: "#FFFFFF"
                    },
                    subtextStyle: {
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: 14,
                        lineHeight: 20
                    }
                },
                tooltip: {
                    show: true,
                    trigger: "axis",
                    formatter ([params]) {
                        let unit = that.point.unit ? that.point.unit.name : ""
                        return `
                            <div><b>时间：</b>${new Date(params.data[0]).format("yyyy-MM-dd hh:mm:ss")}</div>
                            <div><b>${that.point.name}：</b>${that.formatValue(that.point, params.data[1])} ${unit}</div>
                        `
                    }
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
                    }
                },
                yAxis: {
                    name: "温度℃",
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
                    type: "line",
                    symbolSize: 0,
                    data: this.records.map(record => [record.time, record.value]),
                    itemStyle: {
                        color: "#40A9FF",
                        width: 3
                    }
                }
            }
        }
    },
    data () {
        return {
            instance: {},
            parents: [],
            records: []
        }
    },
    methods: {
        getPaths () {
            Promise.all([
                getNodeDetail(this.point.instanceId),
                getNodeParents(this.point.instanceId)
            ]).then(result => {
                this.instance = result[0].data
                this.parents = result[1].data
            })
        },
        formatValue(series, value) {
            if (series.dataType === 'Decimal') {
                value = parseFloat(value)
                if (series.precision || series.precision === 0) {
                    value = parseFloat(value.toFixed(series.precision))
                }
            }
            return value
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
            if (this.point) {
                getSeriesHistoryValues(this.point.instanceId, [this.point.name], {
                    startAt: startDate,
                    endAt: endDate
                }).then(result => {
                    this.records = (result.data[this.point.name] ? result.data[this.point.name].values : []).map(item => {
                        item.time = new Date(item.time)
                        item.value = parseFloat(item.value)
                        return item
                    })
                })
            }
            else {
                this.records = []
            }
        },
        download () {
            let that = this
            let img = new Image();
            img.src = this.$refs.chart.getDataURL({
                pixelRatio: 2,
                backgroundColor: '#002766'
            });
            img.onload = function () {
                let canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                let ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                let dataURL = canvas.toDataURL("image/png");
                let a = document.createElement("a");
                let event = new MouseEvent("click");
                a.download = `${that.point.name}.png`
                a.href = dataURL;
                a.dispatchEvent(event);
                a.remove();
            }
        }
    },
    created() {
        this.getPaths()
        this.refreshData()
    }
}
</script>

<style scoped>

</style>