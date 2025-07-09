<template>
  <div class="full-h full-w">
    <div class="legends">
      <div class="legend">
        <div class="legendBlock green"></div>
        Good
      </div>
      <div class="legend">
        <div class="legendBlock blue"></div>
        Acceptable
      </div>
      <div class="legend">
        <div class="legendBlock red"></div>
        Poor
      </div>
    </div>
    <div class="bottomView">
      <div class="blocks">
        <div
          v-for="title in displayTitle"
          :class="`block ${Datas.reportData[title]?Datas.reportData[title]['General Conditions']:'grey'}`"
          style="margin-right: 16px"
          :title="Datas.reportData[title]?'':'None'"
          @click="Datas.reportData[title]?openDetail(title):''">
          <div
            :class="`${Datas.reportData[title]?Datas.reportData[title]['General Conditions']:'grey'}-icon`"></div>
          {{ title }}
        </div>
      </div>
      <div class="dataTable">
        <table class="table full-h">
          <thead style="background: linear-gradient(0deg, rgba(29, 174, 255, 0.1) 0%, rgba(29, 174, 255, 0) 100%);">
          <tr style="padding: 3px">
            <th>Environmental</th>
            <th class="textRight">Month</th>
            <th class="textRight">YTD</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in WorkData" :class="index%2===1?'linear':''">
            <td style="white-space: nowrap">{{ item.title }}{{ item.unit ? ` (${item.unit})` : '' }}</td>
            <td class="textRight">{{ item.month }}</td>
            <td class="textRight">{{ item.YTD }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>


    <SiteSafetyDialog v-if="dialogVisibility" :dialogVisibility="dialogVisibility" :info="dialogInfo"
                      @action-finished="actionFinished"></SiteSafetyDialog>
  </div>
</template>

<script>

import {getNodeDetail, getSeriesLatestValues, getTableRecords} from "@/assets/js/api/hierarchy";
// import TableDialog from "./Dialog/TableDialog";
import SiteSafetyDialog from "./Dialog/SiteSafetyDialog";

export default {
  name: "MonthlyWorkSiteSafety",
  components: {SiteSafetyDialog},
  data() {
    return {
      dialogInfo: {},
      seriesData: {},
      productionData: {
        MonthData: {},
        AnnuallyData: {}
      },
      dialogVisibility: false,
      displayTitle: ['DS-01', 'DS-02', 'CPF & Well Pads', 'RWTP Project', 'Wells work Locations'],
      reportTitle: {
        'DS-(0)?1': 'DS-01',
        'DS-(0)?2': 'DS-02',
        'CPF & Well Pads.*': 'CPF & Well Pads',
        'RWTP Project.*': 'RWTP Project',
        'Wells work Locations.*': 'Wells work Locations',
      },
      Datas: {
        reportData: {},
        itemData: [],
        followData: []
      },
      WorkData: []
    }
  },
  methods: {
    openDetail(name) {
      let infoObj = {}
      let report = this.Datas.reportData[name]
      let item = this.Datas.itemData.filter((item) => {
        return item['Inspection Date'] === report['Inspection Date'] && item['Location'] === report['Location']
      }).map((i) => {
        return {
          'Item (and location of item)': i['Item'],
          'Hazard(s) observed': i['Hazard(s) Observed'],
          'Repeat Item (Yes/No)': i['Repeat Item'],
          'Priority (High, Medium, Low)': i['Priority'],
          'Recommended action': i['Recommended Action'],
        }
      })
      let follow = this.Datas.followData.filter((item) => {
        return item['Inspection Date'] === report['Inspection Date'] && item['Location'] === report['Location']
      }).map((i) => {
        return {
          'Responsible Person': i['Responsible Person'],
          Date: i.Date,
          Action: i.Action,
        }
      })
      infoObj = {
        'Fire extinguisher inspection': report['Fire extinguisher inspection'],
        'Other inspections': report['Other inspections'],
        item,
        'For future follow-up': follow,
        'Name (s) & title (s) of inspection team': report['NAME(S) & TITLE(S) OF INSPECTION TEAM']
      }
      this.dialogInfo = infoObj
      this.dialogVisibility = true
    },
    actionFinished(res) {
      this.dialogInfo = {}
      this.dialogVisibility = res
    },
    convertData(series, value) {
      if (series.dataType === "Decimal") {
        return parseFloat(parseFloat(value).toFixed(series.precision));
      }
      return value;
    },
    getData() {
      Promise.all([
        getNodeDetail("Majnoon"),
        getSeriesLatestValues("Majnoon", [
          "Produced oil",
          "Produced gas",
          "Fuel(s) consumed",
          "Water consumption",
          "Number of spills*",
          "Total Spills amount",
        ]),
        getSeriesLatestValues("Majnoon", [
          "Produced oil Annually",
          "Produced gas Annually",
          "Fuel(s) consumed Annually",
          "Water consumption Annually",
          "Number of spills* Annually",
          "Total Spills amount Annually",
        ]),
        getTableRecords(
          ['Site Safety Report']
        ),
        getTableRecords(
          ['Site Inspection Item']
        ),
        getTableRecords(
          ['Site Inspection Follow-Up']
        )
      ]).then(([MajnoonMeta, MajnoonData, AnnuallyData, ReportData, ItemData, FollowData]) => {
        let reportData = []
        let itemData = []
        let followData = []

        ReportData.data.map((item) => {
          let reportObj = {}
          for (let key in item.field_values) {
            reportObj[item.field_values[key].fieldName] = item.field_values[key].value
          }
          reportData.push(reportObj)
        })

        ItemData.data.map((item) => {
          let itemObj = {}
          for (let key in item.field_values) {
            itemObj[item.field_values[key].fieldName] = item.field_values[key].value
          }
          itemData.push(itemObj)
        })
        FollowData.data.map((item) => {
          let followObj = {}
          for (let key in item.field_values) {
            followObj[item.field_values[key].fieldName] = item.field_values[key].value
          }
          followData.push(followObj)
        })
        let objr = {}
        reportData = reportData.sort((a, b) => {
          return (new Date(b['Inspection Date'])).getTime() - (new Date(a['Inspection Date'])).getTime()
        })
        // console.log(reportData)
        reportData = reportData.filter((item) => {
          let d1 = new Date(item['Inspection Date']), d2 = new Date(reportData[0]['Inspection Date'])
          return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth()
        })
        reportData.map((item) => {
          for (let reg in this.reportTitle) {
            let pattern = new RegExp(reg)
            if (item.Location.match(pattern)) {
              objr[this.reportTitle[reg]] = item
            }
          }
        })
        // console.log(objr, itemData, followData, 111)
        this.Datas.reportData = objr
        this.Datas.itemData = itemData
        this.Datas.followData = followData


        this.seriesData.Majnoon = MajnoonMeta.data.model.time_series.reduce(
          (result, item) => {
            result[item.name] = item;
            return result;
          },
          {}
        );
        MajnoonData.data.map((item) => {
          item.value = this.convertData(this.seriesData.Majnoon[item.name], item.value)

          this.productionData.MonthData[item.name] = item
        })
        AnnuallyData.data.map((item) => {
          item.value = this.convertData(this.seriesData.Majnoon[item.name], item.value)
          this.productionData.AnnuallyData[item.name] = item
        })
        let arr = []
        for (let item in this.productionData.MonthData) {
          arr.push({
            title: item,
            month: this.productionData.MonthData[item].value,
            unit: this.productionData.MonthData[item].unit,
            YTD: this.productionData.AnnuallyData[`${item} Annually`].value
          })
        }
        this.WorkData = arr

      })
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
* {
  font-family: HarmonyOS_Sans;
}


.bottomView {
  display: flex;
  height: calc(100% - 25px);

  .dataTable {
    flex: 4;
    height: 100%;

    .table {
      width: 100%;
      background: linear-gradient(180deg, rgba(29, 174, 255, 0.1) 0%, rgba(29, 174, 255, 0) 100%);
      border-radius: 2px;

      .linear {
        background: rgba(29, 174, 255, 0.05);
      }
    }

    .table tbody tr td {
      padding: 10px 5px;
      font-size: 14px;
    }

    .table thead tr {
      font-size: 14px;
      background: transparent;
    }

    .table thead tr th {
      width: 33.3%;
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      padding: 10px 5px;
    }
  }
}

.legends {
  display: flex;
  justify-content: end;
  margin-bottom: 10px;

  .legend {
    font-family: 'HarmonyOS_Sans';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin-left: 24px;
    display: flex;
    align-items: center;

    .legendBlock {
      display: inline-block;
      max-width: 14px;
      max-height: 14px;
      width: 14px;
      height: 14px;
      margin-right: 10px;
    }

    .green {
      background: rgba(61, 167, 70, 0.3);
      border: 1px solid #3DA746;
    }

    .blue {
      background: rgba(248, 161, 81, 0.2);;
      border: 1px solid #F8A151;
    }


    .red {
      background: rgba(246, 90, 90, 0.2);
      border: 1px solid #F65A5A;
    }

  }
}

.blocks {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 3;

  .block:first-child {
    margin-top: 0;
  }

  .block {
    flex-grow: 1;
    margin-top: 20px;
    border-radius: 4px;
    padding-left: 5px;
    text-align: start;
    align-items: center;
    cursor: pointer;
    display: flex;
    justify-content: start;
//white-space: nowrap;
    //overflow: hidden;
    .Good-icon {
      width: 20px;
      height: 20px;
      margin-right: 5px;
      background-repeat: no-repeat;
      background-image: url("~@/assets/images/dashboard/greenLevel.png");
      background-size: 100%;
    }

    .Acceptable-icon {
      width: 20px;
      height: 20px;
      margin-right: 5px;
      background-repeat: no-repeat;
      background-image: url("~@/assets/images/dashboard/orangeLevel.png");
      background-size: 100%;
    }

    .Poor-icon {
      width: 20px;
      height: 20px;
      margin-right: 5px;
      background-repeat: no-repeat;
      background-image: url("~@/assets/images/dashboard/redLevel.png");
      background-size: 100%;
    }
  }
}

.textRight {
  text-align: right
}

.grey {
  background: rgba(66, 68, 66, 0);
  border: 1px dashed #6d6d6d;

}

.grey:hover {
  cursor: default;
}

.Good {
  color: #45E09F;
  background: rgba(69, 224, 159, 0.2);
  border: 1px solid #45E09F;
}

.Good:hover {
  background: rgba(69, 224, 159, 0.7);
}

.Acceptable {
  color: #F8A151;
  background: rgba(248, 161, 81, 0.2);
  border: 1px solid #F8A151;
}

.Acceptable:hover {
  background: rgba(248, 161, 81, 0.7);
}

.Poor {
  color: #F65A5A;
  background: rgba(246, 90, 90, 0.2);
  border: 1px solid #F65A5A;
}

.Poor:hover {
  background: rgba(246, 90, 90, 0.7);
}
</style>
