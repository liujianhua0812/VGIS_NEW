<template>
    <div class="flex align-items-center flex-column">
        <h3 class="text-bold" :style="{ color }">{{label}}</h3>
        <div class="test-result" v-if="testResult && testing">
            <div class="text-danger" v-if="testResult.error">{{testResult.error}}</div>
            <div v-else>{{$t('message.sent')}}</div>
        </div>
        <el-button v-show="!testing" size="mini" type="primary" @click="editConfig">{{$t("action.configure")}}</el-button>
        <el-dialog width="800px" append-to-body :title="$t('form.title.editRule')" :visible.sync="dVisibility" @close="close">
            <el-form label-position="top">
                <el-row :gutter="40">
                    <el-col :span="8">
                        <el-form-item size="small" :label="$t('form.smtp.label')">
                            <template slot="label">
                                <div class="flex align-items-center">
                                    {{$t('form.smtp.label')}}
                                    <el-switch class="m-l-10" v-model="nodeConfig.ssl" :active-text="$t('form.ssl.label')"></el-switch>
                                </div>
                            </template>
                            <el-input v-model="nodeConfig.smtp" :placeholder="$t('form.smtp.placeholder')"></el-input>
                        </el-form-item>
                        <el-form-item size="small" :label="$t('form.port.label')">
                            <el-input v-model="nodeConfig.port" :placeholder="$t('form.port.placeholder')"></el-input>
                        </el-form-item>
                        <el-form-item size="small" :label="$t('form.user.label')">
                            <el-input v-model="nodeConfig.user" :placeholder="$t('form.user.placeholder')"></el-input>
                        </el-form-item>
                        <el-form-item size="small" :label="$t('form.password.label')">
                            <el-input v-model="nodeConfig.password" :placeholder="$t('form.password.placeholder')" show-password></el-input>
                        </el-form-item>
                        <el-form-item size="small" :label="$t('form.target.label')">
                            <el-select class="full-w" multiple filterable clearable allow-create v-model="nodeConfig.target" :placeholder="$t('form.target.placeholder')"></el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item size="small" :label="$t('form.subject.label')">
                            <el-input v-model="nodeConfig.subject" :placeholder="$t('form.subject.placeholder')"></el-input>
                        </el-form-item>
                        <el-form-item size="small" :label="$t('form.template.label')">
                            <rich-text-editor v-model="nodeConfig.template" :config="{ height: '300px' }"></rich-text-editor>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="text-center m-t-10">
                <el-button type="primary" @click="close">{{$t('action.save')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import config from "@/config"
import WidgetTemplate from "../../template.vue"
import RichTextEditor from "@/components/Standard/RichTextEditor.vue";

export default {
    name: "SendEmilTemplate",
    components: {
        RichTextEditor
    },
    extends: WidgetTemplate,
    computed: {
        language () {
            return this.$store.state.setting.language || "en"
        }
    },
    data() {
        return {
            editorKey: config.general.editorKey,
            nodeConfig: {
                smtp: '',
                port: '',
                ssl: true,
                user: '',
                password: '',
                target: [],
                subject: '',
                template: '',
            }
        }
    },
    i18n: {
        messages: {
            en: {
                message: {
                    sent: "Email sent, please check mailbox!"
                },
                form: {
                    smtp: {
                        label: "SMTP Server",
                        placeholder: "Please specify SMTP server address."
                    },
                    port: {
                        label: "Port",
                        placeholder: "Please specify SMTP server port."
                    },
                    ssl: {
                        label: "SSL"
                    },
                    user: {
                        label: "User",
                        placeholder: "User account for your SMTP service"
                    },
                    password: {
                        label: "Password",
                        placeholder: ""
                    },
                    target: {
                        label: "Receivers",
                        placeholder: "Please specify receivers"
                    },
                    subject: {
                        label: "Subject",
                        placeholder: "Please specify email subject."
                    },
                    template: {
                        label: "Content Template",
                        placeholder: "Please specify email content template."
                    }
                }
            },
            cn: {
                message: {
                    sent: "邮件已发出，请检查邮箱！"
                },
                form: {
                    smtp: {
                        label: "SMTP服务器",
                        placeholder: "请输入SMTP服务器的地址。"
                    },
                    port: {
                        label: "端口",
                        placeholder: "请输入SMTP服务器的端口。"
                    },
                    ssl: {
                        label: "SSL"
                    },
                    user: {
                        label: "用户名",
                        placeholder: "请输入发送方账号的用户名。"
                    },
                    password: {
                        label: "密码",
                        placeholder: "请输入发送方账号的密码。"
                    },
                    target: {
                        label: "收件人",
                        placeholder: "请设置收件人"
                    },
                    subject: {
                        label: "邮件主题",
                        placeholder: "请设置邮件主题"
                    },
                    template: {
                        label: "正文模板",
                        placeholder: "请设置正文模板"
                    }
                }
            }
        }
    }
}
</script>