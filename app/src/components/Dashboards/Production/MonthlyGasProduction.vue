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
  name: "OilProductionMonitoring",
  computed: {
    chartsOption() {
      return {
        title: {
          text: "MMscf",
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
            rotate: 45,
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
        legend:
          {
            type:'scroll',
            right: 0,
            itemGap: 24,
            width:'80%',
            icon: "rect", //  字段控制形状  类型包括 circle，rect,line，roundRect，triangle，diamond，pin，arrow(箭头)，none
            itemWidth: 9, // 设置宽度
            itemHeight: 9, // 设置高度
            textStyle: {
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: 12
            },
            pageFormatter:' ',
            pageIconSize:12,
            pageButtonItemGap:0,
            pageIconColor:'rgba(255, 255, 255, 0.7)',
            pageIconInactiveColor:'rgba(255, 255, 255, 0.7)',
          },
        color:['#4FACFF',"#F6E75A","#45E09F","#F8A151"],
        series: [
          {
            type: "bar",
            name: "Gas Export",
            stack: 1,
            barWidth: 10,
            tooltip: {
              valueFormatter: function (value) {
                return value + ' MMscf';
              }
            },
            emphasis: {
              focus: "series"
            },
            itemStyle: {
              // borderRadius:10
            },
            data: this.productionData.ExportData
          },
          {
            type: "bar",
            name: "Flared Sour Gas",
            stack: 1,
            barWidth: 10,
            emphasis: {
              focus: "series"
            },
            tooltip: {
              valueFormatter: function (value) {
                return value + ' MMscf';
              }
            },
            itemStyle: {
              // borderRadius:10
            },
            data: this.productionData.SourData
          },{
            type: "bar",
            name: "Flared Sweet Gas",
            stack: 1,
            barWidth: 10,
            emphasis: {
              focus: "series"
            },
            tooltip: {
              valueFormatter: function (value) {
                return value + ' MMscf';
              }
            },
            itemStyle: {
              // borderRadius:10
            },
            data: this.productionData.SweetData
          },{
            type: "bar",
            name: "Fuel Gas",
            stack: 1,
            barWidth: 10,
            emphasis: {
              focus: "series"
            },
            tooltip: {
              valueFormatter: function (value) {
                return value + ' MMscf';
              }
            },
            itemStyle: {
              // borderRadius:10
            },
            data: this.productionData.FuelData
          },
        ]
      };
    },
  },
  data() {
    return {
      xData: [],
      productionData: {
        ExportData:[],
        SweetData:[],
        SourData:[],
        FuelData:[]
      },
      seriesData: {}
    };
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
      let startTime = new Date(endTime.getFullYear()-1, endTime.getMonth(), endTime.getDate());
      Promise.all([
        getNodeDetail("Majnoon"),
        getMultipleSeriesHistoryValues(
          ["Majnoon"],
          ["Monthly Gas Export", "Monthly Flared Sour Gas", "Monthly Flared Sweet Gas","Monthly Fuel Gas"],
          {
            startAt: startTime,
            endAt: endTime
          }
        )
      ]).then(([ Majnoon, MajnoonHistory]) => {
        this.seriesData.MajnoonData = Majnoon.data.model.time_series.reduce(
          (result, item) => {
            result[item.name] = item;
            return result;
          },
          {}
        );
        let dates = MajnoonHistory.data.Majnoon["Monthly Gas Export"].values
          .concat(MajnoonHistory.data.Majnoon["Monthly Flared Sour Gas"].values)
          .concat(MajnoonHistory.data.Majnoon["Monthly Flared Sweet Gas"].values)
          .concat(MajnoonHistory.data.Majnoon["Monthly Fuel Gas"].values)
          .reduce((result, item) => {
            let date = new Date(item.time)
            result[date.format('yyyy-MM')] = date
            return result
          }, {})
        dates = Object.values(dates)
        dates.sort((d1, d2) => d1 - d2)
        this.xData = dates.map(item => item.format('yyyy-MM'))
        dates = dates.reduce((result, date, index) => {
          result[date.format('yyyy-MM')] = index
          return result
        }, {})

        MajnoonHistory.data.Majnoon["Monthly Gas Export"].values.reduce((result, item) => {
          let time = new Date(item.time).format('yyyy-MM')
          item.value = this.convertData(
            this.seriesData.MajnoonData["Monthly Gas Export"],
            item.value
          );
          this.productionData.ExportData[dates[time]] = item.value
        }, {});
        MajnoonHistory.data.Majnoon["Monthly Flared Sour Gas"].values.reduce((result, item) => {
          let time = new Date(item.time).format('yyyy-MM')
          item.value = this.convertData(
            this.seriesData.MajnoonData["Monthly Flared Sour Gas"],
            item.value
          );
          this.productionData.SourData[dates[time]] = item.value
        }, {});
        MajnoonHistory.data.Majnoon["Monthly Flared Sweet Gas"].values.reduce((result, item) => {
          let time = new Date(item.time).format('yyyy-MM')
          item.value = this.convertData(
            this.seriesData.MajnoonData["Monthly Flared Sweet Gas"],
            item.value
          );
          this.productionData.SweetData[dates[time]] = item.value
        }, {});
        MajnoonHistory.data.Majnoon["Monthly Fuel Gas"].values.reduce((result, item) => {
          let time = new Date(item.time).format('yyyy-MM')
          item.value = this.convertData(
            this.seriesData.MajnoonData["Monthly Fuel Gas"],
            item.value
          );
          this.productionData.FuelData[dates[time]] = item.value
        }, {});
      });
    },
  },
  created() {
    this.getData(config.general.date);
  },
  mounted() {
    EventBus.$on("date-updated", this.getData)
  },
};
</script>

<style scoped></style>
