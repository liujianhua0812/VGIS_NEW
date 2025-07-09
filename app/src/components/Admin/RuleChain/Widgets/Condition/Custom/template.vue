<template>
    <div class="flex align-items-center flex-column">
        <h3 class="text-bold" :style="{ color }">{{label}}</h3>
        <p class="text-info p-r-15" v-if="nodeConfig.description">{{nodeConfig.description}}</p>
        <el-button v-show="!testing" size="mini" type="primary" @click="editConfig">{{$t("action.configure")}}</el-button>
        <div class="output-indicator" v-if="!testing || (testing && !testResult.error)">
            <div :class="['m-b-5', testing && testResult && testResult.result ? 'text-primary' : 'text-info']">{{$t('dict.bool.true')}}</div>
            <div :class="[testing && testResult && !testResult.result ? 'text-primary' : 'text-info']">{{$t('dict.bool.false')}}</div>
        </div>
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
    name: "CustomConditionTemplate",
    extends: WidgetTemplate,
    data() {
        return {
            nodeConfig: {
                description: '',
                action: `function (context, data) {\n// ${this.$t('form.executor.placeholder')}\n}`
            }
        }
    },
    i18n: {
        messages: {
            en: {
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
                form: {
                    executor: {
                        label: "判断函数",
                        placeholder: "在这里编写你自己的条件判断逻辑。"
                    },
                    description: {
                        label: "说明",
                        placeholder: "简要说明判别逻辑的作用。"
                    }
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>

    .test-result {
        background: #DDDDDD;
        border-radius: 3px;
    }

    .output-indicator {
        position: absolute;
        right: 15px;
        top: 0;
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }
</style>
