<template>
  <v-chart
    :option="chartsOption"
    autoresize
    style="width:100%; height:100%"
  ></v-chart>
</template>

<script>

import EventBus from "@/utils/EventBus";
import config from "@/config";
import {
  getMultipleSeriesHistoryValues,
  getMultipleSeriesLatestValues,
  getNodeDetail,
  getNodesByModel,
  getSeriesHistoryValues
} from "@/assets/js/api/hierarchy";

export default {
  name: "OilQualityMonitoring",
  data() {
    return {
      xData: [],
      productionData: {
        H2SData:[],
        SaltData:[],
        BSWData:[]
      },
      seriesData: {}
    };
  },
  computed: {
    chartsOption() {
      return {
        legend: [
          {
            left:-3,
            itemGap: 24,
            icon: "rect", //  字段控制形状  类型包括 circle，rect,line，roundRect，triangle，diamond，pin，arrow(箭头)，none
            itemWidth: 9, // 设置宽度
            itemHeight: 9, // 设置高度
            textStyle: {
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: 12
            },
            data:["DS1 Export Salt(PTB)","H₂S(ppm)"]
          },
          {
            right: 0,
            icon: "rect",
            itemWidth:9,
            itemHeight: 2,
            textStyle: {
              color: "rgba(255, 255, 255, 0.7)",
              fontSize:12
            },
            data: ["WC(%)"]
          }
        ],
        tooltip:  {
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
          right: 3,
          bottom: 0,
          top: 30,
          containLabel: true
        },
        textStyle: {
          fontSize: 12,
          color: "rgba(255,255,255,0.7)"
        },
        xAxis: {
          axisLine: {
            lineStyle: {
              color: '#1c232e'
            }
          },
          axisTick: {
            show: false
          },
          type: "category",
          boundaryGap: true,
          axisLabel: {
            rotate: 45,
            textStyle: {
              fontSize: 12,
              color: "rgba(255,255,255,0.7)"
            }
          },
          data: this.xData
        },
        yAxis: [
          {
            axisLabel: {
              textStyle: {
                fontSize:12,
                color: "rgba(255,255,255,0.7)"
              }
            },
            type: "value",
            splitLine: {
              lineStyle: {
                type: "dashed",
                dashOffset: 5,
                opacity: 0.1
              }
            }
            // splitLine: {
            //   show: true,
            //
            //   lineStyle: {
            //     type: "dashed",
            //     opacity: 0.1,
            //     width: 1,
            //     length: 10,
            //     distance: 6,
            //     fontStyle: "italic"
            //   }
            // }
          },
          {
            axisLabel: {
              textStyle: {
                fontSize: 12,
                color: "rgba(255,255,255,0.7)"
              }
            },
            type: "value",
            nameTextStyle: {
              padding: [0, -20, 0, 0]
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
                dashOffset: 5,
                opacity: 0
              }
            },
            // splitLine: {
            //   show: true,
            //   lineStyle: {
            //     type: "dashed",
            //     opacity: 0.1,
            //     width: 1,
            //     length: 10,
            //     distance: 6,
            //     fontStyle: "italic"
            //   }
            // },
            axisLine: {
              show: false
            }
          }
        ],
        color:["#4FACFF","#F6E75A","#F65A5A"],
        series: [
          {
            name: "DS1 Export Salt(PTB)",
            type: "bar",
            emphasis: {
              focus: "series"
            },
            yAxisIndex:0,
            barWidth: 10,
            tooltip: {
              valueFormatter: function (value) {
                return value + ' PTB';
              }
            },
            itemStyle: {
              // borderRadius:[20,20,0,0],
              // normal: {
              //   color: "#3695ff"
              // }
            },
            data: this.productionData.SaltData
          },
          {
            name: "H₂S(ppm)",
            type: "bar",
            emphasis: {
              focus: "series"
            },
            yAxisIndex:0,
            barWidth: 10,
            barGap: '50%',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' ppm';
              }
            },
            itemStyle: {
              // borderRadius:[20,20,0,0],
              // normal: {
              //   color: "#F6E75A"
              // }
            },
            data: this.productionData.H2SData
          },
          {
            name: "WC(%)",
            type: "line",
            yAxisIndex: 1,
            symbol: "none", //去掉折线上面的点
            emphasis: {
              focus: "series"
            },
            tooltip: {
              valueFormatter: function (value) {
                return value + ' %';
              }
            },
            itemStyle: {
              // normal: {
              //   color: "#F65A5A"
              // }
            },
            data: this.productionData.BSWData
          }
        ]
      };
    }
  },
  created() {
    this.getData(config.general.date);
  },
  mounted() {
    EventBus.$on("date-updated", this.getData)
  },
  methods: {
    convertData(series, value) {
      if (series.dataType === "Decimal") {
        return parseFloat(parseFloat(value).toFixed(series.precision));
      }
      return value;
    },
    getData(time) {
      let endTime = time;
      let startTime = new Date(endTime.getFullYear(), endTime.getMonth(), endTime.getDate()-14);
      Promise.all([
        getNodeDetail("DS1"),
        getNodeDetail("Majnoon"),
        getMultipleSeriesHistoryValues(
          ["DS1"],
          ["H₂S in Oil Export", "Salt in Oil Export"],
          {
            startAt: startTime,
            endAt: endTime
          }),
        getMultipleSeriesHistoryValues(
          ["Majnoon"],
          ["Total BSW Production"],
          {
            startAt: startTime,
            endAt: endTime
          }
        )
      ]).then(([DS1,Majnoon,DS1History, MajnoonHistory]) => {
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
        let dates = DS1History.data.DS1["H₂S in Oil Export"].values
          .concat(DS1History.data.DS1["Salt in Oil Export"].values)
          .concat(MajnoonHistory.data.Majnoon["Total BSW Production"].values)
          .reduce((result, item) => {
            let date = new Date(item.time)
            result[date.format('dd-MF')] = date
            return result
          }, {})
        dates = Object.values(dates)
        dates.sort((d1, d2) => d1 - d2)
        this.xData = dates.map(item => item.format('dd-MF'))
        dates = dates.reduce((result, date, index) => {
          result[date.format('dd-MF')] = index
          return result
        }, {})

        DS1History.data.DS1["H₂S in Oil Export"].values.reduce((result, item) => {
          let time = new Date(item.time).format('dd-MF')
          item.value = this.convertData(
            this.seriesData.DS1Data["H₂S in Oil Export"],
            item.value
          );
          this.productionData.H2SData[dates[time]] = item.value
        }, {});
        DS1History.data.DS1["Salt in Oil Export"].values.reduce((result, item) => {
          let time = new Date(item.time).format('dd-MF')
          item.value = this.convertData(
            this.seriesData.DS1Data["Salt in Oil Export"],
            item.value
          );
          this.productionData.SaltData[dates[time]] = item.value
        }, {});
        MajnoonHistory.data.Majnoon["Total BSW Production"].values.reduce((result, item) => {
          let time = new Date(item.time).format('dd-MF')
          item.value = this.convertData(
            this.seriesData.MajnoonData["Total BSW Production"],
            item.value
          );
          this.productionData.BSWData[dates[time]] = item.value
        }, {});

      });
    },
  }
};
</script>

<style scoped>
</style>
