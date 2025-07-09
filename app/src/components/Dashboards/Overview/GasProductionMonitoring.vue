<template>
    <v-chart
      :option="chartsOption1"
      autoresize
      style="width:100%;height:100%"
    ></v-chart>
</template>

<script>
import EventBus from "@/utils/EventBus";
import config from "@/config"
import {
  getNodeDetail,
  getSeriesHistoryValues,
  getMultipleSeriesHistoryValues,
  getMultipleSeriesLatestValues,
  getNodesByModel
} from "@/assets/js/api/hierarchy";

export default {
  name: "GasProductionMonitoring",
  data() {
    return {
      times: [],
      CPFS: [],
      DSS: [],
      exports: [],
      timesTop: [],
      flares: [],
      seriesData: {},
    };
  },
  computed: {
    chartsOption1() {
      return {
        title: {
          text: 'MMscf',
          top: '0',
          left: '-1.2%',
          textStyle: {
            color: "rgba(255, 255, 255, 0.7)",
            fontWeight: 400,
            fontSize: 12,
          }
        },
        textStyle: {
          fontSize: 12,
          color: "rgba(255,255,255,0.7)"
        },
        legend: {
          itemGap: 24,
          right: 0,
          icon: "rect",
          itemWidth: 9,
          itemHeight: 9,
          textStyle: {color: "rgba(255, 255, 255, 0.7)"},
          data: [{name: "Export Gas"}, {name: "Flare Gas"}]
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
            nameTextStyle: {
              color: "rgba(255,255,255,0.7)",
              nameLocation: "start"
            },
            textStyle: {
              fontSize: 12,
              color: "rgba(255,255,255,0.7)"
            }
          },
          data: this.times
        },
        yAxis: {
          type: "value",
          axisLabel: {
            textStyle: {
              fontSize: 12,
              color: "rgba(255,255,255,0.7)"
            }
          },
          nameTextStyle: {
            align: 'left'
          },
          //虚线
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              opacity: 0.1,
              width: 1,
              length: 10,
              distance: 6,
              fontStyle: "italic"
            }
          },
          axisLine: {
            show: false
          }
        },
        series: [
          {
            name: "Export Gas",
            type: "bar",
            barWidth: 10,
            itemStyle: {
              normal: {
                color: "#4FACFF"
              }
            },
            emphasis: {
              focus: 'series'
            },
            data: this.exports
          },
          {
            name: "Flare Gas",
            type: "bar",
            symbol: "none", //去掉折线上面的点
            barWidth: 10,
            barGap:'50%',
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              normal: {
                color: "#F6E75A"
              }
            },
            data: this.flares
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
      // 今天
      let today = time;
      let timeStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);
      Promise.all([
        getNodeDetail("DS1"),
        getNodeDetail("DS2"),
        getNodeDetail("CPF1"),
        getNodeDetail("Majnoon"),
        getMultipleSeriesHistoryValues(
          ["CPF1", "DS2"],
          ["Total Gas Production"],
          {
            aggregation: "day",
            method: "latest",
            startAt: timeStart,
            endAt: today
          }
        ),
        getSeriesHistoryValues(
          "DS1",
          ["Daily Gas Export"],
          {
            aggregation: "day",
            method: "latest",
            startAt: timeStart,
            endAt: today
          }
        ),
        getSeriesHistoryValues(
          "Majnoon",
          ["Total Flare Gas", "Total Active Wells", "Total Wells"],
          {
            aggregation: "day",
            method: "latest",
            startAt: timeStart,
            endAt: today
          }
        )
      ]).then(
        ([DS1Meta, DS2Meta, CPF1Meta, MajnoonMeta, CPF1DS2, DS1, Majnoon]) => {
          this.seriesData.DS1 = DS1Meta.data.model.time_series.reduce((result, item) => {
              result[item.name] = item;
              return result;
            }, {}
          );
          this.seriesData.Majnoon = MajnoonMeta.data.model.time_series.reduce(
            (result, item) => {
              result[item.name] = item;
              return result;
            },
            {}
          );
          this.seriesData.DS2 = DS2Meta.data.model.time_series.reduce((result, item) => {
              result[item.name] = item;
              return result;
            }, {}
          );
          this.seriesData.CPF1 = CPF1Meta.data.model.time_series.reduce((result, item) => {
              result[item.name] = item;
              return result;
            }, {}
          );

          let dates = CPF1DS2.data.CPF1["Total Gas Production"].values
            .concat(CPF1DS2.data.CPF1["Total Gas Production"].values)
            .concat(DS1.data["Daily Gas Export"].values)
            .concat(Majnoon.data["Total Flare Gas"].values)
            .reduce((result, item) => {
              let date = new Date(item.time)
              result[date.format('yyyy-MM-dd')] = date
              return result
            }, {})
          dates = Object.values(dates)
          dates.sort((d1, d2) => d1 - d2)
          this.times = dates.map(item => item.format('dd-MF'))
          dates = dates.reduce((result, date, index) => {
            result[date.format('dd-MF')] = index
            return result
          }, {})

          CPF1DS2.data.CPF1["Total Gas Production"].values.reduce((result, item) => {
            let time = new Date(item.time).format('dd-MF')

            this.CPFS[dates[time]] = this.convertData(this.seriesData.CPF1["Total Gas Production"], item.value)

          }, {})
          CPF1DS2.data.DS2["Total Gas Production"].values.reduce((result, item) => {
            let time = new Date(item.time).format('dd-MF')
            this.DSS[dates[time]] = this.convertData(this.seriesData.DS2["Total Gas Production"], item.value)


          }, {})
          DS1.data["Daily Gas Export"].values.reduce((result, item) => {
            let time = new Date(item.time).format('dd-MF')
            this.exports[dates[time]] = this.convertData(this.seriesData.DS1["Daily Gas Export"], item.value)


          }, {})
          Majnoon.data["Total Flare Gas"].values.reduce((result, item, index) => {
            let time = new Date(item.time).format('dd-MF')
            this.flares[dates[time]] = this.convertData(this.seriesData.Majnoon["Total Flare Gas"], item.value)

          }, {})
        }
      );
    }
  }
};
</script>

<style scoped>
</style>
