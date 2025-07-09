<template>
  <div>
    <canvas class="container" onmouseover="this.style.cursor='default'" ref="map-container"></canvas>
    <div class="map-navigation" id="map-navigation" v-show="showNavigation">
      <div class="searchCatalogue">
        <div class="searchCatalogueList">
          <!-- 从层级看内容 -->
          <el-tree class="custom" :data="hierarchy" :props="defaultProps" node-key="tag"
                   :default-expanded-keys="Object.keys(allPOI)" @node-click="searchMap"
                   ref="multipleTable">
            <template v-slot:default="{ node, data }">
              <div
                :class="{treeList:data.poi && ['DS2','DS1','CPF1'].indexOf(node.label)<0,treeListItem:data.children}">
                <span class="treeText">{{ node.label }}</span>
              </div>
            </template>
          </el-tree>
        </div>
      </div>
      <span :class="['pinID', { active: pinLayers }]" @click="pinNavigation"><i class="el-icon-coordinate"></i></span>
      <span class="closeID" @click="closeNavigation()"><i class="el-icon-close"></i></span>
    </div>
    <div class="map-cam-mode" v-show="showMode">
      <div class="m-b-20">
        <el-radio v-model="cameraMode" label="Free View" @change="updateCameraMode"></el-radio>
      </div>
      <div>
        <el-radio v-model="cameraMode" label="Top View" @change="updateCameraMode"></el-radio>
      </div>
    </div>
    <div :class="['map-measure-hint', { 'avoid-modes': showMode }]" v-show="status === 'measure'">
      <ul>
        <li><b><i class="iconfont icon-left-click"></i> Left Click</b> map to draw.</li>
        <li><b><i class="iconfont icon-right-click"></i> Right click</b> to finish drawing.</li>
      </ul>
    </div>
    <div :class="['map-measure-hint', { 'avoid-modes': showMode }]" v-show="status === 'walking'">
      <ul>
        <li>Press
          <i style="font-size: 24px;" class="iconfont icon-up m-l-5"></i>
          <i style="font-size: 24px;" class="iconfont icon-down m-l-5"></i>
          <i style="font-size: 24px;" class="iconfont icon-left m-l-5"></i>
          <i style="font-size: 24px;" class="iconfont icon-right m-l-5"></i>
          to move.
        </li>
        <li>Press <b style="border: 1px solid white; border-radius: 1px;" class="p-5">Shift</b> to descend.</li>
        <li>Press <b style="border: 1px solid white; border-radius: 1px;" class="p-5">Space</b> to ascend.</li>
        <li>Press <b style="border: 1px solid white; border-radius: 1px;" class="p-5">Shift</b> to sprint</li>
        <li>Move <b><i class="iconfont icon-mouse"></i></b> to look around.</li>
        <li>Press <b style="border: 1px solid white; border-radius: 1px;" class="p-5">Esc</b> to exit.</li>
      </ul>
    </div>
    <div class="map-roam" v-if="showRoaming">
      <div class="m-t-10 m-b-10" @click="enterFlightMode(route)"
           :class="[(active === `${route.name}` ? 'defaultColor':'disActive'), 'flightMode']" v-for="route in routeList"
           :key="route.id">
        <div class="routeName">{{ route.name }}</div>
        <el-tooltip :content="route.stops.map(item => item.hasRelation ? item.equipName : item.name).join(' - ')">
          <div class="routeMap">
            <RouteViewer :route="route" mapName="Majnoon" :simple="true" :lock="true"
                         style="border: 6px solid #081C31;border-radius: 6px;">
            </RouteViewer>
          </div>
        </el-tooltip>
      </div>
    </div>
    <div class="map-roam-toolbar" v-if="isRoaming">
      <div class="flex align-items-center justify-content-end m-b-10">
        <div v-if="roamingStatus === 'roaming'" @click="pauseRoaming" class="map-roam-button el-icon-video-pause"
             title="暂停"></div>
        <div v-else @click="startRoaming" class="map-roam-button el-icon-video-play" title="启动"></div>
        <div @click="quitRoaming" class="map-roam-button el-icon-close m-l-10" title="停止"></div>
      </div>
      <div>
        <ul id="stopList" class="form-control" style="width: 100%;">
          <li v-for="(item, index) in roamingStops" :key="index" @click="switchRoamingStop(index)"
              :class="[active === index ? 'siteStyle':'disActive']">
            {{ item.hasRelation ? item.equipName : item.name }}
          </li>
        </ul>
      </div>
    </div>
    <loading-indicator :message="loadingMessage" class="loading-indicator" v-if="loading"></loading-indicator>
    <component
        :ref="`${INST_MGR_TAG}${instance.tag}`"
        :is="InstanceManagers[`${instance.type.replace(/[ \-_]/g, '')}3DManager`] ? `${instance.type.replace(/[ \-_]/g, '')}3DManager` : 'Instance3DManager'"
        :key="instance.tag"
        :instance="instance"
        style="{ 'z-index': index + 999 }"
        v-for="(instance, index) in allPOI"
        @loaded="injectScene">
    </component>
    <div class="border border-top" v-if="$store.state.hasWarning"></div>
    <div class="border border-left" v-if="$store.state.hasWarning"></div>
    <div class="border border-right" v-if="$store.state.hasWarning"></div>
    <div class="border border-bottom" v-if="$store.state.hasWarning"></div>
  </div>
