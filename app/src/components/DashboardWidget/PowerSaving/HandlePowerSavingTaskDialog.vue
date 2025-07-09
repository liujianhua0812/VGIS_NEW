<template>
    <el-dialog class="power-dialog" width="700px" title="节能任务" :visible.sync="dialogVisibility" @closed="close">
        <el-row :gutter="48">
            <el-col :span="11">
                <div class="info-label">关联设备</div>
                <div class="info">{{formData.device}}</div>
                <div class="info-label">时间</div>
                <div class="info">{{formData.createdAt.format("yyyy-MM-dd hh:mm:ss")}}</div>
                <div class="info-label">任务内容</div>
                <div class="info">{{formData.description}}</div>
            </el-col>
            <el-col :span="13" style="border-left: 1px solid #616161;">
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
    </el-dialog>
</template>

<script>

import {createTask, updateTask} from "@/assets/js/api/power-saving-tasks";
import {getUserList} from "@/assets/js/api/accounts";
export default {
    name: "HandlePowerSavingTaskDialog",
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
            }
        }
    },
    methods: {
        close () {
            this.$emit("action-finished", false, this.dialogId);
        },
        getUsers () {
            getUserList().then(result => {
                this.people = result.data
            })
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
        }
    },
    created() {
        this.getUsers()
        this.formData = Object.assign(this.formData, this.record, {
            createdAt: new Date(this.record.createdAt),
            handledAt: this.record.handledAt ? new Date(this.record.handledAt) : "",
        })
    }
}
</script>

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

.device-card {
    margin-top: 8px;
    padding: 12px;
    border-radius: 8px;
    background: #003A8C;
}

.divider {
    height: 100%;
    width: 1px;
    background: red;
}
</style>