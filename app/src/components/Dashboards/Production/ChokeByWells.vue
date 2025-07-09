<template>
  <div class="full-h">
    <v-chart
      style="height: 100%;width: 100%"
      :option="chartsOption"
      autoresize
    ></v-chart>
  </div>
</template>

<script>
import {
  getMultipleSeriesHistoryValues,
  getMultipleSeriesLatestValues,
  getNodeDetail,
  getNodesByModel,
  getSeriesHistoryValues
} from "@/assets/js/api/hierarchy";

export default {
  name: "ChokeByWells",
  computed: {
    chartsOption() {
      return {
        title: {
          text: "64ths",
          left: '-1%',
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
          itemHeight:9,
          textStyle: {color: "rgba(255, 255, 255, 0.7)"},
          data: ["Yesterday", "Today"]
        },
        tooltip: {
          trigger: "axis",
          borderColor: "#3795FF99",
          borderWidth: "0.5",
          backgroundColor: "#0a121e",
          shadowBlur: "18",
          shadowColor: "rgba(54, 149, 255, 0.4)",
          icon: "rect",
          textStyle: {
            color: "#fff",
            fontFamily: "Inter",
            fontStyle: "normal",
            fontWeight: "400",
            fontSize: 14
          },
          confine: "true"
        },
        grid: {
          left: -10,
          right: 0,
          bottom: 0,
          top: 28,
          containLabel: true
        },
        yAxis: {
          // nameGap: "10",
          type: "value",
          // nameTextStyle: {
          //   align: "right"
          // },
          axisLabel: {
            align: 'center',
            fontSize: 12
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              // dashOffset: 5,
              opacity: 0.1
            }
          }
        },
        xAxis: {
          axisLine: {
            lineStyle: {
              color: '#1c232e'
            }
          },

          // inverse: true,
          axisTick: {
            show: false
          },
          type: "category",
          boundaryGap: true,
          axisLabel: {
            rotate: 45,
            interval: 0,
            nameTextStyle: {
              color: "rgba(255,255,255,0.7)",
            },
            textStyle: {
              fontSize: 12,
              color: "rgba(255,255,255,0.7)"
            }
          },
          data: this.wells.slice(0, 9)
        },
        series: [
          {
            name: "Today",
            seriesLayoutBy: 'column',
            type: "bar",
            barWidth: 6,
            emphasis: {
              focus: "series"
            },
            itemStyle: {
              normal: {
                color: "#9A78F5"
              }
            },
            data: this.todayData.slice(0, 9)
          }, {
            name: "Yesterday",
            seriesLayoutBy: 'column',
            type: "bar",
            barWidth: 6,
            emphasis: {
              focus: "series"
            },
            barGap: '50%',
            itemStyle: {
              normal: {
                color: "#3695FF"
              }
            },
            data: this.yesterdayData.slice(0, 9)
          }
        ]
      };
    }
  },
  data() {
    return {
      chartData:[],
      wells:[],
      todayData:[],
      yesterdayData:[],
      sortChartData: [],
      width: document.documentElement.clientWidth,
      seriesData: {}
    };
  },
  methods: {
    convertData(series, value) {
      if (series.dataType === "Decimal") {
        return (
          parseFloat(parseFloat(value).toFixed(series.precision)) / 1000
        ).toFixed(2);
      }
      return (value / 1000).toFixed(3);
    },
    getData() {
      let today = new Date();
      let timeStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);
      // 获取 well 的 instanceId 数组
      getNodesByModel("Well").then(result => {
        let wellNames = result.data.map(item => item.instanceId);
        getMultipleSeriesHistoryValues(
          wellNames,
          ["Choke"],
          {
            aggregation: "day",
            method: "latest",
            startAt: timeStart,
            endAt: today
          }
        ).then(res => {
          wellNames.map(name => {
            let wellItem = res.data[name]['Choke']
            if(wellItem.values.length >= 2){
              let todayData = Math.max(parseFloat(wellItem.values[wellItem.values.length - 1].value), 0)
              let yesterdayData = Math.max(parseFloat(wellItem.values[wellItem.values.length - 2].value), 0)
              let diff = Math.abs(todayData - yesterdayData)
              this.chartData.push({name:name, today: todayData, yesterday: yesterdayData, diff: diff})
            }
          })
          // today yesterday 都为0 的 移动到数组末尾
          let j = 0;
          for(let i=0;i<this.chartData.length;i++) {
            //当前元素today 和 yesterday 都 !=0，就把其交换到左边，都等于0的交换到右边
            if(this.chartData[i].today!==0 && this.chartData[i].yesterday !== 0) {
              let tmp = this.chartData[i];
              this.chartData[i] = this.chartData[j];
              this.chartData[j++] = tmp;
            }
          }
          this.sortChartData = this.chartData.sort((a, b) => {
            return b.diff - a.diff
          })
          this.sortChartData.map(item => {
            this.wells.push(item.name)
            this.todayData.push(item.today)
            this.yesterdayData.push(item.yesterday)
          })
        })
      });
    },

  },
  created() {
    this.getData();
  }
};
</script>

<style scoped></style>
