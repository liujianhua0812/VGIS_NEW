<template>
  <el-dialog width="400px" v-auth="{ resources: 'Model', action: 'Admin' }" :title="title"
             :visible.sync="dialogVisibility" @close="close">
    <div>
      <el-button plain type="primary" class="full-w" @click="downloadTemplate">{{$t("action.downloadTemplate")}}</el-button>
    </div>
    <div class="m-t-10">
      <el-upload class="full-w" action="" :multiple="false" :show-file-list="false" :before-upload="loadFile">
        <el-button v-if="!dataFile.name" plain type="primary" class="full-w">{{$t("action.import")}}</el-button>
        <el-input v-else plain :value="dataFile.name"></el-input>
      </el-upload>
    </div>
    <div class="text-center m-t-20 p-b-20">
      <el-button size="small" @click="dataFile = {}" class="m-r-10">{{$t("action.reset")}}</el-button>
      <el-button size="small" type="primary" @click="submit">{{$t("action.confirm")}}</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import { getInstanceSingleSeriesImportTemplate, importInstanceSeriesValue } from "../../../assets/js/api/model-instance-series";
  import {downloadFile} from "../../../utils";

  export default {
    name: "ImportSeriesData",
    props: {
      dialogId: String,
      dialogVisibility: Boolean,
      model: Object,
      instance: Object,
      series: Object
    },
    computed: {
      title() {
        return this.$t("form.title.importData")
      },
    },
    data () {
      return {
        dataFile: {}
      }
    },
    methods: {
      close () {
        this.$emit('action-finished', this.dialogId, false)
      },
      loadFile (file) {
        if (!file || file.name.substr(file.name.length - 4) !== "xlsx") {
          this.$message({
            type: 'error',
            duration: 3000,
            showClose: true,
            message: this.$t("form.series.bulk.error.invalid")
          })
          return false
        }
        this.dataFile = file
        return false
      },
      downloadTemplate () {
        getInstanceSingleSeriesImportTemplate(this.instance.id, this.series.id).then(result => {
          const fileName = `template.xlsx`;
          downloadFile(fileName, result.data)
        })
      },
      submit () {
        if (!this.dataFile.name) {
          return this.$message({
            type: 'error',
            duration: 3000,
            showClose: true,
            message: this.$t("form.series.bulk.error.empty")
          })
        }
        importInstanceSeriesValue(this.instance.id, this.series.id, this.dataFile).then(result => {
          this.$message({
            message: this.$t("message.series.value.imported"),
            type: 'success',
            showClose: true,
            duration: 2000
          })
          this.$emit('action-finished', this.dialogId, true)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .full-w {
    :deep(.el-upload--text) {
      display: block !important;
    }
  }
</style>
