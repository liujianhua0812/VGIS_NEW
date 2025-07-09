<template>
  <div class="full-h full-w parent" style="display: flex">
    <div class="full-h item left">
      <div class="total">
        <div class="total-item">
          <div class="a item-top-title">Total STOIIP</div>
          <div class="a item-num">{{ seriesData.copLimit ? (convertData(seriesData.copLimit["STOIIP"], total['STOIIP'])/1000000000).toFixed(2) : total['STOIIP'] }}</div>
          <div class="a item-top-title">Bin {{ unit['STOIIP'] }}</div>
        </div>
        <div class="total-item">
          <div class="a item-top-title">Total Rec. Reserves</div>
          <div class="a item-num">{{ seriesData.copLimit ?( convertData(seriesData.copLimit["Rec. Reserves"], total['Rec. Reserves'])/1000000000).toFixed(2) :total['Rec. Reserves'] }}</div>
          <div class="a item-top-title">Bin {{ unit['Rec. Reserves'] }}</div>
        </div>
      </div>
      <div class="detail">
        <div class="detail-item">
          <div class="progress-name">Mishrif / Ahmadi</div>
          <div class="progresses">
            <el-progress class="a" style="width: 29%" stroke-linecap="square" :show-text="false" color="#3DE1EF"
                         :percentage="Progresses['Mishrif / Ahmadi']"></el-progress>
            <el-progress class="a" style="width: 11%" stroke-linecap="square" :show-text="false" color="#3DE1EF"
                         :percentage="0"></el-progress>
            <el-progress class="a" style="width: 20%" stroke-linecap="square" :show-text="false" color="#3DE1EF"
                         :percentage="0"></el-progress>
            <el-progress class="a" style="width: 20%" stroke-linecap="square" :show-text="false" color="#3DE1EF"
                         :percentage="0"></el-progress>
            <el-progress class="a" style="width: 20%" stroke-linecap="square" :show-text="false" color="#3DE1EF"
                         :percentage="0"></el-progress>
          </div>
        </div>
        <div class="detail-item">
          <div class="progress-name">Zubair</div>
          <div class="progresses">
            <el-progress class="a" style="width: 29%" stroke-linecap="square" :show-text="false" color="#3DE1EF"
                         :percentage="0"></el-progress>
            <el-progress class="a" style="width: 11%" stroke-linecap="square" :show-text="false" color="#3DE1EF"
                         :percentage="Progresses['Zubair']"></el-progress>
            <el-progress class="a" style="width: 20%" stroke-linecap="square" :show-text="false" color="#3DE1EF"
                         :percentage="0"></el-progress>
            <el-progress class="a" style="width: 20%" stroke-linecap="square" :show-text="false" color="#3DE1EF"
                         :percentage="0"></el-progress>
            <el-progress class="a" style="width: 20%" stroke-linecap="square" :show-text="false" color="#3DE1EF"
                         :percentage="0"></el-progress>
          </div>
        </div>
        <div class="detail-item">
          <div class="progress-name">Hartha</div>
          <div class="progresses">
            <el-progress class="a" style="width: 29%" stroke-linecap="square" :show-text="false" color="#3DE1EF"
                         :percentage="0"></el-progress>
            <el-progress class="a" style="width: 11%" stroke-linecap="square" :show-text="false" color="#3DE1EF"
                         :percentage="0"></el-progress>
            <el-progress class="a" style="width: 20%" stroke-linecap="square" :show-text="false" color="#3DE1EF"
                         :percentage="Progresses['Hartha']"></el-progress>
            <el-progress class="a" style="width: 20%" stroke-linecap="square" :show-text="false" color="#3DE1EF"
                         :percentage="0"></el-progress>
            <el-progress class="a" style="width: 20%" stroke-linecap="square" :show-text="false" color="#3DE1EF"
                         :percentage="0"></el-progress>
          </div>
        </div>
        <div class="detail-item">
          <div class="progress-name">Nahr Umr</div>
          <div class="progresses">
            <el-progress class="a" style="width: 29%" stroke-linecap="square" :show-text="false" color="#3DE1EF"
                         :percentage="0"></el-progress>
            <el-progress class="a" style="width: 11%" stroke-linecap="square" :show-text="false" color="#3DE1EF"
                         :percentage="0"></el-progress>
            <el-progress class="a" style="width: 20%" stroke-linecap="square" :show-text="false" color="#3DE1EF"
                         :percentage="0"></el-progress>
            <el-progress class="a" style="width: 20%" stroke-linecap="square" :show-text="false" color="#3DE1EF"
                         :percentage="Progresses['Nahr Umr']"></el-progress>
            <el-progress class="a" style="width: 20%" stroke-linecap="square" :show-text="false" color="#3DE1EF"
                         :percentage="0"></el-progress>
          </div>
        </div>
      </div>
    </div>
    <v-chart
      class="item"
      style="height: 100%"
      :option="chartsOption"
      autoresize
    ></v-chart>
  </div>

