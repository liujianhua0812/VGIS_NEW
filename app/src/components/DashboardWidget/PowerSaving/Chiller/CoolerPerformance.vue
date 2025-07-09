<template>
    <vgis-card title="冷机性能">
        <chiller-selector :preset="stationChillers" class="m-t-16 m-b-16" v-model="chillers" :default-all="false" :least="1" :multiple="false"></chiller-selector>
        <div class="chart-container">
            <vgis-sub-card>
                <template slot="header">
                    <span :class="['chart-tab', { active: activeTab === 'COP' }]" @click="activeTab = 'COP'">冷机COP分析</span>
                    <span :class="['chart-tab', { active: activeTab === 'DCOP' }]" @click="activeTab = 'DCOP'">冷机DCOP分析</span>
                </template>
                <COPAnalysis :timeRange="timeRange" :chillers="chillers" v-if="activeTab === 'COP'"></COPAnalysis>
                <DCOPAnalysis :timeRange="timeRange" :chillers="chillers" v-if="activeTab === 'DCOP'"></DCOPAnalysis>
            </vgis-sub-card>
        </div>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import ChillerSelector from "@/components/DashboardWidget/PowerSaving/Chiller/ChillerSelector.vue";
import AverageCOP from "@/components/DashboardWidget/PowerSaving/Chiller/AverageCOP.vue";
import ActiveHourRatio from "@/components/DashboardWidget/PowerSaving/Chiller/ActiveHourRatio.vue";
import COP from "@/components/DashboardWidget/PowerSaving/Chiller/COP.vue";
import VgisSubCard from "@/components/DashboardWidget/Shared/vgis-sub-card.vue";
import COPAnalysis from "@/components/DashboardWidget/PowerSaving/Chiller/COPAnalysis.vue";
import DCOPAnalysis from "@/components/DashboardWidget/PowerSaving/Chiller/DCOPAnalysis.vue";

export default {
    name: "CoolerPerformance",
    props: {
        stationChillers: Array,
        timeRange: Array
    },
    components: {
        DCOPAnalysis,
        COPAnalysis,
        VgisSubCard,
        COP, ActiveHourRatio, AverageCOP,
        ChillerSelector,
        VgisCard
    },
    data () {
        return {
            activeTab: "COP",
            chillers: []
        }
    }
}
</script>

<style scoped>
    .chart-container {
        display: flex;
        height: calc(100% - 64px);
    }

    .chart-tab {
        color: #FFF;
        font-family: "HarmonyOS Sans SC";
        font-size: 20px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        padding: 12px;
        margin-right: 32px;
        cursor: pointer;
        border-bottom: 2px solid transparent;
    }

    .chart-tab.active {
        color: #40A9FF;
        border-bottom: 2px solid #40A9FF;
    }

    .chart-tab:last-child {
        margin-right: 0;
    }
</style>