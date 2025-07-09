<template>
    <div class="flex align-items-center flex-column">
        <h3 class="text-bold" :style="{ color }">{{label}}</h3>
        <div class="test-result text-center" v-if="testing">
            <div>
                <div class="text-bold">{{field}}</div>
                <div :class="[ testing && testResult && testResult.result === index ? 'text-primary text-bold' : 'text-info']" v-for="(value, index) in nodeConfig.values">{{value}}</div>
            </div>
            <div class="text-danger" v-if="testResult && testResult.error">{{testResult.error}}</div>
        </div>
        <div class="output-indicator text-center" v-if="!testing">
            <div class="text-bold">{{field}}</div>
            <div class="text-info" v-for="(value, index) in nodeConfig.values">{{value}}</div>
        </div>
        <el-button v-show="!testing" class="m-t-20" size="mini" type="primary" @click="editConfig">{{$t("action.configure")}}</el-button>
        <el-dialog width="438px" append-to-body :title="$t('form.title.editRule')" :visible.sync="dVisibility" @close="close">
            <el-form label-position="top">
                <el-form-item class="m-b-0" size="small" :label="$t('form.custom.label')">
                    <el-switch v-model="nodeConfig.custom"></el-switch>
                </el-form-item>
                <el-form-item class="m-b-0" size="small" :label="$t('form.field.label')">
                    <el-cascader v-if="!nodeConfig.custom" :show-all-levels="false" :options="cascaderData" v-model="nodeConfig.field" :placeholder="$t('form.field.placeholder')" @change="selectField"></el-cascader>
                    <el-input v-else v-model="nodeConfig.field" :placeholder="$t('form.field.placeholder')"></el-input>
                </el-form-item>
                <el-form-item class="m-b-0" size="small" :label="$t('form.type.label')" v-if="nodeConfig.custom">
                    <el-select default-first-option class="full-w" v-model="nodeConfig.fieldType" @change="updateValues">
                        <el-option v-for="type in dataTypes" :key="type" :value="type" :label="$t(`dict.dataType.${type}`)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="m-b-0" size="small" :label="$t('form.values.label')">
                    <div class="flex align-items-center justify-content-between m-b-5" v-for="(mValue, index) in nodeConfig.values">
                        <el-input-number style="flex: 1;" v-model="nodeConfig.values[index]" v-if="['Integer', 'Decimal'].includes(fieldType)"></el-input-number>
                        <el-date-picker style="flex: 1;" v-model="nodeConfig.values[index]" type="date" v-else-if="fieldType === 'Date'"></el-date-picker>
                        <el-time-picker style="flex: 1;" v-model="nodeConfig.values[index]" v-else-if="fieldType === 'Time'"></el-time-picker>
                        <el-date-picker style="flex: 1;" v-model="nodeConfig.values[index]" type="datetime" v-else-if="fieldType === 'DateTime'"></el-date-picker>
                        <el-select v-else-if="fieldType === 'Boolean'" class="full-w" clearable v-model="nodeConfig.values[index]">
                            <el-option :value="true" label="Yes" v-if="!nodeConfig.values.find(value => value === true)"></el-option>
                            <el-option :value="false" label="No" v-if="!nodeConfig.values.find(value => value === false)"></el-option>
                        </el-select>
                        <el-select v-else-if="fieldType === 'Enum' && !nodeConfig.custom" class="full-w" clearable v-model="nodeConfig.values[index]">
                            <el-option v-for="value in nodeConfig._field.candidate" :value="value" :label="value" :key="value" v-if="!nodeConfig.values.find(val => val === value)"></el-option>
                        </el-select>
                        <el-input v-model="nodeConfig.values[index]" v-else></el-input>
                        <el-button class="el-icon-delete m-l-5" @click="removeValue(index)"></el-button>
                    </div>
                </el-form-item>
            </el-form>
            <el-button size="small" class="full-w" type="primary" @click="addValue" v-if="canAddValue">{{$t('action.add')}}</el-button>
            <div class="text-center m-t-10">
                <el-button type="primary" @click="close">{{$t('action.save')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import WidgetTemplate from "../../template.vue"
import {getModelDetail} from "@/assets/js/api/model";

export default {
    name: "SwitchTemplate",
    extends: WidgetTemplate,
    watch: {
        nodeConfig: {
            handler () {
                const fullId = this.$el.parentElement.parentElement.id;
                let id = fullId.slice(5)
                let node = this.editor.getNodeFromId(id)
                let outputCount = Object.keys(node.outputs).length
                if (outputCount > this.nodeConfig.values.length) {
                    for(let i = outputCount; i > this.nodeConfig.values.length; i--) {
                        this.editor.removeNodeOutput(id, `output_${i}`)
                    }
                }
                else {
                    for(let i = 0; i < this.nodeConfig.values.length - outputCount; i++) {
                        this.editor.addNodeOutput(id)
                    }
                }
                this.editor.updateConnectionNodes(fullId);
            },
            deep: true
        }
    },
    computed: {
        field () {
            if (this.nodeConfig.custom) {
                return this.nodeConfig.field
            }
            else {
                return this.nodeConfig._field.name
            }
        },
        fieldType () {
            if (this.nodeConfig.custom) {
                return this.nodeConfig.fieldType
            }
            else {
                return this.nodeConfig._field.dataType
            }
        },
        canAddValue () {
            if (this.fieldType === "Enum" && !this.nodeConfig.custom) {
                return this.nodeConfig.values.length < this.nodeConfig._field.candidate.length
            }
            else if (this.fieldType === "Boolean") {
                return this.nodeConfig.values.length < 2;
            }
            return true
        },
    },
    data() {
        return {
            dVisibility: false,
            dataTypes: ['String', 'Text', 'Enum', 'Integer', 'Decimal', 'Date', 'Time', 'DateTime', 'Boolean'],
            nodeConfig: {
                custom: false,
                field: "",
                fieldType: "",
                _field: {},
                values: [],
            },
            model: {
                static_attributes: [],
                time_series: []
            },
            cascaderData: []
        }
    },
    i18n: {
        messages: {
            en: {
                form: {
                    custom: {
                        label: "Custom"
                    },
                    type: {
                        label: "Field Type"
                    },
                    field: {
                        label: "Field",
                        placeholder: "Please specify a field."
                    },
                    values: {
                        label: "Values",
                    },
                }
            },
            cn: {
                form: {
                    custom: {
                        label: "自定义",
                    },
                    type: {
                        label: "项目类型"
                    },
                    field: {
                        label: "项目",
                        placeholder: "请选择判断项目"
                    },
                    values: {
                        label: "取值",
                    }
                }
            }
        }
    },
    methods: {
        editConfig () {
            this.dVisibility = true
        },
        close () {
            this.dVisibility = false
        },
        addValue () {
            this.nodeConfig.values = this.nodeConfig.values.concat([''])
        },
        removeValue(index) {
            this.nodeConfig.values.splice(index, 1)
        },
        updateValues () {
            this.nodeConfig.values = []
        },
        selectField () {
            let field = this.nodeConfig.field
            if (field[0] === "attr_") {
                this.nodeConfig._field = this.model.static_attributes.find(item => item.id === field[1])
            }
            else if (field[0] === "series_") {
                this.nodeConfig._field = this.model.time_series.find(item => item.id === field[1])
            }
            else {
                this.nodeConfig._field = {}
            }
        },
        getNode () {
            getModelDetail(this.$route.params.modelId).then(result => {
                this.model = result.data
                this.cascaderData = [{
                    value: "attr_",
                    label: this.$t("label.model.attribute"),
                    children: result.data.static_attributes.map(item => ({
                        label: item.name,
                        value: item.id
                    }))
                }, {
                    value: "series_",
                    label: this.$t("label.model.series"),
                    children: result.data.time_series.map(item => ({
                        label: item.name,
                        value: item.id
                    }))
                }]
            })
        }
    },
    created() {
        this.getNode()
    }
}
</script>

<style lang="scss" scoped>
.test-result {
    background: #DDDDDD;
    border-radius: 3px;
}

.output-indicator {
    display: flex;
    justify-content: center;
    flex-direction: column;
}
</style>
