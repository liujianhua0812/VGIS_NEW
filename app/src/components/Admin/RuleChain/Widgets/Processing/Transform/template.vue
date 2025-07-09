<template>
    <div class="flex align-items-center flex-column">
        <h3 class="text-bold" :style="{ color }">{{label}}</h3>
        <div v-if="testing && testResult">
            <div class="text-center text-bold">{{$t("label.input")}}</div>
            <div class="test-result">
                {{testResult.input}}
            </div>
            <div class="text-center text-bold">{{$t("label.output")}}</div>
            <div class="text-danger" v-if="testResult.error">{{testResult.error}}</div>
            <div class="test-result" v-else>{{testResult.result}}</div>
        </div>
        <el-button v-show="!testing" size="mini" type="primary" @click="editConfig">{{$t("action.configure")}}</el-button>
        <el-dialog width="438px" append-to-body :title="$t('form.title.editRule')" :visible.sync="dVisibility" @close="close">
            <el-form label-position="top">
                <el-form-item class="m-b-0" :label="$t('form.executor.label')">
                    <codemirror :options="{ mode: 'text/javascript', theme: 'base16-light', lineNumbers: true, inputStyle: 'textarea' }" v-model="nodeConfig.action"></codemirror>
                </el-form-item>
                <el-form-item :label="$t('form.description.label')">
                    <el-input v-model="nodeConfig.description" type="textarea" rows="3" :placeholder="$t('form.description.placeholder')"></el-input>
                </el-form-item>
            </el-form>
            <div class="text-center m-t-10">
                <el-button type="primary" @click="close">{{$t('action.save')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import WidgetTemplate from "../../template.vue"

export default {
    name: "TransformTemplate",
    extends: WidgetTemplate,
    data() {
        return {
            nodeConfig: {
                action: `function (context, data) {\n// ${this.$t('form.executor.placeholder')}\n}`,
                description: ""
            }
        }
    },
    i18n: {
        messages: {
            en: {
                label: {
                    input: "Input",
                    output: "Output"
                },
                form: {
                    executor: {
                        label: "Executor",
                        placeholder: "Write your script here."
                    },
                    description: {
                        label: "Description",
                        placeholder: "Write a brief description about the script."
                    }
                }
            },
            cn: {
                label: {
                    input: "输入",
                    output: "输出"
                },
                form: {
                    executor: {
                        label: "数据转换函数",
                        placeholder: "在这里编写你自己的数据转换逻辑。"
                    },
                    description: {
                        label: "说明",
                        placeholder: "简要说明脚本的作用。"
                    }
                }
            }
        }
    }
}
</script>