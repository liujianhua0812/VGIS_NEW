<template>
  <el-dialog title="Exit"
             :visible.sync="dialogVisibility"
             width="486px"
             :before-close="handleClose"
             @close="handleClose">
    <div style="text-align: center;">
      Change is not saved.
      Save this dashboard before quitting?
    </div>
    <div slot="footer" class="dialog-footer text-center">
      <el-button type="primary" @click="save">Yes</el-button>
      <el-button type="info" @click="exit">No</el-button>
      <el-button type="info" @click="handleClose">Cancel</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "exit",
  props:{
    dialogId: String, // 弹窗编号
    dialogVisibility: Boolean, // 控制可见与否
  },
  methods:{
    exit(){
      this.$emit("action-finished",this.dialogId,'exit')
    },
    handleClose() {
      this.$emit("action-finished",this.dialogId,false)
    },
    save(){
      this.$emit("action-finished",this.dialogId,true)

    }
  }
}
</script>

<style scoped>
.del-div{
  text-align: center;
}
.del-attention{
  color: #4facff;
}
* {
  font-family: HarmonyOS Sans;
}
</style>
