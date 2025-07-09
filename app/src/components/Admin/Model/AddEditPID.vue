<template>
  <el-dialog width="638px" v-auth="{ resources: 'Model', action: 'Admin' }" :title="title"
             :visible.sync="dialogVisibility" @close="close">
    <el-form :ref="formName" @submit.native.prevent label-position="top" :rules="rules" :model="formData">
      <el-form-item size="small" :label="$t('form.pid.name.label')" prop="name">
        <el-input :placeholder="$t('form.pid.name.placeholder')" v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item size="small" :label="$t('form.pid.file.label')" prop="pid">
        <el-upload action="#" :multiple="false" :auto-upload="false" :show-file-list="false" :on-change="selectPID">
          <el-button size="small" type="default">{{$t('form.pid.file.placeholder')}}</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item size="small" :label="$t('form.pid.preview.label')" v-if="svgPreview">
        <div style="background: #0a1b31; padding: 5px;">
          <div ref="preview" v-html="svgPreview"></div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer text-center">
      <el-button size="small" @click="close">{{$t("action.cancel")}}</el-button>
      <el-button size="small" type="primary" @click="submit">{{$t("action.confirm")}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { createPID, updatePID } from "../../../assets/js/api/model-instance-pid";

  export default {
    name: "AddEditPID",
    props: {
      dialogId: String,
      dialogVisibility: Boolean,
      instance: {
        type: Object,
        default: () => ({})
      },
      pid: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      title() {
        return !this.pid.id ? this.$t('form.title.uploadPID') : this.$t('form.title.editPID')
      },
    },
    data() {
      return {
        rules: {
          name: [{
            required: true, message: this.$t('form.pid.name.error.empty'), trigger: ['blur', 'change']
          }],
          pid: [{
            required: true, message: this.$t('form.pid.file.error.empty'), trigger: ['blur', 'change']
          }]
        },
        formName: 'PIDForm',
        svgPreview: "",
        formData: {
          name: '',
          pid: ''
        },
      }
    },
    methods: {
      selectPID(file) {
        if (file.name.substr(file.name.length - 3, 3) !== 'svg') {
          this.$message({
            type: 'error',
            message: this.$t('form.pid.file.error.svgOnly'),
            showClose: true
          })
        }
        else {
          let that = this
          this.formData.pid = file.raw
          let reader = new FileReader();
          reader.readAsText(this.formData.pid)
          reader.addEventListener('loadend', function () {
            that.svgPreview = reader.result
            that.$nextTick(() => {
              that.$refs.preview.children[0].setAttribute("width", '100%')
              that.$refs.preview.children[0].setAttribute("height", '100%')
            })
          })
        }
        return false
      },
      close() {
        this.$emit('action-finished', this.dialogId, false)
      },
      submit() {
        console.log(this.formData)
        this.$refs[this.formName].validate(valid => {
          if (valid) {
            if (this.pid.id) {
              updatePID(this.instance.id, this.pid.id, this.formData).then(response => {
                this.$message({
                  message: this.$t("message.pid.updated"),
                  type: 'success',
                  showClose: true,
                  duration: 2000
                })
                this.$emit('action-finished', this.dialogId, true)
              })
            } else {
              createPID(this.instance.id, this.formData).then(response => {
                this.$message({
                  message: this.$t("message.pid.created"),
                  type: 'success',
                  showClose: true,
                  duration: 2000
                })
                this.$emit('action-finished', this.dialogId, true)
              })
            }
          }
        })
      }
    },
    created() {
      this.formData = Object.assign({}, this.pid, { pid: this.pid.pid || "" })
    }
  }
</script>

<style scoped>

</style>
