<template>
  <div class="parent full-h">
    <div class="top-tabs">
      <div class="tab" :class="tabControl==='Majnoon'?'tab-active':'' " @click="changeTab">Majnoon</div>
      <div class="tab" :class="tabControl==='CPF1'?'tab-active':'' " @click="changeTab">CPF1</div>
      <div class="tab" :class="tabControl==='DS2'?'tab-active':''" @click="changeTab">DS2</div>
    </div>
    <div class="content">
      <div>
        <div class="majnoon-top">
          <div class="item">
            <span class="f-s-12">Production</span>
            <div class="f-s-16 pro-num">{{ currentObj['Total Oil Production'] }}
              <span class="unit">
              {{seriesData.DS2[`Total Oil Production`] ? (seriesData.DS2[`Total Oil Production`].unit ? `${seriesData.DS2[`Total Oil Production`].unit.name}` : '') : ''}}
              </span>
            </div>
          </div>
          <div class="item">
            <span class="f-s-12">Well Status</span>
            <div class="f-s-14 onOff">
              <span class="on">ON {{ currentObj['Total Active Wells'] }}</span>
              <span class="off">OFF {{ currentObj['Total Closed Wells'] }}</span>
            </div>
          </div>
        </div>
        <table class="vgis-map-panel-table">
          <thead>
          <tr>
            <th>Variable</th>
            <th v-for="type in types">{{ type }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="index in indexes">
            <td class="table-td-left table-col">
              {{
                index
              }}{{
                seriesData.Majnoon[`Total ${index} Production`] ? (seriesData.Majnoon[`Total ${index} Production`].unit ? `(${seriesData.Majnoon[`Total ${index} Production`].unit.name})` : '') : ''
              }}
            </td>
            <td class="table-col" v-for="type in types">
              {{ currentObj[`${type} ${index} Production`] }}
            </td>
          </tr>
          <tr v-for="index in wellIndexes">
            <td class="table-td-left table-col">
              {{ index }}
            </td>
            <td class="table-col" v-for="type in types">
              {{ currentObj[`${index} ${type} Wells`] }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>

import EventBus from "@/utils/EventBus";
import config from "@/config";
import {
  getNodeDetail,
  getSeriesLatestValues,
  getSeriesHistoryValues
} from "@/assets/js/api/hierarchy";

export default {
  name: "WellTabs",
  data() {
    return {
      currentObj:{},
      majnoonInfo: {},
      cpfInfo: {},
      dsInfo: {},
      seriesData: {
        Majnoon: {},
        CPF1: {},
        DS2: {}
      },
      indexes: ['Oil', 'Gas', 'GOR', 'BSW'],
      wellIndexes: ['Active', 'Closed'],
      types: ['Sweet', 'Sour'],
      tabControl: 'Majnoon',
      majnoonData: {},
      cpfData: {},
      dsData: {}
    }
  },
  methods: {
    convertData(series, value) {
      if (series.dataType === "Decimal") {
        return parseFloat(parseFloat(value).toFixed(series.precision));
      }
      return value;
    },
    changeTab(e) {
      switch (e.target.innerText) {
        case 'Majnoon': this.currentObj = this.majnoonData; break;
        case 'CPF1': this.currentObj = this.cpfData; break;
        case 'DS2': this.currentObj = this.dsData; break;
      }
      this.tabControl = e.target.innerText
    },
    getData(date) {
      Promise.all([
        getNodeDetail("CPF1"),
        getNodeDetail("DS2"),
        getNodeDetail("Majnoon"),
        getSeriesLatestValues(
          "Majnoon",
          [
            'Total Oil Production',
            'Total Active Wells',
            'Total Closed Wells',
            'Sweet Oil Production',
            'Sour Oil Production',
            'Sweet Gas Production',
            'Sour Gas Production',
            'Sweet GOR Production',
            'Sour GOR Production',
            'Sweet BSW Production',
            'Sour BSW Production',
            'Active Sweet Wells',
            'Active Sour Wells',
            'Closed Sweet Wells',
            'Closed Sour Wells',
          ],
          null, null, date
        ),
        getSeriesLatestValues(
          "CPF1",
          [
            'Total Oil Production',
            'Total Active Wells',
            'Total Closed Wells',
            'Sweet Oil Production',
            'Sour Oil Production',
            'Sweet Gas Production',
            'Sour Gas Production',
            'Sweet GOR Production',
            'Sour GOR Production',
            'Sweet BSW Production',
            'Sour BSW Production',
            'Active Sweet Wells',
            'Active Sour Wells',
            'Closed Sweet Wells',
            'Closed Sour Wells',
          ],
          null, null, date
        ),
        getSeriesLatestValues(
          "DS2",
          [
            'Total Oil Production',
            'Total Active Wells',
            'Total Closed Wells',
            'Sweet Oil Production',
            'Sour Oil Production',
            'Sweet Gas Production',
            'Sour Gas Production',
            'Sweet GOR Production',
            'Sour GOR Production',
            'Sweet BSW Production',
            'Sour BSW Production',
            'Active Sweet Wells',
            'Active Sour Wells',
            'Closed Sweet Wells',
            'Closed Sour Wells',
          ],
          null, null, date
        ),
      ]).then(([CPF1Meta, DS2Meta, MajnoonMeta, MajnoonValues, CPF1Values, DS2Values]) => {
        this.seriesData.CPF1 = CPF1Meta.data.model.time_series.reduce(
          (result, item) => {
            result[item.name] = item;
            return result;
          },
          {}
        );
        this.seriesData.DS2 = DS2Meta.data.model.time_series.reduce(
          (result, item) => {
            result[item.name] = item;
            return result;
          },
          {}
        );
        this.seriesData.Majnoon = MajnoonMeta.data.model.time_series.reduce(
          (result, item) => {
            result[item.name] = item;
            return result;
          },
          {}
        );
        MajnoonValues.data.map(item => {
          this.majnoonData[item.name] = this.convertData(this.seriesData.Majnoon[item.name], item.value)
        })
        CPF1Values.data.map(item => {
          this.cpfData[item.name] = this.convertData(this.seriesData.CPF1[item.name], item.value)
        })
        DS2Values.data.map(item => {
          this.dsData[item.name] = this.convertData(this.seriesData.DS2[item.name], item.value)
        })
        this.currentObj = this.majnoonData
      })
    }

  },
  created() {
    this.getData(config.general.date)
  },
  mounted() {
    EventBus.$on("date-updated", this.getData)
  },
}
</script>

<style lang="scss" scoped>
* {
  font-family: HarmonyOS_Sans;
}
.vgis-map-panel-table {
  margin-top: 7px;
}

.vgis-map-panel-table thead tr {
  font-size: 12px;
  background: linear-gradient(180deg, rgba(29, 174, 255, 0.1) 0%, rgba(29, 174, 255, 0) 100%);;
  line-height: 14px;
  border-bottom: 0.5px solid rgba(29, 174, 255, 0.4)
}

.vgis-map-panel-table thead tr th {
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: rgba(255, 255, 255, 0.7);
  padding: 5px 0 12px 0;
}

.table-td-left {
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
  padding: 8px 0 0px 0;
  color: rgba(255, 255, 255, 0.7);
}

.parent {
  border: 1px solid transparent;
  border-radius: 12px 0 0 6px;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  background-image: linear-gradient(to right, #0a121e, #0a121e), repeating-linear-gradient(to right bottom, transparent 0%, #09D3FF 25%, transparent 50%);
  .top-tabs {
    font-size: 14px;
    font-weight: 400;
    height: 32px;
    display: flex;
    padding-bottom: 8px;
    padding-left: 8px;
    flex-wrap: nowrap;
    box-sizing: border-box;
    border-radius: 12px 0 0 0;
    background: linear-gradient(90deg, rgba(29, 174, 255, 0.1) 0%, rgba(29, 174, 255, 0) 100%);
    border-bottom: 0.5px solid #1DAEFF;
    .tab {
      color: white;
      text-align: center;
      margin-right: 10px;
      font-size: 18px;
      width: 80px;
      height: 32px;
      line-height: 32px;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      border-bottom: 1px solid transparent;
    }

    .tab-active {
      font-weight: 700;
      color: #3DE1EF;
    }

    //.tab-active::after {
    //  content: '';
    //  width: 50%;
    //  height: 1px;
    //  display: block;
    //  margin: -2px auto 0 auto;
    //  border-bottom: 4px solid #3695FF;
    //}


    .tab:hover {
      cursor: pointer;
      //border: 0.5px solid #3695FF;
      //box-shadow: 0 0 14px rgba(0, 178, 255, 0.5);
    }
  }

  .content {
    padding: 10px;
    height: calc(100% - 34px)
  }
}
.f-s-12{
  font-size: 12px;
}
.f-s-14{
  font-size: 14px;
}
.majnoon-top {
  .item{
    width: 47%;
    background: linear-gradient(180deg, rgba(29, 174, 255, 0.1) 0%, rgba(29, 174, 255, 0) 100%);
    //border: 0.5px solid rgba(165, 201, 255, 0);
    border-radius: 4px;
    padding: 4px 10px;
  }
  display: flex;
  color: #ffffff;
  justify-content: space-between;

  .pro-num {
    margin-top: 8px;
    color: #3DE1EF;
    .unit{
      color: white;
    }
  }

  .onOff {
    margin-top: 8px;
    .on {
      color: #45E09F;
    }
    .off {
      margin-left: 10px;
      color: #F65A5A;
    }
  }
}

.table-col {
  width: 33%;
  line-height: 19px;
  font-weight: 400;
  padding: 8px 0 0px 0;
}
</style>
