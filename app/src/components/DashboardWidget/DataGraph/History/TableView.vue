<template>
    <vgis-card>
        <el-table
            class="ttb"
            header-row-class-name="ttb-header"
            header-cell-class-name="ttb-header-cell"
            row-class-name="ttb-row"
            cell-class-name="ttb-cell"
            height="calc(100% - 30px)"
            :key="tableKey"
            :data="pageData">
            <el-table-column width="70px" v-if="!point.isVirtual">
                <template slot="header">
                    <el-checkbox :indeterminate="IsIndeterminate" v-model="checkAll" @change="toggleAll"></el-checkbox>
                </template>
                <template slot-scope="{ row }">
                    <el-checkbox v-model="row.checked" @change="toggleIndeterminate"></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column label="时间">
                <template slot-scope="{ row }">
                    {{ row.time.format('yyyy-MM-dd hh:mm:ss') }}
                </template>
            </el-table-column>
            <el-table-column label="数值">
                <template slot-scope="{ row }">
                    {{ formatValue(point, row.value) }} {{ point.unit ? point.unit.name : "" }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="130px" v-if="!point.isVirtual">
                <template slot-scope="{ row }">
                    <el-button type="text" class="p-0" @click="editRecord(row)">编辑</el-button>
                    <el-button type="text" class="p-0 text-brown" @click="deleteRecord(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="vgis-pagination">
            <el-pagination
                class="pull-right"
                :background="false"
                :total="pagination.total"
                layout="total, prev, pager, next, sizes, jumper"
                :current-page="pagination.page"
                :page-size="pagination.size"
                @current-change="updatePage"
                @size-change="updateSize"
            ></el-pagination>
        </div>
        <AddEditRecord v-if="dialogVisibility['editRecord_' + point.id]" dialog-id="editRecord" :point="point" :dialog-visibility="dialogVisibility['editRecord_' + point.id]" :record="formData[point.id] || {}" @action-finished="actionFinished($event, 'editRecord_' + point.id)"></AddEditRecord>
    </vgis-card>
</template>

<script>
import VgisDeviceSelector from "@/components/DashboardWidget/Shared/vgis-device-selector.vue";
import VgisStatusSelector from "@/components/DashboardWidget/Shared/vgis-status-selector.vue";
import VgisPersonSelector from "@/components/DashboardWidget/Shared/vgis-person-selector.vue";
import VgisSimpleDatetimeSelector from "@/components/DashboardWidget/Shared/vgis-simple-datetime-selector.vue";
import VgisCard from "@/components/Standard/vgis-card.vue";
import {getNodeDetail, getNodeParents, getSeriesHistoryValues} from "@/assets/js/api/hierarchy";
import AddEditRecord from "@/components/DashboardWidget/DataGraph/History/AddEditRecord.vue";
import {deleteInstanceSeriesValue} from "@/assets/js/api/model-instance-series";
import ExcelJS from "exceljs"
import {downloadFile} from "@/utils";
import FileSaver from "file-saver"

export default {
    name: "TableView",
    props: {
        timeRange: Array,
        point: Object
    },
    components: {
        AddEditRecord,
        VgisCard,
        VgisSimpleDatetimeSelector,
        VgisPersonSelector,
        VgisStatusSelector,
        VgisDeviceSelector
    },
    watch: {
        timeRange: {
            handler (newValue) {
                this.refreshData()
            },
            deep: true
        },
        point: {
            handler (newValue) {
                this.getPaths()
                this.refreshData()
            },
            deep: true
        },
        records: {
            handler(newRecords) {
                console.log('Records changed, count:', newRecords.length);
                // 强制更新表格key以触发重新渲染
                this.tableKey = Date.now();
            },
            deep: true
        }
    },
    computed: {
        pageData () {
            let start = (this.pagination.page - 1) * this.pagination.size
            let end = start + this.pagination.size
            return this.records.slice(start, end)
        }
    },
    data () {
        return {
            instance: {},
            parents: [],
            dialogVisibility: {}, // 用point.id区分
            formData: {}, // 用point.id区分
            checkAll: false,
            isIndeterminate: false,
            pagination: {
                page: 1,
                size: 10,
                total: 0
            },
            records: [],
            tableKey: 0 // 用于强制重新渲染表格
        }
    },
    methods: {
        actionFinished (success, dialogId) {
            this.dialogVisibility[dialogId] = false
            if (success) {
                this.refreshData()
            }
        },
        updatePage (page) {
            this.pagination.page = page
        },
        updateSize (size) {
            this.pagination.size = size
        },
        toggleAll () {
            if (this.checkAll) {
                if (this.isIndeterminate) {
                    this.isIndeterminate = false
                }
                for(let i = 0; i < this.records.length; i++) {
                    this.records[i].checked = true
                }
            }
            else {
                if (this.isIndeterminate) {
                    this.isIndeterminate = false
                }
                for(let i = 0; i < this.records.length; i++) {
                    this.records[i].checked = false
                }
            }
        },
        toggleIndeterminate () {
            let allChecked = this.records.reduce((result, item) => result && item.checked, true)
            let allUnchecked = !(this.records.reduce((result, item) => result || item.checked, false))
            this.isIndeterminate = !allChecked && !allUnchecked;
            this.checkAll = allChecked
        },
        formatValue(series, value) {
            if (series.dataType === 'Decimal') {
                value = parseFloat(value)
                if (series.precision || series.precision === 0) {
                    value = parseFloat(value.toFixed(series.precision))
                }
            }
            return value
        },
        getPaths () {
            if (this.point) {
                Promise.all([
                    getNodeDetail(this.point.instanceId),
                    getNodeParents(this.point.instanceId)
                ]).then(result => {
                    this.instance = result[0].data
                    this.parents = result[1].data
                })
            }
        },
        refreshData (forceRefresh = false) {
            console.log('TableView refreshData called for point:', this.point?.name, 'forceRefresh:', forceRefresh);
            let [startDate, endDate] = this.timeRange
            
            // 如果是强制刷新，使用更宽的时间范围确保包含新添加的数据
            if (forceRefresh) {
                endDate = new Date()
                startDate = new Date(endDate.getTime())
                startDate.setMonth(startDate.getMonth() - 2) // 扩展到2个月
                console.log('Force refresh with extended time range:', [startDate, endDate]);
            } else {
                if (!endDate) {
                    endDate = new Date()
                }
                if (!startDate) {
                    startDate = new Date(endDate.getTime())
                    startDate.setMonth(startDate.getMonth() - 1)
                }
            }
            if (this.point && this.point.id) {
                const queryParams = {
                    startAt: startDate,
                    endAt: endDate,
                    order: "desc"
                };
                console.log('Fetching data for point:', this.point.name, 'timeRange:', [startDate, endDate]);
                console.log('Query params:', queryParams);
                getSeriesHistoryValues(this.point.instanceId, [this.point.name], queryParams).then(result => {
                    console.log('Data received for point:', this.point.name, 'result:', result);
                    console.log('Raw data values:', result.data[this.point.name]?.values);
                    
                    this.records = (result.data[this.point.name] ? result.data[this.point.name].values : []).map(item => {
                        item.time = new Date(item.time)
                        item.checked = false
                        return item
                    })
                    
                    // 显示前几条记录的时间，用于调试
                    if (this.records.length > 0) {
                        console.log('First 3 records times:', this.records.slice(0, 3).map(r => r.time));
                        console.log('Last 3 records times:', this.records.slice(-3).map(r => r.time));
                    }
                    
                    console.log('Processed records for point:', this.point.name, 'count:', this.records.length);
                    this.pagination.total = this.records.length
                    if ((this.pagination.page - 1) * this.pagination.size >= this.pagination.total) {
                        this.pagination.page = Math.max(this.pagination.page - 1, 1)
                    }
                    
                    // 强制重新渲染表格
                    this.tableKey = Date.now()
                    console.log('Table key updated to:', this.tableKey);
                }).catch(error => {
                    console.error('Error refreshing data for point:', this.point.name, error);
                })
            }
            else {
                console.log('No point or point.id, clearing records');
                this.records = []
            }
            this.checkAll = false
        },
        download () {
            const workbook = new ExcelJS.Workbook();
            let sheet = workbook.addWorksheet("Data")
            sheet.columns = [
                { header: '时间', key: 'time', width: 40 },
                { header: `${this.point.name}${this.point.unit ? `（单位: ${this.point.unit.name}）` : ""}`, key: 'value', width: 40  },
            ];
            sheet.getColumn("A").alignment = { horizontal: "center" }
            sheet.getColumn("B").alignment = { horizontal: "center" }
            sheet.getCell("A1").font = { bold: true }
            sheet.getCell("B1").font = { bold: true }
            sheet.addRows(this.records)
            workbook.xlsx.writeBuffer().then(buffer => {
                FileSaver.saveAs(new Blob([buffer]), `${this.instance.name}@${this.point.name}.xlsx`);
            });
        },
        editRecord (record) {
            // 确保record数据被正确复制到formData中，并确保时间格式正确
            const recordCopy = Object.assign({}, record)
            
            // 确保时间字段是有效的Date对象
            if (recordCopy.time) {
                if (recordCopy.time instanceof Date) {
                    // 如果已经是Date对象，检查是否有效
                    if (isNaN(recordCopy.time.getTime())) {
                        recordCopy.time = new Date()
                    }
                } else {
                    // 如果不是Date对象，尝试转换
                    const date = new Date(recordCopy.time)
                    if (!isNaN(date.getTime())) {
                        recordCopy.time = date
                    } else {
                        recordCopy.time = new Date()
                    }
                }
            }
            
            this.$set(this.formData, this.point.id, recordCopy)
            this.$set(this.dialogVisibility, 'editRecord_' + this.point.id, true)
        },
        deleteRecord (record) {
            this.$confirm("操作不可撤销，确定要删除吗？").then(() => {
                deleteInstanceSeriesValue(this.point.instanceId, { ids: [record.id] }).then(result => {
                    this.$message({
                        message: "删除成功！",
                        showClose: true,
                        duration: 3000,
                        type: "success"
                    })
                    this.refreshData()
                })
            })
        },
        bulkDeleteRecords () {
            this.$confirm("操作不可撤销，确定要删除吗？").then(() => {
                deleteInstanceSeriesValue(this.point.instanceId, { ids: this.records.filter(item => item.checked).map(item => item.id) }).then(result => {
                    this.$message({
                        message: "删除成功！",
                        showClose: true,
                        duration: 3000,
                        type: "success"
                    })
                    this.refreshData()
                })
            })
        }
    },
    created() {
        this.getPaths()
        this.refreshData()
    }
}
</script>

<style lang="scss" scoped>

</style>