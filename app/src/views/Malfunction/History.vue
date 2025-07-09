<template>
    <vgis-page :navs="navs" :page-name="pageTitle" background>
        <div class="filters p-t-24 m-b-24 flex align-items-center justify-content-between">
            <div class="flex align-items-center">
                <i class="iconfont icon-filter"></i>
                <label class="m-l-0">故障类型</label>
                <vgis-alert-type-selector v-model="filter.type" @input="getRecords(null, true)"></vgis-alert-type-selector>
                <label>等级</label>
                <vgis-alert-level-selector v-model="filter.level" @input="getRecords(null, true)"></vgis-alert-level-selector>
                <label>发生时间</label>
                <vgis-simple-datetime-selector v-model="filter.createdAt" style="width: 250px;" @input="getRecords(null, true)"></vgis-simple-datetime-selector>
                <label>处理时间</label>
                <vgis-simple-datetime-selector v-model="filter.handledAt" style="width: 250px;" @input="getRecords(null, true)"></vgis-simple-datetime-selector>
            </div>
            <div class="flex align-items-center">
                <label class="m-l-0">只看我的</label>
                <el-switch v-model="filter.meOnly" @change="getRecords(null, true)"></el-switch>
            </div>
        </div>
        <div class="filters m-b-24 flex align-items-center justify-content-between">
            <div class="flex align-items-center">
                <i class="iconfont icon-filter" style="color: transparent"></i>
                <label class="m-l-0">关联设备</label>
                <vgis-device-selector v-model="filter.device" @input="getRecords(null, true)"></vgis-device-selector>
                <label>处理人</label>
                <vgis-person-selector v-model="filter.solver" @input="getRecords(null, true)"></vgis-person-selector>
                <label>处理状态</label>
                <vgis-status-selector v-model="filter.status" @input="getRecords(null, true)"></vgis-status-selector>
            </div>
        </div>
        <el-table
                class="ttb"
                header-row-class-name="ttb-header"
                header-cell-class-name="ttb-header-cell"
                row-class-name="ttb-row"
                cell-class-name="ttb-cell"
                height="calc(100% - 160px)"
                :data="records"
                :default-sort="sorter"
                @sort-change="updateSorter">
            <el-table-column label="故障类型" prop="type">
                <template slot-scope="{ row }">
                    {{ row.type || "—" }}
                </template>
            </el-table-column>
            <el-table-column label="关联设备" prop="device">
                <template slot-scope="{ row }">
                    {{ row.device_relations.length === 0 ? "—" : "" }}
                    <div v-for="item in row.device_relations" :key="item.id">{{item.model_instance.name}}（{{item.model_instance.instanceId}}）</div>
                </template>
            </el-table-column>
            <el-table-column label="等级" width="88px">
                <template slot-scope="{ row }">
                    <div :class="['alert']" :style="{ background: row.alert_level.color }">{{row.alert_level.level}}</div>
                </template>
            </el-table-column>
            <el-table-column label="故障内容" prop="description" :show-overflow-tooltip="true">
                <template slot-scope="{ row }">
                    {{ row.description || "—" }}
                </template>
            </el-table-column>
            <el-table-column label="发生时间" width="190px">
                <template slot-scope="{ row }">
                    {{ new Date(row.createdAt).format("yyyy-MM-dd hh:mm:ss") }}
                </template>
            </el-table-column>
            <el-table-column label="处理状态" width="115px">
                <template slot-scope="{ row }">
                    <div class="status-indicator undetermined" v-if="row.status === 'undetermined'">待议</div>
                    <div class="status-indicator solved" v-if="row.status === 'solved'">已处理</div>
                    <div class="status-indicator pending" v-if="row.status === 'pending'">未处理</div>
                </template>
            </el-table-column>
            <el-table-column label="处理时间" width="190px">
                <template slot-scope="{ row }">
                    {{ row.handledAt ? new Date(row.handledAt).format("yyyy-MM-dd hh:mm:ss") : "—" }}
                </template>
            </el-table-column>
            <el-table-column label="处理内容" prop="solution" show-overflow-tooltip>
                <template slot-scope="{ row }">
                    {{ row.solution || "—" }}
                </template>
            </el-table-column>
            <el-table-column label="处理人" prop="solver">
                <template slot-scope="{ row }">
                    {{ row.person_relations.length > 0 ? row.person_relations.map(item => item.user.realName).join(", ") : "—" }}
                </template>
            </el-table-column>
            <el-table-column label="处理时长（hr）" prop="lastTime" width="160px">
                <template slot-scope="{ row }">
                    {{ row.solveTime || "—" }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="130px">
                <template slot-scope="{ row }">
                    <el-button type="text" class="p-0" @click="handleRecord(row)">处理</el-button>
                    <el-button type="text" class="p-0 text-brown" @click="deleteRecord(row)">删除</el-button>
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
        <HandleMalfunctionDialog
            :record="handleData"
            dialog-id="handleRecord"
            v-if="dialogVisibilities.handleRecord"
            :dialog-visibility="dialogVisibilities.handleRecord"
            @action-finished="actionFinished"
        ></HandleMalfunctionDialog>
    </vgis-page>
</template>

<script>
import VgisPage from "@/components/Standard/vgis-page.vue";
import VgisDeviceSelector from "@/components/DashboardWidget/Shared/vgis-device-selector.vue";
import VgisPersonSelector from "@/components/DashboardWidget/Shared/vgis-person-selector.vue";
import VgisSimpleDatetimeSelector from "@/components/DashboardWidget/Shared/vgis-simple-datetime-selector.vue";
import VgisStatusSelector from "@/components/DashboardWidget/Shared/vgis-status-selector.vue";
import HandleMalfunctionDialog from "@/components/DashboardWidget/Malfunction/HandleMalfunctionDialog.vue";
import {getTaskList, deleteTask} from "@/assets/js/api/malfunction-tasks";
import VgisAlertLevelSelector from "@/components/DashboardWidget/Shared/vgis-alert-level-selector.vue";
import VgisAlertTypeSelector from "@/components/DashboardWidget/Malfunction/vgis-alert-type-selector.vue";
export default {
    name: "History",
    components: {
        VgisAlertTypeSelector,
        VgisAlertLevelSelector,
        VgisStatusSelector,
        VgisSimpleDatetimeSelector,
        VgisPersonSelector,
        VgisDeviceSelector,
        VgisPage,
        HandleMalfunctionDialog
    },
    data() {
        return {
            filter: {
                device: [],
                type: "",
                status: "",
                level: "",
                solver: "",
                createdAt: [],
                handledAt: [],
                meOnly: false
            },
            sorter: { prop: "createdAt", order: "descending" },
            pageTitle: "故障历史记录",
            navs: [{
                name: "总览",
                link: "/"
            }, {
                name: "故障管理"
            }, {
                name: "历史记录"
            }],
            records: [],
            dialogVisibilities: {
                handleRecord: false
            },
            handleData: {},
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
            getTaskList(Object.assign({ sorter: this.sorter.prop, order: this.sorter.order }, this.filter, this.pagination)).then(result => {
                this.records = result.data
                this.pagination = result.pagination
            })
        },
        handleRecord (record) {
            this.handleData = Object.assign({}, record, {
                solver: record.person_relations.map(item => item.userId)
            })
            this.dialogVisibilities.handleRecord = true
        },
        deleteRecord (record) {
            this.$confirm("操作不可撤销，确定要删除吗？").then(() => {
                deleteTask(record.id).then(result => {
                    this.$message({
                        message: "删除成功！",
                        showClose: true,
                        duration: 3000,
                        type: "success"
                    })
                    this.getRecords(this.pagination.page, false)
                })
            })
        }
    },
    created() {
        this.getRecords()
    }
}
</script>

<style lang="scss" scoped>
.filters {

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