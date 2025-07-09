<template>
  <div class="full-h full-w parent">
    <div class="top-items">
      <div class="item topFont">Export ({{ GasProductionUnit }})</div>
      <div class="item fontStyle">{{ GasProduction.toLocaleString() }}<span
        :class="`littleFont ${productionData.yesterday.ProductionGap>0?'orange':'green'}`">{{
          productionData.yesterday.ProductionGap >= 0 ? '+' : ''
        }}{{ productionData.yesterday.ProductionGap }}</span></div>
      <div class="item circle"></div>
    </div>
    <div class="bottom-items">
      <div class="item">
        <div class="top-date">
          Month ({{ GasProductionUnit }})
        </div>
        <div class="mid-val">
          {{
            productionData.Month[productionData.Month.length - 1] ? productionData.Month[productionData.Month.length -
            1].toLocaleString() : "Unknown"
          }}
        </div>
        <div :class="productionData.yesterday.MoM >= 0 ? 'orange' : 'green'" class="bot-change">
          {{ productionData.yesterday.MoM >= 0 ? '+': ''}}{{productionData.yesterday.MoM ?productionData.yesterday.MoM.toLocaleString():'Unknown'}}
        </div>
      </div>
      <div class="item">
        <div class="top-date">
          Year ({{ GasProductionUnit }})
        </div>
        <div class="mid-val">
          {{
            productionData.Year[productionData.Year.length - 1] ? productionData.Year[productionData.Year.length -
            1].toLocaleString() : "Unknown"
          }}
        </div>
        <div :class="productionData.yesterday.YoY >= 0 ? 'orange' : 'green'" class="bot-change">
          {{ productionData.yesterday.YoY >= 0 ? '+': ''}}{{productionData.yesterday.YoY?productionData.yesterday.YoY.toLocaleString():'unknow'}}
        </div>
      </div>
      <div class="item">
        <div class="top-date">
          Total (Bscf)
        </div>
        <div class="mid-val">
          {{
            productionData.yesterday["Cumulative Gas Delivery"]
              ? convertUnit(productionData.yesterday["Cumulative Gas Delivery"].value, 1000)
              : "Unknown"
          }}
        </div>
        <div class="bot-change blue">
          RF {{ productionData.yesterday.recoveryRate }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getNodeDetail,
  getSeriesLatestValues,
  getSeriesHistoryValues
} from "@/assets/js/api/hierarchy";

