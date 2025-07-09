<template>
    <vgis-card>
        <template slot="header">
            <span :class="['chart-tab', { active: activeTab === 'sensor' }]" @click="activeTab = 'sensor'">传感器故障</span>
            <span :class="['chart-tab', { active: activeTab === 'unit' }]" @click="activeTab = 'unit'">机组导出故障</span>
            <span :class="['chart-tab', { active: activeTab === 'requirement' }]" @click="activeTab = 'requirement'">需求不满足故障</span>
        </template>
        <div class="chart-container">
            <SensorActiveRatio :time-range="timeRange" v-if="activeTab === 'sensor'" style="flex-grow: 1;"></SensorActiveRatio>
            <SensorMalfunctionHistory :time-range="timeRange" v-if="activeTab === 'sensor'" style="flex-grow: 1;" class="m-l-24"></SensorMalfunctionHistory>
            <DeviceSetMalfunctionHistory :time-range="timeRange" v-if="activeTab === 'unit'" style="flex-grow: 1;"></DeviceSetMalfunctionHistory>
            <RequirementMalfunctionHistory :time-range="timeRange" v-if="activeTab === 'requirement'" style="flex-grow: 1;"></RequirementMalfunctionHistory>
        </div>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import SensorActiveRatio from "@/components/DashboardWidget/Malfunction/Overview/SensorActiveRatio.vue";
import SensorMalfunctionHistory from "@/components/DashboardWidget/Malfunction/Overview/SensorMalfunctionHistory.vue";
import DeviceSetMalfunctionHistory
    from "@/components/DashboardWidget/Malfunction/Overview/DeviceSetMalfunctionHistory.vue";
import RequirementMalfunctionHistory
    from "@/components/DashboardWidget/Malfunction/Overview/RequirementMalfunctionHistory.vue";
import AverageCOP from "@/components/DashboardWidget/PowerSaving/Chiller/AverageCOP.vue";
import ActiveHourRatio from "@/components/DashboardWidget/PowerSaving/Chiller/ActiveHourRatio.vue";
import COP from "@/components/DashboardWidget/PowerSaving/Chiller/COP.vue";
import PowerOverview from "@/components/DashboardWidget/Malfunction/Overview/MalfunctionOverview.vue";

export default {
    name: "MalfunctionCategory",
    props: {
        timeRange: Array
    },
    components: {
        PowerOverview,
        COP, ActiveHourRatio, AverageCOP,
        VgisCard,
        SensorActiveRatio,
        SensorMalfunctionHistory,
        DeviceSetMalfunctionHistory,
        RequirementMalfunctionHistory
    },
    data () {
        return {
            activeTab: "sensor"
        }
    }
}
</script>

<style lang="scss" scoped>
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

.chart-container {
    display: flex;
    margin-top: 28px;
    height: calc(100% - 40px);
}
</style>