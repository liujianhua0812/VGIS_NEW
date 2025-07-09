<template>
  <el-dialog class="vgis-adm" :append-to-body="appendToBody" width="600px" v-auth="{ resources: 'Model', action: 'Admin' }" :title="title"
             :visible.sync="dialogVisibility" @close="close">
    <el-form label-position="top" :rules="rules" :model="formData" ref="groupForm">
      <el-form-item :label="$t('form.series.time.label')" prop="time">
        <el-date-picker :placeholder="$t('form.series.time.placeholder')" class="full-w" type="datetime" v-model="formData.time" autocomplete="off"></el-date-picker>
      </el-form-item>
      <div  v-if="!series.id">
        <el-form-item v-for="_series in model.time_series" :key="_series.id" :label="_series.name" :prop="_series.id">
          <el-input v-model="formData[_series.id]" :minlength="_series.min" :maxlength="_series.max" v-if="_series.dataType === 'String'"></el-input>
          <el-input v-model="formData[_series.id]" :minlength="_series.min" :maxlength="_series.max" type="textarea" rows="4" v-if="_series.dataType === 'Text'"></el-input>
          <el-input v-model="formData[_series.id]" :min="_series.min" :max="_series.max" type="number" v-if="_series.dataType === 'Integer'">
            <template slot="suffix">{{ _series.unit ? _series.unit.name : '' }}</template>
          </el-input>
          <el-input v-model="formData[_series.id]" :min="_series.min" :max="_series.max" type="number" v-if="_series.dataType === 'Decimal'">
            <template slot="suffix">{{ _series.unit ? _series.unit.name : '' }}</template>
          </el-input>
          <el-select v-model="formData[_series.id]" class="full-w" v-if="_series.dataType === 'Enum'">
            <el-option v-for="value in _series.candidate" :key="value" :label="value" :value="value"></el-option>
          </el-select>
          <el-select v-model="formData[_series.id]" class="full-w" v-if="_series.dataType === 'Boolean'">
            <el-option :value="true" :label="$t('dict.bool.true')"></el-option>
            <el-option :value="false" :label="$t('dict.bool.false')"></el-option>
          </el-select>
          <el-date-picker class="full-w" v-model="formData[_series.id]" type="datetime" v-if="_series.dataType === 'DateTime'"></el-date-picker>
          <el-date-picker class="full-w" v-model="formData[_series.id]" type="date" v-if="_series.dataType === 'Date'"></el-date-picker>
          <el-time-picker class="full-w" v-model="formData[_series.id]" v-if="_series.dataType === 'Time'"></el-time-picker>
        </el-form-item>
      </div>
      <el-form-item v-else :label="series.name" :prop="series.id">
        <el-input v-model="formData[series.id]" :minlength="series.min" :maxlength="series.max" v-if="series.dataType === 'String'"></el-input>
        <el-input v-model="formData[series.id]" :minlength="series.min" :maxlength="series.max" type="textarea" rows="4" v-if="series.dataType === 'Text'"></el-input>
        <el-input v-model="formData[series.id]" :min="series.min" :max="series.max" type="number" v-if="series.dataType === 'Integer'">
          <template slot="suffix">{{ series.unit ? series.unit.name : '' }}</template>
        </el-input>
        <el-input v-model="formData[series.id]" :min="series.min" :max="series.max" type="number" v-if="series.dataType === 'Decimal'">
          <template slot="suffix">{{ series.unit ? series.unit.name : '' }}</template>
        </el-input>
        <el-select v-model="formData[series.id]" class="full-w" v-if="series.dataType === 'Enum'">
          <el-option v-for="value in series.candidate" :key="value" :label="value" :value="value"></el-option>
        </el-select>
        <el-select v-model="formData[series.id]" class="full-w" v-if="series.dataType === 'Boolean'">
          <el-option :value="true" :label="$t('dict.bool.true')"></el-option>
          <el-option :value="false" :label="$t('dict.bool.false')"></el-option>
        </el-select>
        <el-date-picker class="full-w" v-model="formData[series.id]" type="datetime" v-if="series.dataType === 'DateTime'"></el-date-picker>
        <el-date-picker class="full-w" v-model="formData[series.id]" type="date" v-if="series.dataType === 'Date'"></el-date-picker>
        <el-time-picker class="full-w" v-model="formData[series.id]" v-if="series.dataType === 'Time'"></el-time-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">{{$t("action.cancel")}}</el-button>
      <el-button type="primary" @click="submit">{{$t("action.confirm")}}</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import { createInstanceSeriesValue, updateInstanceSeriesValue } from "../../../assets/js/api/model-instance-series";

  export default {
    name: "AddEditSeriesValue",
    props: {
      dialogId: String,
      dialogVisibility: Boolean,
      model: Object,
      instance: Object,
      appendToBody: {
        type: Boolean,
        default: false
      },
      series: {
        type: Object,
        default: () => ({})
      },
      record: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      title() {
        return !this.record.id ? this.$t('form.title.addSeriesValue') : this.$t('form.title.editSeriesValue')
      },
      rules () {
        let result = Object.assign({
          time: [
            { required: true, message: this.$t('form.series.time.error.empty'), trigger: ['change', 'blur'] }
          ]
        }, this.model.time_series.reduce((result, _series) => {
          if (!this.series.id || _series.id === this.series.id) {
            result[_series.id] = []
          }
          return result
        }, {}))
        let that = this
        if (this.series.id) {
          if (this.series.min || this.series.min === 0) {
            result[this.series.id].push({
              validator(rule, value, callback) {
                if (!value || parseFloat(value) >= that.series.min) {
                  callback()
                }
                else {
                  callback(new Error(that.$t('form.series.value.error.invalid')))
                }
              },
              trigger:['change', 'blur']
            })
          }
          if (this.series.max || this.series.max === 0) {
            result[this.series.id].push({
              validator(rule, value, callback) {
                if (!value || parseFloat(value) <= that.series.max) {
                  callback()
                }
                else {
                  callback(new Error(that.$t('form.series.value.error.invalid')))
                }
              },
              trigger:['change', 'blur']
            })
          }
        }
        else {
          for(let i = 0; i < this.model.time_series.length; i++) {
            if (this.model.time_series[i].dataType === 'Decimal') {
              if (this.model.time_series[i].min || this.model.time_series[i].min === 0) {
                result[this.model.time_series[i].id].push({
                  validator(rule, value, callback) {
                    if (!value || parseFloat(value) >= that.model.time_series[i].min) {
                      callback()
                    }
                    else {
                      callback(new Error(that.$t('form.series.value.error.invalid')))
                    }
                  },
                  trigger:['change', 'blur']
                })
              }
              if (this.model.time_series[i].max || this.model.time_series[i].max === 0) {
                result[this.model.time_series[i].id].push({
                  validator(rule, value, callback) {
                    if (!value || parseFloat(value) <= that.model.time_series[i].max) {
                      callback()
                    }
                    else {
                      callback(new Error(that.$t('form.series.value.error.invalid')))
                    }
                  },
                  trigger:['change', 'blur']
                })
              }
            }
          }
        }
        return result
      }
    },
    data () {
      return {
        formData: {
          time: '',
        }
      }
    },
    watch: {
      record: {
        handler (newValue) {
          this.flushData()
        },
        deep: true
      }
    },
    methods: {
      close() {
        this.$emit('action-finished', this.dialogId, false)
      },
      flushData () {
        this.formData = Object.assign({}, {
          time: ''
        }, this.model.time_series.reduce((result, item) => {
          if (!this.series.id || item.id === this.series.id) {
            result[item.id] = ''
          }
          return result
        }, {}), this.record)
        delete this.formData.series
      },
      submit () {
        this.$refs.groupForm.validate(valid => {
          if (valid) {
            if (!this.record.id) {
              createInstanceSeriesValue(this.instance.id, this.formData).then(result => {
                this.$message({
                  message: this.$t("message.series.value.created"),
                  type: 'success',
                  showClose: true,
                  duration: 2000
                })
                this.$emit('action-finished', this.dialogId, true)
              })
            }
            else {
              updateInstanceSeriesValue(this.instance.id, this.formData).then(result => {
                this.$message({
                  message: this.$t("message.series.value.updated"),
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
      }
  }
</script>

<style scoped>

</style>
