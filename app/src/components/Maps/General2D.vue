<template>
  <div style="position:relative">
    <div style="width: 100%; height: 100%; position: absolute; min-width: 300px;">
      <div id="controlbtn" ref="controlbtn"></div>
      <div class="map" :id="`${mapInfo.name}-2D`" style="width: 100%; height: 100%;" onmouseover="this.style.cursor='default'"></div>
      <div v-show="showLayers" class="map-layers" style="width: 400px;text-align: left;">
        <div class="winTitle">
          <span class="title_left"></span>
        </div>
        <div class="labelInfo" id="labelInfo">
          <div class="winContent" style="overflow-y: scroll; height:100%;">
            <label v-for="subLayer in subLayers" class="checkbox" style="line-height: 28px; display: block"
                   :title="subLayer.name">
              <input type="checkbox" class="checkboxSel" name="layersList" v-if="subLayer.visible" checked
                     @change="setLayerStatus(subLayer)"/>
              <input type="checkbox" class="checkboxSel" name="layersList" v-else @change="setLayerStatus(subLayer)"/>
              {{ subLayer.name }}
            </label>
          </div>
        </div>
        <span class="closeLayerID" @click="closeNavigation('layers')"><i class="el-icon-close"></i></span>
      </div>
      <div class="map-navigation" v-show="showNavigation">
        <div class="searchCatalogue">
          <div class="searchCatalogueList">
            <el-tree class="custom" :data="getHierarchyList" accordion :props="defaultProps" node-key="tag"
                     :default-expanded-keys="getHierarchyList.map(item => item.tag)" @node-click="searchMap"
                     ref="multipleTable">
              <template v-slot:default="{ node, data }">
                <div :class="{treeList:data.poi,treeListItem:data.children}">
                  <span class="treeText">{{ node.label }}</span>
                </div>
              </template>
            </el-tree>
          </div>
        </div>
        <span :class="['pinID', { active: pinLayers }]" @click="pinNavigation"><i class="el-icon-coordinate"></i></span>
        <span class="closeID" @click="closeNavigation()"><i class="el-icon-close"></i></span>
      </div>
      <div :class="['map-information', { 'navigation-active': showNavigation }]"
           v-if="status === 'default' && showPanel">
        <CPF1InfoPanel :poi="currentPOI" v-if="currentPOI.tag === 'CPF1'" @closePop="closePop"></CPF1InfoPanel>
        <DS1InfoPanel :poi="currentPOI" v-else-if="currentPOI.tag === 'DS1'" @closePop="closePop"></DS1InfoPanel>
        <PCInfoPanel :poi="currentPOI" v-else-if="currentPOI.tag === 'PC'" @closePop="closePop"></PCInfoPanel>
        <DS2InfoPanel :poi="currentPOI" v-else-if="currentPOI.tag === 'DS2'" @closePop="closePop"></DS2InfoPanel>
        <WellInfoPanel :poi="currentPOI" v-else-if="currentPOI.tag && currentPOI.tag.match(/MJ-\d{2}/)"
                       @closePop="closePop"></WellInfoPanel>
        <WarehouseInfoPanel :poi="currentPOI" v-else-if="currentPOI.type === 'Warehouse'" :title="currentPOI.name"
                            @closePop="closePop"></WarehouseInfoPanel>
        <CCTVInfoPanel v-else-if="currentPOI.type === 'CCTV'" :poi="currentPOI" @closePop="closePop"></CCTVInfoPanel>
        <PipelineInfoPanel v-else-if="currentPOI.type === 'Pipeline'" :poi="currentPOI" @closePop="closePop"></PipelineInfoPanel>
        <EntranceInfoPanel v-else-if="currentPOI.type === 'Entrance Guard'" :poi="currentPOI" @closePop="closePop"></EntranceInfoPanel>
        <WellPadInfoPanel :poi="currentPOI" v-else-if="currentPOI.tag && currentPOI.tag.match(/MJ-[EF]\d{2}/)"
                          @closePop="closePop"></WellPadInfoPanel>
        <EquipmentInfoPanel :poi="currentPOI" v-else-if="currentPOI.type"
                            :location="parentMap[currentPOI.tag] ? parentMap[currentPOI.tag].tag : ''"
                            @closePop="closePop"></EquipmentInfoPanel>
        <OtherInfoPanel v-else :poi="currentPOI" :title="currentPOI.name" @closePop="closePop"></OtherInfoPanel>
      </div>
      <div :class="['map-control', { 'navigation-active': showNavigation }]" v-if="status === 'default' && showPanel">
        <DS2ControlPanel v-if="currentPOI.tag === 'DS2'" :poi="currentPOI"></DS2ControlPanel>
        <CPF1ControlPanel v-else-if="currentPOI.tag === 'CPF1'" :poi="currentPOI"></CPF1ControlPanel>
<!--        <WellControlPanel v-else-if="currentPOI.tag && currentPOI.tag.match(/MJ-\d{2}/)"-->
<!--                          :poi="currentPOI"></WellControlPanel>-->
        <WellPadControlPanel v-else-if="currentPOI.tag && currentPOI.tag.match(/MJ-[EF]\d{2}/)"
                             :poi="currentPOI"></WellPadControlPanel>
      </div>
      <div :class="['map-control', { 'navigation-active': showNavigation }]" v-show="!showPanel">
        <OtherControlPanel :position="cursorPosition"></OtherControlPanel>
      </div>
      <div class="map-plot-control-text" v-show="status === 'plot' && currentPlot.type === 'text'"
           :style="{ left: `${currentPlot.position}px` }">
        <el-input class="m-b-10" type="textarea" placeholder="Please input label's text" v-model="currentStyle.text">
        </el-input>
        <el-slider class="m-l-10" input-size="mini" :min="styleLib.fontSize[0]" :max="styleLib.fontSize[1]" show-input
                   v-model="currentStyle.fontSize"></el-slider>
      </div>
      <div class="map-plot-control-stroke"
           v-show="status === 'plot' && !['', 'text', 'marker'].includes(currentPlot.type)"
           :style="{ left: `${currentPlot.position}px` }">
        <div :class="['stroke-item', { active: stroke === currentStyle.stroke }]" v-for="stroke in styleLib.stroke"
             @click="setStyle('stroke', stroke)">
          <div class="stroke" :style="{height: `${stroke}px`}"></div>
        </div>
      </div>
      <div class="map-plot" v-show="status === 'plot'">
        <div :class="['map-plot-item', {active: currentPlot.type === 'marker'}]">
          <span ref="marker-entry" class="iconfont icon-mark" @click="dynamicPlot('marker', $event)"></span>
        </div>
        <div :class="['map-plot-item', {active: currentPlot.type === 'rectangle'}]">
          <span ref="rectangle-entry" class="iconfont icon-hollow-square1"
                @click="dynamicPlot('rectangle', $event)"></span>
        </div>
        <div :class="['map-plot-item', {active: currentPlot.type === 'circle'}]">
          <span ref="circle-entry" class="iconfont icon-hollow-circle" @click="dynamicPlot('circle', $event)"></span>
        </div>
        <div :class="['map-plot-item', {active: currentPlot.type === 'polygon'}]">
          <span ref="polygon-entry" class="iconfont icon-hollow-polygon" @click="dynamicPlot('polygon', $event)"></span>
        </div>
        <div :class="['map-plot-item', {active: currentPlot.type === 'line'}]">
          <span ref="line-entry" class="iconfont icon-line" @click="dynamicPlot('line', $event)"></span>
        </div>
        <div :class="['map-plot-item', {active: currentPlot.type === 'text'}]">
          <span ref="text-entry" class="iconfont icon-text" @click="dynamicPlot('text', $event)"></span>
        </div>
        <div :class="['map-plot-item', {active: currentPlot.type === 'arrow'}]">
          <span ref="arrow-entry" class="iconfont icon-arrow" @click="dynamicPlot('arrow', $event)"></span>
        </div>
        <div :class="['map-plot-item', {active: false}]">
          <span class="iconfont icon-close" @click="exitPlotMode(true)"></span>
        </div>
      </div>
      <!--      mark操作提示-->
      <div :class="['map-measure-hint', { 'avoid-layers': showLayers }]" v-show="status === 'plot'">
        <ul>
          <li><b><i class="iconfont icon-left-click"></i> Click</b> mark on the map to edit.</li>
          <li><b><i class="iconfont icon-mousewheel-copy"></i> Click</b> wheel to drag map.</li>
          <li><b><i class="iconfont icon-left-click"></i> Click</b> mark on the map and press <b
            style="border: 1px solid white; border-radius: 1px;" class="p-l-5 p-r-5 p-t-5 p-b-5">Delete</b> to delete mark.
          </li>
        </ul>
        <ul v-show="currentPlot.type === 'marker'||currentPlot.type === 'text'">
          <li><b><i class="iconfont icon-left-click"></i> Click</b> map to place the mark.</li>
        </ul>
        <ul v-show="currentPlot.type === 'rectangle'||currentPlot.type === 'circle'||currentPlot.type === 'arrow'">
          <li><b><i class="iconfont icon-left-click"></i> Click</b> map to confirm the starting point of mark.</li>
          <li><b><i class="iconfont icon-left-click"></i> Click</b> again to mark the end point.</li>
        </ul>
        <ul v-show="currentPlot.type === 'polygon'||currentPlot.type === 'line'">
          <li><b><i class="iconfont icon-left-click"></i> Click</b> map to draw mark.</li>
          <li><b><i class="iconfont icon-left-click"></i>Double click</b> to finish drawing mark.</li>
        </ul>
      </div>
      <div class="map-plot-control-color" v-if="status === 'plot' && currentPlot.type"
           :style="{ left: `${currentPlot.position}px` }">
        <div :class="['palette', {active: currentStyle.color === color}]" v-for="color in styleLib.color"
             :style="{ background: color }" @click="setStyle('color', color)"></div>
      </div>
      <div class="map-measure" v-show="status === 'measure'">
        <div :class="['map-measure-item', {active: currentMeasure === 'area'}]">
          <span class="iconfont icon-solid-square" @click="dynamicPlot('areaMeasure', $event)"></span>
        </div>
        <div :class="['map-measure-item', {active: currentMeasure === 'distance'}]">
          <span class="iconfont icon-line" @click="dynamicPlot('distanceMeasure', $event)"></span>
        </div>
        <div :class="['map-measure-item', {active: false}]">
          <span class="iconfont icon-close" @click="exitMeasureMode(true)"></span>
        </div>
      </div>
      <div :class="['map-measure-hint', { 'avoid-layers': showLayers }]" v-show="status === 'measure'">
        <ul>
          <li><b><i class="iconfont icon-left-click"></i> Click</b> map to draw.</li>
          <li><b><i class="iconfont icon-left-click"></i> Double click</b> to finish drawing.</li>
          <li>Press <b style="border: 1px solid white; border-radius: 1px;" class="p-l-5 p-r-5 p-t-5 p-b-5"><i
            class="iconfont icon-back"></i> Backspace</b> to revert action.
          </li>
        </ul>
      </div>
      <loading-indicator class="loading-indicator" v-if="loading"></loading-indicator>
    </div>
  </div>
