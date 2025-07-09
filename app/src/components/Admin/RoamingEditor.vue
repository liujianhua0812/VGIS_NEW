<template>
  <div class="roamingSet">
    <div class="leftSet">
      <div class="setTitle">
        <el-button class="p-0 backBtn" icon="el-icon-back" type="text" @click="toList"></el-button>
        <el-input placeholder="Input name" class="newRoamName" v-model="newRoamName"></el-input>
        <img src="../../assets/images/roaming/came.png" @click="saveRoamingPath" alt="">
<!--        <img src="../../assets/images/roaming/down.png" @click="downloadRoamingPath" alt="">-->
      </div>
      <div class="mapInfo">
        <canvas ref="container" class="mapContainer"></canvas>
        <div class="regionList" id="regionLists">
          <div class="searchMenuList" ref="searchMenuList">
            <div class="searchCatalogue">
              <div class="searchCatalogueList">
                <!-- node-key="name" -->
                <el-tree :data="hierarchyTreeData" accordion :props="defaultProps" node-key="tag"
                         :default-expanded-keys="['Majnoon Oilfield']" ref="multipleTable">
                  <template v-slot:default="{ node, data }">
                    <div :class="{treeDataList:data.poi,treeDataListItem:data.children}">
                      <span class="treeText" @click="searchMap(node.data)" :title="node.label">{{node.label}}</span>
                    </div>
                  </template>
                </el-tree>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rightSet">
      <div class="rightSetDetail">
        <div style="display: flex;" class="setCont">
          <h1 style="width: 50%;">{{$t("label.roaming.preview")}}</h1>
          <div style="width: 50%;text-align: right;line-height: 30px;">
            <el-select v-model="speedFactor" placeholder="Select factor" size="small" @change="changeRoamingSpeed">
              <el-option v-for="item in speedList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
<!--        <div class="setCont">-->
<!--          <div class="block" v-if="this.route.stops.length > 0" style="margin: 0 5px;">-->
<!--            <el-slider :marks="progressMarks" v-model="currentProgress" :show-tooltip="false" :max="maxSlideValue"></el-slider>-->
<!--            <span class="rangeSlideTime">{{formatDuration(currentDuration)}}</span>-->
<!--            <span class="rangeSlideTime">{{formatDuration(overallDuration)}}</span>-->
<!--          </div>-->
<!--          <div class="block" v-else>-->
<!--            <el-slider :marks="progressMarks" v-model="currentProgress" :show-tooltip="false" :max="maxSlideValue" disabled></el-slider>-->
<!--          </div>-->
<!--        </div>-->
        <div class="playRoam setCont">
          <img src="../../assets/images/roaming/stop.svg" @click="quitRoaming" alt="">
          <img v-if="roamingStatus === 'roaming'" src="../../assets/images/roaming/pause.svg" @click="pauseRoaming" alt="">
          <img v-else src="../../assets/images/roaming/play.svg" @click="startRoaming" alt="">
          <img src="../../assets/images/roaming/fast.svg" @click="accelerateRoaming" alt="">
        </div>
        <h1 class="setCont">{{$t("label.roaming.loop")}}
          <el-switch @change="updateLooping" :disabled="roamingStatus !== 'stopped'" v-model="flycircle" active-color="#4FACFF" inactive-color="#EAEAEA" style="margin-left: 27px;"></el-switch>
        </h1>
        <div v-if="roamingStatus === 'stopped'" class="setCont" style="display: flex;">
          <h1 style="width: 50%;margin-bottom: 5px;">{{$t("model.roaming.stops")}}</h1>
          <div style="width: 50%;text-align: right;">
            <img title="Save New Stop" src="../../assets/images/roaming/camera.png" @click="saveNewStop" alt="Save New Stop">
            <img title="Delete Stop" src="../../assets/images/roaming/delAll.png" @click="bulkDeleteStop" alt="Delete Stop">
          </div>
        </div>
        <ul class="roamList setCont" v-if="route.stops.length > 0" :key="listKey">
          <draggable v-model="route.stops" chosenClass="chosen" forceFallback="true" group="people" animation="1000" @start="dragOnStart" @end="dragOnEnd">
            <transition-group>
              <div class="flex align-items-center p-l-15 p-r-15" v-for="(item,index) in route.stops" :key="item.id">
                <el-checkbox v-model="item.checked" :key="index" true-label="index" false-label="-1"></el-checkbox>
                <img src="../../assets/images/roaming/relation.png" v-if="item.hasRelation" alt="" class="relationImg">
                <div style="flex-grow: 1;" :class="['setNameCont', { emphasized: lastStopIndex === index }]">
                  <div v-if="currentStopIndex === index" class="editRoamName" @click="flyTo(item, index)">
                    <b>{{item.hasRelation ? item.equipTag : item.name}}</b>
                  </div>
                  <div v-else class="editRoamName" @click="flyTo(item, index)">
                    {{item.hasRelation ? item.equipTag : item.name}}
                  </div>
                </div>
                <div v-if="roamingStatus === 'stopped'">
                  <img title="Override Selected Stop's Position" src="../../assets/images/roaming/reset.png" @click="updateStop(index, item, true)" alt="Override Current Stop">
                  <img src="../../assets/images/roaming/Edit.png" @click="editStop(item)" alt="">
                  <img src="../../assets/images/roaming/del.png" alt="" @click="deleteStop(index)">
                </div>
              </div>
            </transition-group>
          </draggable>
        </ul>
        <div class="addTips setCont" v-html="$t('message.roaming.noStop', { button: `<img src='${CameraIcon}'>` })" v-else></div>
      </div>
    </div>
    <edit-stop v-if="dialogVisibility.editStop" :dialog-visibility="dialogVisibility.editStop" :stop="editStopData" dialog-id="editStop" @action-finished="actionFinished"></edit-stop>
  </div>
