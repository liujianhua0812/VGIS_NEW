<template>
  <div class="full m-l-20">
    <vgis-breadcrumb :navs="navs"></vgis-breadcrumb>
    <el-card style="min-height: calc(100% - 35px);" shadow="none">
      <el-table border header-cell-class-name="table-header-cell" cell-class-name="table-cell" :data="calendarData">
        <el-table-column label="Year">
          <template slot-scope="{ row }">
            <div class="text-bold">{{row.year}}</div>
          </template>
        </el-table-column>
        <el-table-column v-for="(month, index) in months" :key="month" :label="month">
          <template slot-scope="{ row }">
            <p class="p-t-10">
              {{ new Date(row.year, index, 1).format('yyyy-MM') }}
              <b class="pull-right text-xl">{{ reports[new Date(row.year, index, 1).format('yyyy-MM')] ? '✔️' : ''}}</b>
            </p>
            <el-popover v-auth="{ resources: 'URS Report', action: 'Admin' }" trigger="click" width="300" :ref="`form-${new Date(row.year, index, 1).format('yyyy-MM')}`">
              <el-form @submit.native.prevent label-position="top">
                <el-form-item size="small" :label="$t('form.report.date.label')">
                  <el-date-picker disabled type="month" style="width: 100%;" :placeholder="$t('form.report.date.placeholder')" :value="(new Date(row.year, index, 1))"></el-date-picker>
                </el-form-item>
                <el-form-item size="small" :label="$t('form.report.report.label')">
                  <el-upload action="#" :multiple="false" :auto-upload="false" :show-file-list="false"
                             :on-change="selectReport">
                    <el-button size="small" type="default">{{$t("form.report.report.placeholder")}}</el-button>
                    <div slot="tip" class="el-upload__tip" v-if="formData.report">{{formData.report.name}}</div>
                  </el-upload>
                </el-form-item>
                <el-button v-loading="loading" type="primary" @click="upload(new Date(row.year, index, 1))">{{$t("action.submit")}}</el-button>
              </el-form>
              <el-button slot="reference" type="text">{{$t("action.upload")}}</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import VgisBreadcrumb from "../Standard/vgis-breadcrumb.vue"
  import {
    getURSReport,
    getURSReports,
    uploadURSReport,
    removeURSReport
  } from "../../assets/js/api/urs-report";

  export default {
    name: "URSReportList",
    components: {
      VgisBreadcrumb
    },
    data() {
      return {
        loading: false,
        navs: [{
          name: this.$t("menu.home"),
          url: '/admin'
        }, {
          name: this.$t("menu.ursReport")
        }],
        filter: {
          startAt: '',
          endAt: ''
        },
        months: [
          this.$t("dict.month.jan"),
          this.$t("dict.month.feb"),
          this.$t("dict.month.mar"),
          this.$t("dict.month.apr"),
          this.$t("dict.month.may"),
          this.$t("dict.month.jun"),
          this.$t("dict.month.jul"),
          this.$t("dict.month.aug"),
          this.$t("dict.month.sep"),
          this.$t("dict.month.oct"),
          this.$t("dict.month.nov"),
          this.$t("dict.month.dec")
        ],
        calendarData: ((startY, endY) => {
          let result = []
          for(let i = endY; i >= startY; i--) {
            result.push({ year: i })
          }
          return result
        })(2010, new Date().getFullYear()),
        formData: {
          date: '',
          report: ''
        },
        visible: false,
        reports: {}
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
        uploadURSReport(this.formData).then(result => {
          this.$message({
            type: 'success',
            message: this.$t('message.report.uploaded'),
            showClose: true
          })
          if (this.$refs[`form-${date.format('yyyy-MM')}`] instanceof Array) {
            this.$refs[`form-${date.format('yyyy-MM')}`][0].showPopper = false
          }
          else {
            this.$refs[`form-${date.format('yyyy-MM')}`].showPopper = false
          }
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
          removeURSReport(date).then(result => {
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
        getURSReports(this.filter).then(result => {
          this.reports = result.data.reduce((result, item) => {
            result[new Date(item.month).format('yyyy-MM')] = true
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
