<template>
    <div :class="[`${isPC ? '' : 'noc-'}vgis-card`, {
    'vgis-card-flex': flex && isPC,
    'noc-vgis-card-flex': flex && !isPC
  }]">
        <div :class="`${isPC ? '' : 'noc-'}vgis-card-title`" v-if="!noHeader">
            {{title}}
            <slot name="header" v-if="!title"></slot>
        </div>
        <div :class="[`${isPC ? '' : 'noc-'}vgis-card-content`, {
      'vgis-card-content-nh': noHeader && isPC,
      'noc-vgis-card-content-nh': noHeader && !isPC
    }]">
            <slot></slot>
        </div>
    </div>
</template>

<script>

export default {
    name: "vgis-sub-card",
    props: {
        title: String,
        noHeader: Boolean
    },
    computed: {
        isPC () {
            return this.$route.name.match(/PC/) ? 'PC' : ''
        },
        flex() {
            let parent = this.$parent
            while (parent && parent.$options._componentTag !== 'vgis-cell') {
                parent = parent.$parent
            }
            return !!parent
        }
    }
}
</script>

<style lang="scss" scoped>

@each $affix in [noc-vgis vgis] {

    .#{$affix}-card {
        display: block;
        width: 100%;
        height: auto;
        border-radius: 16px;
        background-color: rgba(0, 0, 0, 0.20);
    }

    .#{$affix}-card-flex {
        height: 100%;
    }

    .#{$affix}-card-title {
        color: #FFFFFF;
        font-family: "HarmonyOS Sans SC";
        font-size: 20px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        padding: 0 0 6px 0;
        margin: 19px 24px 0 24px;
    }

    .#{$affix}-card-content {
        margin: 0 24px 24px 24px;
        overflow-y: scroll;
    }

    .#{$affix}-card-flex .#{$affix}-card-content {
        height: calc(100% - 61px);
    }

    .#{$affix}-card-flex .#{$affix}-card-content-nh {
        height: calc(100% - 20px);
    }

}
</style>