</template>

<script>

import EventBus from "@/utils/EventBus";
import config from "@/config";
import {
  getNodeDetail, getNodeChildren, getMultipleSeriesLatestValues,
  getSeriesHistoryValues, getNodesByModel,
  getMultipleSeriesHistoryValues
} from "@/assets/js/api/hierarchy";

export default {
  name: "ReservoirProductionDynamic",
  computed: {
    chartsOption() {
      return {
        title: {
          text: "MMbbls",
          left: "-0.5%",
          textStyle: {
            fontWeight: "400",
            fontSize: 12,
            color: "rgba(255, 255, 255, 0.7)"
          }
        },
        textStyle: {
          fontSize: 12,
          color: "rgba(255,255,255,0.7)"
        },
        legend: {
          right: 0,
          itemGap: 24,
          icon: "rect",
          itemWidth: 9,
          itemHeight: 9,
          textStyle: {color: "rgba(255, 255, 255, 0.7)"},
        },
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
          right: 0,
          bottom: 0,
          top: 28,
          containLabel: true
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
            nameTextStyle: {
              color: "rgba(255,255,255,0.7)",
              nameLocation: "start"
            },
            textStyle: {
              fontSize: 12,
              color: "rgba(255,255,255,0.7)"
            }
          },
          data: this.xData
        },
        yAxis: [{
          nameGap: "10",
          type: "value",
          nameTextStyle: {
            align: "right"
          },
          axisLabel: {
            fontSize: 12
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              opacity: 0.1
            }
          }
        },{
          type: "value",
          nameTextStyle: {
            align: "left"
          },
          axisLabel: {
            fontSize: 12
          },
          minInterval: 1,
          splitLine: {
            show:false,
            lineStyle: {
              type: "dashed",
              opacity: 0.1
            }
          }
        }],
        series: [
          {
            name: "Cum. Production",
            type: "bar",
            barWidth: 10,
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              normal: {
                color: "#4FACFF"
              }
            },
            data: this.productionData.cumData
          }, {
            name: "Producers",
            type: "bar",
            barWidth: 10,
            yAxisIndex:1,
            barGap: '50%',
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              normal: {
                color: "#F6E75A"
              }
            },
            data: this.productionData.producersData
          }

        ]
      };
    }
  },
  data() {
    return {
      unit: {
        'STOIIP': '',
        'Rec. Reserves': '',
      },
      total: {
        'STOIIP': 0,
        'Rec. Reserves': 0,
      },
      Progresses: {
        'Mishrif / Ahmadi': 0,
        'Zubair': 0,
        'Hartha': 0,
        'Nahr Umr': 0
      },
      xData: [],
      proDatas: {
        'Mishrif / Ahmadi': {},
        'Zubair': {},
        'Hartha': {},
        'Nahr Umr': {},
      },
      productionData: {
        cumData: [],
        producersData: []
      },
      seriesData: {
      }
    };
  },
  methods: {
    convertData(series, value) {
      if (series.dataType === "Decimal") {
        return parseFloat(parseFloat(value).toFixed(series.precision))
      }
      return value;
    },
    getData(date) {
      getNodesByModel(["Reservoir"]).then(res => {
        let Names = res.data.map(item => item.instanceId);
        Promise.all([
          getNodeChildren('Ahmadi'),
          getNodeChildren('Mishrif')
        ]).then((res) => {
          this.proDatas['Mishrif / Ahmadi'].producers = res[0].data.length + res[0].data.length
        })
        for (let i = 0; i < Names.length; i++) {
          if (Names[i] !== 'Ahmadi' && Names[i] !== 'Mishrif') {
            getNodeChildren(Names[i]).then((res) => {
              this.proDatas[Names[i]].producers = res.data.length
            })
          }
        }
        Promise.all([
          getNodeDetail(Names[0]),
          getMultipleSeriesLatestValues(
            Names,
            ["Cumulative Oil Production"],
            null, null, date
          ),
          getMultipleSeriesLatestValues(
            Names,
            ['STOIIP', 'Rec. Reserves'],
            null, null, date
          ),
        ]).then(([Detail, LastOil, Last]) => {
          this.seriesData.copLimit = Detail.data.model.time_series.reduce((result, item) => {
            result[item.name] = item;
            return result;
          }, {});
          //=======================================================
          let son = 0, parent = 0
          for (let item in Last.data) {
            // 累加算出 Total STOIIP 和 Total Rec. Reserves， 以及单位赋值
            for (let moleDeno of Last.data[item]) {
              this.total[moleDeno.name] += Number(moleDeno.value)
              this.unit[moleDeno.name] = moleDeno.unit
            }
            // 非 Ahmadi 和 Mishrif 的，单独算出每个所占比例
            if (item !== 'Ahmadi' && item !== 'Mishrif') {
              let mole = 0, deno = 0
              for (let moleDeno of Last.data[item]) {
                moleDeno.name === 'STOIIP' ? mole = moleDeno.value : 0
                moleDeno.name === 'Rec. Reserves' ? deno = moleDeno.value : 0
              }
              this.Progresses[item] = deno ? (parseFloat(mole) / parseFloat(deno)) * 100 : 0
            }
            // Ahmadi 和 Mishrif 地层类型的算出 (Ahmadi + Mishrif 的实际值 / Ahmadi + Mishrif 总量)
            else {
              for (let moleDeno of Last.data[item]) {
                if (moleDeno.name === 'STOIIP') {
                  son = son + (isNaN(parseFloat(moleDeno.value)) ? 0 : parseFloat(moleDeno.value))
                }
                if (moleDeno.name === 'Rec. Reserves') {
                  parent = parent + (isNaN(parseFloat(moleDeno.value)) ? 0 : parseFloat(moleDeno.value))
                }
              }
            }
          }
          this.Progresses['Mishrif / Ahmadi'] = parent ? ((son) / (parent)) * 100 : 0
          //=======================================================


          let sumCum = this.convertData(this.seriesData.copLimit["Cumulative Oil Production"], LastOil.data['Mishrif'][0].value / 1000000)
          sumCum += this.convertData(this.seriesData.copLimit["Cumulative Oil Production"], LastOil.data['Ahmadi'][0].value / 1000000)
          this.proDatas['Mishrif / Ahmadi'].cum = sumCum
          for (let item in LastOil.data) {
            if (item !== 'Ahmadi' && item !== 'Mishrif') {
              LastOil.data[item][0].value = this.convertData(this.seriesData.copLimit["Cumulative Oil Production"], LastOil.data[item][0].value / 1000000)
              this.proDatas[item].cum = LastOil.data[item][0].value
            }
          }
          let x=[],Cum=[],Pro=[]
          for(let i in this.proDatas){
            x.push(i)
            Cum.push(this.proDatas[i].cum)
            Pro.push(this.proDatas[i].producers)
          }
          this.xData=x;
          this.productionData.cumData=Cum
          this.productionData.producersData=Pro


        })
      });
    },
  },
  created() {
    this.getData(config.general.date);
  },
  mounted() {
    EventBus.$on("date-updated", this.getData)
  }
}
</script>

