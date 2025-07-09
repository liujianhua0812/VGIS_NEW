<template>
  <el-dialog width="438px" v-auth="{ resources: 'Model', action: 'Admin' }" :title="title"
             :visible.sync="dialogVisibility" @close="close">
    <el-form class="custom-form" label-position="top" :rules="rules" :model="formData" ref="groupForm">
      <el-form-item :label="$t('form.tableRelation.model.label')" prop="modelId">
        <el-input type="search">
          <span slot="suffix" class="search-button el-icon-search"></span>
        </el-input>
        <el-scrollbar wrap-class="list" tag="div" style="height: 216px">
          <el-tree
            ref="treeSelector"
            node-key="id"
            :props="{ disabled (data, node) { return data.type === 'ModelGroup' } }"
            show-checkbox
            style="background: transparent;"
            class="m-r-15"
            default-expand-all
            :data="models"
            @check-change="selectModel">
            <div class="noc-vgis-hierarchy-item" slot-scope="{node, data}">
              <div class="flex align-items-center justify-content-start" style="flex-grow: 1;">
                <el-image class="noc-vgis-hierarchy-icon" v-if="data.type ==='ModelGroup'" :src="ModelGroupIcon"></el-image>
                <el-image class="noc-vgis-hierarchy-icon" v-else :src="data.icon"></el-image>
                <span class="noc-vgis-hierarchy-name" style="flex-grow: 1;">{{data.name}}</span>
              </div>
            </div>
          </el-tree>
        </el-scrollbar>
      </el-form-item>
      <el-form-item :label="$t('form.tableRelation.field.label')" prop="fieldId">
        <el-select :label="$t('form.tableRelation.field.placeholder')" class="full-w" v-model="formData.fieldId">
          <el-option v-for="field in table.table_fields" :key="field.id" :value="field.id" :label="field.name"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">{{$t("action.cancel")}}</el-button>
      <el-button type="primary" @click="submit">{{$t("action.confirm")}}</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import ModelGroupIcon from '../../../assets/images/icons/ModelGroupIcon.png'
  import { createRelation, updateRelation } from "../../../assets/js/api/data-table-relation";
  import { getModelList } from "../../../assets/js/api/model";

  export default {
    name: "AddEditRelation",
    props: {
      dialogId: String,
      dialogVisibility: Boolean,
      table: Object,
      relation: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      title() {
        return !this.relation.id ? this.$t("form.title.addTableRelation") : this.$t("form.title.editTableRelation")
      },
    },
    watch: {
      series: {
        handler (newValue) {
          this.flushData()
        },
        deep: true
      },
      dialogVisibility (newValue) {
        if (newValue) {
          this.getModels()
        }
      }
    },
    data() {
      return {
        ModelGroupIcon,
        formLabelWidth: "140px",
        formData: {},
        models: [],
        rules: {
          modelId: [
            { required: true, trigger: ['change', 'blur'], message: this.$t("form.tableRelation.model.error.empty") }
          ],
          fieldId: [
            { required: true, trigger: ['change', 'blur'], message: this.$t("form.tableRelation.field.error.empty") }
          ]
        }
      }
    },
    methods: {
      close() {
        this.$emit('action-finished', this.dialogId, false)
      },
      getModels () {
        getModelList().then(result => {
          this.models = result.data
        })
      },
      selectModel (model, checked) {
        if (checked) {
          this.formData.modelId = model.id
          this.$refs.treeSelector.setCheckedKeys([model.id])
        }
        else {
          this.formData.modelId = ''
        }
      },
      flushData () {
        this.formData = Object.assign({
          modelId: '',
          fieldId: '',
          tableId: this.table.id
        }, this.relation)
      },
      submit() {
        this.$refs.groupForm.validate(valid => {
          if (valid) {
            if (this.relation.id) {
              updateRelation(this.table.id, this.relation.id, this.formData).then(response => {
                this.$message({
                  message: this.$t("message.tableRelation.updated"),
                  type: 'success',
                  showClose: true,
                  duration: 2000
                })
                this.$emit('action-finished', this.dialogId, true)
              })
            }
            else {
              createRelation(this.table.id, this.formData).then(response => {
                this.$message({
                  message: this.$t("message.tableRelation.created"),
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
      this.getModels()
      this.flushData()
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

  .custom-form-item :deep(.el-form-item__content) {
    border: 1px solid #4FACFF;
    border-radius: 4px;
  }

  .search-button {
    font-size: 18px;
    color: #4FACFF;
    cursor: pointer;
  }

  :deep(.list) {
    background: #F8F8F8;
  }

  .noc-vgis-hierarchy-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .noc-vgis-hierarchy-icon {
      width: 16px;
      height: 16px;
    }

    .noc-vgis-hierarchy-name {
      font-family: 'HarmonyOS Sans';
      font-style: normal;
      font-weight: 400;
      font-size: 15px;
      line-height: 18px;
      color: #000000;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
