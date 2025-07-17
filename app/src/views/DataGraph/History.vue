<template>
    <vgis-page :navs="navs" :page-name="pageTitle">
        <template slot="header">
            <div class="flex align-items-center justify-content-between">
                {{pageTitle}}
                <div class="view-selector flex align-items-center">
                    <i :class="['iconfont icon-table', { active: currentTab === 'table' }]" @click="currentTab = 'table'"></i>
                    <i :class="['iconfont icon-sum', { active: currentTab === 'chart' }]" @click="currentTab = 'chart'" v-if="selectedPoints.length > 0 && selectedPoints.some(point => ['Decimal', 'Integer'].includes(point.dataType))"></i>
                </div>
            </div>
        </template>
        <vgis-row :gutter="24" class="full-h">
            <vgis-col :span="12" class="full-h">
                <vgis-cell class="full-h">
                    <vgis-point-tree-card v-model="selectedPoints" :multiple="true"></vgis-point-tree-card>
                </vgis-cell>
            </vgis-col>
            <vgis-col :span="60" class="full-h">
                <vgis-cell class="full-h">
                    <div class="multi-view-scroll">
                        <div v-for="point in selectedPoints" :key="point.id" class="single-point-view">
                            <div class="point-header">
                                <h3>{{ point.name }}</h3>
                                <div class="point-actions">
                                    <vgis-date-selector v-model="timeRange"></vgis-date-selector>
                                    <div class="flex align-items-center">
                                        <el-button size="small" class="power-primary" v-if="currentTab === 'table' && point && !point.isVirtual" @click="addRecord(point)">添加</el-button>
                                        <el-button size="small" class="power-primary" v-if="currentTab === 'table'" @click="exportRecords(point)">导出</el-button>
                                        <el-button size="small" class="power-danger-outline" v-if="currentTab === 'table' && !point.isVirtual" @click="bulkDeleteRecords(point)">删除</el-button>
                                        <el-button size="small" class="power-primary" v-if="currentTab === 'chart'" @click="exportChart(point)">下载</el-button>
                                    </div>
                                </div>
                            </div>
                            <TableView :ref="'table_' + point.id" :point="point" :time-range="timeRange" v-if="currentTab === 'table'"></TableView>
                            <LineChartView :ref="'chart_' + point.id" :point="point" :time-range="timeRange" v-if="currentTab === 'chart'"></LineChartView>
                            <AddEditRecord v-if="dialogVisibility['addRecord_' + point.id]" dialog-id="addRecord" :point="point" :dialog-visibility="dialogVisibility['addRecord_' + point.id]" :record="formData[point.id] || {}" @action-finished="actionFinished($event, 'addRecord_' + point.id, point)"></AddEditRecord>
                        </div>
                    </div>
                </vgis-cell>
            </vgis-col>
        </vgis-row>
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
            selectedPoints: [],
            timeRange: [startDate, endDate],
            dialogVisibility: {}, // 用点位id区分
            formData: {} // 用点位id区分
        }
    },
    watch: {
        currentTab: {
            handler(newTab) {
                console.log('Tab changed to:', newTab);
                if (newTab === 'chart' && this.selectedPoints.length > 0) {
                    // 切换到图表视图时，确保所有图表组件都刷新数据
                    this.$nextTick(() => {
                        this.selectedPoints.forEach(point => {
                            const chartRef = this.$refs['chart_' + point.id];
                            if (chartRef && chartRef[0] && chartRef[0].refreshData) {
                                console.log('Refreshing chart for point:', point.name);
                                chartRef[0].refreshData();
                            }
                        });
                    });
                }
            },
            immediate: true
        }
    },
    methods: {
        actionFinished (success, dialogId, point) {
            this.dialogVisibility[dialogId] = false
            if (success) {
                if (this.$refs['chart_' + point.id] && this.$refs['chart_' + point.id][0]) {
                    this.$refs['chart_' + point.id][0].refreshData()
                }
                if (this.$refs['table_' + point.id] && this.$refs['table_' + point.id][0]) {
                    this.$refs['table_' + point.id][0].refreshData()
                }
            }
        },
        exportRecords (point) {
            if (this.$refs['table_' + point.id] && this.$refs['table_' + point.id][0]) {
                this.$refs['table_' + point.id][0].download()
            }
        },
        exportChart (point) {
            if (this.$refs['chart_' + point.id] && this.$refs['chart_' + point.id][0]) {
                this.$refs['chart_' + point.id][0].download()
            }
        },
        addRecord (point) {
            this.$set(this.dialogVisibility, 'addRecord_' + point.id, true)
        },
        bulkDeleteRecords (point) {
            if (this.$refs['table_' + point.id] && this.$refs['table_' + point.id][0]) {
                this.$refs['table_' + point.id][0].bulkDeleteRecords()
            }
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

.multi-view-scroll {
    max-height: 100vh;
    overflow-y: auto;
    padding: 16px;
}

.single-point-view {
    margin-bottom: 24px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.point-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.point-header h3 {
    color: #FFFFFF;
    margin: 0;
    font-size: 16px;
    font-weight: 500;
}

.point-actions {
    display: flex;
    align-items: center;
    gap: 12px;
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