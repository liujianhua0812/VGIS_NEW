<template>
    <el-dialog class="power-dialog" width="700px" title="维保任务" :visible.sync="dialogVisibility" @closed="close">
        <el-row :gutter="48">
            <el-col :span="11" style="border-right: 1px solid #616161;">
                <div class="info-label">计划时间</div>
                <div class="info">{{formData.createdAt.format("yyyy-MM-dd hh:mm:ss")}}</div>
                <div class="info-label">任务内容</div>
                <div class="info">{{record.description}}</div>
                <div class="info-label m-b-10">关联设备</div>
                <el-collapse class="maintenance-reference-list" accordion>
                    <el-collapse-item v-for="{ model_instance } in task.device_relations">
                        <template slot="title">
                            <div>{{model_instance.name}}（{{model_instance.instanceId}}）</div>
                        </template>
                        <div class="device-card">
                            <div class="device-info" v-for="name in attributes">{{name}}：{{model_instance.attributes[name] ? model_instance.attributes[name] : "未知"}}</div>
                            <el-button size="mini" class="power-primary" @click="showDocuments(model_instance)">查看维保材料</el-button>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </el-col>
            <el-col :span="13">
                <el-form class="power-form">
                    <el-form-item label="处理人">
                        <el-select multiple clearable style="width: 100%;" placeholder="请设置处理人" v-model="formData.solver">
                            <el-option v-for="person in people" :key="person.user.id" :value="person.user.id" :label="person.user.realName"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="处理状态" v-if="formData.status">
                        <el-radio-group style="width: 100%;" v-model="formData.status">
                            <el-radio label="pending">未处理</el-radio>
                            <el-radio label="undetermined">待议</el-radio>
                            <el-radio label="solved">已处理</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="处理时间">
                        <el-date-picker v-model="formData.handledAt" style="width: 100%;" type="datetime" placeholder="请选择处理时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="处理内容">
                        <el-input v-model="formData.solution" type="textarea" rows="4" placeholder="请输入处理内容">
                            <template slot="suffix">h</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="处理时长">
                        <el-input v-model="formData.solveTime" type="number" placeholder="请设置处理时长">
                            <template slot="suffix">h</template>
                        </el-input>
                    </el-form-item>
                </el-form>
                <div class="text-center">
                    <el-button class="power-primary" size="small" @click="submit">保存</el-button>
                    <el-button class="power-danger-outline" size="small" @click="close">取消</el-button>
                </div>
            </el-col>
        </el-row>
        <DocumentList :documents="documents" :dialog-visibility="dialogVisibilities.showDocuments" dialog-id="showDocuments" @action-finished="actionFinished"></DocumentList>
    </el-dialog>
</template>

<script>

import {getUserList} from "@/assets/js/api/accounts";
import {createTask, getTaskDetail, updateTask} from "@/assets/js/api/maintenance-tasks";
import {getFile} from "@/assets/js/api/media-file";
import {downloadFile} from "@/utils";
import DocumentList from "@/components/DashboardWidget/Maintenance/Regulation/DocumentList.vue";
export default {
    name: "HandleMaintenanceDialog",
    components: {DocumentList},
    props: {
        dialogId: String,
        dialogVisibility: Boolean,
        record: Object
    },
    data () {
        return {
            people: [],
            formData: {
                status: "",
                solution: "",
                solveTime: "",
                handledAt: "",
                solver: []
            },
            attributes: ["厂家", "质保状态", "联系人", "联系电话"],
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
        downloadFile(file) {
            getFile(file.id).then(result => {
                downloadFile(file.name, result.data)
            })
        },
        getUsers () {
            getUserList().then(result => {
                this.people = result.data
            })
        },
        showDocuments (instance) {
            this.documents = instance.documents
            this.dialogVisibilities.showDocuments = true
        },
        submit () {
            let action = null
            if (this.formData.id) {
                action = updateTask(this.formData.id, this.formData)
            }
            else {
                action = createTask(this.formData)
            }
            action.then(result => {
                this.$message({
                    message: "处理成功！",
                    showClose: true,
                    duration: 3000,
                    type: "success"
                })
                this.$emit("action-finished", true, this.dialogId);
            })
        },
        getTaskDetail () {
            getTaskDetail(this.record.id).then(result => {
                this.task = result.data
                for(let i = 0; i < this.task.device_relations.length; i++) {
                    this.task.device_relations[i].model_instance.attributes = this.task.device_relations[i].model_instance.attributes.reduce((result, item) => {
                        result[item.name] = item.value
                        return  result
                    }, {})
                }
            })
        }
    },
    created() {
        this.getTaskDetail()
        this.getUsers()
        this.formData = Object.assign(this.formData, this.record, {
            createdAt: new Date(this.record.createdAt),
            handledAt: this.record.handledAt ? new Date(this.record.handledAt) : "",
        })
    }
}
</script>
<style>
.maintenance-reference-list {
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

.divider {
    height: 100%;
    width: 1px;
    background: red;
}
</style>