<template>
  <div id="app">
    <vue-headful :title="`${title}`"/>
    <div class="grid">
      <div class="grid-header" v-show="!fullScreen">
        <div class="grid-container">
          <router-link to="/">
            <img class="m-l-20" :src="MajnoonLogo" alt=""/>
            <span class="m-l-10 grid-title">Majnoon Oil Field Map System</span>
          </router-link>
          <select class="vgis-header-switcher m-l-40" @change="switchPage" v-model="page">
            <option v-auth="{ resources: _page.privilege }" v-for="_page in pages" :key="_page.value" :value="_page.value">{{_page.name}}</option>
          </select>
        </div>
        <div class="grid-container">
          <input class="map-searchbar" v-model="query" placeholder="Input your query here.">
          <div class="map-searchbar-autocomplete" v-if="query && searchResult.length > 0">
            <div class="map-search-item" :key="index" v-for="(item, index) in searchResult" @click="searchMap(item[0])">
              <b>{{item[0].name}}</b>
              {{item.length > 1 ? ' / ' : ''}}
              {{item.length > 1 ? item[1].name : ''}}
            </div>
          </div>
<!--          </input>-->
          <div :class="['mode-switcher', 'm-l-10', { active: isActive }]" v-show="currentMap.mode === '3D'">
            <span class="iconfont icon-map-tool" @click="toggleActive"></span>
          </div>
          <el-divider direction="vertical"></el-divider>
          <div :class="['mode-switcher', 'm-l-10 m-r-20']"
               @click="launchFullscreen">
            <i class="iconfont icon-full-screen"></i>
          </div>
        </div>
      </div>
      <div class="grid-content">

        <div class="grid-panel">
            <aside v-show="!fullScreen" :class="['grid-menu', { active: menuExpanded }]">
                <div class="grid-menu-content">
                  <div class="grid-menu-body">
                    <div :class="currentMap.showNavigation ? 'customStyles' : 'grid-menu-item'" @click="toggleNavigation">
                      <div>
                        <i class="iconfont icon-navigation grid-menu-item-icon"></i>
                        <span v-if="menuExpanded">Navigation</span>
                      </div>
                      <span v-if="menuExpanded" class="el-icon-caret-right pull-right"></span>
                    </div>
                    <div :class="isShowMap ? 'customStyles' : 'grid-menu-item'" v-if="currentMap.mode === '3D'" @click="toggleMap">
                      <div>
                        <i class="iconfont icon-map grid-menu-item-icon"></i>
                        <span v-if="menuExpanded">Map</span>
                      </div>
                    </div>
                    <div class="modelList" v-if="isShowMap && currentMap.mode === '3D'">
                      <dl v-for="(item,index) in modelList" :key="index" @click="selectModel(item,index)">
                        <dt>{{item.name}}</dt>
                        <dd><img :src="item.img"></dd>
                      </dl>
                    </div>
                    <div :class="currentMap.status === 'plot' ? 'customStyles' : 'grid-menu-item'" v-if="currentMap.mode === '2D'" @click="toggleStatus('plot')">
                      <div>
                        <i class="iconfont icon-mark grid-menu-item-icon"></i>
                        <span v-if="menuExpanded">Mark</span>
                      </div>
                    </div>
                    <div :class="currentMap.showLayers ? 'customStyles' : 'grid-menu-item'" v-if="currentMap.mode === '2D'" @click="toggleLayer">
                      <div>
                        <i class="iconfont icon-layers grid-menu-item-icon"></i>
                        <span v-if="menuExpanded">Layers</span>
                      </div>
                      <span v-if="menuExpanded" class="el-icon-caret-right pull-right"></span>
                    </div>
                    <div :class="currentMap.showMode ? 'customStyles' : 'grid-menu-item'" v-if="currentMap.mode === '3D'" @click="toggleMode">
                      <div>
                        <i class="iconfont icon-camera-view grid-menu-item-icon"></i>
                        <span v-if="menuExpanded">Camera View</span>
                      </div>
                    </div>
