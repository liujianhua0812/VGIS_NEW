<template>
  <div class="vgis-header">
    <div class="vgis-header-content">
      <router-link to="/">
        <div class="vgis-name">{{config.name}}</div>
      </router-link>
        <div class="vgis-header-nav">
            <router-link :class="['vgis-header-nav-item', { active: nav_match(_page.id) }]" v-for="_page in pages" :key="_page.value" :to="{ name: _page.value }">
                {{_page.name}}
            </router-link>
        </div>
      <router-link v-auth="{ resources: 'Map Tool' }" :class="['no-decoration', `vgis-text-xl`, `m-r-20`, 'el-icon-map-location']" style="border: solid 2px #4FACFF; color: #4FACFF; padding: 5px; border-radius: 4px;" to="/map"></router-link>
    </div>
  </div>
</template>

<script>

  import config from "@/config";
  export default {
    name: "vgis-header",
    data() {
      return {
      config,
        pages: [{
            id: "Overview",
          name: '主界面',
          value: `Overview`,
          privilege: ''
        }, {
            id: "Energy",
          name: '能耗管理',
          value: `EnergyOverview`,
          privilege: ''
        }, {
            id: "Environment",
          name: '人员环境及区域监控',
          value: `Environment`,
          privilege: ''
        }, {
            id: "Equipment",
          name: '设备管理',
          value: `Equipment`,
          privilege: ''
        }]
      }
    },
      methods: {
          nav_match (name) {
              return !!this.$route.matched.find(item => item.name === name)
          }
      }
  }
</script>

<style lang="scss" scoped>
.vgis-header {
    height: 60px;
    width: 100%;
    background: #0E223D;
    border-bottom: 1px solid #696969;

    .vgis-header-content {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .vgis-name {
            color: #FFFFFF;
            font-size: 16px;
            margin-left: 24px;
        }

        .vgis-header-nav {
            border-radius: 3px;
            background: #223753;
            padding: 2px;

            .vgis-header-nav-item {
                display: inline-block;
                color: rgba(255, 255, 255, 0.60);
                text-align: center;
                font-family: "HarmonyOS Sans SC";
                text-decoration: none;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px; /* 157.143% */
                width: 180px;
                border-radius: 2px;
                background: #223753;
                margin: 0 4px;
                padding: 3px 0;
            }

            .vgis-header-nav-item:first-child {
                margin-left: 0;
            }

            .vgis-header-nav-item:last-child {
                margin-right: 0;
            }

            .vgis-header-nav-item.active {
                color: #FFFFFF;
                background: #2B6CC3;
            }
        }
    }

}
</style>
