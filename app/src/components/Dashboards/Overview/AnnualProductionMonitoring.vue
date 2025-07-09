<template>
  <div class="full-h container">
    <div class="block">
      <div class="title">Wells Drilling Status</div>
      <div class="innerBlock">
        <div class="background blue">
          <v-chart style="width: 100%;height: 100%" :options="chartsOption" autoresize></v-chart>
        </div>
        <div class="selectButtons">
          <div class="selectTitle blue">Annual Plan</div>
          <div class="selectButton blue">Q1</div>
          <div class="selectButton blue">Q2</div>
          <div class="selectButton blue">Q3</div>
          <div class="selectButton blue">Q4</div>
        </div>
      </div>
    </div>
    <div class="block">
      <div class="title">Wells Connection Status</div>
      <div class="innerBlock">
        <div class="background purple">
          <v-chart style="width: 100%;height: 100%" :options="chartsOption1" autoresize></v-chart>
        </div>
        <div class="selectButtons">
          <div class="selectTitle purple">Annual Plan</div>
          <div class="selectButton purple">Q1</div>
          <div class="selectButton purple">Q2</div>
          <div class="selectButton purple">Q3</div>
          <div class="selectButton purple">Q4</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {
  getNodeDetail,
  getSeriesHistoryValues
} from "@/assets/js/api/hierarchy";
import {MonthMap} from "@/utils";

export default {
  name: "AnnualProductionMonitoring",
  computed: {
    chartsOption() {
      return {
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['70%', '90%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              itemStyle:{
                color:'#268aff'
              },
            },
            labelLine: {
              show: false
            },
            selectedMode: true,
            select:{
              label:{
                show:true,
                color:'#268AFF',
                fontWeight:400,
                fontSize:24
              },
              itemStyle:{

                  color:'#268aff'

              }
            },
            itemStyle:{
              color:'#0d1e34',
              borderColor: '#081c31',
              borderWidth: 1
            },
            selectedOffset:0,
            data: [
              { value: 1048, name: 'Q1',},
              { value: 735, name: 'Q2' },
              { value: 580, name: 'Q3' },
              { value: 484, name: 'Q4' },
            ]
          }
        ]
      };
    },
    chartsOption1() {
      return {
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['70%', '90%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              itemStyle:{
                color:'#268aff'
              },
            },
            labelLine: {
              show: false
            },
            selectedMode: true,
            select:{
              label:{
                show:true,
                color:'#268AFF',
                fontWeight:400,
                fontSize:24
              },
              itemStyle:{

                color:'#268aff'

              }
            },
            itemStyle:{
              color:'#0d1e34',
              borderColor: '#081c31',
              borderWidth: 1
            },
            selectedOffset:0,
            data: [
              { value: 1048, name: 'Q1',},
              { value: 735, name: 'Q2' },
              { value: 580, name: 'Q3' },
              { value: 484, name: 'Q4' },
            ]
          }
        ]
      };
    }
  },
  watch:{

  },
  data() {
    return {
      dateArr: [],
      dateLength: 0,
      productionData: {
        Plan: [],
        Actual: []
      }
    };
  },
  methods: {
    convertData(value) {
      return parseInt(parseInt(value) / 1000);
    },
    getData() {
      let Time = new Date();
      let q = 0;
      if (Time.getMonth() < 3) {
        q = 1;
      } else if (Time.getMonth() < 6) {
        q = 2;
      } else if (Time.getMonth() < 9) {
        q = 3;
      } else {
        q = 4;
      }

      let endTime = new Date(Time.getFullYear(), (q - 1) * 3, 0);

      let startTime = new Date();
      startTime.setFullYear(
        endTime.getFullYear() - 1,
        endTime.getMonth() + 1,
        1
      );
      getSeriesHistoryValues(
        "Majnoon",
        ["Quarterly Oil Production", "Quarterly Oil Production Plan"],
        {
          aggregation: "quarter",
          method: "latest",
          startAt: startTime,
          endAt: Time
        }
      ).then(res => {
        res.data["Quarterly Oil Production"].values.reduce((result, item) => {
          let q = "";
          let mouth = MonthMap[new Date(item.time).getMonth()];
          if (mouth === "Jan") {
            q = "Q1";
          } else if (mouth === "Apr") {
            q = "Q2";
          } else if (mouth === "Jul") {
            q = "Q3";
          } else {
            q = "Q4";
          }
          this.dateArr.push(`${new Date(item.time).getFullYear()} ${q}`);
          this.productionData.Actual.push(this.convertData(item.value));
        }, {});
        this.dateLength = this.dateArr.length;
        res.data["Quarterly Oil Production Plan"].values.reduce(
          (result, item) => {
            this.productionData.Plan.push(this.convertData(item.value));
          },
          {}
        );
      });
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
}

.title {
  font-family: 'HarmonyOS_Sans';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  margin-bottom: 7px;
}

.block {
  flex: 1;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
}

.innerBlock {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
}

.background {
  height: 100%;
  aspect-ratio: 1;
  margin-right: 13px;
  //border: 1px solid white;
  &.blue{
    background-size: 100%;
    background-image: url("~@/assets/images/pc/echartBackground2.png");
  }
  &.purple{
    background-size: 100%;
    background-image: url("~@/assets/images/pc/echartBackground1.png");
  }
}

.selectButtons {
  flex-grow: 1;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .blue {
    background: rgba(38, 138, 255, 0.05);
  }

  .selectButton.blue:hover {
    background: rgba(38, 138, 255, 0.3);
  }

  .purple {
    background: rgba(154, 120, 245, 0.05);
  }

  .selectButton.purple:hover {
    background: rgba(154, 120, 245, 0.3);
  }

  .selectTitle {
    flex: 1;
    width: 100%;
    text-align: center;
    font-family: 'HarmonyOS_Sans';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
  }

  .selectButton {
    margin-top: 5px;
    flex: 1;
    width: 100%;
    font-family: 'HarmonyOS_Sans';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    cursor: pointer;
    text-align: center;

  }

}
</style>
