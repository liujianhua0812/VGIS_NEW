<template>
    <div class="flex align-items-center flex-column">
        <h3 class="text-bold" :style="{ color }">{{label}}</h3>
        <div v-if="testing && testResult">
            <div class="text-danger" v-if="testResult.error">{{testResult.error}}</div>
            <div class="text-success" v-else>{{$t('message.SQLSuccess')}}</div>
        </div>
        <el-button v-show="!testing" size="mini" type="primary" @click="editConfig">{{$t("action.configure")}}</el-button>
        <el-dialog width="600px" append-to-body :title="$t('form.title.editRule')" :visible.sync="dVisibility" @close="close">
            <el-form label-position="top">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item class="m-b-0" :label="$t('form.dialect.label')">
                            <el-select class="full-w" v-model="nodeConfig.dialect" :placeholder="$t('form.dialect.placeholder')">
                                <el-option v-for="dbms in dialects" :key="dbms.name" :value="dbms.dialect" :label="dbms.name"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item class="m-b-0" :label="$t('form.dbname.label')">
                            <el-input v-model="nodeConfig.dbname" :placeholder="$t('form.dbname.placeholder')"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item class="m-b-0" :label="$t('form.username.label')">
                            <el-input v-model="nodeConfig.username" :placeholder="$t('form.username.placeholder')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item class="m-b-0" :label="$t('form.password.label')">
                            <el-input type="password" show-password v-model="nodeConfig.password" :placeholder="$t('form.password.placeholder')"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="24">
                        <el-form-item class="m-b-0" :label="$t('form.config.label')">
                            <el-table header-cell-class-name="table-header-cell" cell-class-name="table-cell" :data="nodeConfig.config">
                                <el-table-column :label="$t('form.config.name.label')">
                                    <template slot-scope="{ row }">
                                        <el-input size="mini" v-model="row.name"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="$t('form.config.value.label')">
                                    <template slot-scope="{ row }">
                                        <el-input size="mini" v-model="row.value"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="$t('label.basic.action')" width="100px" align="center">
                                    <template slot-scope="{ row, $index }">
                                        <el-button type="danger" size="mini" @click="removeConfig($index)">{{$t("action.delete")}}</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-button class="full-w m-t-0" size="mini" type="primary" @click="addConfig">{{$t("action.add")}}</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="24">
                        <el-form-item class="m-b-0" :label="$t('form.sql.label')">
                            <codemirror :options="{ mode: 'sql', theme: 'base16-light', lineNumbers: true, inputStyle: 'textarea' }" v-model="nodeConfig.sql"></codemirror>
                        </el-form-item>
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

import WidgetTemplate from "../../template.vue"

export default {
    name: "SaveSQLTemplate",
    extends: WidgetTemplate,
    data() {
        return {
            nodeConfig: {
                dialect: "",
                username: "",
                password: "",
                dbname: "",
                config: [{ name: "", value: "" }],
                sql: "",
            },
            dialects: [
                { name: "SQLite", dialect: "sqlite" },
                { name: "MySQL", dialect: "mysql" },
                { name: "MariaDB", dialect: "mariadb" },
                { name: "PostgreSQL", dialect: "postgres" },
                { name: "Redshift", dialect: "postgres" },
                { name: "Microsoft SQL Server", dialect: "mssql" },
                { name: "Oracle", dialect: "oracle" },
            ]
        }
    },
    i18n: {
        messages: {
            en: {
                message: {
                    SQLSuccess: "SQL executed successfully!"
                },
                form: {
                    dialect: {
                        label: "DBMS",
                        placeholder: "Please select the DBMS of your target database."
                    },
                    username: {
                        label: "Username",
                        placeholder: "Please specify the username of your connection."
                    },
                    password: {
                        label: "Password",
                        placeholder: "Please specify the password of your connection."
                    },
                    dbname: {
                        label: "DB Name",
                        placeholder: "Please specify name/path or your database."
                    },
                    config: {
                        label: "Advanced Config",
                        name: {
                            label: "Name"
                        },
                        value: {
                            label: "Value"
                        }
                    },
                    sql: {
                        label: "SQL",
                        placeholder: "Please specify your SQL command."
                    }
                }
            },
            cn: {
                message: {
                    SQLSuccess: "SQL指令成功执行！"
                },
                form: {
                    dialect: {
                        label: "数据库系统",
                        placeholder: "请选择目标数据库的数据库系统。"
                    },
                    username: {
                        label: "用户名",
                        placeholder: "请设置连接用户名。"
                    },
                    password: {
                        label: "密码",
                        placeholder: "请设置连接密码。"
                    },
                    dbname: {
                        label: "数据库名称",
                        placeholder: "请输入目标数据库的名称（或路径）。"
                    },
                    config: {
                        label: "连接参数",
                        name: {
                            label: "参数名"
                        },
                        value: {
                            label: "参数值"
                        }
                    },
                    sql: {
                        label: "SQL指令",
                        placeholder: "请输入SQL指令。"
                    }
                }
            }
        }
    },
    methods: {
        addConfig () {
            this.nodeConfig.config = this.nodeConfig.config.concat([{ name: "", value: "" }])
        },
        removeConfig (index) {
            this.nodeConfig.config.splice(index, 1)
        }
    },
    created() {
    }
}
</script>

<style lang="scss" scoped>
    ::v-deep .el-form-item__label {
        padding-bottom: 0;
    }

    ::v-deep .table-header-cell {
        background: #EEEEEE !important;
        padding: 0;
    }

    ::v-deep .table-cell {
        background: #FAFAFA !important;
    }
</style>
