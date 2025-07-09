<template>
    <vgis-card>
        <template slot="header">
            <div class="flex align-items-center justify-content-between">
                碳资产收益
                <vgis-year-selector v-model="year" @input="getStat"></vgis-year-selector>
            </div>
        </template>
        <div :class="['profit', 'm-t-14', profit > 0 ? 'income' : 'debt']">{{profit}}元</div>
        <div style="height: calc(100% - 78px);" class="flex align-items-center justify-content-between">
            <v-chart :option="purchaseOption" autoresize></v-chart>
            <v-chart :option="sellOption" autoresize></v-chart>
        </div>
    </vgis-card>
</template>

<script>
import VgisFastDateSelector from "@/components/DashboardWidget/Shared/vgis-fast-date-selector.vue";
import VgisCard from "@/components/Standard/vgis-card.vue";
import VgisYearSelector from "@/components/DashboardWidget/Shared/vgis-year-selector.vue";
import {getAssetStat, getCarbonAssetsList} from "@/assets/js/api/catbon-asset";

export default {
    name: "CarbonProfit",
    components: {
        VgisYearSelector,
        VgisCard,
        VgisFastDateSelector
    },
    computed: {
        profit () {
            let totalP = this.purchase.reduce((sum, item) => sum + (item.value.price || 0), 0)
            let totalS = this.sell.reduce((sum, item) => sum + (item.value.price || 0), 0)
            return totalP - totalS
        },
        purchaseOption () {
            return {
                year: new Date().getFullYear(),
                grid: {
                    left: "20%",
                    right: "50%",
                    bottom: 20,
                },
                legend: {
                    show: true,
                    orient: 'vertical',
                    top: "middle",
                    right: 20,
                    itemWidth: 10,
                    itemHeight: 10,
                    itemGap: 10,
                    textStyle: {
                        color: "rgba(255, 255, 255, 0.60)",
                        fontSize: 12,
                    }
                },
                tooltip: {
                    show: true,
                    trigger: "axis"
                },
                xAxis: {
                    type: "category",
                    data: ["买入"],
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#FFFFFF"
                        }
                    },
                    axisLabel: {
                        color: "#FFFFFF"
                    }
                },
                yAxis: {
                    type: "value",
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    }
                },
                series: this.purchase.map(item => ({
                    type: "bar",
                    barWidth: 30,
                    name: item.name,
                    stack: "买入",
                    data: [item.value.carbon],
                    itemStyle: {
                        color: item.color
                    }
                }))
            }
        },
        sellOption () {
            return {
                grid: {
                    left: "20%",
                    right: "50%",
                    bottom: 20,
                },
                legend: {
                    show: true,
                    orient: 'vertical',
                    top: "middle",
                    right: 20,
                    itemWidth: 10,
                    itemHeight: 10,
                    itemGap: 10,
                    textStyle: {
                        color: "rgba(255, 255, 255, 0.60)",
                        fontSize: 12,
                    }
                },
                tooltip: {
                    show: true
                },
                xAxis: {
                    type: "category",
                    data: ["卖出"],
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#FFFFFF"
                        }
                    },
                    axisLabel: {
                        color: "#FFFFFF"
                    }
                },
                yAxis: {
                    type: "value",
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    }
                },
                series: this.sell.map(item => ({
                    type: "bar",
                    name: item.name,
                    stack: "卖出",
                    barWidth: 30,
                    data: [item.value.carbon],
                    itemStyle: {
                        color: item.color
                    }
                }))
            }
        }
    },
    data () {
        return {
            year: new Date().getFullYear(),
            purchase: [{
                name: "开发绿证绿电",
                value: 2333,
                color: "#0052D9"
            }, {
                name: "买入绿证绿电",
                value: 2333,
                color: "#029CD4"
            }, {
                name: "开发CCER",
                value: 2333,
                color: "#2BA471"
            }, {
                name: "买入CCER",
                value: 2333,
                color: "#F5BA18"
            }, {
                name: "发放配额",
                value: 2333,
                color: "#E37318"
            }],
            sell: [{
                name: "卖出绿证绿电",
                value: 2333,
                color: "#0052D9"
            }, {
                name: "卖出CCER",
                value: 2333,
                color: "#029CD4"
            }, {
                name: "卖出配额",
                value: 2333,
                color: "#2BA471"
            }]
        }
    },
    methods: {
        getStat () {
            getAssetStat({ year: this.year }).then(result => {
                for(let i = 0; i < this.purchase.length; i++) {
                    let record = this.purchase[i]
                    record.value = result.data[record.name] || ""
                }
                for(let i = 0; i < this.sell.length; i++) {
                    let record = this.sell[i]
                    record.value = result.data[record.name] || ""
                }
            })
        }
    },
    created() {
        this.getStat()
    }
}
</script>

<style scoped>
    .profit {
        font-feature-settings: 'liga' off, 'clig' off;
        font-family: "HarmonyOS Sans SC";
        font-size: 30px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }

    .income {
        color: #11D200;
    }

    .debt {
        color: #A80102;
    }
</style>