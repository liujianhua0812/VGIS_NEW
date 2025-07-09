<template>
    <div class="flex align-items-center flex-column">
        <h3 class="text-bold" :style="{ color }">{{label}}</h3>
        <div class="text-info text-center" v-if="nodeConfig.type">
            <div>{{$t(`dict.${nodeConfig.type}`)}}</div>
            <div class="m-b-10" v-if="nodeConfig.type === 'interval'">
                {{$t('label.period')}}{{nodeConfig.interval}}{{currentTimeUnit ? currentTimeUnit.name : ''}}
            </div>
            <div class="m-b-10" v-else>
                {{$t('label.period')}}{{nodeConfig.interval}}{{currentTimeUnit ? currentTimeUnit.name : ''}}
            </div>
        </div>
        <el-button size="mini" type="primary" @click="editConfig">{{$t("action.configure")}}</el-button>
        <el-dialog width="438px" append-to-body :title="$t('form.title.editRule')" :visible.sync="dVisibility" @close="close">
            <el-form label-position="top">
                <el-form-item size="small" :label="$t('form.type.label')">
                    <el-select class="full-w" v-model="nodeConfig.type">
                        <el-option :label="$t('dict.interval')" value="interval"></el-option>
                        <el-option :label="$t('dict.crontab')" value="crontab"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item size="small" :label="$t('form.type.label')" v-if="nodeConfig.type === 'interval'">
                    <el-input :placeholder="$t('form.protocol.interval.placeholder')"  class="full-w" v-model="nodeConfig.interval" type="number" min="0">
                        <template slot="append">
                            <el-select style="width: 100px;" v-model="nodeConfig.timeUnit" default-first-option>
                                <el-option v-for="time in timeUnit" :key="time.name" :value="time.factor" :label="time.name"></el-option>
                            </el-select>
                        </template>
                    </el-input>
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
import {getNodeDetail} from "@/assets/js/api/hierarchy";
import {getModelDetail} from "@/assets/js/api/model";

export default {
    name: "TimerTemplate",
    extends: WidgetTemplate,
    computed: {
        currentTimeUnit () {
            return this.timeUnit.find(item => item.factor === this.nodeConfig.timeUnit)
        }
    },
    data() {
        return {
            nodeConfig: {
                type: "",
                crontab: "",
                interval: 1,
                timeUnit: 1
            },
            timeUnit: [{
                name: this.$t("dict.time.second"),
                factor: 1
            }, {
                name: this.$t("dict.time.minute"),
                factor: 60
            }, {
                name: this.$t("dict.time.hour"),
                factor: 60 * 60
            }, {
                name: this.$t("dict.time.day"),
                factor: 60 * 60 * 24
            }, {
                name: this.$t("dict.time.week"),
                factor: 60 * 60 * 24 * 7
            }, {
                name: this.$t("dict.time.month"),
                factor: 30 * 60 * 60 * 24
            }, {
                name: this.$t("dict.time.year"),
                factor: 365 * 60 * 60 * 24
            }]
        }
    },
    i18n: {
        messages: {
            en: {
                dict: {
                    interval: "Fixed Interval",
                    crontab: "Fixed Schedule"
                },
                form: {
                    type: {
                        label: "Type",
                        placeholder: "Please specify timer type."
                    }
                },
                label: {
                    period: "Period: "
                }
            },
            cn: {
                dict: {
                    interval: "固定间隔",
                    crontab: "固定时间"
                },
                form: {
                    type: {
                        label: "类型",
                        placeholder: "请设置定时器类型"
                    }
                },
                label: {
                    period: "周期："
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
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
