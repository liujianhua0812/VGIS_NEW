<template>
  <div style="width: 100%; height: 100%; position: relative;min-width: 300px;" class="mapPipeLine">
    <div ref="map" style="width: 100%; height: 100%;"></div>
    <div class="operatingrow">
      <el-select v-model="selectValue" placeholder="Select" @change="changeSelectValue"
                 :class="[isSelectActive ? 'siteStyle':'el-select']" @focus="selectActive()">
        <el-option label="Situational Awareness" key="Situational Awareness" value="type_1"></el-option>
        <el-option label="Wells Production Monitoring" key="Wells Production Monitoring" value="type_2">
        </el-option>
        <el-option label="Pipeline Overview" key="Pipeline Overview" value="type_3"></el-option>
      </el-select>
    </div>
  </div>
</template>
<script>

  import config from "@/config";
  let attribution = "";
  export default {
    name: "centerMap",
    props: {
      mapName: String,
      action: Boolean,
      selectValue: String,
    },
    data() {
      return {
        source: `${this.$store.state.setting.gis.initial2D}/${this.mapName}`,
        map: {},
        centerX: '',
        centerY: '',
        isSelectActive: false,
        coords: []
      }
    },
    methods: {
      // Initialize the map
      loadMap() {

        var myChart = echarts.init(this.$refs.map, 'light');
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
                  // "attribution": attribution,
                  "type": "raster",
                  "tiles": [`${this.source}/zxyTileImage.png?z={z}&x={x}&y={y}&transparent=true`],
                  "format": "png",
                  "tileSize": 256
                },
                "google-tiles": {
                  // "attribution": attribution,
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
            // light: {
            //     main: {
            //         intensity: 1,
            //         shadow: true,
            //         shadowQuality: 'high'
            //     },
            //     ambient: {
            //         intensity: 0.
            //     },
            // },
          },
          series: [{
            type: 'bar3D',
            roam: false,
            shading: 'realistic',
            coordinateSystem: 'mapbox',
            barSize: 0.2,
            minHeight: 10,
            silent: true,
            data: [],//this.coords,
            label: {
              show: false,
              textStyle: {
                background: 'transparent',
                color: '#000000',
              },
              formatter(params) {
                return params.data[2]
              }
            }
          }]
        };
        myChart.setOption(option);
        var mapbox = myChart.getModel().getComponent('mapbox3D').getMapbox();
        mapbox.addControl(new mapboxgl.NavigationControl(), 'top-left');
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
      }
    },
    mounted() {
      this.getLonlatCenter()
      this.loadMap()
    }
  }
</script>

<style scoped>

  .siteStyle >>> .el-input__inner {
    background: rgba(79, 172, 255, 1) !important;
    width: 100%;
    color: #FFFFFF !important;
    z-index: 99999;
  }

  .operatingrow {
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

  .el-select {
    width: 100%;
    height: 36px;
    line-height: 36px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 6px;
    color: #FFF;
    cursor: pointer;
  }

  .el-select >>> .el-input__inner {
    background: rgba(79, 172, 255, 1) !important;
    width: 100%;
  }

  .mapPipeLine .el-select-dropdown__item.hover {
    color: #FFF !important;
    height: 35px;
    background: rgba(216, 216, 216, 0.4);
  }

  .mapPipeLine .el-select-dropdown {
    height: 115px;
    /* background-color:transparent; */
    background: rgba(0, 0, 0, 0.7) !important;
    border-radius: 6px;
    color: #FFF !important;
    z-index: 99999;
  }

  .mapPipeLine .el-select-dropdown__item span {
    color: #FFF !important;
    z-index: 9999;
  }

  #map {
    position: absolute;
    top: 0;
    bottom: 0;
    overflow: hidden;
    box-shadow: 0 0 5px 5px #081c31 inset;
  }
</style>
