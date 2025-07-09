<template>
<el-dialog title="Add Group"
           :visible.sync="dialogVisibility"
           width="438px"
           :before-close="handleClose"
           @close="handleClose">
  <el-form :model="ruleForm" ref="ruleForm" :rules="rules">
    <el-form-item label="Group name" prop="name">
      <el-input v-model="ruleForm.name"></el-input>
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
  name: "AddGroupView",
  props:{
    info: { // 传递的待编辑的数据
      type: Object,
      default: () => ({})
    },
    dialogId: String, // 弹窗编号
    dialogVisibility: Boolean, // 控制可见与否
  },
  data(){
    return{
      rules: {
        name: [
          { required: true, message:'Group name is required', trigger: 'blur' },
        ],
      },
      ruleForm:{
        name:''
      }
    }
  },
  methods:{
    submit(){
      this.$refs['ruleForm'].validate((valid)=>{
        if(valid){
          this.info.name=this.ruleForm.name
          addTemplateGroup(this.info).then(()=>{
            this.$message({
              showClose:true,
              message:"Added successfully",
              type:'success'
            })
            this.$emit("action-finished",this.dialogId,true)
          })
        }
      })

    },
    reset(){
      this.info.name=''
    },
    handleClose(){
      this.reset()
      this.$emit("action-finished",this.dialogId,false)
    }
  }
}
</script>

<style scoped>
* {
  font-family: HarmonyOS Sans;
}
</style>
