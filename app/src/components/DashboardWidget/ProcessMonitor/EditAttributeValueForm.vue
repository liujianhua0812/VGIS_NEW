<template>
    <el-dialog append-to-body class="power-dialog" width="400px" title="填写属性值" :visible.sync="dialogVisibility" @closed="close">
        <el-form ref="form" :model="formData" :rules="rules" class="power-form">
            <el-form-item prop="value" :label="attribute.name">
                <el-input v-model="formData.value" v-if="attribute.dataType === 'String'"></el-input>
                <el-input v-model="formData.value" type="textarea" rows="4"
                          v-if="attribute.dataType === 'Text'"></el-input>
                <el-input v-model="formData.value" :min="attribute.min" :max="attribute.max"
                          type="number" v-if="attribute.dataType === 'Integer'"></el-input>
                <el-input v-model="formData.value" :min="attribute.min" :max="attribute.max"
                          type="number" v-if="attribute.dataType === 'Decimal'"></el-input>
                <el-select v-model="formData.value" class="full-w"
                           v-if="attribute.dataType === 'Enum'">
                    <el-option v-for="value in attribute.candidate" :key="value" :label="value"
                               :value="value"></el-option>
                </el-select>
                <el-select v-model="formData.value" class="full-w" v-if="attribute.dataType === 'Boolean'">
                    <el-option :value="1" label="Yes"></el-option>
                    <el-option :value="0" label="No"></el-option>
                </el-select>
                <el-date-picker class="full-w" v-model="formData.value" type="datetime"
                                v-if="attribute.dataType === 'DateTime'"></el-date-picker>
                <el-date-picker class="full-w" v-model="formData.value" type="date"
                                v-if="attribute.dataType === 'Date'"></el-date-picker>
                <el-time-picker class="full-w" v-model="formData.value"
                                v-if="attribute.dataType === 'Time'"></el-time-picker>
            </el-form-item>
        </el-form>
        <div class="text-center">
            <el-button class="power-primary" size="small" @click="submit">保存</el-button>
            <el-button class="power-danger-outline" size="small" @click="close">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {getStaticAttributeList} from "@/assets/js/api/model-attribute";
import {getStaticAttributeValues} from "@/assets/js/api/hierarchy";
import {deleteInstanceAttribute, updateInstanceAttribute} from "@/assets/js/api/model-instance-attribute";

export default {
    name: "EditAttributeValueForm",
    props: {
        dialogId: String,
        dialogVisibility: Boolean,
        attributeId: String,
        modelId: String,
        instanceId: String,
        preview: Boolean
    },
    computed: {
        rules () {
            let result = {}
            if (this.attribute.required) {
                result.value = [{ required: true, message: "不可为空！", trigger: ["change", "blur"] }]
            }
            return result
        }
    },
    data () {
        return {
            formData:{
                value: ""
            },
            attribute: ""
        }
    },
    methods: {
        close () {
            this.$emit("action-finished", false, this.dialogId);
        },
        submit () {
            this.$refs.form.validate(valid => {
                if (valid) {
                    if (this.preview) {
                        // 如果预览模式，就只是做做样子，不实际填写数据
                        this.$message({
                            type: "success",
                            message: this.$t("message.attribute.updated"),
                            showClose: true
                        })
                    }
                    else {
                        let action = null
                        if (!this.attribute.required && !this.formData.value) {
                            action = deleteInstanceAttribute(this.instanceId, this.attributeId, this.formData)
                        }
                        else {
                            action = updateInstanceAttribute(this.instanceId, this.attributeId, this.formData)
                        }
                        if (action) {
                            action.then(result => {
                                this.$message({
                                    type: "success",
                                    message: this.$t("message.attribute.updated"),
                                    showClose: true
                                })
                            })
                        }
                    }
                    this.$emit("action-finished", true, this.dialogId);
                }
            })
        },
        getAttribute () {
            getStaticAttributeList(this.modelId).then(result => {
                this.attribute = result.data.find(item => item.id === this.attributeId)
                getStaticAttributeValues(this.instanceId, [this.attribute.name]).then(result => {
                    let data = result.data[0]
                    if (data && (data.value || data.value === 0)) {
                        this.formData.value = data.value
                    }
                })
            })
        }
    },
    created() {
        this.getAttribute()
    }
}
</script>

<style scoped>

</style>