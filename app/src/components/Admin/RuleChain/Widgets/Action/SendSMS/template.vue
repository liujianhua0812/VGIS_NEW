<template>
    <div class="flex align-items-center flex-column">
        <h3 class="text-bold" :style="{ color }">{{label}}</h3>
        <div class="test-result" v-if="testResult && testing">
            <div class="text-danger" v-if="testResult.error">{{testResult.error}}</div>
            <div v-else>{{$t('message.sent')}}</div>
        </div>
        <el-button v-show="!testing" size="mini" type="primary" @click="editConfig">{{$t("action.configure")}}</el-button>
        <el-dialog width="1000px" append-to-body :title="$t('form.title.editRule')" :visible.sync="dVisibility" @close="close">
            <el-form label-position="top">
                <el-row :gutter="40">
                    <el-col :span="8">
                        <el-form-item size="small" :label="$t('form.accessKeyId.label')">
                            <el-input v-model="nodeConfig.accessKeyId" :placeholder="$t('form.accessKeyId.placeholder')"></el-input>
                        </el-form-item>
                        <el-form-item size="small" :label="$t('form.accessKeySecret.label')">
                            <el-input v-model="nodeConfig.accessKeySecret" :placeholder="$t('form.accessKeySecret.placeholder')"></el-input>
                        </el-form-item>
                        <el-form-item size="small" :label="$t('form.SignName.label')">
                            <el-input v-model="nodeConfig.SignName" :placeholder="$t('form.SignName.placeholder')"></el-input>
                        </el-form-item>
                        <el-form-item size="small" :label="$t('form.TemplateCode.label')">
                            <el-input v-model="nodeConfig.TemplateCode" :placeholder="$t('form.TemplateCode.placeholder')"></el-input>
                        </el-form-item>
                        <el-form-item size="small" :label="$t('form.params.label')">
                            <el-input v-model="nodeConfig.params" type="textarea" rows="4" :placeholder="$t('form.params.placeholder')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-form-item size="small" :label="$t('form.candidates.label')">
                                    <el-input class="filter" v-model="filter.query.value" clearable @clear="getAccounts(1, true)" @keyup.native.enter="getAccounts(1, true)">
                                        <template slot="append">
                                            <el-button type="primary" icon="el-icon-search" @click="getAccounts(1, true)"></el-button>
                                        </template>
                                    </el-input>
                                    <el-row :gutter="10">
                                        <el-col :span="12">
                                            <div class="filter-label">{{$t("model.account.job")}}</div>
                                            <el-select multiple style="width: 100%;" v-model="filter.job.value" clearable @change="getAccounts(1, true)">
                                                <el-option v-for="job in filter.job.candidates" :key="job.prId" :value="job.prId" :label="job.prName"></el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="12">
                                            <div class="filter-label">{{$t("model.account.department")}}</div>
                                            <el-select multiple style="width: 100%;" v-model="filter.org.value" clearable @change="getAccounts(1, true)">
                                                <el-option v-for="org in filter.org.candidates" :key="org.prId" :value="org.prId" :label="org.prName"></el-option>
                                            </el-select>
                                        </el-col>
                                    </el-row>
                                    <el-divider direction="horizontal" class="m-t-10 m-b-0"></el-divider>
                                    <el-table header-cell-class-name="table-header-cell" cell-class-name="table-cell" :show-header="false" :data="userList">
                                        <el-table-column>
                                            <template slot-scope="{ row }">
                                                <div class="pointer" @click="selectUser(row)">
                                                    <div>
                                                        <b>{{$t('model.account.name')}}：</b>
                                                        {{row.accountName}}
                                                    </div>
                                                    <div>
                                                        <b>{{$t('model.account.job')}}：</b>
                                                        {{row.user.user_jobs.filter(item => item.job).map(item => item.job.prName).join('/') || $t("label.basic.none")}}
                                                    </div>
                                                    <div>
                                                        <b>{{$t('model.account.department')}}：</b>
                                                        {{ row.user.user_jobs.filter(item => item.org).map(item => item.org.prName).join('/') || $t("label.basic.none")}}
                                                    </div>
                                                </div>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <el-row class="m-t-25 m-b-25 text-center">
                                        <el-pagination hide-on-single-page :current-page="pagination.page" :page-count="pagination.total_page" @current-change="getAccounts"></el-pagination>
                                    </el-row>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item size="small" :label="$t('form.users.label')">
                                    <el-table header-cell-class-name="table-header-cell" cell-class-name="table-cell" :show-header="false" :data="selectedUsers">
                                        <el-table-column>
                                            <template slot-scope="{ row, $index }">
                                                <div class="pointer" @click="removeUser($index)">
                                                    <div>
                                                        <b>{{$t('model.account.name')}}：</b>
                                                        {{row.accountName}}
                                                    </div>
                                                    <div>
                                                        <b>{{$t('model.account.job')}}：</b>
                                                        {{row.user.user_jobs.filter(item => item.job).map(item => item.job.prName).join('/') || $t("label.basic.none")}}
                                                    </div>
                                                    <div>
                                                        <b>{{$t('model.account.department')}}：</b>
                                                        {{ row.user.user_jobs.filter(item => item.org).map(item => item.org.prName).join('/') || $t("label.basic.none")}}
                                                    </div>
                                                </div>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-form>
            <div class="text-center m-t-10">
                <el-button type="primary" @click="close">{{$t('action.save')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import {
    getUserList,
    editUser,
    getJobList, getOrgList
} from "@/assets/js/api/accounts";
import config from "@/config"
import WidgetTemplate from "../../template.vue"
import FilterIcon from "@/components/Icons/FilterIcon.vue";

export default {
    name: "SendSMS",
    components: {FilterIcon},
    extends: WidgetTemplate,
    computed: {
        language () {
            return this.$store.state.setting.language || "en"
        }
    },
    data() {
        return {
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
                        { value: "activated", label: this.$t("dict.status.activated") },
                        { value: "deactivated", label: this.$t("dict.status.deactivated") },
                        { value: "deleted", label: this.$t("dict.status.deleted") },
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
            userList: [],
            nodeConfig: {
                accessKeyId: '',
                accessKeySecret: '',
                SignName: '',
                TemplateCode: '',
                params: '',
                users: []
            },
            selectedUsers: []
        }
    },
    i18n: {
        messages: {
            en: {
                message: {
                    sent: "Email sent, please check mailbox!"
                },
                form: {
                    accessKeyId: {
                        label: "Aliyun accessKeyId",
                        placeholder: "Please input accessKeyId."
                    },
                    accessKeySecret: {
                        label: "Aliyun accessKeySecret",
                        placeholder: "Please input accessKeySecret."
                    },
                    SignName: {
                        label: "Signature Name",
                        placeholder: "Please input aliyun sms signature name."
                    },
                    TemplateCode: {
                        label: "Template Code",
                        placeholder: "Please input aliyun sms template code."
                    },
                    params: {
                        label: "SMS Params",
                        placeholder: "Please specify the params of your sms."
                    },
                    users: {
                        label: "Target Users",
                        placeholder: "Please select target users."
                    },
                    candidates: {
                        label: "Candidates"
                    }
                }
            },
            cn: {
                message: {
                    sent: "邮件已发出，请检查邮箱！"
                },
                form: {
                    accessKeyId: {
                        label: "阿里云accessKeyId",
                        placeholder: "请输入accessKeyId。"
                    },
                    accessKeySecret: {
                        label: "阿里云accessKeySecret",
                        placeholder: "请输入accessKeySecret。"
                    },
                    SignName: {
                        label: "短信签名",
                        placeholder: "请输入阿里云短信签名。"
                    },
                    TemplateCode: {
                        label: "模板编号",
                        placeholder: "请输入短信通知的阿里云模板编号。"
                    },
                    params: {
                        label: "短信参数",
                        placeholder: "请设置短信参数。"
                    },
                    users: {
                        label: "目标用户",
                        placeholder: "请选择群发短信的接受用户。"
                    },
                    candidates: {
                        label: "候选用户"
                    }
                }
            }
        },
    },
    methods: {
        selectUser (user) {
            if (!this.nodeConfig.users.includes(user.accountNo)) {
                this.selectedUsers = [user].concat(this.selectedUsers)
                this.updateUserIds()
            }
        },
        removeUser (index) {
            this.selectedUsers.splice(index, 1)
            this.updateUserIds()
        },
        updateUserIds () {
            this.nodeConfig.users = this.selectedUsers.map(item => item.accountNo)
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
                status: "activated",
                query: this.filter.query.value,
                validPhoneOnly: true
            }, this.pagination)).then(result => {
                this.userList = result.data
                this.pagination = result.pagination
            })
        },
    },
    created() {
        this.getAccounts();
        this.getJobs();
        this.getOrgs();
    }
}
</script>