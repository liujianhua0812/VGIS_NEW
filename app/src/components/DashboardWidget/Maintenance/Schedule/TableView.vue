<template>
  <div class="full-h">
      <div class="filters p-t-12 p-b-12 p-l-24 p-r-24 flex align-items-center justify-content-between">
          <div class="flex align-items-center">
              <label class="m-l-0">时间段</label>
              <vgis-simple-datetime-selector v-model="filter.timeRange" style="width: 250px;" @input="getRecords(null, true)"></vgis-simple-datetime-selector>
              <label>执行人</label>
              <vgis-person-selector v-model="filter.solver" @input="getRecords(null, true)"></vgis-person-selector>
              <label>启停状态</label>
              <el-radio-group v-model="filter.enabled" @input="getRecords(null, true)">
                  <el-radio label>全部</el-radio>
                  <el-radio :label="false">停用</el-radio>
                  <el-radio :label="true">启用</el-radio>
              </el-radio-group>
          </div>
          <div class="flex align-items-center">
              <el-button class="power-primary" size="small" type="primary" @click="addRecord">添加</el-button>
              <el-button class="power-danger-outline" size="small" type="danger" @click="bulkDeleteRecord">删除</el-button>
          </div>
      </div>
      <el-table
              class="ttb m-t-32"
              header-row-class-name="ttb-header"
              header-cell-class-name="ttb-header-cell"
              row-class-name="ttb-row"
              cell-class-name="ttb-cell"
              height="calc(100% - 120px)"
              :data="records"
              :key="rowKey">
          <el-table-column width="70px">
              <template slot="header">
                  <el-checkbox :indeterminate="IsIndeterminate" v-model="checkAll" @change="toggleAll"></el-checkbox>
              </template>
              <template slot-scope="{ row }">
                  <el-checkbox v-model="row.checked" @change="toggleIndeterminate"></el-checkbox>
              </template>
          </el-table-column>
          <el-table-column label="设备" show-overflow-tooltip>
              <template slot-scope="{ row }">
                  {{ row.device_relations.length === 0 ? "—" : "" }}
                  <div v-for="item in row.device_relations" :key="item.id">{{item.model_instance.name}}（{{item.model_instance.instanceId}}）</div>
              </template>
          </el-table-column>
          <el-table-column label="执行人" width="120px">
              <template slot-scope="{ row }">
                  {{ row.person_relations && row.person_relations.length > 0 ? row.person_relations.map(item => item.user.realName).join(", ") : "—" }}
              </template>
          </el-table-column>
          <el-table-column label="检查时效" width="120px">
              <template slot-scope="{ row }">
                  {{ !row.periodical ? "一次性" : "周期性" }}
              </template>
          </el-table-column>
          <el-table-column label="时段限制" prop="solver" width="260px">
              <template slot-scope="{ row }">
                  <div>起始时间：{{ row.startAt ? new Date(row.startAt).format("yyyy-MM-dd hh:mm:ss") : "不限" }}</div>
                  <div>结束时间：{{ row.endAt ? new Date(row.endAt).format("yyyy-MM-dd hh:mm:ss") : "不限" }}</div>
              </template>
          </el-table-column>
          <el-table-column label="执行时间" width="190px">
              <template slot-scope="{ row }">
                {{ !row.periodical ? new Date(row.scheduledAt).format("yyyy-MM-dd hh:mm:ss") : row.readable }}
              </template>
          </el-table-column>
          <el-table-column label="作业内容" show-overflow-tooltip>
              <template slot-scope="{ row }">
                  {{ row.description || "—" }}
              </template>
          </el-table-column>
          <el-table-column label="启停状态" width="115px">
              <template slot-scope="{ row }">
                  <el-switch v-model="row.enabled" @change="toggleStatus(row)"></el-switch>
              </template>
          </el-table-column>
          <el-table-column label="操作" width="190px">
              <template slot-scope="{ row }">
                  <el-button type="text" class="p-0" @click="editRecord(row)">编辑</el-button>
                  <el-button type="text" class="p-0 text-brown" @click="deleteRecord(row)">删除</el-button>
                  <el-button type="text" class="p-0" @click="createTask(row)">即刻发起</el-button>
              </template>
          </el-table-column>
      </el-table>
      <div class="vgis-pagination">
          <el-pagination
              class="pull-right"
              :background="false"
              :current-page="pagination.page"
              :total="pagination.total"
              :page-size="pagination.pagination"
              :pager-count="5"
              @current-change="updatePage"
              @size-change="updatePageSize"
              layout="total, prev, pager, next, sizes, jumper"
          ></el-pagination>
      </div>
      <AddEditSchedule
          :record="formData"
          dialog-id="addEditSchedule"
          v-if="dialogVisibilities.addEditSchedule"
          :dialog-visibility="dialogVisibilities.addEditSchedule"
          @action-finished="actionFinished"
      ></AddEditSchedule>
  </div>
</template>

<script>
import VgisDeviceSelector from "@/components/DashboardWidget/Shared/vgis-device-selector.vue";
import VgisStatusSelector from "@/components/DashboardWidget/Shared/vgis-status-selector.vue";
import VgisPersonSelector from "@/components/DashboardWidget/Shared/vgis-person-selector.vue";
import VgisSimpleDatetimeSelector from "@/components/DashboardWidget/Shared/vgis-simple-datetime-selector.vue";
import AddEditSchedule from "@/components/DashboardWidget/Maintenance/Schedule/AddEditSchedule.vue";
import AddEditFactorValue
    from "@/components/DashboardWidget/EnergyManagement/ParameterManagement/AddEditFactorValue.vue";
