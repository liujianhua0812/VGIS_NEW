<template>
    <el-dialog class="power-dialog" width="500px" :title="dialogTitle" :visible.sync="dialogVisibility" @closed="close">
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
    computed: {
        dialogTitle() {
            return this.formData.id ? "编辑记录" : "添加记录"
        }
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
                    // 确保时间格式正确
                    let timeValue = this.formData.time
                    console.log('Original time value:', timeValue, typeof timeValue)
                    
                    // 统一转换为Date对象，然后格式化为后端期望的格式
                    let dateObj = null
                    if (timeValue instanceof Date) {
                        dateObj = timeValue
                    } else if (typeof timeValue === 'string') {
                        dateObj = new Date(timeValue)
                    } else {
                        console.error('Unexpected time value type:', typeof timeValue, timeValue)
                        this.$message({
                            message: "时间格式无效！",
                            showClose: true,
                            duration: 3000,
                            type: "error"
                        })
                        return
                    }
                    
                    // 验证Date对象是否有效
                    if (!dateObj || isNaN(dateObj.getTime())) {
                        console.error('Invalid date object:', dateObj)
                        this.$message({
                            message: "时间格式无效！",
                            showClose: true,
                            duration: 3000,
                            type: "error"
                        })
                        return
                    }
                    
                    // 使用标准格式，确保后端能正确解析
                    // 避免时区问题，使用本地时间格式
                    const year = dateObj.getFullYear()
                    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
                    const day = String(dateObj.getDate()).padStart(2, '0')
                    const hours = String(dateObj.getHours()).padStart(2, '0')
                    const minutes = String(dateObj.getMinutes()).padStart(2, '0')
                    const seconds = String(dateObj.getSeconds()).padStart(2, '0')
                    timeValue = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
                    console.log('Final time value:', timeValue)
                    
                    let action = null
                    if (this.formData.id) {
                        // 编辑模式 - 使用PUT方法，更新单个记录
                        let updateData = {
                            time: timeValue,
                            value: this.formData.value
                        }
                        console.log('Update data:', updateData)
                        console.log('API call params:', {
                            instanceId: this.point.instanceId,
                            seriesId: this.point.id,
                            valueId: this.formData.id
                        })
                        action = updateInstanceSeriesValue(this.point.instanceId, this.point.id, this.formData.id, updateData)
                    }
                    else {
                        // 添加模式 - 使用POST方法，格式：{ time: "时间", seriesId: "值" }
                        let createData = {
                            time: timeValue
                        }
                        createData[this.point.id] = this.formData.value
                        console.log('Create data:', createData)
                        action = createInstanceSeriesValue(this.point.instanceId, createData)
                    }
                    action.then(result => {
                        console.log('AddEditRecord: API call successful, result:', result);
                        this.$message({
                            message: "处理成功！",
                            showClose: true,
                            duration: 3000,
                            type: "success"
                        })
                        
                        // 等待一段时间确保后端数据已保存，再触发刷新
                        setTimeout(() => {
                            console.log('AddEditRecord: Emitting action-finished event with dialogId:', this.dialogId);
                            this.$emit("action-finished", true, this.dialogId);
                        }, 500);
                    }).catch(error => {
                        console.error('API Error:', error)
                        console.error('Error response:', error.response)
                        console.error('Error request data:', {
                            time: timeValue,
                            pointId: this.point.id,
                            value: this.formData.value,
                            instanceId: this.point.instanceId
                        })
                        this.$message({
                            message: "操作失败：" + (error.response?.data?.message || error.message || "未知错误"),
                            showClose: true,
                            duration: 3000,
                            type: "error"
                        })
                    })
                }
            })
        }
    },
    created() {
        if (this.record && this.record.id) {
            const formDataCopy = Object.assign({}, this.formData, this.record)
            
            // 确保时间字段是有效的Date对象
            if (formDataCopy.time) {
                if (formDataCopy.time instanceof Date) {
                    // 如果已经是Date对象，检查是否有效
                    if (isNaN(formDataCopy.time.getTime())) {
                        formDataCopy.time = new Date()
                    }
                } else {
                    // 如果不是Date对象，尝试转换
                    const date = new Date(formDataCopy.time)
                    if (!isNaN(date.getTime())) {
                        formDataCopy.time = date
                    } else {
                        formDataCopy.time = new Date()
                    }
                }
            }
            
            this.formData = formDataCopy
        }
    },
    watch: {
        record: {
            handler(newRecord) {
                if (newRecord && newRecord.id) {
                    const formDataCopy = Object.assign({}, {
                        time: "",
                        value: ""
                    }, newRecord)
                    
                    // 确保时间字段是有效的Date对象
                    if (formDataCopy.time) {
                        if (formDataCopy.time instanceof Date) {
                            // 如果已经是Date对象，检查是否有效
                            if (isNaN(formDataCopy.time.getTime())) {
                                formDataCopy.time = new Date()
                            }
                        } else {
                            // 如果不是Date对象，尝试转换
                            const date = new Date(formDataCopy.time)
                            if (!isNaN(date.getTime())) {
                                formDataCopy.time = date
                            } else {
                                formDataCopy.time = new Date()
                            }
                        }
                    }
                    
                    this.formData = formDataCopy
                } else {
                    this.formData = {
                        time: "",
                        value: ""
                    }
                }
            },
            immediate: true,
            deep: true
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