<template>
  <div class="full m-l-20">
    <vgis-breadcrumb :navs="navs"></vgis-breadcrumb>
    <el-card style="min-height: calc(100% - 35px);" shadow="none">
      <el-calendar>
        <template slot="dateCell" slot-scope="{date, data}">
          <p class="text-bold">
            {{ data.day.split('-').slice(1).join('-') }}
            <b class="pull-right text-xl">{{ reports[date.format('yyyy-MM-dd')] ? '✔️' : ''}}</b>
          </p>
          <el-popover v-if="data.type === 'current-month'" v-auth="{ resources: 'Daily Report', action: 'Admin' }" trigger="click" width="300" :ref="`form-${date.format('yyyy-MM-dd')}`">
            <el-form ref="reportForm" @submit.native.prevent label-position="top">
              <el-form-item size="small" :label="$t('form.report.date.label')">
                <el-date-picker disabled style="width: 100%;" :placeholder="$t('form.report.date.placeholder')" v-model="date"></el-date-picker>
              </el-form-item>
              <el-form-item size="small" :label="$t('form.report.report.label')">
                <el-upload action="#" :multiple="false" :auto-upload="false" :show-file-list="false"
                           :on-change="selectReport">
                  <el-button size="small" type="default">{{$t("form.report.report.placeholder")}}</el-button>
                  <div slot="tip" class="el-upload__tip" v-if="formData.report">{{formData.report.name}}</div>
                </el-upload>
              </el-form-item>
              <el-button v-loading="loading" type="primary" @click="upload(date)">{{$t("action.submit")}}</el-button>
            </el-form>
            <el-button slot="reference" type="text">{{$t("action.upload")}}</el-button>
          </el-popover>
        </template>
      </el-calendar>
    </el-card>
  </div>
</template>

<script>

  import VgisBreadcrumb from "../Standard/vgis-breadcrumb.vue"
  import {getReport, getReports, removeReport, uploadReport} from "../../assets/js/api/report";

  export default {
    name: "DailyReportList",
    components: {
      VgisBreadcrumb
    },
    data() {
      return {
        navs: [{
          name: this.$t("menu.home"),
          url: '/admin'
        }, {
          name: this.$t("menu.dailyReport")
        }],
        rules: {
          date: [
            {required: true, message: this.$t("form.report.date.error.empty"), trigger: 'change'}
          ],
          report: [
            {required: true, message: this.$t("form.report.report.error.empty"), trigger: 'change'}
          ]
        },
        loading: false,
        filter: {
          startAt: '',
          endAt: ''
        },
        formData: {
          date: '',
          report: ''
        },
        visible: false,
        reports: {},
      }
    },
    methods: {
      selectReport(file) {
        if (!['XLSX', 'XLSM'].includes(file.name.substr(file.name.length - 4, 4).toUpperCase()) && file.name.substr(file.name.length - 3, 3).toUpperCase() !== 'XLS') {
          this.$message({
            type: 'error',
            message: this.$t("form.report.report.error.xlsxOnly"),
            showClose: true
          })
        } else {
          this.formData.report = file.raw
        }
        return false
      },
      upload(date) {
        if (this.loading) return
        if (!this.formData.report) {
          return this.$message({
            type: 'error',
            message: this.$t('form.report.report.error.empty'),
            showClose: true
          })
        }
        this.loading = true
        this.formData.date = date
        uploadReport(this.formData).then(result => {
          this.$message({
            type: 'success',
            message: this.$t('message.report.uploaded'),
            showClose: true
          })
          this.$refs[`form-${date.format('yyyy-MM-dd')}`].showPopper = false
          this.loading = false
          this.refresh()
        }).catch(err => {
          this.loading = false
        })
      },
      remove(date) {
        this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
          confirmButtonText: this.$t("action.confirm"),
          cancelButtonText: this.$t("action.cancel"),
          type: 'warning'
        }).then(() => {
          removeReport(date).then(result => {
            this.$message({
              type: 'success',
              message: this.$t("message.report.deleted"),
              showClose: true
            })
            this.refresh()
          })
        })
      },
      refresh() {
        getReports(this.filter).then(result => {
          this.reports = result.data.reduce((result, item) => {
            result[new Date(item.date).format('yyyy-MM-dd')] = true
            return result
          }, {})
        })
      }
    },
    created() {
      this.refresh()
    }
  }
</script>

<style scoped>

</style>
