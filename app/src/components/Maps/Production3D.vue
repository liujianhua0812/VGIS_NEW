<template>
  <div class="formation threeDMap" style="height: 100%;">
    <div class="stationInfo" v-if="showPanel">
      <CPF1InfoPanel :poi="currentPOI" v-if="currentPOI.tag === 'CPF1'"></CPF1InfoPanel>
      <DS1InfoPanel :poi="currentPOI" v-else-if="currentPOI.tag === 'DS1'"></DS1InfoPanel>
      <DS2InfoPanel :poi="currentPOI" v-else-if="currentPOI.tag === 'DS2'"></DS2InfoPanel>
      <WarehouseInfoPanel :poi="currentPOI" v-else-if="currentPOI.tag === 'Warehouse-1'" :title="currentPOI.name"></WarehouseInfoPanel>
      <WellInfoPanel :poi="currentPOI" v-else-if="currentPOI.tag && currentPOI.tag.match(/MJ-\d{2}/)"></WellInfoPanel>
      <WellPadInfoPanel :poi="currentPOI" v-else-if="currentPOI.tag && currentPOI.tag.match(/MJ-[EF]\d{2}/)"></WellPadInfoPanel>
      <TankInfoPanel :poi="currentPOI" v-else-if="currentPOI.type ==='Tank'" :location="parentMap[currentPOI.tag] ? parentMap[currentPOI.tag].tag : ''"></TankInfoPanel>
      <CCTVInfoPanel :poi="currentPOI" v-else-if="currentPOI.type === 'CCTV'"></CCTVInfoPanel>
      <SeparatorInfoPanel :poi="currentPOI" v-else-if="currentPOI.type" :location="parentMap[currentPOI.tag] ? parentMap[currentPOI.tag].tag : ''"></SeparatorInfoPanel>
      <OtherInfoPanel :poi="currentPOI" v-else :title="currentPOI.tag"></OtherInfoPanel>
    </div>
    <button class="button" @click="backButton" type="primary" style="margin-left: 16px;padding: 0;"
            v-show="isBackBtn"><i class="el-icon-back"></i> Back
    </button>
    <div class="operatingList" id="operatingLists">
      <el-select v-if="getRouteName === 'Name'" style="display:none" v-model="selectValue" placeholder="Select"
                 @change="changeSelectValue" :class="[isSelectActive ? 'siteStyle':'selectType']"
                 @focus="selectActive()">
        <el-option label="Situational Awareness" key="Situational Awareness" value="type_1"></el-option>
        <el-option label="Wells Production Monitoring" key="Wells Production Monitoring" value="type_2"></el-option>
        <el-option label="Pipeline Overview" key="Pipeline Overview" value="type_3"></el-option>
      </el-select>
      <el-select v-else v-model="selectValue" placeholder="Select" @change="changeSelectValue"
                 :class="[isSelectActive ? 'siteStyle':'selectType']" style="border-radius:4px;"
                 @focus="selectActive()">
        <el-option label="Situational Awareness" key="Situational Awareness" value="type_1"></el-option>
        <el-option label="Wells Production Monitoring" key="Wells Production Monitoring" value="type_2"></el-option>
        <el-option label="Pipeline Overview" key="Pipeline Overview" value="type_3"></el-option>
      </el-select>
      <vgis-collapse title="Regions" v-model="showSearchPanel" class="noc-vgis-collapse-search">
        <div class="menuTitle menuTitleMenus" @click="showSearchList()">
          <div class="searchMenuList" ref="searchMenuList">
            <div class="searchCatalogue">
              <div class="searchCatalogueList" v-if="!isSearchVal">
                <!-- node-key="name" -->
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
    <div ref="container" style="height: 100%;"></div>
  </div>
