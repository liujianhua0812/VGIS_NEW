<template>
  <div class="flex flex-column full-w">

  </div>
</template>

<script>
import {updateSetting} from "@/assets/js/api/system";

export default {
  name: "Basic",
  props: {
    setting: {
      type: Object,
      default: () => {}
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