</template>
<script>

import stringSimilarity from 'string-similarity'
import markerIcon from "@/assets/images/marker.png"
import {getHierarchy, getHierarchyInfo} from "@/assets/js/api/data";
import CCTVInfoPanel from "@/components/InfoPanels/MapTool/CCTVInfoPanel";
import OtherInfoPanel from "@/components/InfoPanels/MapTool/OtherInfoPanel";
import OtherControlPanel from "@/components/InfoPanels/MapTool/OtherControlPanel";
import WellInfoPanel from "@/components/InfoPanels/MapTool/WellInfoPanel";
import DS1InfoPanel from "@/components/InfoPanels/MapTool/DS1InfoPanel";
import DS2InfoPanel from "@/components/InfoPanels/MapTool/DS2InfoPanel";
import DS2ControlPanel from "@/components/InfoPanels/MapTool/DS2ControlPanel";
import WellPadInfoPanel from "@/components/InfoPanels/MapTool/WellPadInfoPanel";
import WellPadControlPanel from "@/components/InfoPanels/MapTool/WellPadControlPanel";
import CPF1InfoPanel from "@/components/InfoPanels/MapTool/CPF1InfoPanel";
import CPF1ControlPanel from "@/components/InfoPanels/MapTool/CPF1ControlPanel";
import WellControlPanel from "@/components/InfoPanels/MapTool/WellControlPanel";
import EquipmentInfoPanel from "@/components/InfoPanels/MapTool/EquipmentInfoPanel";
import PipelineInfoPanel from "@/components/InfoPanels/MapTool/PipelineInfoPanel";
import WarehouseInfoPanel from "@/components/InfoPanels/MapTool/WarehouseInfoPanel"
import PCInfoPanel from "@/components/InfoPanels/MapTool/PCInfoPanel";
import EntranceInfoPanel from "@/components/InfoPanels/MapTool/EntranceInfoPanel";
import LoadingIndicator from "../Standard/LoadingIndicator";

