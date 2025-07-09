<template>
  <el-dialog append-to-body width="90%" custom-class="svg-dialog" :visible.sync="dialogVisibility" :before-close="close" :title="title">
    <div class="svg-c">
      <DynamicPID preview :pid="pid"/>
    </div>
    <el-footer class="svg-pre-footer">
      <el-button @click="close" type="primary" size="small">Close</el-button>
    </el-footer>
  </el-dialog>
</template>

<script>

import DynamicPID from "./DynamicPID";

export default {
  name: "PreviewPIDView",
  props: {
    dialogVisibility: Boolean,
    dialogId: String,
    pid: Object
  },
  computed: {
    title () {
      return this.$t("form.title.previewPID", { name: this.pid.name })
    }
  },
  data() {
    return {};
  },
  components: {
      DynamicPID
  },
  methods: {
    close() {
      this.$emit('action-finished', false, this.dialogId)
    },
  },
  created() {

  }
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  width: fit-content;
}

.svg-c {
  position: relative;
  display: flex;
  width: 100%;
  overflow: scroll;
  border: 1px solid #e5e3e3;
  border-radius: 12px;
  justify-content: center;
}

.svg-pre-footer {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
