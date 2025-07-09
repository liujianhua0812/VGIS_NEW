<template>
  <div :class="`${isPC ? '' : 'noc-'}vgis-title`">
    <span :class="`${isPC ? '' : 'noc-'}vgis-title-decorator-head`"></span>
    <span :class="`${isPC ? '' : 'noc-'}vgis-title-decorator`"></span>
    <span :class="`${isPC ? '' : 'noc-'}vgis-title-content`">{{content}}</span>
    <span :class="`${isPC ? '' : 'noc-'}vgis-title-decorator`"></span>
    <span :class="`${isPC ? '' : 'noc-'}vgis-title-decorator-head`"></span>
  </div>
</template>

<script>
    export default {
        name: "vgis-title",
        props: {
          content: String
        },
        computed: {
          isPC () {
            return this.$route.name.match(/PC/) ? 'PC' : ''
          }
        },
    }
</script>

<style lang="scss" scoped>

  @each $affix in [noc-vgis vgis] {
    .#{$affix}-title {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 0 20px;
      height: 42px;
      border: 2px solid #4FACFF;
      background: rgba(79, 172, 255, 0.3);
    }

    .#{$affix}-title-content {
      margin: 0 20px;
      font-size: 24px;
      font-family: AlibabaSans-Bold, AlibabaSans;
      font-weight: bold;
      color: #FFFFFF;
      line-height: 38px;
    }

    .#{$affix}-title-decorator {
      flex: 1;
      border: 1px solid #4FACFF;
    }

    .#{$affix}-title-decorator-head {
      width: 16px;
      height: 16px;
      border-radius: 8px;
      background: #4FACFF;
    }
  }

</style>
