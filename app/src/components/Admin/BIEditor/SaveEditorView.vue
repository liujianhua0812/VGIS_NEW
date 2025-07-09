<template>
  <el-dialog title="Save"
             :visible.sync="dialogVisibility"
             width="438px"
             :before-close="handleClose"
             @close="handleClose">
    <el-form :model="ruleForm" ref="ruleForm" :rules="rules">
      <el-form-item label="Name" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="Group">
        <el-cascader
          style="width: 100%"
          v-model="groupId"
          :options="groups"
          :show-all-levels="false"
          :props="{ checkStrictly: true ,value:'id',label:'name',disabled:'isLeaf'}"
          clearable></el-cascader>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer text-center">
      <el-button type="info" @click="reset">Reset</el-button>
      <el-button type="primary" @click="submit">Confirm</el-button>
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
  name: "saveEditorView",
  props: {
    info: { // 传递的待编辑的数据
      type: Object,
      default: () => ({})
    },
    dialogId: String, // 弹窗编号
    dialogVisibility: Boolean, // 控制可见与否
  },
  data() {
    return {
      groups: [],
      rules: {
        name: [
          {required: true, message: 'Name is required', trigger: 'blur'},
        ],
      },
      ruleForm: {
        name: this.info.name
      },
      groupId: ''
    }
  },
  computed: {
    isEdit() {
      return this.info.id
    }
  },
  methods: {
    //构建树
    getGouJianIds(list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].thumbnail) {
          list[i].isLeaf = true
          delete list[i].children
        }
        if (list[i].children && list[i].children.length > 0) {
          this.getGouJianIds(list[i].children)
        }
      }
    },
    flushData() {
      // debugger
      this.groupId = this.info.groupId
      getAllTemplate().then((result) => {
        this.getGouJianIds(result.data)
        this.groups = result.data
      })
    },
    submit() {
      if (Array.isArray(this.groupId)) {
        this.info.groupId = this.groupId[this.groupId.length - 1]
      } else {
        this.info.groupId = this.groupId
      }
      let obj = {
        name: this.info.name,
        thumbnail: this.info.thumbnail,
        content: this.info.content,
        groupId: this.info.groupId,
        project: this.info.project
      }
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            updateTemplate(this.isEdit, obj).then((res) => {
              this.$message({
                showClose: true,
                message: "Saving succeeded",
                type: 'success'
              })
              this.$emit("action-finished", this.dialogId, true)
            })
          } else {
            addNewTemplate(obj).then(() => {
              this.$message({
                showClose: true,
                message: "Added successfully",
                type: 'success'
              })
              this.$emit("action-finished", this.dialogId, true)
            })
          }
        }
      })


    },
    refreshGroups() {
      this.info.groupId = null
    },
    reset() {
      this.name = this.info.name || '';
      this.groupId = this.info.groupId;
    },
    handleClose() {
      this.$emit("action-finished", this.dialogId, false)
    }
  },
  created() {

    this.flushData()
    this.refreshGroups()
  }
}
</script>

<style scoped>
* {
  font-family: HarmonyOS Sans;
}
</style>
