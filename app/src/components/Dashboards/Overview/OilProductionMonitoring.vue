<template>
    <v-chart
      style="height: 100%;width: 100%"
      :option="chartsOption"
      autoresize
    ></v-chart>
</template>

<script>
import EventBus from "@/utils/EventBus";
import config from "@/config"
import {
  getNodeDetail,
  getSeriesHistoryValues,
  getMultipleSeriesHistoryValues
} from "@/assets/js/api/hierarchy";

export default {
  name: "OilProductionMonitoring",
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
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 30,
          containLabel: true
        },
        textStyle: {
          color: "rgba(255, 255, 255, 0.7)"
        },
        xAxis: {
          axisLine: {
            lineStyle: {
              color: '#1c232e'
            }
          },
          type: "category",
          nameRotate: 45,
          axisTick: {
            show: false
          },
          axisLabel: {
            fontSize: 12,
          },
          data: this.xData
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
        yAxis: {
          nameGap: "10",
          type: "value",
          nameTextStyle: {
            align: "right"
          },
          axisLabel: {
            fontSize: 12,
            fontFamily: "Harmony OS Sans"
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              dashOffset: 5,
              opacity: 0.1
            }
          }
        },
        legend: [
          {
            right: 75,

            itemGap: 24,
            icon: "rect", //  字段控制形状  类型包括 circle，rect,line，roundRect，triangle，diamond，pin，arrow(箭头)，none
            itemWidth: 9, // 设置宽度
            itemHeight: 9, // 设置高度
            textStyle: {
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: 12
            },
            data: ["CPF1", "DS2"]
          },
          {
            right: 0,
            icon: "rect",
            itemWidth: 9,
            itemHeight: 2,
            textStyle: {
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: 12
            },
            data: ["Export"]
          }
        ],
        series: [
          {
            type: "bar",
            name: "CPF1",
            stack: 1,
            barWidth: 10,
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              normal: {
                color: "#4FACFF"
              }
            },
            data: this.productionData.CPF1Data
          },
          {
            type: "bar",
            name: "DS2",
            stack: 1,
            barWidth: 10,
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              normal: {
                color: "#F6E75A"
              }
            },
            data: this.productionData.DS2Data
          },
          {
            type: "line",
            name: "Export",
            symbol: "none",
            emphasis: {
              focus: "series"
            },
            lineStyle: {
              width: 2
            },
            itemStyle: {
              normal: {
                color: "#F65A5A"
              }
            },
            data: this.productionData.ExportData
          }
        ]
      };
    },
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
      let endTime =time;
      let startTime = new Date(endTime.getFullYear(), endTime.getMonth(), endTime.getDate() - 14);
      Promise.all([
        getNodeDetail("DS1"),
        getNodeDetail("DS2"),
        getNodeDetail("CPF1"),
        getNodeDetail("Majnoon"),
        //export 的数据
        getSeriesHistoryValues("DS1", ["Daily Oil Export"], {
          startAt: startTime,
          endAt: endTime
        }),
        getMultipleSeriesHistoryValues(
          ["DS2", "CPF1", "Majnoon"],
          ["Total Oil Production", "Production Target"],
          {
            startAt: startTime,
            endAt: endTime
          }
        )
      ]).then(([DS1, DS2, CPF1, Majnoon, ExportHistory, OtherHistory]) => {
        this.seriesData.DS1Data = DS1.data.model.time_series.reduce(
          (result, item) => {
            result[item.name] = item;
            return result;
          },
          {}
        );
        this.seriesData.DS2Data = DS2.data.model.time_series.reduce(
          (result, item) => {
            result[item.name] = item;
            return result;
          },
          {}
        );
        this.seriesData.CPF1Data = CPF1.data.model.time_series.reduce(
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
          .concat(OtherHistory.data.CPF1["Total Oil Production"].values)
          .concat(OtherHistory.data.DS2["Total Oil Production"].values)
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
        OtherHistory.data.CPF1["Total Oil Production"].values.reduce(
          (result, item) => {
            item.value = this.convertData(
              this.seriesData.CPF1Data["Total Oil Production"],
              item.value
            );
            let time = new Date(item.time).format('dd-MF')
            this.productionData.CPF1Data[dates[time]] = item.value
          },
          {}
        );
        OtherHistory.data.DS2["Total Oil Production"].values.reduce(
          (result, item) => {
            let time = new Date(item.time).format('dd-MF')
            item.value = this.convertData(
              this.seriesData.DS2Data["Total Oil Production"],
              item.value
            );
            this.productionData.DS2Data[dates[time]] = item.value
          },
          {}
        );
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
  mounted() {
    EventBus.$on("date-updated", this.getData)
  }
};
</script>

<style scoped>

</style>
