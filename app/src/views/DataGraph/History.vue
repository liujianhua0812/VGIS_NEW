<template>
    <vgis-page :navs="navs" :page-name="pageTitle">
        <template slot="header">
            <div class="flex align-items-center justify-content-between">
                {{pageTitle}}
                <div class="view-selector flex align-items-center">
                    <i :class="['iconfont icon-table', { active: currentTab === 'table' }]" @click="currentTab = 'table'"></i>
                    <i :class="['iconfont icon-sum', { active: currentTab === 'chart' }]" @click="currentTab = 'chart'" v-if="selectedPoint && ['Decimal', 'Integer'].includes(selectedPoint.dataType)"></i>
                </div>
            </div>
        </template>
        <vgis-row :gutter="24" class="full-h">
            <vgis-col :span="12" class="full-h">
                <vgis-cell class="full-h">
                    <vgis-point-tree-card v-model="selectedPoint"></vgis-point-tree-card>
                </vgis-cell>
            </vgis-col>
            <vgis-col :span="60" class="full-h">
                <vgis-cell class="full-h">
                    <div class="m-b-24">
                        <div class="filters p-t-12 p-b-12 p-l-24 p-r-24 flex align-items-center justify-content-between">
                            <vgis-date-selector v-model="timeRange"></vgis-date-selector>
                            <div class="flex align-items-center">
                                <el-button size="small" class="power-primary" v-if="currentTab === 'table' && selectedPoint && !selectedPoint.isVirtual" @click="addRecord">添加</el-button>
                                <el-button size="small" class="power-primary" v-if="currentTab === 'table'" @click="exportRecords">导出</el-button>
                                <el-button size="small" class="power-danger-outline" v-if="currentTab === 'table' && !selectedPoint.isVirtual" @click="bulkDeleteRecords">删除</el-button>
                                <el-button size="small" class="power-primary" v-if="currentTab === 'chart'" @click="exportChart">下载</el-button>
                            </div>
                        </div>
                    </div>
                    <TableView ref="table" :point="selectedPoint" :time-range="timeRange" v-if="currentTab === 'table'"></TableView>
                    <LineChartView ref="chart" :point="selectedPoint" :time-range="timeRange" v-if="currentTab === 'chart'"></LineChartView>
                </vgis-cell>
            </vgis-col>
        </vgis-row>
        <AddEditRecord v-if="dialogVisibility.addRecord" dialog-id="addRecord" :point="selectedPoint" :dialog-visibility="dialogVisibility.addRecord" :record="formData" @action-finished="actionFinished"></AddEditRecord>
    </vgis-page>
</template>

<script>
import VgisRow from "@/components/Standard/vgis-row.vue";
import VgisPage from "@/components/Standard/vgis-page.vue";
import VgisFlexColumn from "@/components/Standard/vgis-flex-column.vue";
import VgisCol from "@/components/Standard/vgis-col.vue";
import VgisCell from "@/components/Standard/vgis-cell.vue";
import VgisDeviceTreeCard from "@/components/DashboardWidget/Shared/vgis-device-tree-card.vue";
import config from "@/config";
import TableView from "@/components/DashboardWidget/DataGraph/History/TableView.vue";
import LineChartView from "@/components/DashboardWidget/DataGraph/History/LineChartView.vue";
import VgisPersonSelector from "@/components/DashboardWidget/Shared/vgis-person-selector.vue";
import VgisSimpleDatetimeSelector from "@/components/DashboardWidget/Shared/vgis-simple-datetime-selector.vue";
import VgisDateSelector from "@/components/DashboardWidget/Shared/vgis-date-selector.vue";
import VgisPointTreeCard from "@/components/DashboardWidget/Shared/vgis-point-tree-card.vue";
import AddEditRecord from "@/components/DashboardWidget/DataGraph/History/AddEditRecord.vue";
import {deleteInstanceSeriesValue} from "@/assets/js/api/model-instance-series";

export default {
    name: "History",
    components: {
        AddEditRecord,
        VgisPointTreeCard,
        VgisDateSelector,
        VgisSimpleDatetimeSelector, VgisPersonSelector,
        LineChartView,
        TableView,
        VgisCell,
        VgisCol,
        VgisFlexColumn,
        VgisPage,
        VgisRow,
        VgisDeviceTreeCard
    },
    computed: {
        title () {
            return `${config.name} - ${this.pageTitle}`
        }
    },
    data () {
        let endDate = new Date(), startDate = new Date(endDate.getTime())
        startDate.setDate(endDate.getDate() - 30)
        return {
            currentTab: "table",
            pageTitle: "历史数据",
            navs: [{
                name: "总览",
                link: "/"
            }, {
                name: "报表管理"
            }, {
                name: "历史数据"
            }],
            selectedPoint: "",
            timeRange: [startDate, endDate],
            dialogVisibility: {
                addRecord: false
            },
            formData: {}
        }
    },
    methods: {
        actionFinished (success, dialogId) {
            this.dialogVisibility[dialogId] = false
            if (success) {
                if (this.$refs.chart) {
                    this.$refs.chart.refreshData()
                }
                if (this.$refs.table) {
                    this.$refs.table.refreshData()
                }
            }
        },
        exportRecords () {
            this.$refs.table.download()
        },
        exportChart () {
            this.$refs.chart.download()
        },
        addRecord () {
            this.dialogVisibility.addRecord = true
        },
        bulkDeleteRecords () {
            this.$refs.table.bulkDeleteRecords()
        }
    }
}
</script>

<style scoped>
.view-selector {
    i {
        border-radius: 4px;
        background: #8C8C8C;
        padding: 4px;
        font-size: 24px;
        line-height: 24px;
        cursor: pointer;
        margin-left: 8px;
    }

    i.active {
        background: #1890FF;
    }
}

.filters {
    background: #002766;
    border-radius: 16px;

    >i {
        color: #FFFFFF;
        font-family: "HarmonyOS Sans SC";
        font-size: 24px;
        font-style: normal;
        font-weight: 400;
        margin-right: 8px;
    }

    >label {
        color: #FFFFFF;
        font-family: "HarmonyOS Sans SC";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        margin-right: 8px;
        margin-left: 32px;
    }
}
</style>