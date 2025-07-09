<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      title="Delete"
      :visible.sync="dialogVisibility"
      width="438px"
      :before-close="handleClose"
      @close="handleClose"
    >
      <div>
        <div class="del-div" v-show="which === 'group'">
          Determine to delete the current group
          <p class="del-attention">(Careful, not recoverable after deletion, not removable when there is a panel in the
            group)</p>
        </div>
        <div class="del-div" v-show="which === 'dashboard'">
          Is it OK to delete the current dashboard?
          <p class="del-attention">(Be careful, not recoverable after deletion)</p>
        </div>
        <div class="foot-buttons">
          <el-button @click="handleClose">Cancel</el-button>
          <el-button type="danger" @click="submitDelete">Delete</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { delDashboard, delDashboardGroup } from '@/assets/js/api/bidashboard'

export default {
  props: ['dialogVisibility', 'dialogId', 'model', 'which'],
  data() {
    return {};
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    submitDelete() {
      if(this.which === 'group'){
        delDashboardGroup(this.model).then(res => {
          this.$emit('action-finished', this.dialogId, true)
        })
      }
      if(this.which === 'dashboard'){
        delDashboard(this.model).then(res => {
          this.$emit('action-finished', this.dialogId, true)
        })
      }
    },
    handleClose() {
      this.$emit('action-finished', this.dialogId, false)
    },
  }
};
</script>
<style scoped>
* {
  font-family: HarmonyOS Sans;
}
:deep(.el-dialog__headerbtn) {
  right: 38px;
}

.del-div {
  text-align: center;
}

.del-attention {
  color: #4facff;
}

.foot-buttons {
  text-align: center;
  padding: 8px 0 24px 0;
}

:deep(.el-dialog__header) {
  padding: 24px 40px 10px;
}

:deep(.el-dialog__body) {
  padding: 10px 40px 0;
}

:deep(.el-dialog) {
  border-radius: 10px;
}

:deep(.el-button + .el-button) {
  margin-left: 40px;
}

:deep(.el-button--default) {
  background-color: #b3b3b3;
  color: white;
}
</style>
