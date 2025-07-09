<template>
  <div class="full-h">
    <div class="top-legends">
      <div class="m-r-20 legend">
        <div class="legend-item blue"></div>
        Yesterday
      </div>
      <div class="legend">
        <div class="legend-item yellow"></div>
        Today
      </div>
    </div>
    <div class="main-content">
      <div v-for="item of sortChartData" class="list-item">
        <div class="item-type">{{ item.type }}</div>
        <div class="item-detail">
          <div class="detail-top">
            <div class="well-name">{{ item.name }}
              <div :class="item.wellType === 'Sour' ? 'well-type-sour':'well-type-sweet'">
                {{ item.wellType }}
              </div>
            </div>
            <div class="unit">{{ item.reservoir }}</div>
          </div>
          <div class="detail-bottom">
            <div class="progress">
              <div class="progress-item m-b-10 m-t-5" >
                <div class="progress-bar"
                     style="background-color: #4FACFF"
                     :style="getProp(item.yesterday, item.today+item.yesterday)"></div>
                {{ item.yesterday }}
              </div>
              <div class="progress-item">
                <div class="progress-bar"
                     style="background-color: #F6E75A"
                     :style="getProp(item.today, item.today+item.yesterday)"></div>
                {{ item.today }}
              </div>
            </div>
            <div class="change" :class="item.diff > 0 ? 'up':'down'"><span
              v-if="item.diff > 0">+</span>{{ `${item.change}` }}%
            </div>
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
  getMultipleSeriesHistoryValues,
  getMultipleSeriesLatestValues,
  getNodeDetail,
  getNodesByModel,
  getSeriesHistoryValues
} from "@/assets/js/api/hierarchy";
import {getStaticAttributeValues, getMultipleAttributeValues} from "../../../assets/js/api/hierarchy";

export default {
  name: "HrsChokeTHP",
  computed: {},
  data() {
    return {
      chartData: [],
      sortChartData: [],
    };
  },
  methods: {
    getProp(current, total) {
      return `width:${(current / total) * 100}%`
    },
    getData(date) {
      let today = date;
      let timeStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);
      // 获取 well 的 instanceId 数组
      getNodesByModel("Well").then(result => {
        let wellNames = result.data.map(item => item.instanceId);

        getMultipleSeriesHistoryValues(
          wellNames,
          ["THP", "Hrs Online", "Choke"],
          {
            aggregation: "day",
            method: "latest",
            startAt: timeStart,
            endAt: today
          }
        ).then(res => {
          getMultipleSeriesLatestValues(wellNames, ['Reservoir']).then(reservoir => {
            getMultipleAttributeValues(wellNames, ['Well Type']).then(attrs => {
              this.chartData = []
              this.sortChartData = []
              wellNames.map(name => {
                for (let key in res.data[name]) {
                  let wellItem = res.data[name][key]
                  if (wellItem.values && wellItem.values.length >= 2 && wellItem.values[wellItem.values.length - 2].value !== '0') {
                    let todayData = parseFloat(wellItem.values[wellItem.values.length - 1].value)
                    let yesterdayData = parseFloat(wellItem.values[wellItem.values.length - 2].value)
                    let diff = todayData - yesterdayData
                    let change = ((diff / yesterdayData) * 100).toFixed(1)
                    let reservoirName = reservoir.data[name][0].value
                    let wellType = attrs.data[name]['Well Type'].value
                    this.chartData.push({
                      name: name,
                      today: todayData,
                      yesterday: yesterdayData,
                      diff: diff,
                      type: key,
                      change: change,
                      reservoir: reservoirName,
                      wellType: wellType
                    })
                  }
                }
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
                return b.change - a.change
              })
              this.sortChartData = this.sortChartData.filter(item => item.change !== "0.0").concat(this.sortChartData.filter(item => item.change === "0.0"))
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
  font-family: HarmonyOS_Sans;
}

.top-legends {
  height: 14px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 6px;

  .legend {
    display: flex;
    align-items: center;
  }

  .legend-item {
    width: 9px;
    height: 9px;
    margin-right: 4px;
  }

  .blue {
    background-color: #4facff;
  }

  .yellow {
    background-color: #f6e75a;
  }
}

.main-content {
  height: calc(100% - 14px);
  overflow: scroll;

  .list-item {
    height: 62px;
    background: linear-gradient(90deg, rgba(29, 174, 255, 0.1) 0%, rgba(29, 174, 255, 0.03) 100%);
    border-radius: 4px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    padding: 6px 8px;

    .item-type {
      text-align: center;
      background: rgba(217, 217, 217, 0.1);
      border-radius: 4px;
      width: 55px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: 700;
    }

    .item-detail {
      flex-grow: 1;
      margin-left: 10px;

      .detail-top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .unit {
          text-align: right;
          font-weight: 400;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .well-name {
          display: flex;

          .well-type-sour {
            margin-left: 5px;
            padding: 1px 3px;
            background-color: rgba(246, 90, 90, 0.1);
            color: #F65A5A;
            font-size: 12px;
            border-radius: 4px;
            font-weight: 400;
          }

          .well-type-sweet {
            margin-left: 5px;
            padding: 1px 3px;
            background-color: rgba(69, 224, 159, 0.1);
            font-size: 12px;
            color: #45E09F;
            border-radius: 4px;
            font-weight: 400;
          }
        }
      }

      .detail-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .change {
          font-size: 16px;
          font-weight: 700;
          text-align: right;
        }

        .progress {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-right: 5px;

          .progress-item {

            border-radius: 8px;
            height: 4px;
            background-color: black;
            display: flex;
            justify-content: flex-start;
            align-items: center;

            .progress-bar {
              border-radius: 8px;
              height: 4px;
              margin-right: 3px
            }
          }
        }

        .up {
          color: #f65a5a;
        }

        .down {
          color: #45e09f;
        }
      }

    }
  }
}

:deep(.el-progress-bar__outer) {
  background-color: #000000;
}
</style>
