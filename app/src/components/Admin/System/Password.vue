<template>
  <div class="p-10">
    <el-form label-position="top" :model="formData" ref="accountForm" :rules="rules">
      <el-form-item size="small" :label="$t('form.account.oldPassword.label')" prop="password" :label-width="formLabelWidth">
        <el-input show-password v-model="formData.password" :placeholder="$t('form.account.oldPassword.placeholder')" type="password">
        </el-input>
      </el-form-item>
      <el-form-item size="small" :label="$t('form.account.newPassword.label')" prop="newPassword" :label-width="formLabelWidth">
        <el-input show-password v-model="formData.newPassword" :placeholder="$t('form.account.newPassword.placeholder')" type="password">
        </el-input>
      </el-form-item>
      <el-form-item size="small" :label="$t('form.account.confirmPassword.label')" prop="confirmPassword" :label-width="formLabelWidth">
        <el-input show-password v-model="formData.confirmPassword" :placeholder="$t('form.account.confirmPassword.placeholder')" type="password">
        </el-input>
      </el-form-item>
    </el-form>
    <div class="text-center m-t-40">
      <el-button size="small" type="primary" @click="submit">{{$t("action.submit")}}</el-button>
    </div>
  </div>
</template>

<script>
import {updatePassword} from "@/assets/js/api/accounts";

export default {
  name: "Password",
  computed: {
    rules () {
      let that = this
      return {
        password: [
          { required: true, trigger: ['change', 'blur'], message: this.$t('form.account.oldPassword.error.empty') },
          { type: 'string', min: 6, trigger: ['change', 'blur'], message: this.$t('form.account.oldPassword.error.short') },
          { type: 'string', max: 32, trigger: ['change', 'blur'], message: this.$t('form.account.oldPassword.error.long') }
        ],
        newPassword: [
          { required: true, trigger: ['change', 'blur'], message: this.$t('form.account.newPassword.error.empty') },
          { type: 'string', min: 6, trigger: ['change', 'blur'], message: this.$t('form.account.newPassword.error.short') },
          { type: 'string', max: 32, trigger: ['change', 'blur'], message: this.$t('form.account.newPassword.error.long') }
        ],
        confirmPassword: [
          { required: true, trigger: ['change', 'blur'], message: this.$t('form.account.confirmPassword.error.empty') },
          {
            validator (rule, value, callback) {
              if (value === that.formData.newPassword) {
                return callback()
              }
              else {
                return callback(new Error(that.$t('form.account.confirmPassword.error.mismatch')))
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
        newPassword: '',
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
          updatePassword(this.formData).then(response => {
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

</style>
