<template>
    <el-dialog class="power-dialog" width="700px" :title="`维保计划 / ${currentHour}`" :visible.sync="dialogVisibility" @closed="close">
        <el-collapse class="schedule-list" accordion>
            <el-collapse-item v-for="(schedule, index) in timetable" :title="`任务${index + 1} / ${schedule.time.format('yyyy-MM-dd hh:mm:ss')}`">
                <div class="p-10">
                    <div class="info-label">作业时间</div>
                    <div class="info">{{schedule.time.format("yyyy-MM-dd hh:mm:ss")}}</div>
                    <div class="info-label m-b-10">执行人</div>
                    <div class="info">{{schedule.info.person_relations.map(item => item.user.realName).join("，")}}</div>
                    <div class="info-label m-b-10">关联设备</div>
                    <div class="device-list m-b-10">
                        <div v-for="{ model_instance } in schedule.info.device_relations" class="device-item">
                            <div class="name">{{model_instance.name}}（{{model_instance.instanceId}}）</div>
                            <el-button size="mini" class="power-primary" @click="showDocuments(model_instance)">查看维保材料</el-button>
                        </div>
                    </div>
                    <div class="info-label">作业内容</div>
                    <div class="info">{{schedule.info.description}}</div>
                </div>
            </el-collapse-item>
        </el-collapse>
        <DocumentList :documents="documents" :dialog-visibility="dialogVisibilities.showDocuments" dialog-id="showDocuments" @action-finished="actionFinished"></DocumentList>
    </el-dialog>
</template>

<script>

import later from "@breejs/later"
import DocumentList from "@/components/DashboardWidget/Maintenance/Regulation/DocumentList.vue";
export default {
    name: "ShowScheduledDialog",
    components: {
        DocumentList

    },
    props: {
        dialogId: String,
        dialogVisibility: Boolean,
        time: Object,
        schedules: Array
    },
    computed: {
        currentHour () {
            let date = this.time.date, hour = this.time.hour
            if (!date) {
                return ""
            }
            return `${date.format("yyyy-MM-dd")} ${hour}:00:00 ~ ${hour + 1}:59:59`
        },
        timetable () {
            if (!this.currentHour) {
                return []
            }
            let schedules = this.schedules
            let startAt = new Date(`${this.time.date.format("yyyy-MM-dd")} ${this.time.hour}:00:00`)
            let endAt = new Date(`${this.time.date.format("yyyy-MM-dd")} ${this.time.hour}:59:59`)
            let result = []
            for(let i = 0; i < schedules.length; i++) {
                let schedule = schedules[i]
                if (schedule.periodical) {
                    let sched = later.parse.cron(schedule.period)
                    let sStartAt = schedule.startAt || startAt
                    let sEndAt = schedule.endAt || endAt
                    let i = new Date(Math.max(startAt.getTime(), sStartAt.getTime()))
                    let end = new Date(Math.min(endAt.getTime(), sEndAt.getTime()))
                    while (i <= end) {
                        let times = later.schedule(sched).next(Number.MAX_SAFE_INTEGER - 1, i, end)
                        for(let j = 0; j < times.length; j++) {
                            result.push({
                                info: schedule,
                                time: times[j]
                            })
                        }
                        if (!times || times.length === 0) {
                            break
                        }
                        i = new Date(times[times.length - 1].getTime())
                        i.setSeconds(i.getSeconds() + 1)
                    }
                }
                else {
                    result.push({
                        info: schedule,
                        time: new Date(schedule.scheduledAt)
                    })
                }
            }
            result = result.sort((i1, i2) => i1.time - i2.time)
            return result
        }
    },
    data () {
        return {
            documents: [],
            dialogVisibilities: {
                showDocuments: false
            },
            task: {
                device_relations: []
            }
        }
    },
    methods: {
        actionFinished(success, dialogId) {
            this.dialogVisibilities[dialogId] = false
        },
        close () {
            this.$emit("action-finished", false, this.dialogId);
        },
        showDocuments (instance) {
            this.documents = instance.documents
            this.dialogVisibilities.showDocuments = true
        }
    }
}
</script>
<style>
.schedule-list {
    border-bottom: 1px solid #096DD9;
    background: #003A8C;
    border-top: 1px solid #096DD9;

    .el-collapse-item__header {
        background: transparent;
        color: #FFF;
        font-family: "HarmonyOS Sans SC";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        padding: 0 0 0 10px;
        border-top: 1px solid #096DD9;
        border-bottom: 1px solid #096DD9;
    }

    .el-collapse-item__wrap {
        background: transparent;
        border-bottom-color: transparent;

        .el-collapse-item__content {
            padding-bottom: 0;

            .device-card {
                padding: 10px;

                .device-info {
                    color: #BFBFBF;
                    font-family: "HarmonyOS Sans SC";
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 22px; /* 157.143% */
                }
            }
        }
    }
}
</style>
<style scoped>
.info-label {
    color: #BFBFBF;
    font-family: "HarmonyOS Sans SC";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
}

.info {
    margin-top: 8px;
    margin-bottom: 16px;
    color: #FFF;
    font-family: "HarmonyOS Sans SC";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
}

.device-list {

    .device-item:first-child {
        border-top: 1px solid #096DD9;
    }

    .device-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #096DD9;
        padding: 4px 0;

        .name {
            color: #FFF;
            font-family: "HarmonyOS Sans SC";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
        }
    }

}
</style>