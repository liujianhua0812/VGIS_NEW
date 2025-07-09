<template>
    <el-dialog width="650px" v-auth="{ resources: 'Model', action: 'Admin' }" :title="title"
               :visible.sync="dialogVisibility" @close="close">
        <el-form label-position="top" :rules="rules" :model="formData" ref="alertForm">
            <el-form-item size="small" :label="$t('form.alertTemplate.name.label')" prop="name">
                <el-input v-model="formData.name" :placeholder="$t('form.alertTemplate.name.placeholder')"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="$t('form.alertTemplate.user.label')" prop="user">
                <el-select multiple clearable style="width: 100%;" :placeholder="$t('form.alertTemplate.user.placeholder')" v-model="formData.solver">
                    <el-option v-for="person in people" :key="person.user.id" :value="person.user.id" :label="person.user.realName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('form.alertTemplate.device.label')" prop="device">
                <el-cascader
                    multiple
                    clearable
                    style="width: 100%;"
                    :placeholder="$t('form.alertTemplate.device.placeholder')"
                    v-model="formData.device"
                    :options="hierarchy"
                    :props="{ multiple: true, value: 'id', label: 'name', emitPath: false, checkStrictly: true }"
                ></el-cascader>
            </el-form-item>
            <el-form-item size="small" :label="$t('form.alertTemplate.template.label')" prop="template">
                <el-input type="textarea" rows="8" v-model="formData.template" :placeholder="$t('form.alertTemplate.template.placeholder')"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer text-center">
            <el-button size="small" @click="close">{{ $t("action.cancel") }}</el-button>
            <el-button size="small" type="primary" @click="submit">{{ $t("action.confirm") }}</el-button>
        </div>
    </el-dialog>
</template>

<script>

import RichTextEditor from "@/components/Standard/RichTextEditor.vue";
import config from "@/config"
import {createAlertTemplate, updateAlertTemplate} from "@/assets/js/api/model-alert-template";
import {getUserList} from "@/assets/js/api/accounts";
import {getHierarchy} from "@/assets/js/api/hierarchy";

export default {
    name: "AddEditAlertTemplate",
    props: {
        dialogId: String,
        dialogVisibility: Boolean,
        modelId: String,
        template: {
            type: Object,
            default: () => {
            }
        }
    },
    components: {
        RichTextEditor
    },
    computed: {
        title() {
            return !this.template.id ? this.$t("form.title.addAlertTemplate") : this.$t("form.title.editAlertTemplate")
        },
        language() {
            return this.$store.state.setting.language || "en"
        }
    },
    data() {
        return {
            formLabelWidth: "140px",
            editorKey: config.general.editorKey,
            formData: {
                name: '',
                template: '',
                solver: [],
                device: [],
            },
            people: [],
            hierarchy: [],
            rules: {
                name: [
                    {
                        required: true,
                        trigger: ['change', 'blur'],
                        message: this.$t("form.alertTemplate.name.error.empty")
                    }
                ],
                subject: [
                    {
                        required: true,
                        trigger: ['change', 'blur'],
                        message: this.$t("form.alertTemplate.subject.error.empty")
                    }
                ],
                content: [
                    {
                        required: true,
                        trigger: ['change', 'blur'],
                        message: this.$t("form.alertTemplate.content.error.empty")
                    }
                ],
            }
        }
    },
    methods: {
        close() {
            this.$emit('action-finished', this.dialogId, false)
        },
        getUsers() {
            getUserList().then(result => {
                this.people = result.data
            })
        },
        getHierarchy () {
            getHierarchy().then(result => {
                this.hierarchy = result.data
            })
        },
        submit() {
            let formData = Object.assign({}, this.formData, {
                modelId: this.modelId
            })
            if (this.template.id) {
                updateAlertTemplate(this.modelId, this.template.id, formData).then(response => {
                    this.$message({
                        message: this.$t("message.alertTemplate.updated"),
                        type: 'success',
                        showClose: true,
                        duration: 2000
                    })
                    this.$emit('action-finished', this.dialogId, true)
                })
            } else {
                createAlertTemplate(this.modelId, formData).then(response => {
                    this.$message({
                        message: this.$t("message.alertTemplate.created"),
                        type: 'success',
                        showClose: true,
                        duration: 2000
                    })
                    this.$emit('action-finished', this.dialogId, true)
                })
            }
        }
    },
    created() {
        this.getHierarchy()
        this.getUsers()
        if (this.template.id) {
            this.formData = Object.assign({}, this.template)
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
