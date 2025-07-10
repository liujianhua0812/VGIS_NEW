<template>
    <el-dialog append-to-body class="power-dialog" width="400px" :title="`下发指令：${chain.name}`" :visible.sync="dialogVisibility" @closed="close">
        <el-form ref="form" label-position="top" :model="formData" :rules="rules" class="power-form" v-if="validator === 'password'">
            <el-form-item prop="password" label="密码">
                <el-input v-model="formData.password" type="password" show-password></el-input>
            </el-form-item>
        </el-form>
        <div class="text-center">
            <el-button class="power-primary" size="small" @click="submit">确认</el-button>
            <el-button class="power-danger-outline" size="small" @click="close">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>

import {createInstanceSeriesValue} from "@/assets/js/api/model-instance-series";
import {getRuleChainDetail} from "@/assets/js/api/model-instance-rule-chain";
import {executeDiagramPoint} from "@/assets/js/api/pid";

export default {
    name: "ConfirmControlActionForm",
    props: {
        dialogId: String,
        dialogVisibility: Boolean,
        pointId: String,
        instanceId: String,
        chainId: String,
        validator: String,
        preview: Boolean
    },
    computed: {
        rules () {
            let result = {}
            if (this.validator === "password") {
                result.password = [{ required: true, message: "请输入密码！", trigger: ["change", "blur"] }]
            }
            return result
        }
    },
    data () {
        return {
            formData:{
                password: ""
            },
            chain: ""
        }
    },
    methods: {
        close () {
            this.$emit("action-finished", false, this.dialogId);
        },
        execute () {
            // 如果预览模式，就只是做做样子，不实际填写数据
            if (this.preview) {
                this.$message({
                    type: "success",
                    message: this.$t("message.ruleChain.executed"),
                    showClose: true
                })
                this.$emit("action-finished", true, this.dialogId);
            }
            else {
                executeDiagramPoint(this.$route.params.diagramId, this.pointId, this.formData).then(result => {
                    this.$message({
                        type: "success",
                        message: this.$t("message.ruleChain.executed!"),
                        showClose: true
                    })
                    this.$emit("action-finished", true, this.dialogId);
                })
            }
        },
        submit () {
            if (this.validator === "password") {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        this.execute()
                    }
                })
            }
            else if (this.validator === "none") {
                this.execute()
            }
        },
        getRuleChain () {
            getRuleChainDetail(this.chainId).then(result => {
                this.chain = result.data
            })
        }
    },
    created() {
        this.getRuleChain()
    }
}
</script>

<style scoped>

</style>