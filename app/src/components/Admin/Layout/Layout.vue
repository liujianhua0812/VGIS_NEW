<template>
    <div class="vgis-adm full" style="background: rgb(240, 243, 247)">
      <vgis-admin-header></vgis-admin-header>
      <router-view v-if="$route.meta.hideSideBar" :key="Math.random()"></router-view>
      <div v-else class="admin-body">
        <vgis-admin-sidebar  class="sidebar"></vgis-admin-sidebar>
        <div class="admin-content">
            <router-view style="height: 100%; overflow-y: scroll;" :key="Math.random() + $store.state.setting.language"></router-view>
            <vgis-admin-footer></vgis-admin-footer>
        </div>
      </div>
    </div>
</template>

<script>

    import Header from "./Header";
    import Footer from "./Footer";
    import Sidebar from "./Sidebar"

    export default {
        name: "Layout",
        components: {
          'vgis-admin-header': Header,
          'vgis-admin-footer': Footer,
          'vgis-admin-sidebar': Sidebar
        }
    }
</script>

<style lang="scss">
  .admin-body {
    height: calc(100% - 75px);
    width: 100%;
    display: block;
    text-align: left;
  }

  .sidebar {
    border-top: 1px silver solid;
    display: inline-block;
    height: 100%;
    width: 220px;
    background: white;
    vertical-align: top;
  }

  .admin-content {
    display: inline-block;
    width: calc(100% - 225px);
    height: 100%;
  }

  .el-scrollbar {

      .el-scrollbar__wrap {
        ::-webkit-scrollbar{
          display: block;
        }
        overflow-x: hidden;
        overflow-y: auto;
        height: 100%;
        .el-scrollbar__view {
          height: 100%;
        }
      }
    }

</style>
