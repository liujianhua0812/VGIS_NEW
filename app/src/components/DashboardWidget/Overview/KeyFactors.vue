<template>
    <vgis-card title="关键供应指标">
        <div class="mini-card p-t-12 p-b-12 p-l-16 p-r-16">
            <div style="flex-grow: 1;">
                <div class="group-index">车间露点温度</div>
                <div class="flex align-items-center justify-content-between">
                    <div class="index" v-for="item in temperatures">
                        <div class="label">{{item.name}}</div>
                        <div class="value">
                            {{item.value}}
                            <small class="unit">{{item.unit}}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-row :gutter="24">
            <el-col :span="24" class="m-t-12">
                <div class="factor-card p-12">
                    <div :class="['full-w flex align-items-center justify-content-between', { 'm-b-5' : index < factorTableData.length - 1}]" v-for="(item,index) in factorTableData">
                        <div class="label m-0">{{item.name}}</div>
                        <div class="value">
                            {{item.value || "—"}}
                            <small class="unit">{{item.unit || ""}}</small>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import {getMultipleSeriesLatestValues, getNodesByModel, getSeriesLatestValues} from "@/assets/js/api/hierarchy";
import {toFixedValue} from "@/utils/Statistics";

export default {
    name: "KeyFactors",
    components: {
        VgisCard
    },
    computed: {
        factorTableData () {
            let result = []
            for(let i = 0; i < this.nitrogen.length; i++) {
                let item = this.nitrogen[i]
                if (this.nitrogenData[item.instanceId] && this.nitrogenData[item.instanceId][0] && this.nitrogenData[item.instanceId][0].value) {
                    if (!isNaN(toFixedValue(this.nitrogenData[item.instanceId][0].value))) {
                        result.push({
                            name: `${this.others[0].name} - ${item.name}（${item.instanceId}）`,
                            value: this.nitrogenData[item.instanceId][0].value,
                            unit: this.others[0].unit
                        })
                    }
                }
            }
            for(let i = 0; i < this.purity.length; i++) {
                let item = this.purity[i]
                if (this.purityData[item.instanceId] && this.purityData[item.instanceId][0] && this.purityData[item.instanceId][0].value) {
                    if (!isNaN(toFixedValue(this.purityData[item.instanceId][0].value))) {
                        result.push({
                            name: `${this.others[1].name} - ${item.name}（${item.instanceId}）`,
                            value: this.purityData[item.instanceId][0].value,
                            unit: this.others[1].unit
                        })
                    }
                }
            }
            for(let i = 0; i < this.furnace.length; i++) {
                let item = this.furnace[i]
                if (this.furnaceData[item.instanceId] && this.furnaceData[item.instanceId][0] && this.furnaceData[item.instanceId][0].value) {
                    if (!isNaN(toFixedValue(this.furnaceData[item.instanceId][0].value))) {
                        result.push({
                            name: `${this.others[2].name} - ${item.name}（${item.instanceId}）`,
                            value: this.furnaceData[item.instanceId][0].value,
                            unit: this.others[2].unit
                        })
                    }
                }
            }
            for(let i = 0; i < this.freezingSystem.length; i++) {
                let item = this.freezingSystem[i]
                if (this.freezingData[item.instanceId] && this.freezingData[item.instanceId][0] && this.freezingData[item.instanceId][0].value) {
                    if (!isNaN(toFixedValue(this.freezingData[item.instanceId][0].value))) {
                        result.push({
                            name: `${this.others[3].name} - ${item.name}（${item.instanceId}）`,
                            value: this.freezingData[item.instanceId][0].value,
                            unit: this.others[3].unit
                        })
                    }
                }
            }
            for(let i = 0; i < this.compressor.length; i++) {
                let item = this.compressor[i]
                if (this.compressorData[item.instanceId] && this.compressorData[item.instanceId][0] && this.compressorData[item.instanceId][0].value) {
                    if (!isNaN(toFixedValue(this.compressorData[item.instanceId][0].value))) {
                        result.push({
                            name: `${this.others[4].name} - ${item.name}（${item.instanceId}）`,
                            value: this.compressorData[item.instanceId][0].value,
                            unit: this.others[4].unit
                        })
                    }
                }
            }
            return result
        }
    },
    data () {
        return {
            temperatures: [{
                name: "负极化成",
                value: -41,
                unit: "℃"
            }, {
                name: "一次注液",
                value: -40,
                unit: "℃"
            }, {
                name: "二次注液",
                value: -43,
                unit: "℃"
            }],
            others: [{
                name: "氮气纯度",
                value: 5,
                unit: "%"
            }, {
                name: "纯水电导率",
                value: 45,
                unit: "us/cm"
            }, {
                name: "蒸汽锅炉温度",
                value: 58,
                unit: "℃"
            }, {
                name: "冷冻水供水温度",
                value: 0,
                unit: "℃"
            }, {
                name: "空气机压力",
                value: 35,
                unit: "mPa"
            }],
            nitrogen: [],
            purity: [],
            freezingSystem: [],
            furnace: [],
            compressor: [],
            nitrogenData: {},
            purityData: {},
            furnaceData: {},
            compressorData: {},
            freezingData: {}
        }
    },
    methods: {
      getKeyDevices () {
          Promise.all([
            getNodesByModel("NitrogenGenerator"),
            getNodesByModel("WaterFilter"),
            getNodesByModel("FreezingSystem"),
            getNodesByModel("Boiler"),
            getNodesByModel("AirCompressor"),
          ]).then(([nitrogen, purity, system, furnace, compressor]) => {
            [this.nitrogen, this.purity, this.freezingSystem, this.furnace, this.compressor] = [nitrogen.data, purity.data, system.data, furnace.data, compressor.data]
            this.getKeyDevicesData()
          })
        },
        getKeyDevicesData () {
            getMultipleSeriesLatestValues(this.nitrogen.map(item => encodeURIComponent(item.instanceId)), ["氮气纯度"]).then(result => {
                this.nitrogenData = result.data
            })
            getMultipleSeriesLatestValues(this.purity.map(item => encodeURIComponent(item.instanceId)), ["电导率"]).then(result => {
                this.purityData = result.data
            })
            getMultipleSeriesLatestValues(this.freezingSystem.map(item => encodeURIComponent(item.instanceId)), ["总管供水温度"]).then(result => {
                this.freezingData = result.data
            })
            getMultipleSeriesLatestValues(this.furnace.map(item => encodeURIComponent(item.instanceId)), ["出口温度"]).then(result => {
                this.furnaceData = result.data
            })
            getMultipleSeriesLatestValues(this.compressor.map(item => encodeURIComponent(item.instanceId)), ["排气压力"]).then(result => {
                this.compressorData = result.data
            })
        },
        refreshData () {
            getSeriesLatestValues("总场站", this.temperatures.map(item => `${item.name}车间露点温度`)).then(result => {
              let dataMap = result.data.reduce((res, item) => {
                if (item.value) {
                  res[item.name] = item
                }
                return res
              }, {})
              for(let i = 0; i <this.temperatures.length; i++) {
                if (dataMap[`${this.temperatures[i].name}车间露点温度`]) {
                  this.temperatures[i].value = dataMap[`${this.temperatures[i].name}车间露点温度`].value || ""
                }
              }
            })
        }
    },
    created() {
        this.refreshData()
        this.getKeyDevices()
    }
}
</script>

<style scoped>

    .mini-card {
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.20);
        display: flex;
        align-items: center;
    }

    .factor-card {
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.20);
    }

    .group-index {
        color: #FFFFFF;
        font-family: "HarmonyOS Sans SC";
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        margin-bottom: 12px;
    }

    .index {
        font-family: "HarmonyOS Sans SC";
        color: #FFFFFF;
        font-style: normal;
        line-height: normal;

        .label {
            margin-bottom: 6px;
            color: rgba(255, 255, 255, 0.80);
            font-size: 14px;
            font-weight: 400;
        }
        .value {
            font-size: 20px;
            font-weight: 500;

            .unit {
                color: rgba(199, 199, 199, 0.70);
                font-size: 14px;
                line-height: 22px;
                font-weight: 400;
                margin-left: 9px;
            }
        }
    }
</style>