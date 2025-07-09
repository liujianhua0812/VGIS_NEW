<template>
  <div class="full-h" style="display: flex;justify-content: space-between">
    <v-chart
      style="height: 100%;flex: 0 0 49%"
      :option="chartsOption"
      autoresize
    ></v-chart>
    <div class="rightGraph" ref="graph">
      <v-chart style="height: 100%;width: 100%"
               :option="chartsOption1"
               autoresize></v-chart>
    </div>

    <!--    <el-table-->
    <!--      @row-click="rowClick"-->
    <!--      height="100%"-->
    <!--      ref="singleTable"-->
    <!--      :data="tableData"-->
    <!--      style="width: 100%">-->
    <!--      <el-table-column-->
    <!--        property="Date"-->
    <!--        label="Date">-->
    <!--        <template v-slot="scope">-->
    <!--          <div :title="scope.row.Date" v-html="scope.row.Date" class="title-tips"></div>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column-->
    <!--        width="160"-->
    <!--        property="Incident Title"-->
    <!--        label="Incident Title">-->
    <!--        <template v-slot="scope">-->
    <!--          <div :title="scope.row['Incident Title']" v-html="scope.row['Incident Title']" class="title-tips"></div>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column-->
    <!--        property="Location"-->
    <!--        label="Location">-->
    <!--        <template v-slot="scope">-->
    <!--          <div :title="scope.row['Location']" v-html="scope.row['Location']" class="title-tips"></div>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column-->
    <!--        property="Type"-->
    <!--        label="Type">-->
    <!--        <template v-slot="scope">-->
    <!--          <div :title="scope.row['Type']" v-html="scope.row['Type']" class="title-tips"></div>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--    </el-table>-->
    <TableDialog dialog-id="PIAStatistics" v-if="dialogVisibility" :dialog-visibility="dialogVisibility"
                 @action-finished="actionFinished" :info="model"></TableDialog>
  </div>

</template>

<script>

import TableDialog from "./Dialog/TableDialog";
import {
  getNodeDetail,
  getSeriesHistoryValues,
  getMultipleSeriesHistoryValues, getTableRecords
} from "@/assets/js/api/hierarchy";

