<template>
  <el-dialog z-index="99999" class="vgis-cctv-player" append-to-body :show-close="false" width="800px" :visible.sync="dialogVisibility" @close="close">
    <div slot="title" class="flex align-items-center justify-content-between">
      <div class="title">{{cctv.name}}</div>
      <div>
        <el-button v-if="isPlaying" type="text" class="p-t-0 p-b-0 action text-white el-icon-video-pause" @click="pause"></el-button>
        <el-button v-else type="text" class="p-t-0 p-b-0 action text-white el-icon-video-play" @click="play"></el-button>
        <el-button type="text" class="p-t-0 p-b-0 action el-icon-close text-danger" @click="close"></el-button>
      </div>
    </div>
    <video class="player" ref="player"></video>
  </el-dialog>
</template>

<script>

  import flvjs from 'flv.js'
  import { getCCTV } from "@/assets/js/api/cctv";

  export default {
    name: "InspectCCTV",
    props: {
      dialogId: String,
      dialogVisibility: Boolean,
      cctv: Object
    },
    data() {
      return {
        url: '',
        isPlaying: false,
        heartbeatId: ''
      }
    },
    methods: {
      close() {
        this.$emit('action-finished', this.dialogId, false)
      },
      sendHeartbeat () {
        getCCTV(this.cctv.instanceId).then(result => {})
      },
      pause () {
        this.flvPlayer.pause()
        this.isPlaying = false
      },
      play () {
        this.flvPlayer.play()
        this.isPlaying = true
      },
      openCCTV () {
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
            this.isPlaying = true
          }
          this.heartbeatId = setInterval(this.sendHeartbeat, 1000 * 10)
        })
      }
    },
    beforeDestroy() {
      clearInterval(this.heartbeatId)
      this.flvPlayer.destroy()
    },
    mounted () {
      this.$nextTick(() => {
        this.openCCTV()
      })
    }
  }
</script>
<style lang="scss" scoped>
  video.player {
    width: 100%;
    background: black;
  }

  .vgis-cctv-player :deep(.el-dialog) {
    background: #081C31;
    border-radius: 8px;
    z-index: 99999;

    .el-dialog__header {
      padding: 16px;

      .title {
        font-family: 'HarmonyOS Sans';
        font-style: normal;
        font-weight: 700;
        font-size: 18px;
        line-height: 21px;
        color: #FFFFFF;
      }

      .action {
        font-family: 'HarmonyOS Sans';
        font-style: normal;
        font-size: 18px;
        line-height: 21px;
      }
    }

    .el-dialog__body {
      padding: 5px 16px 16px 16px;
    }
  }
</style>
