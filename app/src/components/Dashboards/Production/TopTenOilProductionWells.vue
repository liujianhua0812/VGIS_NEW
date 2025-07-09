<template>
  <div class="full-h full-w topTenList">
    <div class="leftTop">
      <div class="topThree" @click="chartClickFn({ name: wells[0] })">
        <div class="redIcon">
        </div>
        <div class="wellData">
          <div class="data">
            <div>{{ wells[0] }}</div>
            <div><span class="wellNum red">{{ oilProductions[0] }}</span><small>kbbls</small></div>
          </div>
          <el-progress :percentage="100" color="#f65a5a" :show-text="false"></el-progress>
        </div>
      </div>
      <div class="topThree" @click="chartClickFn({ name: wells[1] })">
        <div class="orangeIcon">
        </div>
        <div class="wellData">
          <div class="data">
            <div>{{ wells[1] }}</div>
            <div><span class="wellNum orange">{{ oilProductions[1] }}</span><small>kbbls</small></div>
          </div>
          <el-progress :percentage="(oilProductions[1]/oilProductions[0])*100" color="#F8A151"
                       :show-text="false"></el-progress>
        </div>
      </div>
      <div class="topThree" @click="chartClickFn({ name: wells[2] })">
        <div class="greenIcon">
        </div>
        <div class="wellData">
          <div class="data">
            <div>{{ wells[2] }}</div>
            <div><span class="wellNum green">{{ oilProductions[2] }}</span><small>kbbls</small></div>
          </div>
          <el-progress :percentage="( oilProductions[2]/oilProductions[0])*100" color="#45E09F"
                       :show-text="false"></el-progress>
        </div>
      </div>
    </div>
    <div class="rightTop">
      <div class="leftNum">
        <div class="topNum">4</div>
        <div class="topNum">5</div>
        <div class="topNum">6</div>
        <div class="topNum">7</div>
        <div class="topNum">8</div>
        <div class="topNum">9</div>
        <div class="topNum">10</div>
      </div>
      <v-chart
        style="width:85%;height: 100%"
        :option="chartsOption"
        autoresize
        @click="chartClickFn"
      ></v-chart>
    </div>
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
  name: "TopTenOilProductionWells",
  computed: {
    chartsOption() {
      return {
        textStyle: {
          fontSize: 12,
          color: "rgba(255,255,255,0.7)"
        },
        tooltip: {
          trigger: "axis",
          borderColor: "#3DE1EF",
          borderWidth: "0.5",
          backgroundColor: "#141B25",
          shadowBlur: "4",
          renderMode: 'html',
          appendToBody: true,
          shadowColor: "rgba(61, 225, 239, 0.25)",
          icon: "rect",
          textStyle: {
            color: "#fff",
            fontFamily: "Inter",
            fontStyle: "normal",
            fontWeight: "400",
            fontSize: 14
          },
        },
        grid: {
          left: 0,
          right: 0,
          bottom: -1,
          top: 3,
          containLabel: true
        },
        xAxis: {
          type: "value",
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: "dashed",
              opacity: 0.1
            }
          }
        },
        yAxis: {
          inverse: true,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          type: "category",
          boundaryGap: true,
          axisLabel: {
            interval: 0,
            fontSize: 12,

            nameTextStyle: {
              color: "rgba(255,255,255,0.7)",
            },
            textStyle: {
              fontSize: 12,
              color: "rgba(255,255,255,0.7)"
            }
          },
          data: this.wells.slice(3, 10)
        },
        color: ["#4FACFF"],
        series: [
          {
            name: "",
            seriesLayoutBy: 'column',
            type: "bar",
            barWidth: 6,
            emphasis: {
              focus: "series"
            },
            tooltip: {
              valueFormatter: function (value) {
                return value + ' kbbls';
              }
            },
            // barGap: '50%',
            itemStyle: {
              borderRadius: 10
            },
            data: this.oilProductions.slice(3, 10)
          }
        ]
      };
    }
  },
  data() {
    return {
      oilProductions: [],
      chartData: [],
      wells: [],
      todayData: [],
      yesterdayData: [],
      sortChartData: [],
      seriesData: {}
    };
  },
  methods: {
    chartClickFn(params) {
      this.$bus.$emit("linkMapName", params.name, true)
    },
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
            ["Daily Oil Production"],
            {
              aggregation: "day",
              method: "latest",
              startAt: timeStart,
              endAt: today
            }
          ).then(res => {
            this.wells = []
            this.chartData = []
            this.sortChartData = []
            this.oilProductions = []
            let latestDate = Object.values(res.data).reduce((result, item) => {
              let values = item['Daily Oil Production'].values
              if (values && values.length >= 1) {
                if (result < new Date(values[values.length - 1].time)) {
                  result = new Date(values[values.length - 1].time)
                }
              }
              return result
            }, new Date(0))
            wellNames.map(name => {
              let wellItem = res.data[name]['Daily Oil Production']
              if (wellItem.values && wellItem.values.length >= 1) {
                let time = new Date(wellItem.values[wellItem.values.length - 1].time)
                if (time.getTime() === latestDate.getTime()) {
                  this.chartData.push({name: name, data: wellItem.values[wellItem.values.length - 1].value})
                }
              }
            })
            this.sortChartData = this.chartData.sort((a, b) => {
              return b.data - a.data
            })
            this.sortChartData.map(item => {
              this.wells.push(item.name)
              // this.oilProductions.push(item.data)
              this.oilProductions.push(this.convertData(this.seriesData["Daily Water Production"], item.data))
            })
          })
        })
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

