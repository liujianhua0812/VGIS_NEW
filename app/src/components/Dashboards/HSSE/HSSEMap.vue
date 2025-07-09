<template>
  <div class="noc_SecurityMap" style="height:100%; position: relative;">

<!--      <el-radio-group v-model="mapRadio" @change="changeMap">-->
<!--        <el-radio :label="1"><img alt="" style="width: 15px; margin-right: 5px" :src="securityImg"> Security-->
<!--        </el-radio>-->
<!--        <el-radio :label="2"><img alt="" style="width: 15px;margin-right: 5px" :src="assetImg"> Asset-->
<!--        </el-radio>-->
<!--      </el-radio-group>-->

    <!--Change Map Radio-->
    <div class="reportOrAssert">
      <el-radio-group v-model="mapRadio" @change="changeMap">
        <el-radio :label="1"><img alt="" style="width: 15px; margin-right: 5px" :src="securityImg"> Security
        </el-radio>
        <el-radio :label="2"><img alt="" style="width: 15px;margin-right: 5px" :src="assetImg"> Asset
        </el-radio>
      </el-radio-group>
    </div>
    <!--Security Report Map-->
    <div v-if="!isHome" >
        <!--Back-->
      <div class="backButton" @click="backHome"><i class="iconfont icon-back"/>Back</div>
        <!--table detail-->
      <div v-if="detailTableVisible" class="showReport">
        <div class="top-tabs">
          <div :class="`tab ${hsseCurrentSelect==='Security Report'?'tab-active':''}`"
               @click="changeTab('Security Report')">Security Report
          </div>
          <div :class="`tab ${hsseCurrentSelect==='Prelim-Incident-Accident'?'tab-active':''}`"
               @click="changeTab('Prelim-Incident-Accident')">Prelim-Incident-Accident
          </div>
          <div class="tabArrow" @click="detailTableVisible=!detailTableVisible"><i
            :class="detailTableVisible?'el-icon-caret-top':'el-icon-caret-bottom'"></i></div>
        </div>
        <el-table v-if="hsseCurrentSelect==='Security Report'" :key="itemKey" :height="'calc(100% - 40px)'"
                  @row-click="mapRowClick" :data="tableData">
          <!--------------security report--------------->
          <el-table-column
            property="Date"
            label="Date">
            <template v-slot="scope">
              <div :title="scope.row.Date" v-html="scope.row.Date" class="title-tips"></div>
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            property="Security Incident"
            label="Security Incident"
          >
            <template v-slot="scope">
              <div :title="scope.row['Security Incident']" v-html="scope.row['Security Incident']"
                   class="title-tips"></div>
            </template>
          </el-table-column>
          <el-table-column
            property="Location within Site using GPS"
            label="Location">
            <template v-slot="scope">
              <div :title="scope.row['location']"
                   v-html="scope.row['location']" class="title-tips"></div>
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
        <el-table v-if="hsseCurrentSelect==='Prelim-Incident-Accident'" :key="itemKey" :height="'calc(100% - 40px)'"
                  @row-click="mapRowClick" :data="tableData">
          <!------------------PIA------------------->
          <el-table-column
            property="Date"
            label="Date">
            <template v-slot="scope">
              <div :title="scope.row.Date" v-html="scope.row.Date" class="title-tips"></div>
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            property="Incident Title"
            label="Incident Title">
            <template v-slot="scope">
              <div :title="scope.row['Incident Title']" v-html="scope.row['Incident Title']" class="title-tips"></div>
            </template>
          </el-table-column>
          <el-table-column
            property="Location"
            label="Location">
            <template v-slot="scope">
              <div :title="scope.row['location']" v-html="scope.row['location']" class="title-tips"></div>
            </template>
          </el-table-column>
          <el-table-column
            property="Type"
            label="Type">
            <template v-slot="scope">
              <div :title="scope.row['Type']" v-html="scope.row['Type']" class="title-tips"></div>
            </template>
          </el-table-column>
        </el-table>
      </div>
        <!--Report-->
      <div v-else class="closeReport">
        <div class="hiddenTab">Report</div>
        <div class="tabArrow" @click="detailTableVisible=!detailTableVisible">
          <i
            :class="detailTableVisible?'el-icon-caret-top':'el-icon-caret-bottom'"></i>
        </div>
      </div>

    </div>
    <!--Asset Map-->
    <div class="initMap" ref="map" v-if="selectReport"></div>
    <Protection2D :assetPosition="assetPosition" v-if="!selectReport" @protectionMap="changeAssetMap"
                  @pos-updated="updatePosition" map-name="Majnoon" ref="Protection2D" :action="true"
                  @changeSelectValue="changeSelectValue" :selectValue="'type_3'"/>
    <TableDialog @action-finished="actionFinished" v-if="dialogVisibility" :dialog-visibility="dialogVisibility"
                 :info="model"/>
  </div>
