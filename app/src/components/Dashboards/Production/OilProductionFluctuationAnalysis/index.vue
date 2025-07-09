<template>
  <div class="full-h parent">
    <div class="top">
      <div :class="`tabs ${flag==='R'?'active':''}`" @click="changeTabs('R')">Relative Value</div>
      <div :class="`tabs ${flag==='A'?'active':''}`" @click="changeTabs('A')">Absolute Value</div>
    </div>
    <div class="middle">
      <div v-show="flag === 'R'" class="legends">
        <div class="legend">
          <span class="legendBlock blue"> </span> ≤{{ legendData.legendFirst }}%
        </div>
        <div class="legend">
          <span class="legendBlock yellow"> </span> ({{ legendData.legendFirst }}%,0)
        </div>
        <div class="legend">
          <span class="legendBlock orange"> </span> [0,{{ legendData.legendLast }}%)
        </div>
        <div class="legend">
          <span class="legendBlock red"> </span> ≥{{ legendData.legendLast }}%
        </div>
        <div class="legend">
          <span class="legendBlock dashed"> </span> OFF
        </div>
        <div class="legend">
          <img class="legendEditor" src="@/assets/images/pc/Frame 745.png" @click="showEditor">
        </div>
      </div>
      <div v-show="flag === 'A'" class="absolute-legends">
        <div class="legend">
          <span class="legendBlock blue"> </span> Positive
        </div>
        <div class="legend">
          <span class="legendBlock yellow"> </span> Negative
        </div>
      </div>
    </div>
    <div class="bottom">
      <div v-show="flag==='R'">
        <div class="wells">
          <div v-for="(well, index) in wellItemData" :class="`well-item ${checkClass(well.name)}`"
               v-if="wellsData[well.name] && wellsData[well.name].status"
               @click="chartClickFn(well.name)">
            <el-tooltip class="item" effect="dark" placement="bottom" :visible-arrow="false">
              <div slot="content">
                <div class="littleTip" v-if="well.yDate">{{well.yDate}} : {{ well.yesterday.toFixed(2) }} {{well.unit}}<br/></div>
                <div class="littleTip" v-if="well.tDate">{{well.tDate}} : {{ well.today.toFixed(2) }} {{well.unit}}<br/></div>
                <div >Relative Value : {{ well.percent.toFixed(3) }} %</div>
              </div>
              <div class="item-in">{{ well.name }}</div>
            </el-tooltip>
          </div>
          <div class="list" v-for="item in (5-wellItemData.length%5)" v-if="wellItemData.length%5 > 0"></div>
        </div>
        <!--        未开的油井-->
        <div class="wells">
          <div :class="`well-item ${checkClass(well.name)}`" v-for="(well, index) in wells"
               v-if="wellsData[well.instanceId] && !wellsData[well.instanceId].status"
               @click="chartClickFn(well.instanceId)">
            <div class="item-in">{{ well.name }}</div>
          </div>
          <div class="list" v-for="item in (5-(wells.length-wellItemData.length)%5)" v-if="(wells.length-wellItemData.length)%5 > 0"></div>
        </div>
      </div>
      <div class="absolute" v-show="flag==='A'">
        <div class="wells">
          <div class="well-item" v-for="(well, index) in absoluteData"
               :class="checkAbClass(well.name)" @click="chartClickFn(well.name)">
            <el-tooltip class="item" effect="dark" placement="bottom"  :visible-arrow="false">
              <div slot="content">
<!--                <div v-if="well.status">-->
                  <div class="littleTip" v-if="well.yDate">{{well.yDate}} : {{ well.yesterday.toFixed(2) }} {{well.unit}}<br/></div>
                  <div class="littleTip" v-if="well.tDate">{{well.tDate}} : {{ well.today.toFixed(2) }} {{well.unit}}<br/></div>
                  <div>Absolute Value : {{ well.diff.toFixed(2) }} {{well.unit}}</div>
