<template>
    <div style="position: relative;" class="full">
        <babylon-3d v-if="loaded" class="full"></babylon-3d>
        <vgis-row style="position: absolute; left: 0; top: 0; z-index: 999; margin: 24px; height: calc(100% - 91px); width: 369px;">
            <vgis-col :span="72" class="full-h">
                <vgis-flex-column class="full-h">
                    <vgis-cell style="height: 145px">
                        <vgis-card title="用电量同步对比" class="full" padding="16px 24px" style="height: calc(100% - 32px); width: calc(100% - 48px);">
                            <div class="flex align-items-center justify-content-between">
                                <div v-for="item in summary" :key="item.name">
                                    <div class="sum-label">{{item.name}}</div>
                                    <div class="sum-value">
                                        {{item.value}}
                                        <small class="sum-unit">{{item.unit}}</small>
                                    </div>
                                </div>
                            </div>
                        </vgis-card>
                    </vgis-cell>
                    <vgis-cell :grow="1" class="m-t-25">
                        <vgis-card title="楼层用电量占比" class="full" padding="16px 24px" style="height: calc(100% - 32px); width: calc(100% - 48px);">
                            <v-chart style="height: calc(100% - 52px);" :option="floorRatioOption" autoresize></v-chart>
                        </vgis-card>
                    </vgis-cell>
                    <vgis-cell :grow="1" class="m-t-25">
                        <vgis-card title="七日用电量对比" class="full" padding="16px 24px" style="height: calc(100% - 32px); width: calc(100% - 48px);">
                            <v-chart style="height: calc(100% - 52px);" :option="weeklyComparisonOption" autoresize></v-chart>
                        </vgis-card>
                    </vgis-cell>
                </vgis-flex-column>
            </vgis-col>
        </vgis-row>
        <div style="position: absolute; right: 24px; top: 24px; z-index: 999; height: 145px; width: 379px;">
            <vgis-card title="综合环境态势感知" class="full" padding="16px 24px" style="height: 113px; width: 333px;">
                <div class="flex align-items-center justify-content-between">
                    <div v-for="item in env_summary" :key="item.name">
                        <div class="sum-label">{{item.name}}</div>
                        <div class="sum-value">
                            {{item.value}}
                            <small class="sum-unit">{{item.unit}}</small>
                        </div>
                    </div>
                </div>
            </vgis-card>
        </div>
        <div style="position: absolute; right: 24px; bottom: 80px; z-index: 999; height: 400px; width: 379px;">
            <vgis-card title="综合环境态势感知" class="full" padding="16px 24px" style="height: 378px; width: 333px;">
                <div class="equip-sum">
                    <div class="group-label">风机盘管</div>
                    <el-row :gutter="20">
                        <el-col :span="12" v-for="item in tube_summary" :key="item.name">
                            <div class="sum-label">{{item.name}}</div>
                            <div class="sum-value">
                                {{item.value}}
                            </div>
                        </el-col>
                    </el-row>
                    <div class="ratio-label">开机占比</div>
                    <el-progress :percentage="getPercentage(tube_summary)" define-back-color="rgba(255, 255, 255, 0.20)" color="#52AAE5" :stroke-width="15" :format="formatPercentage" text-color="#FFFFFF"></el-progress>
                </div>
                <div class="equip-sum m-t-35">
                    <div class="group-label">新风机</div>
                    <el-row :gutter="20">
                        <el-col :span="12" v-for="item in fan_summary" :key="item.name">
                            <div class="sum-label">{{item.name}}</div>
                            <div class="sum-value">
                                {{item.value}}
                            </div>
                        </el-col>
                    </el-row>
                    <div class="ratio-label">开机占比</div>
                    <el-progress :percentage="getPercentage(fan_summary)" define-back-color="rgba(255, 255, 255, 0.20)" color="#59C357" :stroke-width="15" :format="formatPercentage" text-color="#FFFFFF"></el-progress>
                </div>
            </vgis-card>
        </div>
    </div>
</template>

