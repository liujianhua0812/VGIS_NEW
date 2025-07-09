<template>
    <vgis-card title="能源费用平均趋势">
        <v-chart :option="chartOption" autoresize></v-chart>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import {getSeriesHistoryValues} from "@/assets/js/api/hierarchy";
import {getElectricityPrice, getGeneralPrice} from "@/assets/js/api/price";
import {calculateElectricityCost, calculateEnergyCost, toFixedValue, calculateUpperAndLowerBound} from "@/utils/Statistics";

export default {
    name: "CostAverageTrend",
    components: {
        VgisCard
    },
    computed: {
        trend () {
            let result = []
            let year = new Date().getFullYear()

            let eRecords = this.records["耗电总量"] ? this.records["耗电总量"].values : []
            let wRecords = this.records["用水总量"] ? this.records["用水总量"].values : []
            let gRecords = this.records["用气总量"] ? this.records["耗电总量"].values : []
            let sRecords = this.records["蒸汽总用量"] ? this.records["蒸汽总用量"].values : []

            let ePrices = this.prices["电"] || []
            let wPrices = this.prices["水"] || []
            let gPrices = this.prices["天然气"] || []
            let sPrices = this.prices["蒸汽"] || []

            let data = {}
            for(let i = year - 1; i <= year; i++) {
                for(let j = 0; j < 12; j++) {
                    let sum = 0

                    let prices = this.slicePriceByMonth(wPrices, new Date(i, j))
                    let records = this.sliceRecordsByMonth(wRecords, new Date(i, j))
                    sum += calculateEnergyCost(prices, records.map(item => ({ value: parseFloat(item.value), time: new Date(item.time) })))

                    prices = this.slicePriceByMonth(gPrices, new Date(i, j))
                    records = this.sliceRecordsByMonth(gRecords, new Date(i, j))
                    sum += calculateEnergyCost(prices, records.map(item => ({ value: parseFloat(item.value), time: new Date(item.time) })))

                    prices = this.slicePriceByMonth(sPrices, new Date(i, j))
                    records = this.sliceRecordsByMonth(sRecords, new Date(i, j))
                    sum += calculateEnergyCost(prices, records.map(item => ({ value: parseFloat(item.value), time: new Date(item.time) })))

                    records = this.sliceRecordsByMonth(eRecords, new Date(i, j))
                    sum += calculateElectricityCost(ePrices, records.map(item => ({ value: parseFloat(item.value), time: new Date(item.time) })))

                    data[new Date(i, j).format("yyyy-MM")] = sum
                }
            }
            for(let i = 0; i < 12; i++) {
                let start = new Date(year - 1, i + 1), end = new Date(year, i)
                let sum = 0
                for(let j = new Date(start.getTime()); j <= end; j.setMonth(j.getMonth() + 1)) {
                    sum += data[j.format("yyyy-MM")] || 0
                }
                result.push({
                    date: `${start.format("yy.MM")}-${end.format("yy.MM")}`,
                    value: sum
                })
            }
            return result
        },
        chartOption () {
            let trend = this.trend
            let { upper, lower } = calculateUpperAndLowerBound(trend.map(item => item.value))

            return {
                tooltip: {
                    show: true,
                    trigger: "axis",
                    formatter ([params]) {
                        return `<b>${params.name}: </b>${toFixedValue(params.value, 2).toLocaleString()} 元`
                    }
                },
                grid: {
                    right: 24,
                    left: 40,
                    top: 50,
                    bottom: 60
                },
                xAxis: {
                    type: "category",
                    data: trend.map(item => item.date),
                    axisLabel: {
                        color: "rgba(255, 255, 255, 0.60)",
                        fontSize: 12,
                        rotate: 30
                    },
                    axisLine: {
                        lineStyle: {
                            color: "rgba(255, 255, 255, 0.25)"
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: "rgba(255, 255, 255, 0.25)"
                        }
                    }
                },
                yAxis: {
                    name: "百万元",
                    type: "value",
                    max: upper,
                    min: lower,
                    nameLocation: "end",
                    nameGap: 20,
                    nameTextStyle: {
                        align: "right",
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12
                    },
                    axisLabel: {
                        color: "rgba(255, 255, 255, 0.40)",
                        fontSize: 12,
                        formatter (value) {
                            return value / 1000000
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: "rgba(255, 255, 255, 0.25)"
                        }
                    }
                },
                series: {
                    type: "bar",
                    data: trend.map(item => item.value),
                    itemStyle: {
                        color: "#25BE8E"
                    }
                }
            }
        }
    },
    data () {
        return {
            prices: {},
            records: {}
        }
    },
    methods: {
        slicePriceByMonth (prices, month) {
            let result = []

            let start = new Date(month.getFullYear(), month.getMonth(), 1)
            let end = new Date(month.getFullYear(), month.getMonth() + 1, 1)
            end.setSeconds(end.getSeconds() - 1)

            for(let i = 0; i < prices.length; i++) {
                let price = prices[i]
                if ((!price.endAt || price.endAt > start) && (!price.startAt || price.startAt <= end)) {
                    result.push(price)
                }
            }
            return result
        },
        sliceRecordsByMonth (records = [], month) {
            return records.filter(item => new Date(item.time).format("yyyy-MM") === month.format("yyyy-MM"))
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
        refreshData () {
            let now = new Date()
            let startAt = new Date(now.getFullYear() - 1, 0, 1)
            let endAt = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0)
            getSeriesHistoryValues("总场站", ["耗电总量", "用水总量", "用气总量", "总能耗", "蒸汽总用量"], {
                startAt,
                endAt,
                aggregation: "day",
                method: "latest"
            }).then(result => {
                this.records = result.data
            })
        }
    },
    created () {
        this.getEnergyPrice()
        this.refreshData()
    }
}
</script>

<style scoped>

</style>