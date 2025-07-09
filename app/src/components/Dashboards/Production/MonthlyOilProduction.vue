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
        legend:[
          {
            type:'scroll',
            right: 0,
            width:'80%',
            orient:'horizontal',
            itemGap: 24,
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
            data:["Production(Allocated)","Curtailment", {
              name:"IPSC",
              icon:''
            },"Scheduled Deferment","Uncheduled Deferment"]
          }]
        ,
        color:["#4FACFF","#F6E75A","#45E09F","#4FE8D5","#967FF3"],
        series: [
          {
            type: "bar",
            name: "Production(Allocated)",
            stack: 1,
            barWidth: 10,
            emphasis: {
              focus: "series"
            },
            tooltip: {
              valueFormatter: function (value) {
                return value + ' kbbls';
              }
            },
            itemStyle: {
            },
            data: this.productionData.ProductionData
          },
          {
            type: "bar",
            name: "Curtailment",
            stack: 1,
            barWidth: 10,
            emphasis: {
              focus: "series"
            },
            tooltip: {
              valueFormatter: function (value) {
                return value + ' kbbls';
              }
            },
            itemStyle: {
            },
            data: this.productionData.CurtailmentData
          },{
            type: "line",
            name: "IPSC",
            // stack: 1,
            barWidth: 10,
            symbol: "none",
            itemStyle: {
            },
            tooltip: {
              valueFormatter: function (value) {
                return value + ' kbbls';
              }
            },
            emphasis: {
              focus: "series"
            },
            data: this.productionData.IPSCData
          },{
            type: "bar",
            name: "Scheduled Deferment",
            stack: 1,
            barWidth: 10,
            itemStyle: {
            },
            tooltip: {
              valueFormatter: function (value) {
                return value + ' kbbls';
              }
            },
            emphasis: {
              focus: "series"
            },
            data: this.productionData.ScheduledData
          },{
            type: "bar",
            name: "Uncheduled Deferment",
            stack: 1,
            barWidth: 6,
            itemStyle: {
            },
            tooltip: {
              valueFormatter: function (value) {
                return value + ' kbbls';
              }
            },
            emphasis: {
              focus: "series"
            },
            data: this.productionData.UnscheduledData
          },
        ]
      };
    },
  },
  data() {
    return {
      xData: [],
      productionData: {
        CurtailmentData: [],
        ProductionData:[],
        IPSCData:[],
        ScheduledData:[],
        UnscheduledData:[]
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
          ["Monthly Curtailment", "Monthly Production(Allocated)","Monthly IPSC","Monthly Scheduled Deferment","Monthly Unscheduled Deferment"],
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
        let dates = MajnoonHistory.data.Majnoon["Monthly Curtailment"].values
          .concat(MajnoonHistory.data.Majnoon["Monthly Production(Allocated)"].values)
          .concat(MajnoonHistory.data.Majnoon["Monthly IPSC"].values)
          .concat(MajnoonHistory.data.Majnoon["Monthly Scheduled Deferment"].values)
          .concat(MajnoonHistory.data.Majnoon["Monthly Unscheduled Deferment"].values)
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
        MajnoonHistory.data.Majnoon["Monthly Curtailment"].values.reduce((result, item) => {
          let time = new Date(item.time).format('yyyy-MM')
          item.value = this.convertData(
            this.seriesData.MajnoonData["Monthly Curtailment"],
            item.value
          );
          this.productionData.CurtailmentData[dates[time]] = item.value
        }, {});
        MajnoonHistory.data.Majnoon["Monthly Production(Allocated)"].values.reduce(
          (result, item) => {
            item.value = this.convertData(
              this.seriesData.MajnoonData["Monthly Production(Allocated)"],
              item.value
            );
            let time = new Date(item.time).format('yyyy-MM')
            this.productionData.ProductionData[dates[time]] = item.value
          },
          {}
        );
        MajnoonHistory.data.Majnoon["Monthly IPSC"].values.reduce(
          (result, item) => {
            let time = new Date(item.time).format('yyyy-MM')
            item.value = this.convertData(
              this.seriesData.MajnoonData["Monthly IPSC"],
              item.value
            );
            this.productionData.IPSCData[dates[time]] = item.value
          },
          {}
        );
        MajnoonHistory.data.Majnoon["Monthly Scheduled Deferment"].values.reduce(
          (result, item) => {
            let time = new Date(item.time).format('yyyy-MM')
            item.value = this.convertData(
              this.seriesData.MajnoonData["Monthly Scheduled Deferment"],
              item.value
            );
            this.productionData.ScheduledData[dates[time]] = item.value
          },
          {}
        )
        MajnoonHistory.data.Majnoon["Monthly Unscheduled Deferment"].values.reduce(
          (result, item) => {
            let time = new Date(item.time).format('yyyy-MM')
            item.value = this.convertData(
              this.seriesData.MajnoonData["Monthly Unscheduled Deferment"],
              item.value
            );
            this.productionData.UnscheduledData[dates[time]] = item.value
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

<style scoped></style>