</template>
<script>
  var popup, layer;
  var lightModelName = ""
  import VgisCollapse from '@/components/Standard/vgis-collapse'
  import {getHierarchy, getNodeDetail} from "@/assets/js/api/hierarchy";
  import config from "@/config";
  import 'canvas-toBlob'

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
    name: 'ProductionThreeDimMap',
    props: {
      mapName: String,
      action: Boolean,
      mapPosition: Object,
      position: Array,
      parameter: String,
      isoperation: Boolean,
      modelList: Array,
      LinkageParames: Array,
      selectValue: String,
      currentTag: String
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
    watch: {
      // alarmNameList() {
      //   // 通过vuex的getters方法来获取state里面的数据
      //   this.AlarmEvents(this.$store.state.alarms.production)
      // },
      wellList() {
        return this.wellList
      },
      currentTag(newValue) {
        this.searchMap(newValue)
      },
      position(newValue) {
        if (this.updateSource !== "changeMap") {
          // this.setMapCenter3D(newValue)
        }
        this.updateSource = null;
      }
    },
    data() {
      if (process.env.NODE_ENV === "development") {
      }
      return {
        parentMap: {},
        showSearchPanel: false,
        direction: 0, //朝向角，单位°，范围[-180,180],以正东为零度，向北为正，向南为负,
        source: `${this.$store.state.setting.gis.host2D}/${this.mapName}`,
        serverUrl: this.$store.state.setting.gis.hostPlot,
        dataSource: this.$store.state.setting.gis.hostData,
        layers: {},
        currentName: '',
        subLayers: [],
        promise: {},
        bubbleTitle: "",
        isSelectActive: true,
        wellList: [],
        isSearchVal: false,
        getSearchData: [],
        getHierarchyList: [],//层级树å
        isCalculate: false,
        isPopupWin: false, //图层
        isMeasure: false, //量算
        measureTips: false, //量算提示
        isThematicPanel: false, //ThematicPanel
        istoolOverlook: false,
        isShowArea: false,
        isTools: false,
        isRoam: false,//roam
        initialized: false,
        currentPOI: '',
        showPanel: false,
        active: '',
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        updateSource: null,
        isBackBtn: false,//back按钮是否显示
        backX: "",
        backY: "",
        backValue: '',
        title: "",
        allIds: [],
        allName: [],
      }
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
      storeData() {
        let result = {
          // 子级名称：父级名称
        };
        this.filterHierarchyFn(result, this.getHierarchyList, null);
        return result;
      },
      // alarmNameList() {
      //   // 通过vuex的getters方法来获取state里面的数据
      //   return this.$store.getters.getAlarm
      //
      // },
      getRouteName: function () {
        // 通过vuex的getters方法来获取state里面的数据
        return this.$store.getters.getRouteType
      }
    },
    methods: {
      getRouteNameFn() {
        if (this.getRouteName === "Name") {
          var operatingList = document.getElementById("operatingLists")
          operatingList.style.width = "250px";
        }
      },
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
      handleChange(val) {
        this.isSelectActive = false
      },
      selectActive() {
        this.isSelectActive = true
      },
      initializeEvents() {
        let that = this
        this.viewer.pickEvent.addEventListener(function (feature) {
          if (feature.TAG) {
            that.searchMap(feature.TAG)
          }
        });
        this.viewer.selectedEntityChanged.addEventListener(function (entity) {
          if (Cesium.defined(entity)) {
            that.searchMap(entity.name)
          }
        });
      },
      loadMap() {
        let that = this
        this.viewer = new Cesium.Viewer(this.$refs.container, {
          infoBox: false
        });
        this.viewer.scene.addLightSource(new Cesium.DirectionalLight(this.viewer.camera.position, {intensity: 0.75}));
        this.scene = this.viewer.scene
        let promise = this.scene.open(this.$store.state.setting.gis.host3D)
        let credit = this.viewer.scene.frameState.creditDisplay;
        credit.container.innerHTML = ''
        try {
          Cesium.when(promise, function (layers) {
            // 设置点击模型时的响应
            that.scene.sun.show = false
            let _layers = that.viewer.scene.layers.layerQueue
            for (let i = 0; i < _layers.length; i++) {
              let name = _layers[i].name.split("@")
              _layers[i].setQueryParameter({
                url: that.dataSource,
                dataSourceName: name[1],
                dataSetName: name[0],
                keyWord: 'SmID'
              });
            }
            credit = that.viewer.scene.frameState.creditDisplay;
            credit.container.innerHTML = ''
            that.initialized = true;
            that.searchMap(that.currentTag)
          }, function (e) {
            console.log(e)
          });
        } catch (e) {
          console.log(e)
        }
        this.initializeEvents()
        // this.AlarmEvents()
      },
      changeSelectValue(value) {
        this.$emit("changeSelectValue", value)
      },
      setMapCenter3D(position) {
        let x = position[0], y = position[1]
        this.backX = x;
        this.backY = y
        this.setMapCenterLonLat(x, y);
      },
      backButton() {
        let parentTag = this.storeData[this.currentTag] || "";
        this.searchMap(parentTag.tag)
      },
      setMapCenterLonLat(lon, lat, transform, height) {
        // position默认中心点是[投影转换]后的值，所以需要先[回转]
        if (transform) {
          let pos = new SuperMap.LonLat(lon, lat);
          //投影转换(回转)，再取出来转换过的坐标
          pos.transform("EPSG:3857", "EPSG:4326");
          lon = pos.lon
          lat = pos.lat
        }
        // 拿到弧度
        var longitude = Cesium.Math.toRadians(lon);
        var latitude = Cesium.Math.toRadians(lat);
        let alt = height ? height : (this.viewer.camera.positionCartographic.height > 100 ? 100 : this.viewer.camera.positionCartographic.height)
        var z = this.viewer.camera.position.z
        var ellipsoid = this.viewer.scene.globe.ellipsoid;
        let cartographic = Cesium.Cartographic.fromRadians(longitude, latitude, alt);
        let cartesian3 = ellipsoid.cartographicToCartesian(cartographic);
        const heading = Cesium.Math.toRadians(0.0);
        const pitch = Cesium.Math.toRadians(-60.0);
        const range = 30.0;
        this.viewer.camera.flyToBoundingSphere(
          new Cesium.BoundingSphere(cartesian3, 30), {
            offset: new Cesium.HeadingPitchRange(heading, pitch, range),
            duration: 0
          }
        )
      },
      searchMap(tag, placeCamera = true) {
        if (!tag) {
          this.currentName = tag
        }
        if (this.pendingRequest) {
          this.pendingRequest.destroy()
          this.pendingRequest = null
        }
        // 安置观察位点，显示内容
        getNodeDetail(tag).then(result => {
          this.currentPOI = {
            tag: result.data.instanceId,
            type: result.data.model.name,
            name: result.data.name,
            sourceId: null,
            modelSource: null,
            position: [0, 0, 0]
          }
          this.$emit('changeMapFlag', this.currentPOI.tag, false);
          this.showPanel = true
          if (result.data.threeDViewPoint && Object.keys(result.data.threeDViewPoint).length > 0) {
            if (placeCamera) {
              this.setViewPoint(result.data.threeDViewPoint)
            }
          }
          this.getPositionFromMapService({ tag })
        })
      },
      getPositionFromMapService (poi) {
        // 查询数据
        let queryParam = [
          new SuperMap.REST.FilterParameter({
            name: "MJ_Wells_Surface_Location_01Jan18@Majnoon",
            attributeFilter: "Tag = '" + poi.tag + "'",
          }),
          new SuperMap.REST.FilterParameter({
            name: "MJ_Facilities_Outlines@Majnoon",
            attributeFilter: "NAME = '" + poi.tag + "'",
          }),
          new SuperMap.REST.FilterParameter({
            name: "MJ_Equipment@Majnoon",
            attributeFilter: "Tag = '" + poi.tag + "'",
          }),
          new SuperMap.REST.FilterParameter({
            name: "CCTV@Majnoon",
            attributeFilter: "Tag = '" + poi.tag + "'",
          })
        ];

        let queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
          queryParams: queryParam
        });
        let myQueryBySQLService = new SuperMap.REST.QueryBySQLService(this.source, {
          eventListeners: {
            "process Completed": this.showQueryResult,
            "processFailed": this.queryError
          }
        });
        this.pendingRequest = myQueryBySQLService
        myQueryBySQLService.processAsync(queryBySQLParams);
      },
      getPositionFrom3DMapService(name) {
        let getFeatureParam = new SuperMap.REST.FilterParameter({
          attributeFilter: `Tag='${name}'`
        });
        let getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
          queryParameter: getFeatureParam,
          datasetNames: this.$store.state.setting.gis.datasets
        });
        let getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(this.dataSource, {
          eventListeners: {
            processCompleted: this.showQueryResult,
            processFailed: this.queryError
          }
        });
        getFeatureBySQLService.processAsync(getFeatureBySQLParams);
      },
      showQueryResult(queryEventArgs) {
        let result = queryEventArgs.originResult;
        if (result) {
          let match = null;
          // 查询2D地图的结果
          if (result.recordsets) {
            for (let i = 0; i < result.recordsets.length; i++) {
              let recordSet = result.recordsets[i]
              if (recordSet.features.length > 0) {
                match = recordSet.features[0]
                break
              }
            }
            if (match) {
              let sourceIdIndex = match.fieldNames.indexOf('SourceID')
              let sourceIndex = match.fieldNames.indexOf('ModelSource')
              let position = new SuperMap.LonLat(match.geometry.center.x, match.geometry.center.y)
              position.transform("EPSG:3857", "EPSG:4326");
              this.currentPOI.position = [position.lon, position.lat]
              // 如果有3D模型，则查3D的数据
              if (sourceIndex !== -1 && match.fieldValues[sourceIndex]) {
                this.currentPOI.sourceId = match.fieldValues[sourceIdIndex]
                this.currentPOI.modelSource = match.fieldValues[sourceIndex]
                this.getPositionFrom3DMapService(this.currentPOI.tag)
              }
              else {
                this.clearHighlight(false)
              }
            }
          }
          // 查询3D模型的结果
          else if (result.features) {
            let feature = queryEventArgs.result.features[0]
            if (feature) {
              this.currentPOI.position = [parseFloat(feature.data.CENTER_X), parseFloat(feature.data.CENTER_Y), parseFloat(feature.data.HEIGHT)]
              this.currentPOI.adjusted_position = [parseFloat(feature.data.CENTER_X), parseFloat(feature.data.CENTER_Y), parseFloat(feature.data.HEIGHT) + parseFloat(feature.data.BOTTOMATTITUDE)]
            }
            this.highlightModel(this.currentPOI)
            this.updateTargetPosition()
          }
        }
      },
      setViewPoint(viewPoint) {
        let cam = this.viewer.camera
        if (viewPoint instanceof Array) {
          let longitude = Cesium.Math.toRadians(viewPoint[0]);
          let latitude = Cesium.Math.toRadians(viewPoint[1]);
          let alt = cam.positionCartographic.height
          let ellipsoid = viewer.scene.globe.ellipsoid;
          let cartographic = Cesium.Cartographic.fromRadians(longitude, latitude, alt);
          cam.position = ellipsoid.cartographicToCartesian(cartographic)
        }
        else {
          cam.position = viewPoint.position
          cam.direction = viewPoint.direction
          cam.up = viewPoint.up
          cam.right = viewPoint.right
        }
      },
      queryError(e) {
        console.log(e, "error")
      },
      clearMarkers() {
        this.viewer.entities.removeAll()
      },
      showSearchList() {
        this.$refs.searchMenuList.style.left = "210px"
        this.$refs.searchMenuList.style.right = "inherit"
        this.$refs.searchMenuList.style.width = "260px"
        this.getHierarchy()
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
          this.parentMap = this.getParentMap(this.getHierarchyList, null, {})
        })
      },
      clearHighlight (excludedSelection = false) {
        // Clear all highlight from all layers
        let layers = this.scene.layers.layerQueue
        for(let i = 0; i < layers.length; i++) {
          let layer = layers[i]
          layer.removeAllObjsColor()
          if (!excludedSelection) {
            layer.releaseSelection()
          }
        }
      },
      highlightModel(poi) {
        this.clearHighlight(false)
        // Highlight the selected feature
        if (poi.modelSource && poi.sourceId) {
          let targetLayer = this.scene.layers.find(poi.modelSource);
          targetLayer.setObjsColor(poi.sourceId, Cesium.Color.LIGHTGREEN);
        }
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.getRouteNameFn()
        this.loadMap()
        this.getHierarchy()
      })
    },
    created() {
    }

  }
