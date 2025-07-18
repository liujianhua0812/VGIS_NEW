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
    name: "RelationScatter",
    props: {
        points: Array
    },
    components: {VgisNumberInput, VgisDateSelector, VgisCard},
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
            // TODO: 目前关系图使用刚性时间匹配逻辑来判断，需要确认一下如何柔化
            if (this.seriesData.length !== 2) {
                return {}
            }
            let dateMap = {}
            let [ series1, series2 ] = this.seriesData
            for(let i = 0; i < series1.length; i++) {
                let record = series1[i]
                dateMap[new Date(record.time).format('yyyy-MM-dd hh:mm:ss')] = {
                    series1: parseFloat(record.value)
                }
            }
            for(let i = 0; i < series2.length; i++) {
                let record = series2[i]
                if (!dateMap[new Date(record.time).format('yyyy-MM-dd hh:mm:ss')]) {
                    dateMap[new Date(record.time).format('yyyy-MM-dd hh:mm:ss')] = {
                        series2: parseFloat(record.value)
                    }
                }
                else {
                    dateMap[new Date(record.time).format('yyyy-MM-dd hh:mm:ss')].series2 = parseFloat(record.value)
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
                    left: 30,
                    right: 10,
                    top: 60,
                    bottom: 35
                },
                tooltip: {
                    show: true
                },
                xAxis: {
                    name: `${this.points[0].name} ${this.points[0].unit ? this.points[0].unit.name : ""}`,
                    type: "value",
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
                    },
                    nameLocation: "center",
                    nameGap: 20,
                    nameTextStyle: {
                        align: "center",
                        color: "rgba(255, 255, 255, 0.60)",
                        fontSize: 12
                    }
                },
                yAxis: {
                    name: `${this.points[1].name} ${this.points[1].unit ? this.points[1].unit.name : ""}`,
                    type: "value",
                    axisLine: {
                        show: false,
                        onZero: false,
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
                    },
                    nameGap: 20,
                    nameTextStyle: {
                        align: "left",
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12
                    }
                },
                series: {
                    type: "scatter",
                    data,
                    itemStyle: {
                        color: "#40A9FF"
                    }
                }
            }
        }
    },
    data () {
        let endDate = new Date(), startDate = new Date(endDate.getTime())
        startDate.setDate(endDate.getDate() - 30)
        return {
            timeRange: [startDate, endDate],
            seriesData: [],
        }
    },
    methods: {
        download () {
            // 检查是否有选中的点位
            if (!this.points || this.points.length < 2) {
                this.$message({
                    message: "请选择两个点位进行关系分析！",
                    type: "warning",
                    showClose: true,
                    duration: 3000
                });
                return;
            }
            
            // 检查图表是否已加载
            if (!this.$refs.chart) {
                this.$message({
                    message: "图表尚未加载完成，请稍后再试！",
                    type: "warning",
                    showClose: true,
                    duration: 3000
                });
                return;
            }
            
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
                a.download = `${that.points.map(item => item.name).join(" - ")}关系图.png`
                a.href = dataURL;
                a.dispatchEvent(event);
                a.remove();
            }
            
            // 添加错误处理
            img.onerror = function() {
                that.$message({
                    message: "图片生成失败，请稍后再试！",
                    type: "error",
                    showClose: true,
                    duration: 3000
                });
            }
        },
        refreshData () {
            if (this.points.length === 2) {
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
                    this.seriesData = this.points.map((item, index) => result[index].data[item.name] ? result[index].data[item.name].values : [])
                })
            }
            else {
                this.seriesData = []
            }
        }
    },
    created() {
        this.refreshData()
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