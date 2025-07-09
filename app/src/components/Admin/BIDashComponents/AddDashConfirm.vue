<template>
  <div>
    <el-dialog
      title="New Dashboard"
      :visible.sync="dialogVisibility"
      width="438px"
      :close-on-click-modal="false"
      :before-close="handleClose"
      @close="handleClose"
    >
      <div>
        <el-form :rules="addDashRules" ref="addDashForm" :model="addDashForm">
          <el-form-item label="Name" prop="name">
            <el-input v-model="addDashForm.name"></el-input>
          </el-form-item>
          <el-form-item label="Template" prop="templateId">
            <el-cascader
              v-model="addDashForm.templateId"
              :options="templates"
              :props="{ value:'id',label:'name',leaf:'thumbnail' }"
              clearable>
            </el-cascader>
          </el-form-item>
        </el-form>
        <div class="foot-buttons">
          <el-button @click="reset">Reset</el-button>
          <el-button type="primary" @click="submitDashboard">Confirm</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllTemplate, getTemplate } from '@/assets/js/api/bitemplate'

export default {
  props: ['dialogId', 'model', 'dialogVisibility'],
  data() {
    return {
      addDashRules: {
        name: [{required: true, message: 'Dashboard name is required', trigger: 'blur'},
          { pattern: /^[\u4E00-\u9FA5A-Za-z0-9_-]+$/, message:'this name is not legal', trigger: 'blur' },
        ],
      },
      addDashForm: {
        name: '',
        templateId: '',
      },
      templates: [],
    };
  },
  mounted() {
    // 初始化 template 下拉框数据
    getAllTemplate().then(res => {
      this.flatArray(res.data)
      console.log('allTemplates', res)
      this.templates = res.data
    })
  },
  computed: {
  },
  methods: {
    // 递归删除所有叶子节点的 children
    flatArray(list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].thumbnail) {
          delete list[i].children
        }
        if (list[i].children && list[i].children.length > 0) {
          this.flatArray(list[i].children)
        }
      }
    },
    // 命名并选取 template 提交表单发送事件到父组件 临时保存信息
    submitDashboard() {
      let info = { name: this.addDashForm.name }
      if(this.addDashForm.templateId){
        let templateId = this.addDashForm.templateId[this.addDashForm.templateId.length - 1]
        getTemplate(templateId).then(res => {
          info.project = res.data.project
          this.$emit('action-finished', this.dialogId, true, info)
        })
      }else {
        this.$emit('action-finished', this.dialogId, true, info)
      }
    },
    handleClose() {
      this.reset()
      this.$emit('action-finished', this.dialogId, false)
    },
    reset() {
      this.$refs["addDashForm"].resetFields()
    }
  }
};
</script>
<style scoped>
* {
  font-family: HarmonyOS Sans ;
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
