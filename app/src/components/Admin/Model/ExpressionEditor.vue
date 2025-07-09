<template>
    <div>
        <el-button size="small" type="primary" @click="dialogVisible = true">配置</el-button>
        <el-dialog append-to-body center :visible.sync="dialogVisible" @close="dialogVisible = false" v-if="dialogVisible">
            <el-form ref="form" class="custom-form" label-position="top" :model="formData">
                <el-form-item label="关联点位">
                    <el-row v-for="(item, index) in formData.series" :gutter="10" class="m-b-10" v-if="!loading">
                        <el-col :span="3">
                            <label v-if="!index">类型</label>
                            <el-select class="full-w" v-model="item.type" >
                                <el-option value="attribute" label="静态属性"></el-option>
                                <el-option value="series" label="时序点位"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="5" v-if="item.type === 'attribute'">
                            <label v-if="!index">静态属性</label>
                            <AttributeSelector class="full-w" v-model="item.attribute"></AttributeSelector>
                        </el-col>
                        <el-col :span="5" v-else>
                            <label v-if="!index">时序点位</label>
                            <PointSelector class="full-w" v-model="item.series"></PointSelector>
                        </el-col>
                        <el-col :span="5">
                            <label v-if="!index">表达式内名称</label>
                            <el-input v-model="item.name"></el-input>
                        </el-col>
                        <el-col :span="2">
                            <label v-if="!index">多值</label>
                            <div>
                                <el-switch v-model="item.multiple"></el-switch>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <label v-if="!index">默认绑定对象</label>
                            <DeviceSelector v-if="item.type === 'attribute'" :multiple="item.multiple" :extra="extraSelections" :model-id="item.attribute[0]" class="full-w" v-model="item.defaultInstanceId"></DeviceSelector>
                            <DeviceSelector v-else :multiple="item.multiple" :extra="extraSelections" :model-id="item.series[0]" class="full-w" v-model="item.defaultInstanceId"></DeviceSelector>
                        </el-col>
                        <el-col :span="3">
                            <label v-if="!index">&nbsp;</label>
                            <el-button type="danger" plain class="full-w el-icon-delete" @click="removeItem(index)"></el-button>
                        </el-col>
                    </el-row>
                    <el-button class="full-w el-icon-plus" type="primary" plain @click="addItem"></el-button>
                </el-form-item>
                <el-form-item label="表达式">
                    <el-input type="textarea" rows="4" v-model="formData.expression"></el-input>
                </el-form-item>
            </el-form>
            <div class="text-center">
                <el-button type="primary" @click="submit">{{$t("action.submit")}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import PointSelector from "@/components/Admin/Model/PointSelector.vue";
import DeviceSelector from "@/components/Admin/Model/DeviceSelector.vue";
import AttributeSelector from "@/components/Admin/Model/AttributeSelector.vue";

export default {
    name: "ExpressionEditor",
    components: {AttributeSelector, DeviceSelector, PointSelector},
    props: {
        value: String
    },
    data() {
        return {
            loading: false,
            rules: {
                expression: [
                    { required: true, message: "", trigger: ["change", "blur"] }
                ]
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
            dialogVisible: false,
            formData: {
                series: [],
                expression: ""
            }
        }
    },
    methods: {
        parseExpression() {
            try {
                let data = JSON.parse(this.value)
                if (data.series instanceof Array) {
                    this.formData.series = data.series
                }
                this.formData.expression = data.expression
            }
            catch (err) {}
        },
        getDefaultSeriesMapItem () {
            return {
                name: "",
                type: "series",
                attribute: ["", ""],
                series: ["", ""],
                multiple: false,
                defaultInstanceId: ""
            }
        },
        addItem () {
            this.formData.series = this.formData.series.concat([this.getDefaultSeriesMapItem()])
        },
        removeItem(index) {
            this.loading = true
            this.formData.series.splice(index, 1)
            this.formData.series = [].concat(this.formData.series)
            this.$nextTick(() => {
                this.loading = false
            })
        },
        submit () {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.$emit("input", JSON.stringify(this.formData))
                    this.dialogVisible = false
                }
            })
        }
    },
    created() {
        this.parseExpression()
    }
}
</script>

<style scoped>

</style>