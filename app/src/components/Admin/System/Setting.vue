<template>
  <el-dialog append-to-body class="vgis-adm" width="438px" v-auth="{ resources: 'Model', action: 'Admin' }" :title="title"
             :visible.sync="dialogVisibility" @close="close">

  </el-dialog>
</template>

<script>

import Basic from "./Basic";
import Password from "./Password";
import Data from "./Data"
import {getSetting} from "@/assets/js/api/system";

export default {
  name: "Setting",
  components: {
    Basic,
    Password,
    Data
  },
  props: {
    dialogId: String,
    dialogVisibility: Boolean,
  },
  computed: {
    title() {
      return this.$t("form.title.setting")
    }
  },
  data() {
    return {
      setting: {
        language: ""
      },
    }
  },
  methods: {
    close() {
      this.$emit('action-finished', this.dialogId, false)
    },
    getSetting () {
      getSetting().then(result => {
        this.setting = result.data
      })
    }
  },
  created() {
    this.getSetting()
  }
}
</script>
<style lang="scss" scoped>
  .vgis-tab {

    :deep(.el-tabs__nav-scroll) {
      background: #F5F5F5;

      .el-tabs__item {
        text-align: center;
        color: #333333;
      }

      .el-tabs__item.is-active {
        color: #333333;
        background: rgba(79, 172, 255, 0.3);
      }
    }

    :deep(.el-tabs__content) {
      background: #F5F5F5;
      min-height: 100%;
    }
  }
</style>
