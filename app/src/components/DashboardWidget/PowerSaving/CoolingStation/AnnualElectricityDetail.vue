<template>
    <vgis-sub-card title="全年电量拆分情况">
        <div style="display: inline-block; width: calc(100% - 744px); height: 284px;" class="m-r-24 m-t-11 chart-container">
            <v-chart class="full" :option="chartOption" autoresize></v-chart>
        </div>
        <div style="display: inline-block;" class="m-t-11">
            <el-table
                :data="records"
                class="pctt"
                header-row-class-name="pctt-header"
                header-cell-class-name="pctt-header-cell"
                row-class-name="pctt-row"
                cell-class-name="pctt-cell"
            >
                <el-table-column label="设备类型" prop="type" width="115px"></el-table-column>
                <el-table-column label="今年用电量 / 万kWh">
                    <template slot-scope="{ row }">
                        {{ row.currYear.toLocaleString() }}
                    </template>
                </el-table-column>
                <el-table-column label="去年用电量 / 万kWh">
                    <template slot-scope="{ row }">
                        {{ row.currYear.toLocaleString() }}
                    </template>
                </el-table-column>
                <el-table-column label="今年占比" width="115px">
                    <template slot-scope="{ row }">
                        {{ getPercentage(row, "currYear") }}%
                    </template>
                </el-table-column>
                <el-table-column label="去年占比" width="115px">
                    <template slot-scope="{ row }">
                        {{ getPercentage(row, "lastYear") }}%
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </vgis-sub-card>
</template>

<script>
import VgisSubCard from "@/components/DashboardWidget/Shared/vgis-sub-card.vue";
import VgisRow from "@/components/Standard/vgis-row.vue";
import VgisCol from "@/components/Standard/vgis-col.vue";
import VgisCell from "@/components/Standard/vgis-cell.vue";
import {getMultipleSeriesHistoryValues, getNodeChildren} from "@/assets/js/api/hierarchy";

export default {
    name: "AnnualElectricityDetail",
    props: {
        station: Object,
        year: Number
    },
    components: {
        VgisCell,
        VgisCol,
        VgisRow,
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
            let that = this
            return {
                title: [{
                    text: "当前数据",
                    textStyle: {
                        color: "#FFFFFF",
                        fontSize: 16,
                        fontWeight: 600,
                        fontFamily: "HarmonyOS Sans SC"
                    },
                    left: 24,
                    top: 24
                }, {
                    text: "去年数据",
                    textStyle: {
                        color: "#FFFFFF",
                        fontSize: 16,
                        fontWeight: 600,
                        fontFamily: "HarmonyOS Sans SC"
                    },
                    left: "50%",
                    top: 24
                }],
                dataset: {
                    source: [
                        ["设备类型", "今年用电量", "去年用电量"]
                    ].concat(this.records.map(item => [item.type, item.currYear, item.lastYear]))
                },
                legend: {
                    show: true,
                    bottom: 20,
                    left: "center",
                    icon: "circle",
                    itemWidth: 12,
                    itemHeight: 12,
                    itemGap: 24,
                    itemStyle: {
                        borderWidth: 0,
                    },
                    textStyle: {
                        color: "#8C8C8C",
                        fontSize: 12,
                    },
                    data: this.records.map(item => ({
                        name: item.type,
                        itemStyle: {
                            color: item.color,
                            borderColor: "transparent"
                        }
                    }))
                },
                color: this.records.map(item => item.color),
                series: [{
                    type: "pie",
                    center: ["25%", "50%"],
                    radius: ["40%", "60%"],
                    label: {
                        show: true,
                        formatter (item) {
                            return `${item.percent}%`
                        },
                        textStyle: {
                            color: "#FFFFFF",
                            fontSize: 14
                        }
                    },
                    labelLine: {
                        show: false,
                        length: 10,
                        length2: 0
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
                }, {
                    type: "pie",
                    center: ["75%", "50%"],
                    radius: ["40%", "60%"],
                    label: {
                        show: true,
                        formatter (item) {
                            return `${item.percent}%`
                        },
                        textStyle: {
                            color: "#FFFFFF",
                            fontSize: 14
                        }
                    },
                    labelLine: {
                        show: false,
                        length: 10,
                        length2: 0
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
                }]
            }
        }
    },
    data () {
        return {
            records: [{
                type: "冷机",
                currYear: 0,
                lastYear: 0,
                color: "#40A9FF"
            }, {
                type: "冷却泵",
                currYear: 0,
                lastYear: 0,
                color: "#13C2C2"
            }, {
                type: "冷冻泵",
                currYear: 0,
                lastYear: 0,
                color: "#52C41A"
            }, {
                type: "冷却塔",
                currYear: 0,
                lastYear: 0,
                color: "#FAAD14"
            }]
        }
    },
    methods: {
        getPercentage (item, attr) {
            let sum = this.records.reduce((result, item) => ((result + item[attr]) || 0), 0)
            if (!item[attr] || !sum) {
                return 0
            }
            return parseFloat((item[attr] / sum * 100).toFixed(1))
        },
        refreshData () {
            if (this.station && this.station.id) {
                getNodeChildren(this.station.instanceId, "ElectricityMeter").then(result => {
                    this.meters = result.data
                    let thisYear = this.year, lastYear = thisYear - 1
                    getMultipleSeriesHistoryValues(this.meters.map(item => item.instanceId), ["电量"], {
                        aggregation: "month",
                        method: "latest",
                        startAt: new Date(lastYear, 0, 1),
                        endAt: new Date(thisYear, 11, 31)
                    }).then(result => {
                        let records = this.meters.reduce((res, meter) => {
                            let attr = meter.attribute_values.find(item => item.static_attribute.name === "监测设备")
                            let attrValue = attr ? attr.value : ""
                            if (res[attrValue]) {
                                let records = result.data[meter.instanceId] && result.data[meter.instanceId]["电量"] ? result.data[meter.instanceId]["电量"].values : []
                                for(let i = 0; i < records.length; i++) {
                                    let record = records[i]
                                    let value = parseFloat(record.value)
                                    if (!isNaN(value)) {
                                        if (new Date(record.time).getFullYear() === thisYear) {
                                            res[attrValue].currYear += value / 10000
                                        }
                                        if (new Date(record.time).getFullYear() === lastYear) {
                                            res[attrValue].lastYear += value / 10000
                                        }
                                    }
                                }
                            }
                            return res
                        }, this.records.reduce((result, item) => {
                            item.currYear = 0
                            item.lastYear = 0
                            result[item.type] = item
                            return result
                        }, {}))
                        this.records = Object.values(records)
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
    .chart-container {
        border-radius: 12px;
        background: #002766;
    }
</style>

<style lang="scss">
.pctt {
    flex-shrink: 0;
    width: 720px;
    background: transparent;

    .pctt-header {
        border-bottom: none !important;

        .pctt-header-cell {
            background: #003A8C;
            padding: 18px;
            color: #FFFFFF;
            font-family: "HarmonyOS Sans SC";
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            line-height: 22px;
            border-bottom: none !important;
        }
    }

    .pctt-row:hover {
        background: rgba(255, 255, 255, 0.20) !important;
        border-bottom: none;

        .pctt-cell {
            background: rgba(74, 190, 255, 0.01) !important;
        }
    }

    .pctt-row {
        background: transparent;

        .pctt-cell {
            padding: 16px;
            color: #FFFFFF;
            font-family: "HarmonyOS Sans SC";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.20) !important;
        }
    }
}

.pctt:before {
    content: none;
}
</style>