export default {
  name: "GasProduction",
  data() {
    return {
      Variation: "",
      GasProduction: "",
      GasProductionUnit: "",
      productionData: {
        yesterday: {},
        lastMonth: {},
        lastYear: {},
        Month: [],
        Year: []
      },
      seriesData: {}
    };
  },
  computed: {},
  methods: {
    convertUnit(value, rate) {
      return parseFloat((value / rate).toFixed(2)).toLocaleString()
    },
    convertData(series, value) {
      if (series.dataType === "Decimal") {
        return parseFloat(parseFloat(value).toFixed(series.precision));
      }
      return value;
    },
    getData() {
      // 今天
      let today = new Date();
      let zeroHour = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      // today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      let yesterday = new Date(zeroHour.getFullYear(), zeroHour.getMonth(), zeroHour.getDate() - 2);
      // 上个月的分界
      let lastMonth = new Date(zeroHour.getTime());
      lastMonth.setDate(1);
      let beforeMonth = new Date(lastMonth.getTime())
      beforeMonth.setMonth(beforeMonth.getMonth() - 2)
      // 去年的分界
      let lastYear = new Date(zeroHour.getTime());
      lastYear.setMonth(1);
      lastYear.setDate(1);
      let beforeYear = new Date(lastYear.getTime())
      beforeYear.setFullYear(lastYear.getFullYear() - 2)

      lastMonth.setMonth(1);
      lastMonth.setDate(1);
      Promise.all([
        getNodeDetail("DS1"),
        getNodeDetail("Majnoon"),
        getSeriesLatestValues(
          "DS1",
          ["Daily Gas Export"],
          "day",
          "latest",
          today
        ),
        // 拿到本月和上个月的量
        // 拿到本年度和上一年度的量
        // 拿到油田的总储量
        getSeriesLatestValues("Majnoon", [
          "Cumulative Gas Delivery",
          "Annual Gas Delivery",
          "Monthly Gas Delivery",
          "Total Gas Reserve",
          "Gas Export Target"
        ]),
        // getSeriesLatestValues(
        //   "DS1",
        //   ["Daily Gas Export"],
        //   "day",
        //   "latest",
        //   yesterday
        // ),
        getSeriesHistoryValues(
          "Majnoon",
          ["Monthly Gas Delivery"],
          {
            startAt: beforeMonth,
            endAt: today,
          }
        ),
        getSeriesHistoryValues(
          "Majnoon",
          ["Annual Gas Delivery"],
          {
            aggregation: "year",
            method: "latest",
            startAt: beforeYear,
            endAt: today,
          }
        ),
      ]).then(([DS1Meta, MajnoonMeta, DS1, Latest, lMonth, lYear]) => {
          this.seriesData.DS1 = DS1Meta.data.model.time_series.reduce((result, item) => {
              result[item.name] = item;
              return result;
            }, {}
          );
          this.seriesData.Majnoon = MajnoonMeta.data.model.time_series.reduce((result, item) => {
              result[item.name] = item;
              return result;
            }, {}
          );
          if(DS1.data.length){
            this.GasProduction = parseFloat(DS1.data[0].value)
          }
          this.GasProductionUnit = DS1.data[0].unit;
          this.productionData.yesterday = Latest.data.reduce((result, item) => {
              item.value = parseFloat(item.value)
              result[item.name] = item;
              return result;
            }, {}
          );
          lMonth.data["Monthly Gas Delivery"].values.reduce((result, item) => {
              this.productionData.Month.push(parseFloat(item.value))
            }, {}
          );
          this.productionData.yesterday.MoM = this.convertData(this.seriesData.Majnoon["Monthly Gas Delivery"], this.productionData.Month[this.productionData.Month.length - 1] - this.productionData.Month[this.productionData.Month.length - 2])
          lYear.data["Annual Gas Delivery"].values.reduce((result, item) => {
              this.productionData.Year.push(parseFloat(item.value))
            }, {}
          );
          this.productionData.yesterday.YoY = this.convertData(this.seriesData.Majnoon["Annual Gas Delivery"], this.productionData.Year[this.productionData.Year.length - 1] - this.productionData.Year[this.productionData.Year.length - 2])

          this.productionData.Year = this.productionData.Year.map(value => this.convertData(this.seriesData.Majnoon["Annual Gas Delivery"], value))
          this.productionData.Month = this.productionData.Month.map(value => this.convertData(this.seriesData.Majnoon["Monthly Gas Delivery"], value))

          this.productionData.yesterday.ProductionGap = this.convertData(this.seriesData.DS1["Daily Gas Export"], this.GasProduction - parseFloat(this.productionData.yesterday['Gas Export Target'].value));
          this.productionData.yesterday.recoveryRate = parseFloat(
            (
              (this.productionData.yesterday["Cumulative Gas Delivery"].value / this.productionData.yesterday["Total Gas Reserve"].value) * 100
            ).toFixed(2)
          );
          this.productionData.yesterday = Object.assign(this.productionData.yesterday, Latest.data.reduce((result, item) => {
              item.value = this.convertData(this.seriesData.Majnoon[item.name], item.value)
              result[item.name] = item;
              return result;
            }, {}
          ))
          this.GasProduction = this.convertData(this.seriesData.DS1[DS1.data[0].name], DS1.data[0].value);
        }
      );
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="scss" scoped>
.orange {
  color: #E56547;
}

.green {
  color: #3DA746;
}

.blue {
  color: #3695FF;
}

.parent {
  display: flex;
  flex-direction: column;
  padding-top: 6px;

  .top-items {
    flex: 89;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    .topFont {
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
      color: rgba(255, 255, 255, 0.7);
      position: absolute;
      left: 0;
    }

    .fontStyle {
      font-family: HarmonyOS_Sans;
      font-style: italic;
      font-weight: 700;
      color: #B79CFF;
      letter-spacing: 0.05em;
      font-size: 50px;
      position: relative;

      .littleFont {
        padding-left: 6px;
        font-weight: 400;
        letter-spacing: 0;
        font-size: 25px;
        position: absolute;
        bottom: 0;
      }
    }

    .circle {
      height: 9px;
      width: 60%;
      background: radial-gradient(50% 50% at 50% 50%, rgba(54, 149, 255, 0.5) 0%, rgba(54, 149, 255, 0) 100%);
    }
  }

  .bottom-items {
    flex: 93;
    margin-top: 15px;
    display: flex;
    justify-content: space-between;

    .item {
      padding: 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      background: rgba(54, 149, 255, 0.05);
      border: 0.5px solid rgba(165, 201, 255, 0.4);
      border-radius: 6px;
      flex: 0 0 31%;
      text-align: center;

      .top-date {
        font-weight: 400;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
      }

      .mid-val {
        padding: 4px 0;
        font-weight: 400;
        font-size: 15px;
        color: #FFFFFF;
      }

      .bot-change {
      }


    }
  }
}
</style>
