<template>
    <vgis-page :navs="navs" :page-name="pageTitle">
        <template slot="header">
            <div class="flex align-items-center justify-content-between">
                {{pageTitle}}
                <div class="header-actions">
                    <el-button 
                        size="small" 
                        class="power-primary" 
                        v-if="currentTab === 'table' && selectedPoints.length > 0" 
                        @click="exportAllRecords"
                        :loading="exportingAll"
                    >
                        <i class="el-icon-download"></i>
                        一键导出
                    </el-button>
                    <div class="view-selector flex align-items-center">
                        <i :class="['iconfont icon-table', { active: currentTab === 'table' }]" @click="currentTab = 'table'"></i>
                        <i :class="['iconfont icon-sum', { active: currentTab === 'chart' }]" @click="currentTab = 'chart'" v-if="selectedPoints.length > 0 && selectedPoints.some(point => ['Decimal', 'Integer'].includes(point.dataType))"></i>
                    </div>
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
                                        <el-button size="small" class="power-primary" v-if="currentTab === 'table'" @click="manualRefresh(point)">刷新</el-button>
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
import ExcelJS from "exceljs";
import FileSaver from "file-saver";

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
            formData: {}, // 用点位id区分
            exportingAll: false // 一键导出状态
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
            console.log('actionFinished called:', { success, dialogId, point: point.name });
            this.dialogVisibility[dialogId] = false
            if (success) {
                // 使用$nextTick确保DOM更新完成后再刷新数据
                this.$nextTick(() => {
                    console.log('Refreshing data for point:', point.name);
                    
                    // 刷新图表数据
                    if (this.$refs['chart_' + point.id] && this.$refs['chart_' + point.id][0]) {
                        console.log('Refreshing chart for point:', point.name);
                        this.$refs['chart_' + point.id][0].refreshData()
                    }
                    
                    // 刷新表格数据
                    if (this.$refs['table_' + point.id] && this.$refs['table_' + point.id][0]) {
                        console.log('Refreshing table for point:', point.name);
                        this.$refs['table_' + point.id][0].refreshData(true) // 使用强制刷新
                    }
                })
                
                // 额外的保障措施：延迟一点时间后再次刷新，确保数据已同步到后端
                setTimeout(() => {
                    console.log('Delayed refresh for point:', point.name);
                    if (this.$refs['table_' + point.id] && this.$refs['table_' + point.id][0]) {
                        this.$refs['table_' + point.id][0].refreshData(true) // 使用强制刷新
                    }
                }, 1000)
                
                // 最后的保障措施：3秒后再次刷新，确保数据完全同步
                setTimeout(() => {
                    console.log('Final refresh for point:', point.name);
                    if (this.$refs['table_' + point.id] && this.$refs['table_' + point.id][0]) {
                        this.$refs['table_' + point.id][0].refreshData(true) // 使用强制刷新
                    }
                }, 3000)
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
        manualRefresh (point) {
            console.log('Manual refresh for point:', point.name);
            if (this.$refs['table_' + point.id] && this.$refs['table_' + point.id][0]) {
                this.$refs['table_' + point.id][0].refreshData()
            }
        },
        bulkDeleteRecords (point) {
            if (this.$refs['table_' + point.id] && this.$refs['table_' + point.id][0]) {
                this.$refs['table_' + point.id][0].bulkDeleteRecords()
            }
        },
        async exportAllRecords() {
            if (this.selectedPoints.length === 0) {
                this.$message({
                    message: "请先选择要导出的点位！",
                    showClose: true,
                    duration: 3000,
                    type: "warning"
                });
                return;
            }

            this.exportingAll = true;
            
            try {
                const workbook = new ExcelJS.Workbook();
                workbook.creator = 'VGIS系统';
                workbook.lastModifiedBy = 'VGIS系统';
                workbook.created = new Date();
                workbook.modified = new Date();
                
                // 为每个选中的点位创建一个sheet
                let exportedCount = 0;
                for (const point of this.selectedPoints) {
                    // 获取该点位的表格组件引用
                    const tableRef = this.$refs['table_' + point.id];
                    if (!tableRef || !tableRef[0]) {
                        console.warn(`找不到点位 ${point.name} 的表格组件`);
                        continue;
                    }
                    
                    // 获取该点位的所有数据（不分页）
                    const allRecords = tableRef[0].records || [];
                    if (allRecords.length === 0) {
                        console.warn(`点位 ${point.name} 没有数据`);
                        continue;
                    }
                    
                    exportedCount++;
                    
                    // 创建sheet
                    const sheetName = this.sanitizeSheetName(point.name);
                    const worksheet = workbook.addWorksheet(sheetName);
                    
                    // 设置列
                    worksheet.columns = [
                        { header: '时间', key: 'time', width: 25 },
                        { header: `${point.name}${point.unit ? `（单位: ${point.unit.name}）` : ""}`, key: 'value', width: 30 }
                    ];
                    
                    // 设置表头样式
                    worksheet.getRow(1).font = { bold: true };
                    worksheet.getRow(1).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFE0E0E0' }
                    };
                    
                    // 添加数据 - 使用与TableView.download()相同的方式
                    const formattedRecords = allRecords.map(record => ({
                        time: record.time instanceof Date ? record.time.toLocaleString() : record.time,
                        value: tableRef[0].formatValue(point, record.value)
                    }));
                    worksheet.addRows(formattedRecords);
                    
                    // 设置列对齐方式
                    worksheet.getColumn('A').alignment = { horizontal: 'center' };
                    worksheet.getColumn('B').alignment = { horizontal: 'center' };
                }
                
                // 检查是否有成功导出的数据
                if (exportedCount === 0) {
                    this.$message({
                        message: "没有可导出的数据！",
                        showClose: true,
                        duration: 3000,
                        type: "warning"
                    });
                    return;
                }
                
                // 生成文件名
                const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
                const fileName = `历史数据_${timestamp}.xlsx`;
                
                // 导出文件
                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                FileSaver.saveAs(blob, fileName);
                
                this.$message({
                    message: `成功导出 ${exportedCount} 个点位的数据！`,
                    showClose: true,
                    duration: 3000,
                    type: "success"
                });
                
            } catch (error) {
                console.error('导出失败:', error);
                this.$message({
                    message: "导出失败：" + (error.message || "未知错误"),
                    showClose: true,
                    duration: 3000,
                    type: "error"
                });
            } finally {
                this.exportingAll = false;
            }
        },
        sanitizeSheetName(name) {
            // Excel sheet名称不能包含特殊字符，需要清理
            return name.replace(/[\\/:*?"<>|]/g, '_').substring(0, 31);
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

.header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
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