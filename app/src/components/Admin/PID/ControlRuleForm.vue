<template>
    <el-form ref="form" label-position="top" :model="formData" :rules="rules">
        <el-form-item :label="$t('form.pid.rules.control.instance.label')" prop="instance">
            <DeviceSelector :multiple="false" class="full-w" v-model="formData.instance" @input="getChains(true)"></DeviceSelector>
        </el-form-item>
        <el-form-item :label="$t('form.pid.rules.control.chain.label')" prop="chain">
            <el-select v-model="formData.chain" class="full-w">
                <el-option v-for="chain in chains" :label="chain.name" :value="chain.id" :key="chain.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('form.pid.rules.control.validator.label')" prop="validator">
            <el-select class="full-w" v-model="formData.validator">
                <el-option value="none" :label="$t('form.pid.rules.control.validator.none')"></el-option>
                <el-option value="password" :label="$t('form.pid.rules.control.validator.password')"></el-option>
                <el-option value="fingerprint" :label="$t('form.pid.rules.control.validator.fingerprint')"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('form.pid.rules.control.password.label')" prop="password" v-if="formData.validator === 'password'">
            <el-input type="password" v-model="formData.password" show-password :label="$t('form.pid.rules.control.password.placeholder')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('form.pid.rules.control.confirmPassword.label')" prop="confirmPassword" v-if="formData.validator === 'password'">
            <el-input type="password" v-model="formData.confirmPassword" show-password :label="$t('form.pid.rules.control.confirmPassword.placeholder')"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import DeviceSelector from "@/components/Admin/Model/DeviceSelector.vue";
import PointSelector from "@/components/Admin/Model/PointSelector.vue";
import AttributeSelector from "@/components/Admin/Model/AttributeSelector.vue";
import {getRuleChainListForInstance} from "@/assets/js/api/model-instance-rule-chain";

export default {
    name: "ControlRuleForm",
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
                instance: [{ required: true, message:this.$t("form.pid.rules.control.instance.error.empty"), trigger: ["change", "blur"] }],
                chain: [{ required: true, message:this.$t("form.pid.rules.control.chain.error.empty"), trigger: ["change", "blur"] }],
                validator: [{ required: true, message:this.$t("form.pid.rules.control.validator.error.empty"), trigger: ["change", "blur"] }],
            }
            if (this.formData.validator === "password") {
                result.password = [{ required: true, message: this.$t("form.pid.rules.control.password.error.empty"), trigger: ["change", "blur"] }]
                result.confirmPassword = [
                    { required: true, message: this.$t("form.pid.rules.control.confirmPassword.error.empty"), trigger: ["change", "blur"] },
                    {
                        validator(rule, value, callback, source, options) {
                            if (value !== that.formData.password) {
                                return callback(new Error(that.$t("form.pid.rules.control.confirmPassword.error.mismatch")))
                            }
                            return callback()
                        },
                        trigger: ['change', 'blur']
                    }
                ]
            }
            return result
        }
    },
    data () {
        return {
            formData: {
                instance: "",
                chain: "",
                validator: "none",
                password: "",
                confirmPassword: ""
            },
            chains: []
        }
    },
    methods: {
        validate (cb) {
            return this.$refs.form.validate((valid) => {
                return cb(valid, this.formData)
            })
        },
        getChains (clear = true) {
            if (clear) {
                this.formData.chain = ""
            }
            if (this.formData.instance) {
                getRuleChainListForInstance(this.formData.instance).then(result => {
                    this.chains = result.data
                })
            }
        }
    },
    created () {
        if (this.configuration) {
            Object.assign(this.formData, this.configuration)
            this.getChains(false)
        }
    }
}
</script>

<style lang="scss" scoped>

</style>