<template>
  <v-chart
    style="height: 100%;width: 100%"
    :option="chartsOption"
    autoresize
  ></v-chart>
</template>

<script>
import EventBus from "@/utils/EventBus";
import config from "@/config";
import {
  getNodeDetail,
  getSeriesHistoryValues,
  getMultipleSeriesHistoryValues
} from "@/assets/js/api/hierarchy";


export default {
  name: "DailyOilProductionComparison",
  props:{
    time:{
      type:Object,
      default:()=>new Date()
    }
  },
  computed: {
    chartsOption() {
      return {
        title: {
          text: "kbbls",
          left: "-1%",
          textStyle: {
            fontWeight: "400",
            fontSize: 12,
            color: "rgba(255, 255, 255, 0.7)"
          }
        },
        textStyle: {
          fontSize: 12,
          color: "rgba(255,255,255,0.7)"
        },
        legend: {
          right: 0,
          itemGap: 24,
          icon: "rect",
          itemWidth: 9,
          itemHeight: 9,
          textStyle: {color: "rgba(255, 255, 255, 0.7)"},
          data: ["Target", "Actual"]
        },
        tooltip: {
          trigger: "axis",
          borderColor: "#3DE1EF",
          borderWidth: "0.5",
          backgroundColor: "#141B25",
          shadowBlur: "4",
          renderMode:'html',
          appendToBody:true,
          shadowColor: "rgba(61, 225, 239, 0.25)",
          icon: "rect",
          textStyle: {
            color: "#fff",
            fontFamily: "Inter",
            fontStyle: "normal",
            fontWeight: "400",
            fontSize:14
          },
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 28,
          containLabel: true
        },
        xAxis: {
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#1c232e'
            }
          },
          type: "category",
          boundaryGap: true,
          axisLabel: {
            // padding: [10, 10, 0, 0],
            // interval: 0, //设置全部显示
            rotate: 45,
            nameTextStyle: {
              color: "rgba(255,255,255,0.7)",
              // padding: [15, 40, 0, 10],
              nameLocation: "start"
            },
            textStyle: {
              fontSize: 12,
              color: "rgba(255,255,255,0.7)"
            }
          },
          data: this.xData
        },
        yAxis: {
          nameGap: "10",
          type: "value",
          nameTextStyle: {
            align: "right"
          },
          axisLabel: {
            fontSize: 12
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              dashOffset: 5,
              opacity: 0.1
            }
          }
        },
        series: [
          {
            name: "Target",
            type: "bar",
            barWidth: 6,
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              normal: {
                color: "#4FACFF"
              }
            },
            data: this.productionData.MajnoonTarget
          }, {
            name: "Actual",
            type: "bar",
            barWidth: 6,
            barGap: '50%',
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              normal: {
                color: "#F6E75A"
              }
            },
            data: this.productionData.ExportData
          }

        ]
      };
    }
  },
  data() {
    return {
      xData: [],
      productionData: {
        ExportData: [],
        CPF1Data: [],
        DS2Data: [],
        MajnoonTarget: [],
        MajnoonData: []
      },
      seriesData: {}
    };
  },
  methods:{
    convertData(series, value) {
      if (series.dataType === "Decimal") {
        return (
          parseFloat(parseFloat(value).toFixed(series.precision)) / 1000
        ).toFixed(2);
      }
      return (value / 1000).toFixed(3);
    },
    getData(time) {
      let endTime = time;
      let startTime = new Date(endTime.getFullYear(), endTime.getMonth(), endTime.getDate() - 14);
      Promise.all([
        getNodeDetail("DS1"),
        getNodeDetail("Majnoon"),
        //export 的数据
        getSeriesHistoryValues("DS1", ["Daily Oil Export"], {
          startAt: startTime,
          endAt: endTime
        }),
        getMultipleSeriesHistoryValues(
          ["Majnoon"],
          ["Production Target"],
          {
            startAt: startTime,
            endAt: endTime
          }
        )
      ]).then(([DS1, Majnoon, ExportHistory, OtherHistory]) => {
        this.seriesData.DS1Data = DS1.data.model.time_series.reduce(
          (result, item) => {
            result[item.name] = item;
            return result;
          },
          {}
        );
        this.seriesData.MajnoonData = Majnoon.data.model.time_series.reduce(
          (result, item) => {
            result[item.name] = item;
            return result;
          },
          {}
        );
        let dates = ExportHistory.data["Daily Oil Export"].values
          .concat(OtherHistory.data.Majnoon["Production Target"].values)
          .reduce((result, item) => {
            let date = new Date(item.time)
            result[date.format('yyyy-MM-dd')] = date
            return result
          }, {})
        dates = Object.values(dates)
        dates.sort((d1, d2) => d1 - d2)
        this.xData = dates.map(item => item.format('dd-MF'))
        dates = dates.reduce((result, date, index) => {
          result[date.format('dd-MF')] = index
          return result
        }, {})
        ExportHistory.data["Daily Oil Export"].values.reduce((result, item) => {
          let time = new Date(item.time).format('dd-MF')
          item.value = this.convertData(
            this.seriesData.DS1Data["Daily Oil Export"],
            item.value
          );
          this.productionData.ExportData[dates[time]] = item.value
        }, {});

        OtherHistory.data.Majnoon["Production Target"].values.reduce(
          (result, item) => {
            let time = new Date(item.time).format('dd-MF')
            item.value = this.convertData(
              this.seriesData.MajnoonData["Production Target"],
              item.value
            );
            this.productionData.MajnoonTarget[dates[time]] = item.value
          },
          {}
        )
      });
    },
  },
  created() {
    this.getData(config.general.date);
  },
  mounted () {
    EventBus.$on("date-updated", this.getData)
  }
}
</script>

<style scoped>

</style>
