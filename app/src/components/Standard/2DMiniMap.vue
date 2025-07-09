<template>
  <div>
    <div class="openMiniMap" @click="openMiniMapFn">
      <img src="@/assets/images/openMiniMap.png" alt="">
    </div>
    <div class="miniMapCont" style="position: relative;min-width: 300px;" v-show="iscloseMiniMap">
      <p class="text">Minimap<img src="@/assets/images/close.png" alt="" class="closeMiniMapBtn"
          @click="closeMiniMap"></p>
      <div id="map" style="width: 100%; height: 83%;"></div>
    </div>

  </div>
</template>
<script>

  import markerIcon from "@/assets/images/map.svg"
  import plotMarkerIcon from "@/assets/images/mark.png"
  import config from "@/config";
  import { vector } from 'echarts';
  export default {
    name: "",
    props: {
      mapName: String,//地图名称，用于构建地图
      position: Array, //第一个经度[-180,180]，第二个纬度[-90,90]
      direction: Number, //朝向角，单位°，范围[-180,180],以正东为零度，向北为正，向南为负,
      scale: Number // 缩放尺度
    },
    watch: {
      position(newValue) {
        // console.log(newValue, "position24")
        this.updateMarker(newValue, this.direction, this.scale)
      },
      direction(newValue) {
        // console.log(newValue, "direction")
        this.updateMarker(this.position, newValue, this.scale)
      },
      scale(newValue) {
        // console.log(newValue, "scale")
        this.updateMarker(this.position, this.direction, newValue)
      }
    },
    components: {
    },
    data() {
      return {
        source: `${this.$store.state.setting.gis.initial2D}/${this.mapName}`,
        marker: '',
        map: null,
        layers: {},
        subLayers: [],
        iscloseMiniMap: false,
      }
    },
    created() {
    },
    methods: {
      initializeLineLayer(index) {
        this.layers.pointLayer = new SuperMap.Layer.Vector("pointLayer")
        this.layers.pointLayer.index = index
      },
      initializeGoogleLayer(index) {
        this.layers.googleLayer = new SuperMap.Layer.Google("Google Base Map", {
          type: google.maps.MapTypeId.SATELLITE,
          isBaseLayer: true,
        });
        this.layers.googleLayer.index = index
      },
      initializeVectorLayer(index) {
        this.layers.vectorLayer = new SuperMap.Layer.Vector("VectorLayer")
        this.layers.vectorLayer.index = index
      },
      initializeMarkerLayer(index) {
        this.layers.markers = new SuperMap.Layer.Markers("Markers")
        this.layers.markers.index = index
      },
      initializeMainLayer(index) {
        this.layers.mainLayer = new SuperMap.Layer.TiledDynamicRESTLayer(this.mapName, this.source, {
          transparent: true,
          cacheEnabled: false
        }, { maxResolution: "auto", useCanvas: false, useCORS: true })
        this.layers.mainLayer.index = index
        this.layers.mainLayer.events.on({ "layerInitialized": this.loadMap });
      },
      loadLayers() {
        this.initializeGoogleLayer(1)
        this.initializeVectorLayer(3)
        this.initializeLineLayer(4)
        this.initializeMarkerLayer(5)
        this.initializeMainLayer(2)

      },
      // Initialize the map
      loadMap() {
        this.map = new SuperMap.Map("map", {
          controls: [
            new SuperMap.Control.ScaleLine(),
            // new SuperMap.Control.PanZoomBar(),
            new SuperMap.Control.Zoom(),
            new SuperMap.Control.LayerSwitcher(),
            new SuperMap.Control.Navigation({
              dragPanOptions: {
                enableKinetic: true
              }
            }
            ),
          ],
          allOverlays: true,
          maxZoom: 25,
          minZoom: 1,
        }
        );
        // console.log("mini", 106, this.map, typeof this.map.setCenter)
        let layers = Object.values(this.layers)
        layers.sort((i1, i2) => i1.index - i2.index)
        this.map.addLayers(layers)
        this.map.setBaseLayer(this.layers.mainLayer)
        this.updateMarker(this.position, this.direction, this.scale)
      },
      updateMarker(position, direction, scale) {
        let x = position[0], y = position[1]
        let pos = new SuperMap.LonLat(x, y)
        // console.log(direction, "direction")
        //投影转换，再取出来转换过的坐标
        pos.transform("EPSG:4326", "EPSG:3857");
        x = pos.lon
        y = pos.lat
        // console.log(x, y, scale)
        if (this.map) {
          this.map.setCenter(new SuperMap.LonLat(x, y), scale);
        }
        if (!this.marker) {
          let point = new SuperMap.Geometry.Point(x, y)
          this.marker = new SuperMap.Feature.Vector(point);
          this.layers.pointLayer.addFeatures([this.marker]);
        }
        // console.log(markerIcon,"55")
        this.marker.style = {
          fillcolor: 'red',
          strokeColor: 'yellow',
          pointRadius: 20,
          externalGraphic: markerIcon,
          rotation: direction
        }
        this.marker.geometry.x = x
        this.marker.geometry.y = y
        this.layers.pointLayer.redraw()
      },
      openMiniMapFn() {
        // this.iscloseMiniMap = !this.iscloseMiniMap
        this.iscloseMiniMap = true
      },
      closeMiniMap() {
        this.iscloseMiniMap = false
      }
    },
    mounted() {
      // console.log(this.mapName, "this.mapName")
      this.loadLayers()
      // setInterval(this.updateMarker,2000)
    }
  }
</script>

<style>
  .miniMapCont {
    width: 500px;
    height: 350px;
    /* background: #081C31;
    border-radius: 8px;
    border: 2px solid #4FACFF; */
    padding: 0 10px;
    z-index: 9999;
  }

  #map {
    box-shadow: 0 0 5px 5px #081c31 inset;
  }

  .text {
    width: 100%;
    height: 31px;
    text-align: start;
    padding-left: 5px;
    vertical-align: middle;
    line-height: 50px;
    font-size: 20px;
    font-family: AlibabaSans-Regular, AlibabaSans;
    font-weight: 400;
    color: #FFFFFF;
  }

  .closeMiniMapBtn {
    float: right;
    margin: 14px 5px 0 0;
    cursor: pointer;
  }

  .openMiniMap {
    position: absolute;
    right: 20px;
    bottom: 10px;
    z-index: 9999;
    cursor: pointer;
  }
</style>
