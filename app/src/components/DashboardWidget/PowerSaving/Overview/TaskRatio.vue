<template>
    <vgis-card title="节能管理任务占比">
        <div class="flex flex-column justify-content-between m-t-13" style="height: calc(100% - 37px);">
            <div class="ratio" v-for="item in ratio">
                <div class="name">{{item.name}}</div>
                <div class="value-container">
                    <el-progress class="m-r-16" style="flex-grow: 1;" :percentage="item.value" :color="item.color" stroke-width="8" :show-text="false"></el-progress>
                    <div class="percent">{{item.value}}%</div>
                </div>
            </div>
        </div>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import {getTaskStatByModule, getTaskStatByPeriod} from "@/assets/js/api/power-saving-tasks";

export default {
    name: "TaskRatio",
    props: {
        timeRange: Array
    },
    components: {
        VgisCard
    },
    watch: {
        timeRange: {
            handler (newValue) {
                this.refreshData()
            },
            deep: true
        }
    },
    data () {
        return {
            ratio: [{
                name: "冷机",
                value: 0,
                color: "#40A9FF"
            }, {
                name: "冷却水系统",
                value: 0,
                color: "#13C2C2"
            }, {
                name: "冷冻水系统",
                value: 0,
                color: "#722ED1"
            }, {
                name: "空压站",
                value: 0,
                color: "#FFFF00"
            }]
        }
    },
    methods: {
        refreshData () {
            getTaskStatByModule({ createdAt: this.timeRange }).then(result => {
                let sum = 0
                let statMap = result.data.reduce((result, item) => {
                    let value = parseInt(item.total)
                    result[item.module] = value
                    sum += value
                    return result
                }, {})
                for(let i = 0; i < this.ratio.length; i++) {
                    let record = this.ratio[i]
                    record.value = 0
                    if (sum) {
                        record.value = `${parseFloat(((statMap[record.name] || 0) * 100 / sum).toFixed(1))}`
                    }
                }
            })
        }
    },
    created() {
        this.refreshData()
    }
}
</script>

<style scoped>
    .ratio {
        .name {
            color: #FFFFFF;
            font-family: "HarmonyOS Sans SC";
            font-size: 18px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            margin-bottom: 8px;
        }

        .value-container {
            display: flex;
            align-items: center;

            .percent {
                width: 40px;
                flex-shrink: 0;
                font-size: 14px;
                font-weight: 400;
                line-height: 22px;
            }
        }
    }
</style>