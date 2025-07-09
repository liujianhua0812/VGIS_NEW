<template>
  <div class="chart-container">
      <v-chart :option="comparisonOption" autoresize style="height: 100%; width: 300px;"></v-chart>
      <v-chart :option="componentOption" autoresize style="height: 100%;"></v-chart>
      <v-chart :option="facilityOption" autoresize style="height: 100%;"></v-chart>
  </div>
</template>

<script>
import {
    getMultipleAttributeValues, getMultipleSeriesHistoryValues,
    getNodesByModel,
    getSeriesHistoryValues,
    getSeriesLatestValues
} from "@/assets/js/api/hierarchy";
import {getTimeSeriesList} from "@/assets/js/api/model-series";
import {toFixedValue} from "@/utils/Statistics";
import {isLeapYear} from "@/utils/date";

export default {
    name: "EnergyOverview",
    props: {
        timeRange: Array
    },
    watch: {
        timeRange: {
            handler (newValue) {
                this.refreshData()
            },
            deep: true
        }
    },
    computed: {
        comparisonOption () {
            return {
                grid: {
                    top: 0,
                    bottom: 30
                },
                xAxis: {
                    type: 'category',
                    data: ['实际值', '指标值'],
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#FFFFFF"
                        }
                    },
                    axisLabel: {
                        color: "#FFFFFF"
                    }
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    }
                },
                series: [
                    {
                        data: [
                            toFixedValue(this.energy.curr, this.series["总能耗"] ? this.series["总能耗"].precision : 2),
                            toFixedValue(this.energy.reference, this.series["能耗指标"] ? this.series["能耗指标"].precision : 2),
                        ],
                        type: 'bar',
                        barWidth: 16,
                        itemStyle: {
                            color: "#2174FF"
                        },
                        label: {
                            show: true,
                            position: "top",
                            textStyle: {
                                color: "#FFFFFF"
                            }
                        }
                    }
                ]
            }
        },
        componentOption () {
            return {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    right: 10,
                    top: "middle",
                    icon: "circle",
                    itemWidth: 12,
                    itemGap: 24,
                    itemStyle: {
                        borderWidth: 0,
                    },
                    textStyle: {
                        color: "rgba(255, 255, 255, 0.60)",
                        fontSize: 12,
                    }
                },
                series: [
                    {
                        type: 'pie',
                        center: ["50%", "50%"],
                        radius: '70%',
                        data: [
                            { value: toFixedValue(this.energy.electricity, this.series["耗电总量"] ? this.series["耗电总量"].precision : 2), name: '电', itemStyle: { color: "#0052D9" } },
                            { value: toFixedValue(this.energy.gas, this.series["总能耗（天然气）"] ? this.series["总能耗（天然气）"].precision : 2), name: '天然气', itemStyle: { color: "#029CD4" }  },
                            { value: toFixedValue(this.energy.steam, this.series["总能耗（蒸汽）"] ? this.series["总能耗（蒸汽）"].precision : 2), name: '蒸汽', itemStyle: { color: "#2BA471" }  },
                            { value: toFixedValue(this.energy.water, this.series["总能耗（水）"] ? this.series["总能耗（水）"].precision : 2), name: '水', itemStyle: { color: "#F5BA18" }  }
                        ],
                        label: {
                            show: false
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
                    }
                ]
            }
        },
        facilityOption () {
            return {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    right: 10,
                    top: "middle",
                    icon: "circle",
                    itemWidth: 12,
                    itemGap: 24,
                    itemStyle: {
                        borderWidth: 0,
                    },
                    textStyle: {
                        color: "rgba(255, 255, 255, 0.60)",
                        fontSize: 12,
                    }
                },
                series: [
                    {
                        type: 'pie',
                        center: ["50%", "50%"],
                        radius: '70%',
                        data: [
                            { value: toFixedValue(this.energy.production, this.series["生产设备总能耗"] ? this.series["生产设备总能耗"].precision : 2), name: '生产设备', itemStyle: { color: "#0052D9" } },
                            { value: toFixedValue(this.energy.coolingStation, this.series["冷站总能耗"] ? this.series["冷站总能耗"].precision : 2), name: '冷站', itemStyle: { color: "#029CD4" }  },
                            { value: toFixedValue(this.energy.airCompression, this.series["空压站总能耗"] ? this.series["空压站总能耗"].precision : 2), name: '空压站', itemStyle: { color: "#2BA471" }  },
                            { value: toFixedValue(this.energy.heatSource, this.series["热源总能耗"] ? this.series["热源总能耗"].precision : 2), name: '热源', itemStyle: { color: "#F5BA18" }  }
                        ],
                        label: {
                            show: false
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
                    }
                ]
            }
        }
    },
    data () {
        return {
          series: {},
          energy: {
              curr: 0,
              reference: 0,
              electricity: 0,
              water: 0,
              gas: 0,
              steam: 0,
              production: 0,
              coolingStation: 0,
              airCompression: 0,
              heatSource: 0
          },
          meters: {
              electricity: [],
              water: [],
              gas: [],
              steam: [],
          }
        }
    },
    methods: {
        getSeries () {
            getTimeSeriesList("StationTop").then(result => {
                this.seriesMap = result.data.reduce((result, item) => {
                    result[item.name] = item
                    return result
                }, {})
            })
        },
        calculateReference(records) {
            let [startDate, endDate] = this.timeRange
            if (!endDate) {
                endDate = new Date()
            }
            if (!startDate) {
                startDate = new Date(endDate.getTime())
                startDate.setMonth(startDate.getMonth() - 1)
            }
            let daysOfYear = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            let monthMap = records.reduce((result, record) => {
                let time = new Date(record.time), year = time.getFullYear(), month = time.getMonth()
                let days = daysOfYear[month] + isLeapYear(year)
                result[time.format("yyyy-MM")] = {
                    value: parseFloat(record.value),
                    days
                }
                return result
            }, {})
            let i = new Date(startDate.getTime())
            let total = 0
            while (i <= endDate.getTime()) {
                let reference = monthMap[i.format("yyyy-MM")]
                if (reference) {
                    let unit, gap
                    if (i.format("yyyy-MM") === endDate.format("yyyy-MM")) {
                        unit = reference.value / reference.days
                        gap = i.getDate()
                    }
                    else {
                        unit = reference.value / reference.days
                        gap = reference.days - i.getDate() + 1
                    }
                    total += unit * gap
                }
                if (i.getDate() > 1) {
                    i.setDate(1)
                }
                i.setMonth(i.getMonth() + 1)
            }
            return total * 10000
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
            getSeriesHistoryValues("总场站", [
                "能耗指标"
            ]).then(result => {
                let records = result.data["能耗指标"] ? result.data["能耗指标"].values : []
                this.energy.reference = this.calculateReference(records)
            })
            getSeriesHistoryValues("总场站", [
                "总能耗", "能耗指标",
                "耗电总量", "用水总量", "用气总量", "蒸汽总用量",
                "总能耗（水）", "总能耗（天然气）", "总能耗（蒸汽）",
                "生产设备总能耗", "冷站总能耗", "空压站总能耗", "热源总能耗",
            ], {
                startAt: startDate,
                endAt: endDate
            }).then(result => {
                let records = result.data["总能耗"] ? result.data["总能耗"].values : []
                this.energy.curr = records.length <= 1 ? 0 : records[records.length - 1].value - records[0].value

                records = result.data["耗电总量"] ? result.data["耗电总量"].values : []
                this.energy.electricity = records.length <= 1 ? 0 : records[records.length - 1].value - records[0].value
                records = result.data["总能耗（水）"] ? result.data["总能耗（水）"].values : []
                this.energy.water = records.length <= 1 ? 0 : records[records.length - 1].value - records[0].value
                records = result.data["总能耗（天然气）"] ? result.data["总能耗（天然气）"].values : []
                this.energy.gas = records.length <= 1 ? 0 : records[records.length - 1].value - records[0].value
                records = result.data["总能耗（蒸汽）"] ? result.data["总能耗（蒸汽）"].values : []
                this.energy.steam = records.length <= 1 ? 0 : records[records.length - 1].value - records[0].value

                records = result.data["生产设备总能耗"] ? result.data["生产设备总能耗"].values : []
                this.energy.production = records.length <= 1 ? 0 : records[records.length - 1].value - records[0].value
                records = result.data["冷站总能耗"] ? result.data["冷站总能耗"].values : []
                this.energy.coolingStation = records.length <= 1 ? 0 : records[records.length - 1].value - records[0].value
                records = result.data["空压站总能耗"] ? result.data["空压站总能耗"].values : []
                this.energy.airCompression = records.length <= 1 ? 0 : records[records.length - 1].value - records[0].value
                records = result.data["热源总能耗"] ? result.data["热源总能耗"].values : []
                this.energy.heatSource = records.length <= 1 ? 0 : records[records.length - 1].value - records[0].value
            })
        }
    },
    created() {
        this.getSeries()
        this.refreshData()
    }
}
</script>

<style scoped>
  .chart-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
  }
</style>