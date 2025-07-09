<template>
  <div class="full-h full-w safetyContent">
    <div class="cctv">
      <div class="full-h block">
        <div class="iconCCTV"></div>
        <div class="nameContainer">
          <div class="name">CCTV</div>
          <div class="data">{{ cctvData }}</div>
        </div>
        <div class="arrowend"></div>
      </div>

      <div class=" full-h block">
        <div class="iconAccess"></div>
        <div class="nameContainer">
          <div class="name">Access</div>
          <div class="data">{{ AccessData }}</div>
        </div>
        <div class="arrowend"></div>
      </div>
    </div>
    <div class="lineChart">
      <v-chart
        style="height: 100%;width: 100%"
        :option="chartsOption"
        autoresize
      ></v-chart>
    </div>
    <div class="backBottom">
      <div class="itemBack">
        <div class="totalData">{{ totalMonthly }}</div>
      </div>
      <div class="itemBack">
        <div class="totalData">{{ totalYTD }}</div>
      </div>
    </div>

  </div>

</template>

<script>

import EventBus from "@/utils/EventBus";
import config from "@/config";
import {
  getNodeDetail, getNodesByModel,
  getSeriesHistoryValues, getSeriesLatestValues,
  getMultipleSeriesHistoryValues
} from "@/assets/js/api/hierarchy";

