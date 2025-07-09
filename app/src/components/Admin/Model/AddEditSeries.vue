<template>
    <el-dialog width="738px" v-auth="{ resources: 'Model', action: 'Admin' }" :title="title"
               :visible.sync="dialogVisibility" @close="close">
        <el-form class="custom-form" label-position="top" :rules="rules" :model="formData" ref="groupForm">
            <el-form-item :label="$t('form.field.name.label')" prop="name">
                <el-input :placeholder="$t('form.field.name.placeholder')" v-model="formData.name"
                          autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('form.field.dataType.label')" prop="dataType">
                <el-select default-first-option class="full-w" v-model="formData.dataType" @change="clearConstraint">
                    <el-option v-for="type in dataTypes" :key="type" :value="type"
                               :label="$t(`dict.dataType.${type}`)"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="formData.dataType === 'Enum'" :label="$t('form.field.candidates.label')"
                          prop="candidate">
                <el-select :placeholder="$t('form.field.candidates.placeholder')" class="full-w" multiple clearable
                           filterable allow-create v-model="formData.candidate">
                    <el-option v-for="candidate in formData.candidate" :key="candidate" :value="candidate"
                               :label="candidate"></el-option>
                </el-select>
            </el-form-item>
            <el-row :gutter="10" v-if="['String', 'Text'].includes(formData.dataType)">
                <el-col :span="12">
                    <el-form-item :label="$t('form.field.minLength.label')" prop="min">
                        <el-input :placeholder="$t('form.field.minLength.placeholder')" v-model="formData.min"
                                  type="number" min="0" step="1"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('form.field.maxLength.label')" prop="max">
                        <el-input :placeholder="$t('form.field.maxLength.placeholder')" v-model="formData.max"
                                  type="number" min="0" step="1"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10" v-if="['Integer', 'Decimal'].includes(formData.dataType)">
                <el-col :span="8">
                    <el-form-item :label="$t('form.field.minimum.label')" prop="min">
                        <el-input :placeholder="$t('form.field.minimum.placeholder')"
                                  v-if="formData.dataType === 'Integer'" v-model="formData.min" type="number" min="0"
                                  step="1">
                            <template slot="suffix">{{ formData.unit }}</template>
                        </el-input>
                        <el-input :placeholder="$t('form.field.minimum.placeholder')" v-else v-model="formData.min"
                                  type="number" min="0">
                            <template slot="suffix">{{ formData.unit }}</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('form.field.maximum.label')" prop="max">
                        <el-input :placeholder="$t('form.field.maximum.placeholder')"
                                  v-if="formData.dataType === 'Integer'" v-model="formData.max" type="number" min="0"
                                  step="1">
                            <template slot="suffix">{{ formData.unit }}</template>
                        </el-input>
                        <el-input :placeholder="$t('form.field.maximum.placeholder')" v-else v-model="formData.max"
                                  type="number" min="0">
                            <template slot="suffix">{{ formData.unit }}</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="formData.dataType === 'Integer' ? 24 : 12">
                    <el-form-item :label="$t('form.field.unit.label')" prop="unit">
                        <el-select :placeholder="$t('form.field.unit.placeholder')" allow-create filterable clearable
                                   class="full-w" v-model="formData.unit">
                            <el-option v-for="unit in units" :key="unit.id" :value="unit.name"
                                       :label="unit.name"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="formData.dataType === 'Decimal'">
                    <el-form-item :label="$t('form.field.precision.label')" prop="precision">
                        <el-input :placeholder="$t('form.field.precision.placeholder')" v-model="formData.precision"
                                  type="number" min="0" step="1"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item :label="$t('form.field.isVirtual.label')" prop="isVirtual">
                <el-switch v-model="formData.isVirtual"></el-switch>
            </el-form-item>
            <el-form-item :label="$t('form.field.calculationMethod.label')" prop="calculationMethod" v-if="formData.isVirtual">
                <ExpressionEditor v-model="formData.calculationMethod"></ExpressionEditor>
            </el-form-item>
            <el-form-item :label="$t('form.field.label.label')" prop="labels">
                <el-select :placeholder="$t('form.field.label.placeholder')" class="full-w" multiple clearable
                           filterable allow-create v-model="formData.labels" type="textarea" rows="4"
                           autocomplete="off">
                    <el-option v-for="label in labels" :key="label.id" :value="label.name"
                               :label="label.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('form.field.description.label')" prop="description">
                <el-input :placeholder="$t('form.field.description.placeholder')" v-model="formData.description"
                          type="textarea" rows="4" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">{{ $t("action.cancel") }}</el-button>
            <el-button type="primary" @click="submit">{{ $t("action.confirm") }}</el-button>
        </div>
    </el-dialog>
</template>

<script>

import {getLabelList, getUnitList} from "../../../assets/js/api/unit-label";
import {createTimeSeries, getSeriesDomain, updateTimeSeries} from "../../../assets/js/api/model-series";
import ExpressionEditor from "@/components/Admin/Model/ExpressionEditor.vue";

