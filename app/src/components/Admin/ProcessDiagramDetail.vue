<template>
  <div class="m-20 full-h">
    <el-card class="m-b-20">
      <div class="flex align-items-center justify-content-between">
        <h3 class="m-0 text-bold">{{diagram.name}}</h3>
        <el-button class="p-0" icon="el-icon-back" type="text" @click="toList">Back</el-button>
      </div>
    </el-card>
    <el-card body-style="background: #0a1b31;">
      <div ref="pid" v-html="diagram.map"></div>
    </el-card>
  </div>
</template>

<script>
  import {getDiagram, getDiagrams, removeDiagram, uploadPID} from "../../assets/js/api/pid";

  export default {
    name: "ProcessDiagramDetail",
    data () {
      return {
        diagram: {}
      }
    },
    methods: {
      refresh () {
        getDiagram(this.$route.params.diagramId).then(result => {
          this.diagram = result.data
          this.$nextTick(() => {
            this.$refs.pid.children[0].setAttribute("width", '100%')
            this.$refs.pid.children[0].setAttribute("height", '100%')
          })
        })
      },
      toList () {
        this.$router.push({ name: 'ProcessDiagramList' })
      }
    },
    created() {
      this.refresh()
    }
  }
</script>

<style scoped>

</style>
