<template>
    <div class="flex align-items-center flex-column">
        <h3 class="text-bold" :style="{ color }">{{label}}</h3>
        <div class="m-b-10" v-if="currentTemplate">
            {{currentTemplate.name}}
        </div>
        <div class="test-result" v-if="testing && testResult">
            <div class="text-center text-bold">{{testResult.result.subject}}</div>
        </div>
        <div class="test-result m-t-5" v-if="testing && testResult">
            <div v-html="testResult.result.content"></div>
        </div>
        <el-button v-show="!testing" size="mini" type="primary" @click="editConfig">{{$t("action.configure")}}</el-button>
        <el-dialog width="800px" append-to-body :title="$t('form.title.editRule')" :visible.sync="dVisibility" @close="close">
            <el-form ref="form" :model="nodeConfig" :rules="rules">
                <el-form-item :label="$t('form.module.label')" prop="module">
                    <el-input class="full-w" v-model="nodeConfig.module" :placeholder="$t('form.module.placeholder')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('form.templateId.label')" prop="templateId">
                    <el-cascader
                        multiple
                        clearable
                        style="width: 100%;"
                        :placeholder="$t('form.templateId.placeholder')"
                        v-model="nodeConfig.templateId"
                        :options="hierarchy"
                        :props="{ multiple: false, value: 'id', label: 'name', emitPath: false, checkStrictly: true, lazy: false }"
                    ></el-cascader>
                </el-form-item>
            </el-form>
            <div class="text-center m-t-10">
                <el-button type="primary" @click="save">{{$t('action.save')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import Color from "color"
import { getAlertTemplateList } from "@/assets/js/api/model-alert-template";
import WidgetTemplate from "../../template.vue"
import {getModelList} from "@/assets/js/api/model";
import {getAlertLevelList} from "@/assets/js/api/alert_level";

export default {
    name: "FirePowerSavingTaskTemplate",
    extends: WidgetTemplate,
    computed: {
        currentTemplate () {
            return this.templates.find(item => item.id === this.nodeConfig.templateId)
        }
    },
    data() {
        return {
            rules: {
                templateId: [{ required: true, message: this.$t("form.templateId.error.empty"), trigger: ["change", "blur"] }],
                module: [{ required: true, message: this.$t("form.module.error.empty"), trigger: ["change", "blur"] }],
            },
            nodeConfig: {
                templateId: "",
                module: ""
            },
            templates: [],
            hierarchy: []
        }
    },
    i18n: {
        messages: {
            en: {
                form: {
                    templateId: {
                        label: "Template",
                        placeholder: "Please select a template for your task.",
                        error: {
                            empty: "Cannot be empty!"
                        }
                    },
                    module: {
                        label: "Relevant Module",
                        placeholder: "Please specify relevant module for your task",
                        error: {
                            empty: "Cannot be empty!"
                        }
                    }
                }
            },
            cn: {
                form: {
                    templateId: {
                        label: "任务信息模板",
                        placeholder: "请选择一个任务信息模板",
                        error: {
                            empty: "不可为空！"
                        }
                    },
                    module: {
                        label: "从属模块",
                        placeholder: "请设置故障告警任务的从属模块",
                        error: {
                            empty: "不可为空！"
                        }
                    }
                }
            }
        }
    },
    methods: {
        getChildren (node, resolve) {
            if (node.data.type === "ModelGroup") {
                return resolve([])
            }
            else {
                return resolve(this.templates.filter(item => item.modelId === node.data.id))
            }
        },
        getAlertLevels () {
            getAlertLevelList({}).then(result => {
                this.alertLevels = result.data
            })
        },
        flushTreeProps (tree) {
            for(let i = 0; i < tree.length; i++) {
                tree[i].disabled = true
                if (tree[i].children && tree[i].children.length > 0) {
                    this.flushTreeProps(tree[i].children)
                }
                if (tree[i].type === "Model") {
                    tree[i].children = this.templates.filter(item => item.modelId === tree[i].id)
                }
            }
            return tree
        },
        getAlertTemplates () {
            Promise.all([
                getModelList({}),
                getAlertTemplateList(this.$route.params.modelId)
            ]).then(([models, templates]) => {
                this.templates = templates.data.map(item => {
                    item.disabled = false
                    return item
                })
                this.hierarchy = this.flushTreeProps(models.data)
            })
        },
        save () {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.close()
                }
            })
        }
    },
    created() {
        this.getAlertLevels()
        this.getAlertTemplates()
    }
}
</script>

<style lang="scss" scoped>

    .test-result {
        background: #DDDDDD;
        border-radius: 3px;
        width: 100%;
    }

    .rectangle {
        width: 14px;
        height: 14px;
    }
</style>
