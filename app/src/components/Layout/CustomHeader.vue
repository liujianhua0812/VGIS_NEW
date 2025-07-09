<template>
  <header class="header">
      <h3 class="site-title">
          <router-link to="/">{{siteName}}</router-link>
      </h3>
      <el-menu menu-trigger="hover" class="custom-nav-bar" :default-active="defaultActiveIndex" mode="horizontal" @select="selectMenuItem">
          <component popper-class="custom-submenu" :index="item.id" :is="item.children ? 'el-submenu' : 'el-menu-item'" v-for="item in menu">
              <template slot="title">{{item.name}}</template>
              <component :index="subItem.id" :is="subItem.children ? 'el-submenu' : 'el-menu-item'" v-for="subItem in item.children">
                  <template slot="title">{{subItem.name}}</template>
                  <el-menu-item :index="subSubItem.id" v-for="subSubItem in subItem.children">{{subSubItem.name}}</el-menu-item>
              </component>
          </component>
      </el-menu>
      <div class="profile-toolbox">
          <i class="iconfont icon-user"></i>
          <span class="username">{{currentUser}}</span>
          <router-link to="/admin">
              <i class="iconfont icon-setting"></i>
          </router-link>
          <router-link to="/log/history">
              <i class="iconfont icon-log-book"></i>
          </router-link>
          <el-button class="p-t-0 p-b-0" type="text" @click="signOut">
              <i class="iconfont icon-logout"></i>
          </el-button>
      </div>
      <GeneralDocuments dialog-id="documentList" :dialog-visibility="dialogVisibilities.documentList" @action-finished="actionFinished"></GeneralDocuments>
  </header>
</template>

