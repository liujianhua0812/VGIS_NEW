<template>
  <el-dialog width="438px" v-auth="{ resources: 'Model', action: 'Admin' }" :title="title"
             :visible.sync="dialogVisibility" @close="close">
    <el-form label-position="top" :rules="rules" :model="formData" ref="groupForm">
      <el-form-item :label="$t('form.modelGroup.name.label')" prop="name">
        <el-input :label="$t('form.modelGroup.name.placeholder')" v-model="formData.name" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer text-center">
      <el-button size="small" @click="close">{{$t("action.cancel")}}</el-button>
      <el-button size="small" type="primary" @click="submit">{{$t("action.confirm")}}</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import { createModelGroup, updateModelGroup } from "../../../assets/js/api/model-group";

  export default {
    name: "AddEditGroup",
    props: {
      dialogId: String,
      dialogVisibility: Boolean,
      group: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      title() {
        return !this.group.id ? this.$t("form.title.addGroup") : this.$t("form.title.renameGroup")
      }
    },
    watch: {
      group: {
        handler (newValue) {
          this.formData = Object.assign({}, this.group)
        },
        deep: true
      }
    },
    data() {
      return {
        formLabelWidth: "140px",
        formData: {
          name: ''
        },
        rules: {
          name: [
            { required: true, trigger: ['change', 'blur'], message: this.$t("form.modelGroup.name.error.empty") }
          ],
        }
      }
    },
    methods: {
      close() {
        this.$emit('action-finished', this.dialogId, false)
      },
      submit() {
        if (this.group.id) {
          updateModelGroup(this.group.id, this.formData).then(response => {
            this.$message({
              message: this.$t("message.model.groupUpdated"),
              type: 'success',
              showClose: true,
              duration: 2000
            })
            this.$emit('action-finished', this.dialogId, true)
          })
        }
        else {
          createModelGroup(this.formData).then(response => {
            this.$message({
              message: this.$t("message.model.groupCreated"),
              type: 'success',
              showClose: true,
              duration: 2000
            })
            this.$emit('action-finished', this.dialogId, true)
          })
        }
      }
    },
    created() {
      this.formData = Object.assign({}, this.group)
    }
  }
</script>
<style lang="scss" scoped>

</style>
