<template>
    <div class="m-l-20 full-h">
        <vgis-breadcrumb :navs="navs"></vgis-breadcrumb>
        <el-card style="min-height: calc(100% - 35px);" shadow="none">
            <div class="flex align-items-center justify-content-between m-b-25 m-t-0">
                <div class="flex align-items-center">
                    <filter-icon></filter-icon>
                    <el-input class="m-l-15 filter" style="width: 213px;" v-model="filter.query.value" clearable
                              @clear="getAccounts(1, true)" @keyup.native.enter="getAccounts(1, true)">
                        <template slot="append">
                            <el-button type="primary" icon="el-icon-search" @click="getAccounts(1, true)"></el-button>
                        </template>
                    </el-input>
                    <div class="filter-label m-l-15 m-r-10">{{ $t("model.account.job") }}</div>
                    <el-select multiple style="width: 250px;" v-model="filter.job.value" clearable
                               @change="getAccounts(1, true)">
                        <el-option v-for="job in filter.job.candidates" :key="job.value" :value="job.value"
                                   :label="job.label"></el-option>
                    </el-select>
                    <div class="filter-label m-l-15 m-r-10">{{ $t("model.account.department") }}</div>
                    <el-select multiple style="width: 250px;" v-model="filter.org.value" clearable
                               @change="getAccounts(1, true)">
                        <el-option v-for="org in filter.org.candidates" :key="org.value" :value="org.value"
                                   :label="org.label"></el-option>
                    </el-select>
                    <div class="filter-label m-l-15 m-r-10">{{ $t("model.account.status") }}</div>
                    <el-select style="width: 250px;" v-model="filter.status.value" clearable
                               @change="getAccounts(1, true)">
                        <el-option v-for="status in filter.status.candidates" :key="status.value" :value="status.value"
                                   :label="status.label"></el-option>
                    </el-select>
                </div>
                <el-button v-auth="{ resources: 'Account', action: 'Admin' }" plain icon="el-icon-plus"
                           @click="createAccount" type="primary">{{ $t("action.add") }}
                </el-button>
            </div>
            <el-table header-cell-class-name="table-header-cell" cell-class-name="table-cell" :data="userList">
                <el-table-column :label="$t('model.account.name')" prop="user.realName"></el-table-column>
                <el-table-column :label="$t('model.account.gender')" prop="user.gender"></el-table-column>
                <el-table-column :label="$t('model.account.username')" prop="accountName"></el-table-column>
