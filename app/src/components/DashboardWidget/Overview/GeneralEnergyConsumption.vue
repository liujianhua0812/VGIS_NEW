<template>
    <vgis-card>
        <template slot="header">
            <div class="flex justify-content-between align-items-center">
                能源消耗
                <vgis-fast-date-selector v-model="timeRange" @change="refreshData"></vgis-fast-date-selector>
            </div>
        </template>
        <div class="section-title">费用统计</div>
        <el-row :gutter="24">
            <el-col :span="12">
                <div class="mini-card p-l-15" style="height: 83px;">
                    <div class="price">
                        <div class="label">能耗费用</div>
                        <div class="value">
                            {{energyPrice.toLocaleString()}}
                            <small class="unit">元</small>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="mini-card p-l-15" style="height: 83px;">
                    <div class="price">
                        <div class="label">平均电价</div>
                        <div class="value">
                            {{averageElectricityPrice}}
                            <small class="unit">元</small>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div class="section-title">能源统计</div>
        <div class="mini-card justify-content-between p-l-20 p-r-20" style="height: 84px;">
            <div class="energy">
                <div class="value">
                    {{totalEnergy.curr.toLocaleString()}}
                    <small class="unit">kWh</small>
                </div>
                <div class="label">能耗总量</div>
            </div>
            <div class="energy">
                <div class="value">
                    {{Math.abs(totalEnergy.ratio)}}
                    <small class="unit">%</small>
                </div>
                <div class="label">
                    环比
                    <i v-if="totalEnergy.ratio > 0" class="iconfont icon-up up"></i>
                    <i v-if="totalEnergy.ratio < 0" class="iconfont icon-down down"></i>
                </div>
            </div>
            <div class="energy">
                <div class="value">
                    {{parseFloat(totalEnergy.scale.toFixed(1))}}
                    <small class="unit">kWh/kWh</small>
                </div>
                <div class="label">
                    强度
                    <small :class="['energy-level', `level-${totalEnergy.level}`]">{{totalEnergy.level > 3 ? "超标" : `${totalEnergy.level}级`}}</small>
                </div>
            </div>
        </div>
        <div class="flex align-items-center m-t-12" v-for="item in aspects">
            <div class="aspect-icon" :style="{ color: item.color, background: item.backgroundColor }">
                <i :class="item.icon"></i>
            </div>
            <div class="aspect">
                <div class="value">
                    {{item.curr.toLocaleString()}}
                    <small class="unit">{{item.unit}}</small>
                </div>
                <div class="label">{{item.name}}</div>
            </div>
            <div class="aspect">
                <div class="value">
                    {{Math.abs(item.ratio)}}
                    <small class="unit">%</small>
                </div>
                <div class="label">
                    环比
                    <i v-if="totalEnergy.ratio > 0" class="iconfont icon-up up"></i>
                    <i v-if="totalEnergy.ratio < 0" class="iconfont icon-down down"></i>
                </div>
            </div>
        </div>
        <div class="section-title">碳排放统计</div>
        <div class="m-b-8">
            <div class="section-subtitle">碳排放量</div>
            <div class="flex align-items-center m-t-12">
                <div class="aspect-icon" :style="{ color: '#52C41A', background: 'rgba(13, 158, 0, 0.20)' }">
                    <i class="iconfont icon-CO2"></i>
                </div>
                <div class="aspect">
                    <div class="value">
                        {{totalCarbon.toLocaleString()}}
                        <small class="unit">t</small>
                    </div>
                    <div class="label">总量</div>
                </div>
                <div class="aspect">
                    <div class="value">
                        {{ Math.abs(getGapRatio(totalCarbon, totalCarbonPrev)) }}
                        <small class="unit">%</small>
                    </div>
                    <div class="label">
                        环比
                        <i v-if="getGapRatio(totalCarbon, totalCarbonPrev) > 0" class="iconfont icon-up up"></i>
                        <i v-if="getGapRatio(totalCarbon, totalCarbonPrev) < 0" class="iconfont icon-down down"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="m-b-8">
            <div class="section-subtitle">抵消后碳排放量</div>
            <div class="flex align-items-center m-t-12">
                <div class="aspect-icon" :style="{ color: '#52C41A', background: 'rgba(13, 158, 0, 0.20)' }">
                    <i class="iconfont icon-CO2-counteract"></i>
                </div>
                <div class="aspect">
                    <div class="value">
                        {{(totalCarbon - recycleCarbon - transactionTotal.curr).toLocaleString()}}
                        <small class="unit">t</small>
                    </div>
                    <div class="label">总量</div>
                </div>
                <div class="aspect">
                    <div class="value">
                        {{ Math.abs(getGapRatio(totalCarbon - recycleCarbon - transactionTotal.curr, totalCarbonPrev - recycleCarbonPrev - transactionTotal.prev)) }}
                        <small class="unit">%</small>
                    </div>
                    <div class="label">
                        环比
                        <i v-if="getGapRatio(totalCarbon - recycleCarbon - transactionTotal.curr, totalCarbonPrev - recycleCarbonPrev - recycleCarbonPrev - transactionTotal.prev) > 0" class="iconfont icon-up up"></i>
                        <i v-if="getGapRatio(totalCarbon - recycleCarbon - transactionTotal.curr, totalCarbonPrev - recycleCarbonPrev - recycleCarbonPrev - transactionTotal.prev) < 0" class="iconfont icon-down down"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="section-title">可再生能源统计</div>
        <div class="mini-card justify-content-between p-l-20 p-r-20" style="height: 84px;">
            <div class="recycle">
                <div class="value">
                    {{recycle.value}}
                    <small class="unit">kWh</small>
                </div>
                <div class="label">发电量</div>
            </div>
            <div class="recycle">
                <div class="value">
                    {{recycleCarbon}}
                    <small class="unit">t</small>
                </div>
                <div class="label">节省碳排放量</div>
            </div>
            <div class="recycle">
                <div class="value">
                    {{toFixedValue(totalCarbon ? recycleCarbon / totalCarbon * 100 : 0, 2)}}
                    <small class="unit">%</small>
                </div>
                <div class="label">占比</div>
            </div>
        </div>
    </vgis-card>
