<template>
    <vgis-card title="故障管理概览">
        <div class="flex flex-column justify-content-between p-t-16" style="height: calc(100% - 40px)">
            <div class="index-container" v-for="item in series">
                <div class="name">
                    <i :class="item.icon"></i>
                    {{item.name}}
                </div>
                <div class="value">
                    {{item.value}}
                    <small>{{item.unit}}</small>
                </div>
            </div>
        </div>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import {getGeneralTaskStat} from "@/assets/js/api/malfunction-tasks";
export default {
    name: "MalfunctionOverview",
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
            series: [{
                name: "总数",
                value: 42,
                unit: "",
                icon: "iconfont icon-sum"
            }, {
                name: "平均响应时间",
                value: 0.2,
                unit: "h",
                icon: "iconfont icon-average-time"
            }]
        }
    },
    methods: {
        refreshData () {
            getGeneralTaskStat({ createdAt: this.timeRange }).then(result => {
                this.series[0].value = result.data.total
                this.series[1].value = (result.data.averageSolveTime || 0).toFixed(1)
            })
        }
    },
    created() {
        this.refreshData()
    }
}
</script>

<style scoped>
    .index-container {
        color: #BFBFBF;
        font-family: "HarmonyOS Sans SC";
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        margin-bottom: 30px;

        .name {
            font-size: 20px;
            margin-bottom: 8px;
        }

        .value {
            color: #E6F7FF;
            font-size: 60px;

            .unit {
                font-size: 30px;
                margin-left: 8px;
            }
        }
    }
</style>