<style lang="scss" scoped>
* {
  font-family: 'HarmonyOS_Sans';
}

.topTenList {
  display: flex;

  .leftTop {
    flex: 5;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .topThree {
      cursor: pointer;
      flex: 0 0 28%;
      margin-right: 8px;
      background: linear-gradient(90deg, rgba(29, 174, 255, 0.1) 0%, rgba(29, 174, 255, 0.03) 100.89%);
      border-radius: 8px;
      display: flex;
      align-items: center;

      //.numTop {
      //  position: absolute;
      //  top: 25%;
      //  left: 50%;
      //  transform: translate(-50%, -50%);
      //  text-align: center;
      //  font-weight: 700;
      //  font-size: 15px;
      //}

      .red {
        color: #F65A5A;
      }

      .orange {
        color: #F8A151
      }

      .green {
        color: #45E09F
      }



      .wellData {
        height: 100%;
        flex-grow: 1;
        padding: 5px 15px 5px 0;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .data {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-size: 20px;
          margin-bottom: 5px;

          .wellNum {
            font-style: normal;
            font-weight: 700;
            font-size: 20px;
            padding-right: 5px;

            small {
              font-size: 14px;
            }
          }
        }
      }
      .redIcon {
        height: 100%;
        width: 60px;
        margin: 5px;
        background-position: center;
        background-image: url("~@/assets/images/dashboard/Frame 924.png");
        background-repeat: no-repeat;
      }
      .orangeIcon {
        height: 100%;
        width: 60px;
        margin: 5px;
        background-position: center;
        background-image: url("~@/assets/images/dashboard/Frame 925.png");
        background-repeat: no-repeat;
      }

      .greenIcon {
        height: 100%;
        width: 60px;
        margin: 5px;
        background-position: center;
        background-image: url("~@/assets/images/dashboard/Frame 926.png");
        background-repeat: no-repeat;
      }
    }
  }

  .rightTop {
    flex: 3;
    height: 100%;
    background: linear-gradient(90deg, rgba(29, 174, 255, 0.1) 0%, rgba(29, 174, 255, 0.03) 100.89%);
    border-radius: 6px;
    display: flex;
    justify-content: space-between;

    .leftNum {
      width: 10px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      justify-content: space-around;

      .topNum {
        width: 100%;
        color: #4FACFF;
        text-align: center;
        align-items: center;
      }
    }
  }
}

:deep(.el-progress-bar__outer) {
  background-color: inherit;
}
</style>
