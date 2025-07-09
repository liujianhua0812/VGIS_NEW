<template>
    <vgis-card title="待处理故障/任务列表">
        <el-table
            class="ovwtk-table"
            row-class-name="ovwtk-row"
            cell-class-name="ovwtk-cell"
            header-row-class-name="ovwtk-header-row"
            header-cell-class-name="ovwtk-header-cell"
            :data="records"
        >
            <el-table-column label="类型" prop="type" width="80px"></el-table-column>
            <el-table-column label="发生时间" width="150px">
                <template slot-scope="{ row }">
                    {{row.time.format('yyyy-MM-dd hh:mm')}}
                </template>
            </el-table-column>
            <el-table-column label="等级" width="80px">
                <template slot-scope="{ row }">
                    <div v-if="row.level" class="alert" :style="{ background: row.level.color }">{{row.level.level}}</div>
                    {{ !row.level ? "——" : "" }}
                </template>
            </el-table-column>
            <el-table-column label="描述">
                <template slot-scope="{ row }">
                    <div class="description">{{row.description}}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="80px">
                <template slot-scope="{ row }">
                    <el-button type="primary" size="small" @click="handleTask(row)">处理</el-button>
                </template>
            </el-table-column>
        </el-table>
        <component
            :is="dialogMap[handleData.taskType]"
            :record="handleData"
            dialog-id="handleRecord"
            v-if="dialogVisibilities.handleRecord"
            :dialog-visibility="dialogVisibilities.handleRecord"
            @action-finished="actionFinished"
        ></component>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import { getTaskList as getMaintenanceTaskList } from "@/assets/js/api/maintenance-tasks";
import { getTaskList as getMalfunctionTaskList } from "@/assets/js/api/malfunction-tasks";
import { getTaskList as getPowerSavingTaskList } from "@/assets/js/api/power-saving-tasks";
import HandlePowerSavingTaskDialog from "@/components/DashboardWidget/PowerSaving/HandlePowerSavingTaskDialog.vue";
import HandleMalfunctionDialog from "@/components/DashboardWidget/Malfunction/HandleMalfunctionDialog.vue";
import HandleMaintenanceDialog from "@/components/DashboardWidget/Maintenance/HandleMaintenanceDialog.vue";

export default {
    name: "TaskAndMalfunctionList",
    components: {
        VgisCard,
        HandlePowerSavingTaskDialog,
        HandleMalfunctionDialog,
        HandleMaintenanceDialog
    },
    data () {
        return {
            dialogMap: {
                "维保": HandleMaintenanceDialog,
                "故障": HandleMalfunctionDialog,
                "节能": HandlePowerSavingTaskDialog,
            },
            records: [],
            handleData: {},
            dialogVisibilities: {
                handleRecord: false
            }
        }
    },
    methods: {
        actionFinished (success, dialogId) {
            this.dialogVisibilities[dialogId] = false
            if (success) {
                this.refreshRecords()
            }
        },
        handleTask (task) {
            this.handleData = Object.assign({}, task.info, {
                taskType: task.type,
                solver: task.info.person_relations.map(item => item.userId)
            })
            this.dialogVisibilities.handleRecord = true
        },
        refreshRecords () {
            Promise.all([
                getMaintenanceTaskList({
                    status: "pending"
                }),
                getMalfunctionTaskList({
                    status: "pending"
                }),
                getPowerSavingTaskList({
                    status: "pending"
                })
            ]).then(([mTaskResult, mfTaskResult, psTaskResult]) => {
                this.records = mTaskResult.data.map(item => ({
                    id: item.id,
                    type: "维保",
                    time: new Date(item.createdAt),
                    status: item.status,
                    level: null,
                    description: item.description,
                    info: item
                })).concat(mfTaskResult.data.map(item => ({
                    id: item.id,
                    type: "故障",
                    time: new Date(item.createdAt),
                    status: item.status,
                    level: item.alert_level,
                    description: item.description,
                    info: item
                }))).concat(psTaskResult.data.map(item => ({
                    id: item.id,
                    type: "节能",
                    time: new Date(item.createdAt),
                    status: item.status,
                    level: null,
                    description: item.description,
                    info: item
                }))).sort((i1, i2) => i2.time - i1.time)
            })
        }
    },
    created() {
        this.refreshRecords()
    }
}
</script>

<style lang="scss">

    .ovwtk-table:before {
        content: none;
    }

    .ovwtk-table {
        background: transparent;

        .ovwtk-row {
            background: transparent;
            border-bottom: none;
        }

        .ovwtk-row:hover {
            background: rgba(255, 255, 255, 0.20) !important;
            border-bottom: none;

            .ovwtk-cell {
                background: rgba(74, 190, 255, 0.01) !important;
            }
        }

        .ovwtk-cell {
            color: #FFFFFF;
            font-family: "HarmonyOS Sans SC";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            border-bottom: 1px solid rgba(255, 255, 255, 0.20) !important;

            .description {
                color: rgba(255, 255, 255, 0.60);
                font-family: "HarmonyOS Sans SC";
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
            }
        }

        .ovwtk-header-row {
            background: transparent;

            .ovwtk-header-cell {
                background: transparent;
                color: rgba(255, 255, 255, 0.60);
                font-family: "HarmonyOS Sans SC";
                font-size: 16px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                border-bottom: 1px solid rgba(255, 255, 255, 0.20) !important;
            }
        }

    }
</style>