<template>
  <div style="width: 100%; height: 100%; position: relative;min-width: 300px;" class="twoDMap">
    <div id="controlbtn" ref="controlbtn"></div>
    <div ref="map" style="width: 100%; height: 100%;"></div>
    <div class="overlay"></div>
    <div class="stationInfo" v-if="showPanel">
      <CPF1InfoPanel :poi="currentPOI" v-if="currentPOI.tag === 'CPF1'"></CPF1InfoPanel>
      <DS1InfoPanel :poi="currentPOI" v-else-if="currentPOI.tag === 'DS1'"></DS1InfoPanel>
      <DS2InfoPanel :poi="currentPOI" v-else-if="currentPOI.tag === 'DS2'"></DS2InfoPanel>
      <WarehouseInfoPanel :poi="currentPOI" v-else-if="currentPOI.tag === 'Warehouse-1'" :title="currentPOI.name"></WarehouseInfoPanel>
      <WellInfoPanel :poi="currentPOI" v-else-if="currentPOI.tag && currentPOI.tag.match(/MJ-\d{2}/)"></WellInfoPanel>
      <TankInfoPanel :poi="currentPOI" v-else-if="currentPOI.type ==='Tank'" :location="parentMap[currentPOI.tag] ? parentMap[currentPOI.tag].tag : ''"></TankInfoPanel>
      <CCTVInfoPanel :poi="currentPOI" v-else-if="currentPOI.type === 'CCTV'"></CCTVInfoPanel>
      <WellPadInfoPanel :poi="currentPOI" v-else-if="currentPOI.tag && currentPOI.tag.match(/MJ-[EF]\d{2}/)"></WellPadInfoPanel>
      <SeparatorInfoPanel :poi="currentPOI" v-else-if="currentPOI.type" :location="parentMap[currentPOI.tag] ? parentMap[currentPOI.tag].tag : ''"></SeparatorInfoPanel>
      <OtherInfoPanel :poi="currentPOI" v-else :title="currentPOI.tag"></OtherInfoPanel>
    </div>
    <button class="button" @click="backButton" type="primary" style="margin-left: 16px;padding: 0;"
      v-show="isBackBtn"><i class="el-icon-back"></i> Back</button>
    <div class="operatingList" id="operatingList">
      <el-select v-if="getRouteName=='Name'" style="display:none" v-model="selectValue" placeholder="Select"
        :popper-append-to-body="false" @change="changeSelectValue" :class="[isSelectActive? 'siteStyle':'selectType']"
        @focus="selectActive()">
        <el-option label="Situational Awareness" key="Situational Awareness" value="type_1"></el-option>
        <el-option label="Wells Production Monitoring" key="Wells Production Monitoring" value="type_2"></el-option>
        <el-option label="Pipeline Overview" key="Pipeline Overview" value="type_3"></el-option>
      </el-select>
      <el-select v-else v-model="selectValue" placeholder="Select" :popper-append-to-body="false"
        @change="changeSelectValue" :class="[isSelectActive? 'siteStyle':'selectType']" style="border-radius:4px;" @focus="selectActive()">
        <el-option label="Situational Awareness" key="Situational Awareness" value="type_1"></el-option>
        <el-option label="Wells Production Monitoring" key="Wells Production Monitoring" value="type_2"></el-option>
        <el-option label="Pipeline Overview" key="Pipeline Overview" value="type_3"></el-option>
      </el-select>
      <vgis-collapse title="Regions" v-model="showSearchPanel" class="noc-vgis-collapse-search">
        <div class="menuTitle menuTitleMenus" @click="showSearchList()">
          <div class="searchMenuList" ref="searchMenuList">
            <div class="searchCatalogue">
              <div class="searchCatalogueList" v-if="!isSearchVal">
                <el-tree :data="hierarchyTreeData" accordion :props="defaultProps" node-key="tag"
                         :default-expanded-keys="['Majnoon Oilfield']" ref="multipleTable">
                  <template v-slot:default="{ node, data }">
                    <div :class="{treeDataList:data.poi,treeDataListItem:data.children}">
                      <span class="treeText" @click="searchMap(node.data.tag)"
                            :title="node.label">{{node.label}}</span>
                    </div>
                  </template>
                </el-tree>
              </div>
              <template v-else>
                <template v-if="getSearchData.length === 0">
                  暂无数据
                </template>
                <ul class="searchfilterList" v-else>
                  <template v-for="item in getSearchData">
                    <li><span v-if="item[0].poi" ref="filterName" @click="searchMap(item[0].name)"
                              style="font-size: 16px;">{{item[0].name}}</span>
                      <template v-if="item[1]">
                        <span ref="filterName" @click="searchMap(item[1].name)"
                              style="color:#ddd;font-size: 16px;">{{item[1].name}}
                        </span>
                      </template>
                    </li>
                  </template>
                </ul>
              </template>
            </div>
          </div>
        </div>
      </vgis-collapse>
    </div>
  </div>
