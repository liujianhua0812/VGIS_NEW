<template>
    <el-row class="m-t-20 m-l-20 m-r-20 m-b-20">
        <el-col :span="24">
            <h3>{{ $t("label.home.stat.general") }}</h3>
            <el-row :gutter="10" class="m-b-20">
                <el-col :span="6">
                    <el-card body-style="border-left: 5px solid #4FACFF">
                        <div class="flex align-items-center justify-content-between">
                            <div>
                                <div class="text-bold">{{ $t("label.home.stat.instance") }}</div>
                                <div class="text-large text-bold" style="color: #4FACFF;">{{ stat.general.instance || 0 }}</div>
                            </div>
                            <i class="iconfont icon-a-processdiagram text-xl" style="color: #4FACFF;"></i>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card body-style="border-left: 5px solid #F56C6C">
                        <div class="flex align-items-center justify-content-between">
                            <div>
                                <div class="text-bold">{{ $t("label.home.stat.alert") }}</div>
                                <div class="text-large text-bold text-danger">{{ stat.general.alert || 0 }}</div>
                            </div>
                            <i class="iconfont icon-sercurity-incident text-xl text-danger"></i>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card body-style="border-left: 5px solid #67C23A">
                        <div class="flex align-items-center justify-content-between">
                            <div>
                                <div class="text-bold">{{ $t("label.home.stat.event") }}</div>
                                <div class="text-large text-bold text-success">{{ stat.general.event || 0 }}</div>
                            </div>
                            <i class="iconfont icon-list text-xl text-success"></i>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card body-style="border-left: 5px solid #E6A23C">
                        <div class="flex align-items-center justify-content-between">
                            <div>
                                <div class="text-bold">{{ $t("label.home.stat.user") }}</div>
                                <div class="text-large text-bold text-warning">{{ stat.general.user || 0 }}</div>
                            </div>
                            <i class="iconfont icon-account text-xl text-warning"></i>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-card>
                        <template slot="header">
                            <h3 class="text-bold m-b-0">{{ $t("label.home.application") }}</h3>
                        </template>
                        <div class="m-b-20" v-for="item in menus" :key="item.name"
                                 v-auth="{resources: item.privilege}">
                            <div class="app-title">{{ $t(item.name) }}</div>
                            <el-row :gutter="10">
                                <el-col :span="8" :key="subitem.name" v-for="subitem in item.children" v-auth="{resources: subitem.privilege || item.privilege }">
                                    <div class="menu-entry-item m-r-20" @click="redirectToEntry(subitem)">
                                        <div :class="['iconfont', 'item-icon', subitem.icon]"></div>
                                        <div class="entry-title">{{ $t(subitem.label) }}</div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card class="m-b-20">
                        <template slot="header">
                            <h3 class="text-bold m-b-0">{{ $t("label.home.stat.alertCalendar") }}</h3>
                        </template>
                        <v-chart autoresize style="width: 100%; height: 200px;" :option="alertOptions"></v-chart>
                    </el-card>
                    <el-card class="m-b-20">
                        <template slot="header">
                            <h3 class="text-bold m-b-0">{{ $t("label.home.stat.seriesHistory") }}</h3>
                        </template>
                        <v-chart autoresize style="width: 100%; height: 200px;" :option="seriesOptions"></v-chart>
                    </el-card>
                    <el-card>
                        <template slot="header">
                            <h3 class="text-bold m-b-0">{{ $t("label.home.stat.instanceCount") }}</h3>
                        </template>
                        <v-chart autoresize style="width: 100%; height: 200px;" :option="instanceOptions"></v-chart>
                    </el-card>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>

import config from '../../config'
import {getGeneralStat, getSeriesStat, getInstanceStat, getAlertStat} from "@/assets/js/api/stat";