export default {
  name: "SafeSummary",
  computed: {
    chartsOption() {
      let serie = []
      for (let item of this.productionData.MonthlyData) {
        serie.push({
          name: item.name,
          type: 'bar',
          stack: 1,
          barWidth: 8,
          showBackground: true,
          backgroundStyle: {
            opacity: 0.1
          },
          data: [{
            name: item.name,
            value: parseInt(item.value)
          }]
        })
      }
      for (let item of this.productionData.YTDData) {
        serie.push({
          name: item.name,
          type: 'bar',
          stack: 2,
          barWidth: 8,
          showBackground: true,
          backgroundStyle: {
            opacity: 0.1
          },
          xAxisIndex: 1, yAxisIndex: 1,
          data: [{
            name: item.name,
            value: parseInt(item.value)
          }]
        })
      }
      return {
        textStyle: {
          fontFamily: 'HarmonyOS_Sans',
        },
        title: [
          {
            text: 'Monthly',
            top: '23%',
            left: '3%',
            textStyle: {
              color: '#FFFFFF',
              fontWeight: 400,
              fontSize: 16,
            }
          }, {
            text: 'YTD',
            left: '3%',
            top: '65%',
            textStyle: {
              color: '#FFFFFF',
              fontWeight: 400,
              fontSize: 16,
            }
          }],
        grid: [{
          left: '4%',
          top: '40%',
          right: '15%',
          height: '20%',
          // containLabel: true
        }, {
          left: '4%',
          bottom: '0%',
          right: '15%',
          height: '20%',
          // containLabel: true
        }],
        xAxis: [{
          type: 'value',
          show: false,
          gridIndex: 0,
        }, {
          type: 'value',
          show: false,
          gridIndex: 1,
        }],
        yAxis: [{
          type: 'category',
          data: ['Monthly'],
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          },
          gridIndex: 0,
        }, {
          type: 'category',
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          },
          data: ['YTD'],
          gridIndex: 1,
        }],
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
        color: ['#4FACFF', "#F6E75A", "#45E09F", "#F8A151", "#967FF3", "#F65A5A"],
        legend: {
          type: 'scroll',
          itemGap: 24,
          top: '5%',
          right: '0',
          width: '99%',
          icon: "rect", //  字段控制形状  类型包括 circle，rect,line，roundRect，triangle，diamond，pin，arrow(箭头)，none
          itemWidth: 9, // 设置宽度
          itemHeight: 9, // 设置高度
          textStyle: {
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: 14
          },
          pageFormatter: ' ',
          pageIconSize: 12,
          pageButtonItemGap: 0,
          pageIconColor: 'rgba(255, 255, 255, 0.7)',
          pageIconInactiveColor: 'rgba(255, 255, 255, 0.7)',
        },
        series: serie
      };
    },
  },
  data() {
    return {
      cctvData: 0,
      AccessData: 0,
      totalMonthly: 0,
      totalYTD: 0,
      productionData: {
        YTDData: [],
        MonthlyData: [],
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
    getData(date) {
      getNodesByModel(["CCTV"]).then((res) => {
        this.cctvData = res.data.length
      })
      getNodesByModel(["Entrance Guard"]).then((res) => {
        this.AccessData = res.data.length
      })
      Promise.all([getSeriesLatestValues(
        ["Majnoon"],
        [
          "First aid injuries",
          "Medical treatment case",
          "Restricted Work Case",
          "Occupational Illness",
          "Lost time injuries",
          "Fatalities",
        ],
        null, null, date
      ), getSeriesLatestValues(
        ["Majnoon"],
        [
          "First aid injuries Annually",
          "Medical treatment case Annually",
          "Restricted Work Case Annually",
          "Occupational Illness Annually",
          "Lost time injuries Annually",
          "Fatalities Annually",
        ],
        null, null, date
      ), getSeriesLatestValues(
        ["Majnoon"],
        [
          "Total work injuries",
          "Total work injuries Annually"
        ],
        null, null, date
      )]).then(([MonthData, AnnuallyData, TotalData]) => {
        // console.log(MonthData, AnnuallyData, TotalData)
        let arr = [], arr2 = []
        MonthData.data.forEach(item => arr.unshift(item))
        this.productionData.MonthlyData = arr

        AnnuallyData.data.map(item => {
          //去掉年份的单词
          item.name = item.name.slice(0, -9)
          return item
        }).forEach(item => arr2.unshift(item))
        this.productionData.YTDData = arr2
        // console.log(this.productionData.MonthlyData, this.productionData.YTDData)
        this.totalMonthly = TotalData.data[1].value
        this.totalYTD = TotalData.data[0].value
      })

    },
  },
  created() {
    this.getData(config.general.date);
  }
};
</script>

<style lang="scss" scoped>
.safetyContent {
  display: flex;
  flex-direction: column;
  position: relative;

  .cctv {
    display: flex;
    justify-content: space-between;
    height: 80px;
    //padding: 15px 0 0;
    .block {
      flex: 0 0 49%;
      display: flex;
      background: linear-gradient(180deg, rgba(29, 174, 255, 0.1) 0%, rgba(29, 174, 255, 0) 100%);
      border-radius: 4px;

      .iconAccess {
        flex: 1;
        background-image: url("~@/assets/images/dashboard/access.png");
        background-repeat: no-repeat;
        background-position: center;
      }

      .iconCCTV {
        flex: 1;
        background-image: url("~@/assets/images/dashboard/cctv.png");
        background-position: center;
        background-repeat: no-repeat;
      }

      .arrowend {
        flex: 1;
        background-image: url("~@/assets/images/dashboard/arrowback.png");
        background-position: right;
        background-repeat: no-repeat;
      }

      .nameContainer {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: rgba(255, 255, 255, 0.7);

        .data {
          font-style: normal;
          font-weight: 700;
          font-size: 24px;
          color: #3DE1EF;
          line-height: 28px;
        }
      }
    }
  }

  .lineChart {
    width: 100%;
    background: inherit;
    z-index: 1;
    flex-grow: 1;
  }

  .backBottom {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 50%;
    bottom: 0;
    //border: 1px solid white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .itemBack {
      width: 100%;
      flex: 0 0 47%;
      border-radius: 4px;
      background: linear-gradient(90deg, rgba(29, 174, 255, 0.1) 0%, rgba(29, 174, 255, 0.03) 100%);

      .totalData {
        display: flex;
        height: 100%;
        margin-right: 15px;
        justify-content: end;
        align-items: center;
        font-weight: 700;
        font-size: 30px;
        color: #3DE1EF;
      }
    }

  }
}


* {
  font-family: 'HarmonyOS_Sans';
}

</style>
