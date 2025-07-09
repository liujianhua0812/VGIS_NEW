<template>
    <el-dialog class="power-dialog" width="550px" title="配置转换因子" :visible.sync="dialogVisibility" @closed="close">
        <el-form class="power-form" ref="form" :model="formData" :rules="rules">
            <el-form-item label="时间范围" prop="period">
                <div class="flex align-items-center full-w">
                    <el-date-picker type="date" placeholder="起始时间，留空为不限" clearable style="width: 100%;" v-model="formData.period[0]"></el-date-picker>
                    <span class="m-l-5 m-r-5">~</span>
                    <el-date-picker type="date" placeholder="结束时间，留空为不限" clearable style="width: 100%;" v-model="formData.period[1]"></el-date-picker>
                </div>
            </el-form-item>
            <el-form-item label="能耗指标" prop="factorId">
                <el-select class="full-w" v-model="formData.factorId" placeholder="选择类型" clearable>
                    <el-option v-for="factor in factors" :key="factor.id" :value="factor.id" :label="factor.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="数值" prop="value">
                <el-input type="number" v-model="formData.value" placeholder="请输入转换因子的数值">
                    <template slot="suffix">
                        {{currentFactor ? currentFactor.unit.name : ""}}
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
import ConverterSelector
    from "@/components/DashboardWidget/EnergyManagement/ParameterManagement/factor-selector.vue";
import {createFactorValue, getConversionFactors, updateFactorValue} from "@/assets/js/api/factor";

export default {
    name: "AddEditFactorValue",
    components: {
        ConverterSelector
    },
    props: {
        dialogId: String,
        dialogVisibility: Boolean,
        record: Object
    },
    computed: {
        currentFactor () {
            return this.factors.find(item => item.id === this.formData.factorId)
        }
    },
    data () {
        return {
            rules: {
                period: [{
                    validator: (rule, value, callback) => {
                        let [startAt, endAt] = value
                        if (startAt && endAt) {
                            if (startAt > endAt) {
                                return callback(new Error("起始时间不应晚于失效时间！"))
                            }
                        }
                        return callback();
                    },
                    trigger: ["change", "blur"]
                }],
                factorId: [{ required: true, message: "请选择能耗指标", trigger: ["change", "blur"] }],
                value: [{ required: true, message: "请设置数值", trigger: ["change", "blur"] }],
            },
            formData: {
                period: [],
                factorId: "",
                value: ""
            },
            factors: []
        }
    },
    methods: {
        close () {
            this.$emit("action-finished", false, this.dialogId);
        },
        getFactors () {
            getConversionFactors().then(result => {
                this.factors = result.data
            })
        },
        submit () {
            this.$refs.form.validate(valid => {
                if (valid) {
                    [this.formData.startAt, this.formData.endAt] = this.formData.period
                    let action = null
                    if (this.formData.id) {
                        action = updateFactorValue(this.formData.id, this.formData)
                    }
                    else {
                        action = createFactorValue(this.formData)
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
        this.getFactors()
        this.formData = Object.assign({}, this.record)
    }
}
</script>

<style scoped>

</style>