<template>
  <div class="full-h full-w parent">
    <div class="firstPart">
      <div class="topFont">Export</div>
      <div class="topFont"> ({{ OilProductionUnit }})</div>
      <div class="backStyle">
        <div class="fontStyle blue">{{ OilProduction.toLocaleString() }}</div>
        <div
          :class="`littleFont ${OilVariation>0?'orange':'green'}`">{{
            OilVariation >= 0 ? '+' : ''
          }}{{ OilVariation.toLocaleString() }}</div>
      </div>
    </div>
    <div class="middlePart">
      <div class="item">
        <div class="top-date">
          Month (Mbbl)
        </div>
        <div>
          <span class="mid-val blue">
          {{
              productionData.Month[productionData.Month.length - 1]
                ? convertUnit(productionData.Month[productionData.Month.length - 1], 1000)
                : "Unknown"
            }}
        </span>
          <span :class="`bot ${productionData.MoM>0?'orange':'green'}`">
          {{
              productionData.MoM >= 0 ? '+ ' : ''
            }}{{ productionData.MoM ? convertUnit(productionData.MoM, 1000) : "Unknown" }}
        </span>
        </div>
      </div>
      <div class="item">
        <div class="top-date">
          Year (MMbbl)
        </div>
        <div>
          <span class="mid-val blue">
          {{
              productionData.Year[productionData.Year.length - 1]
                ? convertUnit(productionData.Year[productionData.Year.length - 1], 1000000)
                : "Unknown"
            }}
        </span>
          <span :class="`bot ${productionData.YoY>0?'orange':'green'}`">
          {{
              productionData.YoY >= 0 ? '+ ' : ''
            }}{{ productionData.YoY ? convertUnit(productionData.YoY, 1000000) : "Unknown" }}
        </span>
        </div>
      </div>
      <div class="item">
        <div class="top-date">
          Total (MMbbl)
        </div>
        <div>
          <span class="mid-val blue">
          {{
              productionData.latest["Cumulative Oil Delivery"] ?
                convertUnit(productionData.latest["Cumulative Oil Delivery"].value, 1000000) : 'Unknown'
            }}
        </span>
          <span class="bot yellow">
          RF {{ productionData.latest.recoveryRate }}%
        </span>
        </div>
      </div>
      <div class="item">
        <div class="top-date">
          Total Wells
        </div>
        <div>
          <span class="mid-val blue">
          {{
              productionData.latest["Total Wells"] ?
                productionData.latest["Total Wells"].value : 'Unknown'
            }}
        </span>
          <span class="bot yellow">
          Active: {{ productionData.latest["Total Active Wells"] ? productionData.latest["Total Active Wells"].value :'Unknown'}}
        </span>
        </div>
      </div>
    </div>
    <div class="lastPart">
      <div class="topBlock">
        <div class="openRate">
          <div class="m-t-7">Well Opening Rate</div>
          <div class="wellImg">
            <div class="contentImg" :style="`width: ${openRate}%;height: 100%;overflow: hidden`">
            <div class="mengban"></div></div>
          </div>
          <div class="fontStyle blue">{{openRate }}%</div>
          <div class="numBot"></div>
        </div>
        <div class="timeRate">
          <div class="m-t-7">Online TimeRate</div>
          <div class="timeBack"><TimeRate v-model="onlineRate"></TimeRate></div>

        </div>
      </div>
      <div class="bottomBlock">
        <div class="item">
          <div class="top-date">
            WC
          </div>
          <div class="mid-val blue">
            {{
              productionData.DS1["WC in Oil Export"]
                ? parseFloat(productionData.DS1["WC in Oil Export"].value).toFixed(2)
                : "Unknown"
            }} %
          </div>
        </div>
        <div class="item">
          <div class="top-date">
            Salt (PTB)
          </div>
          <div class="mid-val blue">
            {{
              productionData.DS1["Salt in Oil Export"]
                ? productionData.DS1["Salt in Oil Export"].value
                : "Unknown"
            }}
          </div>
        </div>
        <div class="item">
          <div class="top-date">
            H₂S (PPM)
          </div>
          <div class="mid-val blue">
            {{productionData.DS1["H₂S in Oil Export"]
            ? productionData.DS1["H₂S in Oil Export"].value
            : "Unknown"}}
          </div>
        </div>
        <div class="item">
          <div class="top-date">
            API
          </div>
          <div class="mid-val blue">
            {{productionData.DS1["API in Oil Export"]
            ? productionData.DS1["API in Oil Export"].value
            : "Unknown"}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import EventBus from "@/utils/EventBus";
import config from "@/config";
import {
  getNodeDetail,
  getSeriesLatestValues,
  getSeriesHistoryValues
} from "@/assets/js/api/hierarchy";
import TimeRate from "./TimeRate";
import {getMultipleSeriesLatestValues, getNodesByModel} from "@/assets/js/api/hierarchy";


export default {
  name: "OilProduction",
  components: {
    TimeRate
  },
  data() {
    return {
      OilProduction: "",
      OilProductionUnit: "",
      OilVariation: "",
      exportData:{},
      onlineRate:'',
      openRate:'',
      productionData: {
        Month: [],
        Year: [],
        latest: {
          recoveryRate: ''
        }
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
    getData(date) {
      // 今天
      let today = date;
      let zeroHour = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      let before = new Date(zeroHour.getFullYear(), zeroHour.getMonth(), zeroHour.getDate() - 2);
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
            this.onlineRate = ((onlineH / totalH) * 100).toFixed(0);
          } else {
            this.onlineRate = 0;
          }
        });
      });
      Promise.all([
        getNodeDetail("DS1"),
        getNodeDetail("Majnoon"),
        getSeriesLatestValues("DS1", [
          "Daily Oil Export",
          "WC in Oil Export",
          "Salt in Oil Export",
          "H₂S in Oil Export",
          "API in Oil Export"
        ], null, null, today),
        getSeriesLatestValues("Majnoon", [
          "Cumulative Oil Delivery",
          "Total Oil Reserve",
          "Production Target",
          "Total Active Wells",
          "Total Wells"
        ], null, null, today),
        getSeriesHistoryValues(
          "Majnoon",
          ["Monthly Oil Delivery"],
          {
            aggregation: "month",
            method: "latest",
            startAt: beforeMonth,
            endAt: today
          }
        ),
        getSeriesHistoryValues(
          "Majnoon",
          ["Annual Oil Delivery"],
          {
            aggregation: "year",
            method: "latest",
            startAt: beforeYear,
            endAt: today
          }
        ),
      ]).then(
        ([DS1Meta, MajnoonMeta, DS1, Latest, LastMonth, LastYear]) => {
          this.seriesData.DS1 = DS1Meta.data.model.time_series.reduce(
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
          //标题数据
          this.productionData.DS1 = DS1.data.reduce((result, item) => {
            result[item.name] = item;
            return result;
          }, {});

          this.productionData.latest = Latest.data.reduce((result, item) => {
            result[item.name] = item;
            return result;
          }, {});
          LastMonth.data["Monthly Oil Delivery"].values.reduce(
            (result, item) => {
              this.productionData.Month.push(parseFloat(item.value))
            },
            {}
          );
          this.productionData.MoM = this.convertData(this.seriesData.Majnoon["Monthly Oil Delivery"], this.productionData.Month[this.productionData.Month.length - 1] - this.productionData.Month[this.productionData.Month.length - 2])
          this.productionData.Month = this.productionData.Month.map(value => this.convertData(this.seriesData.Majnoon["Monthly Oil Delivery"], value))
          LastYear.data["Annual Oil Delivery"].values.reduce(
            (result, item) => {
              this.productionData.Year.push(parseFloat(item.value))
            },
            {}
          );
          this.productionData.YoY = this.convertData(this.seriesData.Majnoon["Annual Oil Delivery"], this.productionData.Year[this.productionData.Year.length - 1] - this.productionData.Year[this.productionData.Year.length - 2])
          this.productionData.Year = this.productionData.Year.map(value => this.convertData(this.seriesData.Majnoon["Annual Oil Delivery"], value))

          this.OilVariation = this.convertData(this.seriesData.DS1[this.productionData.DS1["Daily Oil Export"].name], this.productionData.DS1["Daily Oil Export"].value - this.productionData.latest["Production Target"].value);

          this.productionData.latest.recoveryRate = parseFloat(
            (
              (this.productionData.latest["Cumulative Oil Delivery"]
                  .value /
                this.productionData.latest["Total Oil Reserve"].value) *
              100
            ).toFixed(2)
          );
          this.productionData.latest["Cumulative Oil Delivery"].value = this.convertData(this.seriesData.Majnoon["Cumulative Oil Delivery"], this.productionData.latest["Cumulative Oil Delivery"].value)
this.openRate=((this.productionData.latest["Total Active Wells"].value/this.productionData.latest["Total Wells"].value)*100).toFixed(1)
          // console.log(this.productionData.latest["Total Active Wells"],this.productionData.latest["Total Wells"])
          this.OilProduction = this.convertData(
            this.seriesData.DS1[this.productionData.DS1["Daily Oil Export"].name],
            this.productionData.DS1["Daily Oil Export"].value
          );
          this.OilProductionUnit = this.productionData.DS1["Daily Oil Export"].unit;
        }
      );
    }
  },
  created() {
    this.getData(config.general.date);
  },
  mounted() {
    EventBus.$on("date-updated", this.getData)
  }
};
</script>

