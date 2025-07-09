<template>
  <el-dialog title="Delete"
             :visible.sync="dialogVisibility"
             width="438px"
             :before-close="handleClose"
             @close="handleClose">
    <div v-if="!info.thumbnail" class="text-center">
      Determine to delete the current group
      <p style="color: #4facff;">(Careful, not recoverable after deletion, not removeable when there is a panel in the
        group)</p>
    </div>
    <div v-else class="text-center">
      Is it OK to delete the current panel?
      <p style="color: #4facff;">(Be careful, not recoverable after deletion)</p>
    </div>
    <div slot="footer" class="dialog-footer text-center">
      <el-button type="info" @click="handleClose">Cancel</el-button>
      <el-button type="danger" @click="deleteGroup">Delete</el-button>
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
  name: "DeleteGroup",
  props: {
    info: { // 传递的待编辑的数据
      type: Object,
      default: () => ({})
    },
    dialogId: String, // 弹窗编号
    dialogVisibility: Boolean, // 控制可见与否
  },
  methods: {
    handleClose() {
      this.$emit("action-finished",this.dialogId,false)
    },
    deleteGroup() {
      if (this.info.thumbnail) {
        delTemplate(this.info.id).then(() => {
          this.$emit("action-finished",this.dialogId,true)
          this.$message({
            type: 'success',
            message: "Template deleted successfully！"
          })
        })
      } else {
        deleteTemplateGroup(this.info.id).then(() => {
          this.$emit("action-finished",this.dialogId,true)
          this.$message({
            type: 'success',
            message: "Group deleted successfully！"
          })
        })
      }


    }
  }
}
</script>

<style scoped>
* {
  font-family: HarmonyOS Sans;
}
</style>
