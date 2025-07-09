<template>
    <vgis-card title="本日节能任务">
        <div style="height: calc(100% - 40px);" class="m-t-16">
            <el-table
                class="ttb"
                header-row-class-name="ttb-header"
                header-cell-class-name="ttb-header-cell"
                row-class-name="ttb-row"
                cell-class-name="ttb-cell"
                height="100%"
                :data="records">
                <el-table-column label="发生时间" width="190px">
                    <template slot-scope="{ row }">
                        {{ new Date(row.createdAt).format("yyyy-MM-dd hh:mm:ss") }}
                    </template>
                </el-table-column>
                <el-table-column label="关联设备" prop="device">
                    <template slot-scope="{ row }">
                        {{ row.device || "—" }}
                    </template>
                </el-table-column>
                <el-table-column label="任务内容" prop="description" :show-overflow-tooltip="true">
                    <template slot-scope="{ row }">
                        {{ row.description || "—" }}
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
                <el-table-column label="处理内容" prop="solution">
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
                <el-table-column label="操作" width="90px">
                    <template slot-scope="{ row }">
                        <el-button type="text" class="p-0" @click="handleRecord(row)">处理</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <HandlePowerSavingTaskDialog
            :record="handleData"
            dialog-id="handleRecord"
            v-if="dialogVisibilities.handleRecord"
            :dialog-visibility="dialogVisibilities.handleRecord"
            @action-finished="actionFinished"
        ></HandlePowerSavingTaskDialog>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import { getTaskList } from "@/assets/js/api/power-saving-tasks";
import HandlePowerSavingTaskDialog from "@/components/DashboardWidget/PowerSaving/HandlePowerSavingTaskDialog.vue";

export default {
    name: "PendingTaskList",
    components: {
        HandlePowerSavingTaskDialog,
        VgisCard
    },
    data () {
        let now = new Date()
        return {
            filter: {
                createdAt: [
                    new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
                ]
            },
            order: { sorter: "createdAt", order: "descending" },
            pagination: {
                page: 1,
                pagination: Number.MAX_SAFE_INTEGER
            },
            records: [],
            dialogVisibilities: {
                handleRecord: false
            },
            handleData: {},
        }
    },
    methods: {
        actionFinished (success, dialogId) {
            this.dialogVisibilities[dialogId] = false
            if (success) {
                this.getRecords(this.pagination.page, false)
            }
        },
        getRecords () {
            getTaskList(Object.assign({}, this.filter, this.order, this.pagination)).then(result => {
                this.records = result.data
            })
        },
        handleRecord (record) {
            this.handleData = Object.assign({}, record, {
                solver: record.person_relations.map(item => item.id)
            })
            this.dialogVisibilities.handleRecord = true
        },
    },
    created() {
        this.getRecords()
    }
}
</script>
<style lang="scss" scoped>

</style>