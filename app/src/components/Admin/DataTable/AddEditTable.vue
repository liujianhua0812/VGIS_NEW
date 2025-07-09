<template>
  <el-dialog width="438px" v-auth="{ resources: 'Table', action: 'Admin' }" :title="title"
             :visible.sync="dialogVisibility" @close="close">
    <el-form label-position="top" :model="formData" ref="groupForm" :rules="rules">
      <el-form-item :label="$t('form.table.name.label')" prop="name">
        <el-input :placeholder="$t('form.table.name.placeholder')" v-model="formData.name" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer text-center">
      <el-button size="small" @click="close">{{$t("action.cancel")}}</el-button>
      <el-button size="small" type="primary" @click="submit">{{$t("action.confirm")}}</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import { createTable, updateTable } from "../../../assets/js/api/data-table";

  export default {
    name: "AddEditTable",
    props: {
      dialogId: String,
      dialogVisibility: Boolean,
      table: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      title() {
        return !this.table.id ? this.$t("form.title.addTable") : this.$t("form.title.editTable")
      }
    },
    watch: {
      table: {
        handler (newValue) {
          this.flushData()
        },
        deep: true
      }
    },
    data() {
      return {
        formLabelWidth: "140px",
        formData: {
          name: '',
        },
        rules: {
          name: [
            { required: true, trigger: ['change', 'blur'], message: this.$t('form.table.name.error.empty') }
          ]
        }
      }
    },
    methods: {
      close() {
        this.$emit('action-finished', this.dialogId, false)
      },
      flushData () {
        this.formData = Object.assign({ name: '' }, this.table)
      },
      submit() {
        if (this.table.id) {
          this.$refs.groupForm.validate(valid => {
            if (valid) {
              updateTable(this.table.id, this.formData).then(response => {
                this.$message({
                  message: this.$t('message.table.updated'),
                  type: 'success',
                  showClose: true,
                  duration: 2000
                })
                this.$emit('action-finished', this.dialogId, true)
              })
            }
          })
        }
        else {
          this.$refs.groupForm.validate(valid => {
            if (valid) {
              createTable(this.formData).then(response => {
                this.$message({
                  message: this.$t('message.table.created'),
                  type: 'success',
                  showClose: true,
                  duration: 2000
                })
                this.$emit('action-finished', this.dialogId, true)
              })
            }
          })
        }
      }
    },
    created() {
      this.flushData()
    }
  }
</script>
<style lang="scss" scoped>
  .icon-container {
    width: 64px;
    height: 64px;
  }
</style>
