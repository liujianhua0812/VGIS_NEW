<template>
    <el-dialog v-auth="{ resources: 'Model', action: 'Admin' }" title="配置参数"
               :visible.sync="dialogVisibility" @close="close">
        <el-form ref="form" class="custom-form" label-position="top" :model="formData">
            <el-form-item label="表达式">
                <el-input disabled type="textarea" rows="4" v-model="formData.expression"></el-input>
            </el-form-item>
            <el-form-item label="关联点位">
                <el-row v-for="(item, index) in formData.series" :gutter="10" class="m-b-10">
                    <el-col :span="6">
                        <label v-if="!index">点位</label>
                        <PointSelector disabled class="full-w" v-model="item.series"></PointSelector>
                    </el-col>
                    <el-col :span="4">
                        <label v-if="!index">表达式内名称</label>
                        <el-input disabled v-model="item.name"></el-input>
                    </el-col>
                    <el-col :span="2">
                        <label v-if="!index">多值</label>
                        <div>
                            <el-switch disabled v-model="item.multiple"></el-switch>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <label v-if="!index">默认绑定对象</label>
                        <DeviceSelector :multiple="!!item.multiple" :extra="extraSelections" disabled :model-id="item.series[0]" class="full-w" v-model="item.defaultInstanceId"></DeviceSelector>
                    </el-col>
                    <el-col :span="6">
                        <label v-if="!index">绑定对象</label>
                        <DeviceSelector :multiple="!!item.multiple" :model-id="item.series[0]" class="full-w" v-model="item.instanceId"></DeviceSelector>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
        <div class="text-center p-b-20">
            <el-button size="small" type="danger" @click="clearCustomization">{{$t("action.delete")}}</el-button>
            <el-button size="small" type="primary" @click="submit">{{$t("action.confirm")}}</el-button>
        </div>
    </el-dialog>
</template>

<script>

import { addRuleChain, updateRuleChain } from "@/assets/js/api/model-instance-rule-chain";
import PointSelector from "@/components/Admin/Model/PointSelector.vue";
import DeviceSelector from "@/components/Admin/Model/DeviceSelector.vue";
import {getSeriesCustomization, updateSeriesCustomization, clearSeriesCustomization} from "@/assets/js/api/model-instance-series";

export default {
    name: "CustomizeTimeSeries",
    components: {DeviceSelector, PointSelector},
    props: {
        dialogId: String,
        dialogVisibility: Boolean,
        instanceId: String,
        series: Object
    },
    data() {
        return {
            formLabelWidth: "140px",
            formData: {
                series: [],
                expression: ""
            },
            extraSelections: [{
                id: "self",
                name: "自身"
            }, {
                id: "parent",
                name: "直属上级"
            }, {
                id: "ancestor",
                name: "上级"
            }, {
                id: "child",
                name: "直属下级",
                multiple: true
            }, {
                id: "descendant",
                name: "下级",
                multiple: true
            }, {
                id: "all",
                name: "全部",
                multiple: true
            }],
            rules: {
                name: [
                    { required: true, trigger: ['change', 'blur'], message: this.$t("form.ruleChain.name.error.empty") }
                ],
            }
        }
    },
    methods: {
        close() {
            this.$emit('action-finished', this.dialogId, false)
        },
        clearCustomization () {
            this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
                confirmButtonText: this.$t("action.confirm"),
                cancelButtonText: this.$t("action.cancel"),
                type: 'warning'
            }).then(() => {
                clearSeriesCustomization("", this.instanceId, this.series.id, {}).then(result => {
                    this.$message({
                        message: this.$t("message.series.updated"),
                        type: 'success',
                        showClose: true,
                        duration: 2000
                    })
                    this.$emit('action-finished', this.dialogId, true)
                })
            })
        },
        submit() {
            updateSeriesCustomization("", this.instanceId, this.series.id, this.formData).then(response => {
                this.$message({
                    message: this.$t("message.series.updated"),
                    type: 'success',
                    showClose: true,
                    duration: 2000
                })
                this.$emit('action-finished', this.dialogId, true)
            })
        },
        flushData () {
            getSeriesCustomization("", this.instanceId, this.series.id, {}).then(result => {
                let data = JSON.parse(this.series.calculationMethod)
                let customization = {
                    series: []
                }
                if (result.data) {
                    customization = JSON.parse(result.data.calculationMethod)
                }
                let customMap = customization.series.reduce((result, item) => {
                    result[item.name] = item.instanceId
                    return result
                }, {})
                data.series = data.series.map(item => {
                    item.instanceId = customMap[item.name]
                    return item
                })
                this.formData = data
            })
        }
    },
    created() {
        this.flushData()
    }
}
</script>
<style lang="scss" scoped>

</style>