let drawGeometry = null;
export default {
  name: "centerMap",
  props: {
    mapName: String,
    action: Boolean,
    mapPosition: Object,
    position: Array,
    scale: Number,
    status: String,
    showNavigation: Boolean,
    showLayers: Boolean,
    mapInfo: Object,
    query: String,
    propsName: Object
  },
  components: {
    EquipmentInfoPanel,
    CCTVInfoPanel,
    DS1InfoPanel,
    DS2InfoPanel,
    DS2ControlPanel,
    WellPadInfoPanel,
    WellPadControlPanel,
    CPF1InfoPanel,
    CPF1ControlPanel,
    WellControlPanel,
    WellInfoPanel,
    WarehouseInfoPanel,
    PipelineInfoPanel,
    OtherInfoPanel,
    OtherControlPanel,
    PCInfoPanel,
    EntranceInfoPanel,
    LoadingIndicator
  },
  data() {
    console.log()
    let source = `${this.$store.state.setting.gis.host2D}/${this.mapName}`;
    return {
      loading: true,
      source,
      serverUrl: this.$store.state.setting.gis.hostPlot,
      map: {},
      layers: {},
      subLayers: [],
      controllers: {},
      infowin: null,
      placing: false,
      showPanel: false,
      distance: "",
      cursorPosition: [0, 0],
      currentMarker: null,
      currentPOI: {},
      drawGraphicObject: {},
      currentPlot: {
        position: 0,
        type: ''
      },
      closableCPF: true,
      closeWork: true,
      closeDS1: true,
      closeDS2: true,
      closewellcount: true,
      closeSeparator: true,
      closeTank: true,
      closeMJ: true,
      pinLayers: false,
      currentMeasure: '',
      selectedFeatures: [],
      count: [],
      message: "",
      isDialog: false,
      modelName: "",
      winMessage: '',
      parentMap: {},
      getHierarchyList: [],//层级树å
      getHierarchyInfoList: [],//兴趣点详情
      isCalculate: false,
      isPopupWin: false, //图层
      disabled: false,
      isThematicPanel: false, //ThematicPanel
      lineMeasurementCache: [],
      areaMeasurementCache: '',
      str: '',
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      poiCache: '',
      styleLib: {
        stroke: [2, 4, 6],
        color: ["#FFFFFF", "#FF4F4F", "#4FACFF", "#4FFF74", "#FFF44F", "#FFA24F","#000000","#A52A2A","#800080"],
        fontSize: [12, 50]
      },
      currentStyle: {
        stroke: 4,
        color: '#FFFFFF',
        fontSize: 12,
        text: ''
      },
      page: 'Overview',
      pages: [{
        name: 'Home',
        value: 'Overview'
      }, {
        name: 'Production',
        value: 'Production'
      }, {
        name: 'HSSE',
        value: 'HSSE'
      }, {
        name: 'Process Diagram',
        value: 'PID'
      }, {
        name: 'Corrosion',
        value: 'Corrosion'
      }],
      drawLineStyle: {
        strokeColor: "#FF694F",
        strokeWidth: 4,
        pointerEvents: "visiblePainted",
        fillColor: "#FF694F",
        fillOpacity: 1
      },
      drawPolygonStyle: {
        strokeColor: "#7BFF7D",
        strokeWidth: 2,
        pointerEvents: "visiblePainted",
        fillColor: "#7BFF7D",
        fillOpacity: 0.8,
        // backgroundColor: "red"
      },
      drawFeatureStyle: {
        strokeColor: "brown",
        strokeWidth: 2,
        strokeOpacity: null,
        pointRadius: 6,
        fillColor: "brown",
        fillOpacity: null,
        backgroundColor: "brown"
      },
      drawPointStyle: {
        strokeColor: "#FF1616",
        strokeWidth: 2,
        strokeOpacity: null,
        pointRadius: 6,
        fillColor: "#FFFFFF",
        fillOpacity: null,
        cursor: "pointer",
        backgroundColor: "#FFFFFF"
      },
      updateSource: null,
      stops: [],
      disMeasureEventArgs: "",
      areaMeasureEventArgs: "",
    }
  },
  created() {
    window.addEventListener("keydown", this.keyListener)
    window.MarkerCont = this.MarkerCont
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.keyListener)
  },
  computed: {},
  watch: {
    status(newValue) {
      if (newValue === 'plot') {
        this.currentPOI = {}
        this.layers.plottingLayer.setSelected(true)
        this.layers.markers.clearMarkers();
        this.exitMeasureMode()
      }
      if (newValue === 'measure') {
        this.currentPOI = {}
        this.layers.markers.clearMarkers();
        this.exitPlotMode()
      }
      if (newValue === 'default') {
        this.exitPlotMode()
        this.exitMeasureMode()
      }
    },
    'currentStyle.text': function (newValue) {
      this.flushFeatureStyles();
    },
    'currentStyle.fontSize': function (newValue) {
      this.flushFeatureStyles();
    },
    query(newValue) {
      if (newValue && this.mapInfo.active && this.mapInfo.mode === '2D') {
        this.getSearchResults(newValue)
      }
    },
    position(newValue) {
      this.setMapCenter2D(newValue)
    },
  },
  methods: {
    pinNavigation() {
      this.pinLayers = !this.pinLayers
    },
    closeNavigation(value) {
      if (value) {
        this.showLayers = false
      }
      this.showNavigation = false
      this.$emit("close-state-toggler")
    },
    setStyle(attr, value) {
      this.currentStyle[attr] = value
      this.flushFeatureStyles()
    },
    closePop(value) {
      this.showPanel = false
      this.closeWork = value
      this.closeDS1 = value
      this.closeDS2 = value
      this.closableCPF = value
      this.closewellcount = value
      this.closeSeparator = value
      this.closeTank = value
      this.closeMJ = value
      this.layers.markers.clearMarkers();
    },
    exitPlotMode(emit = false) {
      this.currentPlot.type = ''
      this.controllers.drawGraphicObject.deactivate()
      this.controllers.plottingEdit.deactivate()
      this.controllers.Lineplot.deactivate()
      this.controllers.drawPoint.deactivate()
      this.controllers.Polygonplot.deactivate()
      this.layers.plottingLayer.removeAllFeatures()
      // this.layers.plottingLayer.setSelected(false)
      $("div[id^='SuperMap.Layer.GOAnimationLayer']").remove()
      if (emit) {
        this.$emit("status-reset")
      }
    },
    exitMeasureMode(emit) {
      this.currentMeasure = ''
      this.controllers.drawLine.deactivate();
      this.controllers.drawPolygon.deactivate();
      this.layers.lineLayer.removeAllFeatures()
      this.layers.featuresLayer.removeAllFeatures()
      this.layers.polygonLayer.removeAllFeatures()
      this.layers.vertexLayer.removeAllFeatures()
      this.layers.labelLayer.removeAllFeatures()
      if (emit) {
        this.$emit("status-reset")
      }
    },
    // Initialize line layer (for distance measurement)
    initializeLineLayer(index) {
      let strategy = new SuperMap.Strategy.GeoText();
      strategy.style = {
        fontColor: "#383838",
        fontWeight: "400",
        fontSize: "14px",
        fill: true,
        fillColor: "#F5F5F5",
        fillOpacity: 1,
        stroke: true,
        strokeLinecap: 'butt',
        strokeColor: "#979797"
      };

      let actionStrategy = new SuperMap.Strategy.GeoText();
      actionStrategy.style = {
        fontColor: "#F52323",
        fontWeight: "400",
        fontSize: "14px",
        fill: true,
        fillColor: "#F5F5F5",
        fillOpacity: 1,
        stroke: true,
        strokeLinecap: 'butt',
        strokeColor: "#F52323"
      };
      let myStyles = new SuperMap.StyleMap(
        new SuperMap.Style({
          fill: true,
          fillColor:"#ff0000",
          fillOpacity: 0.3,
          strokeColor:"#ff0000",
          stroke: true,
          strokeLinecap: 'butt',
          strokeWidth:3,
        })
      );
      this.layers.lineLayer = new SuperMap.Layer.Vector("lineLayer",{
        styleMap: myStyles
      }) //距离量算
      this.layers.featuresLayer = new SuperMap.Layer.Vector("featuresLayer")//点线面
      this.layers.polygonLayer = new SuperMap.Layer.Vector("polygonLayer",{
        styleMap: myStyles
      }) //面积量算
      this.layers.vertexLayer = new SuperMap.Layer.Vector("vertexLayer", {
        strategies: [actionStrategy]
      })
      this.layers.labelLayer = new SuperMap.Layer.Vector("labelLayer", {
        strategies: [strategy]
      })
      this.layers.lineLayer.style = this.drawLineStyle//距离量算样式
      this.layers.polygonLayer.style = this.drawPolygonStyle//面积量算
      this.layers.featuresLayer.style = this.drawFeatureStyle//点线面
      this.layers.vertexLayer.style = this.drawPointStyle

      this.layers.lineLayer.index = index + 0.1
      this.layers.featuresLayer.index = index + 0.2
      this.layers.polygonLayer.index = index + 0.3
      this.layers.labelLayer.index = index + 0.4
      this.layers.vertexLayer.index = index + 0.5
      this.controllers.featureHandler = new SuperMap.Control.SelectFeature(this.layers.vertexLayer, {
        callbacks: {
          click: this.removeMeasurement
        }
      })
      this.controllers.drawLine = new SuperMap.Control.DrawFeature(this.layers.lineLayer, SuperMap.Handler.Path, {
        multi: true, callbacks: {
          point: this.calculateDistanceOnTheFly
        }
      });
      this.controllers.drawLine.events.on({"featureadded": this.drawCompletedLine});
      //面积
      this.controllers.drawPolygon = new SuperMap.Control.DrawFeature(this.layers.polygonLayer, SuperMap.Handler.Polygon);
      this.controllers.drawPolygon.events.on({"featureadded": this.drawCompletedPol});
      //线标绘
      this.controllers.Lineplot = new SuperMap.Control.DrawFeature(this.layers.featuresLayer, SuperMap.Handler.Path, {multi: true});
      this.controllers.Lineplot.events.on({"featureadded": this.drawCompleted});
      //点标绘
      this.controllers.drawPoint = new SuperMap.Control.DrawFeature(this.layers.featuresLayer, SuperMap.Handler.Point, {multi: true});
      this.controllers.drawPoint.events.on({"featureadded": this.drawCompleted});
      //块标绘
      this.controllers.Polygonplot = new SuperMap.Control.DrawFeature(this.layers.featuresLayer, SuperMap.Handler.Polygon, {multi: true});
      this.controllers.Polygonplot.events.on({"featureadded": this.drawCompleted});
      //箭头标绘
      // this.drawGraphicObject = new SuperMap.Control.DrawFeature(this.layers.featuresLayer, SuperMap.Handler.GraphicObject);
      //文字
      this.controllers.plottingEdit = new SuperMap.Control.PlottingEdit();
      // this.placeMarkers("distance")
    },
    // Initialize base layer(base map)
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

      // this.layers.vectorLayer = new SuperMap.Layer.Vector("VectorLayer")
      this.layers.vectorLayer = new SuperMap.Layer.Vector("VectorLayer")
      this.layers.vectorLayer.index = index
    },
    // Initialize main layer(our real map)
    initializeMainLayer(index) {
      this.layers.mainLayer = new SuperMap.Layer.TiledDynamicRESTLayer(this.mapName, this.source, {
        transparent: true,
        cacheEnabled: false
      }, {maxResolution: "auto", useCanvas: false, useCORS: true})
      this.layers.mainLayer.index = index
      this.layers.mainLayer.events.on({"layerInitialized": this.loadMap});
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

      this.layers.plottingLayer.events.on({"featureselected": this.selectFeature})
      this.layers.plottingLayer.events.on({"added": this.layerAdded});
      this.layers.plottingLayer.index = index
    },
    // Initialize all layers (put the main layer to the end to initialize the map properly)
    initializeLayers() {
      this.initializeBaseLayer(1)
      this.initializeLineLayer(40)
      this.initializeVectorLayer(3)
      this.initializeMarkerLayer(5)
      this.initializePlottingLayer(6)
      this.initializeMainLayer(2)
    },
    // Initialize the map
    loadMap() {
      this.map = new SuperMap.Map(`${this.mapInfo.name}-2D`, {
        projection: "EPSG:3857",
        controls: [
          new SuperMap.Control.ScaleLine(),
          // new SuperMap.Control.PanZoomBar(),
          // new SuperMap.Control.Zoom({ maxZoom: 25, minZoom: 1 }),
          // new SuperMap.Control.LayerSwitcher(),
          // new SuperMap.Control.MousePosition(),
          new SuperMap.Control.Navigation({
              dragPanOptions: {
                enableKinetic: true
              }
            }
          ),
          this.controllers.drawLine,
          this.controllers.drawPoint,
          this.controllers.Lineplot,
          this.controllers.Polygonplot,
          // this.controllers.drawFeature,
          // this.controllers.plottingEdit,
          this.controllers.drawPolygon,
          // this.controllers.drawGraphicObject,
          // this.controllers.drawFeaturePol,
          // this.controllers.textplot
        ],
        allOverlays: true,
        maxZoom: 25,
        minZoom: 1,
      });
      // this.setMapCenter(this.mapPosition);

      // 保存地图为图片
      const actualPixelRatio = window.devicePixelRatio
      Object.defineProperty(window, 'devicePixelRatio', {
        get: () => 300 / 96
      })
      const _container = document.createElement('div')
      document.body.appendChild(_container)
      // const width = map.getContainer().offsetWidth
      // const height = map.getContainer().offsetHeight

      this.setStyles(_container, {
        visibility: 'hidden',
        position: 'absolute',
        top: 0,
        bottom: 0,
      })
      // end

      //设置缩放位置
      this.$nextTick(() => {
        this.map.addControl(new SuperMap.Control.PanZoomBar({
          div: this.$refs.controlbtn,
          // position: new SuperMap.Pixel(0, 650)
        }))
      });
      // this.map.addControl(new SuperMap.Control.PanZoomBar(), "left-bottom")
      let layers = Object.values(this.layers)
      layers.sort((i1, i2) => i1.index - i2.index)
      this.map.addLayers(layers)
      this.map.setBaseLayer(this.layers.mainLayer)
      let that = this
      this.map.events.on({
        "click": function (evt) {
          if (that.status === 'default') {
            that.searchMapByLocation(that.map.getLonLatFromPixel(evt.xy))
          }
        },
        "move": this.moveFn,
        "mousemove": this.updateCursorPosition,
        "zoomend": this.rescaleFeatures,
        "loadstart": function () {
          console.log("baseLayer loadstart")
        }
      })
      this.map.addControl(this.controllers.featureHandler)
      this.controllers.featureHandler.activate();
      this.$nextTick(() => {
        this.setMapCenter2D(this.position);
        this.loading = false
      });
    },
    updateCursorPosition(evt) {
      let position = this.map.getLonLatFromPixel(evt.xy)
      position.transform("EPSG:3857", "EPSG:4326")
      this.cursorPosition = [position.lon, position.lat]
    },
    rescaleFeatures() {
      // 在量算的情况下根据缩放尺度自适应排布测算标记，以最大比例尺（1：500）为基准，偏移5m，其他尺度根据比例调整偏移量
      if (this.status === 'measure') {
        let features = this.layers.vertexLayer.features
        let labels = this.layers.labelLayer.features
        for (let i = 0; i < features.length; i++) {
          let feature = features[i]
          if (feature.attributes.type === 'Destroyer' && feature.attributes.targetType === 'Polygon') {
            let baseDistance = 5
            let baseScale = 1 / 500
            let currentScale = this.map.getScale()
            let distance = baseDistance * baseScale / currentScale
            feature.geometry.x = feature.attributes.anchor[0]
            feature.geometry.y = feature.attributes.anchor[1] - distance
          }
        }
        for (let i = 0; i < labels.length; i++) {
          let label = labels[i]
          if (label.attributes.anchor) {
            let baseDistance = 5
            let baseScale = 1 / 500
            let currentScale = this.map.getScale()
            let distance = baseDistance * baseScale / currentScale
            label.geometry.x = label.attributes.anchor[0] + distance
            label.geometry.y = label.attributes.anchor[1] + distance
          }
        }
      }
      this.layers.vertexLayer.redraw()
      this.layers.labelLayer.redraw()
    },
    keyListener(event) {
      if (event.key === 'Backspace') {
        if (this.status === 'measure') {
          if (this.controllers.drawLine.active) {
            if (this.controllers.drawLine.undo()) {
              let features = this.layers.vectorLayer.features;
              this.layers.vectorLayer.removeFeatures([features[features.length - 1]])
            }
          }
          if (this.controllers.drawPolygon.active) {
            this.controllers.drawPolygon.undo()
          }
        }
      } else if (event.key === 'Delete') {
        if (this.status === 'plot') {
          this.currentPlot.type = ''
          this.controllers.plottingEdit.deleteSelectFeature()
        }
      }
    },
    searchMapByLocation(center) {
      // center.transform("EPSG:3857", "EPSG:4326");
      let queryByDistanceParams = new SuperMap.REST.QueryByDistanceParameters({
        queryParams: [
          new SuperMap.REST.FilterParameter({name: "MJ_Equipment@Majnoon"}),
          new SuperMap.REST.FilterParameter({name: "MJ_Wells_Surface_Location_01Jan18@Majnoon"}),
          new SuperMap.REST.FilterParameter({name: "MJ_Facilities_Outlines@Majnoon"}),
        ],
        isNeatest: true,
        returnContent: true,
        distance: 20,
        expectCount: 1,
        geometry: new SuperMap.Geometry.Point(center.lon, center.lat)
      });

      let queryByDistanceService = new SuperMap.REST.QueryByDistanceService(this.source);
      queryByDistanceService.events.on({
        "processCompleted": this.showQueryResult,
        "processFailed": this.queryError
      });
      queryByDistanceService.processAsync(queryByDistanceParams);
    },
    moveFn() {
      let pos = this.map.getCenter();
      let scale = this.map.getZoom();
      pos.transform("EPSG:3857", "EPSG:4326");
      this.$emit("pos-updated", [pos.lon, pos.lat], "2D", scale);
    },
    setMapCenter(params) {
      params = params || {};
      if (params.type === "lonlat") {
        this.setMapLonLat(params.data.lon, params.data.lat);
      }
    },
    setMapCenter2D(position) {
      let x = position[0], y = position[1]
      this.setMapLonLat(x, y);
    },
    setMapLonLat(lon, lat) {
      let pos = new SuperMap.LonLat(lon, lat);
      pos.transform("EPSG:4326", "EPSG:3857");
      this.map.setCenter(pos, this.scale);
    },
    getMapCenter() {
      let data = this.map.getCenter() || {};
      let lon = data.lon;
      let lat = data.lat;
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
    // --------------------
    //点线面标绘
    dynamicPlot(type, event) {
      this.currentPlot.type = type
      this.currentMeasure = ''
      let pc = $('.map-plot').position()
      let target = event.target
      this.currentPlot.position = $(target).position().left + pc.left - 10
      if (type === "marker") {
        this.drawMarkers();
        this.isThematicPanel = false
        this.isPopupWin = false
      }
      if (type === "line") {
        this.drawLines();
        this.isThematicPanel = false
        this.isPopupWin = false
      } else if (type === "circle") {
        this.drawCircles();
        this.isThematicPanel = false
        this.isPopupWin = false
      } else if (type === "rectangle") {
        this.drawRectangles();
        this.isThematicPanel = false
        this.isPopupWin = false
      } else if (type === "text") {
        this.drawText();
        this.isThematicPanel = false
        this.isPopupWin = false
      } else if (type === "polygon") {
        this.drawPolygons();
        this.isThematicPanel = false
        this.isPopupWin = false
      } else if (type === "arrow") {
        this.drawArrow()
        this.isThematicPanel = false
        this.isPopupWin = false
      } else if (type === "distanceMeasure") {
        this.distanceMeasure()
        this.currentPlot.type = ''
        this.currentMeasure = 'distance'
        this.isThematicPanel = false
        this.isPopupWin = false
      } else if (type === "areaMeasure") {
        this.currentPlot.type = ''
        this.currentMeasure = 'area'
        this.areaMeasure()
        this.isThematicPanel = false
        this.isPopupWin = false
      } else if (type === "png") {
        this.mapToImg("png")
        this.isThematicPanel = false
        this.isPopupWin = false
      } else if (type === 'jpeg') {
        this.mapToImg("jpeg")
        this.isThematicPanel = false
        this.isPopupWin = false
      }
    },
    flushBackFeatureStyles(feature) {
      this.currentStyle.fontSize = feature.style.fontSize
      this.currentStyle.color = feature.style.strokeColor
      this.currentStyle.stroke = feature.style.strokeWidth
      this.currentStyle.text = feature.geometry.textContent
    },
    flushFeatureStyles(feature) {
      if (feature) {
        if (feature.geometry.libID === 0 && feature.geometry.symbolType === 34) {
          feature.geometry.setTextContent(this.currentStyle.text)
          feature.geometry.textContent = this.currentStyle.text
        }
        feature.style.fontSize = this.currentStyle.fontSize
        feature.style.fontColor = this.currentStyle.color
        feature.style.strokeColor = this.currentStyle.color
        feature.style.strokeWidth = this.currentStyle.stroke
        feature.style.fill = true
        feature.style.fillColor = this.currentStyle.color
        feature.style.fillOpacity = 0.3
      } else {
        for (let i = 0; i < this.selectedFeatures.length; i++) {
          let feature = this.selectedFeatures[i]
          if (feature.geometry.libID === 0 && feature.geometry.symbolType === 34) {
            feature.geometry.setTextContent(this.currentStyle.text)
            feature.geometry.textContent = this.currentStyle.text
          }
          feature.style.fontSize = this.currentStyle.fontSize
          feature.style.fontColor = this.currentStyle.color
          feature.style.strokeColor = this.currentStyle.color
          feature.style.strokeWidth = this.currentStyle.stroke
          feature.style.fillColor = this.currentStyle.color
          feature.style.fillOpacity = 0.5
        }
      }
      this.layers.plottingLayer.redraw()
    },
    drawMarkers() {
      if (this.controllers.plottingEdit) {
        this.controllers.plottingEdit.activate();
      } else {
        this.controllers.plottingEdit.deactivate();
      }
      this.controllers.drawGraphicObject.activate();
      this.controllers.drawGraphicObject.handler.libID = 421;
      this.controllers.drawGraphicObject.handler.symbolCode = 20100;
      this.controllers.drawGraphicObject.handler.serverUrl = this.serverUrl;
    },
    drawPlot() {
      if (this.controllers.plottingEdit) {
        this.controllers.plottingEdit.deactivate()
        this.controllers.plottingEdit.activate()
      } else {
        this.controllers.plottingEdit.deactivate()
      }
      this.controllers.drawGraphicObject.deactivate()
      this.controllers.drawGraphicObject.activate()
    },
    drawLines() {
      this.drawPlot()
      this.controllers.drawGraphicObject.handler.libID = 0;
      this.controllers.drawGraphicObject.handler.symbolCode = 24;
      this.controllers.drawGraphicObject.handler.serverUrl = this.serverUrl;
    },
    drawPolygons() {
      this.drawPlot()
      this.controllers.drawGraphicObject.handler.libID = 0;
      this.controllers.drawGraphicObject.handler.symbolCode = 32;
      this.controllers.drawGraphicObject.handler.serverUrl = this.serverUrl;
    },
    drawCircles() {
      this.drawPlot()
      this.controllers.drawGraphicObject.handler.libID = 0;
      this.controllers.drawGraphicObject.handler.symbolCode = 29;
      this.controllers.drawGraphicObject.handler.serverUrl = this.serverUrl;
    },
    drawRectangles() {
      this.drawPlot()
      this.controllers.drawGraphicObject.handler.libID = 0;
      this.controllers.drawGraphicObject.handler.symbolCode = 26;
      this.controllers.drawGraphicObject.handler.serverUrl = this.serverUrl;
    },
    drawText() {
      this.drawPlot()
      this.controllers.drawGraphicObject.handler.libID = 0;
      this.controllers.drawGraphicObject.handler.symbolCode = 34;
      this.controllers.drawGraphicObject.handler.serverUrl = this.serverUrl;
    },
    //箭头绘制
    drawArrow() {
      this.drawPlot()
      this.controllers.drawGraphicObject.handler.libID = 22;
      this.controllers.drawGraphicObject.handler.symbolCode = 1003;
      this.controllers.drawGraphicObject.handler.serverUrl = this.serverUrl;
    },
    selectFeature(drawGeometryArgs) {
      this.selectedFeatures = drawGeometryArgs.features
      let feature = this.selectedFeatures[0]
      this.flushBackFeatureStyles(feature)
      if (feature.geometry.libID === 0 && feature.geometry.symbolData.code === 34) {
        this.currentPlot.type = 'text'
      }
      if (feature.geometry.libID === 22 && feature.geometry.symbolData.code === 1003) {
        this.currentPlot.type = 'arrow'
      }
      if (feature.geometry.libID === 0 && feature.geometry.symbolData.code === 29) {
        this.currentPlot.type = 'circle'
      }
      if (feature.geometry.libID === 0 && feature.geometry.symbolData.code === 32) {
        this.currentPlot.type = 'polygon'
      }
      if (feature.geometry.libID === 0 && feature.geometry.symbolData.code === 24) {
        this.currentPlot.type = 'line'
      }
      if (feature.geometry.libID === 0 && feature.geometry.symbolData.code === 26) {
        this.currentPlot.type = 'rectangle'
      }
      if (feature.geometry.libID === 421 && feature.geometry.symbolData.code === 20100) {
        this.currentPlot.type = 'marker'
      }
      let pc = $('.map-plot').position()
      this.currentPlot.position = $(this.$refs[`${this.currentPlot.type}-entry`]).position().left + pc.left - 10
    },
    drawCompleted(drawGeometryArgs) {
      this.selectedFeatures = []
      this.flushFeatureStyles(drawGeometryArgs.feature);

      this.currentPlot.type = ''
      this.controllers.drawGraphicObject.deactivate()
      this.controllers.Lineplot.deactivate();
      this.controllers.drawPoint.deactivate();
      this.controllers.Polygonplot.deactivate();
      // this.controllers.plottingEdit.deactivate()
      this.layers.plottingLayer.setSelected(true);
    },
    layerAdded(addedEvt) {
      this.controllers.drawGraphicObject = new SuperMap.Control.DrawFeature(addedEvt.layer, SuperMap.Handler.GraphicObject, {
        multi: true,
      });
      this.controllers.drawGraphicObject.events.on({"featureadded": this.drawCompleted});
      //态势标绘编辑
      this.controllers.plottingEdit = new SuperMap.Control.PlottingEdit();
      //添加态势标绘控件
      this.map.addControls([this.controllers.plottingEdit, this.controllers.drawGraphicObject]);
    },
    //end
    download(mime) {
      let MapToImg = window.MapToImg;
      if (MapToImg) {
        MapToImg.excute(this.map, `image/${mime}`, (imageData => {
          this.saveImage(imageData, mime);
        }));
      } else {
        console.log("Unable to save Image due to browser incompatibility.")
      }
    },
    saveImage(data, mime = "png") {
      let a = document.createElement("a");
      a.download = `${this.mapInfo.name} - 2D.${mime}`
      a.href = data;
      document.body.appendChild(a);
      a.click();
      a.remove();
    },
    MarkerCont() {
      if (document.getElementById("markerCont")) {
        document.getElementById("markerCont").style.display = "none";
      }
      if (document.getElementById("markerPlot")) {
        document.getElementById("markerPlot").style.display = "none";
        this.isCalculate = false
      }
      this.layers.markers.clearMarkers();
    },
    setCard(x, y, scale) {
      this.map.setCenter(new SuperMap.LonLat(x, y), scale);
    },
    // 根据经纬度， 画出定位图标
    setMarker(x, y) {
      let size = new SuperMap.Size(21, 25);
      let offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
      let icon = new SuperMap.Icon(markerIcon, size, offset);
      let marker = new SuperMap.Marker(new SuperMap.LonLat(x, y), icon);
      this.layers.markers.addMarker(marker);
    },
    showLayer() {
      this.clearFeatures();
      this.isPopupWin = !this.isPopupWin
      this.isCalculate = false
      this.isThematicPanel = false
    },
    showThematicPanel() {
      this.isThematicPanel = !this.isThematicPanel
      this.isCalculate = false
      this.isPopupWin = false
    },
    // get sublayer data from server.
    initializeSubLayers() {
      let that = this
      let getLayersInfoService = new SuperMap.REST.GetLayersInfoService(this.source);
      getLayersInfoService.events.on({
        "processCompleted": (getLayersInfoEventArgs) => {
          if (getLayersInfoEventArgs.result) {
            {
              if (getLayersInfoEventArgs.result.subLayers) {
                that.subLayers = getLayersInfoEventArgs.result.subLayers.layers
              }
            }
          }
        }
      })
      getLayersInfoService.processAsync();
    },

    // Control the visibility of each sublayers
    setLayerStatus(subLayer) {
      subLayer.visible = !subLayer.visible
      let visibleLayers = this.subLayers.reduce((result, layer, index) => layer.visible ? result.concat([index]) : result, [])
      // Use layersID property to control visibility is recommended.
      this.layers.mainLayer.params.layersID = visibleLayers.length ? `[0:${visibleLayers.join(',')}]` : "[]";
      this.layers.mainLayer.redraw();
    },
    queryError(e) {
      // console.log(e);
    },
    searchMap(poi) {
      if (poi.name) {
        this.isDialog = true
        this.modelName = poi.name
      }
      this.exitMeasureMode(true)
      this.exitPlotMode(true)
      if (!this.pinLayers) {
        this.$emit("close-state-toggler")
      }
      this.poiCache = poi
      this.layers.vectorLayer.removeAllFeatures();
      let queryParam = [];
      queryParam[0] = new SuperMap.REST.FilterParameter({
        name: "MJ_Wells_Surface_Location_01Jan18@Majnoon",
        attributeFilter: "Tag = '" + poi.tag + "'",
      });
      queryParam[1] = new SuperMap.REST.FilterParameter({
        name: "MJ_Facilities_Outlines@Majnoon",
        attributeFilter: "NAME = '" + poi.name + "'",
      });
      queryParam[2] = new SuperMap.REST.FilterParameter({
        name: "MJ_Equipment@Majnoon",
        attributeFilter: "Tag = '" + poi.tag + "'",
      });
      queryParam[3] = new SuperMap.REST.FilterParameter({
        name: "CCTV@Majnoon",
        attributeFilter: "Tag = '" + poi.tag + "'",
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
      let firstItem = null;
      if (result && result.recordsets) {
        this.layers.markers.clearMarkers();
        for (let i = 0; i < result.recordsets.length; i++) {
          let recordSet = result.recordsets[i]
          for (let j = 0; j < recordSet.features.length; j++) {
            let feature = recordSet.features[j]
            if (feature && feature.geometry && feature.geometry.center) {
              firstItem = feature
            }
          }
        }
        if (firstItem) {
          let tagIndex = firstItem.fieldNames.indexOf('Tag')
          let typeIndex = firstItem.fieldNames.indexOf('Type')
          let nameIndex = -1, candidates = ['Name', 'NAME', 'WELLNAME']
          for (let i = 0; i < candidates.length; i++) {
            if ((nameIndex = firstItem.fieldNames.indexOf(candidates[i])) !== -1) {
              break
            }
          }

          let position = new SuperMap.LonLat(firstItem.geometry.center.x, firstItem.geometry.center.y)
          position.transform("EPSG:3857", "EPSG:4326");
          this.currentPOI = {
            id: this.poiCache.id,
            tag: firstItem.fieldValues[tagIndex],
            type: firstItem.fieldValues[typeIndex],
            name: firstItem.fieldValues[nameIndex],
            position: [position.lon, position.lat]
          }

          this.showPanel = true
          this.setMarker(firstItem.geometry.center.x, firstItem.geometry.center.y)
          this.setCard(firstItem.geometry.center.x, firstItem.geometry.center.y, 25)
        }
      }
    },
    // 获取查询
    getSearchResults(val) {
      getHierarchy().then(data => {
        data = data || {};
        this.getHierarchyList = data.data || [];
        this.parentMap = this.getParentMap(this.getHierarchyList, null, {})
        this.$emit('query-result', this.getFiltersData(this.getHierarchyList, val))
      })
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
    getHierarchies() {
      getHierarchy().then(data => {
        data = data || {};
        this.getHierarchyList = data.data || [];
        this.parentMap = this.getParentMap(this.getHierarchyList, null, {})
      })
    },
    flattenData(hierarchy, parent = null) {
      let result = {}
      for (let i = 0; i < hierarchy.length; i++) {
        if (parent) {
          hierarchy[i].parentTag = parent.tag
        }
        if (hierarchy[i].poi) {
          result[hierarchy[i].tag] = hierarchy[i]
        }
        if (hierarchy[i].children && hierarchy[i].children.length > 0) {
          Object.assign(result, this.flattenData(hierarchy[i].children, hierarchy[i].poi ? hierarchy[i] : parent))
        }
      }
      return result
    },
    getFiltersData(list, searchVal) {
      let _flatData = this.flattenData(list)
      let flatData = Object.values(_flatData)
      let result = stringSimilarity.findBestMatch(searchVal.toUpperCase(), flatData.map(item => item.tag.toUpperCase()).concat(flatData.map(item => item.name.toUpperCase()))).ratings
      result = result.map((item, index) => ({rating: item.rating, index: index % flatData.length}))
      result = Object.values(result.reduce((res, item) => {
        if (!res[item.index] || res[item.index].rating < item.rating) {
          res[item.index] = item
        }
        return res
      }, {}))
      result.sort((i1, i2) => i2.rating - i1.rating)
      result = result.map(item => [flatData[item.index]].concat(_flatData[flatData[item.index].parentTag] ? [_flatData[flatData[item.index].parentTag]] : []))
      return result
    },
    // ------------------------------------------距离量算
    distanceMeasure() {
      this.controllers.drawLine.activate();
      this.controllers.drawPolygon.deactivate();
      this.isCalculate = false
      this.isPopupWin = false
    },
    areaMeasure() {
      this.controllers.drawPolygon.activate();
      this.controllers.drawLine.deactivate();
    },
    calculate() {
      this.clearFeatures()
      this.controllers.drawLine.deactivate()
      this.isCalculate = !this.isCalculate
      this.placing = false
      this.isPopupWin = false
    },
    //距离量算
    calculateDistanceOnTheFly(point) {
      let geometry = point.parent,
        measureParam = new SuperMap.REST.MeasureParameters(geometry),
        myMeasuerService = new SuperMap.REST.MeasureService(this.source);
      this.count = point.parent.components[0]

      for (let i = 0; i < point.parent.components[0].length; i++) {
        let x = this.count.parent.components[i].x;
        let y = this.count.parent.components[i].y;
        let size = new SuperMap.Size(25, 20),
          offset = new SuperMap.Pixel(-(size.w / 2), -size.h)
        let marker = new SuperMap.Marker(new SuperMap.LonLat(x, y));
        let centerPoint1 = new SuperMap.Geometry.Point(x, y);
        let circleVector1 = new SuperMap.Feature.Vector(centerPoint1);
        this.layers.polygonLayer.addFeatures([circleVector1]);
        this.layers.markers.addMarker(marker);
      }
      this.map.addLayers([this.layers.polygonLayer]);
      myMeasuerService.events.on({"processCompleted": this.measureCompleted});
      myMeasuerService.measureMode = SuperMap.REST.MeasureMode.DISTANCE;
      myMeasuerService.processAsync(measureParam);

    },

    removeMeasurement(currentFeature) {
      if (currentFeature.data.type === 'Destroyer') {
        if (currentFeature.data.lineId) {
          let line = this.layers.lineLayer.getFeatureById(currentFeature.data.lineId)
          this.layers.lineLayer.removeFeatures([line])
          let removedFeatures = []
          for (let i = 0; i < this.layers.labelLayer.features.length; i++) {
            let feature = this.layers.labelLayer.features[i]
            if (feature.data.lineId === currentFeature.data.lineId) {
              removedFeatures.push(feature)
            }
          }
          this.layers.labelLayer.removeFeatures(removedFeatures)
          removedFeatures = []
          for (let i = 0; i < this.layers.vertexLayer.features.length; i++) {
            let feature = this.layers.vertexLayer.features[i]
            if (feature.data.lineId === currentFeature.data.lineId) {
              removedFeatures.push(feature)
            }
          }
          this.layers.vertexLayer.removeFeatures(removedFeatures)
        } else if (currentFeature.data.areaId) {
          let area = this.layers.polygonLayer.getFeatureById(currentFeature.data.areaId)
          this.layers.polygonLayer.removeFeatures([area])
          let removedFeatures = []
          for (let i = 0; i < this.layers.labelLayer.features.length; i++) {
            let feature = this.layers.labelLayer.features[i]
            if (feature.data.areaId === currentFeature.data.areaId) {
              removedFeatures.push(feature)
            }
          }
          this.layers.labelLayer.removeFeatures(removedFeatures)
          removedFeatures = []
          for (let i = 0; i < this.layers.vertexLayer.features.length; i++) {
            let feature = this.layers.vertexLayer.features[i]
            if (feature.data.areaId === currentFeature.data.areaId) {
              removedFeatures.push(feature)
            }
          }
          this.layers.vertexLayer.removeFeatures(removedFeatures)
        }
      }
    },
    //测量结束调用事件
    measureCompleted(measureEventArgs) {
      // 1. 拿到距离的变量
      // 2. 找到画的最新的点的位置
      // 3. 在对应位置上放一个mark，带label，如果是第一个点，标上是起点
      this.disMeasureEventArgs = measureEventArgs;
      this.placeMarkers("distance")
    },
    clearFeatures(val) {
      if (val === "Calculate") {
        this.controllers.drawLine.deactivate();
        this.clearPlottingMarkers()
        this.layers.markers.clearMarkers()
        // this.layers.plottingLayer.removeAllFeatures()
        // this.layers.polygonLayer.removeAllFeatures(); //清除面积量算
      } else {
        this.controllers.drawLine.deactivate();
        this.clearPlottingMarkers()
        this.layers.lineLayer.removeAllFeatures()
        this.layers.markers.clearMarkers()
        this.layers.plottingLayer.removeAllFeatures()
        this.layers.polygonLayer.removeAllFeatures(); //清除面积量算
      }
    },
    clearPlottingMarkers() {
      this.map.removeAllPopup()
      this.layers.markers.clearMarkers()
    },
    drawCompletedLine(drawGeometryArgs) {
      this.currentMeasure = ''
      this.controllers.drawLine.deactivate();
      let vertices = drawGeometryArgs.feature.geometry.getVertices()
      for (let i = 0; i < vertices.length; i++) {
        let feature = null, attribute = {
          lineId: drawGeometryArgs.feature.id
        }
        if (i === vertices.length - 1) {
          feature = new SuperMap.Geometry.GeoText(vertices[i].x, vertices[i].y, "×");
          attribute.type = 'Destroyer'
        } else {
          feature = new SuperMap.Geometry.Point(vertices[i].x, vertices[i].y)
        }
        this.layers.vertexLayer.addFeatures([new SuperMap.Feature.Vector(feature, attribute)])
      }
      for (let i = 0; i < this.lineMeasurementCache.length; i++) {
        this.lineMeasurementCache[i].data = {
          lineId: drawGeometryArgs.feature.id
        }
      }
      this.lineMeasurementCache = []
    },
    drawCompletedPol(drawGeometryArgs) {
      this.currentMeasure = ''
      drawGeometry = drawGeometryArgs;
      this.areaMeasurementCache = drawGeometryArgs.feature
      // window.drawGeometryArgs = drawGeometryArgs;
      //停止画面控制
      this.controllers.drawPolygon.deactivate();
      //获得图层几何对象
      let geometry = drawGeometryArgs.feature.geometry,
        measureParam = new SuperMap.REST.MeasureParameters(geometry), /* MeasureParameters：量算参数类。 客户端要量算的地物间的距离或某个区域的面积*/
        myMeasuerService = new SuperMap.REST.MeasureService(this.source); //量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果

      let baseDistance = 5
      let baseScale = 1 / 500
      let currentScale = this.map.getScale()
      let distance = baseDistance * baseScale / currentScale

      let y = (drawGeometry.feature.geometry.bounds.bottom + drawGeometry.feature.geometry.bounds.top) / 2;
      let x = (drawGeometry.feature.geometry.bounds.left + drawGeometry.feature.geometry.bounds.right) / 2;

      let feature = new SuperMap.Geometry.GeoText(x, y - distance, "×");
      this.layers.vertexLayer.addFeatures([new SuperMap.Feature.Vector(feature, {
        areaId: drawGeometryArgs.feature.id,
        type: 'Destroyer',
        targetType: 'Polygon',
        anchor: [x, y]
      })])

      myMeasuerService.events.on({"processCompleted": this.measureCompletedPol});
      //对MeasureService类型进行判断和赋值，当判断出是LineString时设置MeasureMode.DISTANCE，否则是MeasureMode.AREA
      myMeasuerService.measureMode = SuperMap.REST.MeasureMode.AREA;
      myMeasuerService.processAsync(measureParam); //processAsync负责将客户端的量算参数传递到服务端。
    },
    measureCompletedPol(measureEventArgs) {
      this.areaMeasureEventArgs = measureEventArgs;

      this.placeMarkers("areaText")
    },
    placeMarkers(text) {
      let geoText, geotextFeature;
      // this.layers.vectorLayer.removeAllFeatures() //清除
      if (text === "distance") {
        let data = eval(this.disMeasureEventArgs.object.options.params.point2Ds)
        let baseDistance = 5
        let baseScale = 1 / 500
        let currentScale = this.map.getScale()
        let displayDistance = baseDistance * baseScale / currentScale

        let x = data[data.length - 1].x;
        let y = data[data.length - 1].y;
        let distance = this.disMeasureEventArgs.result.distance;
        let disText = ""
        if (distance >= 10000) {
          let distanceKM = distance / 1000;
          disText = "" + parseFloat(distanceKM.toFixed(2)) + "KM"
        } else if (distance === 0) {
          disText = "Start"
        } else {
          disText = "" + parseFloat(distance.toFixed(2)) + "M"
        }
        geoText = new SuperMap.Geometry.GeoText(x + displayDistance, y + displayDistance, disText);
        geotextFeature = new SuperMap.Feature.Vector(geoText, {
          anchor: [x, y]
        });
        this.lineMeasurementCache.push(geotextFeature);
      } else if (text === "areaText") {
        let area = this.areaMeasureEventArgs.result.area;
        let areaText = "";
        let position = new SuperMap.LonLat(
            parseFloat(this.$store.state.setting.gis.initial2D.longitude),
            parseFloat(this.$store.state.setting.gis.initial2D.latitude)
        )
        position.transform("EPSG:4326", "EPSG:3857")
        let _top = position.lon
        let _left = position.lat
        try {
          //中间位置
          _top = (drawGeometry.feature.geometry.bounds.bottom + drawGeometry.feature.geometry.bounds.top) / 2;
          _left = (drawGeometry.feature.geometry.bounds.left + drawGeometry.feature.geometry.bounds.right) / 2;
          // 右下角
          // _top = (drawGeometry.feature.geometry.bounds.bottom);
          // _left = (drawGeometry.feature.geometry.bounds.right);
        } catch (e) {
        }
        areaText = parseFloat(area.toFixed(2)) + "㎡";
        geoText = new SuperMap.Geometry.GeoText(_left, _top, areaText);
        geotextFeature = new SuperMap.Feature.Vector(geoText, {
          areaId: this.areaMeasurementCache.id
        });
        this.areaMeasurementCache = ''
      }
      this.layers.labelLayer.addFeatures([geotextFeature]);
    },
  },
  mounted() {
    this.getHierarchies()
    this.initializeLayers()
    this.initializeSubLayers()
  }
}
</script>
<style lang="scss">

.avoid-layers {
  right: 420px !important;
}

#SuperMap_Control_MaximizeDiv {
  display: none;
}

.closeID {
  position: absolute;
  left: 360px;
  top: 15px;
  width: 16px;
  height: 16px;
  font-size: 16px;
  cursor: pointer;
}

.closeLayerID {
  position: absolute;
  right: 16px;
  top: 16px;
  width: 16px;
  height: 16px;
  font-size: 16px;
  cursor: pointer;
}

.map-location-info {
  z-index: 999999;

  h1 {
    background: #081C31;
    border-radius: 4px 4px 0 0;
    /* width: 224px; */
    height: 28px;
    font-size: 16px;
    font-family: AlibabaSans-Bold, AlibabaSans;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 28px;
    text-indent: 10px;
    margin: 0;
  }

  ul {
    background: #081C31;
    margin-top: 15px;
    border-radius: 0 0 4px 4px;
    height: 100px;
    overflow-y: auto;
    margin: 0;

    li {
      color: #fff;
      /* margin: 0px 5px 10px 5px; */
      font-size: 14px;
      padding: 5px 10px;
      word-wrap: break-word;
      word-break: normal;
    }
  }
}

.map-control {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  // height: 0;
  z-index: 9999999;
}

.map-control.navigation-active {
  left: 399px;
  width: calc(100% - 399px);
}

.map-information {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 9999999;
  width: 0;
  height: 0;

  .el-collapse-item__wrap {
    /* height: 500px; */
    overflow-y: scroll;
    background-color: rgba(0, 0, 0, 0.7);
    color: #FFF !important;
  }

  div.el-collapse-item__header {
    height: 36px;
    line-height: 36px;
    background-color: rgba(0, 0, 0, 0.7);
    color: #FFF !important;
    text-align: center;
    border: none;
    padding-left: 10px;
    /* border-radius: 6px */
    border-radius: 6px 6px 0 0;
  }
}

.map-information.navigation-active {
  left: 416px;
}

.el-tree-node:focus > .el-tree-node__content {
  /* background: #124375 !important; */
}
</style>
<style lang="scss" scoped>

  .loading-indicator {
    top: 0;
    position: absolute;
    z-index: 9999999;
    width: 100%;
    height: 100%;
  }

.el-tree.custom {
  /* background: #0a1b31; */
  background: #124375;
  color: #fff;
}

.el-tree-node__content:hover {
  background: rgba(108, 180, 255, 0.2) !important;
  background-color: rgba(108, 180, 255, 0.2) !important;
  z-index: 999
}

.el-tree-node:focus > .el-tree-node__content {
  background: rgba(108, 180, 255, 0.2) !important;;
}

.el-input__inner {
  background: rgba(138, 138, 138, 0.6);
  border-radius: 4px;
  color: #fff;
  height: 30px;
  border: 1px solid #8A8A8A;
}

#SuperMap_Control_MaximizeDiv {
  display: none;
}

