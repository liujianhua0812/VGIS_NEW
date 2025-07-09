<template>
  <div class="bi">
    <custom-header></custom-header>
    <div class="bi-body">
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>

<script>

    import VgisRow from '../Standard/vgis-row'
    import VgisHeader from '../Standard/vgis-header'
    import CustomHeader from "@/components/Layout/CustomHeader.vue";

    export default {
        name: "BIPanel",
        computed: {
          isPC () {
            return this.$route.name.match(/PC/) ? 'PC' : ''
          },
        },
        components: {
          VgisRow,
          CustomHeader
        }
    }
</script>

<style scoped>
  .bi {
    width: 100%;
    height: 100%;
    background: #000C37;
    flex-direction: column;
    flex-wrap: wrap;
    color: #fff;
    overflow: hidden;
    flex-grow: 1;
  }

  .bi-body {
    margin-top: 0;
    height: calc(100% - 60px);
  }
</style>
