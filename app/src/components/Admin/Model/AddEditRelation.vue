<template>
  <el-dialog width="438px" v-auth="{ resources: 'Model', action: 'Admin' }" :title="title"
             :visible.sync="dialogVisibility" @close="close">
    <el-form class="custom-form" label-position="top" :rules="rules" :model="formData" ref="groupForm">
      <el-form-item :label="$t('form.modelRelation.type.label')" prop="relationType">
        <el-select :plachholder="$t('form.modelRelation.type.plachholder')" default-first-option class="full-w" v-model="formData.relationType">
          <el-option v-for="type in relationTypes" :key="type" :value="type" :label="type"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('form.modelRelation.target.label')" prop="targetId">
        <el-cascader :plachholder="$t('form.modelRelation.target.plachholder')" clearable :options="hierarchy" default-first-option class="full-w" v-model="formData._targetId" @change="setTargetId">
        </el-cascader>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">{{$t("action.cancel")}}</el-button>
      <el-button type="primary" @click="submit">{{$t("action.confirm")}}</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import { getModelList } from "../../../assets/js/api/model";
  import { createModelRelation, updateModelRelation } from "../../../assets/js/api/model-relation";

  export default {
    name: "AddEditRelation",
    props: {
      dialogId: String,
      dialogVisibility: Boolean,
      modelId: String,
      relation: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      title() {
        return !this.relation.id ? this.$t("form.title.addModelRelation") : this.$t("form.title.editModelRelation")
      },
    },
    watch: {
      relation: {
        handler (newValue) {
          this.flushData()
        },
        deep: true
      },
      dialogVisibility (newValue) {
        if (newValue) {
          this.getHierarchy()
        }
      }
    },
    data() {
      return {
        formData: {},
        relationTypes: ['Contain', 'Belong To'],
        hierarchy: [],
        rules: {
          targetId: [
            { required: true, trigger: ['change', 'blur'], message: this.$t('form.modelRelation.target.error.empty') }
          ],
          relationType: [
            { required: true, trigger: ['change', 'blur'], message: this.$t('form.modelRelation.type.error.empty') }
          ]
        }
      }
    },
    methods: {
      close() {
        this.$emit('action-finished', this.dialogId, false)
      },
      flushData () {
        this.formData = Object.assign({
          relationType: '',
          _targetId: '',
          targetId: '',
          sourceId: this.modelId
        }, this.relation)
      },
      setTargetId (value) {
        this.formData.targetId = value[value.length - 1] || ''
      },
      getHierarchy () {
        getModelList().then(result => {
          this.hierarchy = (function transform (data) {
            let result = []
            for(let i = 0; i < data.length; i++) {
              let item = {
                value: data[i].id,
                label: data[i].name,
                icon: data[i].icon,
                type: data[i].type,
                disabled: data[i].type !== 'Model' && !(data[i].children && data[i].children.length > 0),
              }
              if (data[i].children && data[i].children.length > 0) {
                item.children = transform(data[i].children)
              }
              result.push(item)
            }
            return result
          })(result.data)
        })
      },
      submit() {
        this.$refs.groupForm.validate(valid => {
          if (valid) {
            if (this.relation.id) {
              updateModelRelation(this.modelId, this.relation.id, this.formData).then(response => {
                this.$message({
                  message: this.$t('message.modelRelation.updated'),
                  type: 'success',
                  showClose: true,
                  duration: 2000
                })
                this.$emit('action-finished', this.dialogId, true)
              })
            }
            else {
              createModelRelation(this.modelId, this.formData).then(response => {
                this.$message({
                  message: this.$t('message.modelRelation.created'),
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
      this.flushData()
      this.getHierarchy()
    }
  }
</script>
<style lang="scss" scoped>
  .noc-vgis-binary-selector {
    border: 1px solid #4FACFF;
    box-sizing: border-box;
    border-radius: 4px;
    text-align: center;
  }

  .custom-form :deep(.el-form-item__label) {
    padding: 0;
    font-family: 'HarmonyOS Sans';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: #000000;
  }

  .custom-form :deep(.el-form-item__content) {
    border: 1px solid #4FACFF;
    border-radius: 4px;
  }
</style>