<!--                    <div :class="currentMap.status === 'measure' ? 'customStyles' : 'grid-menu-item'" @click="toggleStatus('measure')">-->
<!--                      <div>-->
<!--                        <i class="iconfont icon-measure grid-menu-item-icon"></i>-->
<!--                        <span v-if="menuExpanded">Measure</span>-->
<!--                      </div>-->
<!--                    </div>-->
                    <div :class="currentMap.showRoaming ? 'customStyles' : 'grid-menu-item'" v-if="currentMap.mode === '3D'" @click="toggleRoaming">
                      <div>
                        <i class="iconfont icon-roam grid-menu-item-icon"></i>
                        <span v-if="menuExpanded">Roam</span>
                      </div>
                    </div>
                    <div :class="activeStyle==='export' ? 'customStyles' : 'grid-menu-item'" @click="download">
                      <div>
                        <i class="iconfont icon-export-on-screen grid-menu-item-icon"></i>
                        <span v-if="menuExpanded">Export</span>
                      </div>
                    </div>
                    <div :class="currentMap.status === 'walking' ? 'customStyles' : 'grid-menu-item'" v-if="currentMap.mode === '3D'" @click="toggleStatus(currentMap.status === 'walking' ? 'default' : 'walking')">
                      <div>
                        <i class="iconfont icon-first-person-perspective grid-menu-item-icon"></i>
                        <span v-if="menuExpanded">Walk</span>
                      </div>
                    </div>
                  </div>
                </div>
            </aside>
            <div style="display:flex;padding-top:2px">
              <div class="grid-navigation">
                <div :class="['grid-navigation-item', { active: map.name === currentMap.name }]"
                      v-for="(map, index) in maps" :key="index" @click="switchMap(index)">
                  <span>{{map.name}}</span>
                  <span v-if="maps.length > 1" class="el-icon-close pull-right" style="width:20px" @click="closeMap(index)"></span>
                </div>
              </div>
              <div class="newMap" @click="newMap">
                  <i class="el-icon-plus"></i>
                  <span v-if="menuExpanded"></span>
              </div>
            </div>
              <div class="grid-map">
                <General3D
                  :query="query"
                  :class="['map-container', {active: currentMap.name === map.name && map.mode === '3D'}]"
                  v-for="(map,index) in maps"
                  :key="`${index}-3D`"
                  v-show="currentMap.name === map.name && currentMap.mode === '3D'"
                  :ref="`${map.name}-3D`"
                  map-name="Majnoon"
                  :map-info="map"
                  :isContActive="isActive"
                  :propsName="propsName"
                  @changeSelectValue="actionFinished"
                  :show-navigation="map.showNavigation"
                  :show-roaming="map.showRoaming"
                  :show-mode="map.showMode"
                  :position="map.position"
                  :map-position="map.mapPosition"
                  :status="map.status"
                  @status-reset="map.status = 'default'"
                  @close-state-toggler="closeAllToggler"
                  @query-result="updateQueryResult"
                  @pos-updated=""/>
              </div>
            </div>
      </div>
    </div>
    <el-dialog class="map-dialog" width="400px" :visible="dialogVisibility.addMap" title="New Map" :close-on-click-modal="false" @close="dialogVisibility.addMap = false">
      <el-form @submit.native.prevent>
        <el-form-item>
          <el-input placeholder="Please provide an unique name." v-model="form.addMap.name"></el-input>
        </el-form-item>
        <div class="p-b-20">
          <el-button size="mini" class="pull-right" @click="clearMapName">Cancel</el-button>
          <el-button size="mini" class="pull-right m-r-10" type="primary" @click="addMap(form.addMap.name)">Create</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>

  import ExpandIcon from "./Icons/ExpandIcon";
  import CollapseIcon from "./Icons/CollapseIcon";
  import MajnoonLogo from "@/assets/images/majnoon-logo-only.png"
  import config from "../config.js"
  import General3D from "./Maps/General3D"

  export default {
    name: 'Home',
    components: {
      General3D,
      ExpandIcon,
      CollapseIcon,
    },
    props: {
      dim: {
        type: String,
        default: "2D"
      }
    },
    computed: {
      currentMap() {
        return this.maps[this.currentMapIndex]
      },
      title () {
        return `VGIS - Map Tool`;
      }
    },
    watch: {
      position: {
        handler(newValue) {
          // console.log("Parent Position Change", newValue)
        },
        deep: true
      }
    },
    data() {
      return {
        MajnoonLogo,
        form: {
          addMap: {
            name: 'Default'
          }
        },
        activeStyle:"",
        propsName:{},
        fullScreen: false,
        isShowMap:false,
        query: '',
        searchResult: [],
        menuExpanded: true,
        mapPosition: {},
        // 若需要在2d内使用[投影转换]，那2d提交emit时，需要提交[投影转换(反向)]的值，和3d内的取赋值
        isChangeMap: true,
        mapCenter: {},
        getMap3DCenter: {},
        isshowTwod: true,
        isshowThreed: false,
        maps: [this.getDefaultMap("Default", true)],
        currentMapIndex: 0,
        isActive:true,    //maptool是否开启
        dialogVisibility: {
          addMap: false
        },
        modelList:[
          // {
          //   name:"Majnoon Oil field",
          //   img:require("../assets/images/all.png")
          // },
          // {
          //   name:"DS2",
          //   img:require("../assets/images/DS2model.png")
          // },
          // {
          //   name:"DS1",
          //   img:require("../assets/images/DS1model.png")
          // },
          {
            name:"CPF1",
            img:require("../assets/images/CPFmodel.png")
          },
          {
            name:"FCC",
            img:require("../assets/images/FCCmodel.jpg")
          },
          {
            name:"FCC-F2",
            img:require("../assets/images/FCCmodel.jpg")
          },
          {
            name:"FCC-F1",
            img:require("../assets/images/FCCmodel.jpg")
          },
          {
            name:"FCC-B1",
            img:require("../assets/images/FCCmodel.jpg")
          }
        ],
        page: 'ChangeMapHome',
        pages: [{
          name: 'Map Tool',
          value: 'ChangeMapHome',
          privilege: 'Map Tool'
        }, {
          name: 'Dashboard',
          value: 'Overview',
          privilege: 'Overview'
        }, {
          name: 'PC Dashboard',
          value: 'OverviewPC',
          module: 'pc',
          url: '/dashboard/pc',
          privilege: 'Overview PC'
        }],
      }
    },
    methods: {
      draw() {
          // widgets.alert.clearAlert();
          //先清除上次的显示结果
          vectorLayer.removeAllFeatures();
          markerLayer.clearMarkers();
          drawBounds.activate();
      },
      toggleActive(){
          this.isActive=!this.isActive

      },
      actionFinished(value){
          this.isActive=value
      },
      switchPage(theme) {
        if (this.page === 'Home') {
          this.$store.dispatch("getRoute",'Name');
        }else{
          this.$store.dispatch("getRoute",this.page);
        }
        let page = this.pages.filter(item => item.value === this.page)[0]
        if (page.url) {
          window.location.href = `${config[page.module].host}${page.url}`
        }
        else {
          this.$router.push({ name: page.value })
        }
      },
      newMap() {
        this.form.addMap.name = ''
        this.dialogVisibility.addMap = true
      },
      closeAllToggler () {
        this.maps[this.currentMapIndex].showNavigation = false
        this.maps[this.currentMapIndex].showMode = false
        this.maps[this.currentMapIndex].showRoaming = false
        this.maps[this.currentMapIndex].showLayers = false
      },
      toggleMap(){
          //点击导航栏map的执行事件
          this.activeStyle="map"
          this.isShowMap=!this.isShowMap
          this.maps[this.currentMapIndex].showNavigation = false
      },
      selectModel(item,index){
        //选择model的执行事件
        this.propsName=item
        this.isShowMap=!this.isShowMap
      },
      toggleStatus (status) {
        if(status==="plot"){
          this.activeStyle="mark"
          this.isShowMap=false
        }
        else if (status === 'walking') {
          this.activeStyle="walk"
          this.isShowMap=false
        }
        else{
          this.activeStyle="measure"
          this.isShowMap=false
        }
        if (this.maps[this.currentMapIndex].status !== status) {
          this.maps[this.currentMapIndex].status = status
        }
        else {
          this.maps[this.currentMapIndex].status = 'default'
        }
      },
      toggleLayer () {
        this.activeStyle="layers"
        this.maps[this.currentMapIndex].showNavigation = false
        this.maps[this.currentMapIndex].showLayers = !this.maps[this.currentMapIndex].showLayers
      },
      toggleNavigation () {
        this.activeStyle="navigation"
        this.maps[this.currentMapIndex].showLayers = false
        if (this.maps[this.currentMapIndex].mode === '3D') {
          this.maps[this.currentMapIndex].showRoaming = false
        }
        this.maps[this.currentMapIndex].showNavigation = !this.maps[this.currentMapIndex].showNavigation
        this.isShowMap = false
      },
      toggleRoaming () {
        this.activeStyle="roam"
        this.isShowMap=false
        this.maps[this.currentMapIndex].showNavigation = false
        this.maps[this.currentMapIndex].showRoaming = !this.maps[this.currentMapIndex].showRoaming
      },
      toggleMode () {
        this.activeStyle="cameraView"
        this.maps[this.currentMapIndex].showMode = !this.maps[this.currentMapIndex].showMode
      },
      getDefaultMap (name = "Default", active = false) {
        return {
          name,
          mode: this.dim || "2D",
          mapPosition: {},
          status: 'default',
          showLayers: false,
          showNavigation: false,
          showRoaming: false,
          showMode: false,
          active
        }
      },
      //清空地图名称关闭对话框
      clearMapName(){
        this.dialogVisibility.addMap = false;
        this.form.addMap.name=''
      },
      addMap(name) {
        if (this.maps.filter(item => item.name === name).length > 0) {
          this.$message({
            type: 'error',
            message: 'Duplicate map name, please specify an unique one!',
            showClose: true
          })
        } else {
          this.maps = this.maps.concat([this.getDefaultMap(name, true)])
          this.$message({
            type: 'success',
            message: 'Map added successfully.',
            showClose: true
          })
          this.currentMapIndex = this.maps.length - 1
          this.setActive(this.currentMapIndex)
          this.clearMapName()
        }

      },
      search () {
        this.query = this.queryCache
      },

      updateQueryResult (result) {
        this.searchResult = result.slice(0, 5)
      },
      setActive(index) {
        for(let i = 0; i < this.maps.length; i++) {
          this.maps[i].active = false
        }
        this.maps[index].active = true
      },
      switchMap(index) {
        this.currentMapIndex = index
        this.setActive(this.currentMapIndex)
      },
      switchCurrentMode(mode) {
        this.maps[this.currentMapIndex].mode = mode
      },
      toggleFullScreen (event) {
        this.fullScreen = !!document.fullscreenElement
      },
      launchFullscreen () {
        this.fullScreen = true
        let elem = this.$el
        if (elem.requestFullscreen) {
          elem.requestFullscreen()
        }
        else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen()
        }
        else if (elem.msRequestFullScreen) {
          elem.msRequestFullScreen()
        }
        else if (elem.webkitRequestFullScreen) {
          elem.webkitRequestFullScreen()
        }
      },
      closeMap(index) {
        this.$confirm("Action is not reversable, continue?").then(() => {
          this.maps = this.maps.slice(0, index).concat(this.maps.slice(index + 1))
          if (this.maps.length === 0) {
            this.maps = [this.getDefaultMap()]
            this.currentMapIndex = 0
          } else {
            if (this.currentMapIndex > index) {
              this.currentMapIndex -= 1
            } else if (this.currentMapIndex === index) {
              if (!this.currentMap) {
                this.currentMapIndex -= 1
              }
            }
          }
          this.setActive(this.currentMapIndex)
        }).catch(() => {
        })
      },
      searchMap (poi) {
        if (this.currentMap) {
          this.maps[this.currentMapIndex].status = 'default'
          this.$refs[`${this.currentMap.name}-${this.currentMap.mode}`][0].searchMap(poi);
        } else {
          this.$message({
            type: 'error',
            message: 'Please select a map first!',
            showClose: true
          })
        }
        this.query = ''
      },
      download() {
        if (this.currentMap) {
          this.$refs[`${this.currentMap.name}-${this.currentMap.mode}`][0].download();
        } else {
          this.$message({
            type: 'error',
            message: 'Please select a map first!',
            showClose: true
          })
        }
      },
      toggleCollapse () {
        this.menuExpanded = !this.menuExpanded
      },
      updatePosition(value, source, scale) {
        let currentMap = this.maps[this.currentMapIndex]
        // 以经纬度为主要判据，但也保留高度（3D）和缩放（2D）信息
        if (currentMap.position[0] !== value[0] || currentMap.position[1] !== value[1]) {
          if (value[2]) {
            currentMap.position = value
          }
          else if (currentMap.position[2]) {
            currentMap.position = [value[0], value[1], currentMap.position[2]]
          }
          else {
            currentMap.position = value
          }
        }
        else if (value[2]) {
          if (value[2] !== currentMap.position[2]) {
            currentMap.position = value
          }
        }
        if (source === '2D') {
          currentMap.scale = scale
        }
      },
      addEventListener () {
        document.addEventListener('fullscreenchange', this.toggleFullScreen)
      },
      removeEventListener () {
        document.removeEventListener('fullscreenchange', this.toggleFullScreen)
      }
    },
    mounted() {
      this.addEventListener()
    },
    beforeDestroy() {
      this.removeEventListener()
    }
  }
