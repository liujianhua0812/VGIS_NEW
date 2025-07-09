<template>
    <div class="tw-label">
        <div>{{ time.format($t("dict.date.full")) }}</div>
        <div class="flex align-items-center">
            {{ weather.city }}
            <el-divider direction="vertical"></el-divider>
            {{ weather.temperature_float }}℃，{{ weather.weather }}
        </div>
    </div>
</template>

<script>

import axios from "axios"

export default {
    data() {
        return {
            time: new Date(),
            loopId: "",
            weather: ""
        }
    },
    methods: {
        updateTime() {
            this.time = new Date()
        },
        getWeather() {
            axios({
                url: "https://restapi.amap.com/v3/ip",
                method: "GET",
                params: {
                    key: this.$store.state.setting.weather
                }
            }).then(result => {
                return axios({
                    url: "https://restapi.amap.com/v3/weather/weatherInfo?parameters",
                    method: "GET",
                    params: {
                        key: this.$store.state.setting.weather,
                        city: result.data.adcode
                    }
                })
            }).then(result => {
                this.weather = result.data.lives[0]
            })
        }
    },
    created() {
        this.getWeather()
        this.loopId = setInterval(this.updateTime, 1000)
    },
    beforeDestroy() {
        clearInterval(this.loopId)
    }
}
</script>

<style scoped lang="scss">
.tw-label {
    color: #FFFFFF;
    font-size: 16px;
}
</style>