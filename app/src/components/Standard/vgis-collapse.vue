<template>
<!--  <div :class="[`${isPC ? '' : 'noc-'}vgis-collapse`, style]">-->
    <div :class="[`${isPC ? '' : 'noc-'}vgis-collapse`, collapseStyle]">
    <div :class="['vgis-collapse-title', { active: value }]" @click="toggleCollapse">
      {{title}}
      <i :class="['vgis-collapse-caret', 'pull-right', {'el-icon-arrow-down': !value, 'el-icon-arrow-up': value}]"></i>
    </div>
    <div :class="['vgis-collapse-body', { active: value }]" v-if="value">
      <slot></slot>
    </div>
  </div>
</template>

<script>
    export default {
        name: "vgis-collapse",
        props: {
          title: {
            type: String,
            default: 'Collapse'
          },
          value: {
            type: Boolean,
            default: false
          },
          collapseStyle: {
            type: String,
            default: 'dark'
          }
        },
        computed: {
          isPC() {
            return this.$route.name.match(/PC/) ? 'PC' : ''
          },
        },
        methods: {
          toggleCollapse () {
            this.$emit('input', !this.value)
          }
        }
    }
</script>

<style lang="scss" scoped>
  @each $affix in [noc-vgis vgis] {
    .#{$affix}-collapse.dark {
      display: inline-block;
      position: relative;

      .vgis-collapse-title {
        border-radius: 3px;
        border-bottom: 1px #A5A5A5 solid;
        background: rgba(51, 51, 51, 0.7);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        font-style: normal;
        font-weight: 900;
        font-size: 20px;
        line-height: 23px;
        color: #4FACFF;
        cursor: pointer;
        width: 100%;
      }

      .vgis-collapse-title.active {
        border-radius: 3px 3px 0 0;
      }

      .vgis-collapse-caret {
        font-style: normal;
        font-weight: 900;
        font-size: 20px;
        line-height: 23px;
        color: #FFF;
      }

      .vgis-collapse-body {
        border-radius: 3px;
        background: rgba(51, 51, 51, 0.7);
        backdrop-filter: blur(8px);
        position: absolute;
        width: 100%;
        z-index: 999;
      }

      .vgis-collapse-body.active {
        border-radius: 0 0 3px 3px
      }
    }
  }
</style>
