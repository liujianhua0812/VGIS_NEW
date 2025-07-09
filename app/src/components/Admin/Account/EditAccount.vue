<template>
    <el-dialog width="438px" v-auth="{ resources: 'Privilege', action: 'Admin' }" :title="title"
               :visible.sync="dialogVisibility" @close="close">
        <el-form :model="accountData" ref="accountForm" label-position="top" :rules="rules">
            <el-form-item :label="$t('form.account.realName.label')" prop="realName">
                <el-input v-model="accountData.realName" autocomplete="off"
                          :placeholder="$t('form.account.realName.placeholder')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('form.account.gender.label')" prop="gender">
                <el-radio-group v-model="accountData.gender">
                    <el-radio label="男"></el-radio>
                    <el-radio label="女"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('form.account.username.label')" prop="accountName">
                <el-input v-model="accountData.accountName" autocomplete="off"
                          :placeholder="$t('form.account.username.placeholder')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('form.account.email.label')" prop="email">
                <el-input v-model="accountData.email" autocomplete="off"
                          :placeholder="$t('form.account.email.placeholder')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('form.account.phone.label')" prop="phone">
                <el-input v-model="accountData.phone" autocomplete="off"
                          :placeholder="$t('form.account.phone.placeholder')"></el-input>
            </el-form-item>
            <el-form-item v-if="!formData" :label="$t('form.account.password.label')" prop="password"
                          :label-width="formLabelWidth">
                <el-input v-model="accountData.password" :placeholder="$t('form.account.password.placeholder')"
                          type="password">
                </el-input>
            </el-form-item>
            <el-form-item v-if="!formData" :label="$t('form.account.confirmPassword.label')" prop="confirmPassword"
                          :label-width="formLabelWidth">
                <el-input v-model="accountData.confirmPassword"
                          :placeholder="$t('form.account.confirmPassword.placeholder')" type="password">
                </el-input>
            </el-form-item>
            <el-form-item :label="$t('form.account.role.label')" :label-width="formLabelWidth" prop="roleId">
                <el-select v-model="accountData.roleId" :placeholder="$t('form.account.role.placeholder')"
                           class="full-w"
                           :disabled="accountData.isSuper" clearable>
                    <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">{{ $t("action.cancel") }}</el-button>
            <el-button type="primary" @click="submit">{{ $t("action.submit") }}</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {getRole} from "../../../assets/js/api/privilege";
import {addUser, editUser} from "../../../assets/js/api/accounts";

export default {
    name: "AddEditAccount",
    props: {
        dialogId: String,
        dialogVisibility: Boolean,
        formData: Object
    },
    computed: {
        title() {
            return !this.accountData.accountNo ? this.$t('form.title.addAccount') : this.$t('form.title.editAccount')
        },
        rules() {
            let that = this
            return {
                realName: [
                    {required: true, trigger: ['change', 'blur'], message: this.$t('form.account.realName.error.empty')}
                ],
                accountName: [
                    {
                        required: true,
                        trigger: ['change', 'blur'],
                        message: this.$t('form.account.username.error.empty')
                    },
                    {
                        type: 'string',
                        min: 6,
                        trigger: ['change', 'blur'],
                        message: this.$t('form.account.username.error.short')
                    },
                    {
                        type: 'string',
                        max: 32,
                        trigger: ['change', 'blur'],
                        message: this.$t('form.account.username.error.long')
                    }
                ],
                email: [
                    {
                        pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                        message: this.$t('form.account.email.error.invalid'),
                        trigger: ["change", "blur"]
                    },
                ],
                phone: [
                    {
                        pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
                        message: this.$t('form.account.phone.error.invalid'),
                        trigger: ["change", "blur"]
                    },
                ],
                password: [
                    {required: true, trigger: ['change', 'blur'], message: this.$t('form.account.password.error.long')},
                    {
                        type: 'string',
                        min: 6,
                        trigger: ['change', 'blur'],
                        message: this.$t('form.account.password.error.long')
                    },
                    {
                        type: 'string',
                        max: 32,
                        trigger: ['change', 'blur'],
                        message: this.$t('form.account.password.error.long')
                    }
                ],
                confirmPassword: [
                    {
                        required: true,
                        trigger: ['change', 'blur'],
                        message: this.$t('form.account.confirmPassword.error.empty')
                    },
                    {
                        validator(rule, value, callback) {
                            if (value === that.accountData.password) {
                                return callback()
                            } else {
                                return callback(new Error(this.$t('form.account.confirmPassword.error.mismatch')))
                            }
                        },
                        trigger: ['change', 'blur']
                    }
                ],
                roleId: this.accountData.isSuper ? [] : [
                    {required: true, trigger: ['change', 'blur'], message: this.$t('form.account.role.error.empty')}
                ]
            }
        }
    },
    watch: {
        formData: {
            handler(newValue) {
                this.flushData(newValue)
            },
            deep: true
        }
    },
    data() {
        return {
            formLabelWidth: "140px",
            accountData: {},
            roles: []
        }
    },
    methods: {
        close() {
            this.$emit('action-finished', this.dialogId, false)
        },
        flushData(formData) {
            console.log(formData)
            if (formData) {
                this.accountData = {
                    realName: formData.user.realName,
                    gender: formData.user.gender,
                    accountNo: formData.accountNo,
                    accountName: formData.accountName,
                    email: formData.user.email,
                    phone: formData.user.phone,
                    isSuper: formData.isSuper,
                    roleId: formData.roleId
                }
            } else {
                this.accountData = {
                    realName: '',
                    gender: '',
                    accountName: '',
                    email: "",
                    phone: "",
                    isSuper: false,
                    roleId: ''
                }
            }
        },
        getRoles() {
            getRole().then(result => {
                this.roles = result.data
            })
        },
        submit() {
            this.$refs.accountForm.validate(valid => {
                if (valid) {
                    if (this.formData) {
                        editUser(this.accountData).then(response => {
                            this.$message({
                                message: this.$t('message.account.updated'),
                                type: 'success',
                                showClose: true,
                                duration: 2000
                            })
                            this.$emit('action-finished', this.dialogId, true)
                        })
                    } else {
                        addUser(this.accountData).then(response => {
                            this.$message({
                                message: this.$t('message.account.created'),
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
        this.getRoles()
        this.flushData(this.formData)
    }
}
</script>

<style scoped>

</style>
