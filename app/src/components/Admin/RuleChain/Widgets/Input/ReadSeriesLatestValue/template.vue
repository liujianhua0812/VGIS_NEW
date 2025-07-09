<template>
    <div class="flex align-items-center flex-column">
        <h3 class="text-bold" :style="{ color }">{{label}}</h3>
        <el-button size="mini" type="primary" @click="editConfig">{{$t("action.configure")}}</el-button>
        <el-dialog width="800px" append-to-body :title="$t('form.title.editRule')" :visible.sync="dVisibility" @close="close">
            <el-form ref="form" label-position="top" :model="nodeConfig" :rules="rules">
                <el-form-item size="small" :label="$t('form.series.label')" prop="series">
                    <PointSelector class="full-w" v-model="nodeConfig.series"></PointSelector>
                </el-form-item>
                <el-form-item size="small" :label="$t('form.instance.label')" prop="instance">
                    <DeviceSelector :multiple="false" :model-id="nodeConfig.series[0]" class="full-w" v-model="nodeConfig.instance"></DeviceSelector>
                </el-form-item>
                <el-form-item size="small" prop="period">
                    <template slot="label">
                        {{$t('form.period.label')}}
                        <el-switch class="m-l-30" :active-text="$t('form.period.realtime')" :inactive-text="$t('form.period.static')" v-model="nodeConfig.period.realtime"></el-switch>                    </template>
                    <div v-if="nodeConfig.period.realtime">
                        <el-input v-model="nodeConfig.period.gap" :placeholder="$t('form.period.gap.placeholder')">
                            <el-select slot="append" style="width: 100px;" v-model="nodeConfig.period.gapUnit" default-first-option>
                                <el-option v-for="time in timeUnit" :key="time.name" :value="time.factor" :label="time.name"></el-option>
                            </el-select>
                        </el-input>
                    </div>
                    <div v-else class="flex align-items-center justify-content-between">
                        <el-date-picker style="flex-grow: 1;" type="datetime" v-model="nodeConfig.period.startAt"></el-date-picker>
                        <span class="m-l-5 m-r-5" style="flex-shrink: 0;">~</span>
                        <el-date-picker style="flex-grow: 1;" type="datetime" v-model="nodeConfig.period.endAt"></el-date-picker>
                    </div>
                </el-form-item>
            </el-form>
            <div class="text-center m-t-10">
                <el-button type="primary" @click="save">{{$t('action.save')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import WidgetTemplate from "../../template.vue"
import DeviceSelector from "@/components/Admin/Model/DeviceSelector.vue";
import PointSelector from "@/components/Admin/Model/PointSelector.vue";

export default {
    name: "ReadSeriesLatestValueTemplate",
    components: {PointSelector, DeviceSelector},
    extends: WidgetTemplate,
    data() {
        let that = this
        return {
            rules: {
                series: [{ required: true, message: this.$t("form.series.error.empty"), trigger: ["change", "blur"] }],
                instance: [{ required: true, message: this.$t("form.instance.error.empty"), trigger: ["change", "blur"] }],
                period: [
                    { required: true, message: this.$t("form.period.error.empty"), trigger: ["change", "blur"] },
                    {
                        validator (rule, value, callback) {
                            if (value.realtime) {
                                if (!value.gap) {
                                    return callback(new Error(that.$t("form.period.error.empty")))
                                }
                                let gap = parseFloat(value.gap)
                                if (isNaN(gap) || gap <= 0) {
                                    return callback(new Error(that.$t("form.period.error.invalidGap")))
                                }
                            }
                            else {
                                if (value.endAt && value.startAt) {
                                    if (value.endAt < value.startAt) {
                                        return callback(new Error(that.$t("form.period.error.invalidDate")))
                                    }
                                }
                            }
                            return callback()
                        },
                        trigger: ["change", "blur"]
                    }
                ]
            },
            nodeConfig: {
                series: "",
                instance: "",
                period: {
                    realtime: false,
                    startAt: "",
                    endAt: "",
                    gapSecond: 1,
                    gap: "",
                    gapUnit: 1,
                }
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
                form: {
                    series: {
                        label: "Attribute",
                        placeholder: "Please select an series.",
                        error: {
                            empty: "Attribute cannot be empty!"
                        }
                    },
                    instance: {
                        label: "Instance",
                        placeholder: "Please select an instance.",
                        error: {
                            empty: "Please select an instance!"
                        }
                    },
                    period: {
                        label: "Period",
                        placeholder: "Please specify query period.",
                        error: {
                            empty: "Cannot be empty!",
                            invalidDate: "End time should be later than start time!",
                            invalidGap: "Relative gap should be a valid number greater than zero!",
                        },
                        static: "Static",
                        realtime: "Realtime",
                        gap: {
                            placeholder: "Please set a time gap."
                        }
                    }
                }
            },
            cn: {
                form: {
                    series: {
                        label: "点位",
                        placeholder: "请选择一个点位",
                        error: {
                            empty: "不可为空！"
                        }
                    },
                    instance: {
                        label: "对象",
                        placeholder: "请选择一个对象",
                        error: {
                            empty: "不可为空！"
                        }
                    },
                    period: {
                        label: "时间范围",
                        placeholder: "请设置时间范围！",
                        error: {
                            empty: "不可为空！",
                            invalidDate: "结束时间应该晚于起始时间！",
                            invalidGap: "相对间隔应为合法的正数！",
                        },
                        static: "静态",
                        realtime: "实时",
                        gap: {
                            placeholder: "请设置相对时间间隔。"
                        }
                    }
                }
            }
        }
    },
    methods: {
        save () {
            this.$refs.form.validate(valid => {
                if (valid) {
                    if (this.nodeConfig.period.realtime) {
                        this.nodeConfig.period.gapSecond = this.nodeConfig.period.gapUnit * parseFloat(this.nodeConfig.period.gap)
                    }
                    this.close()
                }
            })
        }
    }
}
</script>