import {
    getScheduleList,
    deleteSchedule,
    bulkDeleteSchedule,
    updateSchedule
} from "@/assets/js/api/maintenance-schedules";
import {createTask} from "@/assets/js/api/maintenance-tasks";

export default {
    name: "TableView",
    props: {
        device: Array
    },
    components: {
        AddEditFactorValue,
        VgisSimpleDatetimeSelector,
        VgisPersonSelector,
        VgisStatusSelector,
        VgisDeviceSelector,
        AddEditSchedule
    },
    watch: {
        device: {
            handler (newValue) {
                this.filter.device = newValue
                this.getRecords(null, true)
            },
            deep: true
        }
    },
    data () {
        return {
            filter: {
                device: [],
                solver: "",
                enabled: "",
                timeRange: []
            },
            IsIndeterminate: false,
            checkAll: false,
            sorter: { prop: "createdAt", order: "descending" },
            rowKey: Math.random(),
            records: [],
            formData: {},
            dialogVisibilities: {
                addEditSchedule: false
            },
            pagination: {}
        }
    },
    methods: {
        actionFinished (success, dialogId) {
            this.dialogVisibilities[dialogId] = false
            if (success) {
                this.getRecords(this.pagination.page, false)
            }
        },
        updateSorter (sorter) {
            this.sorter.prop = sorter.prop
            this.sorter.order = sorter.order
            this.getRecords(null, true)
        },
        updatePage (page) {
            this.getRecords(page, false)
        },
        updatePageSize (size) {
            this.pagination.pagination = size
            this.getRecords(this.pagination.page, false)
        },
        getRecords (page, refresh = false) {
            this.pagination.page = refresh ? 1 : page
            getScheduleList(Object.assign({ sorter: this.sorter.prop, order: this.sorter.order }, this.filter, this.pagination)).then(result => {
                this.records = result.data.map(item => {
                    item.checked = false
                    return item
                })
                this.pagination = result.pagination
            })
        },
        createTask (record) {
            this.$confirm("确定要立即发起维保任务吗？").then(() => {
                createTask({
                    device: record.device_relations.map(item => item.instanceId),
                    solver: record.person_relations.map(item => item.userId),
                    status: "pending",
                    description: record.description
                }).then(result => {
                    this.$message({
                        message: "已发起维保任务，请及时通知相关人员！",
                        showClose: true,
                        duration: 3000,
                        type: "success"
                    })
                })
            })
        },
        addRecord () {
            this.formData = {
                periodical: false,
                instantly: false,
                description: [],
                device: [],
                solver: [],
                range: ["", ""],
            }
            this.dialogVisibilities.addEditSchedule = true
        },
        editRecord (record) {
            this.formData = Object.assign({}, record, {
                device: record.device_relations.map(item => item.instanceId),
                solver: record.person_relations.map(item => item.userId),
                range: [
                    record.startAt ? new Date(record.startAt) : "",
                    record.endAt ? new Date(record.endAt) : "",
                ],
                scheduledAt: record.scheduledAt ? new Date(record.scheduledAt) : ""
            })
            this.dialogVisibilities.addEditSchedule = true
        },
        toggleStatus (record) {
            updateSchedule(record.id, record).then(result => {
                this.$message({
                    message: result.data.enabled ? "启用成功！" : "停用成功！",
                    showClose: true,
                    duration: 3000,
                    type: "success"
                })
            })
        },
        deleteRecord (record) {
            this.$confirm("操作不可撤销，确定要删除吗？").then(() => {
                deleteSchedule(record.id).then(result => {
                    this.$message({
                        message: "删除成功！",
                        showClose: true,
                        duration: 3000,
                        type: "success"
                    })
                    this.getRecords(this.pagination.page, false)
                })
            })
        },
        bulkDeleteRecord (record) {
            this.$confirm("操作不可撤销，确定要删除吗？").then(() => {
                bulkDeleteSchedule({
                    recordIds: this.records.filter(item => item.checked).map(item => item.id)
                }).then(result => {
                    this.$message({
                        message: "删除成功！",
                        showClose: true,
                        duration: 3000,
                        type: "success"
                    })
                    this.getRecords(this.pagination.page, false)
                })
            })
        },
        toggleAll () {
            let allChecked = this.records.reduce((result, item) => result && item.checked, true)
            this.checkAll = !allChecked;
            this.isIndeterminate = false
            for(let i = 0; i < this.records.length; i++) {
                this.records[i].checked = this.checkAll
            }
            this.rowKey = Math.random()
        },
        toggleIndeterminate () {
            let allChecked = this.records.reduce((result, item) => result && item.checked, true)
            let allUnchecked = !(this.records.reduce((result, item) => result || item.checked, false))
            this.checkAll = allChecked
            this.isIndeterminate = !(allChecked || allUnchecked)
            this.rowKey = Math.random()
        }
    },
    created() {
        this.getRecords(null, true)
    }
}
</script>

<style lang="scss" scoped>
.filters {
  background: #003A8C;

  i {
    color: #FFFFFF;
    font-family: "HarmonyOS Sans SC";
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    margin-right: 8px;
  }

  label {
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