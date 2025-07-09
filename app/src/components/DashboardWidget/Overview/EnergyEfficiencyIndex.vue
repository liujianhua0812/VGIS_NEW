<template>
    <vgis-card title="综合能效指标">
        <el-row :gutter="24" class="m-t-10">
            <el-col :span="12" v-for="item in indexes">
                <div class="index-name">{{item.name}}</div>
                <v-chart :option="getChartOption(item)" autoresize style="height: 200px;"></v-chart>
                <div class="text-center">
                    <el-select class="custom-selector" style="width: 50%;" size="mini" :default-first-option="true" v-model="item.selectedStation" @change="getData">
                        <el-option v-for="station in item.stations" :key="station.id" :value="station.id" :label="station.name"></el-option>
                    </el-select>
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
    name: "EnergyEfficiencyIndices",
    components: {
        VgisCard
    },
    data () {
        return {
            indexes: [{
                name: "冷站（ASHREA标准）",
                value: 0,
                min: 0,
                max: 64,
                stations: [],
                selectedStation: "",
                standard: [
                    [0.375, '#2BA471', "1级", 0.2],
                    [0.625, '#F5BA18', "2级", 0.5],
                    [0.75, '#E37318', "3级", 0.7],
                    [1, '#D54941', "超标", 0.9]
                ]
            }, {
                name: "空压机（国家标准）",
                value: 0,
                unit: "kWh/m³",
                stations: [],
                selectedStation: "",
                min: 0,
                max: 0.2,
                standard: [
                    [0.4, '#2BA471', "优", 0.2],
                    [0.5, '#F5BA18', "良", 0.45],
                    [0.6, '#E37318', "中", 0.55],
                    [1, '#D54941', "差", 0.8]
                ]
            }],
        }
    },
    methods: {
        getChartOption (item) {
            return {
                series: {
                    type: 'gauge',
                    center: ["50%", "55%"],
                    radius: "80%",
                    min: item.min,
                    max: item.max,
                    splitNumber: 20,
                    axisLine: {
                        lineStyle: {
                            width: 12,
                            color: item.standard
                        }
                    },
                    pointer: {
                        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                        length: '12%',
                        width: 10,
                        offsetCenter: [0, '-60%'],
                        itemStyle: {
                            color: 'auto'
                        }
                    },
                    axisTick: {
                        distance: 10,
                        length: 3,
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.25)',
                            width: 1
                        }
                    },
                    splitLine: {
                        distance: 10,
                        length: 0,
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.25)',
                            width: 1
                        }
                    },
                    axisLabel: {
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.40)",
                        distance: -25,
                        rotate: 'tangential',
                        formatter: function (value) {
                            for(let i = 0; i < item.standard.length; i++) {
                                if (Math.round(value / item.max * 100) === Math.round(item.standard[i][3] * 100)) {
                                    return item.standard[i][2]
                                }
                            }
                            return ""
                        }
                    },
                    detail: {
                        valueAnimation: true,
                        color: 'inherit',
                        fontSize: 20,
                        formatter: function (value) {
                            return `{ratio|能效比}\n{value|${value}}\n{unit|${item.unit || ''}}`;
                        },
                        rich: {
                            ratio: {
                                fontSize: 16,
                                color: 'rgba(255, 255, 255, 0.60)',
                                padding: [0, 0, 50, 0]
                            },
                            value: {
                                fontSize: 28,
                                padding: [0, 0, 40, 0]
                            },
                            unit: {
                                fontSize: 14,
                                color: 'rgba(255, 255, 255, 0.60)',
                                padding: [0, 0, 40, 0]
                            }
                        }
                    },
                    data: [
                        {
                            value: toFixedValue(item.value, 2)
                        }
                    ]
                }
            }
        },
        getData () {
            if (this.indexes[0].selectedStation) {
                getSeriesLatestValues(this.indexes[0].selectedStation, ["冷站EER"]).then(result => {
                    if (result.data[0] && result.data[0].value) {
                        this.indexes[0].value = result.data[0].value
                    }
                    else {
                        this.indexes[0].value = ""
                    }
                })
            }
            if (this.indexes[1].selectedStation) {
                getSeriesLatestValues(this.indexes[1].selectedStation, ["比能量"]).then(result => {
                    console.log(result.data)
                    if (result.data[0] && result.data[0].value) {
                        this.indexes[1].value = result.data[0].value
                    }
                    else {
                        this.indexes[1].value = ""
                    }
                })
            }
        },
        getStations () {
            Promise.all([
                getNodesByModel("CoolingStation"),
                getNodesByModel("AirCompressionStation"),
            ]).then(([cooling, air]) => {
                this.indexes[0].stations = cooling.data;
                this.indexes[1].stations = air.data;
                this.indexes[0].selectedStation = cooling.data[0] ? cooling.data[0].id : ""
                this.indexes[1].selectedStation = air.data[0] ? air.data[0].id : ""
                this.getData()
            })
        }
    },
    created() {
        this.getStations()
    }
}
</script>

<style scoped>
    .custom-selector {

        input {
            border-radius: 2px;
            border: 1px solid #0050B3;
            background: #003A8C;
            color: var(--Neutral-6, #BFBFBF);
            font-family: "HarmonyOS Sans SC";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
        }
    }
    .index-name {
        color: #FFF;
        font-family: "HarmonyOS Sans SC";
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    }
</style>