<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="dialogVisibility"
    width="1491px"
    :before-close="handleClose"
    @close="handleClose"
  >
    <img style="height: 100%" alt="" :src="imgSrc"/>
    <div slot="footer" class="dialog-footer text-center">
      <el-button @click="edit" type="primary">edit</el-button>
      <el-button @click="handleClose">cancel</el-button>
    </div>
  </el-dialog>
</template>

<script>
import config from "../../../config";

export default {
  props: ['model', 'dialogVisibility', 'dialogId'],
  data() {
    return {
      title: 'Preview',
      imgSrc: config.backend.host + 'media/' + this.model.thumbnail + '?raw=true',
    };
  },
  mounted() {
    console.log('mounted',this.model)
  },
  computed: {
  },
  methods: {
    handleClose() {
      this.$emit('action-finished', this.dialogId, false)
    },
    edit(){
      this.$emit('action-finished', this.dialogId, true)
    }
  }
};
</script>
<style scoped>
* {
  font-family: HarmonyOS Sans;
}
:deep(.el-dialog) {
  border-radius: 10px;
  height: 834px;
  display: flex;
  flex-direction: column;
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  margin: auto !important;
}

:deep(.el-button--default) {
  background-color: #b3b3b3;
  color: white;
}
:deep(.el-dialog__body) {
  text-align: center;
  height: calc(100% - 128px);
}
</style>
