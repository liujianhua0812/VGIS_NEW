<template>
  <div style="width: 100%; height: 100%; position: relative;min-width: 300px;">
    <div ref="map" style="width: 100%; height: 100%;"></div>
    <div class="operatingList">
      <el-select style="width: 400px;" v-model="selectValue" placeholder="Select" @change="changeSelectValue"
                 :class="[isSelectActive ? 'siteStyle':'MapSelectType']" @focus="selectActive()">
        <el-option label="Situational Awareness" key="Situational Awareness" value="type_1"></el-option>
        <el-option label="Wells Production Monitoring" key="Wells Production Monitoring" value="type_2">
        </el-option>
        <el-option label="Pipeline Overview" key="Pipeline Overview" value="type_3"></el-option>
      </el-select>
    </div>
    <div class="directoryList">
      <ul>
        <li v-for="series in DS1Series">
          <p :class="['icon', 'iconfont', series.icon]"></p>
          <dl>
            <dt>{{series.name}}</dt>
            <dd v-if="latestData[series.key]">
              <span class="count">{{formatValue(latestData[series.key].value, DS1Info.series[series.key])}}</span>
              {{latestData[series.key].unit || ''}}
            </dd>
          </dl>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>

import EventBus from "@/utils/EventBus"
  import config from "@/config";
  import { formatValue } from "@/utils";
  import {getNodeDetail, getSeriesLatestValues} from "@/assets/js/api/hierarchy";

  let drawGeometry = null;
  var data;
  let earth = {};

  export default {
    name: "centerMap",
    props: {
      mapName: String,
      action: Boolean,
      selectValue: String,
    },
    data() {
      return {
        source: `${this.$store.state.setting.gis.host2D}/${this.mapName}`,
        infowin: null,
        map: {},
        centerX: '',
        centerY: '',
        placing: false,
        layers: {},
        subLayers: [],
        currentMarker: null,
        controllers: {},
        searchInput: '',
        winMessage: '',
        isSearchVal: false,
        getSearchData: [],
        getHierarchyList: [],//层级树å
        getHierarchyInfoList: [],//兴趣点详情
        isSearchCatalogue: false, //查询
        isCalculate: false,
        isPopupWin: false, //图层
        isSelectActive: false,
        disabled: false,
        isMeasure: false, //量算
        featurePosiList: [], //坐标
        measureTips: false, //量算提示
        POINT_X: '',
        POINT_Y: '',
        POINT_M: '',
        searchClickVal: '',
        OliName: '',
        OliUnit: '',
        OliValue: '',
        str: '',
        arrList: [],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        drawLineStyle: {
          strokeColor: "#2344C5",
          strokeWidth: 2,
          pointerEvents: "visiblePainted",
          fillColor: "#2344C5",
          fillOpacity: 0.8
        },
        coords: [],
        listData: [],
        APIData: [],
        saltData: [],
        oilData: [],
        gasData: [],
        oillist: [],
        H2SData: [],
        DS1Series: [{
          name: 'Oil Delivery',
          key: 'Daily Oil Export',
          icon: 'icon-oil-delivery',
        }, {
          name: 'Gas Delivery',
          key: 'Daily Gas Export',
          icon: 'icon-gas-delivery',
        }, {
          name: 'Salt',
          key: 'Salt in Oil Export',
          icon: 'icon-salt',
        }, {
          name: 'H₂S',
          key: 'H₂S in Oil Export',
          icon: 'icon-h2s',
        }, {
          name: 'W.C.',
          key: 'WC in Oil Export',
          icon: 'icon-a-wc',
        }, {
          name: 'API',
          key: 'API in Oil Export',
          icon: 'icon-api',
        }],
        latestData: {},
        DS1Info: {
          series: {}
        }
      }
    },
    methods: {
      formatValue,
      // Initialize the map
      loadMap() {
        let myChart = this.chart || echarts.init(this.$refs.map, 'light');
        let option = {
          visualMap: {
            show: false,
            calculable: true,
            realtime: false,
            inRange: {
              // color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            },
            outOfRange: {
              colorAlpha: 0
            },
            min: 100,
            max: 1000
          },
          toolBox: {
            feature: {
              dataZoom: {
                show: true,
              }
            }
          },
          mapbox: {
            center: [this.centerY, this.centerX],
            zoom: 12, // starting zoom
            pitch: 50,
            bearing: -10,
            style: {
              "version": 8,
              "sources": {
                "raster-tiles": {
                  "type": "raster",
                  "tiles": [`${this.source}/zxyTileImage.png?z={z}&x={x}&y={y}&transparent=true`],
                  "format": "png",
                  "tileSize": 256
                },
                "google-tiles": {
                  "type": "raster",
                  "tiles": ["http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}"],
                  "tileSize": 256
                }
              },
              "layers": [{
                "id": "google-tiles",
                "type": "raster",
                "source": "google-tiles",
                "minzoom": 0,
                "maxzoom": 22,
              }, {
                "id": "simple-tiles",
                "type": "raster",
                "source": "raster-tiles",
                "minzoom": 0,
                "maxzoom": 22,
              }]
            },
            boxHeight: 10,
            // altitudeScale: 3e2,
            postEffect: {
              enable: true,
              SSAO: {
                enable: true,
                radius: 2,
                intensity: 1.5
              }
            },
          },
          series: [{
            type: 'bar3D',
            roam: false,
            shading: 'realistic',
            coordinateSystem: 'mapbox',
            barSize: 0.2,
            minHeight: 10,
            silent: true,
            data: this.coords,
            label: {
              show: false,
              formatter(params) {
                return params.data[2]
              }
            }
          }]
        };
        myChart.setOption(option);
        if (!this.chart) {
          this.chart = myChart
          let mapbox = myChart.getModel().getComponent('mapbox3D').getMapbox();
          mapbox.addControl(new mapboxgl.NavigationControl(), 'top-left');
        }
      },
      changeSelectValue(value) {
        this.$emit("changeSelectValue", value)
      },
      getLonlatCenter() {
        this.centerX = parseFloat(this.$store.state.setting.gis.initial2D.latitude);
        this.centerY = parseFloat(this.$store.state.setting.gis.initial2D.longitude);
      },
      selectActive() {
        this.isSelectActive = true
      },
      getMapbox() {
        this.loadMap()
      },
      searchMap() {
        let queryParam = [];
        queryParam[0] = new SuperMap.REST.FilterParameter({
          name: "MJ_Wells_Surface_Location_01Jan18@Majnoon",
        });
        let queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
          queryParams: queryParam
        });
        let myQueryBySQLService = new SuperMap.REST.QueryBySQLService(this.source, {
          eventListeners: {
            "processCompleted": this.showQueryResult,
            "processFailed": this.queryError
          }
        });
        myQueryBySQLService.processAsync(queryBySQLParams);
      },
      showQueryResult(queryEventArgs) {
        this.coords = []
        let result = queryEventArgs.originResult;
        if (result) {
          for (let i = 0; i < result.recordsets.length; i++) {
            let recordSet = result.recordsets[i]
            for (let j = 0; j < recordSet.features.length; j++) {
              let feature = recordSet.features[j]
              let data = feature.geometry.center
              let wellName = feature.fieldValues[feature.fieldNames.indexOf('WELLNAME')]
              let LonLat = new SuperMap.LonLat(data.x, data.y)
              LonLat.transform("EPSG:3857", "EPSG:4326");
              this.coords.push([LonLat.lon, LonLat.lat, 0, wellName])
            }
          }
        }
        Promise.all(this.coords.map(item => getSeriesLatestValues(item[3], ['Daily Oil Production']))).then(res => {
          for (let i = 0; i < this.coords.length; i++) {
            this.coords[i][2] = (res[i].data && res[i].data[0] && res[i].data[0].value) ? parseFloat(res[i].data[0].value) : 0
          }
          this.getLonlatCenter()
          this.loadMap()
        })
      },
      fetchDailyProduction(date) {
        getNodeDetail('DS1').then(result => {
          let info = result.data
          info.series = info.model.time_series.reduce((result, series) => {
            result[series.name] = series
            return result
          }, {})
          this.DS1Info = info
          getSeriesLatestValues('DS1', this.DS1Series.map(item => item.key), null, null, date).then(result => {
            this.latestData = result.data.reduce((result, series) => {
              result[series.name] = {
                value: series.value,
                unit: series.unit,
                time: series.time
              }
              return result
            }, {})
          })
        })
      },
      getData (date) {
        getSeriesLatestValues('DS1', this.DS1Series.map(item => item.key), null, null, date).then(result => {
          this.latestData = result.data.reduce((result, series) => {
            result[series.name] = {
              value: series.value,
              unit: series.unit,
              time: series.time
            }
            return result
          }, {})
        })
        Promise.all(this.coords.map(item => getSeriesLatestValues(item[3], ['Daily Oil Production'], null, null, date))).then(res => {
          for (let i = 0; i < this.coords.length; i++) {
            this.coords[i][2] = (res[i].data && res[i].data[0] && res[i].data[0].value) ? parseFloat(res[i].data[0].value) : 0
          }
          this.loadMap()
        })
      }
    },
    mounted() {
      this.searchMap()
      this.fetchDailyProduction(config.general.date)
      EventBus.$on("date-updated", this.getData)
    }
  }
