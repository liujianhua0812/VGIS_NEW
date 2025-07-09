<template>
  <el-dialog class="vgis-adm" width="438px" v-auth="{ resources: 'Model', action: 'Admin' }" :title="title"
             :visible.sync="dialogVisibility" @close="close">
    <el-form label-position="top" :model="formData" ref="groupForm" :rules="rules">
      <el-form-item :label="$t('form.model.id.label')" prop="modelId">
        <el-input :placeholder="$t('form.model.id.placeholder')" v-model="formData.modelId" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('form.model.name.label')" prop="name">
        <el-input :placeholder="$t('form.model.name.placeholder')" v-model="formData.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('form.field.label.label')" prop="labels">
        <el-select :placeholder="$t('form.field.label.placeholder')" class="full-w" multiple clearable filterable allow-create v-model="formData.labels" type="textarea" rows="4" autocomplete="off">
          <el-option v-for="label in labels" :key="label.id" :value="label.name" :label="label.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('form.model.icon.label')" prop="icon">
        <el-upload class=" avatar-uploader" action="" :multiple="false" :show-file-list="false" :before-upload="extractIcon">
          <el-image v-model="formData.icon"  v-if="formData.icon" class="icon-container" :src="formData.icon"></el-image>
          <i v-else  class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer text-center">
      <el-button size="small" @click="close">{{$t("action.cancel")}}</el-button>
      <el-button size="small" type="primary" @click="submit">{{$t("action.confirm")}}</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import ModelGroupIcon from '../../../assets/images/icons/ModelGroupIcon.png'
  import { createModel, updateModel } from "../../../assets/js/api/model";
  import {getLabelList} from "@/assets/js/api/unit-label";

  export default {
    name: "AddEditModel",
    props: {
      dialogId: String,
      dialogVisibility: Boolean,
      model: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      title() {
        return !this.model.id ? this.$t("form.title.addModel") : this.$t("form.title.editModel")
      }
    },
    watch: {
      formData:{
        handler(newV){
          if(newV.icon){
            let els = document.getElementsByClassName('el-form-item__error')
            for(let item of els){
              if(item.innerText === 'Icon is required.'){
                item.style.display = 'none'
              }
            }
          }
        },
        deep: true
      },
      model: {
        handler (newValue) {
          this.formData = Object.assign({}, this.model, { labels: [] })
          if (this.model.labels) {
            this.formData.labels = this.model.labels.map(item => item.name)
          }
        },
        deep: true
      }
    },
    data() {
      return {
        ModelGroupIcon,
        formLabelWidth: "140px",
        formData: {
          name: '',
          icon: '',
          labels: []
        },
        labels: [],
        rules: {
          modelId: [
            { required: true, trigger:  ['blur', 'change'], message: this.$t("form.model.id.error.empty") }
          ],
          name: [
            { required: true, trigger: ['change', 'blur'], message: this.$t("form.model.name.error.empty") }
          ],
          icon: [
            { required: true, trigger: ['change', 'blur'], message: this.$t("form.model.icon.error.empty") }
          ],
        }
      }
    },
    methods: {
      close() {
        this.$refs['groupForm'].resetFields()
        this.$emit('action-finished', this.dialogId, false)
      },
      extractIcon (file) {
        if (['image/jpeg', 'image/png', 'image/bmp'].includes(file.type)) {
          let that = this
          let reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => {
            that.formData.icon = reader.result
          }
        }
        else {
          this.$message({
            type: 'error',
            showClose: true,
            duration: 3000,
            message: this.$t("form.model.icon.error.invalid")
          })
        }
        return false
      },
      getLabels () {
        getLabelList().then(result => {
          this.labels = result.data
        })
      },
      submit() {
        this.$refs['groupForm'].validate((valid) =>{
          if(valid){
              if (this.model.id) {
                updateModel(this.model.id, this.formData).then(response => {
                  this.$message({
                    message: this.$t("message.model.updated"),
                    type: 'success',
                    showClose: true,
                    duration: 2000
                  })
                  this.$emit('action-finished', this.dialogId, true)
                })
              }
              else {
                createModel(this.formData).then(response => {
                  this.$message({
                    message: this.$t("message.model.created"),
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
      this.formData = Object.assign({}, this.model)
      this.getLabels()
    }
  }
</script>
<style lang="scss" scoped>
.avatar-uploader {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  width: 64px;
  height: 64px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 64px;
  height: 64px;
  line-height: 64px;
  text-align: center;
}
.avatar {
  width: 64px;
  height: 64px;
  display: block;
}
.avatar-uploader-icon{
  font-size: 12px;
}
  //.icon-container {
  //  width: 64px;
  //  height: 64px;
  //}
</style>