</script>

<style lang="scss" scoped>

  .vgis-header-switcher {
    width: 296px;
    height: 40px;
    background: #0a121e;
    border-radius: 8px;
    border: 2px solid #4FACFF;
    font-size: 22px;
    font-family: AlibabaSans-Medium, AlibabaSans;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 34px;
    padding: 0 20px;

    option {
      width: 296px;
      height: 40px;
      background: #0a121e;
      font-size: 22px;
      font-family: AlibabaSans-Medium, AlibabaSans;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 34px;
      padding: 0 20px;
    }
  }

</style>

<style lang="scss">
  .inode_bitMap{
    height: 34px;
    padding: 5px;
    border-radius: 4px;
    border: 1px solid white;

    span {
      font-size: 24px;
      line-height: 24px;
    }

  }

  .inode_bitMap.active {
    background: rgba(255, 255, 255, 0.3);
  }

  .ChangeMap {
    position: fixed;
    left: 20px;
    top: 23px;
    cursor: pointer;
    z-index: 99999;
    color: #fff;
    padding: 10px 20px;
    background: #0a121e;
    border-radius: 6px;
    border: 2px solid #4FACFF;
    font-size: 16px;
    font-family: AlibabaSans-Regular, AlibabaSans;
  }

  .grid {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .newMap{
    min-width: 33px;
    height: 34px;
    background: #20507E;
    text-align: center;
    line-height: 33px;
    font-size: 20px;
    margin: 0 1px 0 0;
    // margin-right: 4px;
    cursor: pointer;
    // position: absolute;
    // left: 0px;
    // top: 50px
  }
  .modelList{
    position: absolute;
    width: 232px;
    left: 170px;
    top: 50px;
    height: auto !important;
    background: #357FC3;
    box-shadow: 0px 0px 8px 0px #0C2947;
    border-radius: 6px;
    padding: 10px 16px;
    z-index: 9999999;
    dl{
      list-style: none;
      overflow: hidden;
      height: 143px;
      cursor: pointer;
      dd{
        width: 200px;
        height: 120px;
        padding-top: 5px;;
        img{
          width: 100%;
          height: 100%
        }
      }
      dt{
        width: 170px;
        height: 23px;
        font-size: 16px;
        font-family: HarmonyOS_Sans_Bold;
        color: #FFFFFF;
        line-height: 23px;
        text-shadow: 0px 0px 8px rgba(0, 0, 0, 0.6);
      }
    }
  }
   .el-input__inner::selection {
        color: #333;
        background:#409EFF
    }
  .grid-header {
    width: 100%;
    height: 60px;
    background: #0a121e;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .grid-container {
      display: flex;
      align-items: center;
    }

    img {
      width: 32px;
      height: 32px;
    }

    .grid-title {
      font-size: 24px;
      font-family: AlibabaSans-Medium, AlibabaSans;
      font-weight: 500;
      color: #E5E5E5;
      line-height: 38px;
    }

    input.map-searchbar {
      width: 400px;
      height: 36px;
      background: #113C69;
      font-size: 16px;
      font-family: AlibabaSans-Medium, AlibabaSans;
      font-weight: 500;
      color: #FFFFFF;
      padding-left: 20px;
      border: none;
      line-height: 25px;
      border-radius: 8px;
      position: relative;
    }

    input.map-searchbar::placeholder {
      font-size: 16px;
      color: #FFFFFF;
      font-family: AlibabaSans-Medium, AlibabaSans;
      font-weight: 500;
      line-height: 25px;
    }

    .map-searchbar-autocomplete {
      position: absolute;
      z-index: 9999999;
      width: 400px;
      top: 48px;
      background: #0a121e;
      border-radius: 8px;
      border: 1px solid #4FACFF;

      .map-search-item:first-child {
        border-radius: 8px 8px 0 0;
      }

      .map-search-item:last-child {
        border-radius: 0 0 8px 8px;
      }

      .map-search-item {
        height: 45px;
        padding: 0 20px;
        display: flex;
        align-items: center;
        cursor: pointer;
        background: #0a121e;
        color: #BBBBBB;

        b {
          height: 25px;
          font-size: 16px;
          font-family: AlibabaSans-Medium, AlibabaSans;
          font-weight: 500;
          color: #FFFFFF;
          line-height: 25px;
          margin-right: 10px;
        }
      }

      .map-search-item:hover {
        background: #134375;
      }

    }

    button.map-searchbar-actor {
      width: 117px;
      height: 36px;
      background: rgba(79, 172, 255, 0.6);
      border: none;
      border-radius: 0 4px 4px 0;
      padding: 0;

      span {
        font-size: 20px;
        font-family: AlibabaSans-Regular, AlibabaSans;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 36px;
      }
    }

    .mode-switcher {
      width: 32px;
      height: 32px;
      cursor: pointer;
      border-radius: 6px;
      border: 2px solid #CECECE;
      text-align: center;
      font-size: 16px;
      font-family: AlibabaSans-Medium, AlibabaSans;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 28px;
    }

    .mode-switcher.active {
      background: rgba(79, 172, 255, 0.6);
      border: 2px solid rgba(79, 172, 255, 0.6);
      color: #FFFFFF;
    }
  }
    .grid-content .grid-menu.active{
    display: flex !important;
    width: 100% !important;
    height: 48px !important;
    flex-direction: row;
    }
  .grid-content {
    flex-grow: 1;
    width: 100%;
    display: flex;
    flex-direction: row;
    position: relative;

    .grid-menu {
      display: inline-block;
      background: rgb(17, 60, 105);
      width: 64px;
      height: 100%;

      .grid-menu-content {
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;

        .grid-menu-body {
          flex-grow: 1;
          display: flex;
          flex-direction: row;
        }

        .grid-menu-footer {
          margin-bottom: 10px;
        }
        .customStyles{
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 40px;
          margin: 4px 0;
          // width: 100%;
          background: #357FC3;
          border-radius: 4px;
          padding: 0 10px;
          cursor: pointer;
          font-size: 16px;
          font-family: AlibabaSans-Regular, AlibabaSans !important;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 25px;

          .grid-menu-item-icon{
            font-size: 24px;
            line-height: 24px;
            color: #FFFFFF !important;
          }

          div {
            display: flex;
            align-items: center;
          }
        }
        .grid-menu-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 40px;
          // width: 100%;
          margin: 4px 0;
          padding: 0 10px;
          cursor: pointer;
          font-size: 16px;
          font-family: AlibabaSans-Regular, AlibabaSans !important;
          font-weight: 400;
          color: #CECECE;
          line-height: 25px;

          div {
            display: flex;
            align-items: center;
          }

        }
      }

    }

    .grid-menu.active {
      width: 222px;

      .grid-menu-item-icon {
        margin-right: 10px;
        font-size: 24px;
        line-height: 24px;
        fill: #FFFFFF;
      }
    }

    .grid-panel {
      margin-left: 2px;
      padding-top: 2px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      .grid-navigation {
        width:auto;
        height: 34px;
        display: flex;
        text-align: left;
        // overflow-x: scroll !important;
        background: #0C2947;
        overflow-y: hidden;
        white-space: nowrap;
        z-index: 999999;
        ::-webkit-scrollbar{
          // width:12px !important;
          // height: 1px;
          z-index: 999999;
          background: transparent !important;
          border-radius: 20%;
          }

        .grid-navigation-item {
          width: 200px;
          min-width: 40px;
          display: flex;
          cursor: pointer;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          background: rgba(79, 172, 255, 0.3);
          font-size: 16px;
          font-family: AlibabaSans-Medium, AlibabaSans;
          font-weight: 500;
          color: #B2B2B2;
          line-height: 33px;
          padding: 0 10px;
          margin-right: 2px;
          span{
            overflow:hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
            width:calc(100% - 40px)
          }
        }

        .grid-navigation-item.active {
          background: #357FC3;
          color: #EAEAEA;
        }
      }

      .grid-map {
        margin-top: 2px;
        width: calc(100% - 4px);
        flex-grow: 1;
        background: red;
        position: relative;
        // overflow-y: hidden;

        .map-container {
          width: 100%;
          height: 100%;
          position: absolute;
          z-index: -1;
          left: 0;
          top: 0;
        }

        .map-container.active {
          z-index: 999;
        }
      }

    }
  }

  .map-dialog {
    .el-dialog {
      background: #0a121e;

      .el-dialog__title {
        color: white;
      }

      .el-dialog__close {
        color: white;
      }
    }

    .el-input_inner {
      background: #E6E6E6;
      border-radius: 4px;
    }
  }

  #app {
    background: #0a121e;
    width: 100%;
    height: 100%;
    flex-direction: column;
    flex-wrap: wrap;
    color: #fff;
    overflow: hidden;
    flex-grow: 1;
  }
</style>
