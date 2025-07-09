<template>
    <vgis-sub-card>
        <template slot="header">
            <div class="flex align-items-center justify-content-between">
                电量-室外湿球温度关系图
                <el-radio-group class="custom-range-selector" size="small" v-model="range" @input="refreshData">
                    <el-radio-button label="时"></el-radio-button>
                    <el-radio-button label="日"></el-radio-button>
                </el-radio-group>
            </div>
        </template>
        <div class="cat-selector m-t-24 m-b-24">
            <div class="cat-item">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @input="toggleAll"></el-checkbox>
                总值
            </div>
            <div class="cat-item" v-for="item in categories">
                <el-checkbox v-model="item.checked" @input="toggleIndeterminate"></el-checkbox>
                {{item.name}}
            </div>
        </div>
        <div style="height: calc(100% - 100px)">
            <v-chart :option="chartOption" autoresize></v-chart>
        </div>
    </vgis-sub-card>
</template>

<script>
import VgisSubCard from "@/components/DashboardWidget/Shared/vgis-sub-card.vue";
import {getMultipleSeriesHistoryValues, getNodeChildren, getSeriesHistoryValues} from "@/assets/js/api/hierarchy";
export default {
    name: "ElectricityTemperatureRelation",
    props: {
        station: Object,
        year: Number
    },
    components: {
        VgisSubCard
    },
    watch: {
        year (newValue) {
            this.refreshData()
        },
        station: {
            handler (newValue) {
                this.refreshData()
            },
            deep: true
        }
    },
    computed: {
        chartOption () {
            return {
                grid: {
                    top: 40,
                    left: 50,
                    right: 10,
                    bottom: 45,
                },
                tooltip: {
                    show: true
                },
                xAxis: {
                    name: "电量kWh",
                    type: "value",
                    min: "dataMin",
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
                    },
                    splitLine: {
                        show: false
                    },
                    nameLocation: "center",
                    nameGap: 30,
                    nameTextStyle: {
                        align: "center",
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12
                    }
                },
                yAxis: {
                    name: "室外湿球温度℃",
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
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
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
                    type: "scatter",
                    data: this.records,
                    itemStyle: {
                        color: "#40A9FF"
                    }
                }
            }
        }
    },
    data () {
        return {
            range: "时",
            checkAll: true,
            isIndeterminate: false,
            categories: [{
                name: "冷却泵",
                checked: true
            }, {
                name: "冷冻泵",
                checked: true
            }, {
                name: "冷却塔",
                checked: true
            }, {
                name: "冷机",
                checked: true
            }],
            meters: [],
            records: []
        }
    },
    methods: {
        toggleAll () {
            if (this.checkAll) {
                if (this.isIndeterminate) {
                    this.isIndeterminate = false
                }
                for(let i = 0; i < this.categories.length; i++) {
                    this.categories[i].checked = true
                }
            }
            else {
                if (this.isIndeterminate) {
                    this.isIndeterminate = false
                }
                for(let i = 0; i < this.categories.length; i++) {
                    this.categories[i].checked = false
                }
            }
            this.refreshData()
        },
        toggleIndeterminate () {
            let allChecked = this.categories.reduce((result, item) => result && item.checked, true)
            let allUnchecked = !(this.categories.reduce((result, item) => result || item.checked, false))
            this.isIndeterminate = !allChecked && !allUnchecked;
            this.refreshData()
        },
        refreshData () {
            if (this.station && this.station.id) {
                getNodeChildren(this.station.instanceId, "ElectricityMeter").then(result => {
                    this.meters = result.data
                    Promise.all([
                        getSeriesHistoryValues("总场站", ["室外湿球温度"], {
                            aggregation: this.range === "时" ? "hour" : "day",
                            method: "avg",
                            startAt: new Date(this.year, 0, 1),
                            endAt: new Date(this.year, 11, 31)
                        }),
                        getMultipleSeriesHistoryValues(this.meters.map(item => item.instanceId), ["电量"], {
                            aggregation: this.range === "时" ? "hour" : "day",
                            method: "latest",
                            startAt: new Date(this.year, 0, 1),
                            endAt: new Date(this.year, 11, 31)
                        })
                    ])
                    .then(results => {
                        let temperatures = results[0].data["室外湿球温度"] ? results[0].data["室外湿球温度"].values : []
                        let powers = results[1].data
                        let dateKey = `yyyy-MM-dd${this.range === "时" ? " hh" : ""}`
                        temperatures = temperatures.reduce((result, item) => {
                            result[new Date(item.time).format(dateKey)] = item.value
                            return result
                        }, {})
                        powers = this.meters.reduce((res, meter) => {
                            let attr = meter.attribute_values.find(item => item.static_attribute.name === "监测设备")
                            let attrValue = attr ? attr.value : ""
                            let records = powers[meter.instanceId] && powers[meter.instanceId]["电量"] ? powers[meter.instanceId]["电量"].values : []
                            if (res[attrValue]) {
                                let dateMap = records.reduce((result, record) => {
                                    let time = new Date(record.time), value = parseFloat(record.value)
                                    if (!isNaN(value)) {
                                        result[time.format(dateKey)] = value
                                    }
                                    return result
                                }, {})
                                for(let i = 0; i < records.length; i++) {
                                    let record = records[i]
                                    let time = new Date(record.time), value = parseFloat(record.value), last = new Date(record.time)
                                    if (this.range === "时") {
                                        last.setHours(last.getHours() - 1)
                                    }
                                    else {
                                        last.setDate(last.getDate() - 1)
                                    }
                                    if (dateMap.hasOwnProperty(time.format(dateKey)) && dateMap.hasOwnProperty(last.format(dateKey))) {
                                        if (!res[attrValue][time.format(dateKey)] && res[attrValue][time.format(dateKey)] !== 0) {
                                            res[attrValue][time.format(dateKey)] = 0
                                        }
                                        if (!isNaN(value)) {
                                            res[attrValue][time.format(dateKey)] += dateMap[time.format(dateKey)]&& dateMap[last.format(dateKey)]
                                        }
                                    }
                                }
                            }
                            return res
                        }, this.categories.filter(item => item.checked).reduce((result, item) => {
                            result[item.name] = {}
                            return result
                        }, {}))
                        powers = Object.values(powers).reduce((result, item) => {
                            for(let key in item) {
                                if (!result[key]) {
                                    result[key] = 0
                                }
                                result[key] += item[key]
                            }
                            return result
                        }, {})
                        this.records = Object.entries(powers).filter(([date, value]) => temperatures.hasOwnProperty(date)).map(([date, value]) => [ value, temperatures[date] ])
                    })
                })
            }
        }
    },
    created() {
        this.refreshData()
    }
}
</script>

<style lang="scss" scoped>
    .cat-selector {
        color: #FFFFFF;
        font-family: "HarmonyOS Sans SC";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        display: flex;
        align-items: center;

        .cat-item {
            display: flex;
            align-items: center;
            margin-right: 16px;

            .el-checkbox {
                margin-right: 8px;
            }
        }
    }
</style>

<style lang="scss">
.custom-range-selector .el-radio-button__inner {
    background-color: #003A8C;
    border-color: #003A8C;
    color: #FFFFFF;
    /* Body/regular */
    font-family: "HarmonyOS Sans SC";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 157.143% */
    border-left: none !important;
}
</style>