</template>
<script>
  import markerIcon from "@/assets/images/alarm.png"
  import { getHierarchy } from "@/assets/js/api/hierarchy";
  import config from "@/config";
  import 'canvas-toBlob'
  import VgisCollapse from '@/components/Standard/vgis-collapse'

  import WellInfoPanel from "@/components/InfoPanels/Dashboard/WellInfoPanel"
  import WellPadInfoPanel from "@/components/InfoPanels/Dashboard/WellPadInfoPanel";
  import DS2InfoPanel from "@/components/InfoPanels/Dashboard/DS2InfoPanel"
  import DS1InfoPanel from '@/components/InfoPanels/Dashboard/DS1InfoPanel'
  import SeparatorInfoPanel from "@/components/InfoPanels/Dashboard/SeparatorInfoPanel"
  import TankInfoPanel from "@/components/InfoPanels/Dashboard/TankInfoPanel"
  import CPF1InfoPanel from '@/components/InfoPanels/Dashboard/CPF1InfoPanel'
  import WarehouseInfoPanel from "@/components/InfoPanels/Dashboard/WarehouseInfoPanel";
  import OtherInfoPanel from "@/components/InfoPanels/Dashboard/OtherInfoPanel";
  import CCTVInfoPanel from "@/components/InfoPanels/Dashboard/CCTVInfoPanel";

  export default {
    name: "centerMap",
    props: {
      mapName: String,
      action: Boolean,
      mapPosition: Object,
      position: Array,
      selectValue: String,
      currentTag: String
    },
    computed: {
      hierarchyTreeData() {
        var result = this.getHierarchyList;
        if (result && result.forEach) {
          result.forEach(item => {
            item.tag = item.name;
          });
        }
        return result;
      },
      alarmNameList() {
        // 通过vuex的getters方法来获取state里面的数据
        return this.$store.getters.getAlarm

      },
      getRouteName: function () {
        return this.$store.getters.getRouteType
      },
      storeData() {
        let result = {
          // 子级名称：父级名称
        };
        this.filterHierarchyFn(result, this.getHierarchyList, null);
        return result;
      },
    },

    components: {
      VgisCollapse,
      WellInfoPanel,
      DS2InfoPanel,
      WellPadInfoPanel,
      SeparatorInfoPanel,
      TankInfoPanel,
      DS1InfoPanel,
      CPF1InfoPanel,
      WarehouseInfoPanel,
      OtherInfoPanel,
      CCTVInfoPanel
    },
    data() {
      var source = `${this.$store.state.setting.gis.host2D}/${this.mapName}`;
      return {
        source: `${this.$store.state.setting.gis.host2D}/${this.mapName}`,
        serverUrl: `${config.map.source.host}+"/iserver/services/plot-jingyong/rest/plot/"`,
        showSearchPanel: false,
        infowin: null,
        map: {},
        currentPOI: '',
        active: '',
        parentMap: {},
        showPanel: false,
        placing: false,
        layers: {},
        subLayers: [],
        controllers: {},
        drawGraphicObject: {},
        modelName: "DS2",
        count: [],
        drawer: true,
        searchInput: '',
        isSearchVal: false,
        getSearchData: [],
        getHierarchyList: [],//层级树å
        isSelectActive: true,
        searchClickVal: '',
        marker: '',
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        updateSource: null,
        isBackBtn: false,//back按钮是否显示
      }
    },
    created() {
      window.MarkerCont = this.MarkerCont
      window.MapBackgroundFn = (backgroundData) => {
        this.asyncSave(backgroundData);
      }
    },
    watch: {
      alarmNameList() {
        this.AlarmEvents(this.$store.state.alarms.production)
      },
      currentTag(newValue) {
        this.searchMap(newValue)
      },
      position(newValue) {
        if (this.updateSource != "centerMap") {
          this.setMapCenter2D(newValue)
        }
        this.updateSource = null;
      },
    },
    methods: {
      filterHierarchyFn(result, list = [], parent = null) {// result // 本级list // 父级name
        if (list && list.forEach) {
          for (let i = 0; i < list.length; i++) {
            let item = list[i]
            if (parent) {
              result[item.tag] = parent
            }
            if (item.poi) {
              this.filterHierarchyFn(result, item.children, item)
            } else {
              this.filterHierarchyFn(result, item.children, parent)
            }
          }
        }
      },
      backButton() {
        let parentTag = this.storeData[this.currentTag] || "";
        this.searchMap(parentTag.tag)
      },
      getRouteNameFn() {
        if (this.getRouteName == "Name") {
          var switchRoute = document.getElementById("operatingList")
          switchRoute.style.width = "250px";
        }
      },
      changeSelectValue(value) {
        this.$emit("changeSelectValue", value)
      },
      handleChange(val) {
        this.isSelectActive = false
        this.clearFeatures()
      },
      selectActive() {
        this.isSelectActive = true
      },
      isShowRoam() {
        this.isRoam = !this.isRoam
        this.istoolOverlook = false
        this.isThematicPanel = false
        this.isPopupWin = false
      },
      // Initialize line layer (for distance measurement)
      initializeLineLayer(index) {
        this.layers.pointLayer = new SuperMap.Layer.Vector("pointLayer")
        this.layers.pointLayer.index = index
        this.layers.lineLayer = new SuperMap.Layer.Vector("lineLayer")//距离量算
        this.layers.featuresLayer = new SuperMap.Layer.Vector("featuresLayer ")//点线面
        this.layers.polygonLayer = new SuperMap.Layer.Vector("polygonLayer"); //面积量算
        this.layers.lineLayer.index = index
        this.layers.featuresLayer.index = index
        this.layers.polygonLayer.index = index
        this.controllers.drawLine = new SuperMap.Control.DrawFeature(this.layers.lineLayer, SuperMap.Handler.Path);
        this.controllers.plottingEdit = new SuperMap.Control.PlottingEdit();

      },
      initializeBaseLayer(index) {
        if (window.google) {
          this.layers.baseLayer = new SuperMap.Layer.Google("Google Base Map", {
            type: google.maps.MapTypeId.SATELLITE,
            isBaseLayer: true,
          });
        }
        else {
          this.layers.baseLayer = new SuperMap.Layer.WMTS({
            name: "Base Layer",
            url: `https://t0.tianditu.gov.cn/img_w/wmts?tk=${this.$store.state.setting.gis.host2DBaseKey}`,
            layer: "img",
            style: "default",
            matrixSet: "w",
            format: "tiles",
            opacity: 1,
            requestEncoding: "KVP",
            isBaseLayer: true
          });
        }
        this.layers.baseLayer.index = index
      },
      // Initialize vector layer (no use for now)
      initializeVectorLayer(index) {
        let strategy = new SuperMap.Strategy.GeoText();
        this.layers.vectorLayer = new SuperMap.Layer.Vector("VectorLayer")
        this.layers.vectorLayer = new SuperMap.Layer.Vector("VectorLayer", { strategies: [strategy] })
        this.layers.vectorLayer.index = index
      },
      // Initialize main layer(our real map)
      initializeMainLayer(index) {
        this.layers.mainLayer = new SuperMap.Layer.TiledDynamicRESTLayer(this.mapName, this.source, {
          transparent: true,
          cacheEnabled: false
        }, { maxResolution: "auto", useCanvas: false, useCORS: true })
        this.layers.mainLayer.index = index
        this.layers.mainLayer.events.on({ "layerInitialized": this.loadMap });
      },
      // Initialize marker layer (to place marker for search result)
      initializeMarkerLayer(index) {
        this.layers.markers = new SuperMap.Layer.Markers("Markers")
        this.layers.markers.index = index
      },
      // Initialize plotting layer (for plotting)
      initializePlottingLayer(index) {
        this.layers.plottingLayer = new SuperMap.Layer.PlottingLayer("plotting layer", this.serverUrl);
        this.layers.plottingLayer.style = {
          fillColor: "#66cccc",
          fillOpacity: 0.4,
          strokeColor: "#66cccc",
          strokeOpacity: 1,
          strokeWidth: 3,
          pointRadius: 6
        };

        this.layers.plottingLayer.events.on({ "added": this.layerAdded });
        this.layers.plottingLayer.index = index
      },
      // Initialize all layers (put the main layer to the end to initialize the map properly)
      initializeLayers() {
        this.initializeBaseLayer(1)
        this.initializeVectorLayer(3)
        this.initializeLineLayer(4)
        this.initializeMarkerLayer(5)
        this.initializePlottingLayer(6)
        this.initializeMainLayer(2)
      },
      // Initialize the map
      loadMap() {
        this.map = new SuperMap.Map(this.$refs.map, {
          projection: "EPSG:3857",
          controls: [
            new SuperMap.Control.ScaleLine(),
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
        });
        const _container = document.createElement('div')
        document.body.appendChild(_container)
        this.setStyles(_container, {
          visibility: 'hidden',
          position: 'absolute',
          top: 0,
          bottom: 0,
        })
        //设置缩放位置
        this.$nextTick(() => {
          this.map.addControl(new SuperMap.Control.PanZoomBar({
            div: this.$refs.controlbtn,
          }))
        });
        let layers = Object.values(this.layers)
        layers.sort((i1, i2) => i1.index - i2.index)
        this.map.addLayers(layers)
        this.map.setBaseLayer(this.layers.mainLayer)
        this.map.events.on({
          "click": this.placeMarker,
          "move": this.moveFn
        })
        this.$nextTick(() => {
          this.setMapCenter2D(this.position);
        });
      },
      updateMarker(x, y, name, tagName) {
        let that = this
        let markers = this.layers.markers;
        let size = new SuperMap.Size(23, 21);
        let offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
        let icon = new SuperMap.Icon(markerIcon, size, offset);
        let marker = new SuperMap.Marker(new SuperMap.LonLat(x, y, 0), icon)
        // marker绑定点击事件
        marker.events.on({
          "click": openInfoWin
        })
        function openInfoWin(eventArgs) {
          that.$emit("changeMapFlag", tagName, true);
        }
        markers.addMarker(marker);
      },
      moveFn() {
        var pos = this.map.getCenter();
        pos.transform("EPSG:3857", "EPSG:4326");
        this.updateSource = "centerMap";
        let scale = this.map.getZoom();
        this.$emit("pos-updated", [pos.lon, pos.lat], "2D", scale);
      },
      setMapCenter(params) {
        var params = params || {};
        if (params.type == "lonlat") {
          this.setMapLonLat(params.data.lon, params.data.lat);
        }
      },
      setMapCenter2D(position) {
        let x = position[0], y = position[1]
        this.setMapLonLat(x, y);
      },
      setMapLonLat(lon, lat) {
        var pos = new SuperMap.LonLat(lon, lat);
        pos.transform("EPSG:4326", "EPSG:3857");
        let zoom = this.map.getZoom()
        this.map.setCenter(pos, zoom ? zoom : this.$store.state.setting.gis.initial2D.zoom);
      },
      getMapCenter() {
        var data = this.map.getCenter() || {};
        var lon = data.lon;
        var lat = data.lat;
        return {
          type: "SuperMap.LonLat",
          data: {
            lon: lon,
            lat: lat
          }
        };
      },
      setStyles(element, styles) {
        for (const style in styles) {
          element.style[style] = styles[style]
        }
      },
      // -----------------
      asyncDrawCanvas(backgroundData, params) {
        const { width, height, canvas, ctx, id } = backgroundData;
        const { imageData, mime } = params;

        let img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageData;
        ctx.drawImage(img, 0, 0, width, height);
        this.saveImage(canvas.toDataURL(mime), mime);

      },
      MarkerCont() {
        if (document.getElementById("markerCont")) {
          document.getElementById("markerCont").style.display = "none";
        }
        if (document.getElementById("markerPlot")) {
          document.getElementById("markerPlot").style.display = "none";
          this.isCalculate = false
        }
      },
      setCard(x, y, scale) {
        this.map.setCenter(new SuperMap.LonLat(x, y), scale);
      },
      setLayerStatus(subLayer) {
        subLayer.visible = !subLayer.visible
        let visibleLayers = this.subLayers.reduce((result, layer, index) => layer.visible ? result.concat([index]) : result, [])
        // Use layersID property to control visibility is recommended.
        this.layers.mainLayer.params.layersID = visibleLayers.length ? `[0:${visibleLayers.join(',')}]` : "[]";
        this.layers.mainLayer.redraw();
      },
      showSearchList() {
        document.getElementById("searchMenuList").style.right = "100px"
        document.getElementById("searchMenuList").style.left = "inherit"
        document.getElementById("searchMenuList").style.width = "200px"
        this.clearFeatures();
        getHierarchy().then(data => {
          data = data || {};
          this.getHierarchyList = data.data || [];
        })
      },
      //警报事件
      AlarmEvents(arr) {
        arr.map(item => {
          this.layers.vectorLayer.removeAllFeatures();
          let queryParam = [];
          queryParam[0] = new SuperMap.REST.FilterParameter({
            name: "MJ_Wells_Surface_Location_01Jan18@Majnoon",
            attributeFilter: "Tag = '" + item.num + "'",
          });
          queryParam[1] = new SuperMap.REST.FilterParameter({
            name: "MJ_Facilities_Outlines@Majnoon",
            attributeFilter: "NAME = '" + item.num + "'",
          });
          queryParam[2] = new SuperMap.REST.FilterParameter({
            name: "MJ_Equipment@Majnoon",
            attributeFilter: "Tag = '" + item.num + "'",
          });
          queryParam[3] = new SuperMap.REST.FilterParameter({
            name: "CCTV@Majnoon",
            attributeFilter: "Tag = '" + item.num + "'",
          });
          let queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
            queryParams: queryParam
          });
          let myQueryBySQLService = new SuperMap.REST.QueryBySQLService(this.source, {
            eventListeners: {
              "processCompleted": this.AlarmList,
              "processFailed": this.queryError
            }
          });
          myQueryBySQLService.processAsync(queryBySQLParams);
        })
      },
      AlarmList(queryEventArgs) {
        let that = this
        let result = queryEventArgs.originResult;
        let firstItem = null;
        let firstName = null
        if (result && result.recordsets) {
          if (result.recordsets.forEach) {
            that.layers.markers.clearMarkers();
            result.recordsets.forEach(item => {
              if (item && item.features && item.features.forEach) {
                item.features.forEach(scope => {
                  if (scope && scope.geometry && scope.geometry.center) {
                    let data = scope.geometry.center
                    let name = scope.fieldValues[2]
                    let tagName = scope.fieldValues[4]
                    if (scope.fieldValues[26]) {
                      tagName = scope.fieldValues[26]
                      name = scope.fieldValues[26]
                    }
                    if (!scope.fieldValues[26]) {
                      if (scope.fieldValues.length > 7) {
                        name = scope.fieldValues[10]
                        tagName = scope.fieldValues[10]
                      } else {
                        name = scope.fieldValues[2]
                        tagName = scope.fieldValues[4]
                      }
                    }
                    if (firstItem == null) {
                      firstItem = data
                    }
                    that.updateMarker(data.x, data.y, name, tagName)
                  }
                })
              }
            })
          }
        }
        if (firstItem) {
          that.setCard(firstItem.x, firstItem.y, 25)
        }
      },
      //Regions查询
      searchMap(val) {
        this.layers.vectorLayer.removeAllFeatures();
        let queryParam = [];
        queryParam[0] = new SuperMap.REST.FilterParameter({
          name: "MJ_Wells_Surface_Location_01Jan18@Majnoon",
          attributeFilter: "Tag = '" + val + "'",
        });
        queryParam[1] = new SuperMap.REST.FilterParameter({
          name: "MJ_Facilities_Outlines@Majnoon",
          attributeFilter: "NAME = '" + val + "'",
        });
        queryParam[2] = new SuperMap.REST.FilterParameter({
          name: "MJ_Equipment@Majnoon",
          attributeFilter: "Tag = '" + val + "'",
        });
        queryParam[3] = new SuperMap.REST.FilterParameter({
          name: "CCTV@Majnoon",
          attributeFilter: "Tag = '" + val + "'",
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
        let result = queryEventArgs.originResult;
        let firstItem = null
        if (result && result.recordsets) {
          for (let i = 0; i < result.recordsets.length; i++) {
            let recordSet = result.recordsets[i]
            if (recordSet.features.length > 0) {
              firstItem = recordSet.features[0]
              break
            }
          }
          if (firstItem) {
            this.layers.markers.clearMarkers()
            let data = firstItem.geometry.center
            let nameFieldIndex = -1
            let tagFieldIndex = firstItem.fieldNames.indexOf('Tag')
            let typeFieldIndex = firstItem.fieldNames.indexOf('Type')
            let candidates = ['WELLNAME', 'NAME', 'Name']
            for (let i = 0; i < candidates.length; i++) {
              nameFieldIndex = firstItem.fieldNames.indexOf(candidates[i])
              if (nameFieldIndex !== -1) {
                break
              }
            }
            let position = new SuperMap.LonLat(firstItem.geometry.center.x, firstItem.geometry.center.y)
            position.transform("EPSG:3857", "EPSG:4326");

            this.currentPOI = {
              tag: firstItem.fieldValues[tagFieldIndex],
              type: firstItem.fieldValues[typeFieldIndex],
              name: firstItem.fieldValues[nameFieldIndex],
              position: [position.lon, position.lat]
            }
            this.showPanel = true

            let sourceId = firstItem.fieldNames.indexOf("ModelSource")
            this.$emit('changeMapFlag', this.currentPOI.tag, sourceId !== -1)
            this.setCard(data.x, data.y, 25)
          }
        }
      },
      getParentMap(list, parent, result) {
        if (list instanceof Array) {
          for (let i = 0; i < list.length; i++) {
            if (list[i].tag) {
              result[list[i].tag] = parent
            }
            this.getParentMap(list[i].children, list[i].poi ? list[i] : parent, result)
          }
        }
        return result
      },
      getHierarchy() {
        getHierarchy().then(data => {
          data = data || {};
          this.getHierarchyList = data.data || [];
        })
      },
      getFiltersData(list, searchVal) {
        let result = [];
        let ary = [];
        this.getFiltersCore(ary, list);
        if (ary && ary.filter) {
          result = ary.filter(item => item[0].name.indexOf(searchVal) >= 0);
        }
        return result;
      },
      getFiltersCore(ary, list, parentItem) {
        if (list && list.forEach) {
          list.forEach(item => {
            if (parentItem) {
              ary.push([{ ...item, children: undefined }, { ...parentItem, children: undefined }]);
            } else {
              ary.push([{ ...item, children: undefined }]);
            }
            this.getFiltersCore(ary, item.children, item);
          });
        }
      },
      calculate() {
        this.clearFeatures()
        this.isCalculate = !this.isCalculate
        this.placing = false
        this.isMeasure = false
        this.isPopupWin = false
        this.measureTips = false
      },
      clearFeatures(val) {
        this.layers.markers.clearMarkers()
      },
    },
    mounted() {
      this.getRouteNameFn()
      this.getHierarchy()
      this.initializeLayers()
    }
  }
</script>
<style>

  div.twoDMap .el-tree {
    color: #FFF;
    background-color: rgba(0, 0, 0, 0.1);
    margin: 0;
  }

  .button {
    z-index: 1998;
    position: absolute;
    left: 0px;
    top: 78%;
    width: 92px;
    border: none;
    height: 35px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 6px;
    color: #000;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    cursor: pointer;

  }

  .twoDMap .el-select {
    width: 107px;
  }

  #SuperMap_Control_MaximizeDiv {
    display: none;
  }

  .siteStyle .el-input__inner {
    background: #3D98FF !important;
    color: #FFFFFF !important;
    height: 36px !important;
  }

  div.twoDMap.el-input div.twoDMap.el-input--suffixu {
    width: 260px;
    height: 115px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    color: #FFF
  }

  div.twoDMap .el-input .el-input--suffix {
    height: 36px;
  }

  .operatingList .el-tree-node__content:hover {
    /*background-color: rgba(108, 180, 255, 0.2) !important;*/
    background: rgba(108, 180, 255, 0.2) !important;
  }

  .markerCont {
    z-index: 999999;
  }

  .markerCont h1 {
    background: #081C31;
    height: 28px;
    font-size: 16px;
    font-family: AlibabaSans-Bold, AlibabaSans;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 28px;
    text-indent: 10px;
    margin: 0;
  }

  .markerCont img.closeMarker {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 5px;
    top: 8px;
    cursor: pointer;
  }

  img.closeMarker {
    width: 18px;
    height: 18px;
    position: absolute;
    right: 2px;
    top: 2px;
    cursor: pointer;
  }

  .markerCont ul {
    background: #081C31;
    margin-top: 15px;
    border-radius: 4px;
    height: 100px;
    overflow-y: auto;
    margin: 0;
  }

  .markerCont ul li {
    color: #fff;
    font-size: 14px;
    padding: 5px 10px;
    word-wrap: break-word;
    word-break: normal;
  }

  .markerContSpan {
    color: #3D98FF;
    margin-left: 5px;
  }

  #chicken {
    background-color: rgb(255 255 255) !important;
  }

  .markerPlot {
    background: #081C31;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
    padding: 10px;
    border-radius: 4px;
    font-size: 14px;
    font-family: AlibabaSans-Regular, AlibabaSans;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 22px;
  }

  .selectType {
    width: 107px;
    /* height: 36px; */
    /* line-height: 36px; */
    /* background: rgba(0, 0, 0, 0.7) !important; */
    /* border-radius: 6px; */
    cursor: pointer;
    border: none
  }

  .twoDMap .el-select-dropdown__item.hover {
    color: #FFF;
    width: 100%;
    height: 35px;
    background: rgba(216, 216, 216, 0.4);
    width: 100%;
  }

  .twoDMap .el-select-dropdown__item.hover,
  .twoDMap .el-select-dropdown__item:hover {
    background: rgba(216, 216, 216, 0.4) !important;
  }

  .twoDMap .el-select-dropdown {
    width: 260px;
    height: 115px;
    background-color: rgba(0, 0, 0, 0.7) !important;
    border-radius: 6px;
    color: #FFF;
    z-index: 9999;
  }

  .twoDMap .el-select-dropdown__item span {
    color: #FFF !important;
    z-index: 9999;
  }

  .el-tree-node:focus>.el-tree-node__content {
    background: rgba(108, 180, 255, 0.2) !important;

  }
