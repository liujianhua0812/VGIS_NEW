<template>
    <div class="page-container">
        <vue-headful :title="`${title}`"/>
        <vgis-breadcrumb :light="false" class="m-l-24 m-r-24" :navs="navs"></vgis-breadcrumb>
        <div class="page-title" v-if="$slots.header">
            <slot name="header"></slot>
        </div>
        <div class="page-title" v-else-if="pageName">
            {{pageName}}
        </div>
        <div :class="['page-content', { background }]">
            <slot></slot>
        </div>
    </div>
</template>

<script>

import config from "@/config"
import VgisBreadcrumb from "@/components/Standard/vgis-breadcrumb.vue";

export default {
    name: "vgis-page",
    props: {
        navs: Array,
        pageName: String,
        background: Boolean
    },
    components: {
        VgisBreadcrumb
    },
    computed: {
        title () {
            return `${config.name} - ${this.pageName}`
        }
    }
}
</script>

<style lang="scss" scoped>
  .page-container {
      height: calc(100% - 22px);
      margin-top: 7px;
      font-family: "HarmonyOS Sans SC";

      .page-title {
          margin: 26px 24px 12px 24px;
          color: #FFFFFF;
          /* H3/medium */
          font-size: 24px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
      }

      .page-content {
          width: calc(100% - 48px);
          height: calc(100% - 116px);
          padding-bottom: 24px;
          padding-left: 24px;
          padding-right: 24px;
      }

      .page-content.background {
          background: #002766;
          margin-left: 0;
          margin-right: 0;
      }
  }
</style>