<template>
    <el-dialog class="power-dialog" width="500px" title="编辑记录" :visible.sync="dialogVisibility" @closed="close">
        <el-form ref="form" class="power-form" :model="formData" :rules="rules">
            <el-form-item label="时间" prop="time">
                <el-date-picker class="full-w" v-model="formData.time" type="datetime" placeholder="请设置时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="数值" prop="value">
                <el-input v-model="formData.value" :minlength="point.min" :maxlength="point.max" v-if="point.dataType === 'String'" placeholder="请设置取值"></el-input>
                <el-input v-model="formData.value" :minlength="point.min" :maxlength="point.max" type="textarea" rows="4" v-if="point.dataType === 'Text'" placeholder="请设置取值"></el-input>
                <el-input v-model="formData.value" :min="point.min" :max="point.max" type="number" v-if="point.dataType === 'Integer'" placeholder="请设置取值">
                    <template slot="suffix">{{ point.unit ? point.unit.name : '' }}</template>
                </el-input>
                <el-input v-model="formData.value" :min="point.min" :max="point.max" type="number" v-if="point.dataType === 'Decimal'" placeholder="请设置取值">
                    <template slot="suffix">{{ point.unit ? point.unit.name : '' }}</template>
                </el-input>
                <el-select v-model="formData.value" class="full-w" v-if="point.dataType === 'Enum'" placeholder="请设置取值">
                    <el-option v-for="value in point.candidate" :key="value" :label="value" :value="value"></el-option>
                </el-select>
                <el-select v-model="formData.value" class="full-w" v-if="point.dataType === 'Boolean'" placeholder="请设置取值">
                    <el-option :value="true" :label="$t('dict.bool.true')"></el-option>
                    <el-option :value="false" :label="$t('dict.bool.false')"></el-option>
                </el-select>
                <el-date-picker class="full-w" v-model="formData.value" type="datetime" v-if="point.dataType === 'DateTime'" placeholder="请设置取值"></el-date-picker>
                <el-date-picker class="full-w" v-model="formData.value" type="date" v-if="point.dataType === 'Date'" placeholder="请设置取值"></el-date-picker>
                <el-time-picker class="full-w" v-model="formData.value" v-if="point.dataType === 'Time'" placeholder="请设置取值"></el-time-picker>
            </el-form-item>
        </el-form>
        <div class="text-center">
            <el-button class="power-primary" size="small" @click="submit">保存</el-button>
            <el-button class="power-danger-outline" size="small" @click="close">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>

import {getUserList} from "@/assets/js/api/accounts";
import {createTask, updateTask} from "@/assets/js/api/maintenance-tasks";
import {createInstanceSeriesValue, updateInstanceSeriesValue} from "@/assets/js/api/model-instance-series";
export default {
    name: "AddEditRecord",
    props: {
        dialogId: String,
        dialogVisibility: Boolean,
        point: Object,
        record: Object
    },
    data () {
        return {
            people: [],
            rules: {
                time: [
                    { required: true, message: "不可为空！", trigger: ["change", "blur"] },
                ],
                value: [
                    { required: true, message: "不可为空！", trigger: ["change", "blur"] },
                ]
            },
            formData: {
                time: "",
                value: ""
            }
        }
    },
    methods: {
        close () {
            this.$emit("action-finished", false, this.dialogId);
        },
        submit () {
            this.$refs.form.validate(valid => {
                if (valid) {
                    let action = null
                    let formData = {
                        time: this.formData.time,
                        value: [this.point.id, this.formData.value]
                    }
                    if (this.formData.id) {
                        action = updateInstanceSeriesValue(this.point.instanceId, this.formData.id, formData)
                    }
                    else {
                        let formData = {
                            time: this.formData.time
                        }
                        formData[this.point.id] = this.formData.value
                        action = createInstanceSeriesValue(this.point.instanceId, formData)
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
            })
        }
    },
    created() {
        if (this.record.id) {
            this.formData = Object.assign(this.formData, this.record)
        }
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