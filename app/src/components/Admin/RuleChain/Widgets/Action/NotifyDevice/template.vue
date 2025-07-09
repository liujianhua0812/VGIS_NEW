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
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item size="small" :label="$t('form.MQTT.label')">
                            <el-input v-model="nodeConfig.mqtt" :placeholder="$t('form.MQTT.placeholder')"></el-input>
                        </el-form-item>
                        <el-form-item size="small" :label="$t('form.timeout.label')">
                            <el-input type="number" :min="0" v-model="nodeConfig.timeout" :placeholder="$t('form.timeout.placeholder')"></el-input>
                        </el-form-item>
                        <el-form-item size="small" :label="$t('form.username.label')">
                            <el-input v-model="nodeConfig.username" :placeholder="$t('form.username.placeholder')"></el-input>
                        </el-form-item>
                        <el-form-item size="small" :label="$t('form.password.label')">
                            <el-input v-model="nodeConfig.password" :placeholder="$t('form.password.placeholder')"></el-input>
                        </el-form-item>
                        <el-form-item size="small" :label="$t('form.channel.label')">
                            <el-input v-model="nodeConfig.channel" :placeholder="$t('form.channel.placeholder')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item size="small" :label="$t('form.type.label')">
                            <el-select v-model="nodeConfig.type" :placeholder="$t('form.type.placeholder')">
                                <el-option label="Text" value="Text"></el-option>
                                <el-option label="JSON" value="JSON"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item size="small" :label="$t('form.template.label')">
                            <el-input v-if="nodeConfig.type === 'Text'" v-model="nodeConfig.template" :placeholder="$t('form.template.placeholder')" type="textarea" rows="10"></el-input>
                            <codemirror v-else :options="{ mode: 'application/json', theme: 'base16-light', lineNumbers: true, inputStyle: 'textarea' }" v-model="nodeConfig.template"></codemirror>
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

import WidgetTemplate from "../../template.vue"

export default {
    name: "NotifyDeviceTemplate",
    extends: WidgetTemplate,
    data() {
        return {
            nodeConfig: {
                mqtt: '',
                channel: '',
                timeout: '',
                username: '',
                password: '',
                type: 'Text',
                template: '',
            }
        }
    },
    i18n: {
        messages: {
            en: {
                message: {
                    sent: "Message sent!"
                },
                form: {
                    MQTT: {
                        label: "MQTT broker address",
                        placeholder: "Please specify MQTT broker's address."
                    },
                    channel: {
                        label: "Channel",
                        placeholder: "Please specify channel."
                    },
                    username: {
                        label: "Broker Username",
                        placeholder: "Please specify username(if required by your broker)."
                    },
                    password: {
                        label: "Broker Password",
                        placeholder: "Please specify password(if required by your broker)."
                    },
                    type: {
                        label: "Message type",
                        placeholder: "Please select message type."
                    },
                    timeout: {
                        label: "Connection timeout",
                        placeholder: "Please specify connection timeout (unit: s)"
                    },
                    template: {
                        label: "Content Template",
                        placeholder: "Please specify message template."
                    }
                }
            },
            cn: {
                message: {
                    sent: "消息已发出！"
                },
                form: {
                    MQTT: {
                        label: "MQTT服务地址",
                        placeholder: "请设置MQTT服务的地址。"
                    },
                    channel: {
                        label: "目标Channel",
                        placeholder: "请设置目标Channel。"
                    },
                    type: {
                        label: "消息类型",
                        placeholder: "请选择消息类型。"
                    },
                    username: {
                        label: "Broker用户名",
                        placeholder: "请设置用户名（若有需要）。"
                    },
                    password: {
                        label: "Broker密码",
                        placeholder: "请设置密码（若有需要）。"
                    },
                    timeout: {
                        label: "超时阈值",
                        placeholder: "请设置超时阈值（单位：秒）。"
                    },
                    template: {
                        label: "消息模板",
                        placeholder: "请设置发送消息的模板。"
                    }
                }
            }
        }
    }
}
</script>