export default {
    name: "AddEditSeries",
    components: {ExpressionEditor},
    props: {
        dialogId: String,
        dialogVisibility: Boolean,
        modelId: String,
        series: {
            type: Object,
            default: () => {
            }
        }
    },
    computed: {
        title() {
            return !this.series.id ? this.$t("form.title.addSeries") : this.$t("form.title.editSeries")
        },
        rules() {
            let that = this
            let result = {
                name: [
                    {required: true, trigger: ['change', 'blur'], message: this.$t("form.field.name.error.empty")}
                ],
                dataType: [
                    {required: true, trigger: ['change', 'blur'], message: this.$t("form.field.dataType.error.empty")}
                ],
                precision: [
                    {
                        validator(rule, value, callback, source, options) {
                            if (!value) {
                                return callback()
                            }
                            value = parseFloat(value)
                            if (value !== Math.floor(value)) {
                                return callback(new Error(this.$t("form.field.precision.error.integer")))
                            } else if (value < 0) {
                                return callback(new Error(this.$t("form.field.precision.error.negative")))
                            }
                            return callback()
                        },
                        trigger: ['change', 'blur']
                    }
                ],
                min: [
                    {
                        validator(rule, value, callback, source, options) {
                            if (!value) {
                                return callback()
                            }
                            let min = parseFloat(value)
                            let max = parseFloat(that.formData.max)
                            if (isNaN(min)) {
                                return callback(new Error(this.$t("form.field.minimum.error.invalid")))
                            } else if (that.formData.dataType === 'Integer' && min !== Math.floor(min)) {
                                return callback(new Error(this.$t("form.field.minimum.error.integer")))
                            } else if (!isNaN(max) && min > max) {
                                return callback(new Error(this.$t("form.field.minimum.error.outOfRange")))
                            }
                            return callback()
                        },
                        trigger: ['change', 'blur']
                    }
                ],
                max: [
                    {
                        validator(rule, value, callback, source, options) {
                            if (!value) {
                                return callback()
                            }
                            let min = parseFloat(that.formData.min)
                            let max = parseFloat(value)
                            if (isNaN(max)) {
                                return callback(new Error(this.$t("form.field.maximum.error.invalid")))
                            } else if (that.formData.dataType === 'Integer' && max !== Math.floor(max)) {
                                return callback(new Error(this.$t("form.field.maximum.error.integer")))
                            } else if (!isNaN(min) && min > max) {
                                return callback(new Error(this.$t("form.field.maximum.error.outOfRange")))
                            }
                            return callback()
                        },
                        trigger: ['change', 'blur']
                    }
                ]
            }
            if (this.formData.dataType === 'Enum') {
                result.candidate = [
                    {required: true, trigger: ['change', 'blur'], message: this.$t("form.field.candidates.error.empty")}
                ]
            }
            return result
        }
    },
    watch: {
        series: {
            handler(newValue) {
                this.flushData()
            },
            deep: true
        },
        dialogVisibility(newValue) {
            if (newValue) {
                this.getUnits()
                this.getLabels()
            }
        }
    },
    data() {
        return {
            formLabelWidth: "140px",
            formData: {},
            dataTypes: ['String', 'Text', 'Enum', 'Integer', 'Decimal', 'Date', 'Time', 'DateTime', 'Boolean'],
            units: [],
            labels: []
        }
    },
    methods: {
        close() {
            this.$emit('action-finished', this.dialogId, false)
        },
        clearConstraint() {
            this.formData.candidate = []
        },
        flushData() {
            this.formData = Object.assign({
                name: '',
                dataType: '',
                labels: [],
                min: '',
                max: '',
                precision: '',
                isVirtual: false,
                calculationMethod: "",
                unit: '',
                candidate: [],
                description: '',
                modelId: this.modelId
            }, this.series, {
                labels: this.series.labels ? this.series.labels.map(item => item.name) : [],
                unit: this.series.unit ? this.series.unit.name : '',
            })
        },
        getUnits() {
            getUnitList().then(result => {
                this.units = result.data
            })
        },
        getLabels() {
            getLabelList().then(result => {
                this.labels = result.data
            })
        },
        submit() {
            this.$refs.groupForm.validate(valid => {
                if (valid) {
                    if (this.series.id) {
                        updateTimeSeries(this.modelId, this.series.id, this.formData).then(response => {
                            this.$message({
                                message: this.$t("message.series.updated"),
                                type: 'success',
                                showClose: true,
                                duration: 2000
                            })
                            this.$emit('action-finished', this.dialogId, true)
                        })
                    } else {
                        createTimeSeries(this.modelId, this.formData).then(response => {
                            this.$message({
                                message: this.$t("message.series.created"),
                                type: 'success',
                                showClose: true,
                                duration: 2000
                            })
                            this.$emit('action-finished', this.dialogId, true)
                        })
                    }
                }
            })
        }
    },
    created() {
        this.flushData()
        this.getUnits()
        this.getLabels()
    }
}
</script>
<style lang="scss" scoped>
.noc-vgis-binary-selector {
  border: 1px solid #4FACFF;
  box-sizing: border-box;
  border-radius: 4px;
  text-align: center;
}

.custom-form-item :deep(.el-form-item__content) {
  border: 1px solid #4FACFF;
  border-radius: 4px;
}
</style>
