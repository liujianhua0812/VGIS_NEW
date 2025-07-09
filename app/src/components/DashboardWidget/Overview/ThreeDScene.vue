<template>
<!--  <el-image class="scene" fit="cover" :src="DemoScene"></el-image>-->
  <el-row class="scene" v-loading="loading">
    <DynamicPID v-if="!loading && pid" :pid="pid" :preview="false"></DynamicPID>
    <h2 v-if="!loading && !pid" class="full flex align-items-center justify-content-center">{{$t("message.pid.noDefaultPID")}}</h2>
  </el-row>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import DemoScene from "@/assets/images/demo-scene.png"
import DynamicPID from "@/components/Admin/PID/DynamicPID.vue";
import {getDiagram, getDiagrams} from "@/assets/js/api/pid";
export default {
    name: "ThreeDScene",
    components: {
      DynamicPID,
        VgisCard
    },
    data () {
        return {
            DemoScene,
            loading: false,
            pid: ""
        }
    },
    methods: {
        getDefaultPID () {
          this.loading = true
          getDiagrams().then(result => {
            let pid = result.data.find(item => item.isDefault)
            if (pid) {
              getDiagram(pid.id).then(result => {
                this.pid = result.data
                this.loading = false
              })
            }
            else {
              this.loading = false
            }
          })
        }
    },
    created() {
      this.getDefaultPID()
    }
}
</script>

<style scoped>
  .scene {
      width: 100%;
      height: 100%;
      border-radius: 16px;
      background: #002766;
      display: flex;
  }
</style>