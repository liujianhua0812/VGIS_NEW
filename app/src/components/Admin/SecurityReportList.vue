<template>
  <div class="full m-l-20">
    <vgis-breadcrumb :navs="navs"></vgis-breadcrumb>
    <el-card style="min-height: calc(100% - 35px);" shadow="none">
      <div class="flex align-items-center justify-content-between m-b-25 m-t-0">
        <div class="flex align-items-center">
          <el-date-picker clearable @change="refresh" v-model="filter.startAt" placeholder="Start date"
                          style="width: calc((100% - 20px)/2);"></el-date-picker>
          <span style="width: 20px; text-align: center;">~</span>
          <el-date-picker clearable @change="refresh" v-model="filter.endAt" placeholder="End date"
                          style="width: calc((100% - 20px)/2);"></el-date-picker>
        </div>
        <el-popover v-auth="{ resources: 'Security Incident', action: 'Admin' }" trigger="manual" width="300" v-model="visible">
          <el-form @submit.native.prevent label-position="top">
            <el-form-item size="small" label="Report">
              <el-upload action="#" :multiple="false" :auto-upload="false" :show-file-list="false"
                         :on-change="selectReport">
                <el-button size="small" type="default">Select a File</el-button>
                <div slot="tip" class="el-upload__tip" v-if="formData.report">{{formData.report.name}}</div>
              </el-upload>
            </el-form-item>
            <el-button type="primary" @click="upload">Submit</el-button>
          </el-form>
          <el-button slot="reference" type="primary" plain @click="visible = !visible">Upload</el-button>
        </el-popover>
      </div>
      <el-table header-cell-class-name="table-header-cell" cell-class-name="table-cell" :data="reports">
        <el-table-column label="Date">
          <template slot-scope="scope">
            <div><b>Occurred: </b>{{new Date(scope.row.occurredAt).format('dd/MM/yyyy')}}</div>
            <div><b>Reported: </b>{{new Date(scope.row.reportedAt).format('dd/MM/yyyy')}}</div>
          </template>
        </el-table-column>
        <el-table-column label="Category & Definition">
          <template slot-scope="scope">
            <div><b>Category: </b>{{scope.row.category}}</div>
            <div><b>Definition: </b>{{scope.row.definition}}</div>
          </template>
        </el-table-column>
        <el-table-column label="Location">
          <template slot-scope="scope">
            {{scope.row.location || "——"}}
          </template>
        </el-table-column>
        <el-table-column label="Action" width="110px" v-if="validate($store.state.user, { resources: 'Security Incident', action: 'Admin' })">
          <template slot-scope="scope">
            <el-button icon="el-icon-delete" type="danger" plain size="mini" @click="remove(scope.row)">Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>

  import { validate } from "../../utils";
  import VgisBreadcrumb from "../Standard/vgis-breadcrumb.vue"
  import {getReports, removeReport, uploadReport} from "../../assets/js/api/security-report";

  export default {
    name: "SecurityReportList",
    components: {
      VgisBreadcrumb
    },
    data() {
      return {
        navs: [{
          name: 'Home',
          url: '/admin'
        }, {
          name: 'Security Incidents'
        }],
        filter: {
          startAt: '',
          endAt: ''
        },
        formData: {
          report: ''
        },
        visible: false,
        reports: []
      }
    },
    methods: {
      validate,
      selectReport(file) {
        if (file.name.substr(file.name.length - 4, 4) !== 'xlsx') {
          this.$message({
            type: 'error',
            message: 'XLSX format only.',
            showClose: true
          })
        } else {
          this.formData.report = file.raw
        }
        return false
      },
      upload() {
        uploadReport(this.formData).then(result => {
          this.$message({
            type: 'success',
            message: 'Report uploaded successfully.',
            showClose: true
          })
          this.refresh()
          this.visible = false
        })
      },
      remove(record) {
        this.$confirm('Action cannot be reversed, are you sure?', 'Warning', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          removeReport(record.id).then(result => {
            this.$message({
              type: 'success',
              message: 'Record deleted successfully.',
              showClose: true
            })
            this.refresh()
          })
        })
      },
      refresh() {
        getReports(this.filter).then(result => {
          this.reports = result.data
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
