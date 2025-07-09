<template>
  <div class="full-h vgis-dashboard-table" style="display: flex">
    <v-chart
      style="height: 100%;width: 47%"
      :option="chartsOption"
      autoresize
    ></v-chart>
    <el-table
      @row-click="rowClick"
      row-class-name="myTableRow"
      ref="singleTable"
      :row-class-name="tableRowClassName"
      height="100%"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        property="Date"
        label="Date">
        <template v-slot="scope">
          <div :title="scope.row.Date" v-html="scope.row.Date" class="title-tips"></div>
        </template>
      </el-table-column>
      <el-table-column
        property="Security Incident"
        label="Security Incident"
        width="170">
        <template v-slot="scope">
          <div :title="scope.row['Security Incident']" v-html="scope.row['Security Incident']" class="title-tips"></div>
        </template>
      </el-table-column>
      <el-table-column
        property="Location within Site using GPS"
        label="Location">
        <template v-slot="scope">
          <div :title="scope.row['Location within Site using GPS']" v-html="scope.row['Location within Site using GPS']"
               class="title-tips"></div>
        </template>
      </el-table-column>
      <el-table-column
        property="Title"
        label="Title">
        <template v-slot="scope">
          <div :title="scope.row['Title']" v-html="scope.row['Title']" class="title-tips"></div>
        </template>
      </el-table-column>
    </el-table>
    <TableDialog v-if="dialogVisibility" :dialog-visibility="dialogVisibility" @action-finished="actionFinished"
                 :info="model"></TableDialog>
  </div>
</template>

<script>
import config from "@/config";
import {
  getNodeDetail,
  getTableRecords,
  getSeriesHistoryValues,
  getMultipleSeriesHistoryValues
} from "@/assets/js/api/hierarchy";
import TableDialog from "./Dialog/TableDialog";

