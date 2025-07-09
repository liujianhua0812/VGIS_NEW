<template>
  <el-dialog title="New Template"
             :visible.sync="dialogVisibility"
             width="438px"
             :before-close="handleClose"
             @close="handleClose">
    <el-form :model="ruleForm" ref="ruleForm" :rules="rules">
      <el-form-item label="Template name" prop="name">
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
export default {
  name: "AddTemplateView",
  props: {
    dialogId: String, // 弹窗编号
    dialogVisibility: Boolean, // 控制可见与否
  },
  data() {
    return {
      rules: {
        name: [
          {required: true, message: 'Template name is required', trigger: 'blur'},
        ],
      },
      ruleForm: {
        name: ''
      }
    }
  },
  methods: {
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$emit("action-finished", this.dialogId, this.ruleForm.name)
        }
      })
    },
    reset() {
      this.ruleForm.name = ''
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
