<template>
  <el-dialog title="Exit"
             :visible.sync="dialogVisibility"
             width="486px"
             :close-on-click-modal="false"
             :before-close="handleClose"
             @close="handleClose">
    <div style="text-align: center;margin-bottom: 20px">
      Change is not saved.
      Save this dashboard before quitting?
<!--      <p style="color: #4facff;">(Remember to save it before quitting)</p>-->
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
  props:["dialogVisibility",'dialogId'],
  methods:{
    exit(){
      this.$emit("action-finished", this.dialogId, true)
    },
    handleClose() {
      this.$emit("action-finished", this.dialogId, false)
    },
    save(){
      this.$emit("action-finished", this.dialogId, 'save')
    }
  }
}
</script>

<style scoped>
* {
  font-family: HarmonyOS Sans;
}
/*.del-div{*/
/*  text-align: center;*/
/*}*/
:deep(.el-dialog) {
  border-radius: 10px;
}
/*.del-attention{*/
/*  color: #4facff;*/
/*}*/
</style>
