<template>
  <el-dialog width="438px" v-auth="{ resources: 'Data', action: 'Admin' }" :title="$t('form.title.addInstanceRelation')"
             :visible.sync="dialogVisibility" @close="close">
    <el-form class="custom-form" label-position="top" :model="formData" ref="groupForm">
      <el-form-item v-for="target in model.Targets" :key="target.id" :label="target.name" :prop="target.name">
        <el-select clearable multiple v-model="formData.relations[target.id]" class="full-w">
          <el-option v-for="instance in targetInstances[target.id]" :key="instance.id" :value="instance.id" :label="instance.name"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer text-center">
      <el-button size="small" @click="close">{{$t("action.cancel")}}</el-button>
      <el-button size="small" type="primary" @click="submit">{{$t("action.confirm")}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getModelInstanceList} from "../../../assets/js/api/model-instance";
  import {createInstanceRelation} from "../../../assets/js/api/model-instance-relation";

  export default {
    name: "AddInstanceRelation",
    props: {
      dialogId: String,
      dialogVisibility: Boolean,
      model: Object,
      instance: Object
    },
    data() {
      return {
        formData: {
          relations: {}
        },
        targetInstances: {}
      }
    },
    methods: {
      close () {
        this.$emit('action-finished', this.dialogId, false)
      },
      getRelatedObjects () {
        Promise.all(this.model.Targets.map(target => getModelInstanceList(target.id))).then(results => {
          this.targetInstances = results.reduce((res, { data }, index) => {
            res[this.model.Targets[index].id] = data
            return res
          }, {})
        })
      },
      submit () {
        createInstanceRelation(this.instance.id, this.formData).then(result => {
          this.$emit('action-finished', this.dialogId, true)
        })
      }
    },
    created() {
      this.getRelatedObjects()
    }
  }
</script>

<style scoped>

</style>
