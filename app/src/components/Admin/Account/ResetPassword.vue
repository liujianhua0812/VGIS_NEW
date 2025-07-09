<template>
  <el-dialog width="438px" v-auth="{ resources: 'Privilege', action: 'Admin' }" class="resetPwd ac-dlg" :title="title"
    :visible.sync="dialogVisibility" @close="close">
    <el-form label-position="top" :model="formData" ref="accountForm" :rules="rules">
      <el-form-item :label="$t('form.account.password.label')" prop="password" :label-width="formLabelWidth">
        <el-input v-model="formData.password" :placeholder="$t('form.account.password.placeholder')" type="password">
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('form.account.confirmPassword.label')" prop="confirmPassword" :label-width="formLabelWidth">
        <el-input v-model="formData.confirmPassword" :placeholder="$t('form.account.confirmPassword.placeholder')" type="password">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">{{$t("action.cancel")}}</el-button>
      <el-button type="primary" @click="submit">{{$t("action.submit")}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getRole } from "../../../assets/js/api/privilege";
  import { addUser, editUser } from "../../../assets/js/api/accounts";

  export default {
    name: "ResetPassword",
    props: {
      dialogId: String,
      dialogVisibility: Boolean,
      accountNo: String
    },
    computed: {
      rules () {
        let that = this
        return {
          password: [
            { required: true, trigger: ['change', 'blur'], message: this.$t('form.account.password.error.empty') },
            { type: 'string', min: 6, trigger: ['change', 'blur'], message: this.$t('form.account.password.error.short') },
            { type: 'string', max: 32, trigger: ['change', 'blur'], message: this.$t('form.account.password.error.long') }
          ],
          confirmPassword: [
            { required: true, trigger: ['change', 'blur'], message: this.$t('form.account.confirmPassword.error.empty') },
            {
              validator (rule, value, callback) {
                if (value === that.accountData.password) {
                  return callback()
                }
                else {
                  return callback(new Error(this.$t('form.account.confirmPassword.error.mismatch')))
                }
              },
              trigger: ['change', 'blur']
            }
          ],
        }
      }
    },
    data() {
      return {
        title: this.$t('form.title.resetPassword') ,
        formLabelWidth: "140px",
        formData: {
          password: '',
          confirmPassword: ''
        }
      }
    },
    methods: {
      close() {
        this.$emit('action-finished', this.dialogId, false)
      },
      submit() {
        this.$refs.accountForm.validate(valid => {
          if (valid) {
            editUser(Object.assign({
              accountNo: this.accountNo
            }, this.formData)).then(response => {
              this.$message({
                message: this.$t("message.account.passwordReset"),
                type: 'success',
                showClose: true,
                duration: 2000
              })
              this.$emit('action-finished', this.dialogId, true)
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .resetPwd.el-dialog {
    background: #fff !important;
  }

  .resetPwd.el-input__inner {
    background-color: #fff !important;
    border: 1px solid #dcdfe6 !important;
  }
</style>
