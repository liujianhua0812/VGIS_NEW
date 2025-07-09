<template>
  <el-dialog width="1005px" v-auth="{ resources: 'Data', action: 'Admin' }" :title="$t('form.title.assignRole')"
             :visible.sync="dialogVisibility" @close="close">
    <div class="flex align-items-center justify-content-between m-b-25 m-t-15">
      <div class="flex align-items-center">
        <filter-icon></filter-icon>
        <div class="filter-label m-l-15 m-r-10">{{$t('model.account.department')}}</div>
        <el-select multiple style="width: 157px;" v-model="filter.org.value" clearable @change="getAccounts(1, true)">
          <el-option v-for="org in filter.org.candidates" :key="org.prId" :value="org.prId" :label="org.prName"></el-option>
        </el-select>
        <div class="filter-label m-l-15 m-r-10">{{$t('model.account.job')}}</div>
        <el-select multiple style="width: 232px;" v-model="filter.job.value" clearable @change="getAccounts(1, true)">
          <el-option v-for="job in filter.job.candidates" :key="job.prId" :value="job.prId" :label="job.prName"></el-option>
        </el-select>
      </div>
      <el-input class="filter" style="width: 213px;" v-model="filter.query.value" clearable @clear="getAccounts(1, true)">
        <template slot="append">
          <el-button type="primary" icon="el-icon-search" @click="getAccounts(1, true)"></el-button>
        </template>
      </el-input>
    </div>
    <el-table ref="accountTable" header-cell-class-name="table-header-cell" cell-class-name="table-cell" :data="accounts">
      <el-table-column type="selection"></el-table-column>
      <el-table-column :label="$t('model.account.name')" prop="accountName"></el-table-column>
      <el-table-column :label="$t('model.account.username')" prop="accountNo"></el-table-column>
      <el-table-column :label="$t('model.account.job')">
        <template slot-scope="{ row }">
          {{ row.user.user_jobs.filter(item => item.job).map(item => item.job.prName).join('/') || '——' }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('model.account.department')">
        <template slot-scope="{ row }">
          {{ row.user.user_jobs.filter(item => item.org).map(item => item.org.prName).join('/') || '——' }}
        </template>
      </el-table-column>
    </el-table>
    <el-row class="m-t-25 m-b-25">
      <el-pagination hide-on-single-page class="pull-right" :current-page="pagination.page" :page-count="pagination.total_page" @current-change="getAccounts"></el-pagination>
    </el-row>
    <div slot="footer" class="dialog-footer text-center">
      <el-button @click="close">{{$t("action.cancel")}}</el-button>
      <el-button type="primary" @click="submit">{{$t("action.confirm")}}</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import FilterIcon from "../../Icons/FilterIcon";
  import { getUserList, getJobList, getOrgList } from "../../../assets/js/api/accounts";
  import { assignRole } from "../../../assets/js/api/privilege";

  export default {
    name: "AssignRole",
    props: {
      dialogId: String,
      dialogVisibility: Boolean,
      role: Object
    },
    components: {
      FilterIcon
    },
    watch: {
      dialogVisibility (newValue) {
        if (newValue) {
          this.getOrgs()
          this.getJobs()
          this.getAccounts()
        }
      }
    },
    data() {
      return {
        accounts: [],
        filter: {
          org: {
            value: [],
            candidates: []
          },
          job: {
            value: [],
            candidates: []
          },
          query: {
            value: ''
          }
        },
        pagination: {
          page: 1,
          total_page: 1,
          total: 1,
          pagination: 10
        }
      }
    },
    methods: {
      close() {
        this.$emit('action-finished', this.dialogId, false)
      },
      getJobs () {
        getJobList().then(result => {
          this.filter.job.candidates = result.data
        })
      },
      getOrgs () {
        getOrgList().then(result => {
          this.filter.org.candidates = result.data
        })
      },
      getAccounts (page, refresh = false) {
        if (refresh) {
          this.pagination.page = 1
        }
        else {
          this.pagination.page = page
        }
        getUserList(Object.assign({
          orgId: this.filter.org.value,
          jobId: this.filter.job.value,
          query: this.filter.query.value
        }, this.pagination)).then(result => {
          this.accounts = result.data
          this.pagination = result.pagination
        })
      },
      submit() {
        let accountNos = this.$refs.accountTable.selection.map(item => item.accountNo)
        assignRole(this.role.id, accountNos).then(result => {
          this.$message({
            type: 'success',
            message: 'Role assigned successfully.',
            showClose: true
          })
          this.$emit('action-finished', this.dialogId, true)
        })
      }
    },
    created() {
      this.getOrgs()
      this.getJobs()
      this.getAccounts()
    }
  }
</script>
<style lang="scss" scoped>
  .filter-label {
    font-family: 'HarmonyOS Sans';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #000000;
  }
</style>
