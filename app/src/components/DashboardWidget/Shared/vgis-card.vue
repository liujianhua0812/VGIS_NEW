<template>
    <div class="vgis-card" :style="{ padding }">
        <div v-if="title" class="vgis-card-title">
            {{title}}
        </div>
        <slot></slot>
    </div>
</template>

<script>
export default {
  name: "vgis-card",
  props: {
    title: String,
    noHeader: Boolean,
    padding: String
  },
  computed: {
    flex() {
      let parent = this.$parent;
      while (parent && parent.$options._componentTag !== "vgis-cell") {
        parent = parent.$parent;
      }
      return !!parent;
    }
  }
};
</script>

<style lang="scss" scoped>
.vgis-card {
    padding: 32px;
    border-radius: 16px;
    background: rgba(32, 32, 32, 0.70);

    .vgis-card-title {
        color: #FFFFFF;
        /* 标题 */
        font-family: "HarmonyOS Sans SC";
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px; /* 110% */
        margin-bottom: 14px;
        padding-bottom: 14px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.30);
    }
}
</style>