</template>

<script>

import VgisCard from "@/components/Standard/vgis-card.vue";
import VgisFastDateSelector from "@/components/DashboardWidget/Shared/vgis-fast-date-selector.vue";
import {
    getMultipleAttributeValues,
    getMultipleSeriesHistoryValues,
    getNodesByModel,
    getSeriesHistoryValues
} from "@/assets/js/api/hierarchy";
import {getEffectiveFactorValues, getFactorValues} from "@/assets/js/api/factor";
import {
    calculateCarbon,
    calculateElectricityCost,
    calculateEnergyCost,
    getEnergy, getGapRatio,
    getSteamToElectricityFactor, toFixedValue
} from "@/utils/Statistics";
import {getElectricityPrice, getGeneralPrice} from "@/assets/js/api/price";
import {getCarbonAssetsList} from "@/assets/js/api/catbon-asset";
export default {
    name: "GeneralEnergyConsumption",
    components: {
        VgisFastDateSelector,
        VgisCard
    },
    computed: {
        energyPrice () {
            let sum = 0
            let timeRange = this.timeRange
            let ePrice = this.prices["电"] || [], eRecords = this.records["耗电总量"] ? this.records["耗电总量"].values : []
            sum += calculateElectricityCost(ePrice, eRecords.map(item => ({ time: new Date(item.time), value: parseFloat(item.value) })).filter(item => item.time >= timeRange[0]))
            let wPrice = this.prices["水"] || [], wRecords = this.records["用水总量"] ? this.records["用水总量"].values : []
            sum += calculateEnergyCost(wPrice, wRecords.map(item => ({ time: new Date(item.time), value: parseFloat(item.value) })).filter(item => item.time >= timeRange[0]))
            let gPrice = this.prices["天然气"] || [], gRecords = this.records["用气总量"] ? this.records["用气总量"].values : []
            sum += calculateEnergyCost(gPrice, gRecords.map(item => ({ time: new Date(item.time), value: parseFloat(item.value) })).filter(item => item.time >= timeRange[0]))
            let sPrice = this.prices["蒸汽"] || [], sRecords = this.records["蒸汽总用量"] ? this.records["蒸汽总用量"].values : []
            sum += calculateEnergyCost(sPrice, sRecords.map(item => ({ time: new Date(item.time), value: parseFloat(item.value) })).filter(item => item.time >= timeRange[0]))
            return toFixedValue(sum, 1)
        },
        averageElectricityPrice () {
            let timeRange = this.timeRange
            let ePrice = this.prices["电"] || [], eRecords = this.records["耗电总量"] ? this.records["耗电总量"].values : []
            let ePTotal = calculateElectricityCost(ePrice, eRecords.map(item => ({ time: new Date(item.time), value: parseFloat(item.value) })).filter(item => item.time >= timeRange[0]))
            let eTotal = this.aspects[0].curr
            let average = eTotal ? ePTotal / eTotal : 0
            return toFixedValue(average, 1)
        },
        totalCarbon () {
            let timeRange = this.timeRange
            let sum = 0
            let eFactor = this.factors["电"] || [], eRecords = this.records["耗电总量"] ? this.records["耗电总量"].values : []
            sum += calculateCarbon(eFactor, eRecords.map(item => ({ time: new Date(item.time), value: parseFloat(item.value) })).filter(item => item.time >= timeRange[0]))
            let wFactor = this.factors["水"] || [], wRecords = this.records["用水总量"] ? this.records["用水总量"].values : []
            sum += calculateCarbon(wFactor, wRecords.map(item => ({ time: new Date(item.time), value: parseFloat(item.value) })).filter(item => item.time >= timeRange[0]))
            let gFactor = this.factors["天然气"] || [], gRecords = this.records["用气总量"] ? this.records["用气总量"].values : []
            sum += calculateCarbon(gFactor, gRecords.map(item => ({ time: new Date(item.time), value: parseFloat(item.value) })).filter(item => item.time >= timeRange[0]))
            let sFactor = this.factors["蒸汽"] || [], sRecords = this.records["蒸汽总用量"] ? this.records["蒸汽总用量"].values : []
            sum += calculateCarbon(sFactor, sRecords.map(item => ({ time: new Date(item.time), value: parseFloat(item.value) })).filter(item => item.time >= timeRange[0]))
            return toFixedValue(sum, 1)
        },
        totalCarbonPrev () {
            let timeRange = this.timeRange
            let sum = 0
            let eFactor = this.factors["电"] || [], eRecords = this.records["耗电总量"] ? this.records["耗电总量"].values : []
            sum += calculateCarbon(eFactor, eRecords.map(item => ({ time: new Date(item.time), value: parseFloat(item.value) })).filter(item => item.time < timeRange[0]))
            let wFactor = this.factors["水"] || [], wRecords = this.records["用水总量"] ? this.records["用水总量"].values : []
            sum += calculateCarbon(wFactor, wRecords.map(item => ({ time: new Date(item.time), value: parseFloat(item.value) })).filter(item => item.time < timeRange[0]))
            let gFactor = this.factors["天然气"] || [], gRecords = this.records["用气总量"] ? this.records["用气总量"].values : []
            sum += calculateCarbon(gFactor, gRecords.map(item => ({ time: new Date(item.time), value: parseFloat(item.value) })).filter(item => item.time < timeRange[0]))
            let sFactor = this.factors["蒸汽"] || [], sRecords = this.records["蒸汽总用量"] ? this.records["蒸汽总用量"].values : []
            sum += calculateCarbon(sFactor, sRecords.map(item => ({ time: new Date(item.time), value: parseFloat(item.value) })).filter(item => item.time < timeRange[0]))
            return toFixedValue(sum, 1)
        },
        recycleCarbon () {
            let timeRange = this.timeRange
            let eFactor = this.factors["电"] || [], records = this.recycleRecords
            let cTotal = calculateCarbon(eFactor, records.map(item => ({ time: new Date(item.time), value: parseFloat(item.value) })).filter(item => item.time >= timeRange[0]))
            return toFixedValue(cTotal, 1)
        },
        recycleCarbonPrev () {
            let timeRange = this.timeRange
            let eFactor = this.factors["电"] || [], records = this.recycleRecords
            let cTotal = calculateCarbon(eFactor, records.map(item => ({ time: new Date(item.time), value: parseFloat(item.value) })).filter(item => item.time < timeRange[0]))
            return toFixedValue(cTotal, 1)
        },
        transactionTotal () {
            let gap = this.timeRange
            let result = 0, resultPrev = 0
            for(let i = 0; i < this.transactions.length; i++) {
                let record = this.transactions[i]
                if (new Date(record.dealAt) >= gap[0]) {
                    if (record.asset_type.type === "买入") {
                        result += record.carbon
                    }
                    else {
                        result -= record.carbon
                    }
                }
                else {
                    if (record.asset_type.type === "买入") {
                        resultPrev += record.carbon
                    }
                    else {
                        resultPrev -= record.carbon
                    }
                }
            }
            return {
                curr: result,
                prev: resultPrev
            }
        }
    },
    data () {
        return {
            timeRange: [],
            days: 1,
            sMeters: [],
            prices: {},
            factors: {},
            records: {},
            recycleRecords: [],
            transactions: [],
            price: [{
                name: "能耗费用",
                value: 65416,
                unit: "元"
            }, {
                name: "平均电费",
                value: 1.05,
                unit: "元/kWh"
            }],
            recycle: {
                name: "发电量",
                value: 45,
                unit: "kWh"
            },
            aspects: [{
                name: "电总量",
                icon: "iconfont icon-electricity",
                color: "#FADB14",
                backgroundColor: "rgba(255, 176, 22, 0.20)",
                curr: 32034,
                last: 30920.8,
                unit: "kWh",
                get ratio () {
                    if (this.last === 0) {
                        return 0
                    }
                    return parseFloat(((this.curr - this.last) / this.last * 100).toFixed(1))
                }
            }, {
                name: "天然气总量",
                icon: "iconfont icon-gas",
                color: "#FA541C",
                backgroundColor: "rgba(255, 84, 11, 0.20)",
                curr: 1258,
                last: 30920.8,
                unit: "m³",
                get ratio () {
                    if (this.last === 0) {
                        return 0
                    }
                    return parseFloat(((this.curr - this.last) / this.last * 100).toFixed(1))
                },
            }, {
                name: "蒸汽总量",
                icon: "iconfont icon-steam",
                color: "#D4D4D4",
                backgroundColor: "rgba(214, 214, 214, 0.20)",
                curr: 17,
                last: 30920.8,
                unit: "GJ",
                get ratio () {
                    if (this.last === 0) {
                        return 0
                    }
                    return parseFloat(((this.curr - this.last) / this.last * 100).toFixed(1))
                }
            }, {
                name: "水总量",
                icon: "iconfont icon-water",
                color: "#4ABEFF",
                backgroundColor: "rgba(74, 190, 255, 0.20)",
                curr: 435,
                last: 30920.8,
                unit: "t",
                get ratio () {
                    if (this.last === 0) {
                        return 0
                    }
                    return parseFloat(((this.curr - this.last) / this.last * 100).toFixed(1))
                }
            }],
            totalEnergy: {
                curr: 32034,
                last: 30920.8,
                get ratio () {
                    if (this.last === 0) {
                        return 0
                    }
                    return parseFloat(((this.curr - this.last) / this.last * 100).toFixed(1))
                },
                get scale () {
                    if (this.production === 0 || isNaN(this.production)) {
                        return 0
                    }
                    return parseFloat((this.curr / this.production).toFixed(1))
                },
                get level () {
                    if (this.scale <= 24) {
                        return 1
                    }
                    else if (this.scale <= 40) {
                        return 2
                    }
                    else if (this.scale <= 48) {
                        return 3
                    }
                    else {
                        return 4
                    }
                },
                production: 1
            },
            carbon: [{
                name: "碳排放量",
                icon: "iconfont icon-CO2",
                curr: 2456,
                last: 30920.8,
                unit: "t",
                get ratio () {
                    if (this.last === 0) {
                        return 0
                    }
                    return parseFloat(((this.curr - this.last) / this.last * 100).toFixed(1))
                }
            }, {
                name: "抵消后碳排放量",
                icon: "iconfont icon-CO2-counteract",
                curr: 1265,
                last: 30920.8,
                unit: "t",
                get ratio () {
                    if (this.last === 0) {
                        return 0
                    }
                    return parseFloat(((this.curr - this.last) / this.last * 100).toFixed(1))
                },
            }]
        }
    },
    methods: {
        toFixedValue,
        getGapRatio,
        getFactors () {
            getFactorValues({
                page: 1,
                pagination: Number.MAX_SAFE_INTEGER,
                order: "ASC"
            }).then(result => {
                this.factors = result.data.reduce((res, item) => {
                    if (!res[item.conversion_factor.name]) {
                        res[item.conversion_factor.name] = []
                    }
                    if (item.startAt) {
                        item.startAt = new Date(item.startAt)
                    }
                    if (item.endAt) {
                        item.endAt = new Date(item.endAt)
                    }
                    res[item.conversion_factor.name].push(item)
                    return res
                }, {})
            })
        },
        getEnergyPrice () {
            Promise.all([
                getGeneralPrice({
                    page: 1,
                    pagination: Number.MAX_SAFE_INTEGER,
                    order: "ASC",
                }),
                getElectricityPrice({
                    page: 1,
                    pagination: Number.MAX_SAFE_INTEGER,
                    order: "ASC",
                })
            ]).then(([general, electricity]) => {
                this.prices = general.data.reduce((res, item) => {
                    if (!res[item.energy]) {
                        res[item.energy] = []
                    }
                    if (item.startAt) {
                        item.startAt = new Date(item.startAt)
                    }
                    if (item.endAt) {
                        item.endAt = new Date(item.endAt)
                    }
                    res[item.energy].push(item)
                    return res
                }, {})
                this.prices["电"] = electricity.data.map(item => {
                    item.month = new Date(item.month)
                    return item
                })
            })
        },
        getStat (data, name, gap) {
            let middle = gap[0], end = gap[1], start = new Date(middle - (end - middle))
            let result = {}
            let records = data[name] ? data[name].values : []
            let sRecords = records.filter(item => new Date(item.time) <= middle)
            let eRecords = records.filter(item => new Date(item.time) > middle)
            if (sRecords.length > 1) {
                let last = parseFloat(sRecords[0].value)
                let curr = parseFloat(sRecords[sRecords.length - 1].value)
                if (!isNaN(last) && !isNaN(curr)) {
                    result.last = curr - last
                }
            }
            if (eRecords.length > 1) {
                let last = parseFloat(eRecords[0].value)
                let curr = parseFloat(eRecords[eRecords.length - 1].value)
                if (!isNaN(last) && !isNaN(curr)) {
                    result.curr = curr - last
                }
            }
            return result
        },
        refreshData (gap) {
            this.timeRange = gap
            let startAt = new Date(gap[0] - (gap[1] - gap[0]))
            Promise.all([
                getSeriesHistoryValues("总场站", ["可再生能源总发电量"], {
                    startAt: gap[0],
                    endAt: gap[1],
                    aggregation: "hour",
                    method: "latest"
                }),
                getSeriesHistoryValues("总场站", ["耗电总量", "用水总量", "用气总量", "总能耗", "蒸汽总用量", "产量"], {
                    startAt: startAt,
                    endAt: gap[1],
                    aggregation: "hour",
                    method: "latest"
                }),
                getCarbonAssetsList({
                    dealAt: [startAt, gap[1]]
                })
            ]).then(([recycle, others, transactions]) => {
                this.records = others.data
                this.transactions = transactions.data
                let records = recycle.data["可再生能源总发电量"] ? recycle.data["可再生能源总发电量"].values : []
                this.recycleRecords = records
                if (records.length > 1) {
                    let curr = parseFloat(records[records.length - 1].value)
                    let last = parseFloat(records[0].value)
                    if (!isNaN(curr) && !isNaN(last)) {
                        this.recycle.value = (curr - last).toFixed(0)
                    }
                }

                Object.assign(this.aspects[0], this.getStat(others.data, "耗电总量", gap))
                Object.assign(this.aspects[1], this.getStat(others.data, "用水总量", gap))
                Object.assign(this.aspects[2], this.getStat(others.data, "用气总量", gap))
                Object.assign(this.aspects[3], this.getStat(others.data, "蒸汽总用量", gap))
                Object.assign(this.totalEnergy, this.getStat(others.data, "总能耗", gap))

                this.totalEnergy.production = this.getStat(others.data, "产量", gap).curr
            })
        }
    },
    created() {
        this.getEnergyPrice()
        this.getFactors()
    }
}
</script>