<style lang="scss" scoped>
* {
  font-family: HarmonyOS_Sans;
}
.orange {
  color: #F65A5A;
}
.yellow{
  color: #F6E75A;
}
.green {
  color: #45E09F;
}

.blue {
  color: #3DE1EF;
}

.parent {
  display: flex;
  justify-content: space-between;
  //padding-top: 6px;

  .firstPart{
    flex:3;
    height: 100%;
    text-align: center;
    background-image: url("~@/assets/images/dashboard/bigTig.png");
    background-repeat: no-repeat;
    background-size: 90%;
    background-position: center;
    position: relative;
    .topFont{
      font-style: normal;
      font-weight: 400;
      font-size: 26px;
    }
    .fontStyle{
      font-style: normal;
      font-weight: 700;
      font-size: 44px;
    }
    .littleFont{
      font-style: normal;
      font-weight: 400;
      font-size: 26px;
      line-height: 30px;
      position: absolute;
      width: 100%;
      text-align: center;
      bottom: 30px;
    }
  }
  .middlePart{
    flex:2;
    height: 100%;
    display: flex;
    max-width: 180px;
    margin-right: 30px;
    justify-content: space-between;
    flex-direction: column;
    .item{
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: linear-gradient(180deg, rgba(29, 174, 255, 0.1) 0%, rgba(29, 174, 255, 0.01) 100%);
      border-radius: 4px;
      padding: 7px;
      .top-date{
        color: rgba(255,255,255,0.7);
      }
      .mid-val{
        font-family: 'HarmonyOS_Sans';
        font-style: normal;
        font-weight: 700;
        font-size: 20px;
        line-height: 24px;
      }
      .bot{
        float: right;
        font-size: 16px;
        line-height: 24px;
      }
    }
  }
  .lastPart{
    flex:6;
    height: 100%;
    display: flex;
    flex-direction: column;
    .topBlock{
      height: 73%;
      display: flex;
      .openRate{
        flex: 1;
        .mengban{
          float: left;
          width: 200px;
          height: 100%;
          background-image: url("~@/assets/images/dashboard/fullwell.png");
          background-repeat: no-repeat;
          background-position: center;
        }
        .wellImg{
          position: relative;
          height: 60px;
          margin-top: 30px;
          background-image: url("~@/assets/images/dashboard/noneWell.png");
          background-repeat: no-repeat;
          background-position: center;
          z-index: 2;
        }
        .fontStyle{
          font-family: 'HarmonyOS_Sans';
          font-style: normal;
          font-weight: 700;
          font-size: 30px;
        }
        .numBot{
          width:100px;
          height: 5px;
          background-image: radial-gradient(50% 50% at 50% 50%, rgba(61, 225, 239, 0.55) 0%, rgba(61, 225, 239, 0) 100%);
        }
      }
      .timeRate{
        flex: 2;
        height: calc(100% - 21px);
        .timeBack{
          width: 100%;
          height: 100%;
          background-image: url("~@/assets/images/dashboard/block.png");
          background-repeat: no-repeat;
          background-size: 80%;
          background-position: center;
        }
      }
    }
    .bottomBlock{
      display: flex;
      flex-grow: 1;
      justify-content: space-between;
      .item{
        flex: 0 0 24%;
        text-align: center;
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        background: linear-gradient(180deg, rgba(29, 174, 255, 0.1) 0%, rgba(29, 174, 255, 0) 100%);
        .mid-val{
          font-family: 'HarmonyOS_Sans';
          font-style: normal;
          font-weight: 700;
          font-size: 20px;
          line-height: 24px;
          margin-top: 5px;
        }
      }
    }
  }
}
</style>
