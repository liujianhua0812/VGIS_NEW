<template>
  <div class="full-h">
    <v-chart
      style="height: 100%;width: 100%"
      :option="chartsOption"
      autoresize
    ></v-chart>
  </div>
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
  name: "OilByWells",
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
          data: ["Yesterday", "Today"]
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
        grid: {
          left: -20,
          right: 0,
          bottom: 0,
          top: 28,
          containLabel: true
        },
        yAxis: {
          type: "value",
          axisLabel: {
            align: 'center',
            fontSize: 12
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              opacity: 0.1
            }
          }
        },
        xAxis: {
          axisLine: {
            lineStyle: {
              color: '#1c232e'
            }
          },
          // inverse: true,
          axisTick: {
            show: false
          },
          type: "category",
          boundaryGap: true,
          axisLabel: {
            rotate: 45,
            interval: 0,
            nameTextStyle: {
              color: "rgba(255,255,255,0.7)",
            },
            textStyle: {
              fontSize: 12,
              color: "rgba(255,255,255,0.7)"
            }
          },
          data: this.wells.slice(0, 10)
        },
        series: [{
          name: "Yesterday",
          seriesLayoutBy: 'column',
          type: "bar",
          barWidth: 12,
          emphasis: {
            focus: "series"
          },
          tooltip: {
            valueFormatter: function (value) {
              return value + ' kbbls';
            }
          },
          barGap: '50%',
          itemStyle: {
            normal: {
              color: "#4FACFF"
            }
          },
          data: this.yesterdayData.slice(0, 10)
        },
          {
            name: "Today",
            seriesLayoutBy: 'column',
            type: "bar",
            barWidth: 12,
            emphasis: {
              focus: "series"
            },
            tooltip: {
              valueFormatter: function (value) {
                return value + ' kbbls';
              }
            },
            itemStyle: {
              normal: {
                color: "#F6E75A"
              }
            },
            data: this.todayData.slice(0, 10)
          },
        ]
      };
    }
  },
  data() {
    return {
      chartData: [],
      wells: [],
      todayData: [],
      yesterdayData: [],
      sortChartData: [],
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
      let today = time;
      let timeStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);
      // 获取 well 的 instanceId 数组
      getNodesByModel("Well").then(result => {
        let wellNames = result.data.map(item => item.instanceId);
        // 获取 nodeDetail -> 获取 fixed 小数精度
        getNodeDetail(wellNames[0]).then(nodeDetails => {
          this.seriesData = nodeDetails.data.model.time_series.reduce((result, item) => {
              result[item.name] = item;
              return result;
            }, {}
          );
          getMultipleSeriesHistoryValues(
            wellNames,
            ['Daily Oil Production'],
            {
              aggregation: "day",
              method: "latest",
              startAt: timeStart,
              endAt: today
            }
          ).then(res => {
            this.chartData = []
            this.sortChartData = []
            this.yesterdayData = []
            this.todayData = []
            this.wells = []
            wellNames.map(name => {
              let wellItemOil = res.data[name]["Daily Oil Production"]
              // if (wellItemOil.values.length >= 2) {
                // let todayWater = parseFloat(wellItemWater.values[wellItemWater.values.length - 1].value)
                // let yesterdayWater = parseFloat(wellItemWater.values[wellItemWater.values.length - 2].value)

                let todayOil = parseFloat(wellItemOil.values[wellItemOil.values.length - 1] ? wellItemOil.values[wellItemOil.values.length - 1].value : 0)
                let yesterdayOil = parseFloat(wellItemOil.values[wellItemOil.values.length - 2] ? wellItemOil.values[wellItemOil.values.length - 2].value : 0)

                this.chartData.push({
                  name: name,
                  today: this.convertData(this.seriesData["Daily Oil Production"], todayOil),
                  // today: todayWater + todayOil,
                  yesterday: this.convertData(this.seriesData["Daily Oil Production"], yesterdayOil ),
                  // yesterday:  yesterdayOil + yesterdayWater,
                  diff: Math.abs( todayOil- yesterdayOil )
                })
              // }
            })
            // today yesterday 都为0 的 移动到数组末尾
            let j = 0;
            for (let i = 0; i < this.chartData.length; i++) {
              //当前元素today 和 yesterday 都 !=0，就把其交换到左边，都等于0的交换到右边
              if (this.chartData[i].today !== 0 && this.chartData[i].yesterday !== 0) {
                let tmp = this.chartData[i];
                this.chartData[i] = this.chartData[j];
                this.chartData[j++] = tmp;
              }
            }
            this.sortChartData = this.chartData.sort((a, b) => {
              return b.diff - a.diff
            })
            this.sortChartData.map(item => {
              this.wells.push(item.name)
              this.todayData.push(item.today)
              this.yesterdayData.push(item.yesterday)
            })
          })
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
