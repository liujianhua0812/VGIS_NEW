<template>
  <div class="workedContainer">
    <div class="workedBlock">
      <div class="block">
        <div class="itemData">
          <div class="numT">Monthly</div>
          <div class="num">
            {{ productionData["Hours worked"] ? convertUnit(productionData["Hours worked"].value, 1) : 'unkonwn' }}
          </div>
        </div>
      </div>
      <div class="block">
        <div class="itemData">
          <div class="numT">Annual</div>
          <div class="num"> {{
              productionData["Hours worked Annually"] ? convertUnit(productionData["Hours worked Annually"].value, 1) : 'unknown'
            }}
          </div>
        </div>

      </div>
    </div>
    <div class="bottom">
      <div class="btBlock">
        <div class="tip">LTI</div>
        <div class="data">{{ productionData["Days Worked Since Last LTI"] ? convertUnit(productionData["Days Worked Since Last LTI"].value, 1) : 'unkonwn' }}</div>
      </div>
      <div class="btBlock">
        <div class="tip">Incident</div>
        <div class="data">{{ productionData["Days Worked Since Last Incident"] ? convertUnit(productionData["Days Worked Since Last Incident"].value, 1) : 'unkonwn' }}</div>
      </div>
      <div class="btBlock">
        <div class="tip">Medical Case</div>
        <div class="data">{{ productionData["Days Worked Since Last Medical Case"] ? convertUnit(productionData["Days Worked Since Last Medical Case"].value, 1) : 'unkonwn' }}</div>
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

export default {
  name: "HoursWorked",
  data() {
    return {
      gasUnit: '',
      productionData: {},
      seriesData: {}
    }
  },
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
      Promise.all([
        getNodeDetail("Majnoon"),
        getSeriesLatestValues("Majnoon", [
          "Hours worked",
          "Hours worked Annually",
          "Days Worked Since Last LTI",
          "Days Worked Since Last Incident",
          "Days Worked Since Last Medical Case"
        ], null, null, date),
      ]).then(([HoursMeta, Data]) => {
        this.seriesData.Majnoon = HoursMeta.data.model.time_series.reduce(
          (result, item) => {
            result[item.name] = item;
            return result;
          },
          {}
        );
        this.productionData = Data.data.reduce((result, item) => {
          item.value = this.convertData(this.seriesData.Majnoon[item.name], item.value)
          result[item.name] = item;
          return result;
        }, {});
      })

    }
  },
  created() {
    this.getData(config.general.date)
  },
  mounted() {
    EventBus.$on("date-updated", this.getData)
  },
}
</script>

<style lang="scss" scoped>
.subTitle {
  display: flex;
  margin: 8px 0 5px 0;
}

.tit {
  flex: 1;
}

.workedContainer {
  display: flex;
  flex-direction: column;
  height: 100%;

  .workedBlock {
    display: flex;
    margin-top: 6px;
    height: 150px;
    margin-bottom: 10px;

    .block {
      flex: 1;
      background-size: 55%;
      background-repeat: no-repeat;
      background-position: center;
      background-image: url("~@/assets/images/dashboard/tig.png");

      .itemData {
        text-align: center;

        .numT {
          font-family: 'HarmonyOS_Sans';
          font-style: normal;
          font-weight: 400;
          font-size: 12px;
          color: #FFFFFF;
        }

        .num {
          margin-top: 15px;
          font-family: 'HarmonyOS_Sans';
          font-weight: 700;
          font-size: 30px;
          color: #3DE1EF;
        }
      }
    }
  }

  .bottom {
    display: flex;
    justify-content: space-around;
    flex-grow: 1;

    .btBlock {
      border-radius: 4px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 0 0 28%;
      height: 100%;
      background: linear-gradient(180deg, rgba(29, 174, 255, 0.1) 0%, rgba(29, 174, 255, 0) 100%);
      .tip{
        color: rgba(255, 255, 255, 0.7);
      }
      .data{
        font-family: 'HarmonyOS_Sans';
        font-style: normal;
        font-weight: 700;
        font-size: 15px;
        color: #3DE1EF;
      }
    }
  }
}


</style>
