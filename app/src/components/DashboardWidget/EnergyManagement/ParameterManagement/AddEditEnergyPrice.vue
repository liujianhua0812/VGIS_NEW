<template>
    <el-dialog class="power-dialog" width="550px" :title="`${energy.name}价格`" :visible.sync="dialogVisibility" @closed="close">
        <el-form class="power-form" ref="form" :model="formData" :rules="rules">
            <el-form-item label="时段" prop="period">
                <div class="flex align-items-center full-w">
                    <el-date-picker type="date" placeholder="起始时间，留空为不限" clearable style="width: 100%;" v-model="formData.period[0]"></el-date-picker>
                    <span class="m-l-5 m-r-5">~</span>
                    <el-date-picker type="date" placeholder="结束时间，留空为不限" clearable style="width: 100%;" v-model="formData.period[1]"></el-date-picker>
                </div>
            </el-form-item>
            <el-form-item label="价格" prop="price">
                <el-input placeholder="请输入价格" v-model="formData.price">
                    <template slot="suffix">{{energy.unit || ""}}</template>
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

import { createPriceRecord, updatePriceRecord } from "@/assets/js/api/price";

export default {
    name: "AddEditEnergyPrice",
    props: {
        dialogId: String,
        dialogVisibility: Boolean,
        energy: String,
        record: Object
    },
    data () {
        return {
            rules: {
                price: [{ required: true, message: "请选择时间范围", trigger: ["change", "blur"] }],
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
            },
            formData: {
                period: [],
                price: ""
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
                    [this.formData.startAt, this.formData.endAt] = this.formData.period
                    this.formData.energy = this.energy.name
                    let action = null
                    if (this.formData.id) {
                        action = updatePriceRecord(this.formData.id, this.formData)
                    }
                    else {
                        action = createPriceRecord(this.formData)
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
        this.formData = Object.assign({}, this.record, {
            period: [this.record.startAt, this.record.endAt]
        })
    }
}
</script>

<style scoped>

</style>