<style lang="scss" scoped>
.parent {
  justify-content: space-between;
}

.item {
  flex: 0 0 48%;
}

.left {
  display: flex;
  justify-content: start;
  flex-direction: column;

  .total {
    //flex: 0 0 36%;
    display: flex;
    //flex-direction: column;
    justify-content: space-around;

    .total-item {
      flex: 0 0 46%;
      background: linear-gradient(180deg, rgba(29, 174, 255, 0.1) 0%, rgba(29, 174, 255, 0) 100%);
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      .a {
        //white-space: nowrap;
        //flex: 0 0 33%;
        //display: flex;
        //align-items: center;
      }

      .item-top-title {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
      }

      .item-num {
        font-family: 'HarmonyOS_Sans';
        font-style: normal;
        font-weight: 700;
        font-size: 20px;
        text-align: center;

        color: #3DE1EF;

      }
    }
  }

  .detail {
    flex: 0 0 60%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .detail-item {
      flex: 0 0 19%;
      display: flex;
      flex-direction: column;

      .progress-name {
        font-size: 14px;
      }

      .progresses {
        //height: 100px;
        display: flex;
        justify-content: space-between;

        .a {
          margin-right: 5px;
        }
      }
    }
  }
}

:deep(.el-progress-bar__outer) {
  background-color: #0d1e34;
  border-radius: 0;
}

:deep(.el-progress-bar__inner) {
  border-radius: 0;
}
</style>