<style lang="scss" scoped>
    .section-title {
        margin-top: 24px;
        margin-bottom: 8px;
        color: #FFFFFF;
        font-family: "HarmonyOS Sans SC";
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    }

    .section-subtitle {
        color: rgba(255, 255, 255, 0.80);
        font-family: "HarmonyOS Sans SC";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }

    .price {
        font-family: "HarmonyOS Sans SC";
        color: #FFFFFF;
        font-style: normal;
        line-height: normal;

        .label {
            font-size: 14px;
            font-weight: 400;
        }
        .value {
            font-size: 34px;
            font-weight: 700;

            .unit {
                color: rgba(255, 255, 255, 0.80);
                font-size: 18px;
                font-weight: 400;
                margin-left: 4px;
            }
        }
    }

    .aspect-icon {
        flex-shrink: 0;
        width: 56px;
        height: 56px;
        border-radius: 25%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 24px;

        i {
            font-size: 56px !important;
            line-height: 56px !important;
        }
    }

    .aspect {
        flex-grow: 1;
        flex-shrink: 0;
        flex-basis: 0;
        font-family: "HarmonyOS Sans SC";
        color: #FFFFFF;
        font-style: normal;
        line-height: normal;

        .label {
            margin-top: 5px;
            font-size: 14px;
            font-weight: 400;
        }
        .value {
            font-size: 32px;
            font-weight: 700;

            .unit {
                color: rgba(255, 255, 255, 0.80);
                font-size: 14px;
                font-weight: 400;
                margin-left: 4px;
            }
        }
    }

    .energy {
        font-family: "HarmonyOS Sans SC";
        color: #FFFFFF;
        font-style: normal;
        line-height: normal;

        .label {
            margin-top: 5px;
            color: rgba(255, 255, 255, 0.80);
            font-size: 14px;
            font-weight: 400;
        }
        .value {
            font-size: 30px;
            font-weight: 700;

            .unit {
                color: rgba(255, 255, 255, 0.80);
                font-size: 14px;
                font-weight: 400;
                margin-left: 4px;
            }
        }
    }

    .energy-level {
        padding: 2px 9px;
        font-family: "HarmonyOS Sans SC";
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        border-radius: 4px;
        margin-left: 4px;
    }

    .energy-level.level-1 {
        background: rgba(82, 196, 26, 0.4);
        color: #52C41A;
    }

    .energy-level.level-2 {
        background: rgba(255, 255, 0, 0.4);
        color: #FFFF00;
    }

    .energy-level.level-3 {
        background: rgba(255, 116, 0, 0.4);
        color: #FF7400;
    }

    .energy-level.level-4 {
        background: rgba(175, 0, 0, 0.4);
        color: #AF0000;
    }

    .recycle {
        font-family: "HarmonyOS Sans SC";
        color: #FFFFFF;
        font-style: normal;
        line-height: normal;

        .label {
            margin-top: 5px;
            color: rgba(255, 255, 255, 0.80);
            font-size: 14px;
            font-weight: 400;
        }
        .value {
            font-size: 32px;
            font-weight: 700;

            .unit {
                color: rgba(255, 255, 255, 0.80);
                font-size: 18px;
                font-weight: 400;
                margin-left: 4px;
            }
        }
    }

    .down {
        color: #52C41A;
    }

    .up {
        color: #AF0000;
    }

    .mini-card {
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.20);
        display: flex;
        align-items: center;
    }

</style>