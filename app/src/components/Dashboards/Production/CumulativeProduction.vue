<template>
  <div class="full-h full-w">
    <div class="subTitle">
      <div class="tit">Oil Production</div>
      <div class="tit">Gas Production</div>
    </div>
    <div class="bottomBlock">
      <div class="block">
        <div class="itemData">
          <div class="numT">Monthly </div>
          <div class="num"> {{productionData["Monthly Oil Delivery"]?convertUnit(productionData["Monthly Oil Delivery"].value,1000):'Unknown'}}</div>
          <div class="numT">Mbbl</div>
        </div>
        <div class="itemData">
          <div class="numT">Annual </div>
          <div class="num"> {{productionData["Annual Oil Delivery"]?convertUnit(productionData["Annual Oil Delivery"].value,1000000):'Unknown'}}</div>
          <div class="numT">MMbbl</div>
        </div>
      </div>
      <div class="block">
        <div class="itemData">
          <div class="numT">Monthly </div>
          <span class="num"> {{productionData["Monthly Gas Delivery"]?convertUnit(productionData["Monthly Gas Delivery"].value,1):'Unknown'}}</span>
          <div class="numT">{{gasUnit}}</div>
        </div>
        <div class="itemData">
          <div class="numT">Annual </div>
          <span class="num"> {{productionData["Annual Gas Delivery"]?convertUnit(productionData["Annual Gas Delivery"].value,1):'Unknown'}}</span>
          <div class="numT">{{gasUnit}}</div>
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
export default {
  name: "CumulativeProduction",
  data(){
    return{
      gasUnit:'',
      productionData:{},
      seriesData:{}
    }
  },
  methods:{
    convertUnit(value, rate) {
      return parseFloat((value / rate).toFixed(2)).toLocaleString()
    },
    convertData(series, value) {
      if (series.dataType === "Decimal") {
        return parseFloat(parseFloat(value).toFixed(series.precision));
      }
      return value;
    },
    getData(date){
      Promise.all([
        getNodeDetail("Majnoon"),
        getSeriesLatestValues("Majnoon", [
          "Cumulative Oil Delivery",
          "Cumulative Gas Delivery",
          "Annual Oil Delivery",
          "Annual Gas Delivery",
          "Monthly Oil Delivery",
          "Monthly Gas Delivery",
        ], null, null, date),
      ]).then(([MajnoonMeta,MajnoonData])=>{
        this.seriesData.Majnoon = MajnoonMeta.data.model.time_series.reduce(
          (result, item) => {

            result[item.name] = item;
            return result;
          },
          {}
        );
        this.productionData = MajnoonData.data.reduce((result, item) => {
          item.value=this.convertData(this.seriesData.Majnoon[item.name],item.value)
          result[item.name] = item;
          return result;
        }, {});
        this.gasUnit=this.productionData["Cumulative Gas Delivery"].unit
      })
    }
  },
  created() {
    this.getData(config.general.date)
  },
  mounted () {
    EventBus.$on("date-updated", this.getData)
  }
}
</script>

<style lang="scss" scoped>
* {
  font-family: HarmonyOS_Sans;
}
.subTitle{
  display: flex;
  //margin: 8px 0 5px 0;
}
.tit{
  flex: 1;
}
.bottomBlock{
  display: flex;
  .block{
    flex: 1;
    margin-right: 16px;
    margin-top: 5px;
    border-radius: 4px;
    background: linear-gradient(180deg, rgba(29, 174, 255, 0.1) 0%, rgba(29, 174, 255, 0) 100%);
    .itemData{
      padding:7px 14px;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      .numT{
        font-family: 'HarmonyOS_Sans';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 14px;
        color: rgba(255, 255, 255, 0.7);
        height: 14px;
      }
      .num{

        font-family: 'HarmonyOS_Sans';
        //border: 0.5px solid rgba(165, 201, 255, 0.4);
        font-style: italic;
        font-weight: 700;
        font-size: 20px;
        line-height: 24px;
        color: #3DE1EF;
      }
    }
  }
}



</style>