.el-tree-node__content {
  height: 40px;
}

.labelInfo {
  margin-right: 10px;
}

.labelInfo label {
  margin: 10px 0;
}

/*  */
.winTitle {
  /* background: #4192c9; */
  height: 15px;
  line-height: 15px;
}

.winTitle .title_left {
  font-weight: bold;
  color: #fff;
  padding-left: 5px;
  float: left;
}

.winTitle .title_right {
  float: right;
  padding-right: 3px;
}

.winTitle .title_right a {
  color: #fff;
  text-decoration: none;
  padding-right: 3px;
}

.winTitle .title_right a:hover {
  text-decoration: none;
  color: #fff;
  padding-right: 3px;
}

.winContent {
  padding-left: 15px;
  overflow-y: auto;
  height: 550px;
}

.winContent label {
  color: #fff;
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  margin-bottom: 10px;
}

.winContent label input {
  margin-right: 10px;
}

.treeList {
  width: 100%;
  text-align: left;
  margin-right: 10px;
  /* border-bottom: 1px solid rgba(108, 180, 255, 0.2); */
}

.treeListItem {
  width: 100%;
  text-align: left;
  color: #4FACFF;
  position: relative;
}

.el-tree-node__content > .el-tree-node__expand-icon {
  color: #93aec5;
}