<script>
import config from "@/config"
import {signOut} from "@/assets/js/api/sso";
import GeneralDocuments from "@/components/DashboardWidget/Maintenance/Regulation/GeneralDocuments.vue";
import {getDiagrams} from "@/assets/js/api/pid";
import {getNodesByModel} from "@/assets/js/api/hierarchy";
export default {
    name: "CustomHeader",
    components: {GeneralDocuments},
    computed: {
        menu () {
            let processMenu = {
                id: "2",
                name: "实时监控",
                type: "Placeholder",
                children: []
            }
            let stationMenu = []

            for(let i = 0; i < this.coolingStations.length; i++) {
                let station = this.coolingStations[i]
                stationMenu.push({
                    id: `4-${i + 2}`,
                    name: station.name,
                    type: "Placeholder",
                    children: [{
                        id: `4-${i + 2}-1`,
                        name: "概览",
                        target: `/ps/cooling?station=${station.id}`,
                        type: "Page",
                    }, {
                        id: `4-${i + 2}-2`,
                        name: "冷水机组",
                        target: `/ps/cooling/chiller?station=${station.id}`,
                        type: "Page",
                    }, {
                        id: `4-${i + 2}-3`,
                        name: "冷却水系统",
                        target: `/ps/cooling/system?station=${station.id}`,
                        type: "Page",
                    }, {
                        id: `4-${i + 2}-4`,
                        name: "冷却水泵",
                        target: `/ps/cooling/pump?station=${station.id}`,
                        type: "Page",
                    }, {
                        id: `4-${i + 2}-5`,
                        name: "冷却塔",
                        target: `/ps/cooling/tower?station=${station.id}`,
                        type: "Page",
                    }, {
                        id: `4-${i + 2}-6`,
                        name: "冷冻水系统",
                        target: `/ps/freezing/system`,
                        type: "Page",
                    }, {
                        id: `4-${i + 2}-7`,
                        name: `冷冻水泵`,
                        target: `/ps/freezing/pump?station=${station.id}`,
                        type: "Page",
                    }]
                })
            }

            for(let i = 0; i < this.airCompressionStations.length; i++) {
                let station = this.airCompressionStations[i]
                stationMenu.push({
                    id: `4-${i + 2 + this.coolingStations.length}`,
                    name: station.name,
                    type: "Placeholder",
                    children: [{
                        id: `4-${i + 2 + this.coolingStations.length}-1`,
                        name: "概览",
                        target: `/ps/air?station=${station.id}`,
                        type: "Page",
                    }, {
                        id: `4-${i + 2 + this.coolingStations.length}-2`,
                        name: "空压机",
                        target: `/ps/air/compressor?station=${station.id}`,
                        type: "Page",
                    }]
                })
            }

            let result = [{
                id: "1",
                name: "概览",
                target: "/",
                type: "Page"
            }, processMenu, {
                id: "3",
                name: "能碳管理",
                type: "Placeholder",
                children: [{
                    id: "3-1",
                    name: "概览",
                    target: "/energy",
                    type: "Page",
                }, {
                    id: "3-2",
                    name: "参数管理",
                    target: "/energy/parameter",
                    type: "Page",
                }, {
                    id: "3-3",
                    name: "碳资产管理",
                    target: "/energy/asset",
                    type: "Page",
                }, {
                    id: "3-4",
                    name: "碳盘查报告",
                    target: "/energy/report",
                    type: "Page",
                }]
            }, {
                id: "4",
                name: "节能管理",
                type: "Placeholder",
                children: [{
                    id: "4-1",
                    name: "概览",
                    target: "/ps",
                    type: "Page",
                }].concat(stationMenu).concat([{
                    id: "4-4",
                    name: "历史记录",
                    target: "/ps/history",
                    type: "Page",
                }])
            }, {
                id: "5",
                name: "故障管理",
                type: "Placeholder",
                children: [{
                    id: "5-1",
                    name: "概览",
                    target: "/malfunction",
                    type: "Page",
                }, {
                    id: "5-2",
                    name: "历史记录",
                    target: "/malfunction/history",
                    type: "Page",
                }]
            }, {
                id: "6",
                name: "维保管理",
                type: "Placeholder",
                children: [{
                    id: "6-1",
                    name: "维保规范",
                    type: "Dialog",
                    trigger: "ShowMaintenanceStandardDialog"
                }, {
                    id: "6-2",
                    name: "维保计划",
                    target: "/maintenance/schedule",
                    type: "Page",
                }, {
                    id: "6-3",
                    name: "历史记录",
                    target: "/maintenance/history",
                    type: "Page",
                }]
            }, {
                id: "7",
                name: "报表管理",
                type: "Placeholder",
                children: [{
                    id: "7-1",
                    name: "历史记录",
                    target: "/graph/history",
                    type: "Page",
                }, {
                    id: "7-2",
                    name: "自定义报表",
                    target: "/graph/custom",
                    type: "Page",
                }]
            }, {
                id: "8",
                name: "设备管理",
                type: "Placeholder",
                children: [{
                    id: "8-1",
                    name: "运行计划",
                    target: "/equipment/schedule",
                    type: "Page",
                }]
            }]

            processMenu.children = this.diagrams.map((item, index) => ({
                id: `2-${index + 1}`,
                name: item.name,
                type: "Page",
                target: `/process/${item.id}`
            }))
            return result
        },
        siteName () {
            return this.$store.state.setting.siteName || config.name
        },
        currentUser () {
            return this.$store.state.user.accountName
        },
        defaultActiveIndex () {
            let activePath = this.$route.path
            for(let i = 0; i < this.menu.length; i++) {
                let item = this.menu[i]
                if (item.target === activePath) {
                    return item.id
                }
                else if (item.children) {
                    for(let j = 0; j < item.children.length; j++) {
                        let subItem = item.children[j]
                        if (subItem.target === activePath) {
                            return subItem.id
                        }
                        else if (subItem.children) {
                            for(let k = 0; k < subItem.children.length; k++) {
                                let subSubItem = subItem.children[k]
                                if (subSubItem.target === activePath) {
                                    return subSubItem.id
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    data () {
        return {
            diagrams: [],
            coolingStations: [],
            airCompressionStations: [],
            dialogVisibilities: {
                documentList: false
            }
        }
    },
    methods: {
        actionFinished (success, dialogId) {
            this.dialogVisibilities[dialogId] = false
        },
        menuClicked (menu) {
            if (menu.type === "Page") {
                this.$router.push(menu.target)
            }
        },
        selectMenuItem (key, keyPath) {
            let result = this.menu
            for(let i = 0; i < keyPath.length; i++) {
                let index = keyPath[i]
                let item = null
                for(let j = 0; j < result.length; j++) {
                    if (result[j].id === index) {
                        item = result[j]
                        break
                    }
                }
                if (item) {
                    if (i !== keyPath.length - 1) {
                        result = item.children
                    }
                    else {
                        result = item
                    }
                }
                else {
                    result = null
                    break
                }
            }
            if (result) {
                if (result.type === "Page") {
                    this.$router.push(result.target)
                }
                else if (result.type === "Dialog") {
                    this[result.trigger]()
                }
            }
        },
        ShowMaintenanceStandardDialog () {
            this.dialogVisibilities.documentList = true
        },
        signOut() {
            this.$confirm(this.$t("message.shared.signOut")).then(() => {
                signOut().then(result => {
                    this.$message({
                        type: 'success',
                        message: this.$t("message.shared.signedOut")
                    })
                    this.$router.replace({name: 'SignInPage'})
                })
            }).catch(() => {
            })
        },
        getDiagrams () {
            getDiagrams({ published: true }).then(result => {
                this.diagrams = result.data
            })
        },
        getStations () {
            getNodesByModel("CoolingStation").then(result => {
                this.coolingStations = result.data
            })
            getNodesByModel("AirCompressionStation").then(result => {
                this.airCompressionStations = result.data
            })
        }
    },
    created() {
        this.getDiagrams()
        this.getStations()
    }
}
</script>

<style lang="scss" scoped>
  .header {
      height: 60px;
      padding: 7px 24px;
      background: #002766;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .site-title {
          color: #FFFFFF;
          font-family: "HarmonyOS Sans SC";
          font-size: 22px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;

          a {
              color: #FFFFFF;
              text-decoration: none;
          }
      }

      .profile-toolbox {
          display: flex;
          align-items: center;

          .username {
              color: #FFFFFF;
              font-size: 16px;
              font-style: normal;
              font-weight: 400;
              line-height: normal;
              margin-left: 4px;
          }

          i {
              font-size: 28px;
              color: #FFFFFF;
              text-decoration: none;
              margin-left: 16px;
          }
      }
  }
</style>

<style lang="scss">
  ul.custom-nav-bar {
    background: transparent;
    border-bottom: none !important;

    >li.el-menu-item {
      color: #FFFFFF;
    }
    >li.el-menu-item:hover {
      color: #1890FF !important;
      background: rgba(24, 144, 255, 0.2) !important;
      border-bottom: 2px solid #1890FF !important;
    }
    > li.el-menu-item.is-active {
      color: #1890FF;
      border-bottom: 2px solid #1890FF !important;
    }

    li.el-submenu .el-submenu__title {
      color: #FFFFFF !important;
    }
    > li.el-submenu:hover {
      background: transparent !important;
    }
    > li.el-submenu:hover .el-submenu__title {
      color: #1890FF !important;
      background: rgba(24, 144, 255, 0.2) !important;
      border-bottom: 2px solid #1890FF !important;
      i {
        color: #1890FF !important;
      }
    }
    > li.el-submenu.is-active .el-submenu__title {
      color: #1890FF !important;
      border-bottom: 2px solid #1890FF !important;
      i {
        color: #1890FF !important;
      }
    }
  }

  .custom-submenu ul.el-menu {
    background: #003A8C;

    > li.el-menu-item {
      background: #003A8C;
      color: #FFFFFF;
    }
    > li.el-menu-item:hover {
      background: #40A9FF;
      color: #FFFFFF;
    }
    > li.el-menu-item.is-active {
      background: #40A9FF;
      color: #FFFFFF;
    }

    > li.el-submenu .el-submenu__title {
      background: #003A8C;
      color: #FFFFFF;
      i {
        color: #FFFFFF;
      }
    }
    > li.el-submenu.is-active .el-submenu__title {
      background: #40A9FF;
      color: #FFFFFF;
      i {
        color: #FFFFFF;
      }
    }
  }
</style>