</script>

<style lang="scss" scoped>

  .noc-vgis-collapse-search {
    width: 250px;
  }

  .operatingList .el-select-dropdown__item span {
    color: #FFF !important;
    z-index: 9999;
  }

  .operatingList .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    background: rgba(216, 216, 216, 0.4) !important;
  }

  .cesium-infoBox {
    top: 67px;
  }

  .button {
    z-index: 99998;
    position: absolute;
    left: 0px;
    top: 93%;
    /* bottom: 10px; */
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

  .handCursor {
    cursor: pointer;
  }

  .el-select-dropdown .el-popper {
    background-color: rgba(0, 0, 0, 0.7) !important;
    background: rgba(0, 0, 0, 0.7) !important;
  }

  .threeDMap .el-input__inner {
    // background: #4facff;
    background: rgba(0, 0, 0, 0) !important;
    border-radius: 4px;
    color: #fff;
    height: 36px;
    border: none !important;

  }

  .siteStyle {
    background: rgba(79, 172, 255, 1) !important;
    border-radius: 4px;
  }

  #SuperMap_Control_MaximizeDiv {
    display: none;
  }

  .collapseStyle .el-collapse-item__header {
    clear: both;
    background: #4FACFF !important;
    color: #FFFFFF !important;
    z-index: 99999;
    text-align: center;
    border: none;
    padding-left: 10px;
    /* border-radius: 6px; */
    border-radius: 6px 6px 0 0;
    font-size: 18px;
  }

  div.el-collapse-item__content {
    padding-bottom: 0px !important;
    background: rgba(0, 0, 0, 0) !important;
  }

  .threeDMap .el-collapse {
    border: none;
    width: 250px;
    height: 36px;
    border-radius: 6px;
    color: #FFF
  }

  .el-tree-node__content:hover {
    background: rgba(108, 180, 255, 0.2) !important;
    background-color: rgba(108, 180, 255, 0.2) !important;
  }

  .el-tree-node :deep(.is-focusable:hover) {
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

  .bubble {
    width: 300px;
    height: 155px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 8px;
    z-index: 99999;
    position: absolute;
    font-size: 16px;
    font-family: AlibabaPuHuiTi-Regular, AlibabaPuHuiTi;
    font-weight: 400;
    color: #FFFFFF;
    text-align: left;
  }

  #tableContainer {
    width: 100%;
    padding: 0 12px;
  }

  #tableContainer td {
    width: 50%;
  }

  .bubbleName {
    font-size: 20px;
    font-weight: 500;
    color: #C44FFF;
    padding: 5px 5px 10px 5px;
    text-align: left;
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

  .el-collapse-item :deep(.menuTitle .menuTitleMenus) {
    height: 36px;
  }

  .cesium-viewer-navigationContainer {
    position: absolute;
    right: 0px;
    z-index: 299;
    top: 540px !important;
  }

  .selectType {
    width: 107px;
    // height: 36px;
    // line-height: 36px;
    background: rgba(0, 0, 0, 0.7) !important;
    // border-radius: 6px;
    color: #FFF;
    cursor: pointer;
  }

  .threeDMap .el-select {
    width: 107px;
    height: 36px;
  }

  .threeDMap .el-collapse-item__wrap {
    /* height: 500px; */
    overflow-y: scroll;
    background-color: rgba(0, 0, 0, 0.7);
    color: #FFF !important;
  }

  .threeDMap div.el-collapse-item__header {
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


  div.threeDMap.el-input div.threeDMap.el-input--suffixu {
    width: 260px;
    height: 115px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    color: #FFF
  }

  .el-select-dropdown {
    background-color: rgba(0, 0, 0, 0.7) !important;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999 !important;
  }
</style>
<style scoped>
  .stationInfo {
    position: absolute;
    left: 13px;
    top: 20px;
    width: 0;
    height: 0;
    z-index: 99999;
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

  .operatingList {
    position: absolute;
    right: 20px;
    top: 20px;
    /* background: rgba(0, 0, 0, 0.7); */
    z-index: 999;
    height: auto;
    width: 372px;
    display: flex;
    justify-content: space-between
  }

  div.threeDMap .el-tree {
    color: #FFF;
    background-color: rgba(0, 0, 0, 0.1);
    margin: 0;
  }

  .el-tree-node__content:hover {
    background: rgba(108, 180, 255, 0.2) !important;
    background-color: rgba(108, 180, 255, 0.2) !important;
    /* background: rgba(108, 180, 255, 0.2); */
    /* background: #000; */
  }

  .active {
    color: #FFFFFF;
  }

  .el-tree-node:focus > .el-tree-node__content {
    background: rgba(108, 180, 255, 0.2) !important;
    /* background: #000; */
  }

  .el-input__inner {
    background: rgba(0, 0, 0, 0.7);
    border-radius: 4px;
    color: #fff !important;
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

  div.threeDMap .el-tree-node__content {
    height: 35px;
  }

  .roam,
  .thematicPanel,
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

  .treeDataListItem {
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
    z-index: 999999;
    padding: 5px;
  }

  .serchInput {
    position: absolute;
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
    z-index: 999;
  }
</style>