<script>

    import VgisCard from "@/components/DashboardWidget/Shared/vgis-card.vue";
    import Babylon3D from "@/components/Maps/Babylon3D.vue";
    import VgisCol from "@/components/Standard/vgis-col.vue";
    import VgisCell from "@/components/Standard/vgis-cell.vue";
    import VgisRow from "@/components/Standard/vgis-row.vue";
    import VgisFlexColumn from "@/components/Standard/vgis-flex-column.vue";
    import { getHierarchy } from "@/assets/js/api/data";
    import {
        getMultipleSeriesHistoryValues,
        getMultipleSeriesLatestValues,
        getSeriesLatestValues
    } from "@/assets/js/api/hierarchy";

    export default {
        name: "OverviewDashboard",
        components: {
            VgisFlexColumn, VgisRow, VgisCell, VgisCol,
            'babylon-3d': Babylon3D,
            'vgis-card': VgisCard
        },
        computed: {
            floorRatioOption () {
                let palette = ["#3CB1FB", "#419663", "#947BCB", "#D3CA74", "#ED975F"]
                let data = Object.entries(this.floorData).map((item, index) => ({
                    name: item[0],
                    value: item[1],
                    itemStyle: {
                        color: palette[index]
                    }
                }))
                return {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'horizontal',
                        // right: "center",
                        // top: "bottom",
                        bottom: "5%",
                        left: "center",
                        right: 0,
                        textStyle: {
                            fontSize: 14,
                            fontWeight: 400,
                            color: "rgba(255, 255, 255, 0.6)"
                        }
                    },
                    grid: {
                        left: 0,
                    },
                    series: [
                        {
                            type: 'pie',
                            radius: ['50%', '70%'],
                            center: ["50%", "40%"],
                            avoidLabelOverlap: false,
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: 40,
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data
                        }
                    ]
                }
            },
            weeklyComparisonOption () {
                return {
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        top: 40,
                        left: 40,
                        right: 0,
                        bottom: 50
                    },
                    xAxis: {
                        type: "category",
                        data: this.weekData.map(item => item.date),
                        axisLabel: {
                            fontSize: 14,
                            fontWeight: 400,
                            color: "rgba(255, 255, 255, 0.4)",
                            rotate: 45,
                            formatter (value) {
                                return new Date(value).format("MM-dd")
                            }
                        }
                    },
                    yAxis: {
                        type: "value",
                        name: "kW.h",
                        nameGap: 20,
                        nameTextStyle: {
                            align: "right",
                            fontSize: 14,
                            fontWeight: 400,
                            color: "rgba(255, 255, 255, 0.6)"
                        },
                        axisLabel: {
                            fontSize: 14,
                            fontWeight: 400,
                            color: "rgba(255, 255, 255, 0.6)"
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: "rgba(255, 255, 255, 0.25)"
                            }
                        }
                    },
                    series: [
                        {
                            type: "bar",
                            data: this.weekData.map(item => item.value),
                            itemStyle: {
                                color: "#3CB1FB"
                            },
                            barWidth: 16,
                        },
                    ],
                }
            },
        },
        data () {
            return {
                loaded: false,
                floors: ["B1", "1F", "2F", "3F"],
                summary: [{
                    name: "今日今时",
                    value: 789,
                    unit: "kw/h",
                }, {
                    name: "昨日今时",
                    value: 789,
                    unit: "kw/h",
                }, {
                    name: "同比",
                    value: 40,
                    unit: "%",
                }],
                env_summary: [{
                    name: "温度",
                    value: 25,
                    unit: "℃",
                }, {
                    name: "湿度",
                    value: 70,
                    unit: "%",
                }, {
                    name: "CO₂浓度",
                    value: 300,
                    unit: "ppm",
                }],
                tube_summary: [{
                    name: "开机数",
                    value: 25,
                }, {
                    name: "总数",
                    value: 70,
                }],
                fan_summary: [{
                    name: "开机数",
                    value: 25,
                }, {
                    name: "总数",
                    value: 70,
                }],
                floorData: [],
                weekData: [],
                hierarchy: [],
                flattened: {}
            }
        },
        methods: {
            formatPercentage (value) {
                return `${parseFloat(value.toFixed(0))}%`
            },
            getPercentage (data) {
                if ((data[1].value || 0) === 0) {
                    return 0
                }
                else {
                    return (data[0].value || 0) / data[1].value * 100
                }
            },
            flattenData (tree, parent = null) {
                let result = {}
                for(let i = 0; i < tree.length; i++) {
                    let node = tree[i]
                    if (node.poi) {
                        result[node.tag] = node
                    }
                    if (node.children && node.children.length > 0) {
                        Object.assign(result, this.flattenData(node.children, node.poi ? node : parent))
                    }
                }
                return result
            },
            findMeterForFloor(tree) {
                let result = {}
                for(let i = 0; i < tree.length; i++) {
                    let node = tree[i]
                    if (node.poi && node.type === "电表") {
                        result[node.tag] = node
                    }
                    if (node.children && node.children.length > 0) {
                        Object.assign(result, this.findMeterForFloor(node.children))
                    }
                }
                return result
            },
            getHierarchy () {
                getHierarchy().then(result => {
                    this.hierarchy = result.data
                    this.flattened = this.flattenData(result.data)
                    this.getEnvironmentData()
                    this.getAirSystemData()
                    this.getPowerData()
                })
            },
            getAirSystemData () {
                let coils = this.getInstanceByType("风机盘管")
                let blowers = this.getInstanceByType("送风机")
                let exhausters = this.getInstanceByType("排风机")
                let ventilators = this.getInstanceByType("新风机")
                let airConditioners = this.getInstanceByType("空调机")
                this.tube_summary[1].value = coils.length
                this.fan_summary[1].value = blowers.length + exhausters.length + ventilators.length + airConditioners.length
                Promise.all([
                    getMultipleSeriesLatestValues(coils.map(item => item.tag), ["运行状态"]),
                    getMultipleSeriesLatestValues(blowers.map(item => item.tag), ["运行状态"]),
                    getMultipleSeriesLatestValues(exhausters.map(item => item.tag), ["运行状态"]),
                    getMultipleSeriesLatestValues(ventilators.map(item => item.tag), ["运行状态"]),
                    getMultipleSeriesLatestValues(airConditioners.map(item => item.tag), ["运行状态"]),
                ]).then(results => {
                    this.tube_summary[0].value = Object.values(results[0].data).filter(item => item[0] && item[0].value === "运行").length
                    this.fan_summary[0].value = 0
                    for(let i = 1;i < results.length; i++) {
                        this.fan_summary[0].value += Object.values(results[i].data).filter(item => item[0] && item[0].value === "运行").length
                    }
                })
            },
            getPowerData () {
                let electricMeters = this.getInstanceByType("电表")
                let floors = this.getInstanceByType("楼层")
                let floorMap = {}, indexMap = electricMeters.reduce((result, item, index) => {
                    result[item.tag] = index
                    return result
                }, {})
                let meterMap = {}
                for(let i = 0; i < floors.length; i++) {
                    let floor = floors[i]
                    floorMap[floor.tag] = Object.keys(this.findMeterForFloor(floors[i].children)).reduce((result, item) => {
                        result[item] = indexMap[item]
                        return result
                    }, {})
                    for(let meter in floorMap[floor.tag]) {
                        if (!meterMap[meter]) {
                            meterMap[meter] = {}
                        }
                        meterMap[meter][floor.tag] = floor.tag
                    }
                }
                // 两天对比
                let now = new Date(), yesterday = new Date()
                yesterday.setDate(yesterday.getDate() - 1)
                Promise.all([
                    getMultipleSeriesLatestValues(electricMeters.map(item => item.tag), ["kWh import"], null, null, now),
                    getMultipleSeriesLatestValues(electricMeters.map(item => item.tag), ["kWh import"], null, null, yesterday)
                ]).then(results => {
                    for(let i = 0; i < results.length; i++) {
                        let result = results[i]
                        this.summary[i].value = Object.values(result.data).reduce((sum, item) => sum + parseFloat(item[0].value), 0)
                        this.summary[i].value = isNaN(this.summary[i].value) ? 0 : parseFloat(this.summary[i].value.toFixed(0))
                    }
                    let val1 = this.summary[0].value, val2 = this.summary[1].value
                    this.summary[2].value = (val1 === val2 || !val2) ? "——" : parseFloat(((val1 - val2) / val2 * 100).toFixed(1))

                    let floorData = {}
                    for(let floor in floorMap) {
                        floorData[floor] = 0
                    }
                    for(let meter in results[0].data) {
                        for(let floor in meterMap[meter]) {
                            try {
                                floorData[floor] += parseFloat(results[0].data[meter][0].value)
                            }
                            catch (err) {}
                        }
                    }
                    this.floorData = floorData
                })
                let today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                let lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 8)
                getMultipleSeriesHistoryValues(electricMeters.map(item => item.tag), ["kWh import"], {
                    aggregation: "day",
                    method: "latest",
                    startAt: lastWeek,
                    endAt: today
                }).then(result => {
                    let dateData = {}
                    for(let meter in result.data) {
                        let records = result.data[meter]["kWh import"].values
                        for (let i = 0; i < records.length; i++) {
                            let record = records[i]
                            let date = new Date(record.time).format("yyyy-MM-dd")
                            if (!dateData[date]) {
                                dateData[date] = 0
                            }
                            if (record.value) {
                                let value = parseFloat(record.value)
                                if (!isNaN(value)) {
                                    dateData[date] += value
                                }
                            }
                        }
                    }
                    let weekData = []
                    for(let i = new Date(lastWeek.getTime()); i < yesterday; i.setDate(i.getDate() + 1)) {
                        let next = new Date(i.getTime())
                        next.setDate(next.getDate() + 1)
                        weekData.push({
                            date: next.format("yyyy-MM-dd"),
                            value: dateData[next.format('yyyy-MM-dd')] - dateData[i.format('yyyy-MM-dd')],
                        })
                    }
                    this.weekData = weekData
                })
            },
            getEnvironmentData () {
                let thermometers = this.getInstanceByType("温度传感器")
                let hydrometers = this.getInstanceByType("湿度传感器")
                let CO2Meters = this.getInstanceByType("二氧化碳传感器")
                Promise.all([
                    getMultipleSeriesLatestValues(thermometers.map(item => item.tag), ["Temperature"]),
                    getMultipleSeriesLatestValues(hydrometers.map(item => item.tag), ["Humidity"]),
                    getMultipleSeriesLatestValues(CO2Meters.map(item => item.tag), ["CO₂ Density"]),
                ]).then(results => {
                    for(let i = 0; i < this.env_summary.length; i++) {
                        let result = results[i] ? results[i].data : {}
                        let records = Object.values(result).map(item => item[0])
                        let count = 0, sum = 0
                        for(let i = 0; i < records.length; i++) {
                            let record = records[i]
                            if (record.value) {
                                let value = parseFloat(record.value)
                                if (!isNaN(value)) {
                                    count += 1
                                    sum += value
                                }
                            }
                        }
                        this.env_summary[i].value = count ? parseFloat((sum / count).toFixed(1)) : 0
                    }
                })
            },
            getInstanceByType (type) {
                return Object.values(this.flattened).filter(item => item.type === type)
            }
        },
        mounted() {
            this.loaded = true
        },
        created() {
            this.getHierarchy()
        }
    }
</script>

<style scoped lang="scss">
    .equip-sum {
        .group-label {
            color: rgba(255, 255, 255, 0.90);
            font-family: "HarmonyOS Sans SC";
            font-size: 18px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            margin-bottom: 9px;
        }

        .sum-label {
            color: rgba(255, 255, 255, 0.60);
            font-family: "HarmonyOS Sans SC";
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
        }

        .sum-value {
            color: #FFFFFF;
            font-family: "HarmonyOS Sans SC";
            font-size: 36px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
        }

        .ratio-label {
            color: rgba(255, 255, 255, 0.60);
            font-family: "HarmonyOS Sans SC";
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
        }
    }

    .sum-label {
        color: rgba(255, 255, 255, 0.90);
        font-family: "HarmonyOS Sans SC";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        margin-bottom: 3px;
    }

    .sum-value {
        color: #FFFFFF;
        font-family: "HarmonyOS Sans SC";
        font-size: 32px;
        font-style: normal;
        font-weight: 700;
        line-height: 32px;

        .sum-unit {
            color: rgba(255, 255, 255, 0.60);
            font-family: "HarmonyOS Sans SC";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            margin-left: 0;
        }
    }
</style>