<template>
    <div class="flex align-items-center flex-column">
        <h3 class="text-bold" :style="{ color }">{{label}}</h3>
        <el-button size="mini" type="primary" @click="editConfig">{{$t("action.configure")}}</el-button>
        <el-dialog width="800px" append-to-body :title="$t('form.title.editRule')" :visible.sync="dVisibility" @close="close">
            <el-form ref="form" label-position="top" :model="nodeConfig" :rules="rules">
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item size="small" :label="$t('form.ipAddress.label')" prop="ipAddress">
                            <el-input v-model="nodeConfig.ipAddress" :placeholder="$t('form.ipAddress.placeholder')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item size="small" :label="$t('form.port.label')" prop="port">
                            <el-input v-model="nodeConfig.port" :placeholder="$t('form.port.placeholder')"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item size="small" :label="$t('form.bacnetId.label')" prop="bacnetId">
                    <el-input v-model="nodeConfig.bacnetId" :placeholder="$t('form.bacnetId.placeholder')"></el-input>
                </el-form-item>
                <el-form-item size="small" :label="$t('form.properties.label')" prop="properties">
                    <el-row v-for="(mapping, index) in nodeConfig.properties" :gutter="10">
                        <el-col :span="7">
                            <el-form-item size="small" :label="index === 0 ? $t('form.properties.propertyId.label') : ''">
                                <el-input v-model="mapping.propertyId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item size="small" :label="index === 0 ? $t('form.properties.type.label') : ''">
                                <el-select v-model="mapping.type" class="full-w">
                                    <el-option v-for="type in dataTypes" :key="type.value" :value="type.value" :label="type.name"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item size="small" :label="index === 0 ? $t('form.properties.value.label') : ''">
                                <el-input v-model="mapping.value"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-form-item size="small" :label="index === 0 ? $t('label.basic.action') : ''">
                                <el-button class="full-w el-icon-delete" type="danger" plain @click="removeMapping(index)"></el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-button class="full-w el-icon-plus" type="primary" plain @click="addMapping"></el-button>
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

export default {
    name: "SendBACNetTemplate",
    extends: WidgetTemplate,
    data() {
        let that = this
        return {
            rules: {
                bacnetId: [{ required: true, message: this.$t("form.bacnetId.error.empty"), trigger: ["change", "blur"] }],
                ipAddress: [{ required: true, message: this.$t("form.ipAddress.error.empty"), trigger: ["change", "blur"] }],
                port: [{ required: true, message: this.$t("form.port.error.empty"), trigger: ["change", "blur"] }],
                properties: [
                    { required: true, message: this.$t("form.properties.error.empty"), trigger: ["change", "blur"] },
                    {
                        validator (rule, value, callback) {
                            for(let i = 0; i < value.length; i++) {
                                if (!value.propertyId) {
                                    return callback(new Error(that.$t("form.properties.propertyId.error.empty")))
                                }
                                if (!value.type) {
                                    return callback(new Error(that.$t("form.properties.type.error.empty")))
                                }
                                if (!value.value) {
                                    return callback(new Error(that.$t("form.properties.value.error.empty")))
                                }
                            }
                            return callback()
                        },
                        trigger: ["change", "blur"]
                    }
                ],
            },
            nodeConfig: {
                bacnetId: "",
                ipAddress: "",
                port: "",
                properties: []
            },
            dataTypes: [
                {name: "ACCUMULATOR", value: 1},
                {name: "ANALOG_INPUT", value: 2},
                {name: "ANALOG_OUTPUT", value: 3},
                {name: "ANALOG_VALUE", value: 4},
                {name: "AVERAGING", value: 5},
                {name: "BINARY_INPUT", value: 6},
                {name: "BINARY_OUTPUT", value: 7},
                {name: "BINARY_VALUE", value: 8},
                {name: "CALENDAR", value: 9},
                {name: "COMMAND", value: 10},
                {name: "DEVICE", value: 11},
                {name: "EVENT_ENROLLMENT", value: 12},
                {name: "EVENT_LOG", value: 13},
                {name: "FILE", value: 14},
                {name: "GLOBAL_GROUP", value: 15},
                {name: "GROUP", value: 16},
                {name: "LIFE_SAFETY_POINT", value: 17},
                {name: "LIFE_SAFETY_ZONE", value: 18},
                {name: "LOOP", value: 19},
                {name: "MULTI_STATE_INPUT", value: 20},
                {name: "MULTI_STATE_OUTPUT", value: 21},
                {name: "MULTI_STATE_VALUE", value: 22},
                {name: "NOTIFICATION_CLASS", value: 23},
                {name: "PROGRAM", value: 24},
                {name: "PULSE_CONVERTER", value: 25},
                {name: "SCHEDULE", value: 26},
                {name: "TREND_LOG", value: 27},
                {name: "TREND_LOG_MULTIPLE", value: 28}
            ],
        }
    },
    i18n: {
        messages: {
            en: {
                form: {
                    bacnetId: {
                        label: "BACNet ID",
                        placeholder: "Please specify ID of targeted BACNet device.",
                        error: {
                            empty: "BACNet ID cannot be empty!"
                        }
                    },
                    ipAddress: {
                        label: "IP Address",
                        placeholder: "Please specify IP address of targeted BACNet device.",
                        error: {
                            empty: "IP address cannot be empty!"
                        }
                    },
                    port: {
                        label: "port",
                        placeholder: "Please specify port of targeted BACNet device.",
                        error: {
                            empty: "Port cannot be empty!"
                        }
                    },
                    properties: {
                        label: "Properties",
                        error: {
                            empty: "Properties cannot be empty!"
                        },
                        propertyId: {
                            label: "Property ID",
                            error: {
                                empty: "There are empty property ID!"
                            }
                        },
                        type: {
                            label: "Property Type",
                            error: {
                                empty: "There are empty property type!"
                            }
                        },
                        value: {
                            label: "Value",
                            error: {
                                empty: "There are empty writing value!"
                            }
                        },
                    }
                }
            },
            cn: {
                form: {
                    bacnetId: {
                        label: "BACNet ID",
                        placeholder: "请设置目标设备的ID。",
                        error: {
                            empty: "BACNet ID不可为空！"
                        }
                    },
                    ipAddress: {
                        label: "IP地址",
                        placeholder: "请设置目标设备的IP地址。",
                        error: {
                            empty: "IP地址不可为空！"
                        }
                    },
                    port: {
                        label: "端口号",
                        placeholder: "请设置目标设备的端口号。",
                        error: {
                            empty: "端口号不可为空！"
                        }
                    },
                    properties: {
                        label: "属性列表",
                        error: {
                            empty: "属性列表不可为空！"
                        },
                        propertyId: {
                            label: "属性ID",
                            error: {
                                empty: "存在未填写的属性ID！"
                            }
                        },
                        type: {
                            label: "数据类型",
                            error: {
                                empty: "存在未填写的数据类型！"
                            }
                        },
                        value: {
                            label: "写入值",
                            error: {
                                empty: "存在未填写的写入值！"
                            }
                        },
                    }
                }
            }
        }
    },
    methods: {
        getEmptyProperty () {
            return [{
                propertyId: "",
                type: "",
                value: ""
            }]
        },
        addMapping () {
            this.nodeConfig.properties = this.nodeConfig.properties.concat(this.getEmptyProperty())
        },
        removeMapping (index) {
            this.nodeConfig.properties.splice(index, 1)
        },
        save () {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.close()
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