</template>
<script>
import Protection2D from "./Protection2D";
import {getTableRecords} from "@/assets/js/api/hierarchy";
import TableDialog from "./Dialog/TableDialog";

let map;
let echartslayer = null;
let optionData = [];
let geoCoordMap = {};
export default {
  name: 'HSSEMap',
  props: {
    mapName: String,
  },
  components: {
    TableDialog,
    Protection2D,
  },
  data() {
    return {
      isHome: true,
      model: {},
      dialogVisibility: false,
      securityImg: require('@/assets/images/pc/blue-warn.png'),
      assetImg: require('@/assets/images/pc/blue-asset.png'),
      mapRadio: 1,
      selectReport: true,
      assetPosition: [],
      itemKey: '',
      securityReportData: [],
      PIAData: [],
      detailTableVisible: false,
      tableData: [],
      tableDatas: {
        'Prelim-Incident-Accident': [],
        'Security Report': [],
      },
      hsseCurrentSelect: 'Security Report',
      hsseSelectOptions: [
        {value: 'Prelim-Incident-Accident', label: 'Prelim-Incident-Accident'},
        {value: 'Security Report', label: 'Security Report'},
      ],
      source: `${this.$store.state.setting.gis.host2D}/${this.mapName}`,
      menuList: [], // menu
      defaultZoom: parseInt(this.$store.state.setting.gis.initial2D.zoom),
      targetZoom: 16,
    }
  },
  watch: {},
  computed: {},
  methods: {
    backHome(){
      this.isHome = true
      this.resetMap()
    },
    actionFinished(e) {
      this.model = {}
      this.dialogVisibility = false
    },
    changeTab(res) {
      this.hsseCurrentSelect = res
      this.tableData = []
      this.tableData = this.tableDatas[res]
    },
    changeMap(e) {
      this.selectReport = !this.selectReport
      if (!this.selectReport) {
        this.isHome = true
        map = null
        this.menuList = []
        this.detailTableVisible = false
        this.tableData = []
        this.tableDatas['Security Report'] = []
        this.tableDatas["Prelim-Incident-Accident"] = []
      } else {
        this.loadMap()
        this.getSecurityIncidents(null, this.getRegions)
      }
    },
    updatePosition(value) {
      window.clearTimeout(this.timeUpdateInterval);
      this.timeUpdateInterval = window.setTimeout(() => {
        if (this.position[0] !== value[0] || this.position[1] !== value[1]) {
          this.position = value;
        }
      }, this.updateInterval);
      let isChangeMap = '';
      if (isChangeMap) {
        this.isChangeMap = false
      }
    },
    changeAssetMap(isvalue, icontImgs) {
      this.assetPosition = icontImgs
      this.icontImgs = icontImgs
      this.isChangeMap = isvalue
    },
    changeSelectValue(value) {
      this.$emit("changeSelectValue", value)
    },
    focusMapTo(target) {
      map.setCenter(target)
      map.zoomTo(this.targetZoom)
    },
    resetMap() {
      map.setCenter([
        parseFloat(this.$store.state.setting.gis.initial2D.longitude),
        parseFloat(this.$store.state.setting.gis.initial2D.latitude),
      ])
      map.zoomTo(this.defaultZoom)
    },
    convertData(optionData) {
      let res = [];
      for (let i = 0; i < optionData.length; i++) {
        let geoCoord = geoCoordMap[optionData[i].name];
        if (geoCoord) {
          res.push({
            name: optionData[i].name,
            value: geoCoord.concat(optionData[i].value),
            type: optionData[i].type,
            src: optionData[i].src
          });
        }
      }
      return res;
    },
    isLocationMatch(alarmPosition = "", standardPosition = "") {
      let str1 = alarmPosition.replace(/[- ,.\/\\\|]/g, '').toUpperCase()
      let str2 = standardPosition.replace(/[- ,.\/\\\|]/g, '').toUpperCase()
      return str1 && str2 && (str1.indexOf(str2) !== -1 || str2.indexOf(str1) !== -1)
    },
    filterSecurityRegion(val) {
      let result = [];
      let AllData = this.convertData(optionData);
      let newMenuList = []
      let thisList = this.menuList
      // 首先判断是否有 optionItem.name === item.location 元素  有的话:加入 result 并在新创建的临时数组删除
      for (let [index, item] of thisList.entries()) {
        // if (AllData && AllData.forEach) {
        for (let optionItem of AllData) {
          if (item.location === optionItem.name) {
            item.region = optionItem.name
            newMenuList.push(item)
            result.push(optionItem);
            thisList.splice(index, 1)
            break
          }
          // }
        }
      }
      // 其次再去判断 是否有用正则可以匹配的 location
      for (let item of thisList) {
        // if (AllData && AllData.forEach) {
        for (let optionItem of AllData) {
          if (this.isLocationMatch(item.location, optionItem.name)) {
            item.region = optionItem.name
            newMenuList.push(item)
            result.push(optionItem);
            break
          }
          // }
        }
      }
      this.menuList = newMenuList
      return result;
    },
    loadSecurity(val) {
      let that = this;
      let seriesData = this.filterSecurityRegion();
      let dataMap = seriesData.reduce((a, b) => {
        if (a[b.name]) {
          a[b.name]++
        } else {
          a[b.name] = 1
        }
        return a
      }, {})
      let overTen = []
      let threeToTen = []
      let lessThanThree = []
      for (let key in dataMap) {
        if (dataMap[key] > 10) {
          overTen.push(key)
        }
        if (dataMap[key] >= 3 && dataMap[key] <= 10) {
          threeToTen.push(key)
        }
        if (dataMap[key] < 3) {
          lessThanThree.push(key)
        }
      }
      let red = [], yellow = [], green = []
      for (let item of seriesData) {
        if (overTen.includes(item.name)) {
          !red.includes(item) && red.push(item)
        }
        if (threeToTen.includes(item.name)) {
          !yellow.includes(item) && yellow.push(item)
        }
        if (lessThanThree.includes(item.name)) {
          !green.includes(item) && green.push(item)
        }
      }
      let option = {
        animation: false,
        title: {
          left: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          textStyle: {
            color: '#ffffff',
          },
          orient:'vertical',
          padding: 8,
          right: 8,
          bottom: 8,
          backgroundColor: '#0a1a2d',
          borderRadius: 4,
        },
        GLMap: {},
        series: [
          {
            name: '>10',
            type: 'scatter',
            coordinateSystem: 'GLMap',
            data: red,
            symbolSize: [40, 32],
            symbol: 'path://M942.102 904.571c-21.954 35.544-57.556 55.418-99.308 55.418h-661.6c-41.752 0-77.35-19.874-99.3-55.418-21.945-35.544-23.78-76.303-5.111-113.685l330.8-662.296c20.324-40.686 58.976-64.597 104.411-64.597 45.448 0 84.095 23.91 104.411 64.597l330.804 662.296c18.674 37.382 16.839 78.142-5.107 113.685zM512 800c26.51 0 48-21.49 48-48s-21.49-48-48-48-48 21.49-48 48 21.49 48 48 48z m72-408c0-39.765-32.235-72-72-72s-72 32.235-72 72v6l48 259.5h0.051c0.775 12.555 11.198 22.5 23.949 22.5 12.75 0 23.174-9.945 23.948-22.5H536L584 398v-6z',
            showEffectOn: 'render',
            hoverAnimation: true,
            itemStyle: {
              opacity: 1,
              color: '#e15939',
            },
            emphasis: {
              scale: true,
              itemStyle: {
                shadowBlur: 10,
                shadowColor: '#FFFFFF'
              },
              label: {
                backgroundColor: 'rgba(100, 100, 100,0.8)',
              }
            },
            label: {
              formatter: function (params, ticket, callback) {
                return params.data.name
              },
              position: 'bottom',
              show: true,
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: '#fff',
              borderColor: '#8C8D8E',
              borderWidth: 1,
              borderRadius: 4,
              fontSize: 16,
              padding: [5, 10],
            },
            zlevel: 1
          },
          {
            name: '[3,10]',
            type: 'scatter',
            coordinateSystem: 'GLMap',
            data: yellow,
            symbolSize: [40, 32],
            symbol: 'path://M942.102 904.571c-21.954 35.544-57.556 55.418-99.308 55.418h-661.6c-41.752 0-77.35-19.874-99.3-55.418-21.945-35.544-23.78-76.303-5.111-113.685l330.8-662.296c20.324-40.686 58.976-64.597 104.411-64.597 45.448 0 84.095 23.91 104.411 64.597l330.804 662.296c18.674 37.382 16.839 78.142-5.107 113.685zM512 800c26.51 0 48-21.49 48-48s-21.49-48-48-48-48 21.49-48 48 21.49 48 48 48z m72-408c0-39.765-32.235-72-72-72s-72 32.235-72 72v6l48 259.5h0.051c0.775 12.555 11.198 22.5 23.949 22.5 12.75 0 23.174-9.945 23.948-22.5H536L584 398v-6z',
            showEffectOn: 'render',
            hoverAnimation: true,
            itemStyle: {
              opacity: 1,
              color: '#ffcb12'
            },
            emphasis: {
              scale: true,
              itemStyle: {
                shadowBlur: 10,
                shadowColor: '#FFFFFF'
              },
              label: {
                backgroundColor: 'rgba(100, 100, 100,0.8)',
              }
            },
            label: {
              formatter: function (params, ticket, callback) {
                return params.data.name
              },
              position: 'bottom',
              show: true,
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: '#fff',
              borderColor: '#8C8D8E',
              borderWidth: 1,
              borderRadius: 4,
              fontSize: 16,
              padding: [5, 10],
            },
            zlevel: 1
          },
          {
            name: '<3',
            type: 'scatter',
            coordinateSystem: 'GLMap',
            data: green,
            symbolSize: [40, 32],
            symbol: 'path://M942.102 904.571c-21.954 35.544-57.556 55.418-99.308 55.418h-661.6c-41.752 0-77.35-19.874-99.3-55.418-21.945-35.544-23.78-76.303-5.111-113.685l330.8-662.296c20.324-40.686 58.976-64.597 104.411-64.597 45.448 0 84.095 23.91 104.411 64.597l330.804 662.296c18.674 37.382 16.839 78.142-5.107 113.685zM512 800c26.51 0 48-21.49 48-48s-21.49-48-48-48-48 21.49-48 48 21.49 48 48 48z m72-408c0-39.765-32.235-72-72-72s-72 32.235-72 72v6l48 259.5h0.051c0.775 12.555 11.198 22.5 23.949 22.5 12.75 0 23.174-9.945 23.948-22.5H536L584 398v-6z',
            showEffectOn: 'render',
            hoverAnimation: true,
            itemStyle: {
              opacity: 1,
              color: '#3dc148',
            },
            emphasis: {
              scale: true,
              itemStyle: {
                shadowBlur: 10,
                shadowColor: '#FFFFFF'
              },
              label: {
                backgroundColor: 'rgba(100, 100, 100,0.8)',
              }
            },
            label: {
              formatter: function (params, ticket, callback) {
                return params.data.name
              },
              position: 'bottom',
              show: true,
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: '#fff',
              borderColor: '#8C8D8E',
              borderWidth: 1,
              borderRadius: 4,
              fontSize: 16,
              padding: [5, 10],
            },
            zlevel: 1
          }]
      };
      echartslayer.chart.clear();
      echartslayer.chart.off("mouseover");
      echartslayer.chart.off("mouseout");
      echartslayer.chart.off("click");
      echartslayer.chart.setOption(option, true);
      echartslayer.chart.on('click', function (params) {
        that.changeTab('Security Report')
        that.tableDatas['Security Report'] = []
        that.tableDatas['Prelim-Incident-Accident'] = []
        let tempSR = []
        // let tempPIA = []
        that.securityReportData.forEach(item => {
          if (item.region === params.data.name) {
            that.tableDatas['Security Report'].push(item)
            // tempSR.push(item)
          }
        })
        // that.tableDatas['Security Report'] = tempSR
        that.PIAData.forEach(item => {
          if (item.region === params.data.name) {
            // tempPIA.push(item)
            that.tableDatas['Prelim-Incident-Accident'].push(item)
          }
        })
        // that.tableDatas['Prelim-Incident-Accident'] = tempPIA
        that.focusMapTo(params.data.value)
        if (that.tableDatas["Security Report"].length) {
          that.tableData = that.tableDatas['Security Report']
          that.hsseCurrentSelect = 'Security Report'
        } else if(that.tableDatas["Prelim-Incident-Accident"].length){
          that.tableData = that.tableDatas['Prelim-Incident-Accident']
          that.hsseCurrentSelect = 'Prelim-Incident-Accident'
        }else {
          that.tableData = that.tableDatas['Security Report']
          that.hsseCurrentSelect = 'Security Report'
        }
        that.detailTableVisible = true
        that.itemKey = Math.random()
        that.isHome = false
      });
      echartslayer.chart.on('mouseover', function (params) {
        that.highlightArea(params.data.name, 'Area')
      });
      echartslayer.chart.on('mouseout', function (params) {
        that.highlightArea('', 'Area')
      });
    },
    highlightArea(area, source = 'Incident') {
      if (area) {
        echartslayer.chart.dispatchAction({
          type: 'highlight',
          name: area
        })
      } else {
        echartslayer.chart.dispatchAction({
          type: 'downplay'
        })
      }
    },
    showQueryResult(queryEventArgs) {
      let result = queryEventArgs.originResult;
      if (result && result.recordsets) {
        let dataset = result.recordsets[0]
        optionData = dataset.features.map(feature => ({
          name: feature.fieldValues[19]
        }))
        geoCoordMap = dataset.features.reduce((result, feature) => {
          let data = feature.geometry.center
          let LonLat = new SuperMap.LonLat(data.x, data.y)
          LonLat.transform("EPSG:3857", "EPSG:4326");
          result[feature.fieldValues[19]] = [LonLat.lon, LonLat.lat]
          return result
        }, {})
        this.loadSecurity()
      }
    },
    getRegions() {
      let queryParam = [new SuperMap.REST.FilterParameter({
        name: 'MJ_Facilities_Outlines@Majnoon',
      })];
      let queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
        queryParams: queryParam
      });
      let myQueryBySQLService = new SuperMap.REST.QueryBySQLService(this.source, {
        eventListeners: {
          "processCompleted": this.showQueryResult,
          "processFailed": function (e) {
            // console.log(e)
          }
        }
      });
      myQueryBySQLService.processAsync(queryBySQLParams);
    },
    getSecurityIncidents(val, callback) {
      this.securityReportData = []
      this.PIAData = []
      let today = new Date()
      let timeStart = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
      Promise.all([
        getTableRecords(
          ['Security Report'],
          [
            {name: 'Date', value: [timeStart, today]}
          ]
        ),
        getTableRecords(
          ['Prelim Incident Accident'],
          [
            {name: 'Date', value: [timeStart, today]}
          ]
        )
      ]).then(([securityReport, PIA]) => {
        securityReport.data.map(item => {
          let thisTableRow = {}
          for (let key in item.field_values) {
            if (item.field_values[key].fieldName === "Location within Site using GPS") {
              thisTableRow['location'] = item.field_values[key].value
            } else {
              thisTableRow[item.field_values[key].fieldName] = item.field_values[key].value
            }
          }
          this.menuList.push(thisTableRow)
          this.securityReportData.push(thisTableRow)
        })
        PIA.data.map(item => {
          let thisTableRow = {}
          for (let key in item.field_values) {
            if (item.field_values[key].fieldName === "Location") {
              thisTableRow['location'] = item.field_values[key].value
            } else {
              thisTableRow[item.field_values[key].fieldName] = item.field_values[key].value
            }
          }
          this.menuList.push(thisTableRow)
          this.PIAData.push(thisTableRow)
        })
      }).finally(() => {
        if (callback) {
          callback()
        }
      })
    },
    mapRowClick(e) {
      this.model = e
      delete e.region
      this.dialogVisibility = true
    },
    loadMap() {
      if (!map) {
        this.$nextTick(() => {
          map = new mapboxgl.Map({
            container: this.$refs.map,
            style: {
              "version": 8,
              "sources": {
                "raster-tiles": {
                  "attribution": "",
                  "type": "raster",
                  "tiles": [`${this.source}/zxyTileImage.png?z={z}&x={x}&y={y}&transparent=true`],
                  "format": "png",
                  "tileSize": 256
                },
                "google-tiles": {
                  "attribution": "",
                  "type": "raster",
                  "tiles": ["http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}"],
                  "tileSize": 256
                }
              },
              "layers":
                [
                  {
                    "id": "google-tiles",
                    "type": "raster",
                    "source": "google-tiles",
                    "minzoom": 0,
                    "maxzoom": 22,
                  },
                  {
                    "id": "simple-tiles",
                    "type": "raster",
                    "source": "raster-tiles",
                    "minzoom": 0,
                    "maxzoom": 22,
                  }
                ]
            },
            center: [
              parseFloat(this.$store.state.setting.gis.initial2D.longitude),
              parseFloat(this.$store.state.setting.gis.initial2D.latitude),
            ], // starting position
            zoom: this.defaultZoom // starting zoom
          });
          // map.addControl(new mapboxgl.NavigationControl(), 'top-left');
          echartslayer = new EchartsLayer(map);// 初始化图表

        })
      }
    },
  },
  mounted() {
    this.loadMap()
    this.getSecurityIncidents(null, this.getRegions)
  },
  beforeDestroy() {
    map = null
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-radio-group) {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}

