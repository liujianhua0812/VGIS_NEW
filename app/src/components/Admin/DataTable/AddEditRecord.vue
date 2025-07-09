<template>
  <el-dialog width="600px" v-auth="{ resources: 'Model', action: 'Admin' }" :title="title"
             :visible.sync="dialogVisibility" @close="close">
    <el-scrollbar tag="div" wrap-style="max-height: 600px;">
      <el-form class="custom-form" label-position="top" :rules="rules" :model="formData" ref="groupForm">
        <el-form-item v-for="field in table.table_fields" :key="field.id" :label="field.name" :prop="field.id">
          <el-input v-model="formData[field.id]" :minlength="field.min" :maxlength="field.max" v-if="field.dataType === 'String'"></el-input>
          <el-input v-model="formData[field.id]" :minlength="field.min" :maxlength="field.max" type="textarea" rows="4" v-if="field.dataType === 'Text'"></el-input>
          <el-input v-model="formData[field.id]" :min="field.min" :max="field.max" type="number" v-if="field.dataType === 'Integer'">
            <template slot="suffix" v-if="field.unit">{{field.unit.name}}</template>
          </el-input>
          <el-input v-model="formData[field.id]" :min="field.min" :max="field.max" type="number" v-if="field.dataType === 'Decimal'">
            <template slot="suffix" v-if="field.unit">{{field.unit.name}}</template>
          </el-input>
          <el-select v-model="formData[field.id]" class="full-w" v-if="field.dataType === 'Enum'">
            <el-option v-for="value in field.candidate" :key="value" :label="value" :value="value"></el-option>
          </el-select>
          <el-select v-model="formData[field.id]" class="full-w" v-if="field.dataType === 'Boolean'">
            <el-option :value="true" :label="$t('dict.bool.true')"></el-option>
            <el-option :value="false" :label="$t('dict.bool.false')"></el-option>
          </el-select>
          <el-date-picker class="full-w" v-model="formData[field.id]" type="datetime" v-if="field.dataType === 'DateTime'"></el-date-picker>
          <el-date-picker class="full-w" v-model="formData[field.id]" type="date" v-if="field.dataType === 'Date'"></el-date-picker>
          <el-time-picker class="full-w" v-model="formData[field.id]" v-if="field.dataType === 'Time'"></el-time-picker>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">{{$t("action.cancel")}}</el-button>
      <el-button type="primary" @click="submit">{{$t("action.confirm")}}</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import { createRecord, updateRecord } from "../../../assets/js/api/data-table-record";

  export default {
    name: "AddEditSeriesValue",
    props: {
      dialogId: String,
      dialogVisibility: Boolean,
      table: Object,
      record: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      title() {
        return !this.record.id ? this.$t("form.title.addTableRecord") : this.$t("form.title.editTableRecord")
      },
      rules () {
        let result = {}
        let that = this
        for(let i = 0; i < this.table.table_fields.length; i++) {
          result[this.table.table_fields[i].id] = []
          if (this.table.table_fields[i].dataType === 'Decimal') {
            if (this.table.table_fields[i].min || this.table.table_fields[i].min === 0) {
              result[this.table.table_fields[i].id].push({
                validator(rule, value, callback) {
                  if (!value || parseFloat(value) >= that.table.table_fields[i].min) {
                    callback()
                  }
                  else {
                    callback(new Error(this.$t('form.field.value.error.invalid')))
                  }
                },
                trigger:['change', 'blur']
              })
            }
            if (this.table.table_fields[i].max || this.table.table_fields[i].max === 0) {
              result[this.table.table_fields[i].id].push({
                validator(rule, value, callback) {
                  if (!value || parseFloat(value) <= that.table.table_fields[i].max) {
                    callback()
                  }
                  else {
                    callback(new Error(this.$t('form.field.value.error.invalid')))
                  }
                },
                trigger:['change', 'blur']
              })
            }
          }
          if (this.table.table_fields[i].required) {
            result[this.table.table_fields[i].id].push({
              required: true,
              trigger: ['change', 'blur'],
              message: this.$t('form.field.value.error.empty')
            })
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
        this.formData = Object.assign({}, this.table.table_fields.reduce((result, item) => {
          result[item.id] = ''
          return result
        }, {}), this.record)
      },
      convertField (field, value) {
        if (!value && value !== 0) {
          if (field.useRealtime) {
            value = new Date()
          }
          else {
            value = field.defaultValue
          }
          if (!value) {
            value = null
          }
        }
        switch (field.dataType) {
          case "Date":
            value = new Date(value).format('yyyy-MM-dd')
            break
          case "Time":
            value = new Date(value).format('hh:mm:ss')
            break
          case "DateTime":
            value = new Date(value).format('yyyy-MM-dd hh:mm:ss')
        }
        return value
      },
      convertData () {
        let result = {}
        for(let i = 0 ; i < this.table.table_fields.length; i++) {
          let field = this.table.table_fields[i]
          result[field.id] = this.convertField(field, this.formData[field.id])
        }
        return result
      },
      submit () {
        this.$refs.groupForm.validate(valid => {
          if (valid) {
            if (!this.record.id) {
              createRecord(this.table.id, Object.entries(this.convertData()).map(entry => ({ fieldId: entry[0], value: entry[1] }))).then(result => {
                this.$message({
                  message: 'Record added successfully.',
                  type: 'success',
                  showClose: true,
                  duration: 2000
                })
                this.$emit('action-finished', this.dialogId, true)
              })
            }
            else {
              updateRecord(this.table.id, this.record.id, Object.entries(this.convertData()).map(entry => ({ fieldId: entry[0], value: entry[1] }))).then(result => {
                this.$message({
                  message: 'Record updated successfully.',
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