export default {
  components: {TableDialog},
  name: "PIAStatistics",
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
          nameRotate: 45,
          axisTick: {
            show: false
          },
          axisLabel: {
            rotate: 45,
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
        color: ["#4FACFF", "#F6E75A", "#45E09F", "#F8A151", "#967FF3"],
        series: [
          {
            type: "bar",
            name: "Near Miss",
            stack: 1,
            barWidth: 20,
            emphasis: {
              focus: "series"
            },
            data: this.productionData['Near Miss']
          },
          {
            type: "bar",
            name: "None Recordable Injury",
            stack: 1,
            barWidth: 20,

            emphasis: {
              focus: "series"
            },
            data: this.productionData['Non Recordable Injury']
          },
          {
            type: "bar",
            name: "Recordable Injury",
            stack: 1,
            barWidth: 20,

            emphasis: {
              focus: "series"
            },
            data: this.productionData['Recordable Injury']
          },

          {
            type: "bar",
            name: "Incident With Consequences",
            stack: 1,
            barWidth: 20,

            emphasis: {
              focus: "series"
            },
            data: this.productionData['Incident With Consequences']
          },
          {
            type: "bar",
            name: "Other",
            stack: 1,
            barWidth: 20,

            emphasis: {
              focus: "series"
            },
            data: this.productionData['Other']
          },
        ]
      };
    },
    chartsOption1() {
      function dist (p1, p2) {
        return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y))
      }
      let nodes = this.graphData
      nodes = nodes.sort((n1, n2) => n1.symbolSize - n2.symbolSize)
      for(let i = 0; i < nodes.length; i++) {
        nodes[i].x = (0.5 - Math.random()) * this.width
        nodes[i].y = (0.5 - Math.random()) * this.height
        if (this.width / 2 - Math.abs(nodes[i].x) < nodes[i].symbolSize) {
          nodes[i].x = (this.width / 2 - nodes[i].symbolSize) * (nodes[i].x > 0 ? 1 : -1)
        }
        if (this.height / 2 - Math.abs(nodes[i].y) < nodes[i].symbolSize) {
          nodes[i].y = (this.height / 2 - nodes[i].symbolSize) * (nodes[i].y > 0 ? 1 : -1)
        }
      }
      let iter = 100
      for(let i = 0; i < iter; i++) {
        for(let j = 0; j < nodes.length; j++) {
          let node = nodes[j]
          for(let k = 0; k < nodes.length; k++) {
            if (j !== k) {
              let rel = nodes[k]
              let euc = dist(node, rel)
              if (euc < node.symbolSize + rel.symbolSize) {
                let move = node.symbolSize + rel.symbolSize - euc
                let nodeMove = move * (rel.symbolSize / (node.symbolSize + rel.symbolSize))
                let relMove = move * (node.symbolSize / (node.symbolSize + rel.symbolSize))
                node.x += nodeMove * (node.x - rel.x) / euc
                node.y += nodeMove * (node.y - rel.y) / euc
                rel.x -= relMove * (node.x - rel.x) / euc
                rel.y -= relMove * (node.y - rel.y) / euc
              }
            }
          }
        }
      }
      return {
        tooltip: {
          trigger: "item",
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
        legend: {
          icon: "rect", //  字段控制形状  类型包括 circle，rect,line，roundRect，triangle，diamond，pin，arrow(箭头)，none
          itemWidth: 9, // 设置宽度
          itemHeight: 9,
          textStyle:{
            color:'#ffffff'
          },
        },
        force:{
          repulsion: 100
        },
        color: ["#45E09F", "#F8A151", "#F65A5A"],
        series: [{
          type: 'graph',
          layout: 'none',
          top: "10%",
          roam: true,
          categories: [{name: 'Good (<3)'}, {name: 'Acceptable ([3,10])'}, {name: 'Poor (>10)'},],
          data: nodes,
          // links: this.graphData.reduce((result, source) => {
          //   return result.concat(this.graphData.map(target => ({ source: source.name, target: target.name })))
          // }, [])
        }]
      }
    }
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
      model: {},
      dialogVisibility: false,
      graphData: [],
      sourceData:[],
      xData: [],
      productionData: {
        // 'Near Miss': [],
        // 'Non Recordable Injury': [],
        // 'Recordable Injury': [],
        // 'Other': [],
        // 'Incident With Consequences': [],
        // 'Activities': [],
      },
      width: 100,
      height: 100,
      seriesData: {}
    };
  },
  methods: {
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
      let timeStart = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
      // console.log('start',timeStart)
      // console.log('end',today)
      getTableRecords(
        ['Prelim Incident Accident'],
        [
          {name: 'Date', value: [timeStart, today]}
        ]
      ).then(res => {
        let records = [], tableData = []
        for (let item of res.data) {
          // res.data.map(item => {
          let thisRecord = [0, 0] // [time, type]
          let thisTableRow = {}
          for (let key in item.field_values) {
            if (item.field_values[key].fieldName === "Date") {
              thisRecord[0] = (new Date(item.field_values[key].value).format('yyyy-MM'))
              thisTableRow.Date = new Date(item.field_values[key].value).format('MM/dd/yyyy')
            } else if (item.field_values[key].fieldName === "Type") {
              thisRecord[1] = (item.field_values[key].value)
              thisTableRow.Type = item.field_values[key].value
            } else {
              thisTableRow[item.field_values[key].fieldName] = item.field_values[key].value
            }

          }
          tableData.push(thisTableRow)
          records.push(thisRecord)
        }
        let graphResult = {}
        tableData.forEach(item => {
          if (graphResult[item.Location]) {
            graphResult[item.Location]++
          } else {
            graphResult[item.Location] = 1
          }
        })
        let graph = [{
          name:'111',
          value:0,
          symbolSize:0
        }],source=[]

        function chooseColor(index) {
          if (index < 3) {
            return 0
          } else if (index > 10) {
            return 2
          } else {
            return 1
          }
        }

        const color = ["rgba(69, 224, 159, 0.2)", "rgba(248, 161, 81, 0.2)", "rgba(246, 90, 90, 0.2)"]
        const bordercolor = ["#45E09F", "#F8A151", "#F65A5A"]
        let num=1
        for (let i in graphResult) {
          let index = chooseColor(graphResult[i])
          graph.push({
            name: i,
            // x: graphResult[i] *Math.random()*100 *(Math.random() > 0.5 ? -1 : 1),
            // y: graphResult[i]*Math.random()*100 *(Math.random() > 0.5 ? -1 : 1),
            category: index,
            symbolSize: graphResult[i] * 10,
            value: graphResult[i],
            itemStyle: {
              color: color[index],
              borderWidth: 3,
              borderColor: bordercolor[index]
            },
            label: {
              show: graphResult[i] > 2,
              position: 'inside',
              formatter:'{b|{c}}\n{c|{b}}',
              rich:{
                b:{
                  color: bordercolor[index],
                  fontSize: 12 + graphResult[i]*2,
                  fontWeight:700,
                  align:'center'
                },
                c:{
                  color: "#ffffff",
                  fontSize: 10 + graphResult[i],
                  align:'center'
                }
              },


            }
          })

          // source.push({
          //   source:num,
          //   target:++num
          // })
        }

        this.graphData = graph
        this.sourceData=source
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
    }
  },
  created() {
    this.getData(this.time);
  },
  mounted() {
    this.width = this.$refs.graph.clientWidth
    this.height = this.$refs.graph.clientHeight
  }
};
</script>

<style scoped>
* {
  font-family: HarmonyOS_Sans;
}

.rightGraph {
  height: 100%;
  flex: 0 0 49%;

  background: linear-gradient(180deg, rgba(29, 174, 255, 0.1) 0%, rgba(29, 174, 255, 0) 100%);
  border-radius: 4px;
}

:deep(.el-table td, .el-table th) {
  padding: 0;
}

:deep(.el-table__row) {
  height: 48px;
}

:deep(.el-table)::before {
  height: 0;
}

:deep(.el-table thead tr) > th {
  background-color: transparent !important;
  color: #ffffff;

}

:deep(.el-table) {
  overflow: scroll;
  margin-left: 35px;
  background-color: transparent;
  color: #ffffff;
}

:deep(.el-table .cell) {
  word-break: break-word !important;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  max-height: 48px;
}

:deep(.el-table tbody tr):hover > td {
  background-color: rgba(54, 149, 255, 0.1) !important;
  color: #ffffff;

}

:deep(.el-table th, .el-table tr) {
  background-color: transparent;
}

:deep(.el-table tr) {
  cursor: pointer;
  background-color: transparent;
}

:deep(.el-table thead) {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
  font-style: normal;
}

:deep(.el-table th.is-leaf) {
  font-weight: 400 !important;
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.4);
  padding: 0 0 8px 0;
}

/*:deep(.el-table th>.cell {*/
/*  padding-left: 0;*/
/*}*/
:deep(.el-table td, .el-table th.is-leaf) {
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.4);
}
</style>
