<template>
  <div>
    <el-dialog
      title="Rename"
      :visible.sync="dialogVisibility"
      width="438px"
      :close-on-click-modal="false"
      @open="initLastName"
      :before-close="handleClose"
      @close="handleClose"
    >
      <div>
        <el-form ref="renameForm" :model="renameForm" :rules="renameRules">
          <el-form-item :label="renameLabel" prop="name">
            <el-input v-model="renameForm.name"></el-input>
          </el-form-item>
        </el-form>
        <div class="foot-buttons">
          <el-button @click="initLastName">Reset</el-button>
          <el-button type="primary" @click="submitRename">Confirm</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {updateDashboardDetail, updateDashboardGroup} from '@/assets/js/api/bidashboard'

export default {
  props: ['dialogVisibility', 'model', 'dialogId', 'which'],
  data() {
    return {
      renameLabel: this.which === 'group' ? 'GroupName' : 'DashboardName',
      renameForm: {
        name: this.model.name,
      },
      renameRules: {
        name: [
          { pattern: /^[\u4E00-\u9FA5A-Za-z0-9_-]+$/, message:'this name is not legal', trigger: 'blur' },
          {required: true, trigger: 'blur'},
        ],
      }
    };
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    initLastName() {
      this.renameForm.name = this.model.name
    },
    submitRename() {
      if (this.which === 'group') {
        updateDashboardGroup({
          id: this.model.id,
          name: this.renameForm.name,
          groupId: this.model.groupId
        }).then((res) => {
          this.$emit('action-finished', this.dialogId, true)
        })
      }
      if (this.which === 'dashboard') {
        updateDashboardDetail({
          id: this.model.id,
          name: this.renameForm.name,
          groupId: this.model.groupId
        }).then((res) => {
          this.$emit('action-finished', this.dialogId, true)
        })
      }
    },
    handleClose() {
      this.$refs["renameForm"].clearValidate()
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

.foot-buttons {
  text-align: center;
  padding: 8px 0 24px 0;
}

:deep(.el-dialog__header) {
  padding: 24px 40px 10px;
}

:deep(.el-dialog__body) {
  padding: 10px 40px 0 40px;
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
