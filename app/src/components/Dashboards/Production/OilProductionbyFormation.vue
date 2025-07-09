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
  getSeriesHistoryValues, getNodeChildren,
  getMultipleSeriesHistoryValues
} from "@/assets/js/api/hierarchy";
import {getNodesByModel} from "@/assets/js/api/hierarchy";

export default {
  name: "OilProductionByFormation",
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
          top: 32,
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
          axisTick: {
            show: false
          },
          axisLabel: {
            fontSize: 12,
          },
          data: this.xData
        },
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
            type: 'scroll',
            right: 0,
            width: '80%',
            orient: 'horizontal',
            itemGap: 24,
            icon: "rect", //  字段控制形状  类型包括 circle，rect,line，roundRect，triangle，diamond，pin，arrow(箭头)，none
            itemWidth: 9, // 设置宽度
            itemHeight: 9, // 设置高度
            textStyle: {
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: 12
            },
            pageFormatter: ' ',
            pageIconSize: 12,
            pageButtonItemGap: 0,
            pageIconColor: 'rgba(255, 255, 255, 0.7)',
            pageIconInactiveColor: 'rgba(255, 255, 255, 0.7)',

          }]
        ,
        color: ["#4FACFF", "#45E09F", "#F6E75A", "#F8A151", "#F65A5A"],
        series: [
          {
            type: "line",
            areaStyle: {
              color:{
                type: 'linear',
                x: 0,
                y: 0.2,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#4FACFF' // 0% 处的颜色
                }, {
                  offset: 1, color: '#000000' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              },
              opacity: 0.5
            },
            tooltip: {
              valueFormatter: function (value) {
                return value + ' kbbls';
              }
            },
            name: "Mishrif",
            stack: 'Total',
            emphasis: {
              focus: "series"
            },
            // lineStyle: {
            //   width: 0
            // },
            symbol: 'none',

            data: this.productionData.Mishrif
          },
          {
            type: "line",
            areaStyle: {
              color:{
                type: 'linear',
                x: 0,
                y: 0.2,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color:  "#45E09F" // 0% 处的颜色
                }, {
                  offset: 1, color: '#000000' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              },
              opacity: 0.5
            },
            tooltip: {
              valueFormatter: function (value) {
                return value + ' kbbls';
              }
            },
            symbol: 'none',
            name: "Zubair",
            stack: 'Total',
            // lineStyle: {
            //   width: 0
            // },
            emphasis: {
              focus: "series"
            },
            data: this.productionData.Zubair
          }, {
            type: "line",
            areaStyle: {
              color:{
                type: 'linear',
                x: 0,
                y: 0.2,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color:  "#F6E75A" // 0% 处的颜色
                }, {
                  offset: 1, color: '#000000' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              },
              opacity: 0.5
            },
            tooltip: {
              valueFormatter: function (value) {
                return value + ' kbbls';
              }
            },
            symbol: 'none',
            name: "Hartha",
            stack: 'Total',
            // lineStyle: {
            //   width: 0
            // },
            emphasis: {
              focus: "series"
            },
            data: this.productionData.Hartha
          }, {
            type: "line",
            areaStyle: {
              color:{
                type: 'linear',
                x: 0,
                y: 0.2,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color:  "#F8A151"// 0% 处的颜色
                }, {
                  offset: 1, color: '#000000' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              },
              opacity: 0.5
            },
            tooltip: {
              valueFormatter: function (value) {
                return value + ' kbbls';
              }
            },
            symbol: 'none',
            name: "Nahr Umr",
            stack: 'Total',
            // lineStyle: {
            //   width: 0
            // },
            emphasis: {
              focus: "series"
            },
            data: this.productionData["Nahr Umr"]
          }, {
            type: "line",
            symbol: 'none',
            areaStyle: {
              color:{
                type: 'linear',
                x: 0,
                y: 0.2,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color:  "#F65A5A" // 0% 处的颜色
                }, {
                  offset: 1, color: '#000000' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              },
              opacity: 0.5
            },
            tooltip: {
              valueFormatter: function (value) {
                return value + ' kbbls';
              }
            },
            name: "Ahmadi",
            stack: 'Total',
            // lineStyle: {
            //   width: 0
            // },
            emphasis: {
              focus: "series"
            },
            data: this.productionData.Ahmadi
          },
        ]
      };
    },
  },
  data() {
    return {
      xData: [],
      productionData: {
        Ahmadi: [],
        Hartha: [],
        Mishrif: [],
        "Nahr Umr": [],
        Zubair: []
      },
      seriesData: {}
    };
  },
  methods: {
    convertData(series, value) {
      if (series.dataType === "Decimal") {
        return parseFloat((parseFloat(value)/1000).toFixed(series.precision));
      }
      return value;
    },
    getData(time) {
      let endTime = time;
      let startTime = new Date(endTime.getFullYear() - 1, endTime.getMonth(), endTime.getDate());

      getNodesByModel(["Reservoir"]).then(res => {
        let Names = res.data.map(item => item.instanceId);
        Promise.all([getNodeDetail(Names[0]), getMultipleSeriesHistoryValues(
          Names,
          ["Monthly Oil Production"],
          {
            aggregation: "month",
            method: "latest",
            startAt: startTime,
            endAt: endTime
          }
        )]).then(([detail,formation]) => {
          this.seriesData.limit = detail.data.model.time_series.reduce(
            (result, item) => {
              result[item.name] = item;
              return result;
            },
            {}
          );

          let dates = []
          for (let i in formation.data) {
            dates = dates.concat(formation.data[i]["Monthly Oil Production"].values)
          }
          dates = dates.reduce((result, item) => {
            let date = new Date(item.time)
            result[date.format('yyyy-MM-dd')] = date
            return result
          }, {})

          dates = Object.values(dates)
          dates.sort((d1, d2) => d1 - d2)

          this.xData = dates.map(item => item.format('MF'))
          dates = dates.reduce((result, date, index) => {
            result[date.format('MF')] = index
            return result
          }, {})
          let data = formation.data
          for (let key in data) {
            data[key]["Monthly Oil Production"].values.map((item) => {
              let time = new Date(item.time).format('MF')
              item.value = this.convertData(this.seriesData.limit["Monthly Oil Production"], item.value);
              this.productionData[key][dates[time]] = item.value
            }, {});
          }

        })
      });
    },
  },
  created() {
    this.getData(config.general.date);
  },
  mounted () {
    EventBus.$on("date-updated", this.getData)
  }
};
</script>

<style scoped></style>
