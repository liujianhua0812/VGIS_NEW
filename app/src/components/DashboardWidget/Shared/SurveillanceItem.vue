<template>
  <div class="cctv-item pointer">
    <div class="vgis-cctv-name">
      {{cctv.name}}
      <el-dropdown ref="dropdown" :visible-arrow="false" trigger="click" @visible-change="getCCTVList" @command="switchCCTV">
        <el-button type="text" class="pointer text-white el-icon-s-operation text-regular"></el-button>
        <el-dropdown-menu class="vgis-cctv-selection" slot="dropdown">
          <div class="vgis-cctv-selection-title">CCTV List</div>
          <div class="vgis-cctv-selection-container">
            <div class="vgis-cctv-selection-item" @click="switchCCTV(cctv.id)" v-for="cctv in cctvs.filter(item => item.id !== cctv.id)">{{cctv.name}}</div>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="vgis-cctv-content" style="width:100%">
      <video ref="player" muted class="vgis-cctv" :poster="defaultCover" @click="inspectCCTV"></video>
    </div>
    <InspectCCTVDialog :cctv="cctv" v-if="dialogVisibility.inspectCCTV" dialogId="inspectCCTV" :dialog-visibility="dialogVisibility.inspectCCTV" @action-finished="dialogVisibility.inspectCCTV = false"></InspectCCTVDialog>
  </div>
</template>

<script>

import flvjs from 'flv.js'
import { getCCTVList, getCCTV } from "@/assets/js/api/cctv";
import InspectCCTVDialog from "./InspectCCTVDialog";

export default {
  name: "SurveillanceItem",
  props: {
    info: Object,
    defaultCover: String,
    rows: {
      type: Number,
      default: 4
    }
  },
  components: {
    InspectCCTVDialog
  },
  data() {
    return {
      dialogVisibility: {
        inspectCCTV: false
      },
      dropdownVisible: false,
      url: '',
      cctv: {},
      cctvs: []
    }
  },
  methods: {
    flushData () {
      this.cctv = Object.assign({}, this.info)
    },
    getCCTVList () {
      getCCTVList().then(result => {
        this.cctvs = result.data
      })
    },
    inspectCCTV () {
      this.dialogVisibility.inspectCCTV = true
    },
    sendHeartbeat () {
      getCCTV(this.cctv.instanceId).then(result => {})
    },
    switchCCTV (id) {
      this.cctv = this.cctvs.filter(cctv => cctv.id === id)[0]
      this.closeCCTV()
      this.openCCTV()
      this.$refs.dropdown.hide()
    },
    openCCTV() {
      getCCTV(this.cctv.instanceId).then(result => {
        this.url = result.data.url
        if (flvjs.isSupported()) {
          let videoElement = this.$refs.player;
          this.flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: this.url
          });
          this.flvPlayer.attachMediaElement(videoElement);
          this.flvPlayer.load();
          this.flvPlayer.play();
        }
        this.heartbeatId = setInterval(this.sendHeartbeat, 1000 * 10)
      })
    },
    closeCCTV () {
      this.flvPlayer.destroy()
      clearInterval(this.heartbeatId)
    }
  },
  beforeDestroy() {
    this.closeCCTV()
  },
  created() {
    this.flushData()
  },
  mounted () {
    this.$nextTick(() => {
      this.openCCTV()
    })
  }
}
</script>

<style lang="scss" scoped>
*{
  font-family: HarmonyOS Sans;
}
.cctv-item {
  //height: calc(100% / 2);
  flex-grow: 1;
  margin-left: 10px;
  height: 100%;
  position: relative;
  padding: 8px;
  border: 1px solid #4FACFF;
}

.cctv-item:first-child {
  margin-left: 0;
}

.vgis-cctv-name {
  position: absolute;
  font-family: HarmonyOS_Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  height: 32px;
  line-height: 32px;
  background: rgba(51, 51, 51, 0.6);
  bottom: 8px;
  width: calc(100% - 16px);
  padding: 0 5px;
  text-align: start;
  color: #FFFFFF;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 500;
}

.vgis-cctv-selection {
  background: #081C31;
  box-shadow: 0 0 8px 2px rgba(79, 172, 255, 0.4);
  border: none;

  :deep(.vgis-cctv-selection-title) {
    font-family: 'HarmonyOS Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 21px;
    padding: 0 16px;
    color: #4FACFF;
  }

  :deep(.vgis-cctv-selection-container) {
    max-height: 250px;
    overflow-y: scroll;

    .vgis-cctv-selection-item {
      height: 31px;
      width: 150px;
      padding: 0 16px;
      font-family: 'HarmonyOS Sans';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 31px;
      color: #FFFFFF;
      cursor: pointer;
    }

  }

  :deep(.popper__arrow) {
    display: none;
  }
}

.vgis-cctv-content {
  width: 285px;
  height: 100%;
}

.vgis-cctv {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


</style>
