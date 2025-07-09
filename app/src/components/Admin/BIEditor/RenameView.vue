<template>
  <el-dialog :title="info.thumbnail?'Template Rename':'Group Rename'"
             :visible.sync="dialogVisibility"
             width="438px"
             :before-close="handleClose"
             @close="handleClose">
    <el-form :model="ruleForm" ref="ruleForm" :rules="rules">
      <el-form-item :label="info.thumbnail?'Template Name':'Group Name'" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer text-center">
      <el-button type="info" @click="reset">Reset</el-button>
      <el-button type="primary" @click="submit">Confirm</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getAllTemplate,
  getTemplate,
  addNewTemplate,
  updateTemplate,
  delTemplate,
  addTemplateGroup,
  updateTemplateGroup,
  deleteTemplateGroup
} from '@/assets/js/api/bitemplate'

export default {
  name: "RenameGroupView",
  props: {
    info: { // 传递的待编辑的数据
      type: Object,
      default: () => ({})
    },
    dialogId: String, // 弹窗编号
    dialogVisibility: Boolean, // 控制可见与否
  },
  data() {
    return {
      rules: {
        name: [
          {required: true, message: 'Name is required', trigger: 'blur'},
        ],
      },
      ruleForm: {
        name: this.info.name
      }
    }
  },
  computed: {},
  methods: {
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.info.thumbnail) {
            updateTemplate(this.info.id, this.ruleForm).then(() => {
              this.$message({
                type: 'success',
                message: 'Rename succeeded'
              })
              this.$emit("action-finished", this.dialogId, true)
            })
          } else {
            updateTemplateGroup(this.info.id, this.ruleForm).then(() => {
              this.$message({
                type: 'success',
                message: 'Rename succeeded'
              })
              this.$emit("action-finished", this.dialogId, true)
            })
          }
        }
      })



    },
    reset() {
      this.Name = this.info.name
    },
    handleClose() {
      this.$emit("action-finished", this.dialogId, false)
    }
  }
}
</script>

<style scoped>
* {
  font-family: HarmonyOS Sans;
}
</style>
