<template>
  <div class="p-10">
    <el-form label-position="top" :model="setting" ref="dataForm" :rules="rules">
      <el-form-item :label="$t('form.setting.mqtt.label')">
        <el-input v-model="setting.mqtt" :label="$t('form.setting.mqtt.placeholder')"></el-input>
      </el-form-item>
    </el-form>
    <div class="text-center m-t-40">
      <el-button size="small" type="primary" @click="submit">{{$t("action.save")}}</el-button>
    </div>
  </div>
</template>

<script>
import {updateSetting} from "@/assets/js/api/system";

export default {
  name: "Data",
  props: {
    setting: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    rules () {
      return {
        mqtt: []
      }
    }
  },
  methods: {
    submit() {
      updateSetting({
        setting: this.setting
      }).then(result => {
        this.$store.commit("updateSetting", {
          setting: result.data,
          instance: this
        })
        this.$message({
          type: 'success',
          message: this.$t("message.setting.updated")
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