<!--                </div>-->
<!--                <div v-else>-->
<!--                  <div>Well is closed</div>-->
<!--                </div>-->
              </div>
              <div class="item-in">{{ well.name }}</div>
            </el-tooltip>
          </div>
          <div class="list" v-for="item in (5-wells.length%5)" v-if="wells.length%5 > 0"></div>
        </div>
      </div>
    </div>
    <edit-range v-if="editorView" :dialogVisible="editorView" :info="legendData"
                @action-finished="ChangeLegendData"></edit-range>
  </div>
</template>
<script>

import EventBus from "@/utils/EventBus";
import config from "@/config";
import {
  getNodeDetail,
  getMultipleSeriesHistoryValues,
  getMultipleSeriesLatestValues,
  getNodeChildren
} from "@/assets/js/api/hierarchy";
import EditRange from "./EditRange";

export default {
  name: 'OilProductionFluctuationAnalysis',
  components: {EditRange},
  data() {
    return {
      activeBtn: '',
      flag: 'R',
      editorView: false,
      legendData: {
        legendFirst: -10,
        legendLast: 10
      },
      stations: ['DS2', 'MJ-E20', 'MJ-E22', 'MJ-E24', 'MJ-F25'],
      seriesData: {},
      wellsData: {},
      wells: [],
      wellItemData: [],
      absoluteData: [],
    }
  },
  computed: {},
  methods: {
    //图例数据更新
    ChangeLegendData(success, f, l) {
      this.editorView = false
      if (success) {
        this.legendData.legendFirst = f;
        this.legendData.legendLast = l;
      }
    },
    showEditor() {
      this.editorView = true
    },
    changeTabs(res) {
      this.flag = res;
    },
    //relative类名添加
    checkClass(name) {
      let str = ''
      if (this.activeBtn === name) {
        str += 'active '
      }
      if (this.wellsData[name] && this.wellsData[name].status) {
        let pre = this.wellsData[name].percent

        if (pre <= this.legendData.legendFirst) {
          str += 'blue '
        } else if (pre > this.legendData.legendFirst && pre < 0) {
          str += 'yellow '
        } else if (pre >= 0 && pre < this.legendData.legendLast) {
          str += 'orange '
        } else if (pre >= this.legendData.legendLast) {
          str += 'red '
        }
      } else {
        str += 'dashed '
      }

      return str
    },
    //absolute类名添加
    checkAbClass(name) {
      let str = ''
      if (this.activeBtn === name) {
        str += 'active '
      }
      if (this.wellsData[name]) {
        str += this.wellsData[name].diff >= 0 ? 'blue ' : 'yellow '
      }
      return str
    },
    //模块点击事件
    chartClickFn(params) {
      this.activeBtn = params
      this.$bus.$emit("linkMapName", params, true)
    },
    getWells(date) {
      let endTime = date;
      let startTime = new Date(endTime.getFullYear(), endTime.getMonth(), endTime.getDate() - 3)
      Promise.all(this.stations.map(station => getNodeChildren(station, 'Well'))).then(results => {
        this.wells = results.reduce((res, result) => res.concat(result.data), [])
        let instanceIds = this.wells.map(item => item.instanceId)
        Promise.all([
          getNodeDetail(instanceIds[0]),
          getMultipleSeriesHistoryValues(instanceIds, ['Hrs Online', 'Daily Oil Production'],
            {
              startAt: startTime,
              endAt: endTime
            })
        ]).then(([WellsMeta, WellsData]) => {
          this.seriesData = WellsMeta.data.model.time_series.reduce((result, series) => {
            result[series.name] = series
            return result
          }, {})
          let _wellData = {}
          for (let key in WellsData.data) {
            let production = WellsData.data[key]["Daily Oil Production"].values
            let unit=WellsData.data[key]["Daily Oil Production"].unit
            let hrs = WellsData.data[key]["Hrs Online"].values
            //建立日期索引
            let dates = production.concat(hrs).reduce((result, item) => {
              let date = new Date(item.time)
              result[date.format('yyyy-MM-dd')] = date
              return result
            }, {})
            dates = Object.values(dates)
            dates.sort((d1, d2) => d1 - d2)
            dates = dates.reduce((result, date, index) => {
              result[date.format('yyyy-MM-dd')] = index
              return result
            }, {})
            //返回空数组，没有最近两天的数据
            if (hrs.length === 0 || production.length === 0) {
              _wellData[key] = {
                name: key,
                status: false,
                diff: 0,
                today: 0,
                yesterday: 0,
                unit:unit
              }
              continue
            }
            //返回数据只有昨天没有今天的
            if (hrs.length === 1 && production.length === 1) {
              let yesterday = new Date(hrs[0].time).format('yyyy-MM-dd')
              let yeD = 0
              if (production[dates[yesterday]]) {
                yeD = parseFloat(production[dates[yesterday]].value)
              }
              if (hrs[hrs.length - 1].value === 0) {
                //昨天关闭
                _wellData[key] = {
                  name: key,
                  status: false,
                  diff: yeD,  //0
                  today: 0,
                  yesterday: yeD,   //0
                  yDate:yesterday,
                  unit:unit
                }
              } else {
                //  昨天开启
                _wellData[key] = {
                  name: key,
                  status: true,
                  percent: -100,
                  diff: -yeD,
                  today: 0,
                  yesterday: yeD,
                  yDate:yesterday,
                  unit:unit
                }
              }
              continue
            }
            //返回两天的数据
            let today = new Date(hrs[hrs.length - 1].time).format('yyyy-MM-dd')
            let yesterday = new Date(hrs[hrs.length - 2].time).format('yyyy-MM-dd')
            let toD = 0
            if (production[dates[today]]) {
              toD = parseFloat(production[dates[today]].value)
            }
            let yeD = parseFloat(production[dates[yesterday]].value)
            if (parseInt(hrs[hrs.length - 1].value) === 0 && parseInt(hrs[hrs.length - 2].value) === 0) {
              //两天井全部关闭
              _wellData[key] = {
                name: key,
                status: false,
                diff: 0,
                today: 0,
                tDate:today,
                yesterday: 0,
                yDate:yesterday,
                unit:unit
              }
            } else if (parseInt(hrs[hrs.length - 2].value) === 0 && parseInt(hrs[hrs.length - 1].value) !== 0) {
              //昨天关闭，今天开启
              _wellData[key] = {
                name: key,
                status: false,
                diff: toD - yeD,
                today: toD,
                yesterday: 0,
                tDate:today,
                yDate:yesterday,
                unit:unit
              }
            } else {
              //两天都开启和今天关闭昨天开启
              _wellData[key] = {
                name: key,
                status: true,
                percent: ((toD - yeD) / yeD) * 100,
                diff: toD - yeD,
                today: toD,
                yesterday: yeD,
                tDate:today,
                yDate:yesterday,
                unit:unit
              }
            }
          }
          let arr = []
          let positiveArr = []
          let negativeArr = []
          for (let a in _wellData) {
            if (_wellData[a].status) {
              arr.push(_wellData[a])
            }
            _wellData[a].diff >= 0 ? positiveArr.push(_wellData[a]) : negativeArr.push(_wellData[a])
          }
          arr.sort((a, b) => {
            return b.percent - a.percent
          })
          positiveArr.sort((a, b) => {
            return b.diff - a.diff
          })
          negativeArr.sort((a, b) => {
            return Math.abs(b.diff) - Math.abs(a.diff)
          })

          this.absoluteData = positiveArr.concat(negativeArr)
          this.wellItemData = arr
          this.wellsData = _wellData
        })
      })
    }
  },
  created() {
    this.getWells(config.general.date)
  },
  mounted () {
    EventBus.$on("date-updated", this.getWells)
  }
}
</script>
<style lang="scss" scoped>
* {
  font-family: HarmonyOS_Sans;
}
.parent{
  //background: linear-gradient(360deg, #051220 0%, rgba(5, 18, 32, 0.3) 100%);
}
.bottom{
  height: calc(100% - 77px);
  overflow: scroll;
}
.middle {
  height: 30px;
}

