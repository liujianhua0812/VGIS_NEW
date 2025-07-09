<template>
    <vgis-card>
        <template slot="header">
            <span :class="['chart-tab', { active: activeTab === 'device' }]" @click="activeTab = 'device'">设备详情</span>
            <span :class="['chart-tab', { active: activeTab === 'energy' }]" @click="activeTab = 'energy'">能耗详情</span>
        </template>
        <div class="m-t-16" style="height: calc(100% - 32px);">
            <Device v-if="activeTab === 'device'"></Device>
            <EnergyConsumption v-if="activeTab === 'energy'"></EnergyConsumption>
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
import Device from "@/components/DashboardWidget/ProcessMonitor/AirCompressingStation/Device.vue";
import EnergyConsumption from "@/components/DashboardWidget/ProcessMonitor/AirCompressingStation/EnergyConsumption.vue";
import VgisFlexColumn from "@/components/Standard/vgis-flex-column.vue";
import VgisRow from "@/components/Standard/vgis-row.vue";
import VgisCell from "@/components/Standard/vgis-cell.vue";
import VgisCol from "@/components/Standard/vgis-col.vue";

export default {
    name: "ExtraInfoPanel",
    components: {
        VgisCol, VgisCell, VgisRow, VgisFlexColumn,
        EnergyConsumption,
        Device,
        COP, ActiveHourRatio, AverageCOP,
        VgisCard,
        SensorActiveRatio,
        SensorMalfunctionHistory,
        DeviceSetMalfunctionHistory,
        RequirementMalfunctionHistory
    },
    data () {
        return {
            activeTab: "device"
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