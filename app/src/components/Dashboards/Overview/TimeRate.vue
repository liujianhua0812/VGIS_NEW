<template>
  <v-chart style="height: 100%;width: 100%"
           :option="chartsOption"
           autoresize></v-chart>
</template>

<script>
export default {
  name: "TimeRate",
  props: ['value'],
  data() {
    return {}
  },
  computed: {
    chartsOption() {
      let num = this.value
      return {
        silent: true,
        series: [
          {
            type: 'gauge',
            radius: '55%',
            center: ["22.5%", "50%"],
            axisLabel: {
              show: false,
            },
            startAngle: 90,
            endAngle: -270,
            min: 0,
            max: 50,
            progress: {
              show: true,
              width: 6,
              roundCap: true,
              itemStyle: {
                color:
                  {
                    type: 'linear',
                    colorStops: [{
                      offset: 0, color: '#15C5FD' // 0% 处的颜色
                    }, {
                      offset: 0.5, color: '#45E09F' // 50% 处的颜色
                    }, {
                      offset: 1, color: '#F8A151' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                  }
              }
            },
            axisLine: {
              lineStyle: {
                width: 0,
              }
            },
            axisTick: {
              show: false,
              // distance: 0,
              // length:1,
              // splitNumber: 3,
              // lineStyle: {
              //   width: 1,
              //   color: '#999'
              // }
            },
            splitLine: {
              distance: -9,
              length: 5,
              lineStyle: {
                width: 1,
                color: '#999'
              }
            },
            splitNumber: 12,
            clockwise: true,
            pointer: {
              width: 3,
              icon: 'path://M10 10 H 90 V 90 H 10 Z',
              length: '100%',
              itemStyle: {
                color: "white"
              }
            },
            anchor: {
              show: true,
            },
            detail: {
              offsetCenter: ['225%', 0],
              color: '#3DE1EF',
              fontSize: 36,
              fontFamily: 'HarmonyOS_Sans',
              fontWeight: 700,
              formatter: function (value) {
                return num + '%'
              }
            },
            data: [
              {
                value: this.value >= 50 ? 50 : this.value
              }
            ]
          },
          {
            type: 'gauge',
            radius: '55%',
            center: ["77.5%", "50%"],
            axisLabel: {
              show: false,
            },
            startAngle: 90,
            endAngle: -270,
            min: 0,
            max: 50,
            progress: {
              show: true,
              width: 6,
              roundCap: true,
              itemStyle: {
                color:
                  {
                    type: 'linear',
                    colorStops: [{
                      offset: 0, color: '#15C5FD' // 0% 处的颜色
                    }, {
                      offset: 0.5, color: '#45E09F' // 50% 处的颜色
                    }, {
                      offset: 1, color: '#F8A151' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                  }
              }
            },
            axisLine: {
              lineStyle: {
                width: 0,
              }
            },
            axisTick: {
              show: false,
              // distance: 0,
              // length:1,
              // splitNumber: 3,
              // lineStyle: {
              //   width: 1,
              //   color: '#999'
              // }
            },
            splitLine: {
              distance: -9,
              length: 5,
              lineStyle: {
                width: 1,
                color: '#999'
              }
            },
            splitNumber: 12,
            clockwise: true,
            pointer: {
              width: 3,
              icon: 'path://M10 10 H 90 V 90 H 10 Z',
              length: '100%',
              itemStyle: {
                color: "white"
              }
            },
            anchor: {
              show: true,
            },
            detail: {
              show: false
            },
            data: [
              {
                value: this.value > 50 ? this.value - 50 : 0
              }
            ]
          },
        ]
      }
    }
  },
}
</script>

<style scoped>

</style>