.el-tree-node__expand-icon.is-leaf {
  color: transparent;
  cursor: default;
}

.map-layers {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 99999;
  height: 100%;
  background: #124375;
  width: auto;
  min-width: 200px;
  overflow-y: auto;
}

.map-navigation {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99999;
  height: 100%;
  background: #124375;
  width: 399px;
  min-width: 220px;
  overflow-y: auto;

  .searchCatalogue {
    position: relative;
  }

  ::-webkit-scrollbar {
    width: 1px !important;
    height: 1px;
    z-index: 999999;
    background: #0C2947 !important;
    border-radius: 20%;
  }

  .searchCatalogue h1 {
    border-left: 5px solid #ffff00;
    font-size: 18px;
    font-weight: normal;
    margin: 10px 20px;
    text-align: left;
    text-indent: 20px;
  }

  .searchCatalogue ul {
    padding: 0;
    list-style: none;
  }

  .searchCatalogueList {
    margin: 20px 20px 0;
    /* height: 390px; */
    /* overflow-y: auto; */
  }

  .searchCatalogue ul li {
    text-align: left;
    height: 30px;
    line-height: 30px;
  }
}

.map-plot {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 595px;
  height: 77px;
  left: calc((100% - 595px) / 2);
  bottom: 130px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  padding: 0 30px;
  z-index: 99999;
  cursor: pointer;

  .map-plot-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 70px;
    height: 67px;

    span {
      font-size: 48px;
      line-height: 48px;
    }
  }

  .map-plot-item.active {
    background: rgba(153, 153, 153, 0.7);
    border-radius: 4px;
  }
}

