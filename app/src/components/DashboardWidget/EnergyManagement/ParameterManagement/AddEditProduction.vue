<template>
    <el-dialog class="power-dialog" width="307px" title="配置月度产量" :visible.sync="dialogVisibility" @closed="close">
        <el-form ref="form" class="power-form" :model="formData" :rules="rules">
            <el-form-item label="年月" prop="time">
                <el-date-picker type="month" placeholder="请选择年月" clearable style="width: 100%;" v-model="formData.time"></el-date-picker>
            </el-form-item>
            <el-form-item label="产量" prop="value">
                <el-input type="number" v-model="formData.value" placeholder="请输入产量">
                    <template slot="suffix">
                        {{series.unit ? series.unit.name : ""}}
                    </template>
                </el-input>
            </el-form-item>
        </el-form>
        <div class="text-center">
            <el-button class="power-primary" @click="submit">保存</el-button>
            <el-button class="power-danger-outline" @click="close">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {createInstanceSeriesValue, updateInstanceSeriesValue} from "@/assets/js/api/model-instance-series";

export default {
    name: "AddEditProduction",
    props: {
        dialogId: String,
        dialogVisibility: Boolean,
        record: Object,
        series: Object,
        station: Object
    },
    computed: {
        rules () {
            return {
                time: [{ required: true, message: "请选择年月", trigger: ["change", "blur"] }],
                value: [
                    { required: true, message: "请设置数值！", trigger: ["change", "blur"] }
                ].concat([{
                    validator: (rule, value, callback) => {
                        value = parseFloat(value)
                        if (isNaN(value)) {
                            callback(new Error('请输入合法的数值！'));
                        }
                        else if ((this.series.min || this.series.min === 0) && value < this.series.min) {
                            callback(new Error(`数值不应该小于${this.series.min}！`));
                        }
                        else if ((this.series.max || this.series.max === 0) && value > this.series.max) {
                            callback(new Error(`数值不应＞${this.series.max}！`));
                        }
                        else {
                            callback();
                        }
                    },
                    trigger: ["change", "blur"]
                }]),
            }
        }
    },
    data () {
        return {
            formData: {}
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
                        time: this.formData.time
                    }
                    formData[this.series.id] = this.formData.value
                    if (this.formData.id) {
                        action = updateInstanceSeriesValue(this.station.id, formData)
                    }
                    else {
                        action = createInstanceSeriesValue(this.station.id, formData)
                    }

                    action.then(result => {
                        this.$message({
                            message: "设置成功！",
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
        this.formData = Object.assign({}, this.record)
    }
}
</script>

<style scoped>

</style>