</template>
<script>

  import CameraIcon from "../../assets/images/roaming/camera.png"
  import draggable from 'vuedraggable'
  import config from "@/config";
  import {getHierarchy} from "../../assets/js/api/data";
  import {addRoute, getRoute, updateRoute} from "../../assets/js/api/roaming";
  import {getNodeDetail} from "../../assets/js/api/hierarchy";
  import FlyManager from "../../utils/BetterFlyManager";
  import EditStop from "./Roaming/EditStop";
  import {
    Color3,
    Engine,
    FreeCamera,
    HemisphericLight,
    HighlightLayer, MeshBuilder,
    Scene,
    SceneLoader, StandardMaterial,
    Vector3
  } from "@babylonjs/core";
  import "@babylonjs/loaders/glTF"

  export default {
    name: "RoamingDetail",
    props: {
      mapInfo: Object,
      mapName: String,
    },
    components: {
      draggable,
      EditStop
    },
    data() {
      return {
        CameraIcon,
        dialogVisibility: {
          editStop: false
        },
        source: `${config.backend.host}models/`,
        editStopData: {},
        listKey: Math.random() + "", //多选删除需要加的key
        currentName: '',
        getHierarchyList: [],//层级树å
        currentPOI: '',
        checkList: [],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        speedList: [
          {
            value: 1,
            label: '1x'
          },
          {
            value: 1.5,
            label: '1.5x'
          }, {
            value: 2,
            label: '2x'
          }, {
            value: 2.5,
            label: '2.5x'
          }, {
            value: 4,
            label: '4x'
          }
        ],
        speedFactor: 1,
        currentStopIndex: -1,
        route: {
          stops: [],
          settings: [],
          parsedRoute: {}
        },
        newRoamName: '',
        diaTitle: 'Stop',
        // value1: true,
        flycircle: false,
        checked: false, //Point setting
        nameDisabled: true,
        editDialogVisible: false,
        isAddRoute: false,//是否为新添加路线
        selectedOptions: [],
        value: '',
        currentDuration: 0,
        currentProgress: 0,
        stopInfoForm: {
          id: '',
          altitude: 0,
          heading: 0,
          latitude: 0,
          longitude: 0,
          tilt: 0,
          turnTime: 0,
          pauseTime: 0,
          hasRelation: false,
          equipTag: '',
          equipName: '',
          name: ''
        },
        isSelectRoam: true,
        isShowRoamBg: true,
        roamList: [
          {
            routestop: "stop"
          }
        ],
        roamListAll: [],
        roamCameraInfo: [],//坐标信息
        xmlFile: '',
        relationName: '',
        editRelationName: '', //
        updateDataObj: { //路线列表根据key取name
          key: '',
          value: '',
        },
        //飞行
        roamingStatus: "stopped",//飞行
        countDown: '',
        interval: 5,
        active: '',
        defaultOption: {
          turnTime: 3,
          pauseTime: 5,
          playRate: 1,
          loop: false,
          vnode: this
        },
        isRoaming: false,
        timeoutId: '',
        isPause: false,//是否为继续飞行
        newSite: '',
        isNewRoute: false,
        rangeSlideValue: 0,
        maxSlideValue: 1,
        routeStopTime: '',//停留时间
        setSpeedValue: 1,
        EARTH_RADIUS: 6378137.0,//计算距离
        latList: [],
        lonList: [],
        maxAllTime: 0,//进度条最大值
        roamingStops: [],//站点列表
        lastStopIndex: -1,
        lastStopArrivedAt: 0
      }
    },
    computed: {
      checkedNumber () {
        return this.route.stops.reduce((sum, stop) => sum + (stop.checked ? 1 : 0), 0)
      },
      overallDuration() {
        return this.route.stops.reduce((result, stop) => result + stop.turnTime + stop.pauseTime, 0)
      },
      progressMarks () {
        let duration = this.overallDuration
        let result = {}
        let time = 0
        for(let i = 0; i < this.roamList.length; i++) {
          result[time / duration] = i
          time += this.roamList[i].turnTime
          time += this.roamList[i].pauseTime
        }
        return result
      },
      hierarchyTreeData() {
        var result = this.getHierarchyList;
        if (result && result.forEach) {
          result.forEach(item => {
            item.tag = item.name;
          });
        }
        return result;
      },
    },
    methods: {
      actionFinished (dialogId, stop, index) {
        this.dialogVisibility[dialogId] = false
        if (stop) {
          this.updateStop(stop.id, stop, false)
        }
      },
      formatDuration(duration) {
        let _duration = Math.floor(duration)
        let hour = Math.floor(_duration / 3600)
        let minute = Math.floor((_duration % 3600) / 60)
        let second = _duration % 60
        if (hour) {
          return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
        } else {
          return `${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
        }
      },
      calculateDistance(p1, p2) {
        let dalt = p1.altitude - p2.altitude
        let dlat = p1.latitude - p2.latitude
        let dlon = p1.longitude - p2.longitude
        return Math.sqrt(dalt * dalt + dlat * dlat, dlon * dlon)
      },
      getCurrentPreviewStatus() {
        let timeElapsed = 0
        for (let i = 0; i < this.lastStopIndex; i++) {
          let stop = this.roamList[i]
          timeElapsed += parseFloat(stop.pauseTime) + parseFloat(stop.turnTime)
        }
        // let lastStop = this.roamList[this.lastStopIndex]
        // let nextStop = this.roamList[this.lastStopIndex + 1]
        // if (this.lastStopIndex < this.roamList.length - 1) {
        //   let currentPosition = this.getCameraPosition()
        //   currentPosition = {
        //     latitude: currentPosition.lat,
        //     longitude: currentPosition.lon,
        //     altitude: currentPosition.alt,
        //   }
        //   timeElapsed += nextStop.turnTime * this.calculateDistance(currentPosition, lastStop) / this.calculateDistance(nextStop, lastStop)
        //   if (this.lastStopArrivedAt) {
        //     timeElapsed += (new Date() - this.lastStopArrivedAt) / 1000
        //   }
        // }
        // console.log(timeElapsed)
        this.currentDuration = timeElapsed
        this.currentProgress = timeElapsed / this.overallDuration
      },
      startRecordingTimeline() {
        this.loopId = setInterval(this.getCurrentPreviewStatus, 1000)
      },
      stopRecordingTimeline() {
        clearInterval(this.loopId)
      },
      startRoaming() {
        if (this.route.stops.length === 0) {
          return this.$message({
            message: this.$t("message.roaming.atLeastOne"),
            type: 'error',
            showClose: true,
            duration: 3000
          })
        }
        else if (this.flyManager.status === this.flyManager.STATUS_PAUSED) {
          this.roamingStatus = this.flyManager.resume()
        }
        else if (this.roamingStatus === this.flyManager.STATUS_STOPPED) {
          this.roamingStatus = this.flyManager.start()
        }
      },
      pauseRoaming() {
        this.roamingStatus = this.flyManager.pause()
      },
      quitRoaming() {
        this.roamingStatus = this.flyManager.quit()
      },
      accelerateRoaming () {
        let accelerated = false
        for(let i = 0; i < this.speedList.length; i++) {
          if (this.speedList[i].value > this.speedFactor) {
            accelerated = true
            if (this.flyManager) {
              this.speedFactor = this.speedList[i].value
            }
          }
        }
        this.flyManager.playRate = this.speedFactor
        if (!accelerated) {
          this.$message({
            type: 'error',
            showClose: true,
            duration: 3000,
            message: this.$t("message.roaming.maxSpeed")
          })
        }
      },
      // 路线列表拖拽
      dragOnStart() {
        this.drag = true;
      },
      dragOnEnd() {
        this.drag = false;
      },
      getRouteInfo() {
        let that = this
        if (this.$route.params.routeId) {
          getRoute(this.$route.params.routeId).then(result => {
            this.route = result.data
            this.newRoamName = this.route.name
            this.flycircle = this.route.config.loop
            this.flyManager = new FlyManager(this.scene, this.route.config, this)
            this.flyManager.loadRoute(this.route)
            this.flyManager.addEventListener("quit", function () {
              that.roamingStatus = that.flyManager.STATUS_STOPPED
              that.currentStopIndex = -1
              that.$message({
                message: that.$t("message.roaming.finished"),
                type: "success",
                showClose: true,
                duration: 3000
              })
            })
            this.flyManager.addEventListener("stopArrived", function (stopIndex) {
              that.currentStopIndex = stopIndex
            })
          })
        }
        else {
          this.flyManager = new FlyManager(this.scene, this.defaultOption, this)
          this.flyManager.addEventListener("quit", function () {
            that.roamingStatus = that.flyManager.STATUS_STOPPED
            that.currentStopIndex = -1
            that.$message({
              message: that.$t("message.roaming.finished"),
              type: "success",
              showClose: true,
              duration: 3000
            })
          })
          this.flyManager.addEventListener("stopArrived", function (stopIndex) {
            that.currentStopIndex = stopIndex
          })
          this.route.stops = this.flyManager.stops
        }
      },
      loadScene () {
        this.roamList = [] //清空数组
        this.newRoamName = this.$route.query.routeName;
        this.loadingMessage = this.$t("message.gis.loadingScene")
        let that = this
        const canvas = this.$refs.container
        const engine = new Engine(canvas, true, { stencil: true });
        const scene = new Scene(engine);
        scene.clearColor = Color3.White()

        let camera = new FreeCamera("camera1", new Vector3(0, 1, 0), scene);
        camera.setTarget(new Vector3(0, 0, 0))
        camera.attachControl(canvas, true);

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

        SceneLoader.ImportMesh(null, this.source, "scene.gltf", scene, (meshes, particleSystems, skeletons) => {
          that.meshes = meshes
          that.loadEnvironment()
          that.getRouteInfo()
          that.loadingMessage = ""
        })
      },
      resetCamera () {
        let { min, max } = this.scene.getWorldExtends()
        let camera = this.scene.activeCamera
        let zoomScale = 0.8
        camera.position = new Vector3(
            max.x + (max.x - min.x) * zoomScale,
            // (max.x + min.x) / 2,
            max.y + (max.y - min.y) * zoomScale,
            // (max.y + min.y) / 2,
            max.z + (max.z - min.z) * zoomScale,
            // (max.z + min.z) / 2,
        )
        camera.setTarget(Vector3.Center(min, max));
      },
      loadEnvironment () {
        let scene = this.scene
        let camera = this.scene.activeCamera
        let { min, max } = scene.getWorldExtends()
        this.resetCamera()
        const ground = MeshBuilder.CreatePlane("ground", { size: 2000 }, scene);
        let material = new StandardMaterial("box-material", scene);
        material.diffuseColor = Color3.FromHexString("#CCCCCC");
        ground.material = material;
        ground.position = new Vector3(0, min.y, 0)
        ground.rotate(new Vector3(1, 0, 0), Math.PI / 2)
        ground.receiveShadows = true
        ground.isPickable = false
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
        boundingSphere.isPickable = false
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
        camera.checkCollisions = true

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
      searchMap(poi) {
        if (!poi.poi) return
        getNodeDetail(poi.tag).then(result => {
          this.currentPOI = {
            tag: result.data.instanceId,
            type: result.data.model.name,
            name: result.data.name,
            sourceId: null,
            modelSource: null,
            position: [0, 0, 0]
          }
          if (result.data.threeDViewPoint && Object.keys(result.data.threeDViewPoint).length > 0) {
            this.setViewPoint(result.data.threeDViewPoint)
          }
        })
      },
      setViewPoint(viewPoint) {
        let cam = this.scene.activeCamera
        cam.position = new Vector3(viewPoint.pos.x, viewPoint.pos.y, viewPoint.pos.z)
        cam.rotation = new Vector3(viewPoint.rot.x, viewPoint.rot.y, viewPoint.rot.z)
      },
      //右侧列表点击，飞向目标地点
      flyTo(stop, index) {
        if (this.roamingStatus !== this.flyManager.STATUS_STOPPED) {
          this.flyManager.inspect(index)
        }
        else {
          this.flyManager.flyTo(index)
        }
      },
      //获取接口列表信息
      getHierarchy() {
        getHierarchy().then(data => {
          data = data || {};
          this.getHierarchyList = data.data || [];
        })
      },
      toList() {
        this.$router.replace({name: 'RoamingList'})
      },
      // 保存新站点
      saveNewStop() {
        this.route.stops = this.flyManager.saveStop()
      },
      // 覆写现有站点
      updateStop (index, data, updateLocation = false) {
        this.flyManager.saveStop(index, data, updateLocation)
        this.$message({
          message: this.$t("message.roaming.updated"),
          type: 'success',
          showClose: true,
          duration: 3000
        })
      },
      //保存/更新飞行路径信息
      saveRoamingPath() {
        if (this.route.stops.length === 0) {
          this.$message({
            message: this.$t("message.roaming.atLeastOne"),
            type: 'error',
            showClose: true,
            duration: 3000
          })
          return
        }
        let data = this.flyManager.saveRoute()
        let file = new File([data], 'RoamingPath.fpf', {type: 'text/xml'})
        let formData = new FormData();
        if (this.$route.params.routeId) {
          formData.append('routeId', this.$route.params.routeId)
          formData.append('name', this.newRoamName)
          formData.append('route', file)
          updateRoute(this.$route.params.routeId, formData).then(result => {
            this.$message({
              type: 'success',
              message: this.$t("message.roaming.updated")
            });
            this.getRouteInfo()
          })
        } else {
          formData.append('name', this.newRoamName)
          formData.append('route', file)
          addRoute(formData).then(result => {
            this.$message({
              type: 'success',
              message: this.$t("message.roaming.updated")
            });
            this.getRouteInfo()
          })
        }
      },
      editStop(item) {
        this.dialogVisibility.editStop = true
        this.editStopData = item
      },
      deleteStop(index) {
        this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
          confirmButtonText: this.$t("action.confirm"),
          cancelButtonText: this.$t("action.cancel"),
          type: 'warning'
        }).then(() => {
          this.route.stops = this.flyManager.deleteStop(index)
          this.$message({
            type: 'success',
            message: this.$t("message.roaming.stopDeleted")
          });
          this.listKey = Math.random() + "";
        }).catch(() => {});
      },
      //批量删除
      bulkDeleteStop () {
        this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
          confirmButtonText: this.$t("action.confirm"),
          cancelButtonText: this.$t("action.cancel"),
          type: 'warning'
        }).then(() => {
          let indexes = this.route.stops.filter(item => item.checked).map(item => item.id)
          this.route.stops = this.flyManager.deleteStop(indexes)
          this.$message({
            type: 'success',
            message: this.$t("message.roaming.stopDeleted")
          });
          this.listKey = Math.random() + "";
        }).catch(() => {});
      },
      changeRoamingSpeed(val) {
        this.flyManager.config.playRate = val
      },
      updateLooping (val) {
        this.flyManager.config.loop = val
      },
      queryError(e) {
        console.log(e);
      },
    },
    created() {
      this.getHierarchy()
    },
    mounted() {
      this.loadScene()
      this.addEventListeners()
    },
    beforeDestroy() {
      this.removeEventListeners()
      this.flyManager.destroy()
    }
  }
</script>

<style scoped>
  .setTitle {
    height: 55px;
    background: #fff;
    margin-top: 2px;
    line-height: 55px;
  }

  .setTitle img {
    margin-left: 15px;
    cursor: pointer;
  }

  .newRoamName {
    width: 231px;
    height: 37px;
    background: #FFFFFF;
    border-radius: 4px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #2F2F2F;
    /* border: 1px solid #D9D9D9; */
  }

  .backBtn {
    margin: 0px 10px;
  }

  /* region */
  .mapInfo {
    position: relative;
    height: calc(100% - 55px);
  }

  .mapContainer {
    height: 100%;
    width:100%;
  }


  .regionList {
    position: absolute;
    left: 20px;
    top: 20px;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;
    height: auto;
    width: 323px;
    /* display: flex; */
    justify-content: space-between
  }

  .searchCatalogue {
    height: 475px;
    overflow-y: auto;
  }

  .searchCatalogueList {
    margin-top: 15px;
  }

  div.threeDMap .el-tree {
    color: #FFF;
    background-color: rgba(0, 0, 0, 0.1);
    margin: 0;
  }

  .audioBtn {
    width: 250px;
    margin-left: 15px;
    margin-bottom: 10px;
  }

  .treeText {
    width: 200px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 26px;
    line-height: 28px;
    /* color: #fff; */
  }

  .el-tree-node__content:hover {
    background: rgba(108, 180, 255, 0.2) !important;
    /* background: rgba(108, 180, 255, 0.2); */
    /* background: #000; */
  }

  div.el-collapse-item__content {
    padding-bottom: 0px !important;
    background: rgba(0, 0, 0, 0) !important;
  }


  .el-tree-node:focus > .el-tree-node__content {
    background: rgba(108, 180, 255, 0.2) !important;
    /* background: #000; */
  }

  .rightSetDetail .el-select {
    width: 60px;
  }


  .treeDataListItem {
    width: 100%;
    text-align: left;
    color: #4FACFF;
    position: relative;
    /* line-height: 10px; */
    height: 26px;
  }

  .treeDataList {
    width: 100%;
    text-align: left;
    margin-right: 10px;
    height: 30px;
    line-height: 30px;
  }

  .treeDataList {
    margin-right: 5px;
    background: url(../../assets/images/mapDefault.svg) no-repeat right center;
  }

  .treeDataList:hover {
    margin-right: 5px;
    background: url(../../assets/images/mapActive.svg) no-repeat right center;
  }

  .leftSet {
    position: absolute;
    right: 325px;
    top: 2px;
    left: 0px;
    height: 100%;
  }

  .rightSet {
    position: absolute;
    right: 0px;
    top: 2px;
    width: 323px;
    height: 100%;
    color: #4facff;
    background: #FFFFFF;
  }

  .rightSetDetail {
    margin: 15px 0px;
  }

  .setCont {
    margin: 0 15px;
  }

  .rangeSlideTime {
    display: inline-block;
    width: 49%;
    font-size: 16px;
  }

  .rangeSlideTime:last-child {
    text-align: right;
  }

  .roamList {
    margin: 0px;
  }

  /* .rightSetDetail {
      margin: 0 15px;
  } */

  .rightSetDetail img {
    cursor: pointer;
  }

  .rightSet h1 {
    font-size: 16px;
    font-family: HarmonyOS_Sans_Black;
    color: #2F2F2F;
    line-height: 23px;
    font-weight: 700;
    margin-bottom: 15px;
  }

  .roamList li {
    list-style: none;
    height: 30px;
    line-height: 30px;
    display: flex;
    padding: 0 15px;
  }

  /* .roamList li:hover {
      background: rgba(79, 172, 255, 0.1);
  } */

  .editRoamBg {
    position: absolute;
    left: 0;
    top: 0;
    width: 216px;
    height: 35px;
    z-index: 99;
    background: rgba(0, 0, 0, 0);
  }

  .editRoamName {
    cursor: pointer;
    margin-left: 5px;
    z-index: 9;
    background: rgba(0, 0, 0, 0);
  }

  .setNameCont:hover {
    /* background: rgba(79, 172, 255, 0.1); */
  }

  .sec {
    position: absolute;
    right: 15px;
    bottom: 6px;
    font-size: 16px;
    font-family: Boston-SemiBold, Boston;
    font-weight: normal;
    color: #999999;
    line-height: 21px;
  }

  .locaTitle {
    font-size: 14px;
    font-family: HarmonyOS_Sans_Medium;
    color: #333333;
    line-height: 19px;
    font-weight: 500;
  }

  .playRoam {
    display: flex;
    /* margin-left: 37px; */
    margin: 13px 0px 25px 37px;
  }

  .playRoam img {
    /* width: 33%;
    text-align: center; */
    margin: 5px 30px;
    width: 28px;
    height: 28px;
  }

  .addTips {
    font-size: 16px;
    font-family: HarmonyOS_Sans_Medium;
    color: #DDDDDD;
    margin-top: 100px;
    text-align: center;
  }

  .relationImg {
    width: 12px;
    height: 12px;
    margin: 0 10px 0 10px;
  }
</style>
<style scoped>
  .roamingSet .el-icon-back:before {
    color: #808080;
    font-size: 24px;
  }

  .roamingSet .el-checkbox {
    width: 14px;
  }

  .editRoamName .el-input__inner {
    border: none;
    height: 30px;
    font-size: 16px;
    background: #fff !important;
    color: #606266 !important;
  }

  .newRoamName .el-input__inner {
    height: 37px;
    line-height: 37px;
    background: #fff !important;
    border: 1px solid #DCDFE6 !important;
    color: #606266 !important;
    width: 100% !important;
  }

  .addDialog .el-dialog__body {
    padding: 0px 20px;
  }

  .addDialog .el-dialog__title {
    font-size: 24px;
    font-family: HarmonyOS_Sans_Bold;
    color: #4FACFF;
    /* line-height: 34px; */
  }

  .addDialog .el-input__inner {
    width: 351px !important;
    height: 35px;
    border-radius: 4px;
  }

  .el-input.is-disabled .el-input__inner {
    background-color: #F5F7FA !important;
    border-color: #E4E7ED !important;
    color: #C0C4CC !important;
  }

  .rightSetDetail .el-input--suffix .el-input__inner {
    padding: 0 0 0 5px;
    width: 65px !important;
    background: #fff !important;
    border: 1px solid #DCDFE6 !important;
    color: #606266 !important;
  }

  .rightSetDetail.el-input__inner {
    padding: 0px 0px 0px 5px !important;

  }

  .rightSetDetail.el-select-dropdown__list {
    padding: 0px;
  }

  .rightSetDetail.el-select-dropdown {
    background: #fff !important;
    color: #606266 !important;
    height: auto !important;
  }

  .roamingSet :deep(.el-select-dropdown__item span) {
    color: #606266 !important;
  }

  .rightSetDetail.el-select-dropdown__item.hover {
    color: #606266 !important;
  }

  .addDialog .el-dialog__footer {
    text-align: center;
  }

  .addDialog .el-button--primary {
    width: 197px;
    height: 40px;
    background: #4FACFF;
    border-radius: 4px;
    font-size: 16px;
    font-family: HarmonyOS_Sans_Medium;
    color: #FFFFFF;
  }

  .addDialog .el-checkbox__label {
    font-size: 14px;
    font-family: HarmonyOS_Sans_Medium;
    color: #B0B0B0;
  }

  .addDialog .el-dialog__headerbtn .el-dialog__close {
    color: #B33737;
    font-size: 20px
  }

  .addDialog .el-form-item {
    margin-bottom: 0px;
  }

  .addDialog .el-form-item__label {
    font-size: 16px;
    font-family: HarmonyOS_Sans_Black;
    color: #333333;
    line-height: 23px;
    font-weight: 700;
    margin: 25px 0 5px 0;
    text-align: left;
  }

  .roamingSet .el-collapse-item__header {
    background: rgba(51, 51, 51, 0.7);
    font-size: 16px;
    font-family: HarmonyOS_Sans_Bold;
    color: #4FACFF;
    line-height: 23px;
  }

  .roamingSet .el-collapse-item__wrap {
    background: rgba(51, 51, 51, 0.7);
    border: none;
  }

  .roamingSet .el-collapse-item__content,
  .roamingSet .el-tree {
    background: rgba(0, 0, 0, 0);
  }

  .roamingSet .el-tree-node:focus > .el-tree-node__content {
    background: rgba(255, 255, 255, 0.2) !important;
    /* margin: 20px 20px 0; */
    /* background: #000; */
  }

  .roamingSet .el-tree-node__content {
    margin: 5px 10px 0;
  }

  .roamingSet .el-tree-node > .el-tree-node__children {
    padding-bottom: 10px;
  }

  .roamingSet .el-tree {
    color: #fff;
  }

  .roamingSet .el-tree-node__content:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .roamingSet .el-collapse {
    border: none;
  }

  .roamingSet .el-tree-node__content > .el-tree-node__expand-icon {
    /* color: #93aec5; */
    padding: 0 6px;
  }

  .emphasized {
    font-weight: bold !important;
    color: #B33737 !important;
  }
</style>