</script>
<style>
  .mapBoxGl .el-select-dropdown__item.hover {
    color: #FFF !important;
    height: 35px;
    background: rgba(216, 216, 216, 0.4);
    width: 100%;
  }

  .mapBoxGl .el-select-dropdown {
    height: 115px;
    /* background-color:transparent; */
    background: rgba(0, 0, 0, 0.7) !important;
    border-radius: 6px;
    color: #FFF !important;
    z-index: 99999;
  }

  .mapBoxGl .el-select-dropdown__item span {
    color: #FFF !important;
    z-index: 9999;
  }
</style>
<style scoped>
  .directoryList {
    width: 250px;
    display: flex;

    height: 453px;
    position: absolute;
    background: rgba(51, 51, 51, 0.6);
    border-radius: 10px;
    bottom: 20px;
    right: 20px;

  }

  .siteStyle >>> .el-input__inner {
    width: 100%;
    /* background:rgba(79, 172, 255, 1) !important; */
    color: #FFFFFF !important;
    z-index: 99999;
  }

  .el-select >>> .el-input__inner {
    background: rgba(79, 172, 255, 1) !important;
    width: 100%;
  }

  .operatingList {
    position: absolute;
    right: 20px;
    top: 20px;
    /* background: rgba(0, 0, 0, 0.7); */
    z-index: 999999;
    height: auto;
    width: 300px;
    display: flex;
    justify-content: space-between
  }

  .MapSelectType {
    width: 100%;
    height: 36px;
    line-height: 36px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 6px;
    color: #FFF;
    cursor: pointer;
  }


  .directoryList ul {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    margin-top: 10px;
  }

  .directoryList ul li {
    margin: 0px 10px;
    height: 60px;
    display: flex;
  }

  .directoryList ul li p {
    height: 60px;
    width: 75px;
    line-height: 60px;
    text-align: center;
  }

  .directoryList dl dt {
    font-size: 20px;
    height: 25px;
    width: 120px;
    text-align: start;
    text-overflow: ellipsis;
    font-family: AlibabaSans-Regular, AlibabaSans;
    font-weight: 400;
    color: #FFFFFF;
    overflow: hidden;
    white-space: nowrap;
  }

  .directoryList dl dd {
    height: 35px;
    text-align: start;

  }

  .count {
    font-size: 24px;
    font-family: AlibabaSans-Regular, AlibabaSans;
    font-weight: 400;
    color: #FFD34F;
    padding-right: 5px;
  }

  #main {
    margin: 0 auto;
    width: 100%;
    height: 100%;
    position: absolute;
  }

  #map {
    position: absolute;
    top: 0;
    bottom: 0;
    overflow: hidden;
    box-shadow: 0 0 5px 5px #081c31 inset;
  }

  .icon {
    width: 35px;
    height: 40px;
    font-size: 45px;
    display: inline-block;
  }
</style>
