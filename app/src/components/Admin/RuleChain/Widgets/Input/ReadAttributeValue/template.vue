<template>
    <div class="flex align-items-center flex-column">
        <h3 class="text-bold" :style="{ color }">{{label}}</h3>
        <el-button size="mini" type="primary" @click="editConfig">{{$t("action.configure")}}</el-button>
        <el-dialog width="800px" append-to-body :title="$t('form.title.editRule')" :visible.sync="dVisibility" @close="close">
            <el-form ref="form" label-position="top" :model="nodeConfig" :rules="rules">
                <el-form-item size="small" :label="$t('form.attribute.label')" prop="attribute">
                    <AttributeSelector class="full-w" v-model="nodeConfig.attribute"></AttributeSelector>
                </el-form-item>
                <el-form-item size="small" :label="$t('form.instance.label')" prop="instance">
                    <DeviceSelector :multiple="false" :model-id="nodeConfig.attribute[0]" class="full-w" v-model="nodeConfig.instance"></DeviceSelector>
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
import AttributeSelector from "@/components/Admin/Model/AttributeSelector.vue";
import DeviceSelector from "@/components/Admin/Model/DeviceSelector.vue";

export default {
    name: "ReadAttributeValueTemplate",
    components: {DeviceSelector, AttributeSelector},
    extends: WidgetTemplate,
    data() {
        return {
            rules: {
                attribute: [{ required: true, message: this.$t("form.attribute.error.empty"), trigger: ["change", "blur"] }],
                instance: [{ required: true, message: this.$t("form.instance.error.empty"), trigger: ["change", "blur"] }],
            },
            nodeConfig: {
                attribute: "",
                instance: ""
            }
        }
    },
    i18n: {
        messages: {
            en: {
                form: {
                    attribute: {
                        label: "Attribute",
                        placeholder: "Please select an attribute.",
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
                }
            },
            cn: {
                form: {
                    attribute: {
                        label: "属性",
                        placeholder: "请选择一个属性",
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
                }
            }
        }
    },
    methods: {
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
