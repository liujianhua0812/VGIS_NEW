<template>
  <v-chart
    :option="chartsOption"
    autoresize
    style="width:100%;height:100%"
  ></v-chart>
</template>

<script>
import { getSeriesHistoryValues } from '@/assets/js/api/hierarchy'
export default {
  data() {
    return {
      planData: [
      ],
      planMilestone: [
      ],
    };
  },
  name: "MajnoonTargetDevPlan",
  computed: {
    chartsOption() {
      let planData = this.transformData(this.planData);
      return {
        title:{
          text:'Oil Production,'+ this.devPlanUnit,
          left: '-0.5%',
          top: 0,
          textStyle:{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize:12,
            fontWeight:400,
          }
        },
        grid: {
          left: 10,
          right: 5,
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
          type: "category",
          boundaryGap: false,
          axisLabel: {
            // rotate: 45,
            // align:'right',
            interval: 0,
            textStyle: {
              fontSize: 12,
              color: "rgba(255,255,255,0.7)"
            }
          },
          axisTick: {
            show: false
          },
          data: this.planData.map(item => item[0].format("yyyy MF"))
        },
        yAxis: {
          axisLabel: {
            fontSize: 14,
            color: "rgba(255,255,255,0.7)",
            formatter(value) {
              return value > 1000 ? value / 1000 : value;
            }
          },
          max(value) {
            return value.max * 1.5;
          },
          type: "value",
          nameTextStyle: {
            color: "rgba(255,255,255,0.7)",
            align: "center",
            padding: [0, 0, 0, 68]
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
        },

        series: [
          {
            markLine: {
              symbol: [],
              lineStyle: {
                type: "solid",
                color: "#3DE1EF",
                width: 2
              },
              label: {
                show: true,
                position: "middle",
                distance: 5,
                textStyle: {
                  color: "#FFF",
                  fontSize: 12
                },
                formatter(params) {
                  if (typeof params.data.name === "number") {
                    if (params.data.name > 1000) {
                      return `${Math.floor(params.data.name / 1000)}K`;
                    }
                  }
                  return params.data.name;
                }
              },
              data: this.generateHighlightLine(planData).concat(
                this.planMilestone.map(milestone => [
                  {
                    name: milestone[2],
                    coord: [milestone[0].format("yyyy MF"), milestone[1]],
                    lineStyle: {
                      type: "dashed",
                      color: "#F6E75A",
                      width: 1
                    },
                    label: {
                      show: true,
                      position: "end",
                      padding: [0, 55, 0, 0],
                      textStyle: {
                        color: "#F6E75A",
                        fontSize: 12
                      }
                    }
                  },
                  {
                    coord: [milestone[0].format("yyyy MF"), milestone[1] *1.5]
                  }
                ])
              )
            },
            name: "E20",
            type: "line",
            symbol: "none",
            // silent: true,
            barWidth: "100%",
            labelLine: {
              show: true
            },
            selectedMode:'single',
            select:{
              disabled:true,
              areaStyle:{
                color: "#45E09F"
              },
              labelLine:{
                show:true
              },
              lineStyle:{
                color:'#ffffff'
              }
            },
            areaStyle: {
              color: "#2F6A9E"
            },
            label: {
              show: true,
              position: "top",
              color: "white"
            },
            stack: "total",
            itemStyle: {
              color: "rgba(255, 255, 255, 0)"
            },
            emphasis: {
              focus: "series"
            },
            data: planData.map(item => [item[0].format("yyyy MF"), item[1]])
          }
        ]
      };
    }
  },
  methods: {
    getData(){
      let startTime = new Date();
      let endTime = new Date()
      startTime.setFullYear(2020, 1, 1)
      endTime.setFullYear(2027, 1, 1)
      Promise.all([
        getSeriesHistoryValues(
          "Majnoon",
          ["600K Target Development Plan"],
          {
            aggregation: "month",
            method: "latest",
            startAt: startTime,
            endAt: endTime,
          }
        ),
        getSeriesHistoryValues(
          "Majnoon",
          ["600K Target Development Plan Milestone"],
          {
            aggregation: "month",
            method: "latest",
            startAt: startTime,
            endAt: endTime,
          }
        ),
      ])
      .then(([res, milestone]) => {
        this.devPlanUnit = res.data['600K Target Development Plan'].unit
        res.data['600K Target Development Plan'].values.reduce((result, item, index) => {
          this.planData.push([new Date(item.time), item.value])
          if(index === res.data['600K Target Development Plan'].values.length - 1){
            let pushDate = new Date(item.time)
            pushDate.setMonth((new Date(item.time)).getMonth() + 6)
            this.planData.push([pushDate, item.value])
          }
        }, {})
        // debugger
        milestone.data['600K Target Development Plan Milestone'].values.reduce((result, item, index) => {
          let numValue = 0
          let date = new Date(item.time)
          for(let planDataItem of(this.planData)){
            if(date.toString() === planDataItem[0].toString()){
              numValue = planDataItem[1]
            }
          }
          this.planMilestone.push([new Date(item.time), numValue, item.value])
        }, {})
      })
    },
    transformData(data) {
      let result = [];
      for (let i = 0; i < data.length; i++) {
        if (result.length === 0) {
          result.push(data[i]);
        } else if (data[i][1] !== result[result.length - 1][1]) {
          result.push([data[i][0], result[result.length - 1][1]]);
          result.push(data[i]);
        } else {
          result.push(data[i]);
        }
      }
      return result;
    },
    generateHighlightLine(data) {
      let lines = data
        .map((point, index) =>
          [
            {
              name: point[1],
              coord: [point[0].format("yyyy MF"), point[1]]
            }
          ].concat(
            index === data.length - 1
              ? []
              : {
                  coord: [
                    data[index + 1][0].format("yyyy MF"),
                    data[index + 1][1]
                  ]
                }
          )
        )
        .filter(
          item => item.length === 2 && item[0].coord[0] !== item[1].coord[0]
        );
      let result = [];
      for (let i = 0; i < lines.length; i++) {
        if (result.length === 0) {
          result.push(lines[i]);
        } else {
          let last = result[result.length - 1];
          let curr = lines[i];
          if (
            last[1].coord[0] === curr[0].coord[0] &&
            last[1].coord[1] === curr[0].coord[1]
          ) {
            last[1].coord[0] = curr[1].coord[0];
          } else {
            result.push(lines[i]);
          }
        }
      }
      return result;
    },

  },
  mounted() {
    this.getData()
  }
};
</script>

<style scoped>
</style>
