<template>
  <v-chart
    style="height: 100%;width: 100%"
    :option="chartsOption"
    autoresize
  ></v-chart>
</template>

<script>
import config from "@/config";
import {
  getNodeDetail,
  getSeriesHistoryValues,
  getMultipleSeriesHistoryValues
} from "@/assets/js/api/hierarchy";

export default {
  name: "TLLOneYear",
  computed: {
    chartsOption() {
      return {
        title: {
          text: "",
          left: "-1%",
          textStyle: {
            fontWeight: "400",
            fontSize: this.getRelativeSize(12),
            color: "rgba(255, 255, 255, 0.7)"
          }
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: this.getRelativeSize(32),
          containLabel: true
        },
        textStyle: {
          color: "rgba(255, 255, 255, 0.7)"
        },
        xAxis: {
          type: "category",
          nameRotate: 45,
          axisTick: {
            show: false
          },
          axisLine:{
            lineStyle:{
              type:'solid',
              color:'rgba(255, 255, 255, 0.1)',
              width: 0.5
            }
          },
          axisLabel: {
            rotate: 45,
            fontSize: this.getRelativeSize(12),
          },
          data: this.xData
        },
        tooltip: {
          trigger: "axis",
          borderColor: "#3795FF99",
          borderWidth: "0.5",
          backgroundColor: "#0A1A2D",
          shadowBlur: "18",
          shadowColor: "rgba(54, 149, 255, 0.4)",
          icon: "rect",
          textStyle: {
            color: "#fff",
            fontFamily: "Harmony OS Sans",
            fontStyle: "normal",
            fontWeight: "400",
            fontSize: this.getRelativeSize(14),

          },
          confine: "true"
        },
        yAxis: {
          nameGap: "10",
          type: "value",
          nameTextStyle: {
            align: "right"
          },
          axisLabel: {
            fontSize: this.getRelativeSize(12),
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
        legend:
          {
            type:'scroll',
            right: 0,
            width:'80%',
            orient:'horizontal',
            itemGap: this.getRelativeSize(24),
            icon: "rect", //  字段控制形状  类型包括 circle，rect,line，roundRect，triangle，diamond，pin，arrow(箭头)，none
            itemWidth: this.getRelativeSize(9), // 设置宽度
            itemHeight: this.getRelativeSize(9), // 设置高度
            textStyle: {
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: this.getRelativeSize(12)
            },
            pageFormatter:' ',
            pageIconSize:this.getRelativeSize(12),
            pageButtonItemGap:0,
            pageIconColor:'rgba(255, 255, 255, 0.7)',
            pageIconInactiveColor:'rgba(255, 255, 255, 0.7)',

          }
        ,
        series: [
          {
            type: "bar",
            name: "TRCF",
            stack: 1,
            barWidth: this.getRelativeSize(12),
            itemStyle: {
              normal: {
                color: "#3695ff"
              }
            },
            emphasis: {
              focus: "series"
            },
            data: this.productionData.TRCFData
          },
          {
            type: "bar",
            name: "LTIF",
            stack: 1,
            barWidth: this.getRelativeSize(12),
            itemStyle: {
              normal: {
                color: "#a5c9ff"
              }
            },
            emphasis: {
              focus: "series"
            },
            data: this.productionData.LTIFData
          },
        ]
      };
    },
  },
  data() {
    return {
      xData: [],
      productionData: {
        LTIFData: [],
        TRCFData:[],
      },
      width: document.documentElement.clientWidth,
      basicWidth: config.viewport.basicWidth,
      seriesData: {}
    };
  },
  methods: {
    getRelativeSize(originalSize) {
      return (originalSize * this.width) / this.basicWidth;
    },
    convertData(series, value) {
      if (series.dataType === "Decimal") {
        return parseFloat(parseFloat(value).toFixed(series.precision));
      }
      return value;
    },
    getData() {
      let endTime = new Date();
      let startTime = new Date(endTime.getFullYear()-1, endTime.getMonth(), endTime.getDate());
      Promise.all([
        getNodeDetail("Majnoon"),
        getMultipleSeriesHistoryValues(
          ["Majnoon"],
          [ "Total Recordable Frequency Rate","Total Lost Time Injury Frequency Rate"],
          {
            startAt: startTime,
            endAt: endTime
          }
        )
      ]).then(([Majnoon, MajnoonHistory]) => {
        this.seriesData.MajnoonData = Majnoon.data.model.time_series.reduce(
          (result, item) => {
            result[item.name] = item;
            return result;
          },
          {}
        );
        let dates = MajnoonHistory.data.Majnoon["Total Recordable Frequency Rate"].values
          .concat(MajnoonHistory.data.Majnoon["Total Lost Time Injury Frequency Rate"].values)
          .reduce((result, item) => {
            let date = new Date(item.time)
            result[date.format('yyyy-MM-dd')] = date
            return result
          }, {})
        dates = Object.values(dates)
        dates.sort((d1, d2) => d1 - d2)
        this.xData = dates.map(item => item.format('yyyy-MM'))
        dates = dates.reduce((result, date, index) => {
          result[date.format('yyyy-MM')] = index
          return result
        }, {})

        MajnoonHistory.data.Majnoon["Total Recordable Frequency Rate"].values.reduce((result, item) => {
          let time = new Date(item.time).format('yyyy-MM')
          item.value = this.convertData(
            this.seriesData.MajnoonData["Total Recordable Frequency Rate"],
            item.value
          );
          this.productionData.TRCFData[dates[time]] = item.value
        }, {});
        MajnoonHistory.data.Majnoon["Total Lost Time Injury Frequency Rate"].values.reduce(
          (result, item) => {
            item.value = this.convertData(
              this.seriesData.MajnoonData["Total Lost Time Injury Frequency Rate"],
              item.value
            );
            let time = new Date(item.time).format('yyyy-MM')
            this.productionData.LTIFData[dates[time]] = item.value
          },
          {}
        );

      });
    },
    watchWindowSize() {
      this.width = document.documentElement.clientWidth;
    }
  },
  created() {
    window.addEventListener("resize", this.watchWindowSize);
    this.getData();
  }
};
</script>

<style scoped></style>
