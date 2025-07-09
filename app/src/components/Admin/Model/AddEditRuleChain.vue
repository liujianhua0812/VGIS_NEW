<template>
  <el-dialog width="438px" v-auth="{ resources: 'Model', action: 'Admin' }" :title="title"
             :visible.sync="dialogVisibility" @close="close">
    <el-form label-position="top" :rules="rules" :model="formData" ref="chainForm">
      <el-form-item :label="$t('form.ruleChain.name.label')" prop="name">
        <el-input :placeholder="$t('form.ruleChain.name.placeholder')" v-model="formData.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('form.ruleChain.description.label')" prop="description">
        <el-input type="textarea" rows="6" :placeholder="$t('form.ruleChain.description.placeholder')" v-model="formData.description" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer text-center">
      <el-button size="small" @click="close">{{$t("action.cancel")}}</el-button>
      <el-button size="small" type="primary" @click="submit">{{$t("action.confirm")}}</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import { addRuleChain, updateRuleChain } from "@/assets/js/api/model-instance-rule-chain";

  export default {
    name: "AddEditRuleChain",
    props: {
      dialogId: String,
      dialogVisibility: Boolean,
      modelId: String,
      instanceId: String,
      chain: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      title() {
        return !this.chain.id ? this.$t("form.title.addRuleChain") : this.$t("form.title.editRuleChain")
      }
    },
    data() {
      return {
        formLabelWidth: "140px",
        formData: {
          name: '',
          description: ''
        },
        rules: {
          name: [
            { required: true, trigger: ['change', 'blur'], message: this.$t("form.ruleChain.name.error.empty") }
          ],
        }
      }
    },
    methods: {
      close() {
        this.$emit('action-finished', this.dialogId, false)
      },
      submit() {
        let formData = Object.assign({}, this.formData, {
          instanceId: this.instanceId,
          modelId: this.modelId
        })
        if (this.chain.id) {
          updateRuleChain(this.chain.id, formData).then(response => {
            this.$message({
              message: this.$t("message.ruleChain.updated"),
              type: 'success',
              showClose: true,
              duration: 2000
            })
            this.$emit('action-finished', this.dialogId, true)
          })
        }
        else {
          addRuleChain(formData).then(response => {
            this.$message({
              message: this.$t("message.ruleChain.created"),
              type: 'success',
              showClose: true,
              duration: 2000
            })
            this.$emit('action-finished', this.dialogId, true)
          })
        }
      }
    },
    created() {
      this.formData = Object.assign({}, this.chain)
    }
  }
</script>
<style lang="scss" scoped>

</style>