.top {
  display: flex;
  justify-content: center;

  .tabs {
    margin: 10px 12px 8px;
    border: 1px solid #3DE1EF;
    padding: 4px 11px;
    border-radius: 4px;
    cursor: pointer;
    color: #3DE1EF;
  }

  .active {
    background: #32CFDC;
    color: #000000;
  }
}

.legendEditor {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.absolute-legends {
  display: flex;
  justify-content: center;
  margin-bottom: 14px;

  .legend {
    margin: 0 14px;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: rgba(255, 255, 255, 0.7);

    .legendBlock {
      display: inline-block;
      width: 9px;
      height: 9px;
    }

    .yellow {
      background: #F6E75A;
      border: 1px solid #F6E75A;
    }

    .blue {
      border: 1px solid #4FACFF;
      background-color: #4FACFF;
    }
  }
}

.orange {
  background: rgba(238, 146, 18, 0.3);
  border: 2px solid #EE9212;
}

.orange:hover {
  background: rgba(238, 146, 18, 0.7);
}

.orange.active {
  background: rgba(238, 146, 18, 0.5);
}

.blue {
  background:  rgba(79, 172, 255, 0.3);;
  border: 2px solid #4FACFF;
}

.blue:hover {
  background:  rgba(79, 172, 255, 0.7);;
}

.blue.active {
  background:  rgba(79, 172, 255, 0.5);;
}

.yellow {
  background: rgba(246, 231, 90, 0.3);
  border: 2px solid #F6E75A;
}

.yellow:hover {
  background: rgba(246, 231, 90, 0.7);
}

.yellow.active {
  background: rgba(246, 231, 90, 0.5);
}

.red {
  background: rgba(229, 101, 71, 0.3);
  border: 2px solid #E56547;
}

.red:hover {
  background: rgba(229, 101, 71, 0.7);
}

.red.active {
  background: rgba(229, 101, 71, 0.5);
}

.dashed {
  border: 2px dashed rgba(255, 255, 255, 0.7);
}

.dashed:hover {
  background: rgba(255, 255, 255, 0.3);
}

.dashed.active {
  background: rgba(255, 255, 255, 0.1);
}

.legends {
  display: flex;
  justify-content: space-around;
  margin-bottom: 14px;

  .legend {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: rgba(255, 255, 255, 0.7);

    .legendBlock {
      display: inline-block;
      width: 9px;
      height: 9px;
    }

    .orange {
      background: rgba(238, 146, 18, 0.3);
      border: 1px solid #EE9212;
    }

    .blue {
      background: rgba(54, 149, 255, 0.3);
      border: 1px solid #4FACFF;
    }

    .yellow {
      background: rgba(246, 231, 90, 0.3);
      border: 1px solid #F6E75A;
    }

    .red {
      background: rgba(229, 101, 71, 0.3);
      border: 1px solid #E56547;
    }

    .dashed {
      border: 1px dashed rgba(255, 255, 255, 0.7);
    }
  }
}


.wells {
  display: flex;
  justify-content: space-between;
  flex-flow: row wrap;
  text-align: center;

  .well-item {
    flex: 0 0 16.7%;
    margin-bottom: 12px;
    width: 61px;
    border-radius: 4px;

    .item-in {
      line-height: 32px;
      cursor: pointer;
    }

  }

  .list {
    content: '';
    flex: 0 0 16.7%;
  }
}
.littleTip{
  margin-bottom: 10px;
}

.wellOff {
  background: #FF682F;
}
</style>
<style lang="scss">
.el-tooltip__popper.is-dark{

  padding: 10px;
  background: #141B25;
  border: 0.5px solid #3DE1EF;
  box-shadow: 0px 0px 4px rgba(61, 225, 239, 0.25);
  border-radius: 4px;
  color: #ffffff;
}
</style>
