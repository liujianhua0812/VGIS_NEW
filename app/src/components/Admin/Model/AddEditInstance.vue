<template>
  <el-dialog width="1000px" v-auth="{ resources: 'Model', action: 'Admin' }" :title="title"
             :visible.sync="dialogVisibility" @close="close" :close-on-press-escape="false">
    <el-form class="custom-form" label-position="top" :model="formData" ref="groupForm" :rules="rules">
      <el-form-item :label="$t('form.instance.id.label')" prop="instanceId">
        <el-input :placeholder="$t('form.instance.id.placeholder')" v-model="formData.instanceId" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('form.instance.name.label')" prop="name">
        <el-input :placeholder="$t('form.instance.name.placeholder')" v-model="formData.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('form.field.label.label')" prop="labels">
        <el-select :placeholder="$t('form.field.label.placeholder')" class="full-w" multiple clearable filterable allow-create v-model="formData.labels" type="textarea" rows="4" autocomplete="off">
          <el-option v-for="label in labels" :key="label.id" :value="label.name" :label="label.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('form.instance.viewPoint.label')" prop="threeDViewPoint">
        <view-point-selector :tag="formData.instanceId" v-model="formData.threeDViewPoint" style="height: 390px;"></view-point-selector>
      </el-form-item>
      <el-form-item :label="$t('model.instance.modelId')">
        <el-input disabled v-model="model.modelId" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('model.instance.modelName')">
        <el-input disabled v-model="model.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item v-if="!formData.id && attr.required" v-for="attr in model.static_attributes" :key="attr.id" :label="attr.name" :prop="`attribute_values.${attr.id.replace(/-/g, '_')}`">
        <el-input :placeholder="$t('form.instance.attribute.placeholder')" v-model="formData.attribute_values[attr.id.replace(/-/g, '_')]" :minlength="attr.min" :maxlength="attr.max" v-if="attr.dataType === 'String'"></el-input>
        <el-input :placeholder="$t('form.instance.attribute.placeholder')" v-model="formData.attribute_values[attr.id.replace(/-/g, '_')]" :minlength="attr.min" :maxlength="attr.max" type="textarea" rows="4" v-if="attr.dataType === 'Text'"></el-input>
        <el-input :placeholder="$t('form.instance.attribute.placeholder')" v-model="formData.attribute_values[attr.id.replace(/-/g, '_')]" :min="attr.min" :max="attr.max" type="number" v-if="attr.dataType === 'Integer'"></el-input>
        <el-input :placeholder="$t('form.instance.attribute.placeholder')" v-model="formData.attribute_values[attr.id.replace(/-/g, '_')]" :min="attr.min" :max="attr.max" type="number" v-if="attr.dataType === 'Decimal'"></el-input>
        <el-select :placeholder="$t('form.instance.attribute.placeholder')" v-model="formData.attribute_values[attr.id.replace(/-/g, '_')]" class="full-w" v-if="attr.dataType === 'Enum'">
          <el-option v-for="value in attr.candidate" :key="value" :label="value" :value="value"></el-option>
        </el-select>
        <el-select :placeholder="$t('form.instance.attribute.placeholder')" v-model="formData.attribute_values[attr.id.replace(/-/g, '_')]" class="full-w" v-if="attr.dataType === 'Boolean'">
          <el-option :value="true" :label="$t('dict.bool.true')"></el-option>
          <el-option :value="false" :label="$t('dict.bool.false')"></el-option>
        </el-select>
        <el-date-picker :placeholder="$t('form.instance.attribute.placeholder')" class="full-w" v-model="formData.attribute_values[attr.id.replace(/-/g, '_')]" type="datetime" v-if="attr.dataType === 'DateTime'"></el-date-picker>
        <el-date-picker :placeholder="$t('form.instance.attribute.placeholder')" class="full-w" v-model="formData.attribute_values[attr.id.replace(/-/g, '_')]" type="date" v-if="attr.dataType === 'Date'"></el-date-picker>
        <el-time-picker :placeholder="$t('form.instance.attribute.placeholder')" class="full-w" v-model="formData.attribute_values[attr.id.replace(/-/g, '_')]" v-if="attr.dataType === 'Time'"></el-time-picker>
      </el-form-item>
      <el-form-item v-if="!formData.id" v-for="target in model.Targets" :key="target.id" :label="target.name" :prop="target.name">
        <el-select clearable multiple v-model="formData.relations[target.id]" class="full-w">
          <el-option v-for="instance in targetInstances[target.id]" :key="instance.id" :value="instance.id" :label="instance.name"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer text-center">
      <el-button size="small" @click="close">{{$t("action.cancel")}}</el-button>
      <el-button size="small" type="primary" @click="submit">{{$t("action.confirm")}}</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import ViewPointSelector from "../../Maps/ViewPointSelector";
  import {createModelInstance, getModelInstanceList, updateModelInstance} from "../../../assets/js/api/model-instance";
  import {getLabelList} from "@/assets/js/api/unit-label";

  export default {
    name: "AddEditInstance",
    components: {
      ViewPointSelector
    },
    props: {
      dialogId: String,
      dialogVisibility: Boolean,
      model: Object,
      instance: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      title() {
        return !this.instance.id ? this.$t("form.title.addInstance") : this.$t("form.title.editInstance")
      },
      rules () {
        let that = this
        return {
          instanceId: [
            {required: true, message: this.$t("form.instance.id.error.empty"), trigger: ['change', 'blur']}
          ],
          name: [
            {required: true, message: this.$t("form.instance.name.error.empty"), trigger: ['change', 'blur']}
          ],
          attribute_values: this.model.static_attributes.filter(item => item.required).reduce((result, attr) => {
            result[attr.id.replace(/-/g, '_')] = [
              {required: true, message: this.$t("form.instance.attribute.error.empty"), trigger: ['change', 'blur']}
            ]
            let rule = {}
            switch (attr.dataType) {
              case 'String':
              case 'Text':
                rule = {type: 'string', message: this.$t("form.instance.attribute.error.invalidLength"), trigger: ['change', 'blur']}
                if (attr.min) {
                  rule.min = attr.min
                }
                if (attr.max) {
                  rule.max = attr.max
                }
                result[attr.id.replace(/-/g, '_')].push(rule)
                break
              case 'Integer':
                rule = {
                  validator(rule, value, callback, source, options) {
                    value = parseFloat(value)
                    if (isNaN(value)) {
                      return callback(new Error(that.$t("form.instance.attribute.error.invalid")))
                    } else if (value !== Math.floor(value)) {
                      return callback(new Error(that.$t("form.instance.attribute.error.integer")))
                    } else if ((attr.min || attr.min === 0) && value < attr.min) {
                      return callback(new Error(that.$t("form.instance.attribute.error.minimum", { min: attr.min })))
                    } else if ((attr.max || attr.max === 0) && value > attr.max) {
                      return callback(new Error(that.$t("form.instance.attribute.error.minimum", { min: attr.max })))
                    }
                    return callback()
                  },
                  trigger: ['change', 'blur']
                }
                result[attr.id.replace(/-/g, '_')].push(rule)
                break
              case 'Decimal':
                rule = {
                  validator(rule, value, callback, source, options) {
                    value = parseFloat(value)
                    if (isNaN(value)) {
                      return callback(new Error(that.$t("form.instance.attribute.error.invalid")))
                    } else if ((attr.min || attr.min === 0) && value < attr.min) {
                      return callback(new Error(that.$t("form.instance.attribute.error.minimum", { min: attr.min })))
                    } else if ((attr.max || attr.max === 0) && value > attr.max) {
                      return callback(new Error(that.$t("form.instance.attribute.error.minimum", { min: attr.max })))
                    }
                    return callback()
                  },
                  trigger: ['change', 'blur']
                }
                result[attr.id.replace(/-/g, '_')].push(rule)
                break
            }
            return result
          }, {})
        }
      }
    },
    watch: {
      dialogVisibility (newValue) {
        if (newValue) {
          this.getRelatedObjects()
        }
      }
    },
    data() {
      return {
        formLabelWidth: "140px",
        formData: {
          name: '',
          instanceId: '',
          threeDViewPoint: {},
          attribute_values: {},
          relations: {},
          labels: [],
        },
        labels: [],
        targetInstances: {},
      }
    },
    methods: {
      close() {
        this.$emit('action-finished', this.dialogId, false)
      },
      getRelatedObjects () {
        Promise.all(this.model.Targets.map(target => getModelInstanceList(target.id))).then(results => {
          this.targetInstances = results.reduce((res, { data }, index) => {
            res[this.model.Targets[index].id] = data
            return res
          }, {})
        })
      },
      getLabels () {
        getLabelList().then(result => {
          this.labels = result.data
        })
      },
      flushData () {
        this.formData = Object.assign({
          name: '',
          instanceId: '',
          labels: [],
          attribute_values: this.model.static_attributes.reduce((result, attr) => {
            if (attr.required) {
              result[attr.id] = attr.defaultValue || ''
            }
            return result
          }, {}),
          relations: this.model.Targets.reduce((result, target) => {
            if (target.model_relation.name === 'Contain') {
              result[target.id] = []
            }
            else {
              result[target.id] = ''
            }
            return result
          }, this.model.Sources.reduce((result, source) => {
            if (source.model_relation.name === 'Contain') {
              result[source.id] = ''
            }
            else {
              result[source.id] = []
            }
            return result
          }, {})),
        }, this.instance)
        try {
          this.formData.threeDViewPoint = JSON.parse(JSON.stringify(this.instance.threeDViewPoint))
        }
        catch (err) {
          this.formData.threeDViewPoint = {}
        }
        if (this.instance.labels) {
          this.formData.labels = this.instance.labels.map(item => item.name)
        }
        delete this.formData.threeDViewPointStr
      },
      submit() {
        this.$refs.groupForm.validate(valid => {
          if (valid) {
            if (this.instance.id) {
              updateModelInstance(this.model.id, this.instance.id, this.formData).then(response => {
                this.$message({
                  message: this.$t("message.instance.updated"),
                  type: 'success',
                  showClose: true,
                  duration: 2000
                })
                this.$emit('action-finished', this.dialogId, true)
              })
            }
            else {
              let attribute_values = {}
              for(let key in this.formData.attribute_values) {
                attribute_values[key.replace(/_/g, '-')] = this.formData.attribute_values[key]
              }
              createModelInstance(this.model.id, Object.assign({}, this.formData, { attribute_values })).then(response => {
                this.$message({
                  message: this.$t("message.instance.created"),
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
      this.getLabels()
      this.getRelatedObjects()
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
</style>
