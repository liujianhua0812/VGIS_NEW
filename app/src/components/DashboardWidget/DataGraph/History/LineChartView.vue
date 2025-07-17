<template>
    <vgis-card>
        <div ref="chartContainer" style="width: 100%; height: 400px;"></div>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import {getHierarchy, getNodeDetail, getNodeParents, getSeriesHistoryValues} from "@/assets/js/api/hierarchy";
import {downloadFile} from "@/utils";
import * as echarts from 'echarts';

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
        records: {
            handler() {
                this.updateChart();
            },
            deep: true
        }
    },
    data () {
        return {
            instance: {},
            parents: [],
            records: [],
            chartInstance: null
        }
    },
    methods: {
        getPaths () {
            if (this.point && this.point.instanceId) {
                Promise.all([
                    getNodeDetail(this.point.instanceId),
                    getNodeParents(this.point.instanceId)
                ]).then(result => {
                    this.instance = result[0].data
                    this.parents = result[1].data
                }).catch(error => {
                    console.error('LineChartView getPaths error:', error);
                })
            }
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
        initChart() {
            if (this.$refs.chartContainer && !this.chartInstance) {
                this.chartInstance = echarts.init(this.$refs.chartContainer);
                this.updateChart();
            }
        },
        updateChart() {
            if (!this.chartInstance) {
                this.initChart();
                return;
            }

            let [startDate, endDate] = this.timeRange || []
            if (!endDate) {
                endDate = new Date()
            }
            if (!startDate) {
                startDate = new Date(endDate.getTime())
                startDate.setMonth(startDate.getMonth() - 1)
            }

            const option = {
                grid: {
                    top: 100,
                    left: 50,
                    right: 50,
                    bottom: 20
                },
                title: {
                    text: `${this.point ? this.point.name : ''}变化折线图`,
                    subtext: `${startDate.toLocaleString()} 至 ${endDate.toLocaleString()}\n设备设施：${this.parents && this.parents.length > 0 ? this.parents.reverse().map(item => item.name).concat(this.instance.name || '').join("/") : ''}`,
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
                    formatter: (params) => {
                        if (params && params[0]) {
                            const param = params[0];
                            const unit = this.point && this.point.unit ? this.point.unit.name : "";
                            return `
                                <div><b>时间：</b>${new Date(param.data[0]).toLocaleString()}</div>
                                <div><b>${this.point ? this.point.name : ''}：</b>${this.formatValue(this.point, param.data[1])} ${unit}</div>
                            `;
                        }
                        return '';
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
                    name: this.point && this.point.unit ? this.point.unit.name : "数值",
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
                    symbolSize: 4,
                    data: this.records.map(record => [record.time, record.value]),
                    itemStyle: {
                        color: "#40A9FF",
                        width: 3
                    },
                    lineStyle: {
                        color: "#40A9FF",
                        width: 2
                    }
                }
            };

            this.chartInstance.setOption(option, true);
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
            if (this.point && this.point.id) {
                console.log('LineChartView refreshData called for point:', this.point.name, 'timeRange:', [startDate, endDate]);
                getSeriesHistoryValues(this.point.instanceId, [this.point.name], {
                    startAt: startDate,
                    endAt: endDate
                }).then(result => {
                    console.log('LineChartView data received:', result);
                    this.records = (result.data[this.point.name] ? result.data[this.point.name].values : []).map(item => {
                        item.time = new Date(item.time)
                        item.value = parseFloat(item.value)
                        return item
                    })
                    console.log('LineChartView processed records:', this.records);
                }).catch(error => {
                    console.error('LineChartView refreshData error:', error);
                    this.records = [];
                })
            }
            else {
                console.log('LineChartView refreshData: no point or point.id');
                this.records = []
            }
        },
        download () {
            if (this.chartInstance) {
                let img = new Image();
                img.src = this.chartInstance.getDataURL({
                    pixelRatio: 2,
                    backgroundColor: '#002766'
                });
                img.onload = () => {
                    let canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    let ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);
                    let dataURL = canvas.toDataURL("image/png");
                    let a = document.createElement("a");
                    let event = new MouseEvent("click");
                    a.download = `${this.point ? this.point.name : 'chart'}.png`
                    a.href = dataURL;
                    a.dispatchEvent(event);
                    a.remove();
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initChart();
            this.getPaths();
            this.refreshData();
        });
    },
    beforeDestroy() {
        if (this.chartInstance) {
            this.chartInstance.dispose();
        }
    }
}
</script>

<style scoped>

</style>