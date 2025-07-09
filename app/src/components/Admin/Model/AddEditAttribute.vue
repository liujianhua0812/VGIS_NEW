<template>
  <el-dialog width="438px" v-auth="{ resources: 'Model', action: 'Admin' }" :title="title"
             :visible.sync="dialogVisibility" @close="close">
    <el-form class="custom-form" label-position="top" :rules="rules" :model="formData" ref="groupForm">
      <el-form-item :label="$t('form.field.name.label')" prop="name">
        <el-input :placeholder="$t('form.field.name.placeholder')" v-model="formData.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('form.field.dataType.label')" prop="dataType">
        <el-select default-first-option class="full-w" v-model="formData.dataType" @change="clearConstraint">
          <el-option v-for="type in dataTypes" :key="type" :value="type" :label="$t(`dict.dataType.${type}`)"></el-option>
        </el-select>
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item class="custom-form-item" :label="$t('form.field.unique.label')" prop="unique">
            <div class="noc-vgis-binary-selector">
              <el-radio-group v-model="formData.unique">
                <el-radio :label="true">{{$t("dict.bool.true")}}</el-radio>
                <el-radio :label="false">{{$t("dict.bool.false")}}</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="custom-form-item" :label="$t('form.field.required.label')" prop="required">
            <div class="noc-vgis-binary-selector">
              <el-radio-group v-model="formData.required">
                <el-radio :label="true">{{$t("dict.bool.true")}}</el-radio>
                <el-radio :label="false">{{$t("dict.bool.false")}}</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="formData.dataType === 'Enum'" :label="$t('form.field.candidates.label')" prop="candidate">
        <el-select :placeholder="$t('form.field.candidates.placeholder')" class="full-w" multiple clearable filterable allow-create v-model="formData.candidate">
          <el-option v-for="candidate in formData.candidate" :key="candidate" :value="candidate" :label="candidate"></el-option>
        </el-select>
      </el-form-item>
      <el-row :gutter="10" v-if="['String', 'Text'].includes(formData.dataType)">
        <el-col :span="12">
          <el-form-item :label="$t('form.field.minLength.label')" prop="min">
            <el-input :placeholder="$t('form.field.minLength.placeholder')" v-model="formData.min" type="number" min="0" step="1"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('form.field.maxLength.label')" prop="max">
            <el-input :placeholder="$t('form.field.maxLength.placeholder')" v-model="formData.max" type="number" min="0" step="1"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="['Integer', 'Decimal'].includes(formData.dataType)">
        <el-col :span="12">
          <el-form-item :label="$t('form.field.minimum.label')" prop="min">
            <el-input :placeholder="$t('form.field.minimum.placeholder')" v-if="formData.dataType === 'Integer'" v-model="formData.min" type="number" min="0" step="1">
              <template slot="suffix">{{ formData.unit }}</template>
            </el-input>
            <el-input :placeholder="$t('form.field.minimum.placeholder')" v-else v-model="formData.min" type="number" min="0">
              <template slot="suffix">{{ formData.unit }}</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('form.field.maximum.label')" prop="max">
            <el-input :placeholder="$t('form.field.maximum.placeholder')" v-if="formData.dataType === 'Integer'" v-model="formData.max" type="number" min="0" step="1">
              <template slot="suffix">{{ formData.unit }}</template>
            </el-input>
            <el-input :placeholder="$t('form.field.maximum.placeholder')" v-else v-model="formData.max" type="number" min="0">
              <template slot="suffix">{{ formData.unit }}</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="formData.dataType === 'Integer' ? 24 : 12">
          <el-form-item :label="$t('form.field.unit.label')" prop="unit">
            <el-select :placeholder="$t('form.field.unit.placeholder')" allow-create filterable clearable class="full-w" v-model="formData.unit">
              <el-option v-for="unit in units" :key="unit.id" :value="unit.name" :label="unit.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.dataType === 'Decimal'">
          <el-form-item :label="$t('form.field.precision.label')" prop="precision">
            <el-input :placeholder="$t('form.field.precision.placeholder')" v-model="formData.precision" type="number" min="0" step="1"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="formData.dataType" :label="$t('form.field.default.label')" prop="defaultValue">
        <el-select :placeholder="$t('form.field.default.placeholder')" v-if="formData.dataType === 'Enum'" class="full-w" clearable filterable v-model="formData.defaultValue">
          <el-option v-for="value in formData.candidate" :key="value" :value="value" :label="value"></el-option>
        </el-select>
        <el-input :placeholder="$t('form.field.default.placeholder')" v-else-if="formData.dataType === 'String'" :maxlength="formData.max" :minlength="formData.min" v-model="formData.defaultValue"></el-input>
        <el-input :placeholder="$t('form.field.default.placeholder')" v-else-if="formData.dataType === 'Text'" type="textarea" rows="4" :maxlength="formData.max" :minlength="formData.min" v-model="formData.defaultValue"></el-input>
        <el-input :placeholder="$t('form.field.default.placeholder')" v-else-if="formData.dataType === 'Integer'" type="number" :min="formData.min" :max="formData.max" :step="1" v-model="formData.defaultValue">
          <template slot="suffix">{{ formData.unit }}</template>
        </el-input>
        <el-input :placeholder="$t('form.field.default.placeholder')" v-else-if="formData.dataType === 'Decimal'" type="number" :min="formData.min" :max="formData.max" v-model="formData.defaultValue">
          <template slot="suffix">{{ formData.unit }}</template>
        </el-input>
        <el-select :placeholder="$t('form.field.default.placeholder')" v-else-if="formData.dataType === 'Boolean'" class="full-w" clearable v-model="formData.defaultValue">
          <el-option :value="true" label="Yes"></el-option>
          <el-option :value="false" label="No"></el-option>
        </el-select>
        <div v-else class="flex align-items-center justify-content-between">
          <div style="flex-grow: 1;">
            <el-date-picker :placeholder="$t('form.field.default.placeholder')" class="full-w" type="date" v-if="formData.dataType === 'Date'" v-model="formData.defaultValue" clearable></el-date-picker>
            <el-time-picker :placeholder="$t('form.field.default.placeholder')" class="full-w" v-if="formData.dataType === 'Time'" v-model="formData.defaultValue" clearable></el-time-picker>
            <el-date-picker :placeholder="$t('form.field.default.placeholder')" class="full-w" type="datetime" v-if="formData.dataType === 'DateTime'" v-model="formData.defaultValue" clearable></el-date-picker>
          </div>
          <div class="m-l-20">
            <el-checkbox :label="$t('form.field.realtime.label')"></el-checkbox>
          </div>
        </div>
      </el-form-item>
      <el-form-item :label="$t('form.field.label.label')" prop="labels">
        <el-select :placeholder="$t('form.field.label.placeholder')" class="full-w" multiple clearable filterable allow-create v-model="formData.labels" type="textarea" rows="4" autocomplete="off">
          <el-option v-for="label in labels" :key="label.id" :value="label.name" :label="label.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('form.field.description.label')" prop="description">
        <el-input :placeholder="$t('form.field.description.placeholder')" v-model="formData.description" type="textarea" rows="4" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">{{$t("action.cancel")}}</el-button>
      <el-button type="primary" @click="submit">{{$t("action.confirm")}}</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import { getLabelList, getUnitList } from "../../../assets/js/api/unit-label";
  import { createStaticAttribute, updateStaticAttribute } from "../../../assets/js/api/model-attribute";

  export default {
    name: "AddEditAttribute",
    props: {
      dialogId: String,
      dialogVisibility: Boolean,
      modelId: String,
      attribute: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      title() {
        return !this.attribute.id ? this.$t("form.title.addAttribute") : this.$t("form.title.editAttribute")
      },
      rules () {
        let that = this
        let result = {
          name: [
            { required: true, trigger: ['change', 'blur'], message: this.$t("form.field.name.error.empty") }
          ],
          dataType: [
            { required: true, trigger: ['change', 'blur'], message: this.$t("form.field.dataType.error.empty") }
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
                }
                else if (value < 0) {
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
                }
                else if (that.formData.dataType === 'Integer' && min !== Math.floor(min)) {
                  return callback(new Error(this.$t("form.field.minimum.error.integer")))
                }
                else if (!isNaN(max) && min > max) {
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
                }
                else if (that.formData.dataType === 'Integer' && max !== Math.floor(max)) {
                  return callback(new Error(this.$t("form.field.maximum.error.integer")))
                }
                else if (!isNaN(min) && min > max) {
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
            { required: true, trigger: ['change', 'blur'], message: this.$t("form.field.candidates.error.empty") }
          ]
        }
        return result
      }
    },
    watch: {
      group: {
        handler (newValue) {
          this.flushData()
        },
        deep: true
      },
      dialogVisibility (newValue) {
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
      flushData () {
        this.formData = Object.assign({
          name: '',
          dataType: '',
          required: false,
          unique: false,
          useRealTime: false,
          labels: [],
          defaultValue: '',
          min: '',
          max: '',
          precision: '',
          unit: '',
          candidate: [],
          description: '',
          modelId: this.modelId
        }, this.attribute, {
          unit: this.attribute.unit ? this.attribute.unit.name : '',
          labels: this.attribute.labels ? this.attribute.labels.map(item => item.name) : []
        })
      },
      clearConstraint () {
        this.formData.defaultValue = ''
        this.formData.candidate = []
      },
      getUnits () {
        getUnitList().then(result => {
          this.units = result.data
        })
      },
      getLabels () {
        getLabelList().then(result => {
          this.labels = result.data
        })
      },
      submit() {
        this.$refs.groupForm.validate(valid => {
          if (valid) {
            if (this.attribute.id) {
              updateStaticAttribute(this.modelId, this.attribute.id, this.formData).then(response => {
                this.$message({
                  message: this.$t("message.attribute.updated"),
                  type: 'success',
                  showClose: true,
                  duration: 2000
                })
                this.$emit('action-finished', this.dialogId, true)
              })
            }
            else {
              createStaticAttribute(this.modelId, this.formData).then(response => {
                this.$message({
                  message: this.$t("message.attribute.created"),
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
