<template>
    <el-form ref="form" label-position="top" :model="formData" :rules="rules">
        <el-form-item :label="$t('form.pid.rules.form.type.label')" prop="type">
            <el-select class="full-w" v-model="formData.type">
                <el-option value="attribute" :label="$t('form.pid.rules.form.type.attribute')"></el-option>
                <el-option value="series" :label="$t('form.pid.rules.form.type.series')"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('form.pid.rules.form.attribute.label')" prop="attribute" v-if="formData.type === 'attribute'">
            <AttributeSelector class="full-w" v-model="formData.attribute"></AttributeSelector>
        </el-form-item>
        <el-form-item :label="$t('form.pid.rules.form.series.label')" prop="series" v-if="formData.type === 'series'">
            <PointSelector class="full-w" v-model="formData.series"></PointSelector>
        </el-form-item>
        <el-form-item :label="$t('form.pid.rules.form.instance.label')" prop="instance">
            <DeviceSelector v-if="formData.type === 'attribute'" :multiple="false" :model-id="formData.attribute[0]" class="full-w" v-model="formData.instance"></DeviceSelector>
            <DeviceSelector v-else :multiple="false" :model-id="formData.series[0]" class="full-w" v-model="formData.instance"></DeviceSelector>
        </el-form-item>
        <el-form-item :label="$t('form.pid.rules.form.trigger.label')" prop="trigger">
            <el-select class="full-w" v-model="formData.trigger">
                <el-option value="click" :label="$t('form.pid.rules.form.trigger.click')"></el-option>
                <el-option value="dblclick" :label="$t('form.pid.rules.form.trigger.dblclick')"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
</template>

<script>
import DeviceSelector from "@/components/Admin/Model/DeviceSelector.vue";
import PointSelector from "@/components/Admin/Model/PointSelector.vue";
import AttributeSelector from "@/components/Admin/Model/AttributeSelector.vue";

export default {
    name: "DataRuleForm",
    components: {AttributeSelector, PointSelector, DeviceSelector},
    props: {
        pid: {
            type: Object
        },
        configuration: {
            type: Object
        }
    },
    computed: {
        rules () {
            let that = this
            let result = {
                type: [{ required: true, message:this.$t("form.pid.rules.form.type.error.empty"), trigger: ["change", "blur"] }],
                instance: [{ required: true, message:this.$t("form.pid.rules.form.instance.error.empty"), trigger: ["change", "blur"] }],
                trigger: [{ required: true, message:this.$t("form.pid.rules.form.trigger.error.empty"), trigger: ["change", "blur"] }],
            }
            if (this.formData.type === "attribute") {
                result.attribute = [{ required: true, message: this.$t("form.pid.rules.form.attribute.error.empty"), trigger: ["change", "blur"] }]
            }
            if (this.formData.type === "series") {
                result.series = [{ required: true, message: this.$t("form.pid.rules.form.series.error.empty"), trigger: ["change", "blur"] }]
            }
            return result
        }
    },
    data () {
        return {
            formData: {
                type: "attribute",
                instance: "",
                attribute: "",
                series: "",
                trigger: "click"
            }
        }
    },
    methods: {
        validate (cb) {
            return this.$refs.form.validate((valid) => {
                return cb(valid, this.formData)
            })
        }
    },
    created () {
        if (this.configuration) {
            Object.assign(this.formData, this.configuration)
        }
    }
}
</script>

<style lang="scss" scoped>

</style>