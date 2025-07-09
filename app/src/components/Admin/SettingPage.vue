<template>
    <div class="full-h full-w m-l-20">
        <vgis-breadcrumb :navs="navs"></vgis-breadcrumb>
        <el-card shadow="none">
            <el-form label-position="top" style="width: calc(100% - 20px);">
                <h3 class="text-bold">{{$t('form.setting.basic.label')}}</h3>
                <el-form-item :label="$t('form.setting.basic.language.label')">
                    <div class="noc-vgis-binary-selector" style="width: 250px">
                        <el-radio-group v-model="setting.language">
                            <el-radio label="en" v-model="setting.language">English</el-radio>
                            <el-radio label="cn" v-model="setting.language">简体中文</el-radio>
                        </el-radio-group>
                    </div>
                </el-form-item>
                <el-form-item :label="$t('form.setting.basic.siteName.label')">
                    <el-input v-model="setting.siteName" :placeholder="$t('form.setting.basic.siteName.placeholder')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('form.setting.basic.mqtt.label')">
                    <el-input v-model="setting.mqtt.baseUrl" :placeholder="$t('form.setting.basic.mqtt.placeholder')"></el-input>
                </el-form-item>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="MQTT ClientID">
                            <el-input v-model="setting.mqtt.clientId"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="MQTT Username">
                            <el-input v-model="setting.mqtt.username"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="MQTT Password">
                            <el-input type="password" show-password v-model="setting.mqtt.password"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <h3 class="text-bold">{{$t('form.setting.email.label')}}</h3>
                <div class="flex">
                    <div style="flex-grow: 1; max-width: 400px;">
                        <el-form-item :label="$t('form.setting.email.smtp.label')">
                            <el-input v-model="setting.email.host" :placeholder="$t('form.setting.email.smtp.placeholder')"></el-input>
                        </el-form-item>
                    </div>
                    <div class="m-l-15">
                        <el-form-item :label="$t('form.setting.email.port.label')">
                            <el-input v-model="setting.email.port"></el-input>
                        </el-form-item>
                    </div>
                    <div class="m-l-15 m-r-20">
                        <el-form-item  :label="$t('form.setting.email.ssl.label')">
                            <el-switch v-model="setting.email.ssl"></el-switch>
                        </el-form-item>
                    </div>
                </div>
                <el-form-item :label="$t('form.setting.email.user.label')">
                    <el-input v-model="setting.email.user" :placeholder="$t('form.setting.email.user.placeholder')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('form.setting.email.password.label')">
                    <el-input v-model="setting.email.password" :placeholder="$t('form.setting.email.password.placeholder')" show-password></el-input>
                </el-form-item>
                <h3 class="text-bold">{{$t('form.setting.alert.label')}}</h3>
                <el-form-item :label="$t('form.setting.alert.siren.label')">
                    <el-switch v-model="setting.alert.siren"></el-switch>
                </el-form-item>
                <el-form-item :label="$t('form.setting.alert.file.label')" v-if="setting.alert.siren">
                    <el-upload
                            action=""
                            :show-file-list="false"
                            :multiple="false"
                            :auto-upload="false"
                            :before-upload="getAlertFile">
                        <el-button type="primary" size="small">上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item :label="$t('form.setting.alert.interval.label')">
                    <el-input v-model="setting.alert._interval">
                        <el-select style="width: 150px" slot="append" v-model="setting.alert.unit"></el-select>
                    </el-input>
                </el-form-item>
            </el-form>
            <div class="m-t-40">
                <el-button type="primary" size="small" @click="submit">{{$t("action.save")}}</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
    import VgisBreadcrumb from "@/components/Standard/vgis-breadcrumb.vue";
    import Password from "@/components/Admin/System/Password.vue";
    import Data from "@/components/Admin/System/Data.vue";
    import Basic from "@/components/Admin/System/Basic.vue";
    import {getSetting, updateSetting} from "@/assets/js/api/system";

    export default {
        components: {Basic, Data, Password, VgisBreadcrumb},
        data () {
            return {
                navs: [{
                    name: this.$t('menu.home'),
                    url: '/admin'
                }, {
                    name: this.$t('menu.setting')
                }],
                model: "",
                setting: {
                    language: "",
                    siteName: "",
                    mqtt: {
                        baseUrl: "",
                        clientId: "",
                        username: "",
                        password: ""
                    },
                    weather: "",
                    cctv: "",
                    email: {
                        smtp: "",
                        port: "",
                        ssl: false,
                        user: "",
                        password: ""
                    },
                    alert: {
                        siren: false,
                        resource: "",
                        interval: "",
                        _interval: "",
                        unit: ""
                    }
                },
            }
        },
        methods: {
            getModel (file) {
                if (file.type !== 'application/x-zip-compressed') {
                    this.$message({
                        message: this.$t("form.setting.gis.model.errors.wrongType"),
                        type: "error",
                        showClose: true,
                        duration: 3000
                    })
                }
                this.model = file
                return false
            },
            getSetting () {
                getSetting().then(result => {
                    delete result.data.gis
                    this.setting = Object.assign(this.setting, result.data)
                })
            },
            getAlertFile (file) {
                return false
            },
            submit() {
                // console.log(this.setting)
                updateSetting({
                    setting: this.setting,
                    model: this.model
                }).then(result => {
                    this.getSetting()
                    this.$store.commit("updateSetting", {
                        setting: result.data,
                        instance: this
                    })
                    this.$message({
                        type: 'success',
                        message: this.$t("message.setting.updated")
                    })
                })
            }
        },
        created() {
            this.getSetting()
        }
    }
</script>

<style scoped lang="scss">
.noc-vgis-binary-selector {
    border: 1px solid #4FACFF;
    box-sizing: border-box;
    border-radius: 4px;
    text-align: center;
}

h3 {
    background: rgba(79, 172, 255, 0.5);
    padding: 5px 10px;
    color: #FFFFFF;
    border-radius: 3px;
}
</style>