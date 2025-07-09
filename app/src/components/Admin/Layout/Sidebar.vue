<template>
    <div>
        <el-scrollbar class="page-component__scroll">
            <aside class="vgis-admin-menu">
                <el-menu class="vgis-menu" :default-active="activeIndex" @select="togglePage">
                    <el-menu-item index="1">
                        <span slot="title">{{ $t("menu.home") }}</span>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <span slot="title">{{ $t("menu.setting") }}</span>
                    </el-menu-item>
                    <el-menu-item v-auth="{ resources: 'Access Security' }" index="3">
                        <template slot="title">
                            <span>{{ $t("menu.privilege") }}</span>
                        </template>
                    </el-menu-item>
                    <el-menu-item v-auth="{ resources: 'Access Security' }" index="4">
                        <template slot="title">
                            <span>{{ $t("menu.account") }}</span>
                        </template>
                    </el-menu-item>
                    <el-menu-item v-auth="{ resources: 'Model' }" index="5">
                        <template slot="title">
                            <span>{{ $t("menu.hierarchy") }}</span>
                        </template>
                    </el-menu-item>
                    <el-menu-item v-auth="{ resources: 'Data' }" index="6">
                        <template slot="title">
                            <span>{{ $t("menu.pid") }}</span>
                        </template>
                    </el-menu-item>
                    <el-submenu>
                        <template slot="title">
                            <span>前台</span>
                        </template>
                        <el-menu-item v-auth="{ resources: 'Data' }" index="7-1">
                            <template slot="title">
                                <span>{{ $t("menu.overviewDashboard") }}</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item v-auth="{ resources: 'Data' }" index="7-2">
                            <template slot="title">
                                <span>{{ $t("menu.pidDashboard") }}</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item v-auth="{ resources: 'Data' }" index="7-3">
                            <template slot="title">
                                <span>{{ $t("menu.energyManagement") }}</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item v-auth="{ resources: 'Data' }" index="7-4">
                            <template slot="title">
                                <span>{{ $t("menu.powerSaving") }}</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item v-auth="{ resources: 'Data' }" index="7-5">
                            <template slot="title">
                                <span>{{ $t("menu.malfunction") }}</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item v-auth="{ resources: 'Data' }" index="7-6">
                            <template slot="title">
                                <span>{{ $t("menu.maintenance") }}</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item v-auth="{ resources: 'Data' }" index="7-7">
                            <template slot="title">
                                <span>{{ $t("menu.graph") }}</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item v-auth="{ resources: 'Data' }" index="7-8">
                            <template slot="title">
                                <span>{{ $t("menu.device") }}</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item v-auth="{ resources: 'Data' }" index="7-9">
                            <template slot="title">
                                <span>{{ $t("menu.logbook") }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </aside>
        </el-scrollbar>
    </div>

</template>

<script>

import EventBus from "@/utils/EventBus";
import {getDashboardList} from "@/assets/js/api/bidashboard";

export default {
    name: "Sidebar",
    computed: {
        activeIndex() {
            for (let key in this.paths) {
                if (this.paths[key] === this.$route.path) {
                    return key;
                }
            }
            return "home";
        }
    },
    data() {
        return {
            paths: {
                "1": "/admin",
                "2": "/admin/setting",
                "3": "/data/privilege",
                "4": "/data/account",
                "5": "/data/model",
                "6": "/admin/data/pid",
                "7-1": "/",
                "7-2": "/",
                "7-3": "/energy",
                "7-4": "/ps",
                "7-5": "/malfunction",
                "7-6": "/maintenance/history",
                "7-7": "/graph/history",
                "7-8": "/equipment/schedule",
                "7-9": "/log/history",
            },
            dashboards: []
        }
    },
    methods: {
        togglePage(index) {
            if (this.paths[index]) {
                this.$router.push(this.paths[index]);
            } else {
                this.$router.push(`/dashboard/${index}`);
            }
        },
        getDashboards() {
            getDashboardList({published: true}).then(result => {
                this.dashboards = result.data
            })
        },
        addListeners() {
            EventBus.$on("dashboard-updated", this.getDashboards)
        },
        removeListeners() {
            EventBus.$off("dashboard-updated", this.getDashboards)
        }
    },
    created() {
        this.getDashboards()
        this.addListeners()
    },
    beforeDestroy() {
        this.removeListeners()
    }
}
</script>

<style lang="scss" scoped>
.vgis-admin-menu {
    height: calc(100vh - 75px);
    width: 226px;
    background: #56617B;

    ::v-deep .el-menu.vgis-menu {
        > .el-menu-item {
            font-family: 'HarmonyOS Sans';
            font-style: normal;
            font-weight: 700;
            font-size: 16px;
            color: #E3EDFF;
        }
    }

    ::v-deep .el-menu {
        background: #56617B;
        border-right: none;
        width: 100%;

        .el-submenu .el-submenu__title * {
            font-family: 'HarmonyOS Sans';
            font-style: normal;
            font-weight: 700;
            font-size: 16px;
            line-height: 22px;
            color: #E3EDFF;
        }

        .el-submenu .el-submenu__title:hover {
            background: #2C3445;
        }

        .el-menu-item * {
            color: #E3EDFF;
        }

        .el-menu-item:hover {
            background: #2C3445;
        }

        .el-menu-item {
            color: #E3EDFF;
        }

        .el-menu-item.is-active {
            background: #4FACFF;
            color: #E3EDFF;
        }
    }
}
</style>