<!--                <el-table-column :label="$t('model.account.internal')" prop="isInternal" width="100px">-->
<!--                    <template slot-scope="scope">-->
<!--                        <div>{{ $t(`dict.bool.${!!scope.row.isInternal}`) }}</div>-->
<!--                    </template>-->
<!--                </el-table-column>-->
                <el-table-column :label="$t('model.account.email')" prop="user.email"></el-table-column>
                <el-table-column :label="$t('model.account.phone')" prop="user.phone"></el-table-column>
                <el-table-column :label="$t('model.account.job')" prop="user.job">
                    <!-- <template slot-scope="{ row }">
                        {{ row.user.user_jobs.filter(item => item.job).map(item => item.job.prName).join('/') || '——' }}
                    </template> -->
                </el-table-column>
                <el-table-column :label="$t('model.account.department')" prop="user.department">
                    <!-- <template slot-scope="{ row }">
                        {{ row.user.user_jobs.filter(item => item.org).map(item => item.org.prName).join('/') || '——' }}
                    </template> -->
                </el-table-column>
                <el-table-column :label="$t('model.account.status')" prop="status" width="80px">
                    <template slot-scope="scope">
                        <el-switch :disabled="!validate($store.state.user, { resources: 'Account', action: 'Admin' })"
                                   v-model="scope.row.status" active-value="activated" inactive-value="deactivated"
                                   @change="toggleActivation(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('model.account.role')" prop="role.name"></el-table-column>
                <!-- <el-table-column :label="$t('model.account.photo')" prop="user.photo"></el-table-column> -->
                 <el-table-column :label="$t('model.account.photo')">
                    <template v-slot="scope">
                        <img
                        v-if="scope.row.user && scope.row.user.photo"
                        :src="scope.row.user.photo"
                        alt="用户照片"
                        style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover"
                        />
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <!-- 指纹功能已注释掉 -->
                <!-- <el-table-column :label="$t('model.account.fingerprint')" prop="user.fingerprint"></el-table-column> -->

                <!-- <el-table-column :label="$t('model.account.fingerprint')">
                    <template v-slot="scope">
                        <img
                        v-if="scope.row.user && scope.row.user.fingerprint"
                        :src="scope.row.user.fingerprint"
                        alt="用户指纹"
                        style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover"
                        />
                        <span v-else>无</span>
                    </template>
                </el-table-column> -->

                <el-table-column width="263px" :label="$t('label.basic.action')"
                                 v-if="validate($store.state.user, { resources: 'Account', action: 'Admin' })">
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-edit" plain type="primary" @click="editAccount(scope.row)">
                            {{ $t("action.edit") }}
                        </el-button>
                        <el-button size="mini" icon="el-icon-refresh-right" plain type="primary"
                                   @click="resetPassword(scope.row)">{{ $t("action.resetPassword") }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row class="m-t-25 m-b-25 text-center">
                <el-pagination hide-on-single-page :current-page="pagination.page" :page-count="pagination.total_page"
                               @current-change="getAccounts"></el-pagination>
            </el-row>
        </el-card>
        <edit-account v-auth="{ resources: 'Account', action: 'Admin' }" class="editAccDialog"
                      v-if="dialogVisibility.editAccount" dialog-id="editAccount"
                      :dialog-visibility="dialogVisibility.editAccount" :form-data="editAccountData"
                      @action-finished="actionFinished"></edit-account>
        <reset-password v-auth="{ resources: 'Account', action: 'Admin' }" v-if="dialogVisibility.resetPassword"
                        class="resetPwdDia" dialog-id="resetPassword"
                        :dialog-visibility="dialogVisibility.resetPassword" :account-no="resetPasswordData"
                        @action-finished="actionFinished"></reset-password>
    </div>
</template>

<script>

import VgisBreadcrumb from "../Standard/vgis-breadcrumb.vue"
import FilterIcon from "../Icons/FilterIcon";
import EditAccount from "./Account/EditAccount";
import ResetPassword from "./Account/ResetPassword";
import {validate} from '@/utils'
import {
    getUserList,
    editUser,
    getJobList, getOrgList
} from "@/assets/js/api/accounts";

export default {
    name: "AccountPage",
    components: {
        VgisBreadcrumb,
        FilterIcon,
        EditAccount,
        ResetPassword
    },
    data() {
        return {
            navs: [{
                name: this.$t('menu.home'),
                url: '/admin'
            }, {
                name: this.$t('menu.account')
            }],
            dialogVisibility: {
                editAccount: false,
                resetPassword: false
            },
            filter: {
                org: {
                    value: [],
                    candidates: []
                },
                job: {
                    value: [],
                    candidates: []
                },
                status: {
                    value: "",
                    candidates: [
                        {value: "activated", label: this.$t("dict.status.activated")},
                        {value: "deactivated", label: this.$t("dict.status.deactivated")},
                        {value: "deleted", label: this.$t("dict.status.deleted")},
                    ]
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
            },
            editAccountData: '',
            resetPasswordData: '',
            userList: [],
        }
    },
    computed: {},
    created() {
        this.getAccounts();
        this.getJobs();
        this.getOrgs();
        this.init_info();

    },
    methods: {
        validate,
        actionFinished(dialogId, success) {
            this.dialogVisibility[dialogId] = false
            if (success) {
                this.getAccounts()
            }
        },
        getJobs() {
            getJobList().then(result => {
                this.filter.job.candidates = result.data
            })
        },
        // init_info() {
        //     getUserList(Object.assign({
        //         orgId: this.filter.org.value,
        //         jobId: this.filter.job.value,
        //         status: this.filter.status.value,
        //         query: this.filter.query.value
        //     }, this.pagination)).then(result => {
        //         this.userList = result.data;
        //         this.pagination = result.pagination;
        //         // console.log(this.userList);

        //         // 初始化两个空数组用于存放结果
        //         const allJobs = [];
        //         const allDepartments = [];

        //         // 遍历 userList 提取数据
        //         this.userList.forEach(item => {
        //         // 从 user 对象中获取 job 和 department
        //         const job = item.user?.job;
        //         const department = item.user?.department;

        //         // 去重逻辑：只有当数据存在且不在数组中时才添加
        //         if (job && !allJobs.includes(job)) {
        //             allJobs.push(job);
        //         }
        //         if (department && !allDepartments.includes(department)) {
        //             allDepartments.push(department);
        //         }
        //         });

        //         // 输出结果（可根据实际需求赋值给组件数据）
        //         console.log('所有不重复的 job 列表:', allJobs);
        //         console.log('所有不重复的 department 列表:', allDepartments);

        //         // 如果需要将结果保存到组件数据中（示例）
        //         this.filter.org.candidates = allDepartments;
        //         this.filter.job.candidates = allJobs;
        //     });
        // },
        init_info() {
        getUserList(Object.assign({
            orgId: this.filter.org.value,
            jobId: this.filter.job.value,
            status: this.filter.status.value,
            query: this.filter.query.value
        }, this.pagination)).then(result => {
            this.userList = result.data;
            this.pagination = result.pagination;

            // 提取并去重 job 和 department（字符串数组）
            const allJobs = [];
            const allDepartments = [];

            this.userList.forEach(item => {
            const job = item.user?.job;
            const department = item.user?.department;

            if (job && !allJobs.includes(job)) allJobs.push(job);
            if (department && !allDepartments.includes(department)) allDepartments.push(department);
            });

            // 转换为 { value, label } 对象数组（与 el-option 匹配）
            const jobCandidates = allJobs.map(job => ({
            value: job, // 值为 job 本身
            label: job  // 显示文本为 job 本身
            }));

            const departmentCandidates = allDepartments.map(dept => ({
            value: dept, // 值为 department 本身
            label: dept  // 显示文本为 department 本身
            }));

            // 赋值给筛选器
            this.filter.org.candidates = departmentCandidates;
            this.filter.job.candidates = jobCandidates;
            console.log(this.filter.org.candidates);
            console.log(this.filter.job.candidates);

        });
        },
        getOrgs() {
            getOrgList().then(result => {
                this.filter.org.candidates = result.data
            })
        },
        createAccount() {
            this.editAccountData = ''
            this.dialogVisibility.editAccount = true
        },
        editAccount(account) {
            this.editAccountData = account
            this.dialogVisibility.editAccount = true
        },
        resetPassword(account) {
            this.resetPasswordData = account.accountNo
            this.dialogVisibility.resetPassword = true
        },
        toggleActivation(account) {
            editUser({
                accountNo: account.accountNo,
                status: account.status
            }).then(response => {
                this.$message({
                    message: this.$t(`message.account.${account.status === 'activated' ? "activated" : "deactivated"}`, {account: account.accountName}),
                    type: account.status === 'activated' ? 'success' : 'error',
                    showClose: true,
                    duration: 2000
                })
                this.getAccounts(this.pagination.page)
            })
        },
        getAccounts(page, refresh = false) {
            if (refresh) {
                this.pagination.page = 1
            } else {
                this.pagination.page = page
            }
            getUserList(Object.assign({
                orgId: this.filter.org.value,
                jobId: this.filter.job.value,
                status: this.filter.status.value,
                query: this.filter.query.value
            }, this.pagination)).then(result => {
                this.userList = result.data
                this.pagination = result.pagination
                console.log("筛选后的值为：")
                console.log(this.userList)
                // this.userList.forEach(item => {
                //     console.log(item.user.photo); // 打印每个用户的 photo 字段
                // });
            })
        },
    },
    mounted() {

    }
}
</script>
<style scoped>

</style>
