<template>
  <el-form ref="form" label-position="top" :model="formData" :rules="rules">
      <el-form-item :label="$t('form.pid.rules.link.target.label')" prop="target">
          <div v-if="diagrams.length === 0" style="height: 300px;"
               class="flex justify-content-center align-items-center text-info text-regular">
              {{ $t("message.pid.empty") }}
          </div>
          <el-row :gutter="20" v-else>
              <el-col :span="4" v-for="item in diagrams" :key="item.id" class="m-b-15">
                  <div class="noc-vgis-pid-card" @click="formData.target = item.id">
                      <h3 class="text-bold p-l-10 p-r-10 m-0 text-regular flex justify-content-between align-items-center">
                          {{ item.name }}
                          <i v-if="item.id === formData.target" class="el-icon-circle-check text-primary text-bold"></i>
                      </h3>
                      <img alt="" class="pid-thumbnail" :src="`data:image/svg+xml;base64,${item.map}`"/>
                  </div>
              </el-col>
          </el-row>
      </el-form-item>
      <el-form-item :label="$t('form.pid.rules.link.type.label')" prop="type">
          <el-select class="full-w" v-model="formData.type">
              <el-option value="tab" :label="$t('form.pid.rules.link.type.tab')"></el-option>
              <el-option value="redirect" :label="$t('form.pid.rules.link.type.redirect')"></el-option>
          </el-select>
      </el-form-item>
  </el-form>
</template>

<script>
import {getDiagrams} from "@/assets/js/api/pid";

export default {
    name: "LinkRuleForm",
    props: {
        pid: {
            type: Object
        },
        configuration: {
            type: Object
        }
    },
    data () {
        return {
            rules: {
                target: [{ required: true, message:this.$t("form.pid.rules.link.target.error.empty"), trigger: ["change", "blur"] }],
                type: [{ required: true, message:this.$t("form.pid.rules.link.type.error.empty"), trigger: ["change", "blur"] }]
            },
            formData: {
                target: "",
                type: "redirect",
                extra: {}
            },
            diagrams: []
        }
    },
    methods: {
        getDiagrams () {
            getDiagrams().then(result => {
                this.diagrams = result.data
            })
        },
        validate (cb) {
            return this.$refs.form.validate((valid) => {
                this.formData.extra = {
                    targetPID: this.diagrams.find(item => item.id === this.formData.target)
                }
                return cb(valid, this.formData)
            })
        }
    },
    created () {
        if (this.configuration) {
            Object.assign(this.formData, this.configuration)
        }
        this.getDiagrams()
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