<template>
    <el-dialog width="400px" :title="$t('form.title.renamePID')" v-auth="{ resources: 'Model', action: 'Admin' }" :visible.sync="dialogVisibility" :before-close="close">
        <el-form ref="form" :model="formData" :rules="rules">
            <el-form-item prop="name" :label="$t('form.pid.name.label')">
                <el-input v-model="formData.name" :placeholder="$t('form.pid.name.placeholder')"></el-input>
            </el-form-item>
        </el-form>
        <div class="text-center p-b-20">
            <el-button type="primary" @click="submit">{{ $t("action.submit") }}</el-button>
            <el-button type="default" @click="close">{{ $t("action.cancel") }}</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {updateDiagram} from "@/assets/js/api/pid";

export default {
    name: "RenameDiagram",
    props: {
        dialogId: String,
        dialogVisibility: Boolean,
        pid: Object
    },
    data () {
        return {
            rules: {
                name: [{ required: true, message: this.$t("form.pid.name.error.empty"), trigger: ["change", "blur"] }]
            },
            formData: {
                name: ""
            }
        }
    },
    methods: {
        close() {
            this.$emit('action-finished', false, this.dialogId)
        },
        submit () {
            this.$refs.form.validate((valid, data) => {
                if (valid) {
                    updateDiagram(this.pid.id, Object.assign({}, this.pid, this.formData)).then(result => {
                        this.$message({
                            type: 'success',
                            message: this.$t("message.pid.updated"),
                            showClose: true
                        })
                        this.$emit('action-finished', true, this.dialogId, this.formData)
                    })
                }
            })
        }
    },
    created() {
        this.formData = Object.assign({}, this.pid)
    }
}
</script>

<style scoped>

</style>