.map-plot-control-text {
  width: 268px;
  padding: 10px;
  position: absolute;
  bottom: 213px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  z-index: 99999;
  cursor: pointer;
}

.map-plot-control-stroke {
  z-index: 99999;
  position: absolute;
  cursor: pointer;
  bottom: 213px;
  width: 156px;
  height: 92px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  padding: 10px 13px;

  .stroke-item {
    width: 130px;
    height: 23px;
    display: flex;
    align-items: center;
    justify-content: center;

    .stroke {
      width: 123px;
      background: #D8D8D8;
    }
  }

  .stroke-item.active {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }

}

.map-plot-control-color {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 318px;
  height: 47px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  bottom: 76px;
  padding: 10px;
  z-index: 99999;
  cursor: pointer;

  .palette {
    width: 26px;
    height: 26px;
    background: #FFFFFF;
  }

  .palette.active {
    border: 2px solid #BBBBBB;
  }

}

.map-measure {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 257px;
  height: 77px;
  padding: 0 30px;
  left: calc((100% - 257px) / 2);
  bottom: 130px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 14px;
  z-index: 99999;
  cursor: pointer;

  .map-measure-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 70px;
    height: 67px;

    span {
      font-size: 48px;
      line-height: 48px;
    }
  }

  .map-measure-item.active {
    background: rgba(153, 153, 153, 0.7);
    border-radius: 4px;
  }
}

.map-measure-hint {
  position: absolute;
  padding: 15px 10px;
  right: 20px;
  top: 20px;
  width: 350px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 8px;
  z-index: 99999;

  ul {
    li {
      font-size: 16px;
      font-family: AlibabaSans-MediumItalic, AlibabaSans;
      font-weight: normal;
      color: #FFFFFF;
      line-height: 25px;
      margin-bottom: 10px;
      margin-top: 10px;
      list-style: none;
    }
  }
}
</style>
