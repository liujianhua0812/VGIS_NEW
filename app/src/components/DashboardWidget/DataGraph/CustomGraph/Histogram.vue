<template>
    <div class="full-h">
        <div class="filters p-t-12 p-b-12 p-l-24 p-r-24 flex align-items-center justify-content-between">
            <div class="flex align-items-center">
                <vgis-date-selector v-model="timeRange"></vgis-date-selector>
                <label class="m-l-24 m-r-8" v-if="points[0] && ['Integer', 'Decimal'].includes(points[0].dataType)">分组数量</label>
                <vgis-number-input v-model="bucketNumber" style="width: 150px;" v-if="points[0] && ['Integer', 'Decimal'].includes(points[0].dataType)"></vgis-number-input>
            </div>
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
import {getHierarchySeries, getSeriesHistoryValues} from "@/assets/js/api/hierarchy";

export default {
    name: "Histogram",
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
            if (!this.points[0]) {
                return {}
            }
            let bucket = this.bucketNumber
            if (bucket <= 0) {
                return this.$message({
                    message: "分组数量不得小于1！",
                    type: "error",
                    showClose: true,
                    duration: 3000
                })
            }
            let point = this.points[0]
            let buckets = []
            if (["Decimal", "Integer"].includes(point.dataType)) {
                let data = this.records.map(item => parseFloat(item.value))
                let min = Math.min(...data)
                let max = Math.max(...data)
                let gap = (max - min) / bucket
                if (gap === 0) {
                    return {}
                }

                for(let i = 0; i < bucket; i++) {
                    buckets.push({
                        label: `[${(min + i * gap).toFixed(2)}, ${(min + (i + 1) * gap).toFixed(2)}${i === bucket - 1 ? ')' : ']'}`,
                        count: 0
                    })
                }
                for(let i = 0; i < data.length; i++) {
                    let value = data[i]
                    let bucketIndex = Math.min(Math.floor((value - min) / gap), bucket - 1)
                    buckets[bucketIndex].count++
                }
            }
            else {
                buckets = Object.entries(this.records.reduce((result, item) => {
                    if (!result[item.value]) {
                        result[item.value] = 0
                    }
                    result[item.value]++
                    return result
                }, {})).map(item => ({ label: item[0], count: item[1] }))
                // TODO: Enum、日期/时间、布尔值需要做特殊的处理
            }
            return {
                grid: {
                    top: 50,
                    left: 20,
                    right: 10,
                    bottom: 20
                },
                tooltip: {
                    show: true,
                    trigger: "axis"
                },
                xAxis: {
                    type: "category",
                    data: buckets.map(item => item.label),
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
                    type: "bar",
                    symbolSize: 0,
                    data: buckets.map(item => item.count),
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
            bucketNumber: 5,
            records: []
        }
    },
    methods: {
        refreshData () {
            this.records = []
            let point = this.points[0]
            if (point) {
                let [startDate, endDate] = this.timeRange
                if (!endDate) {
                    endDate = new Date()
                }
                if (!startDate) {
                    startDate = new Date(endDate.getTime())
                    startDate.setMonth(startDate.getMonth() - 1)
                }
                getSeriesHistoryValues(point.instanceId, [point.name], {
                    startAt: startDate,
                    endAt: endDate
                }).then(result => {
                    this.records = result.data[point.name] ? result.data[point.name].values : []
                })
            }
        },
        download () {
            // 检查是否有选中的点位
            if (!this.points || this.points.length === 0) {
                this.$message({
                    message: "请先选择要分析的点位！",
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
                // 修复：使用 points[0] 而不是 point
                const pointName = that.points[0] ? that.points[0].name : 'histogram';
                a.download = `${pointName}_直方图.png`
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