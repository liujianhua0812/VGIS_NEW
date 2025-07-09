<template>
  <el-dialog width="660px" :title="cctv.name"
             :visible.sync="dialogVisibility" @close="close">
    <video class="player" ref="player"></video>
    <div slot="footer" class="dialog-footer text-center">
      <el-button size="small" @click="close">{{$t("action.close")}}</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import flvjs from 'flv.js'
  import { getCCTV } from "../../../assets/js/api/cctv";

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
          }
          this.heartbeatId = setInterval(this.sendHeartbeat, 1000 * 10)
        })
      }
    },
    beforeDestroy() {
      clearInterval(this.heartbeatId)
      if (this.flvPlayer) {
        this.flvPlayer.destroy()
      }
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
</style>
