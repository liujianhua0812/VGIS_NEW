<template>
    <vgis-card title="时段对比">
        <div class="flex align-items-center" style="height: calc(100% - 24px)">
            <div style="width: 300px; height: 100%;" class="selector-group flex flex-column">
                <el-row :gutter="24">
                    <el-col :span="12">
                        <label class="m-b-4">指标</label>
                        <el-select class="custom-selector" size="mini" v-model="filter.model" @change="getInstances">
                            <el-option v-for="item in resources" :key="item.name" :label="item.label" :value="item.name"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="12">
                        <label class="m-b-4">末端</label>
                        <el-select class="custom-selector" size="mini" v-model="filter.instance" @change="getRecords">
                            <el-option v-for="item in instances" :key="item.id" :label="item.label" :value="item.id"></el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <div class="m-b-11 m-t-14">
                    <label>时段</label>
                </div>
                <div style="flex-grow: 1;" class="flex flex-column justify-content-between">
                    <vgis-simple-date-selector style="width: 100%;" v-model="periods[0]" @input="getRecords"></vgis-simple-date-selector>
                    <vgis-simple-date-selector style="width: 100%;" v-model="periods[1]" @input="getRecords"></vgis-simple-date-selector>
                    <vgis-simple-date-selector style="width: 100%;" v-model="periods[2]" @input="getRecords"></vgis-simple-date-selector>
                    <vgis-simple-date-selector style="width: 100%;" v-model="periods[3]" @input="getRecords"></vgis-simple-date-selector>
                </div>
            </div>
            <v-chart style="flex-grow: 1;" :option="chartOption" autoresize></v-chart>
        </div>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import VgisIndexSelector from "@/components/DashboardWidget/Shared/vgis-index-selector.vue";
import VgisSimpleDateSelector from "@/components/DashboardWidget/Shared/vgis-simple-date-selector.vue";
import {getMultipleAttributeValues, getNodesByModel, getSeriesHistoryValues} from "@/assets/js/api/hierarchy";
import {getTimeSeriesList} from "@/assets/js/api/model-series";
import {toFixedValue} from "@/utils/Statistics";

export default {
    name: "TimeRangeComparison",
    components: {
        VgisSimpleDateSelector,
        VgisIndexSelector,
        VgisCard
    },
    computed: {
        chartTitle () {
            let model = this.resources.find(item => item.name === this.filter.model)
            let instance = this.instances.find(item => item.id === this.filter.instance)
            if (!model || !instance || !this.series) {
                return "请选择指标和末端"
            }
            else if (!this.periods.find(item => item)) {
                return "请至少设置一个日期范围"
            }
            return `${instance ? instance.label : ""} ${this.series ? this.series.name : ""}`
        },
        chartOption () {
            let periods = this.periods.filter(item => item)
            return {
                title: {
                    text: this.chartTitle,
                    textStyle: {
                        color: "#FFFFFF",
                        fontSize: 14,
                        fontWeight: 400,
                    },
                    left: 60,
                    top: 5,
                },
                grid: {
                    top: 40,
                    left: 60,
                    right: 30,
                    bottom: 55
                },
                xAxis: {
                    type: "category",
                    data: periods.map(item => `${item[0].format("yyyy.MM.dd")}\n至\n${item[1].format("yyyy.MM.dd")}`),
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        color: "rgba(255, 255, 255, 0.60)",
                        fontSize: 12,
                        lineHeight: 16
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#FFFFFF"
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: "rgba(255, 255, 255, 0.25)"
                        }
                    }
                },
                yAxis: {
                    type: "value",
                    axisLabel: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: "rgba(255, 255, 255, 0.25)"
                        }
                    }
                },
                series: {
                    type: "bar",
                    data: this.records.map(item => toFixedValue(item, this.series ? this.series.precision : 2)),
                    label: {
                        show: true,
                        position: "top",
                        textStyle: {
                            color: "#FFFFFF"
                        }
                    },
                    itemStyle: {
                        color: "#2174FF"
                    }
                }
            }
        }
    },
    data () {
        return {
            filter: {
                model: "",
                instance: ""
            },
            instances: [],
            resources: [{
                name: "ElectricityMeter",
                label: "电",
                series: "电量"
            }, {
                name: "WaterMeter",
                label: "水",
                series: "用水量"
            }, {
                name: "SteamMeter",
                label: "蒸汽",
                series: "用汽量"
            }, {
                name: "GasMeter",
                label: "天然气",
                series: "用气量"
            }],
            series: "",
            periods: ["", "", "", ""],
            records: []
        }
    },
    methods: {
        getInstances () {
            let model = this.resources.find(item => item.name === this.filter.model)
            this.filter.instance = ""
            this.records = []
            getTimeSeriesList(this.filter.model).then(result => {
                this.series = result.data.find(item => item.name === model.series)
            })
            getNodesByModel(this.filter.model).then(result => {
                let meters = result.data
                getMultipleAttributeValues(meters.map(item => item.instanceId), ["监测回路"]).then(result => {
                    this.instances = meters.map(item => Object.assign({}, item, {
                        label: result.data[item.instanceId] && result.data[item.instanceId]["监测回路"] && result.data[item.instanceId]["监测回路"].value ? result.data[item.instanceId]["监测回路"].value : `${item.name}/${item.instanceId}`
                    }))
                })
            })
        },
        getRecords () {
            let model = this.resources.find(item => item.name === this.filter.model)
            let instance = this.instances.find(item => item.id === this.filter.instance)
            this.records = []
            if (model && instance && this.periods.find(item => item)) {
                Promise.all(this.periods.filter(item => item).map(timeRange => getSeriesHistoryValues(instance.id, [model.series], {
                    startAt: timeRange[0],
                    endAt: timeRange[1]
                }))).then(results => {
                    this.records = results.map(item => {
                        let records = item.data[model.series] ? item.data[model.series].values : []
                        if (records.length <= 1) {
                            return 0
                        }
                        else {
                            return records[records.length - 1].value - records[0].value
                        }
                    })
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>

.custom-selector {

    input {
        border-radius: 2px;
        border: 1px solid #0050B3;
        background: #003A8C;
        color: var(--Neutral-6, #BFBFBF);
        font-family: "HarmonyOS Sans SC";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
    }
}

    .selector-group {

        label {
            color: rgba(255, 255, 255, 0.60);
            font-family: "HarmonyOS Sans SC";
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: normal
        }
    }
</style>