export default {
    name: "HomePage",
    computed: {
        seriesOptions() {
            let that = this
            return {
                grid: {
                    top: 10,
                    left: 40,
                    right: 10,
                    bottom: 40,
                },
                tooltip: {
                    show: true,
                    formatter (params) {
                        return `
                        <p class="m-b-5 text-regular"><b class="text-black">${that.$t("label.home.stat.time")}</b>&nbsp;${params.data[0].format(that.$t("dict.date.ymdh"))}</p>
                        <p class="text-success text-regular m-b-0"><b class="text-black">${that.$t("label.home.stat.count")}</b>&nbsp;${params.data[1]}</p>
`
                    }
                },
                xAxis: {
                    type: "time",
                    axisLabel: {
                        formatter (value) {
                            let date = new Date(value)
                            if (date.getHours() === 0) {
                                return date.format("yyyy-MM-dd")
                            }
                            else {
                                return `${date.getHours()}`
                            }
                        }
                    }
                },
                yAxis: {
                    type: "value"
                },
                series: {
                    type: "line",
                    data: this.stat.series.map(item => [new Date(item.time_h), parseInt(item.count)]),
                    itemStyle: {
                        color: "#67C23A"
                    },
                    smooth: false
                }
            }
        },
        instanceOptions() {
            return {
                grid: {
                    top: 10,
                    left: 40,
                    right: 10,
                },
                tooltip: {
                    show: true
                },
                xAxis: {
                    type: "category",
                    data: this.stat.instance.map(item => item.name),
                    axisLabel: {
                        rotate: 45
                    }
                },
                yAxis: {
                    type: "value"
                },
                series: {
                    type: "bar",
                    data: this.stat.instance.map(item => parseInt(item.count)),
                    itemStyle: {
                        color: "#027AFF"
                    }
                }
            }
        },
        alertOptions() {
            let that = this
            return {
                tooltip: {
                    formatter (params) {
                        return `
                        <p class="m-b-5 text-regular"><b class="text-black">${that.$t("label.home.stat.date")}</b>&nbsp;${new Date(params.data[0]).format(that.$t("dict.date.simple"))}</p>
                        <p class="text-success text-regular m-b-0" style="color: ${params.color};"><b class="text-black">${that.$t("label.home.stat.count")}</b>&nbsp;${params.data[1]}</p>
`
                    }
                },
                visualMap: {
                    min: 0,
                    max: 20,
                    maxOpen: true,
                    type: 'piecewise',
                    orient: 'horizontal',
                    left: 'center',
                    top: 0,
                    color: ['#bf444c', '#d88273', '#f6dda6']
                },
                calendar: {
                    top: 70,
                    left: 30,
                    right: 30,
                    cellSize: ['auto', 16],
                    range: new Date().getFullYear(),
                    itemStyle: {
                        borderWidth: 0.5
                    },
                    yearLabel: { show: false }
                },
                series: {
                    type: 'heatmap',
                    coordinateSystem: 'calendar',
                    data: this.stat.alert.map(item => [ new Date(item.date).format("yyyy-MM-dd"), parseInt(item.count) ])
                }
            }
        }
    },
    data() {
        return {
            menus: [{
                name: 'menu.accessSecurity',
                privilege: 'Access Security',
                children: [{
                    name: 'accounts',
                    label: 'menu.account',
                    icon: 'icon-account',
                    privilege: 'Account'
                }, {
                    name: 'privilege',
                    label: 'menu.privilege',
                    icon: 'icon-privilege',
                    privilege: 'Privilege'
                }]
            }, {
                name: 'menu.data',
                privilege: 'Data',
                children: [{
                    name: 'ModelListPage',
                    label: 'menu.hierarchy',
                    icon: 'icon-list',
                    privilege: 'Table'
                }, {
                    name: 'CCTVPage',
                    label: 'menu.cctv',
                    icon: 'icon-cctv',
                    privilege: 'CCTV'
                }, {
                    name: 'DataTablePage',
                    label: 'menu.table',
                    icon: 'icon-layers',
                    privilege: 'Table'
                }, {
                    name: 'ProcessDiagramList',
                    label: 'menu.pid',
                    icon: 'icon-a-processdiagram',
                    privilege: 'Process Diagram'
                }]
            }, {
                name: 'menu.dashboard',
                privilege: 'Dashboard',
                children: [{
                    name: 'Overview',
                    label: 'menu.overviewDashboard',
                    icon: 'icon-overview',
                    privilege: 'Overview'
                }, {
                    name: 'PID',
                    label: 'menu.pidDashboard',
                    icon: 'icon-overview',
                    privilege: 'PID'
                }, {
                    name: 'EnergyOverview',
                    label: 'menu.energyManagement',
                    icon: 'icon-overview',
                    privilege: 'Production'
                }, {
                    name: 'PowerSavingOverview',
                    label: 'menu.powerSaving',
                    icon: 'icon-overview',
                    privilege: 'HSSE'
                }, {
                    name: 'MalfunctionOverview',
                    label: 'menu.malfunction',
                    icon: 'icon-overview',
                    privilege: 'HSSE'
                }, {
                    name: 'MaintenanceHistory',
                    label: 'menu.maintenance',
                    icon: 'icon-overview',
                    privilege: 'HSSE'
                }, {
                    name: 'DataHistory',
                    label: 'menu.graph',
                    icon: 'icon-overview',
                    privilege: 'HSSE'
                }, {
                    name: 'EquipmentRunningSchedule',
                    label: 'menu.device',
                    icon: 'icon-overview',
                    privilege: 'HSSE'
                }, {
                    name: 'LogbookHistory',
                    label: 'menu.logbook',
                    icon: 'icon-overview',
                    privilege: 'HSSE'
                }]
            }],
            stat: {
                general: {},
                series: [],
                instance: [],
                alert: [],
            },
            reportStat: {}
        }
    },
    methods: {
        getGeneralStat() {
            getGeneralStat().then(result => {
                this.stat.general = result.data
            })
        },
        getInstanceStat() {
            getInstanceStat().then(result => {
                this.stat.instance = result.data
            })
        },
        getSeriesStat() {
            let endAt = new Date()
            let startAt = new Date(endAt.getTime())
            startAt.setDate(startAt.getDate() - 7)
            getSeriesStat({
                startAt, endAt
            }).then(result => {
                this.stat.series = result.data
            })
        },
        getAlertStat() {
            getAlertStat().then(result => {
                this.stat.alert = result.data
            })
        },
        redirectToEntry(entry) {
            if (entry.url) {
                window.location.href = `${config[entry.module].host}${entry.url}`
            } else {
                this.$router.push({name: entry.name, query: entry.query || {}})
            }
        }
    },
    created() {
        this.getGeneralStat()
        this.getSeriesStat()
        this.getInstanceStat()
        this.getAlertStat()
    }
}
</script>

<style lang="scss" scoped>

.app-title {
    font-size: 16px;
    border-left: 5px solid #A0A0A0;
    background: #FAFAFA;
    padding: 10px;
}

.menu-entry-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    background: rgba(50, 80, 178, 0.08);
    border-radius: 4px;
    padding: 10px;
    margin-top: 15px;

    .entry-title {
        font-size: 16px;
        font-family: Boston-Regular, Boston;
        font-weight: 400;
        color: #000000;
    }

    .item-icon {
        font-size: 32px;
        line-height: 32px;
        color: #3250B2;
        margin-right: 10px;
    }
}

</style>
