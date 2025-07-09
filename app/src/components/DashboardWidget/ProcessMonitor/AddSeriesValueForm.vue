<template>
    <el-dialog append-to-body class="power-dialog" width="400px" title="填写点位值" :visible.sync="dialogVisibility" @closed="close">
        <el-form ref="form" label-position="top" :model="formData" :rules="rules" class="power-form">
            <el-form-item prop="time" label="时间">
                <el-date-picker class="full-w" type="datetime" v-model="formData.time" placeholder="请选择时间"></el-date-picker>
            </el-form-item>
            <el-form-item prop="value" label="点位值">
                <el-input v-model="formData.value" v-if="series.dataType === 'String'"></el-input>
                <el-input v-model="formData.value" type="textarea" rows="4"
                          v-if="series.dataType === 'Text'"></el-input>
                <el-input v-model="formData.value" :min="series.min" :max="series.max"
                          type="number" v-if="series.dataType === 'Integer'"></el-input>
                <el-input v-model="formData.value" :min="series.min" :max="series.max"
                          type="number" v-if="series.dataType === 'Decimal'"></el-input>
                <el-select v-model="formData.value" class="full-w"
                           v-if="series.dataType === 'Enum'">
                    <el-option v-for="value in series.candidate" :key="value" :label="value"
                               :value="value"></el-option>
                </el-select>
                <el-select v-model="formData.value" class="full-w" v-if="series.dataType === 'Boolean'">
                    <el-option :value="1" label="Yes"></el-option>
                    <el-option :value="0" label="No"></el-option>
                </el-select>
                <el-date-picker class="full-w" v-model="formData.value" type="datetime"
                                v-if="series.dataType === 'DateTime'"></el-date-picker>
                <el-date-picker class="full-w" v-model="formData.value" type="date"
                                v-if="series.dataType === 'Date'"></el-date-picker>
                <el-time-picker class="full-w" v-model="formData.value"
                                v-if="series.dataType === 'Time'"></el-time-picker>
            </el-form-item>
        </el-form>
        <div class="text-center">
            <el-button class="power-primary" size="small" @click="submit">保存</el-button>
            <el-button class="power-danger-outline" size="small" @click="close">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>

import {getTimeSeriesList} from "@/assets/js/api/model-series";
import {createInstanceSeriesValue} from "@/assets/js/api/model-instance-series";

export default {
    name: "AddSeriesValueForm",
    props: {
        dialogId: String,
        dialogVisibility: Boolean,
        seriesId: String,
        modelId: String,
        instanceId: String,
        preview: Boolean
    },
    computed: {
        rules () {
            let that = this
            let result = {
                time: [
                    { required: true, message: this.$t('form.series.time.error.empty'), trigger: ['change', 'blur'] }
                ],
                value: [
                    { required: true, message: "不可为空！", trigger: ['change', 'blur'] }
                ]
            }
            if (this.series) {
                if (this.series.min || this.series.min === 0) {
                    result.value.push({
                        validator(rule, value, callback) {
                            if (!value || parseFloat(value) >= that.series.min) {
                                callback()
                            }
                            else {
                                callback(new Error(that.$t('form.series.value.error.invalid')))
                            }
                        },
                        trigger:['change', 'blur']
                    })
                }
                if (this.series.max || this.series.max === 0) {
                    result.value.push({
                        validator(rule, value, callback) {
                            if (!value || parseFloat(value) <= that.series.max) {
                                callback()
                            }
                            else {
                                callback(new Error(that.$t('form.series.value.error.invalid')))
                            }
                        },
                        trigger:['change', 'blur']
                    })
                }
            }
            return result
        }
    },
    data () {
        return {
            formData:{
                time: "",
                value: ""
            },
            series: ""
        }
    },
    methods: {
        close () {
            this.$emit("action-finished", false, this.dialogId);
        },
        submit () {
            this.$refs.form.validate(valid => {
                if (valid) {
                    // 如果预览模式，就只是做做样子，不实际填写数据
                    if (this.preview) {
                        this.$message({
                            type: "success",
                            message: this.$t("message.series.value.updated"),
                            showClose: true
                        })
                    }
                    else {
                        let formData = {}
                        formData.time = this.formData.time
                        formData[this.seriesId] = this.formData.value
                        createInstanceSeriesValue(this.instanceId, formData).then(result => {
                            this.$message({
                                type: "success",
                                message: this.$t("message.series.value.updated"),
                                showClose: true
                            })
                        })

                    }
                    this.$emit("action-finished", true, this.dialogId);
                }
            })
        },
        getSeries () {
            getTimeSeriesList(this.modelId).then(result => {
                this.series = result.data.find(item => item.id === this.seriesId)
            })
        }
    },
    created() {
        this.getSeries()
    }
}
</script>

<style scoped>

</style>