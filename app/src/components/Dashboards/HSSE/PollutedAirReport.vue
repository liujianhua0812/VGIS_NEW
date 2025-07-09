<template>
  <div class="full-h" style="display: flex">
    <v-chart
      style="height: 100%;width: 100%"
      :option="chartsOption"
      autoresize
    ></v-chart>
  </div>
</template>

<script>
import config from "@/config";
import {
  getNodeDetail,
  getTableRecords,
  getSeriesHistoryValues,
  getMultipleSeriesHistoryValues
} from "@/assets/js/api/hierarchy";

export default {
  name: "PollutedAirReport",
  computed: {
    chartsOption() {
      return {
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
            fontFamily: "HarmonyOS_Sans"
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
            width: '90%',
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

          }],
        series: [
          {
            type: "bar",
            name: "CPF-1 Flared Gas",
            itemStyle: {
              normal: {
                color: "#4FACFF"
              }
            },
            barGap:1,
            stack: 1,
            barWidth: 20,
            emphasis: {
              focus: "series"
            },
            data: this.yData.cpfMonthly
          },

          {
            type: "bar",
            name: "CPF-1 Produced Gas",
            stack: 1,
            barWidth: 20,
            barGap:1,
            itemStyle: {
              normal: {
                color: "#F6E75A"
              }
            },
            emphasis: {
              focus: "series"
            },
            data: this.yData.cpfProducedMonthly
          },
          {
            type: "bar",
            name: "DS-2 Flared Gas",
            stack: 2,
            barWidth: 20,
            barGap:1,
            itemStyle: {
              normal: {
                color: "#967FF3"
              }
            },
            emphasis: {
              focus: "series"
            },
            data: this.yData.dsMonthly
          },
          {
            type: "bar",
            name: "DS-2 Produced Gas",
            stack: 2,
            barWidth: 20,
            barGap:1,
            itemStyle: {
              normal: {
                color: "#F8A151"
              }
            },
            emphasis: {
              focus: "series"
            },
            data: this.yData.dsProducedMonthly
          },
          {
            type: "line",
            symbol: "none",
            name: "FCP Sweet Gas Train 1 Processed Gas",
            itemStyle: {
              normal: {
                color: "#F65A5A"
              }
            },
            emphasis: {
              focus: "series"
            },
            data: this.yData.Train1
          },
          {
            type: "line",
            symbol: "none",
            name: "FCP Sweet Gas Train 2 Processed Gas",
            itemStyle: {
              normal: {
                color: "#45E09F"
              }
            },
            emphasis: {
              focus: "series"
            },
            data: this.yData.Train2
          },
        ]
      };
    },
  },
  props:{
    time:{
      type:Object,
      default:()=>new Date()
    }
  },
  watch:{
    time:{
      handler(newVal){
        this.getData(newVal)
      }
    }
  },
  data() {
    return {
      xData: [],
      seriesData: {},
      yData: {
        cpfMonthly: [],
        cpfProducedMonthly:[],
        dsMonthly: [],
        dsProducedMonthly:[],
        Train1:[],
        Train2:[],
      }
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
      let today = time
      let timeStart = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
      Promise.all([
        getNodeDetail("DS2"),
        getNodeDetail("CPF1"),
        getMultipleSeriesHistoryValues(
          ["DS2", "CPF1"],
          ["Monthly Flared Gas", "Monthly Gas Production", 'FCP Sweet Gas Train 1 Processed Gas', 'FCP Sweet Gas Train 2 Processed Gas', ''],
          {
            aggregation: "month",
            method: "latest",
            startAt: timeStart,
            endAt: today
          })
      ]).then(([DS2Meta, CPF1Meta, res]) => {
        this.seriesData.DS2Meta = DS2Meta.data.model.time_series.reduce((result, item) => {
            result[item.name] = item;
            return result;
          }, {}
        );
        this.seriesData.CPF1Meta = CPF1Meta.data.model.time_series.reduce((result, item) => {
            result[item.name] = item;
            return result;
          }, {}
        );
        let dates = res.data.CPF1["Monthly Flared Gas"].values
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
        res.data.CPF1["Monthly Flared Gas"].values.reduce((result, item) => {
          let time = new Date(item.time).format('yyyy-MM')
          item.value = this.convertData(this.seriesData.CPF1Meta["Monthly Flared Gas"], item.value);
          this.yData.cpfMonthly[dates[time]] = item.value
        }, {});
        res.data.CPF1["Monthly Gas Production"].values.reduce((result, item) => {
          let time = new Date(item.time).format('yyyy-MM')
          item.value = this.convertData(this.seriesData.CPF1Meta["Monthly Gas Production"], item.value);
          this.yData.cpfProducedMonthly[dates[time]] = item.value
        }, {});
        res.data.DS2["Monthly Flared Gas"].values.reduce((result, item) => {
          let time = new Date(item.time).format('yyyy-MM')
          item.value = this.convertData(this.seriesData.DS2Meta["Monthly Flared Gas"], item.value);
          this.yData.dsMonthly[dates[time]] = item.value
        }, {});
        res.data.DS2["Monthly Gas Production"].values.reduce((result, item) => {
          let time = new Date(item.time).format('yyyy-MM')
          item.value = this.convertData(this.seriesData.DS2Meta["Monthly Gas Production"], item.value);
          this.yData.dsProducedMonthly[dates[time]] = item.value
        }, {});


        res.data.CPF1["FCP Sweet Gas Train 1 Processed Gas"].values.reduce((result, item) => {
          let time = new Date(item.time).format('yyyy-MM')
          item.value = this.convertData(this.seriesData.CPF1Meta["FCP Sweet Gas Train 1 Processed Gas"], item.value);
          this.yData.Train1[dates[time]] = item.value
        }, {});
        res.data.CPF1["FCP Sweet Gas Train 2 Processed Gas"].values.reduce((result, item) => {
          let time = new Date(item.time).format('yyyy-MM')
          item.value = this.convertData(this.seriesData.CPF1Meta["FCP Sweet Gas Train 2 Processed Gas"], item.value);
          this.yData.Train2[dates[time]] = item.value
        }, {});
        // console.log(this.yData, 1)
      })
    },
  },
  created() {
    this.getData(this.time);
  }
};
</script>

<style scoped>
* {
  font-family: 'HarmonyOS_Sans';
}

:deep(.el-table td, .el-table th) {
  padding: 0;
}

:deep(.el-table__row) {
  height: 50px;
}

:deep(.el-table)::before {
  height: 0;
}

:deep(.el-table .cell) {
  word-break: break-word !important;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  max-height: 50px;
}

:deep(.el-table) {
  margin-left: 35px;
  background-color: transparent;
  color: #ffffff;
  overflow: scroll;
}

:deep(.el-table tbody tr):hover > td {
  background-color: rgba(54, 149, 255, 0.1) !important;
  color: #ffffff;

}

:deep(.el-table th, .el-table tr) {
  background-color: transparent;
}

:deep(.el-table tr) {
  cursor: pointer;
  background-color: transparent;
}

:deep(.el-table thead) {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
  font-style: normal;
}

:deep(.el-table th.is-leaf) {
  font-weight: 400 !important;
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.4);
  padding: 0 0 8px 0;
}

:deep(.el-table td, .el-table th.is-leaf) {
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.4);
}

/*:deep(.el-table th>.cell {*/
/*  padding-left: 0;*/
/*}*/
</style>