export default {
  name: "SecurityReport",
  components: {TableDialog},
  computed: {
    chartsOption() {
      return {
        title: {
          text: "",
          left: "-1%",
          textStyle: {
            fontWeight: "400",
            fontSize: 12,
            color: "rgba(255, 255, 255, 0.7)"
          }
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 32,
          containLabel: true
        },
        textStyle: {
          color: "rgba(255, 255, 255, 0.7)"
        },
        xAxis: {
          axisLine: {
            lineStyle: {
              color: '#1c232e'
            }
          },
          type: "category",
          axisTick: {
            show: false
          },
          axisLabel: {
            fontSize: 12,
          },
          data: this.xData
        },
        tooltip: {
          trigger: "axis",
          borderColor: "#3DE1EF",
          borderWidth: "0.5",
          backgroundColor: "#141B25",
          shadowBlur: "4",
          renderMode: 'html',
          appendToBody: true,
          shadowColor: "rgba(61, 225, 239, 0.25)",
          icon: "rect",
          textStyle: {
            color: "#fff",
            fontFamily: "Inter",
            fontStyle: "normal",
            fontWeight: "400",
            fontSize: 14
          },
        },
        yAxis: {
          nameGap: "10",
          type: "value",
          nameTextStyle: {
            align: "right"
          },
          axisLabel: {
            fontSize: 12,
            fontFamily: "Harmony OS Sans"
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              dashOffset: 5,
              opacity: 0.1
            }
          }
        },
        legend: [
          {
            type: 'scroll',
            right: 0,
            width: '90%',
            orient: 'horizontal',
            itemGap: 24,
            icon: "rect", //  字段控制形状  类型包括 circle，rect,line，roundRect，triangle，diamond，pin，arrow(箭头)，none
            itemWidth: 9, // 设置宽度
            itemHeight: 9, // 设置高度
            textStyle: {
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: 12
            },
            pageFormatter: ' ',
            pageIconSize: 12,
            pageButtonItemGap: 0,
            pageIconColor: 'rgba(255, 255, 255, 0.7)',
            pageIconInactiveColor: 'rgba(255, 255, 255, 0.7)',

          }],
        series: [
          {
            type: "bar",
            name: "Civil/Labour Unrest",
            stack: 1,
            barWidth: 20,
            itemStyle: {
              normal: {
                color: "#4FACFF"
              }
            },
            emphasis: {
              focus: "series"
            },
            data: this.productionData["Civil/Labour Unrest"]
          },
          {
            type: "bar",
            name: "Code of Conduct Violation",
            stack: 1,
            barWidth: 20,
            itemStyle: {
              normal: {
                color: "#F6E75A"
              }
            },
            emphasis: {
              focus: "series"
            },
            data: this.productionData['Code of Conduct Violation']
          },
          {
            type: "bar",
            name: "Criminality",
            stack: 1,
            barWidth: 20,
            itemStyle: {
              normal: {
                color: "#45E09F"
              }
            },
            emphasis: {
              focus: "series"
            },
            data: this.productionData["Criminality"]
          },
          {
            type: "bar",
            name: "K9 Indication",
            stack: 1,
            barWidth: 20,
            itemStyle: {
              normal: {
                color: "#F8A151"
              }
            },
            emphasis: {
              focus: "series"
            },
            data: this.productionData["K9 Indication"]
          },
        ]
      };
    },
  },
  props:{
    time:{
      type:Object,
      default:()=>new Date()
    }
  },
  watch:{
    time:{
      handler(newVal){
        this.getData(newVal)
      }
    }
  },
  data() {
    return {
      dialogVisibility: false,
      model: {}, // props
      tableData: [],
      xData: [],
      productionData: {
        // 'Code of Conduct Violation': [],
        // 'Civil/Labour Unrest':[],
        // 'Criminality':[],
        // 'K9 Indication':[],
      },
      seriesData: {},

    };
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (rowIndex % 2 === 0) {
        return ''
      } else {
        return 'whiteCell'
      }
    },
    actionFinished(e) {
      this.dialogVisibility = e
    },
    rowClick(row, column, event) {
      this.model = row
      this.dialogVisibility = true
    },
    convertData(series, value) {
      if (series.dataType === "Decimal") {
        return parseFloat(parseFloat(value).toFixed(series.precision));
      }
      return value;
    },
    getData(time) {
      let today = time
      let timeStart = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
      getTableRecords(
        ['Security Report'],
        [
          {name: 'Date', value: [timeStart, today]}
        ]
      ).then(res => {
        let records = []
        res.data.map(item => {
          let thisRecord = [0, 0] // [time, type]
          let thisTableRow = {}
          for (let key in item.field_values) {
            if (item.field_values[key].fieldName === "Date") {
              thisRecord[0] = (new Date(item.field_values[key].value).format('yyyy-MM'))
              thisTableRow.Date = new Date(item.field_values[key].value).format('MM/dd/yyyy')
            } else if (item.field_values[key].fieldName === "Security Incident") {
              thisRecord[1] = (item.field_values[key].value)
              thisTableRow['Security Incident'] = item.field_values[key].value
            } else {
              thisTableRow[item.field_values[key].fieldName] = item.field_values[key].value
            }
          }
          this.tableData.push(thisTableRow)
          records.push(thisRecord)
        })
        records.forEach(item => {
          if (!this.xData.includes(item[0])) {
            this.xData.push(item[0])
          }
        })
        this.xData.sort((a, b) => {
          return a > b ? 1 : -1
        })
        for (let key in this.productionData) {
          this.productionData[key] = new Array(this.xData.length).fill(0)
        }
        for (const item of records) {
          for (let xDataItem of this.xData) {
            if (item[0] === xDataItem) {
              if (!this.productionData[item[1]]) {
                this.productionData[item[1]] = new Array(this.xData.length).fill(0)
              }
              this.productionData[item[1]][this.xData.indexOf(xDataItem)]++
            }
          }
        }
      })
    },
    watchWindowSize() {
      this.width = document.documentElement.clientWidth;
    }
  },
  created() {
    window.addEventListener("resize", this.watchWindowSize);
    this.getData(this.time);
  }
};
</script>

<style lang="scss" scoped>
* {
  font-family: HarmonyOS_Sans;
}
.vgis-dashboard-table {
  .el-table::before {
    height: 0;
  }

  .el-table {
    overflow: scroll;
    margin-left: 35px;
    background: linear-gradient(180deg, rgba(29, 174, 255, 0.1) 0%, rgba(29, 174, 255, 0) 100%);
    color: #FFFFFF;

    ::v-deep {
      tbody {
        tr {
          background: transparent;
          cursor: pointer;

          td {
            padding: 0;
            overflow: hidden;
            border-bottom: 0 solid rgba(255, 255, 255, 0.4);
            background: transparent;
          }

        }

        tr:hover > td {
          background-color: rgba(54, 149, 255, 0.1) !important;
          color: #ffffff;
        }

        tr.current-row > td {
          color: #fff;
          background: #409EFF !important;
        }
      }

      thead {
        color: rgba(255, 255, 255, 0.7);
        font-weight: 400;
        font-style: normal;

        tr {
          background: transparent;
          th {
            background: rgba(29, 174, 255, 0.05);
            color: #ffffff;
            padding: 0;
            overflow: hidden;
          }

          th.is-leaf {
            font-weight: 400 !important;
            border-bottom: 0 solid rgba(255, 255, 255, 0.4);
            padding: 0 0 8px 0;
          }
        }
      }

      .whiteCell {
        background: rgba(29, 174, 255, 0.05);
      }

      .cell {
        word-break: break-word !important;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        max-height: 48px;
      }

      .el-table__row {
        height: 48px;
      }
    }
  }
}
</style>