</style>
<style lang="scss" scoped>

  .noc-vgis-collapse-search {
    width: 250px;
  }

  .downImgs {
    width: 100px;
    height: 100px;
    background: #3D98FF;
    z-index: 999999;
    position: absolute;
    left: 200px;
    top: 500px;
  }

  .stationInfo {
    position: absolute;
    left: 13px;
    top: 20px;
    width: 323px;
    height: 500px;
    z-index: 1999;
  }

  .monitoring {
    margin-top: 11px;
    width: 323px;
    height: 229px;
    padding: 16px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 8px;
  }

  .smButton {
    display: none;
  }

  #menu {
    background: rgba(0, 0, 0, 0.7);
    position: fixed;
    top: 200px;
    left: 200px;
    width: 500px;
    height: 200px;
    z-index: 99999;
  }

  /* width: 250px; */
  .operatingList {
    position: absolute;
    right: 20px;
    top: 20px;
    /* background: rgba(0, 0, 0, 0.7); */
    z-index: 1999;
    height: auto;
    width: 372px;
    display: flex;
    justify-content: space-between
  }

  div.twoDMap .treeLevel {
    color: #FFF;
    background-color: rgba(0, 0, 0, 0.1);
    margin: 0;
  }

  .operatingList .el-tree-node__content:hover {
    background: rgba(108, 180, 255, 0.2) !important;
    background-color: rgba(108, 180, 255, 0.2) !important;
  }

  .active {
    color: #FFFFFF;
  }

  .operatingList .el-tree-node:focus>.el-tree-node__content {
    background: rgba(108, 180, 255, 0.2) !important;
    ;
  }

  .operatingList .el-input__inner {

    /* background: rgba(0, 0, 0, 0.7); */
    border-radius: 4px;
    color: #fff;
    height: 30px;
    border: 1px solid #8A8A8A;
  }

  .showtext {
    font-size: 18px;
    font-weight: 800;
    color: #081C31;
    cursor: pointer;
  }

  #SuperMap_Control_MaximizeDiv {
    display: none;
  }

  #main {
    margin: 0 auto;
    width: 100%;
    height: 100%;
    position: absolute;
  }

  #map {
    box-shadow: 0 0 5px 5px #081c31 inset;
  }

  div.twoDMap .el-tree-node__content {
    height: 35px;
  }

  .roam,
  .thematicPanel,
  .popupWindow,
  .searchMenuList {

    z-index: 99999;
    height: auto;
    /* background: rgba(0, 0, 0, 0.7); */
    width: auto;
    min-width: 180px;
  }

  .roam ul li span {
    display: block;
  }

  .roam ul li span,
  .roam ul li img {
    margin: 10px 15px;
  }

  .roam ul li img {
    border: 1px solid #2e5f91;
  }

  .searchMenuList {
    overflow-y: auto;
  }

  .toolRoamAct,
  .toolOverlookAct,
  .active,
  .LayerBtnsAct,
  .regionsBtnsAct,
  .thematicBtnsAct {
    background: #124375;
  }

  .searchfilterList {
    width: 100%;
    height: auto;
    max-height: 300px;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.7);
    position: absolute;
    left: 0;
    /* top: 40px; */
    top: 0px;
  }

  .searchfilterList li {
    color: #fff;
    margin: 0 20px;
    cursor: pointer;
  }

  .searchfilterList li span {
    color: #ccc;
  }

  .search {
    margin: 10px 20px;
  }

  .controlBtn {
    position: absolute;
    right: 20px;
    z-index: 1999;
    top: 20px;
  }

  .panel-heading {
    padding: 10px 15px;
    border-bottom: 1px solid transparent;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }

  .regionsBtns {
    color: #fff;
  }

  .thematicBtns {
    color: #fff;
  }

  .tools ul {
    margin-left: 17px;
    list-style: none;
  }

  .tools ul.toolsLevel {
    margin-top: 5px;
    color: #fff !important
  }

  .tools ul li ul {
    margin-left: 0px;
  }

  .tools ul li {
    text-align: left;
  }

  .tools ul li.toolsTopBtns {
    font-size: 16px;
    font-family: AlibabaSans-Bold, AlibabaSans;
    font-weight: bold;
    color: #4FACFF;
    padding-left: 30px;
  }

  .treeDataList {
    width: 100%;
    text-align: left;
    margin-right: 10px;
    height: 30px;
    line-height: 30px;
  }

  .treeDataList .treeText {
    width: 150px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 30px;
    line-height: 30px;
  }

  .toolRoamAct,
  .toolOverlookAct {
    background: #124375;
  }

  .treeDataListItem {
    width: 100%;
    text-align: left;
    color: #4FACFF;
    position: relative;
  }

  .operatingList .el-tree-node__content>.el-tree-node__expand-icon {
    color: #93aec5;
  }

  .operatingList .el-tree-node__expand-icon.is-leaf {
    color: transparent;
    cursor: default;
  }

  .measureTips,
  .showArea {
    width: 215px;
    font-size: 14px;
    font-family: AlibabaSans-Regular, AlibabaSans;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 25px;
    position: absolute;
    right: 20px;
    top: 20px;
    background: rgba(70, 70, 70, 0.8);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    z-index: 9999;
    padding: 5px;
  }

  .serchInput {
    position: absolute;
    /* left: 190px; */
    right: 105px;
    top: -45px;
    z-index: 999;
    width: 476px;
    background: #081C31;
    border-radius: 8px;
    border: 2px solid #4FACFF;
    text-align: left;
    height: 30px;
    display: flex;
  }

  .serchInput input {
    border: none;
    width: 360px;
    height: 26px;
    outline: none;
    background: #081C31;
    margin: 0;
    float: left;
  }

  .serchInput input:focus {
    border: none;
  }

  .serchInput button {
    height: 28px;
    width: 112px;
    background: rgba(79, 172, 255, 0.4);
    border-radius: 0px 4px 4px 0px;
    cursor: pointer;
    border: none;
    font-size: 18px;
    font-family: AlibabaSans-Regular, AlibabaSans;
    font-weight: 400;
    padding: 0;
    margin: 0;
    position: absolute;
    right: -1px;
    top: -1px;
  }

  .thematicPanel ul {
    list-style: none;
    margin-top: 10px;
  }

  .thematicPanel ul li,
  .tools ul li {
    font-size: 16px;
    font-family: AlibabaSans-Regular, AlibabaSans;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 35px;
    cursor: pointer;
  }

  .tools {
    position: absolute;
    right: 19px;
    top: 80px;
    width: 195px;
    background: #081C31;
    border-radius: 6px;
    border: 2px solid #4FACFF;
    z-index: 1999;
  }

  #controlbtn {
    position: absolute;
    right: 100px;
    bottom: 200px;
    z-index: 1999;
  }
</style>
