<template>
    <header class="flex align-items-center justify-content-between vgis-header">
        <router-link to="/admin" class="no-decoration title">{{siteName}}</router-link>
        <div class="flex align-items-center">
<!--            <latest-alert class="m-r-40"></latest-alert>-->
<!--            <calendar-weather-label class="m-r-40"></calendar-weather-label>-->
            <el-image class="avatar" :src="DefaultAvatar"></el-image>
            <div class="profile">
                <div class="user">{{ $store.state.user.accountName }}</div>
                <div class="flex align-items-center">
                    <div class="action-entry icon el-icon-setting pointer" @click="openSetting">
                        {{ $t("label.basic.password") }}
                    </div>
                    <el-divider direction="vertical"></el-divider>
                    <div class="action-entry icon iconfont icon-log-out pointer" @click="signOut">
                        {{ $t("label.basic.signOut") }}
                    </div>
                </div>
            </div>
        </div>
        <setting v-if="dialogVisibility.setting" dialog-id="setting" :dialog-visibility="dialogVisibility.setting"
                 @action-finished="actionFinished"></setting>
    </header>
</template>

<script>

import DefaultAvatar from "@/assets/images/user.png"
import LatestAlert from "@/components/Standard/LatestAlert.vue";
import CalendarWeatherLabel from "@/components/Standard/CalendarWeatherLabel.vue";
import Setting from "../System/Setting";
import config from "../../../config";
import {signOut, getUserInfo} from "@/assets/js/api/sso";

export default {
    name: "Header",
    components: {
        Setting,
        LatestAlert,
        CalendarWeatherLabel
    },
    computed: {
        siteName () {
            return this.$store.state.setting.siteName || config.name
        }
    },
    data() {
        return {
            dialogVisibility: {
                setting: false
            },
            DefaultAvatar
        }
    },
    methods: {
        actionFinished(dialogId) {
            this.dialogVisibility[dialogId] = false
        },
        openSetting() {
            this.dialogVisibility.setting = true
        },
        signOut() {
            this.$confirm(this.$t("message.shared.signOut")).then(() => {
                signOut().then(result => {
                    this.$message({
                        type: 'success',
                        message: this.$t("message.shared.signedOut"),
                        showClose: true,
                        duration: 3000
                    })
                    if (result.data.internal) {
                        this.$router.replace({name: 'SignInPage'})
                    } else {
                        window.location.href = `${config.sso.host}/logout?service=${encodeURIComponent(config.sso.callback)}`
                    }
                })
            }).catch(() => {
            })
        }
    }
}
</script>

<style lang="scss" scoped>
header {
    padding: 15px;
}

.title {
    font-family: 'HarmonyOS Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 30px;
    /*color: #4facff;*/
    color: white;
}

.vgis-header {
    /*background-color: white;*/
    background-color: #4FACFF;
    position: sticky;
    z-index: 2;
}

.avatar {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    margin-right: 10px;
}

.profile {
    .user {
        color: #FFFFFF;
        font-size: 18px;
        line-height: 18px;
        font-family: 'HarmonyOS Sans';
        font-weight: 600;
        margin-bottom: 5px;
    }

    .action-entry {
        font-family: 'HarmonyOS Sans';
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 19px;
        color: #FFF;
    }
}
</style>
