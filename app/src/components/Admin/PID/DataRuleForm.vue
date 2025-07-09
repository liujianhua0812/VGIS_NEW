<template>
  <el-form ref="form" label-position="top" :model="formData" :rules="rules">
      <el-form-item :label="$t('form.pid.rules.data.type.label')" prop="type">
          <el-select class="full-w" v-model="formData.type">
              <el-option value="attribute" :label="$t('form.pid.rules.data.type.attribute')"></el-option>
              <el-option value="series" :label="$t('form.pid.rules.data.type.series')"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item :label="$t('form.pid.rules.data.attribute.label')" prop="attribute" v-if="formData.type === 'attribute'">
          <AttributeSelector class="full-w" v-model="formData.attribute"></AttributeSelector>
      </el-form-item>
      <el-form-item :label="$t('form.pid.rules.data.series.label')" prop="series" v-if="formData.type === 'series'">
          <PointSelector class="full-w" v-model="formData.series"></PointSelector>
      </el-form-item>
      <el-form-item :label="$t('form.pid.rules.data.instance.label')" prop="instance">
          <DeviceSelector v-if="formData.type === 'attribute'" :multiple="false" :model-id="formData.attribute[0]" class="full-w" v-model="formData.instance"></DeviceSelector>
          <DeviceSelector v-else :multiple="false" :model-id="formData.series[0]" class="full-w" v-model="formData.instance"></DeviceSelector>
      </el-form-item>
      <el-form-item :label="$t('form.pid.rules.data.emptyText.label')" prop="emptyText">
          <el-input class="full-w" v-model="formData.emptyText" :placeholder="$t('form.pid.rules.data.emptyText.placeholder')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('form.pid.rules.data.realtime.label')" prop="realtime">
          <el-switch v-model="formData.realtime"></el-switch>
      </el-form-item>
      <el-form-item :label="$t('form.pid.rules.data.period.label')" prop="period" v-if="formData.realtime">
          <el-input v-model="formData.period" :placeholder="$t('form.pid.rules.data.period.placeholder')">
              <el-select slot="append" style="width: 100px;" v-model="formData.unit" default-first-option>
                  <el-option v-for="time in timeUnit" :key="time.name" :value="time.factor" :label="time.name"></el-option>
              </el-select>
          </el-input>
      </el-form-item>
  </el-form>
</template>

<script>
import DeviceSelector from "@/components/Admin/Model/DeviceSelector.vue";
import PointSelector from "@/components/Admin/Model/PointSelector.vue";
import AttributeSelector from "@/components/Admin/Model/AttributeSelector.vue";

export default {
    name: "DataRuleForm",
    components: {AttributeSelector, PointSelector, DeviceSelector},
    props: {
        pid: {
            type: Object
        },
        configuration: {
            type: Object
        }
    },
    computed: {
        rules () {
            let that = this
            let result = {
                type: [{ required: true, message:this.$t("form.pid.rules.data.type.error.empty"), trigger: ["change", "blur"] }],
                instance: [{ required: true, message:this.$t("form.pid.rules.data.instance.error.empty"), trigger: ["change", "blur"] }],
            }
            if (this.formData.type === "attribute") {
                result.attribute = [{ required: true, message: this.$t("form.pid.rules.data.attribute.error.empty"), trigger: ["change", "blur"] }]
            }
            if (this.formData.type === "series") {
                result.series = [{ required: true, message: this.$t("form.pid.rules.data.series.error.empty"), trigger: ["change", "blur"] }]
            }
            if (this.formData.realtime) {
                result.period = [
                    { required: true, message: this.$t("form.pid.rules.data.period.error.empty"), trigger: ["change", "blur"] },
                    {
                        validator(rule, value, callback, source, options) {
                            value = parseFloat(value)
                            if (isNaN(value) || value <= 0) {
                                return callback(new Error(that.$t("form.pid.rules.data.period.error.invalid")))
                            }
                            return callback()
                        },
                        trigger: ['change', 'blur']
                    }
                ]
            }
            return result
        }
    },
    data () {
        return {
            formData: {
                type: "attribute",
                instance: "",
                attribute: "",
                series: "",
                realtime: false,
                refreshInterval: "",
                period: "",
                emptyText: "",
                unit: 1,
            },
            timeUnit: [{
                name: this.$t("dict.time.second"),
                factor: 1
            }, {
                name: this.$t("dict.time.minute"),
                factor: 60
            }, {
                name: this.$t("dict.time.hour"),
                factor: 60 * 60
            }, {
                name: this.$t("dict.time.day"),
                factor: 60 * 60 * 24
            }, {
                name: this.$t("dict.time.week"),
                factor: 60 * 60 * 24 * 7
            }, {
                name: this.$t("dict.time.month"),
                factor: 30 * 60 * 60 * 24
            }, {
                name: this.$t("dict.time.year"),
                factor: 365 * 60 * 60 * 24
            }]
        }
    },
    methods: {
        validate (cb) {
            return this.$refs.form.validate((valid) => {
                this.formData.refreshInterval = parseFloat(this.formData.period) * this.formData.unit
                return cb(valid, this.formData)
            })
        }
    },
    created () {
        if (this.configuration) {
            Object.assign(this.formData, this.configuration)
        }
    }
}
</script>

<style lang="scss" scoped>
.noc-vgis-pid-card {
    background: #FFFFFF;
    border: 1px solid #4FACFF;
    box-sizing: border-box;
    border-radius: 4px;
    cursor: pointer;

    img.pid-thumbnail {
        display: block;
        background: #56617B;
        height: 80px;
        width: 100%;
        object-fit: contain;
    }
}
</style>