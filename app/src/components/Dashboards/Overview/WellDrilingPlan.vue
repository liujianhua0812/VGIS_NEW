<template>
  <v-chart :option="chartsOption" autoresize style="width: 100%;height: 100%"></v-chart>
</template>

<script>

export default {
  name: "WellDrilingPlan",
  components: {},
  data() {
    return {}
  },
  computed: {
    chartsOption() {
      return {
        xAxis: {
          type: 'category',
          axisTick: {
            show: false
          },
          axisLabel: {
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.7)'
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)',
              width: '0.5'
            }
          },
          data: ['MGP-1', 'MGP-2', 'Yamama']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        grid: {
          top: 45,
          bottom: 0,
          left: 0,
          right: 0,
          containLabel: true
        },
        legend: {
          icon: "rect",
          right: 'right',
          width:'200',
          orient:'horizontal',
          itemWidth: 9,
          itemHeight: 9,
          textStyle: {
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: 12
          }
        },
        series: [
          {
            name: 'Producer',
            type: 'bar',
            itemStyle: {
              color: '#4FACFF'
            },
            emphasis: {
              focus: 'series'
            },
            label: {
              show: true,
              color: '#FFFFFF',
              position: 'top',
              fontSize: 12,
            },
            markLine: {
              symbol: [],
              lineStyle: {
                type: "dashed",
                color: "#F65A5A",
                width: 1
              },
              label: {
                show: 'true',
                position: "insideEndTop",
                textStyle: {
                  color: "#F65A5A",
                  fontSize: 12
                }
              },

              emphasis: {
                disabled: 'false'
              },
              data: [[{
                name: 'CPF3',
                coord: ['MGP-2', 64],
              }, {
                x: '20%',
                coord: ['30%', 64],
              }]]
            },
            barGap: '150%',
            barWidth: 8,
            data: [45, 64, 25],
          }, {
            name: 'Producer',
            type: 'bar',
            itemStyle: {
              color: '#4FACFF'
            },
            markLine: {
              symbol: [],
              lineStyle: {
                type: "dashed",
                color: "#F65A5A",
                width: 1
              },
              emphasis: {
                disabled: 'false'
              },
              label: {
                show: true,
                position: "insideEndTop",
                textStyle: {
                  color: "#F65A5A",
                  fontSize: 12
                }
              },
              data: [[{
                name: 'DS2 & CPF2',
                coord: ['MGP-2', 25]
              }, {
                x: '15%',
                coord: ['20%', 25]
              }]]
            },
            label: {
              show: true,
              color: '#FFFFFF',
              position: 'top',
              fontSize: 12,
            },
            barGap: '150%',
            barWidth: 8,
            data: [null, 25],
          }, {
            name: 'Water Source',
            type: 'bar',
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              color: '#45E09F'
            },
            barGap: '150%',
            label: {
              show: true,
              color: '#FFFFFF',
              position: 'top',
              fontSize: 12,
            },
            barWidth: 8,
            data: [null, 34],
          }, {
            name: 'Injector',
            type: 'bar',
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              color: '#F8A151'
            },
            label: {
              show: true,
              color: '#FFFFFF',
              position: 'top',
              fontSize: 12,
            },
            barGap: '150%',
            barWidth: 8,
            data: [null, 20, {
              clup: false
            }],
          }, {
            name: 'Appraisal Well',
            type: 'bar',
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              color: '#F6E75A'
            },
            label: {
              show: true,
              color: '#FFFFFF',
              position: 'top',
              fontSize: 12,
            },
            barGap: '150%',
            barWidth: 8,
            data: [null, 1, 1],
          }
        ]
      }
    }
  },
  methods: {},
  created() {
  }
}
</script>

<style scoped>
</style>
