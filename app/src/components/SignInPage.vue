<template>
    <div class="full"
         :style="`background: url('${SignInBackground}') no-repeat;background-size:cover;background-position:center;`">
        <el-row class="full-h">
            <el-col :xl="{span: 6, offset: 18}" :lg="{span: 8, offset: 16}" :md="{span: 10, offset: 14}"
                    :sm="{span: 12, offset: 12}" :xs="{span: 24, offset: 0}" class="full-h bg-white">
                <div class="full flex align-items-center justify-content-center">
                    <div style="margin-left: 40px; margin-right: 40px; width: calc(100% - 80px)">
                        <el-image class="full-w m-b-20" :src="Logo"></el-image>
                        <div class="sign-in-title">{{ $t("message.shared.signIn") }}</div>
                        <el-form class="sign-in-form m-t-50" @submit.prevent.native>
                            <el-form-item prop="username">
                                <template slot="label">
                                    <label class="sign-in-label">{{ $t("form.signIn.account.label") }}</label>
                                </template>
                                <el-input v-model="account.username"
                                          :placeholder="$t('form.signIn.account.placeholder')"
                                          @keyup.enter.native="submit"></el-input>
                            </el-form-item>
                            <el-form-item class="m-t-40" prop="username">
                                <template slot="label">
                                    <label class="sign-in-label">{{ $t("form.signIn.password.label") }}</label>
                                </template>
                                <el-input show-password type="password" v-model="account.password"
                                          :placeholder="$t('form.signIn.password.placeholder')"
                                          @keyup.enter.native="submit"></el-input>
                            </el-form-item>
                        </el-form>
                        <button class="sign-in-action m-t-50" @click="submit">{{ $t("action.signIn") }}</button>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>

import Logo from "@/assets/images/Logo.png"
import config from "@/config"
import {getSessionStatus, signIn} from "@/assets/js/api/sso";
import SignInBackground from '@/assets/images/sign-in-bg.png'

export default {
    name: "SignInPage",
    data() {
        return {
            Logo,
            appName: config.name,
            SignInBackground,
            account: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        submit() {
            signIn(this.account).then(result => {
                if (result.code === 200) {
<<<<<<< HEAD
=======
                    console.log("用户名密码校验成功")
>>>>>>> 0a8b8ff0dfa56693c26e9f35d94bb46da1f463c4
                    getSessionStatus().then(result => {
                        this.$store.commit('updateUserState', result.data)
                        let defaultEntry = result.data.role ? result.data.role.defaultEntry : null
                        this.$router.replace(defaultEntry || {name: 'Overview'})
                    })
                } else {
<<<<<<< HEAD
=======
                    console.log(result.msg)
>>>>>>> 0a8b8ff0dfa56693c26e9f35d94bb46da1f463c4
                    this.$message({
                        type: 'error',
                        message: result.msg,
                        showClose: true,
                        duration: 3000
                    })
                }
            })
        }
    },
    beforeCreate() {
        getSessionStatus().then(result => {
            if (result.data) {
                this.$store.commit('updateUserState', result.data)
                let defaultEntry = result.data.role ? result.data.role.defaultEntry : null
                this.$router.replace(defaultEntry || {name: 'AdminHome'})
            }
        })
    }
}
</script>

<style lang="scss">
.sign-in-title {
  font-size: 32px;
  font-family: Boston-Bold, Boston;
  font-weight: bold;
  color: #000000;
  line-height: 42px;
}

.sign-in-action {
  width: 100%;
  height: 60px;
  background: #254592;
  border-radius: 8px;
  font-size: 20px;
  font-family: Boston-SemiBold, Boston;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 31px;
  cursor: pointer;
}

.sign-in-label {
  font-size: 16px;
  font-family: Boston-Bold, Boston;
  font-weight: bold;
  color: #000000;
  line-height: 21px;
}

.sign-in-form .el-input__inner {
  color: #333;
  font-family: Boston-Regular, Boston;
}

.sign-in-form .el-input__inner::-webkit-input-placeholder {
  font-family: Boston-Regular, Boston;
}

.sign-in-form {
  .el-input__inner::selection {
    color: #333;
    background: #409EFF
  }
}
</style>
