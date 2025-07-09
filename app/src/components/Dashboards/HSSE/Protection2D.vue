<template>
  <div class="Protection" style="height:100%; position: relative;">
<!--    <div class="ProtectionList">-->
<!--      <el-select v-if="false" class="ProtectionSelect" v-model="selectValue" placeholder="Select"-->
<!--                 :popper-append-to-body="false" @change="changeSelectValue"-->
<!--                 :class="[isSelectActive? 'siteStyle':'detailsSelect']" @focus="selectActive()">-->
<!--        <el-option label="Security Monitoring" key="Security Monitoring" value="type_1"></el-option>-->
<!--        <el-option label="Population Heat Map" key="Population Heat Map" value="type_2">-->
<!--        </el-option>-->
<!--        <el-option label="Asset Protection" key="Asset Protection" value="type_3"></el-option>-->
<!--      </el-select>-->
<!--    </div>-->
    <div class="assets" v-if="alarms&&alarms.length>0">
      <AssetList></AssetList>
    </div>
    <div class="initMap" ref="map"></div>
  </div>
</template>
<script>

import config from "@/config";

import AssetList from "./AssetList.vue"
import 'canvas-toBlob'

let attribution = "";
let date = new Date(); // 修改数据date
var map;
var layer;
var drawPolygon;
var polygonLayer;
var echartslayer = null;
var globalBlob = null;
var style = {
  strokeColor: "#304DBE",
  strokeWidth: 2,
  pointerEvents: "visiblePainted",
  fillColor: "#304DBE",
  fillOpacity: 0.8
}
var isechars = ""
export default {
  name: 'majnoon',
  props: {
    mapName: String,
    selectValue: String,
  },
  components: {
    AssetList,
  },
  data() {
    return {
      source: `${this.$store.state.setting.gis.host2D}/${this.mapName}`,
      isLayer: true,
      dataName: "",
      centerX: '',
      centerY: '',
      cctvCenterX: '',
      cctvCenterY: '',
      cctvCenter: '',
      isShowFlow: false,
      PersonnelNums: "",//随机人口数量
      getHierarchyList: [], //树
      getMapName: "Asset@Majnoon", //MJ_Facilities_Outlines@Majnoon MJ_CCTV@Majnoon
      isBtnClick: false,
      isSelectActive: true,
      oneLevel: [],
      twoLevel: [],
      Tertiary: [],
      fourLevel: [],
      fiveLevel: [],
      alarms: []
    }
  },
  computed: {},

  methods: {
    loadMap() {
      const actualPixelRatio = window.devicePixelRatio
      Object.defineProperty(window, 'devicePixelRatio', {
        get: () => 300 / 96
      })
      const _container = document.createElement('div')
      document.body.appendChild(_container)

      this.setStyles(_container, {
        visibility: 'hidden',
        position: 'absolute',
        top: 0,
        bottom: 0,
      })
      // end
      map = new mapboxgl.Map({
        container: this.$refs.map,
        style: {
          "version": 8,
          "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
          "sources": {
            "raster-tiles": {
              "attribution": attribution,
              "type": "raster",
              "tiles": [`${this.source}/zxyTileImage.png?z={z}&x={x}&y={y}&transparent=true`],
              "format": "png",
              "tileSize": 256
            },
            "google-tiles": {
              "attribution": attribution,
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
        center: [this.centerY, this.centerX],
        zoom: 12
      });

      var that = this;
      // var marker = new mapboxgl.Marker().addTo(map);
      map.addControl(new mapboxgl.NavigationControl(), 'top-left');
      echartslayer = new EchartsLayer(map);
      polygonLayer = new SuperMap.Layer.Vector("polygonLayer");
      polygonLayer.style = style;
      drawPolygon = new SuperMap.Control.DrawFeature(polygonLayer, SuperMap.Handler.Polygon);
      layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", this.source, {
        transparent: true,
        cacheEnabled: true
      }, {maxResolution: "auto"});
      layer.events.on({"layerInitialized": this.addLayer});
      // this.setMapMarker()
    },
    changeSelectValue(value) {
      this.$emit("changeSelectValue", value)
    },
    selectActive() {
      this.isSelectActive = true
    },
    //end
    showQueryResult(queryEventArgs) {
      let result = queryEventArgs.originResult;
      let firstItem = null;
      if (result && result.recordsets) {
        let num = Math.ceil(Math.random() * 20);
        let queryTarget = result.recordsets[0].datasetName
        if (result.recordsets.forEach) {
          result.recordsets.forEach(item => {
            if (item && item.features && item.features.forEach) {
              item.features.forEach(scope => {

                let assetNameIndex = scope.fieldNames.indexOf("Name")
                let assetLevelIndex = scope.fieldNames.indexOf("AssetLevel")
                let staticSecurityIndex = scope.fieldNames.indexOf("StaticSecurity")
                let assetTypeIndex = scope.fieldNames.indexOf("AssetType")
                let departmentIndex = scope.fieldNames.indexOf("Department")

                let staticSecurityName = scope.fieldValues[staticSecurityIndex]
                let assetTypeName = scope.fieldValues[assetTypeIndex]
                let departmentName = scope.fieldValues[departmentIndex]
                let assetName = scope.fieldValues[assetNameIndex]
                let assetLevel = scope.fieldValues[assetLevelIndex]
                let data = scope.geometry.center
                let LonLat = new SuperMap.LonLat(data.x, data.y)
                LonLat.transform("EPSG:3857", "EPSG:4326");
                this.alarms.push({
                  name: assetName,
                  level: assetLevel,
                  location: LonLat,
                  staticSecurity: staticSecurityName,
                  assetType: assetTypeName,
                  department: departmentName
                })
              })
            }
          })
        }
        this.loadMap()
      }
    },
    showData() {
      isechars = that.oneLevel
    },
    setMapMarker(result) {
      let that = this
      let sum = []
      let num = Math.ceil(Math.random() * 20);
      let data = [];
      if (result) {
        data = this.alarms.filter(item => result.includes(item.level)).map(item => ({
          name: item.name,
          level: item.level,
          value: [item.location.lon, item.location.lat, 1],
          staticSecurity: item.staticSecurity,
          assetType: item.assetType,
          department: item.department
        }))
      }
      let option = {
        animation: false,
        title: {
          left: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'item',
          triggerOn: 'click',
        },
        legend: {
          orient: 'vertical',
          top: 'bottom',
          left: 'right',
          data: [''],
          textStyle: {
            color: '#fff'
          }
        },
        GLMap: {},
        series: [
          {
            type: 'scatter',
            coordinateSystem: 'GLMap',
            symbol: 'circle',
            symbolSize: 35,
            data: data,
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke'
            },
            itemStyle: {
              color(params) {
                switch (params.data.level) {
                  case 'Level I':
                    return "#4FACFF"
                  case 'Level II':
                    return "#AD4FFF"
                  case 'Level III':
                    return "#4FFF7F"
                  case 'Level IV':
                    return "#FFD94F"
                  case 'Level V':
                    return "#FF4F4F"
                }
              }
            },
            hoverAnimation: true,
            label: {
              formatter(params) {
                return params.data.name
              },
              position: 'bottom',
              show: true,
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: '#fff',
              borderColor: '#8C8D8E',
              borderWidth: 1,
              borderRadius: 4,
              padding: [5, 10],
            },
            zlevel: 1
          },
        ]
      };
      if (echartslayer && echartslayer.chart && echartslayer.chart.clear) {
        echartslayer.chart.clear();
      }
      echartslayer.chart.off("click")
      echartslayer.chart.on('click', function (params) {

        that.$emit('protectionMap', false, params);

      });

      echartslayer.chart.setOption(option);
    },
    getLonlat() {
      this.centerX = parseFloat(this.$store.state.setting.gis.initial2D.latitude);
      this.centerY = parseFloat(this.$store.state.setting.gis.initial2D.longitude);
    },
    searchMap() {
      let queryParam = [];
      queryParam[0] = new SuperMap.REST.FilterParameter({
        name: "Asset@Majnoon",
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
    setStyles(element, styles) {
      for (const style in styles) {
        element.style[style] = styles[style]
      }
    },
  },
  created() {
    this.searchMap();
  },
  mounted() {
    window.echarts = echarts;
    this.getLonlat()
    this.$bus.$on("AssetScreening", (assetName) => {
      if (assetName) {
        this.setMapMarker(assetName)
      }
    })
  },
}
</script>
<style>

.ProtectionList .el-input__inner {
  width: 240px;
  height: 36px;
  background: rgba(79, 172, 255, 1) !important;
  color: #FFF
}

.Protection .mapboxgl-ctrl-top-left .mapboxgl-ctrl {
  display: none;
}

.Protection .el-select-dropdown__item.hover,
.Protection .el-select-dropdown__item:hover {
  background: hsla(0, 0%, 84.7%, .4) !important;
  color: #FFF;
}

.Protection .el-select-dropdown__item {
  color: #fff !important;
}

.Protection .el-select-dropdown__item.selected {
  color: #409eff;
}

.Protection .el-select-dropdown {
  width: 240px;
  height: 115px;
  background: rgba(0, 0, 0, .7) !important;
  border-radius: 6px;
  color: #fff;
  z-index: 9999;
}
</style>
<style scoped>
.ProtectionList {
  position: absolute;
  right: 60px;
  top: 20px;
  z-index: -9;
  width: 200px;
  height: 36px !important;
}

.ProtectionList :deep(.el-input) {
  width: 240px;
  height: 36px;
}

.Protection {
  position: relative;
}

.assets {
  position: absolute;
  left: 15px;
  top: 20px;
  z-index: 999;
}

.initMap {
  height: 100%;
  position: relative;
}
</style>
