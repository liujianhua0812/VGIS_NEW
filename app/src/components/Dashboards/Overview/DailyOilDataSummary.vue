<template>
  <div class="full-h">
    <v-chart
      style="height: 100%;width: 100%"
      :options="chartsOption"
      autoresize
    ></v-chart>
  </div>
</template>

<script>
import {
  getNodeDetail,
  getMultipleSeriesLatestValues
} from "@/assets/js/api/hierarchy";

export default {
  name: "DailyOilDataSummary",
  computed: {
    chartsOption() {
      return {
        title: {
          text: "kbbls",
          left: '-1%',
          textStyle: {
            fontWeight: "400",
            fontSize: 12,
            color: "rgba(255, 255, 255, 0.7)"
          }
        },
        tooltip: {
          trigger: "axis",
          borderColor: "#3795FF99",
          borderWidth: "0.5",
          backgroundColor: "#0A1A2D",
          shadowBlur: "18",
          shadowColor: "rgba(54, 149, 255, 0.4)",
          textStyle: {
            color: "#fff",
            fontFamily: "Inter",
            fontStyle: "normal",
            fontWeight: "400",
            fontSize: 14
          }
        },
        textStyle: {
          color: "rgba(255, 255, 255, 0.7)"
        },
        legend: {
          right: "0",
          icon: "rect",
          itemGap: 24,
          itemWidth: 9,
          itemHeight: 9,
          textStyle: {
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: 12
          }
        },
        grid: {
          right: 0,
          top: "16%",
          left: 0,
          bottom: 0,
          containLabel: true
        },
        yAxis: {
          type: "value",
          nameGap: 10,
          nameTextStyle: {
            align: "right",
            fontSize: 12
          },
          axisLabel: {
            fontSize: 12
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              dashOffset: 5,
              opacity: 0.1
            }
          }
        },
        xAxis: {
          type: "category",
          axisTick: {
            show: false
          },
          axisLabel: {
            fontSize: 12
          },
          data: ["Majnoon", "CPF-1", "DS-2"]
        },
        series: [
          {
            name: "Total",
            type: "bar",
            itemStyle: {
              normal: {
                color: "#3695FF"
              }
            },
            emphasis: {
              focus: 'series'
            },
            barGap: '150%',
            barWidth: 10,
            data: this.totalData
          },
          {
            name: "Sweet",
            type: "bar",
            itemStyle: {
              normal: {
                color: "#9A78F5"
              }
            },
            emphasis: {
              focus: 'series'
            },
            barGap: '150%',
            barWidth: 10,
            data: this.sweetData
          },
          {
            name: "Sour",
            type: "bar",
            itemStyle: {
              normal: {
                color: "#E56547"
              }
            },
            emphasis: {
              focus: 'series'
            },
            barGap: '150%',
            barWidth: 10,
            data: this.sourData
          }
        ]
      };
    }
  },
  data() {
    return {
      seriesData: {},
      summaryData: {
        CPF1Data: {},
        DS2Data: {},
        MajnoonData: {}
      },
      totalData: [],
      sourData: [],
      sweetData: []
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
      Promise.all([
        getNodeDetail("Majnoon"),
        getNodeDetail("CPF1"),
        getNodeDetail("DS2"),
        getMultipleSeriesLatestValues(
          ["Majnoon", "CPF1", "DS2"],
          [
            "Total Oil Production",
            "Sweet Oil Production",
            "Sour Oil Production"
          ]
        )
      ]).then(([Majnoon, CPF1, DS2, AllData]) => {
        this.seriesData.MajnoonData = Majnoon.data.model.time_series.reduce(
          (result, item) => {
            result[item.name] = item;
            return result;
          },
          {}
        );
        this.seriesData.DS2Data = DS2.data.model.time_series.reduce(
          (result, item) => {
            result[item.name] = item;
            return result;
          },
          {}
        );
        this.seriesData.CPF1Data = CPF1.data.model.time_series.reduce(
          (result, item) => {
            result[item.name] = item;
            return result;
          },
          {}
        );
        this.summaryData.CPF1Data = AllData.data.CPF1.reduce((result, item) => {
          item.value = this.convertData(
            this.seriesData.CPF1Data[item.name],
            item.value
          );
          result[item.name] = item;
          return result;
        }, {});
        this.summaryData.DS2Data = AllData.data.DS2.reduce((result, item) => {
          item.value = this.convertData(
            this.seriesData.DS2Data[item.name],
            item.value
          );
          result[item.name] = item;
          return result;
        }, {});
        this.summaryData.MajnoonData = AllData.data.Majnoon.reduce(
          (result, item) => {
            item.value = this.convertData(
              this.seriesData.MajnoonData[item.name],
              item.value
            );
            result[item.name] = item;
            return result;
          },
          {}
        );
        let t = "Total Oil Production";
        let sweet = "Sweet Oil Production";
        let sour = "Sour Oil Production";
        this.totalData = [
          this.summaryData.MajnoonData[t].value,
          this.summaryData.CPF1Data[t].value,
          this.summaryData.DS2Data[t].value
        ];
        this.sweetData = [
          this.summaryData.MajnoonData[sweet].value,
          this.summaryData.CPF1Data[sweet].value,
          this.summaryData.DS2Data[sweet].value
        ];
        this.sourData = [
          this.summaryData.MajnoonData[sour].value,
          this.summaryData.CPF1Data[sour].value,
          this.summaryData.DS2Data[sour].value
        ];
      });
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style scoped></style>
