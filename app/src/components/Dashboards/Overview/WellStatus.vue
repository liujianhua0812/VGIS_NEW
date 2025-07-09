<template>
  <div class="gas-production">
<!--    <div class="rate">-->
<!--      <div class="item">-->
<!--        <div>Well Opening Rate</div>-->
<!--        <div class="origin-t"> {{ openingRate?`${openingRate}%`:'Unknown' }}</div>-->
<!--      </div>-->
<!--      <div class="item">-->
<!--        <div>Online TimeRate</div>-->
<!--        <div class="pur-t">{{ onlineRate }}%</div>-->
<!--      </div>-->
<!--    </div>-->
    <v-chart
      :option="chartsOption"
      autoresize
      style="width:100%; height:100%"
    ></v-chart>
  </div>
</template>

<script>
import EventBus from "@/utils/EventBus";
import config from "@/config"
import {
  getMultipleSeriesLatestValues,
  getNodeDetail,
  getNodesByModel,
  getSeriesHistoryValues
} from "@/assets/js/api/hierarchy";

export default {
  name: "WellStatus",
  data() {
    return {
      times: [],
      totalWells: [],
      activeWells: [],
      seriesData: {},
      activationRates: [],
      openingRate: "",
      onlineRate: "",
    };
  },
  computed: {
    chartsOption() {
      return {
        legend: [
          {
            right: 164,
            itemGap: 24,
            icon: "rect", //  字段控制形状  类型包括 circle，rect,line，roundRect，triangle，diamond，pin，arrow(箭头)，none
            itemWidth: 9, // 设置宽度
            itemHeight: 9, // 设置高度
            textStyle: {
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: 12
            },
            data: ["Total Wells","Active Wells", ]
          },
          {
            right: 30,
            icon: "rect",
            itemWidth: 9,
            itemHeight: 2,
            textStyle: {
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: 12
            },
            data: ["Well Opening Rate"]
          }
        ],
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
            interval:0,
            textStyle: {
              fontSize: 12,
              color: "rgba(255,255,255,0.7)"
            }
          },
          data: this.times
        },
        yAxis: [
          {

            axisLabel: {
              textStyle: {
                fontSize: 12,
                color: "rgba(255,255,255,0.7)"
              }
            },
            name: "",
            type: "value",
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
            }
          },
          {
            max: 100,
            axisLabel: {
              textStyle: {
                fontSize: 12,
                color: "rgba(255,255,255,0.7)"
              }
            },
            type: "value",
            name: "%",
            nameTextStyle: {
              padding: [0, -20, 0, 0]
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
          }
        ],
        series: [
          {
            name: "Total Wells",
            type: "bar",
            emphasis: {
              focus: "series"
            },
            barWidth: 10,
            itemStyle: {
              normal: {
                color: "#4FACFF"
              }
            },
            data: this.totalWells
          },
          {
            name: "Active Wells",
            type: "bar",
            emphasis: {
              focus: "series"
            },
            barWidth: 10,
            barGap:'50%',
            itemStyle: {
              normal: {
                color: "#F6E75A"
              }
            },
            data: this.activeWells
          },
          {
            name: "Well Opening Rate",
            type: "line",
            yAxisIndex: 1,
            symbol: "none", //去掉折线上面的点
            emphasis: {
              focus: "series"
            },
            itemStyle: {
              normal: {
                color: "#F65A5A"
              }
            },
            data: this.activationRates
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
      let today = time;
      let timeStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10);
      // 获取 well 的 instanceId 数组
      getNodesByModel("Well").then(result => {
        let wellNames = result.data.map(item => item.instanceId);
        // 通过 well instanceId 数组查询每个 instance 的在线时长
        getMultipleSeriesLatestValues(wellNames, ["Hrs Online"]).then(res => {
          // 累加在线时长
          let onlineH = 0;
          // well 总数
          let mjNum = 0;
          for (let key in res.data) {
            if (res.data[key][0].value) {
              let hrs = Number(res.data[key][0].value)
              if (hrs) {
                mjNum++
                onlineH += Number(res.data[key][0].value);
              }
            }
          }
          let totalH = mjNum * 24;
          if (totalH) {
            this.onlineRate = ((onlineH / totalH) * 100).toFixed(2);
          } else {
            this.onlineRate = 0;
          }
        });
      });
      Promise.all([
        getNodeDetail("DS1"),
        getNodeDetail("DS2"),
        getNodeDetail("CPF1"),
        getNodeDetail("Majnoon"),
        getSeriesHistoryValues(
          "Majnoon",
          ["Total Flare Gas", "Total Active Wells", "Total Wells"],
          {
            aggregation: "day",
            method: "latest",
            startAt: timeStart,
            endAt: today
          }
        ),
      ]).then(([DS1Meta, DS2Meta, CPF1Meta, MajnoonMeta, Majnoon]) => {
        this.seriesData.DS1 = DS1Meta.data.model.time_series.reduce(
          (result, item) => {
            result[item.name] = item;
            return result;
          },
          {}
        );
        this.seriesData.DS2 = DS2Meta.data.model.time_series.reduce(
          (result, item) => {
            result[item.name] = item;
            return result;
          },
          {}
        );
        this.seriesData.CPF1 = CPF1Meta.data.model.time_series.reduce(
          (result, item) => {
            result[item.name] = item;
            return result;
          },
          {}
        );
        this.seriesData.Majnoon = MajnoonMeta.data.model.time_series.reduce(
          (result, item) => {
            result[item.name] = item;
            return result;
          },
          {}
        );
        for (let i = 0; i < Majnoon.data["Total Active Wells"].values.length; i++) {

          if (i === Majnoon.data["Total Active Wells"].values.length - 1) {

            this.openingRate = ((Majnoon.data["Total Active Wells"].values[i].value / Majnoon.data["Total Wells"].values[i].value) * 100)
              .toFixed(2);
          }
          // let item = Majnoon.data["Total Active Wells"].values[i];
          // this.times.push(`${new Date(item.time).getDate()}-${MonthMap[new Date(item.time).getMonth()]}`);
        }

        let dates = Majnoon.data["Total Active Wells"].values
          .concat(Majnoon.data["Total Wells"].values)
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

        Majnoon.data["Total Active Wells"].values.reduce((result, item, index) => {

          let time = new Date(item.time).format('dd-MF')


          this.activeWells[dates[time]] = this.convertData(
            this.seriesData.Majnoon["Total Active Wells"],
            item.value
          );


        }, {})
        Majnoon.data["Total Wells"].values.reduce((result, item, index) => {
          let time = new Date(item.time).format('dd-MF')
          this.totalWells[dates[time]] = this.convertData(
            this.seriesData.Majnoon["Total Wells"],
            item.value
          );

        }, {})


        for (let i = 0; i < Majnoon.data["Total Active Wells"].values.length; i++) {
          this.activationRates.push(
            (Majnoon.data["Total Active Wells"].values[i].value / Majnoon.data["Total Wells"].values[i].value * 100).toFixed(2)
          );
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
* {
  font-family: HarmonyOS_Sans;
}
.gas-production {
  width: 100%;
  height: 100%;

  .rate {
    height: 25%;
    color: rgba(255, 255, 255, 0.7);
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    .item {
      padding: 4px 4px 4px 16px;
      white-space: nowrap;
      //flex:0 0 30%;
      width: 159px;
      background: rgba(54, 149, 255, 0.05);
      border: 1px solid rgba(165, 201, 255, 0.4);
      border-radius: 6px;
      margin-right: 24px;
    }

    .origin-t {
      font-weight: bold;
      font-size: 20px;
      color: #e56547;
    }

    .pur-t {
      font-weight: bold;
      font-size: 20px;
      color: #ca6ad8;
    }
  }
}
</style>