</template>
<script>

  import EventBus from "@/utils/EventBus";
  import CPF1UpperEntrance from "@/assets/others/CPF1-Entrance-Upper.json"
  import CPF1LowerEntrance from "@/assets/others/CPF1-Entrance-Lower.json"
  import CPF1MainPipeline from "@/assets/others/CPF1-Main-Pipeline.json"

  let ids = [9, 10, 11, 102, 103, 109, 110, 111, 112, 113, 120, 121, 127, 128, 129, 130, 131, 284, 292, 319, 320, 324, 325, 326, 337]
  import InstanceManagers from "@/components/InstanceManagers";
  import FlyManager from "../../utils/BetterFlyManager";
  import AlarmManager from "../InfoPanels/MapTool/AlarmManager";
  import markerIcon from "../../assets/images/panel/marker-selectable.png"
  import stringSimilarity from "string-similarity";
  import markerIconSvg from "@/assets/images/3dmark.svg"
  import {getHierarchy, getNodeDetail} from "@/assets/js/api/hierarchy";
  import {getRoutes} from "@/assets/js/api/roaming";
  import config from "@/config";
  import MiniMap from "@/components/Standard/2DMiniMap"
  import RouteViewer from '@/components/Standard/RouteViewer'
  import EntranceInfoPanel from "@/components/InfoPanels/MapTool/EntranceInfoPanel";
  import LoadingIndicator from "../Standard/LoadingIndicator";
  import MouseRotateInput from "@/utils/MouseRotateInput";
  import {getRoute} from "@/assets/js/api/roaming";
  import axios from "axios"
  import {
    Angle, ArcRotateCamera,
    Color3,
    Engine,
    FreeCamera,
    HemisphericLight,
    HighlightLayer, MeshBuilder,
    Scene,
    SceneLoader, StandardMaterial, Tools, UniversalCamera,
    Vector3
  } from "@babylonjs/core";

  export default {
    name: 'ThreeDimMap',
    props: {
      mapName: String,
      action: Boolean,
      mapPosition: Object,
      position: Array,
      status: String,
      showNavigation: Boolean,
      showRoaming: Boolean,
      showMode: Boolean,
      mapInfo: Object,
      query: String,
      isContActive: Boolean,
      propsName: Object
    },
    components: Object.assign({
      LoadingIndicator,
      MiniMap,
      RouteViewer
    }, InstanceManagers),
    watch: {
      propsName(value) {
        this.toggleModelVisibility()
        this.getHierarchy("", value.name)
      },
      status(newValue) {
        if (newValue === 'default') {
          this.quitRoaming()
          this.exitMeasureMode()
          this.quitWalkingMode()
        } else if (newValue === 'measure') {
          this.quitRoaming()
          this.quitWalkingMode(true)
        } else if (newValue === 'walking') {
          this.quitRoaming()
          this.exitMeasureMode(true)
          this.enterWalkingMode()
        }
      },
      showRoaming(newValue) {
        if (newValue) {
          this.getRoutes()
        }
      },
      isContActive(value) {
        if (!value) {
          // 范围查询
          this.exitMeasureMode()
          this.enterSelectMode()
        }
      },
      query(newValue) {
        if (newValue && this.mapInfo.active && this.mapInfo.mode === '3D') {
          this.getSearchResults(newValue)
        }
      },
      position(newValue) {
        this.setViewPoint(newValue)
      }
    },
    data() {
      return {
        INST_MGR_TAG: "instmgr-",
        InstanceManagers,
        loading: true,
        loadingMessage: "Loading 3D Scene",
        cursorPosition: [0, 0, 0],
        parentMap: {},
        currentPOI: {},
        cachedSelectionMap: {},
        currentMeasure: '',
        direction: 0, //朝向角，单位°，范围[-180,180],以正东为零度，向北为正，向南为负,
        scale: 14, // 缩放尺度
        source: `${config.backend.host}models/`,
        distance: "",
        layers: {},
        measurements: {},
        showPanel: false,
        controllers: {},
        walkingMaxHeight: 100,
        walkingMinHeight: 2.5,
        walkingFrameRate: 60,
        cameraMode: 'Free View',
        isRoaming: false,
        roamingStatus: "",
        routeList: [],
        roamingStops: [],
        hierarchy: [],//层级树
        allPOI: {},
        pinLayers: false,
        disabled: false,
        initialized: false,
        visibilityList: {
          "FCC": [
              "F1@FCC",
              "F2@FCC",
              "ROOF@FCC",
              "B1@FCC",
              "CMA@FCC",
          ],
          "FCC-F2": [
            "F1@FCC",
            "F2@FCC",
            "B1@FCC",
            "CMA@FCC",
          ],
          "FCC-F1": [
            "F1@FCC",
            "B1@FCC",
            "CMA@FCC",
          ],
          "FCC-B1": [
            "B1@FCC",
          ]
        },
        warningList: {
          "CP000-25-T-001": {
            series: "Level",
            standard: "80%",
            value: "80.56%"
          }
        },
        active: '',
        layersList: [],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        poiPosition: {x: 0, y: 0},
        cameraPosition: {},
        updateSource: null,
      }
    },
    computed: {},
    methods: {
      loadScene () {
        this.loadingMessage = this.$t("message.gis.loadingScene")
        let that = this
        const canvas = this.$refs["map-container"]
        const engine = new Engine(canvas, true, { stencil: true });
        const scene = new Scene(engine);
        scene.clearColor = Color3.White()

        let camera = new FreeCamera("free-cam", new Vector3(0, 1, 0), scene);
        camera.keysUp = [87, 38];
        camera.keysDown = [83, 40];
        camera.keysLeft = [65, 37];
        camera.keysRight = [68, 39];
        camera.setTarget(new Vector3(0, 0, 0))
        camera.attachControl(canvas, true);

        let overlookCamera = new ArcRotateCamera("overlook-cam", Math.PI / 2, Math.PI / 2, 2, new Vector3(0, 1, 0), scene);
        overlookCamera.keysUp = [87, 38];
        overlookCamera.keysDown = [83, 40];
        overlookCamera.keysLeft = [65, 37];
        overlookCamera.keysRight = [68, 39];
        overlookCamera.upperBetaLimit = Angle.FromDegrees(0).radians();
        overlookCamera.lowerBetaLimit = Angle.FromDegrees(0).radians();
        overlookCamera.setTarget(new Vector3(0, 0, 0))

        let walkCamera = new UniversalCamera("walk-cam", new Vector3(0, 1, 0), scene);
        // walkCamera.inputs.removeMouse()
        // walkCamera.inputs.removeMouseWheel()
        // walkCamera.inputs.add(new MouseRotateInput())
        walkCamera.keysUp = [87, 38];
        walkCamera.keysDown = [83, 40];
        walkCamera.keysLeft = [65, 37];
        walkCamera.keysRight = [68, 39];
        walkCamera.keysUpward = [32];
        walkCamera.keysDownward = [16];
        walkCamera.setTarget(new Vector3(0, 0, 0))

        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        const highlight = new HighlightLayer("hl1", scene);
        highlight.innerGlow = true
        highlight.outerGlow = true

        engine.runRenderLoop(() => {
          scene.render();
        });

        this.scene = scene
        this.engine = engine
        this.highlight = highlight

        SceneLoader.ImportMesh(null, this.source, this.$store.state.setting.scene.main, scene, (meshes, particleSystems, skeletons) => {
          that.meshes = meshes
          that.loadEnvironment()
          that.loadEvents()
          that.markSelectable()
          that.loadingMessage = ""
          that.loading = false
        })
      },
      loadEvents () {
        let that = this
        for(let i = 0; i < this.scene.cameras.length; i++) {
          let camera = this.scene.cameras[i]
          camera.onViewMatrixChangedObservable.add(() => {
            that.notifyCameraMovement()
          })
        }
      },
      resetCamera () {
        if (!this.boundingBox) {
          let { min, max } = this.scene.getWorldExtends()
          this.boundingBox = { min, max }
        }
        let { min, max } = this.boundingBox
        let camera = this.scene.cameras.find(item => item.name === "free-cam")
        let overlook = this.scene.cameras.find(item => item.name === "overlook-cam")
        let walk = this.scene.cameras.find(item => item.name === "walk-cam")
        let zoomScale = 0.8
        let center = Vector3.Center(min, max)
        camera.position = new Vector3(
            max.x,
            // max.x + (max.x - min.x) * zoomScale,
            // (max.x + min.x) / 2,
            max.y + (max.y - min.y) * zoomScale,
            // (max.y + min.y) / 2,
            max.z,
            // max.z + (max.z - min.z) * zoomScale,
            // (max.z + min.z) / 2,
        )
        camera.setTarget(center);
        overlook.position = new Vector3(
            center._x,
            // (max.x + min.x) / 2,
            max.y + (max.y - min.y) * zoomScale,
            // (max.y + min.y) / 2,
            center._z
            // (max.z + min.z) / 2,
        )
        overlook.setTarget(Vector3.Center(min, max));
        walk.position = new Vector3(
            max.x + (max.x - min.x) * zoomScale,
            // (max.x + min.x) / 2,
            min.y + walk.ellipsoid._y * 2,
            // (max.y + min.y) / 2,
            max.z + (max.z - min.z) * zoomScale
            // (max.z + min.z) / 2,
        )
        walk.setTarget(Vector3.Center(min, max));
        camera.checkCollisions = true
        overlook.checkCollisions = true
        walk.checkCollisions = true
        walk.applyGravity = true
      },
      loadEnvironment () {
        let scene = this.scene
        let camera = this.scene.activeCamera
        let { min, max } = scene.getWorldExtends()
        this.resetCamera()
        const ground = MeshBuilder.CreatePlane("ground", { size: Math.max(max.x - min.x, max.y - min.y) * 100 }, scene);
        let material = new StandardMaterial("box-material", scene);
        material.diffuseColor = Color3.FromHexString("#CCCCCC");
        ground.material = material;
        ground.position = new Vector3(0, min.y, 0)
        ground.rotate(new Vector3(1, 0, 0), Math.PI / 2)
        ground.receiveShadows = true
        ground.isPickable = true
        // let shadowGenerator = new ShadowGenerator(1024, light)
        // shadowGenerator.getShadowMap().renderList = shadowGenerator.getShadowMap().renderList.concat(scene.meshes);
        scene.fogMode = Scene.FOGMODE_LINEAR

        let diameter = Math.max(
            max.x - min.x,
            max.y - min.y,
            max.z - min.z,
        ) * 5

        const boundingSphere = MeshBuilder.CreateSphere("boundingSphere", {
          diameter,
          sideOrientation: 1
        })
        boundingSphere.isPickable = true
        boundingSphere.visibility = 0
        material = new StandardMaterial("sphere-material", scene);
        material.diffuseColor = Color3.White();
        boundingSphere.material = material;
        boundingSphere.position = new Vector3(
            (max.x + min.x) / 2,
            (max.y + min.y) / 2,
            (max.z + min.z) / 2,
        )

        scene.collisionsEnabled = true
        ground.checkCollisions = true
        boundingSphere.checkCollisions = true

        scene.fogColor = Color3.White();
        scene.fogDensity = 0.01;
        scene.fogStart = diameter / 2
        scene.fogEnd = diameter
      },
      resizeScene () {
        if (this.engine) {
          this.engine.resize()
        }
      },
      addEventListeners () {
        window.addEventListener("resize", this.resizeScene)
      },
      removeEventListeners () {
        window.removeEventListener("resize", this.resizeScene)
      },
      toggleModelVisibility () {
        let layers = this.scene.layers.layerQueue
        if (this.propsName && this.propsName.name && this.visibilityList[this.propsName.name]) {
          let visibleList = this.visibilityList[this.propsName.name].reduce((result, item) => {
            result[item] = item
            return result
          }, {})
          for(let i = 0; i < layers.length; i++) {
            let layer = layers[i]
            layer.visible = !!visibleList[layer.name]
          }
        }
        else {
          for(let i = 0; i < layers.length; i++) {
            let layer = layers[i]
            layer.visible = true
          }
        }
      },
      injectScene (instanceId) {
        if (this.$refs[`${this.INST_MGR_TAG}${instanceId}`][0]) {
          this.$refs[`${this.INST_MGR_TAG}${instanceId}`][0].setScene(this.scene)
        }
      },
      // 单体点击查询事件
      pick3DModel(feature) {
        if (feature) {
          EventBus.$emit(`inst-${feature.TAG}-handler`, "select")
        }
        else {
          this.viewer.scene.layers.releaseSelection()
        }
      },
      pickModelMarker(feature) {
        if (feature) {
          let selected = this.getFeatureFromCache(feature)
          if (selected) {
            this.searchMap({tag: selected.tag}, false)
          }
        }
        else {
          this.viewer.scene.layers.releaseSelection()
        }
      },
      getFeatureFromCache(feature) {
        if (!feature.primitive) {
          if (feature.tag) {
            return feature
          }
          return null
        }
        if (!this.cachedSelectionMap[feature.primitive.name]) {
          return null
        }
        return this.cachedSelectionMap[feature.primitive.name][feature.id]
      },
      quitWalkingMode(noEvent = false) {
        let walk = this.scene.cameras.find(item => item.name === 'walk-cam')
        let free = this.scene.cameras.find(item => item.name === 'free-cam')
        let overlook = this.scene.cameras.find(item => item.name === 'overlook-cam')
        free.attachControl(this.engine.getRenderingCanvas(), true);
        walk.detachControl()
        overlook.detachControl()
        this.resetCamera()
        this.scene.activeCamera = free
        this.scene.onKeyboardObservable.remove(this.watchWalkingModeKey.bind(this))
        if (!noEvent) {
          this.$emit('status-reset')
        }
      },
      enterWalkingMode() {
        let walk = this.scene.cameras.find(item => item.name === 'walk-cam')
        let free = this.scene.cameras.find(item => item.name === 'free-cam')
        let overlook = this.scene.cameras.find(item => item.name === 'overlook-cam')
        walk.attachControl(this.engine.getRenderingCanvas(), true);
        free.detachControl()
        this.scene.onKeyboardObservable.add(this.watchWalkingModeKey.bind(this))
        overlook.detachControl()
        this.scene.activeCamera = walk
      },
      watchWalkingModeKey (kbInfo) {
        console.log(kbInfo.event.key)
        if (kbInfo.event.key === "Escape") {
          this.quitWalkingMode()
        }
      },
      getTarget(event) {

      },
      getKeyDown(event) {

      },
      getKeyUp(event) {

      },
      controlWalking() {

      },
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
      exitMeasureMode(noEvent = false) {
        if (!noEvent) {
          this.$emit("status-reset")
        }
      },
      updateCameraMode() {
        let free = this.scene.cameras.find(item => item.name === 'free-cam')
        let overlook = this.scene.cameras.find(item => item.name === 'overlook-cam')
        let walk = this.scene.cameras.find(item => item.name === 'walk-cam')
        if (this.cameraMode === 'Free View') {
          free.attachControl(this.engine.getRenderingCanvas(), false)
          overlook.detachControl()
          walk.detachControl()
          this.scene.activeCamera = free
        } else {
          overlook.attachControl(this.engine.getRenderingCanvas(), false)
          free.detachControl()
          walk.detachControl()
          this.scene.activeCamera = overlook
        }
      },
      notifyCameraMovement () {
        for(let tag in this.allPOI) {
          EventBus.$emit(`inst-${tag}-handler`, "camera-moved")
        }
      },
      markSelectable() {
        for(let tag in this.allPOI) {
          EventBus.$emit(`inst-${tag}-handler`, "reset")
        }
      },
      drawLine (points) {
        // 直接添加线
        let polyline = this.viewer.entities.add({
          polyline: {
            positions: points,
            width: 1,
            material: new Cesium.Color.fromCssColorString("rgba(255,106,0,0.5)")
          },
          constant: true
        });
        let trail = this.viewer.entities.add({
          polyline: {
            positions: points,
            width: 1,
            material: new Cesium.PolylineTrailMaterialProperty({ // 尾迹线材质
              color: Cesium.Color.fromCssColorString('rgb(255,221,0)'),
              trailLength : 0.5,
              period : 10
            })
          },
          constant: true
        })
      },
      addHighlightEffect() {
        this.drawLine(CPF1UpperEntrance)
        this.drawLine(CPF1LowerEntrance)
        this.drawLine(CPF1MainPipeline)
      },
      removeAllEntities () {
        // for(let i = 0; i < this.viewer.entities.values.length; i++) {
        //   let entity = this.viewer.entities.values[i]
        //   if (!entity.constant) {
        //     this.viewer.entities.remove(entity)
        //   }
        // }
      },
      loadMap() {
        let that = this
        this.viewer = new Cesium.Viewer(`${this.mapInfo.name}-3D`, {
          infoBox: false
        });
        this.viewer.scene.canvas.style.cursor = "auto";
        this.viewer._element.style.cursor = 'default';
        this.scene = this.viewer.scene
        let light = new Cesium.DirectionalLight(this.viewer.camera.position, {intensity: 0.75});
        this.viewer.scene.addLightSource(light);
        let credit = this.viewer.scene.frameState.creditDisplay;
        credit.container.innerHTML = ''

        let promise = this.scene.open(this.$store.state.setting.gis.host3D)
        promise.then(function () {
          that.scene.sun.show = false
          // 为每个 s3m 图层修改高亮颜色为绿色，并设置查询参数
          let layers = that.scene.layers.layerQueue
          for (let i = 0; i < layers.length; i++) {
            let name = layers[i].name.split("@")
            layers[i].selectedColor = Cesium.Color.LIGHTGREEN
            // if (layers[i].name === "CPF@CPF1") {
            //   that.testHighlight(layers[i])
            // }
            layers[i].setQueryParameter({
              url: that.dataSource,
              dataSourceName: name[1],
              dataSetName: name[0],
              keyWord: 'SmID'
            });
          }
          credit = that.scene.frameState.creditDisplay;
          credit.container.innerHTML = ''
          that.getHierarchy().then(() => {
            that.markSelectable()
          })
          that.addHighlightEffect()
        })
        this.initializeMeasurement()
        this.initializeCamera()
        this.initializeEvents()
      },
      searchMap(poi, placeCamera = true) {
        EventBus.$emit(`inst-${poi.tag}-handler`, "select")
        if (placeCamera) {
          EventBus.$emit(`inst-${poi.tag}-handler`, "look")
        }
        if (!this.pinLayers) {
          this.$emit("close-state-toggler")
        }
      },
      updateTargetPosition() {
        let position = this.currentPOI.adjusted_position
        if (position && position.length === 3) {
          let ellipsoid = this.viewer.scene.globe.ellipsoid
          let cartographic = Cesium.Cartographic.fromDegrees(...position)
          let cartesian = ellipsoid.cartographicToCartesian(cartographic)
          this.poiPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, cartesian)
        }
      },
      setViewPoint(viewPoint) {
        let cam = this.viewer.camera
        if (viewPoint instanceof Array) {
          let longitude = Cesium.Math.toRadians(viewPoint[0]);
          let latitude = Cesium.Math.toRadians(viewPoint[1]);
          let alt = cam.positionCartographic.height
          let ellipsoid = this.viewer.scene.globe.ellipsoid;
          let cartographic = Cesium.Cartographic.fromRadians(longitude, latitude, alt);
          cam.position = ellipsoid.cartographicToCartesian(cartographic)
        } else {
          cam.position = viewPoint.position
          cam.direction = viewPoint.direction
          cam.up = viewPoint.up
          cam.right = viewPoint.right
        }
      },
      toggleLayerSelectStatus(status = true) {
        let layers = this.viewer.scene.layers.layerQueue
        for (let i = 0; i < layers.length; i++) {
          layers[i].selectEnabled = status
        }
      },
      updateCursorPosition(evt) {
        let mousePosition = new Cesium.Cartesian2(evt.clientX, evt.clientY);
        let ellipsoid = this.viewer.scene.globe.ellipsoid;
        let cartesian = this.viewer.camera.pickEllipsoid(mousePosition, ellipsoid);
        let cartographic = ellipsoid.cartesianToCartographic(cartesian);
        let longitude = Cesium.Math.toDegrees(cartographic.longitude);
        let latitude = Cesium.Math.toDegrees(cartographic.latitude);
        this.cursorPosition = [longitude, latitude, cartographic.height]
      },
      //飞行模式
      enterFlightMode(route) {
        this.removeAllEntities();
        //飞行停留查询
        //点击模型出现基本信息
        this.$emit("close-state-toggler")
        if (this.status === 'measure') {
          this.exitMeasureMode()
        }
        if (this.status === 'walking') {
          this.quitWalkingMode()
        }
        if (this.roamingStatus === 'roaming') {
          this.quitRoaming()
        }
        let that = this

        getRoute(route.id).then(result => {
          let route = result.data
          this.flyManager = new FlyManager(this.scene, route.config, this)
          this.flyManager.loadRoute(route)
          this.flyManager.addEventListener("leavingStop", function (stopIndex) {
            // TODO: 解决飞行过程中上一站的信息无法清空的错误
          })
          this.flyManager.addEventListener("stopArrived", function (stopIndex) {
            let stop = that.flyManager.stops[stopIndex]
            that.active = stopIndex
            if (stop.hasRelation) {
              that.searchMap({
                name: stop.equipName,
                tag: stop.equipTag
              }, false)
            }
          })
          // 2. 把控制面板（飞行、暂停、停止按钮，站点列表）显示出来，载入对应的数据
          this.isRoaming = true
          //生成飞行文件中的所有站点列表
          this.roamingStops = this.flyManager.stops;
          this.active = 0
          this.startRoaming()
        })
      },
      startRoaming() {
        let that = this
        that.roamingStatus = this.flyManager.start()
      },
      pauseRoaming() {
        this.roamingStatus = this.flyManager.pause()
      },
      quitRoaming() {
        this.removeAllEntities()
        if (this.flyManager) {
          this.roamingStatus = this.flyManager.quit()
        }
        this.showPanel = false
        this.isRoaming = false
      },
      switchRoamingStop(value) {
        this.message = ''
        this.showPanel = false
        this.pauseRoaming()
        this.flyManager.inspect(value)
      },
      emitPosition() {
        let cartographic = this.viewer.camera.positionCartographic// 弧度
        let lat = Cesium.Math.toDegrees(cartographic.latitude);
        let lon = Cesium.Math.toDegrees(cartographic.longitude);
        this.direction = 360 - Cesium.Math.toDegrees(this.viewer.camera.heading);
        let height = cartographic.height;
        this.updateSource = "changeMap";
        this.$emit("pos-updated", [lon, lat, height], '3D');
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
      async getHierarchy() {
        let result = await getHierarchy()
        this.hierarchy = result.data || []
        this.allPOI = this.flattenData(result.data)
      },
      flattenData(hierarchy, parent = null) {
        let result = {}
        for (let i = 0; i < hierarchy.length; i++) {
          if (parent) {
            hierarchy[i].parentTag = parent.tag
            hierarchy[i].parent = parent
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
      getSearchResults(val) {
        // getHierarchy().then(data => {
        //   data = data || {};
        //   this.hierarchy = data.data || [];
        this.parentMap = this.getParentMap(this.hierarchy, null, {})
        this.$emit('query-result', this.getFiltersData(this.hierarchy, val))
        // })
      },
      //范围查询
      processCompleted(response) {
        //框选后的红色标记创建
        let that = this
        this.removeAllEntities();
        response.data.features.filter(feature => {
          let tagFieldIndex = feature.fieldNames.indexOf('TAG')
          let longitudeIndex = feature.fieldNames.indexOf('CENTER_X')
          let latitudeIndex = feature.fieldNames.indexOf('CENTER_Y')
          let hIndex = feature.fieldNames.indexOf('HEIGHT')
          let zIndex = feature.fieldNames.indexOf('BOTTOMATTITUDE')
          if (tagFieldIndex !== -1 && feature.fieldValues[tagFieldIndex]) {
            var longitude = Cesium.Math.toRadians(feature.fieldValues[longitudeIndex]);
            var latitude = Cesium.Math.toRadians(feature.fieldValues[latitudeIndex]);
            let z = parseFloat(feature.fieldValues[zIndex])
            let h = parseFloat(feature.fieldValues[hIndex])
            var ellipsoid = that.scene.globe.ellipsoid;
            var cartographic = Cesium.Cartographic.fromRadians(longitude, latitude, z + h + 3);
            var cartesian3 = ellipsoid.cartographicToCartesian(cartographic);
            that.viewer.entities.add({
              position: cartesian3,
              billboard: {
                image: markerIconSvg,
                width: 11,
                height: 17.5,
              },
              tag: feature.fieldValues[tagFieldIndex],
              name: feature.fieldValues[tagFieldIndex]
            })
          }
        })
        that.$emit('changeSelectValue', true)
        that.viewer.selectedEntityChanged.addEventListener(this.pickModelMarker)
        that.viewer.pickEvent.addEventListener(this.pick3DModel)
        that.toggleLayerSelectStatus(true)
      },
      enterSelectMode() {
        //框选框的创建，通过鼠标点击的四个坐标实现
        let that = this
        // 暂时注销selectedchange和pick事件
        that.viewer.selectedEntityChanged.removeEventListener(this.pickModelMarker)
        that.viewer.pickEvent.removeEventListener(this.pick3DModel)
        // 禁用掉模型对选中行为的支持
        that.toggleLayerSelectStatus(false)
        that.viewer.scene.canvas.style.cursor = "crosshair";
        var handlerPolygon = new Cesium.DrawHandler(that.viewer, Cesium.DrawMode.Polygon);
        handlerPolygon.activate();
        var tooltip = createTooltip(document.body);
        handlerPolygon.drawEvt.addEventListener(function (result) {
          tooltip.setVisible(false);
          handlerPolygon.polygon.show = false;
          handlerPolygon.polyline.show = false;

          var positions = result.object.positions;
          var geometries = [];
          for (var i = 0; i < positions.length; i++) {
            var position = positions[i];
            var cartographic = Cesium.Cartographic.fromCartesian(position);
            var longitude = Cesium.Math.toDegrees(cartographic.longitude);
            var latitude = Cesium.Math.toDegrees(cartographic.latitude);

            var queryPoint = { // 查询点对象
              x: longitude,
              y: latitude
            };
            geometries.push(queryPoint)
          }
          that.viewer.scene.canvas.style.cursor = "default";
          that.doQuery(geometries);
        });
      },
      doQuery(queryPoints) {
        let queryObj = {
          "getFeatureMode": "SPATIAL",
          "spatialQueryMode": "CONTAIN",
          "datasetNames": this.$store.state.setting.gis.datasets,
          "geometry": {
            points: queryPoints,
            type: "REGION"
          }
        };

        let queryData = JSON.stringify(queryObj); // 转化为JSON字符串作为查询参数
        axios({
          method: "POST",
          url: `${this.dataSource}/featureResults.rjson?returnContent=true`,
          data: queryData
        }).then(response => {
          this.processCompleted(response)
        })
      },
      queryError(e) {
        console.log(e);
      },
      download(mime = "png") {
        let size = this.engine.getRenderingCanvasClientRect()
        let that = this
        Tools.CreateScreenshot(this.engine, this.scene.activeCamera, size, (image) => {
          let a = document.createElement("a")
          a.download = `${that.mapInfo.name} - 3D.${mime}`
          a.target = '_self';
          a.href = image
          document.body.appendChild(a)
          a.click()
          a.remove()
        })
      },
      overLook() {
        this.viewer.camera.setView({
          destination: this.viewer.camera.position,
          orientation: {
            // heading: Cesium.Math.toRadians(90.0), // east, default value is 0.0 (north)
            heading: this.viewer.camera.heading,
            pitch: Cesium.Math.toRadians(-90),    // default value (looking down)
            roll: 0.0 //6.2
            // default value
          },
        });
      },
      // 获取所有 roam 路线
      getRoutes() {
        getRoutes().then(data => {
          this.routeList = data.data;
        })
      },
    },
    mounted() {
      this.loadScene()
      this.getHierarchy()
      this.addEventListeners()
    },
    created() {
      this.getRoutes()
    },
    beforeDestroy() {
      this.removeEventListeners()
      if (this.viewer) {
        this.quitWalkingMode()
        this.viewer.imageryLayers.destroy()
        this.viewer.scene.layers.removeAll(true);
      }
    }
  }
</script>

<style>
  .el-select__caret .el-input__icon .el-icon-arrow-up {
    right: 1px;
    line-height: 55px;
  }

  .el-select__caret .el-input__icon .el-icon-arrow-up .is-reverse {
    right: 1px;
    line-height: 40px;
  }

  .el-input--suffix .el-input__inner {
    padding-right: 25px;
    z-index: 9999;
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

  .pinID {
    position: absolute;
    left: 340px;
    top: 15px;
    width: 16px;
    height: 16px;
    font-size: 16px;
    cursor: pointer;
  }

  .pinID.active {
    color: #8ac7fc;
  }

  .el-popper .popper__arrow,
  .el-popper .popper__arrow {
    color: #081C31;
    top: -8px;
    border-style: none
  }

  .el-tree-node:focus > .el-tree-node__content {
    /* background: #124375 !important; */
  }

  .el-tree-node__content:hover {
    background: rgba(108, 180, 255, 0.2) !important;
    background-color: rgba(108, 180, 255, 0.2) !important;
    z-index: 9999;
    /* border-bottom: 1px solid rgba(255, 255, 255, 0.4); */
  }
</style>
<style lang="scss">

  .border {
    position: absolute;
    z-index: 99999;

    animation-duration: 1s;
    animation-timing-function: linear;
    animation-delay: 0s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-play-state: running;

    -webkit-animation-duration: 1s;
    -webkit-animation-timing-function: linear;
    -webkit-animation-delay: 0s;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-direction: alternate;
    -webkit-animation-play-state: running;
  }

  @keyframes alert-top {
    from { border-top-color: rgba(255, 0, 0, 0.5); }
    to { border-top-color: transparent; }
  }

  @keyframes alert-right {
    from { border-right-color: rgba(255, 0, 0, 0.5); }
    to { border-right-color: transparent; }
  }

  @keyframes alert-left {
    from { border-left-color: rgba(255, 0, 0, 0.5); }
    to { border-left-color: transparent; }
  }

  @keyframes alert-bottom {
    from { border-bottom-color: rgba(255, 0, 0, 0.5); }
    to { border-bottom-color: transparent; }
  }

  .border-top {
    left: 0;
    top: 0;
    width: 100%;
    height: 0;
    border-top: 20px solid rgba(255, 0, 0, 0.5);
    border-bottom: 20px solid transparent;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;

    animation-name: alert-top;
    -webkit-animation-name: alert-top;
  }

  .border-left {
    left: 0;
    top: 0;
    width: 0;
    height: 100%;
    border-top: 20px solid transparent;
    border-bottom: 20px solid transparent;
    border-left: 20px solid rgba(255, 0, 0, 0.5);
    border-right: 20px solid transparent;

    animation-name: alert-left;
    -webkit-animation-name: alert-left;
  }

  .border-right {
    right: 0;
    top: 0;
    width: 0;
    height: 100%;
    border-top: 20px solid transparent;
    border-bottom: 20px solid transparent;
    border-left: 20px solid transparent;
    border-right: 20px solid rgba(255, 0, 0, 0.5);

    animation-name: alert-right;
    -webkit-animation-name: alert-right;
  }

  .border-bottom {
    bottom: 0;
    width: 100%;
    height: 0;
    border-top: 20px solid transparent;
    border-bottom: 20px solid rgba(255, 0, 0, 0.5);
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;

    animation-name: alert-bottom;
    -webkit-animation-name: alert-bottom;
  }

  .avoid-modes {
    top: 142px !important;
  }

  .container {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
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

  .map-informationAbbr {
    position: absolute;
    left: 20px;
    top: 20px;
    z-index: 9999999;
    width: 0;
    // height: 100%;
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

  .map-informationAbbr.navigation-active {
    left: 416px;
  }

  .map-roam-toolbar {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 999;

    .map-roam-button {
      font-size: 24px;
      padding: 4px;
      display: inline-block;
      width: 32px;
      height: 32px;
      background: #081C31;
      border-radius: 4px;
    }
  }

  #stopList {
    .siteStyle {
      color: #4FACFF;
    }

    /*width: 240px;*/
    height: auto;
    background: #081C31;
    border-radius: 8px;
    text-align: center;
    margin: 0 auto;
    border: 2px solid #4FACFF;

    li {
      width: 100%;
      height: 35px;
      line-height: 35px;
      margin: 0 auto;
      padding: 0 10px;
      text-align: center;
      list-style: none;
      font-size: 16px;
      border-radius: 3px;
      cursor: pointer;
    }
  }

  .map-bubble {
    width: 310px;
    padding: 10px 15px;
    height: auto;
    position: absolute;
    background: rgba(17, 60, 105, 0.85);
    border-radius: 8px;
    z-index: 99999;
    font-size: 16px;
    font-family: AlibabaPuHuiTi-Regular, AlibabaPuHuiTi;
    font-weight: 400;
    color: #FFFFFF;
    display: block;

    .map-bubble-header {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      font-size: 18px;
      font-family: AlibabaSans-Heavy, AlibabaSans;
      font-weight: 800;
      color: #FFFFFF;
      line-height: 28px;
    }

    .map-bubble-content {

      .map-bubble-info {
        width: 100%;
        height: 34px;
        background: rgba(79, 172, 255, 0.4);
        border-radius: 4px;
        padding: 9px 10px;
        font-size: 16px;
        font-family: AlibabaPuHuiTi-Regular, AlibabaPuHuiTi;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 16px;
      }

    }
  }

  .el-tree.custom {
    /* background: #081C31; */
    background: #124375;
    color: #fff;
  }

  .routeName {
    width: 208px;
    margin: 0 auto;
    font-size: 16px;
  }

  .routeMap {
    width: 208px;
    height: 122px;
    margin: 0 auto;
    background: #081C31;
    border-radius: 6px;
    border: 1px solid #4FACFF;
  }

  .searchfilterList {
    width: 100%;
    height: auto;
    max-height: 300px;
    overflow-y: auto;
    background: rgba(108, 180, 255, 0.2);
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

  .map-minimap {
    position: absolute;
    right: 20px;
    bottom: 20px;
    z-index: 99999;
    background: #081C31;
    border-radius: 8px;
    border: 2px solid #4FACFF;
  }

  .map-measure {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 308px;
    height: 77px;
    padding: 0 10px;
    left: calc((100% - 308px) / 2);
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

  .map-navigation {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 99999;
    height: 100%;
    background: #124375;
    width: 399px;
    min-width: 200px;
    overflow-y: auto;

    .searchCatalogue {
      position: relative;
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

  .map-cam-mode {
    position: absolute;
    border-radius: 4px;
    right: 20px;
    padding: 20px;
    top: 20px;
    z-index: 99999;
    background: #134375;

    .el-radio__label {
      color: white;
    }
  }

  .map-roam {
    position: absolute;
    left: 546px;
    top: -35px;
    z-index: 9999999;
    height: auto;
    background: #357FC3;
    width: 248px;
    margin: 0 auto;
    min-width: 200px;

    ul li {
      cursor: pointer;
      list-style: none;

      span {
        text-align: start;
        display: block;
        margin: 10px 15px 5px 20px;
      }

    }
  }
</style>
<style lang="scss" scoped>
  .loading-indicator {
    position: absolute;
    z-index: 9999999;
    width: 100%;
    height: 100%;
  }
</style>
