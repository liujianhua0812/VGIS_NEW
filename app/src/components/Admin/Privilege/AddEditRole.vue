<template>
  <el-dialog width="437px" v-auth="{ resources: 'Data', action: 'Admin' }" :title="title"
             :visible.sync="dialogVisibility" @close="close">
    <el-form label-position="top" :model="formData" ref="groupForm" :rules="rules">
      <el-form-item :label="$t('form.role.name.label')" prop="name">
        <el-input v-model="formData.name" :placeholder="$t('form.role.name.placeholder')" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('form.role.defaultEntry.label')" prop="defaultEntry">
        <el-input :placeholder="$t('form.role.defaultEntry.placeholder')" v-model="formData.defaultEntry" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer text-center">
      <el-button @click="close">{{$t("action.cancel")}}</el-button>
      <el-button type="primary" @click="submit">{{$t("action.submit")}}</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import { addRole, updateRole } from "../../../assets/js/api/privilege";

  export default {
    name: "AddEditRole",
    props: {
      dialogId: String,
      dialogVisibility: Boolean,
      role: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      title() {
        return !this.role.id ? this.$t('form.title.addRole') : this.$t('form.title.editRole')
      }
    },
    watch: {
      role: {
        handler (newValue) {
          this.flushData()
        },
        deep: true
      }
    },
    data() {
      return {
        formLabelWidth: "140px",
        formData: {
          name: '',
          defaultEntry: ''
        },
        rules: {
          name: [{ required: true, message: this.$t("form.role.name.error.empty"), trigger: ['change', 'blur'] }]
        }
      }
    },
    methods: {
      close() {
        this.$emit('action-finished', this.dialogId, false)
      },
      flushData () {
        this.formData = Object.assign({}, this.role)
      },
      submit() {
        this.$refs.groupForm.validate(valid => {
          if (valid) {
            if (this.role.id) {
              updateRole(this.role.id, this.formData).then(response => {
                this.$message({
                  message: 'Updated successfully.',
                  type: 'success',
                  showClose: true,
                  duration: 2000
                })
                this.$emit('action-finished', this.dialogId, true)
              })
            }
            else {
              addRole(this.formData).then(response => {
                this.$message({
                  message: 'Group created successfully.',
                  type: 'success',
                  showClose: true,
                  duration: 2000
                })
                this.$emit('action-finished', this.dialogId, true)
              })
            }
          }
        })
      }
    },
    created() {
      this.flushData()
    }
  }
</script>
<style lang="scss" scoped>

</style>
