<template>
    <el-dialog top="5%" width="60%" v-auth="{ resources: 'Model', action: 'Admin' }" :title="$t('form.title.addPIDRule')"
               :visible.sync="dialogVisibility" :before-close="close">
        <div class="flex">
            <div class="type-list">
                <div :class="['type-item', { selected: formData.type === type.name }]" v-for="type in types"
                     @click="formData.type = type.name">
                    <div :class="[type.icon, 'icon']"></div>
                    <div class="name">{{ type.label }}</div>
                </div>
            </div>
            <div class="configuration-panel">
                <div v-if="!formData.type" class="full-h flex justify-content-center align-items-center text-info text-regular">
                    {{ $t("message.pid.emptyRuleType") }}
                </div>
                <component v-else ref="form" :is="selectedType.form" :pid="pid"></component>
                <div class="text-center" v-if="formData.type">
                    <el-button type="primary" @click="submit">{{ $t("action.submit") }}</el-button>
                    <el-button type="default" @click="close">{{ $t("action.cancel") }}</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import LinkRuleForm from "@/components/Admin/PID/LinkRuleForm.vue";
import DataRuleForm from "@/components/Admin/PID/DataRuleForm.vue";
import ControlRuleForm from "@/components/Admin/PID/ControlRuleForm.vue";
import EffectRuleForm from "@/components/Admin/PID/EffectRuleForm.vue";
import FormRuleForm from "@/components/Admin/PID/FormRuleForm.vue";

export default {
    name: "AddPIDRule",
    props: {
        dialogId: String,
        dialogVisibility: Boolean,
        domInstance: {
            type: Object
        },
        pid: {
            type: Object
        }
    },
    components: {
        LinkRuleForm,
        DataRuleForm,
        EffectRuleForm,
        FormRuleForm,
        ControlRuleForm
    },
    computed: {
        selectedType () {
            return this.types.find(item => item.name === this.formData.type)
        },
        ruleName () {
            if (!this.selectedType) {
                return ""
            }
            let name = this.selectedType.label
            if (this.selectedType.name === "link") {
                if (this.formData.configuration) {
                    name += `：${this.formData.configuration.extra.targetPID.name}`
                }
            }
            return name
        }
    },
    data() {
        return {
            types: [{
                icon: "iconfont icon-add",
                name: "link",
                label: this.$t("dict.pidRuleType.link"),
                selected: false,
                form: "LinkRuleForm"
            }, {
                icon: "iconfont icon-add",
                name: "data",
                label: this.$t("dict.pidRuleType.data"),
                selected: false,
                form: "DataRuleForm"
            }, {
                icon: "iconfont icon-add",
                name: "effect",
                label: this.$t("dict.pidRuleType.effect"),
                selected: false,
                form: "EffectRuleForm"
            }, {
                icon: "iconfont icon-add",
                name: "form",
                label: this.$t("dict.pidRuleType.form"),
                selected: false,
                form: "FormRuleForm"
            }, {
                icon: "iconfont icon-add",
                name: "control",
                label: this.$t("dict.pidRuleType.control"),
                selected: false,
                form: "ControlRuleForm"
            }],
            formData: {
                type: "",
                configuration: ""
            }
        }
    },
    methods: {
        close() {
            this.$emit('action-finished', false, this.dialogId)
        },
        submit () {
            this.$refs.form.validate((valid, data) => {
                if (valid) {
                    this.formData.configuration = data
                    this.formData.name = this.ruleName
                    this.$emit('action-finished', true, this.dialogId, this.formData)
                }
            })
        }
    },
    created() {
        this.formData.xPath = this.domInstance.id
    }
}
</script>

<style lang="scss" scoped>
.type-list {
  border-right: 1px solid silver;
  padding-right: 10px;
  margin-right: 10px;
  margin-bottom: 20px;

  .type-item.selected {
    background: rgba(64, 169, 255, 0.25);
  }

    .type-item:hover {
        background: rgba(0, 0, 0, 0.1);
    }

  .type-item {
      cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;
      padding: 10px;
      border-radius: 3px;

    .icon {
      font-size: 36px;
    }

    .name {
      font-size: 16px;
    }
  }
}

.configuration-panel {
  flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 20px;
}
</style>
