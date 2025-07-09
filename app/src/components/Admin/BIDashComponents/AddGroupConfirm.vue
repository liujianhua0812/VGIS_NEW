<template>
  <div>
    <el-dialog
      title="Add Group"
      :visible.sync="dialogVisibility"
      width="438px"
      :close-on-click-modal="false"
      :before-close="handleClose"
      @close="handleClose"
    >
      <div>
        <el-form :model="addGroupForm" ref="addDashForm" :rules="rules">
          <el-form-item label="Group name" prop="name">
            <el-input v-model="addGroupForm.name"></el-input>
          </el-form-item>
        </el-form>
        <div class="foot-buttons">
          <el-button @click="reset">Reset</el-button>
          <el-button type="primary" @click="addGroup">Confirm</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addDashboardGroup } from '@/assets/js/api/bidashboard'
export default {
  props: ['dialogVisibility', 'model', 'dialogId'],
  data() {
    return {
      rules: {
        name: [
          { required: true, message:'groupName is required', trigger: 'blur' },

          { pattern: /^[\u4E00-\u9FA5A-Za-z0-9_-]+$/, message:'this name is not legal', trigger: 'blur' },
        ],
      },
      addGroupForm:{
        name: '',
      },
      renameGroupName: '',
      dashboardName:'',
    };
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    addGroup() {
      this.$refs['addDashForm'].validate(res=>{
        if(res){
          addDashboardGroup(Object.assign({},this.addGroupForm, {groupId: this.model.id})).then((res) => {
            this.$emit('action-finished', this.dialogId, true)
          })
        }
      })
    },
    handleClose() {
      this.reset()
      this.$emit('action-finished', this.dialogId, false)
    },
    reset(){
      this.$refs["addDashForm"].resetFields()
    }
  }
};
</script>
<style scoped>
* {
  font-family: HarmonyOS Sans;
}
:deep(.el-cascader) {
  width: 100%;
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
