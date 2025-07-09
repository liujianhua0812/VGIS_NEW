<template>
    <div class="flex align-items-center flex-column">
        <h3 class="text-bold" :style="{ color }">{{label}}</h3>
        <div class="test-result" v-if="testResult && testing">
            <div class="text-danger" v-if="testResult.error">{{testResult.error}}</div>
            <div v-else>
                <div v-for="(threshold, index) in nodeConfig.thresholds" class="text-center">
                    <div :class="['text-bold', { 'text-primary': testResult.result.process[index].result }]">{{threshold.custom ? threshold.field : threshold._field.name}}</div>
                    {{testResult.result.process[index].value}} {{threshold._field.unit ? threshold._field.unit.name : ""}}
                </div>
            </div>
        </div>
        <el-button v-show="!testing" size="mini" type="primary" @click="editConfig">{{$t("action.configure")}}</el-button>
        <div class="output-indicator" v-if="!testing || (testing && !testResult.error)">
            <div :class="['m-b-5', testing && testResult && testResult.result.overall ? 'text-primary' : 'text-info']">{{$t('dict.bool.true')}}</div>
            <div :class="[testing && testResult && !testResult.result.overall ? 'text-primary' : 'text-info']">{{$t('dict.bool.false')}}</div>
        </div>
        <el-dialog width="680px" append-to-body :title="$t('form.title.editRule')" :visible.sync="dVisibility" @close="close">
            <el-form label-position="top">
                <el-row :gutter="5" v-for="(threshold, index) in nodeConfig.thresholds">
                    <el-col :span="2">
                        <el-form-item size="small" :label="$t('form.custom.label')" v-if="index === 0">
                            <el-switch v-model="threshold.custom"></el-switch>
                        </el-form-item>
                        <el-form-item size="small" v-else>
                            <el-switch v-model="threshold.custom"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item size="small" :label="$t('form.field.label')" v-if="index === 0">
                            <el-cascader v-if="!threshold.custom" :show-all-levels="false" :options="cascaderData" v-model="threshold.field" :placeholder="$t('form.field.placeholder')" @change="selectField"></el-cascader>
                            <el-input v-else v-model="threshold.field" :placeholder="$t('form.field.placeholder')"></el-input>
                        </el-form-item>
                        <el-form-item size="small" v-else>
                            <el-cascader v-if="!threshold.custom" :show-all-levels="false" :options="cascaderData" v-model="threshold.field" :placeholder="$t('form.field.placeholder')" @change="selectField"></el-cascader>
                            <el-input v-else v-model="threshold.field" :placeholder="$t('form.field.placeholder')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item size="small" :label="$t('form.min.label')" v-if="index === 0">
                            <el-input v-model="threshold.min">
                                <template slot="suffix">{{threshold._field.unit ? threshold._field.unit.name : ''}}</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item size="small" v-else>
                            <el-input v-model="threshold.min">
                                <template slot="suffix">{{threshold._field.unit ? threshold._field.unit.name : ''}}</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item size="small" :label="$t('form.max.label')" v-if="index === 0">
                            <el-input v-model="threshold.max">
                                <template slot="suffix">{{threshold._field.unit ? threshold._field.unit.name : ''}}</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item size="small" v-else>
                            <el-input v-model="threshold.max">
                                <template slot="suffix">{{threshold._field.unit ? threshold._field.unit.name : ''}}</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item size="small" :label="$t('form.relation.label')" v-if="index === 0">
                            <el-select disabled v-model="threshold.relation">
                                <el-option value="And" label="And">And</el-option>
                                <el-option value="Or" label="Or">Or</el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item size="small" v-else>
                            <el-select v-model="threshold.relation">
                                <el-option value="And" label="And">And</el-option>
                                <el-option value="Or" label="Or">Or</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-button size="small" class="full-w" type="primary" @click="addThreshold">{{$t('action.add')}}</el-button>
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
    name: "ThresholdTemplate",
    extends: WidgetTemplate,
    data() {
        return {
            nodeConfig: {
                thresholds: [{
                    custom: false,
                    field: "",
                    min: '',
                    max: '',
                    relation: "",
                    _field: {}
                }]
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
                    field: {
                        label: "Field",
                        placeholder: "Please specify a field."
                    },
                    min: {
                        label: "Minimum",
                    },
                    max: {
                        label: "Maximum"
                    },
                    relation: {
                        label: "Relation"
                    }
                }
            },
            cn: {
                form: {
                    custom: {
                        label: "自定义",
                    },
                    field: {
                        label: "项目",
                        placeholder: "请选择判断项目"
                    },
                    min: {
                        label: "最小值",
                    },
                    max: {
                        label: "最大值"
                    },
                    relation: {
                        label: "与其他阈值的关系"
                    }
                }
            }
        }
    },
    methods: {
        addThreshold () {
            this.nodeConfig.thresholds = this.nodeConfig.thresholds.concat([{
                custom: false,
                field: "",
                min: '',
                max: '',
                relation: "Or",
                _field: {}
            }])
        },
        selectField () {
            for(let i = 0; i < this.nodeConfig.thresholds.length; i++) {
                let threshold = this.nodeConfig.thresholds[i]
                let field = threshold.field
                if (field[0] === "attr_") {
                    threshold._field = this.model.static_attributes.find(item => item.id === field[1])
                }
                else if (field[0] === "series_") {
                    threshold._field = this.model.time_series.find(item => item.id === field[1])
                }
                else {
                    threshold._field = {}
                }
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
        position: absolute;
        right: 15px;
        top: 0;
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }
</style>