:deep(.el-radio) {
  margin-right: 0;
}

:deep(.el-radio__label) {
  line-height: 15px;
  color: white;
}

:deep(.el-radio__input.is-checked + .el-radio__label) {
  color: white;
}
.icon-back{
  margin-right: 5px;
}
.backButton{
  cursor: pointer;
  padding-left: 12px;
  left: 8px;
  top: 8px;
  font-size: 18px;
  line-height: 37px;
  border-radius: 4px;
  position: absolute;
  width: 87px;
  height: 37px;
  background-color: #0a1a2d;
  z-index: 99;
  color: #3695FF;
}
.reportOrAssert {
  right: 10px;
  top: 10px;
  border-radius: 8px;
  position: absolute;
  width: auto;
  height: 80px;
  background-color: #0a1a2d;
  padding: 12px;
  z-index: 99;
}

.initMap {
  height: 100%;
  position: relative;
}

:deep(.el-input__inner) {
  background-color: #0a1a2d;
  color: white;
}

.tabArrow {
  margin-left: 10px;
  position: absolute;
  right: 10px;
  cursor: pointer;
}

.hiddenTab {
  font-family: 'HarmonyOS Sans';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 21px;
}

.top-tabs {
  height: 35px;
  display: flex;
  margin-bottom: 20px;
  flex-wrap: nowrap;
  box-sizing: border-box;
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.4);


  .tab {
    color: white;
    text-align: center;
    margin-right: 40px;
    font-size: 18px;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid transparent;
  }

  .tab-active::after {
    content: '';
    width: 50%;
    height: 1px;
    display: block;
    margin: 1px auto 0 auto;
    border-bottom: 4px solid #3695FF;
  }

  .tab:hover {
    cursor: pointer;
  }
}

.el-icon-caret-top {
  font-size: 20px;
  color: #3695FF
}

.el-icon-caret-bottom {
  font-size: 20px;
  color: #3695FF
}

.closeReport {
  display: flex;
  justify-content: space-between;
  align-items: center;
  top: 60px;
  left: 8px;
  border-radius: 4px;
  z-index: 10;
  position: absolute;
  width: 108px;
  background-color: #0a1a2d;
  padding: 12px;
}

.showReport {
  top: 60px;
  left: 8px;
  border-radius: 8px;
  z-index: 10;
  position: absolute;
  width: 578px;
  height: 398px;
  background-color: #0a1a2d;
  padding: 12px;

  :deep(.el-select) {
    margin-bottom: 10px;
  }

  :deep(.el-table td, .el-table th) {
    padding: 0;
  }

  :deep(.el-table__row) {
    height: 50px;
  }

  :deep(.el-table)::before {
    height: 0;
  }

  :deep(.el-table) {
    overflow: scroll;
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
    max-height: 50px;
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
}
</style>
