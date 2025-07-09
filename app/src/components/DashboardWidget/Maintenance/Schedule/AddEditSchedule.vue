<template>
    <el-dialog class="power-dialog" width="584px" title="配置维保计划" :visible.sync="dialogVisibility" @closed="close">
        <el-form class="power-form" ref="form" :model="formData" :rules="rules" label-position="top">
            <el-form-item label="设备" prop="device">
                <el-cascader
                    multiple
                    clearable
                    style="width: 100%;"
                    placeholder="请选择设备"
                    v-model="formData.device"
                    :options="hierarchy"
                    :props="{ multiple: true, value: 'id', label: 'name', emitPath: false, checkStrictly: true }"
                ></el-cascader>
            </el-form-item>
            <el-form-item label="执行人" prop="solver">
                <el-select multiple clearable style="width: 100%;" placeholder="请设置执行人" v-model="formData.solver">
                    <el-option v-for="person in people" :key="person.user.id" :value="person.user.id" :label="person.user.realName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="作业内容" prop="description">
                <el-input type="textarea" rows="4" placeholder="请输入作业内容" v-model="formData.description"></el-input>
            </el-form-item>
            <el-row :gutter="8">
                <el-col :span="6">
                    <el-form-item label="周期性执行？" prop="periodical">
                        <el-switch v-model="formData.periodical"></el-switch>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="计划时间" prop="scheduledAt" v-if="!formData.periodical">
                <el-date-picker type="datetime" style="width: calc(100% - 100px);" v-model="formData.scheduledAt" placeholder="请设置计划时间"></el-date-picker>
                <el-checkbox class="text-link m-l-15" v-model="formData.instantly">立即执行</el-checkbox>
            </el-form-item>
            <el-form-item label="循环周期" prop="period" v-if="formData.periodical">
                <el-input placeholder="* * * * *" v-model="formData.period"></el-input>
            </el-form-item>
            <el-form-item label="限制时段" prop="range" v-if="formData.periodical">
                <div class="flex align-items-center">
                    <el-date-picker class="m-r-5" type="datetime" placeholder="起始时间" clearable style="flex-grow: 1;" v-model="formData.range[0]">
                        <template slot="range-separator">—</template>
                    </el-date-picker>
                    ~
                    <el-date-picker class="m-l-5" type="datetime" placeholder="结束时间" clearable style="flex-grow: 1;" v-model="formData.range[1]">
                        <template slot="range-separator">—</template>
                    </el-date-picker>
                </div>
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
import {createSchedule, updateSchedule} from "@/assets/js/api/maintenance-schedules";
import {getUserList} from "@/assets/js/api/accounts";
import {getHierarchy} from "@/assets/js/api/hierarchy";

export default {
    name: "AddEditSchedule",
    components: {
        ConverterSelector
    },
    props: {
        dialogId: String,
        dialogVisibility: Boolean,
        record: Object
    },
    computed: {
        rules () {
            let result = {
                description: [{ required: true, message: "请设置维保任务内容", trigger: ["change", "blur"] }],
                periodical: [{ required: true, message: "请选择是否为周期任务", trigger: ["change", "blur"] }],
            }
            if (this.formData.periodical) {
                result["period"] = [{ required: true, message: "请设置执行周期", trigger: ["change", "blur"] }]
            }
            return result
        }
    },
    data () {
        return {
            advanced: false,
            formData: {
                periodical: false,
                instantly: false,
                description: [],
                device: [],
                period: "",
                solver: [],
                range: ["", ""],
            },
            people: [],
            hierarchy: [],
        }
    },
    methods: {
        close () {
            this.$emit("action-finished", false, this.dialogId);
        },
        getPeople () {
            getUserList().then(result => {
                this.people = result.data
            })
        },
        getHierarchy () {
            getHierarchy().then(result => {
                this.hierarchy = result.data
            })
        },
        submit () {
            this.$refs.form.validate(valid => {
                if (valid) {
                    [this.formData.startAt, this.formData.endAt] = this.formData.range
                    let action = null
                    if (this.formData.id) {
                        action = updateSchedule(this.formData.id, this.formData)
                    }
                    else {
                        action = createSchedule(this.formData)
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
        this.getPeople()
        this.getHierarchy()
        this.formData = Object.assign({}, this.record)
    }
}
</script>

<style scoped>

</style>