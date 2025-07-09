<template>
  <div>
    <el-dialog
      title="Save"
      :visible.sync="dialogVisibility"
      width="438px"
      :close-on-click-modal="false"
      :before-close="handleClose"
      @close="handleClose"
    >
      <div>
        <el-form :model="confirmSaveForm" ref="confirmSaveForm" :rules="confirmSaveRules">
          <el-form-item label="Name" prop="name">
            <el-input v-model="confirmSaveForm.name"></el-input>
          </el-form-item>
          <el-form-item label="Group" prop="groupId">
            <el-cascader
              :show-all-levels="false"
              v-model="confirmSaveForm.groupId"
              :options="groups"
              :props="{checkStrictly: true , value:'id' ,label:'name' ,disabled: 'isLeaf'}"
              clearable>
            </el-cascader>
          </el-form-item>
        </el-form>
        <div class="foot-buttons">
          <el-button @click="showNameGroup">Reset</el-button>
          <el-button type="primary" @click="confirm">Confirm</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getDashboardList, getDashboardDetail} from '@/assets/js/api/bidashboard'
import {getAllTemplate, addNewTemplate} from '@/assets/js/api/bitemplate'

export default {
  props: {
    saveAs: {
      type: String,
      default: 'dashToDash',
    },
    dialogId: {
      type: String,
    },
    dialogVisibility: Boolean,
    dashInfo: Object,
    model: Object
  },
  data() {
    return {
      groups: [],
      confirmSaveForm: {
        name: '',
        groupId: '',
      },
      confirmSaveRules: {
        name: [{required: true, trigger: 'blur'},{ pattern: /^[\u4E00-\u9FA5A-Za-z0-9_-]+$/, message:'this name is not legal', trigger: 'blur' },]
      }
    };
  },
  created(){
    if (this.saveAs === 'dashToDash') {
      this.showNameGroup()
    }
    if (this.saveAs === 'dashToTemp') {
      this.initTempGroups()
    }
  },
  mounted() {

  },
  computed: {
  },
  methods: {
    initTempGroups() {
      getAllTemplate().then(res => {
        this.flatArray(res.data)
        this.groups = res.data
      })
    },
    // 递归删除叶子节点的 children
    flatArray(list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].thumbnail) {
          list[i].isLeaf = true
          delete list[i]
        }
        if (list[i] && list[i].children && list[i].children.length > 0) {
          this.flatArray(list[i].children)
        }
      }
    },
    showNameGroup() {
      getDashboardList().then((res) => {
        let tempData = res.data
        this.flatArray(tempData)
        this.groups = tempData
      })
      this.confirmSaveForm.name = this.dashInfo.name
      this.confirmSaveForm.groupId = this.dashInfo.groupId
    },
    confirm() {
      this.$refs['confirmSaveForm'].validate(res => {
        if (res) {
          // dashboard 保存为 dashboard
          if (this.saveAs === 'dashToDash') {
            this.$emit('action-finished', this.dialogId, true, Object.assign({}, this.dashInfo, this.confirmSaveForm))
          }
          // dashboard 保存为 template
          if (this.saveAs === 'dashToTemp') {
            getDashboardDetail(this.model).then(res => {
              // 转换 cascade 数据为正常 form 表单数据
              if (Array.isArray(this.confirmSaveForm.groupId)) {
                this.confirmSaveForm.groupId = this.confirmSaveForm.groupId[this.confirmSaveForm.groupId.length - 1]
              }
              // 调用接口保存为 template
              addNewTemplate(Object.assign({}, res.data, this.confirmSaveForm, {id: undefined})).then(res => {
                console.log(res.data)
                // this.$message.success('Save as template success.')
                this.$emit('action-finished', this.dialogId)
              })
            })
          }
        }
      })
    },
    reset() {
      this.$refs["confirmSaveForm"].resetFields()
    },
    handleClose() {
      this.reset()
      this.$emit('action-finished', this.dialogId, false)
    },
  }
};
</script>
<style>
.el-cascader-node{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}
.el-cascader {
  width: 100%;
}
</style>

<style lang="scss" scoped>

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
