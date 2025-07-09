<template>
    <div class="full-h">
        <div class="filters p-t-12 p-b-12 p-l-24 p-r-24 flex align-items-center justify-content-between">
            <vgis-date-selector v-model="timeRange"></vgis-date-selector>
            <div class="flex align-items-center">
                <el-button size="small" class="power-primary" @click="download">下载</el-button>
            </div>
        </div>
        <vgis-card style="height: calc(100% - 88px);">
            <v-chart ref="chart" :option="chartOption" autoresize></v-chart>
        </vgis-card>
    </div>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import VgisDateSelector from "@/components/DashboardWidget/Shared/vgis-date-selector.vue";
import VgisNumberInput from "@/components/DashboardWidget/Shared/vgis-number-input.vue";
import {getSeriesHistoryValues} from "@/assets/js/api/hierarchy";

export default {
    name: "MultiLineChart",
    components: {
        VgisNumberInput,
        VgisDateSelector,
        VgisCard
    },
    props: {
        points: Array
    },
    watch: {
        timeRange: {
            handler (newValue) {
                this.refreshData()
            },
            deep: true
        },
        points: {
            handler (newValue) {
                this.refreshData()
            },
            deep: true
        }
    },
    computed: {
        chartOption () {
            let time = this.dailyData.reduce((result, item) => result.concat(item.map(record => new Date(record.time).getTime())), [])
            let maxTime = new Date(Math.max(...time))
            let minTime = new Date(Math.min(...time))
            if (!this.chartHeight) {
                return {}
            }
            let that = this
            let baseTop = 20, baseBottom = 20, gap = 50
            let height = (this.chartHeight - baseTop - baseBottom - gap * (this.points.length - 1)) / this.points.length
            let titleGap = 45, titleHeight = 16
            return {
                title: this.points.map((item, index) => ({
                    text: item.name,
                    left: "center",
                    textStyle: {
                        color: "#FFFFFF",
                        fontWeight: 400,
                        fontSize: titleHeight,
                        lineHeight: titleHeight
                    },
                    top: `${baseTop + height * index + (index > 0 ? gap * index : 0)}px`,
                })),
                grid: this.points.map((item, index) => ({
                    top: `${baseTop + height * index + (index > 0 ? gap * index : 0) + titleGap + titleHeight}px`,
                    height: `${height - titleGap - titleHeight}px`,
                    left: 30,
                    right: 10
                })),
                tooltip: {
                    show: true,
                    trigger: "axis",
                    formatter ([params]) {
                        let point = params.data[2]
                        let unit = point.unit ? point.unit.name : ""
                        return `
                            <div><b>时间：</b>${new Date(params.data[0]).format("yyyy-MM-dd hh:mm:ss")}</div>
                            <div><b>${point.name}：</b>${that.formatValue(point, params.data[1])} ${unit}</div>
                        `
                    }
                },
                xAxis: this.points.map((item, index) => ({
                    name: item.name,
                    gridIndex: index,
                    type: "time",
                    min: minTime,
                    max: maxTime,
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
                })),
                yAxis: this.points.map((item, index) => ({
                    name: item.name,
                    gridIndex: index,
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
                        align: "left",
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12
                    }
                })),
                series: this.points.map((point, index) => ({
                    name: point.name,
                    xAxisIndex: index,
                    yAxisIndex: index,
                    type: "line",
                    symbolSize: 0,
                    data: this.dailyData[index] ? this.dailyData[index].map(item => [new Date(item.time), parseFloat(item.value), point]) : [],
                    itemStyle: {
                        color: "#40A9FF"
                    }
                }))
            }
        }
    },
    data () {
        let endDate = new Date(), startDate = new Date(endDate.getTime())
        startDate.setDate(endDate.getDate() - 30)
        return {
            timeRange: [startDate, endDate],
            dailyData: [],
            chartHeight: 0
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
            Promise.all(this.points.map(item => getSeriesHistoryValues(item.instanceId, [ item.name ], {
                startAt: startDate,
                endAt: endDate
            }))).then(result => {
                this.dailyData = this.points.map((item, index) => result[index].data[item.name] ? result[index].data[item.name].values : [])
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
                a.download = `同时段多点位对比趋势图.png`
                a.href = dataURL;
                a.dispatchEvent(event);
                a.remove();
            }
        },
        updateChartSize () {
            this.chartHeight = this.$refs.chart.$el.clientHeight
        },
        addEventListeners () {
            window.addEventListener("resize", this.updateChartSize)
        },
        removeEventListeners () {
            window.removeEventListener("resize", this.updateChartSize)
        }
    },
    mounted () {
        this.updateChartSize()
    },
    created() {
        this.refreshData()
        this.addEventListeners()
    },
    beforeDestroy() {
        this.removeEventListeners()
    }
}
</script>

<style scoped>
.filters {
    background: #002766;
    border-radius: 16px;

    >i {
        color: #FFFFFF;
        font-family: "HarmonyOS Sans SC";
        font-size: 24px;
        font-style: normal;
        font-weight: 400;
        margin-right: 8px;
    }

    >label {
        color: #FFFFFF;
        font-family: "HarmonyOS Sans SC";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        margin-right: 8px;
        margin-left: 32px;
    }
}
</style>