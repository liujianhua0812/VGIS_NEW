<template>
    <div class="flex align-items-center flex-column">
        <h3 class="text-bold" :style="{ color }">{{label}}</h3>
        <div class="m-b-10" v-if="currentTemplate">
            <b v-if="currentLevel" :style="{ color: currentLevel.color }">●</b>
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
                <el-form-item :label="$t('form.type.label')" prop="level">
                    <el-select class="full-w" v-model="nodeConfig.type" :placeholder="$t('form.type.placeholder')">
                        <el-option v-for="item in types" :key="item" :value="item" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('form.level.label')" prop="level">
                    <el-select class="full-w" v-model="nodeConfig.level">
                        <el-option v-for="item in alertLevels" :key="item.name" :value="item.id" :label="item.name">
                            <div class="flex align-items-center justify-content-between">
                                <span style="float: left">{{ item.name }}</span>
                                <span :style="`float: right; color: #FFFFFF; background: ${item.color}; border-radius: 50%; width: 16px; height: 16px; font-size: 13px; line-height: 16px; text-align: center;`">{{ item.level }}</span>
                            </div>
                        </el-option>
                    </el-select>
                </el-form-item>
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
    name: "FireMalfunctionTaskTemplate",
    extends: WidgetTemplate,
    computed: {
        currentLevel () {
            return this.alertLevels.find(item => item.id === this.nodeConfig.level)
        },
        currentTemplate () {
            return this.templates.find(item => item.id === this.nodeConfig.templateId)
        }
    },
    data() {
        return {
            rules: {
                templateId: [{ required: true, message: this.$t("form.templateId.error.empty"), trigger: ["change", "blur"] }],
                level: [{ required: true, message: this.$t("form.level.error.empty"), trigger: ["change", "blur"] }],
                type: [{ required: true, message: this.$t("form.type.error.empty"), trigger: ["change", "blur"] }],
                module: [{ required: true, message: this.$t("form.module.error.empty"), trigger: ["change", "blur"] }],
            },
            nodeConfig: {
                templateId: "",
                level: "",
                type: "",
                module: ""
            },
            alertLevels: [],
            templates: [],
            hierarchy: [],
            types: ["传感器故障", "机组导出故障", "需求不满足故障"]
        }
    },
    i18n: {
        messages: {
            en: {
                form: {
                    type: {
                        label: "Type",
                        placeholder: "Please specify type for your malfunction task",
                        error: {
                            empty: "Cannot be empty!"
                        }
                    },
                    templateId: {
                        label: "Template",
                        placeholder: "Please select a template for your task.",
                        error: {
                            empty: "Cannot be empty!"
                        }
                    },
                    level: {
                        label: "Alert Level",
                        placeholder: "Please specify alert level for your task",
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
                    type: {
                        label: "故障类型",
                        placeholder: "请设置故障类型",
                        error: {
                            empty: "不可为空！"
                        }
                    },
                    level: {
                        label: "故障等级",
                        placeholder: "请设置故障等级",
                        error: {
                            empty: "不可为空！"
                        }
                    },
                    templateId: {
                        label: "故障告警模板",
                        placeholder: "请选择一个告警模板",
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
