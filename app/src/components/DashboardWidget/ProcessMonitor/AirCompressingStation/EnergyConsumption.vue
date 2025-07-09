<template>
    <vgis-row :gutter="24" class="full-h">
        <vgis-col :span="9" class="full-h">
            <vgis-cell class="full-h">
                <EnergyStat></EnergyStat>
            </vgis-cell>
        </vgis-col>
        <vgis-col :span="21" class="full-h">
            <vgis-cell class="full-h">
                <UnitEnergyTrend></UnitEnergyTrend>
            </vgis-cell>
        </vgis-col>
        <vgis-col :span="21" class="full-h">
            <vgis-cell class="full-h">
                <ElectricityConsumption></ElectricityConsumption>
            </vgis-cell>
        </vgis-col>
        <vgis-col :span="21" class="full-h">
            <vgis-cell class="full-h">
                <AirConsumption></AirConsumption>
            </vgis-cell>
        </vgis-col>
    </vgis-row>
</template>

<script>
import VgisRow from "@/components/Standard/vgis-row.vue";
import VgisCol from "@/components/Standard/vgis-col.vue";
import VgisCell from "@/components/Standard/vgis-cell.vue";
import EnergyStat from "@/components/DashboardWidget/ProcessMonitor/AirCompressingStation/EnergyStat.vue";
import UnitEnergyTrend from "@/components/DashboardWidget/ProcessMonitor/AirCompressingStation/UnitEnergyTrend.vue";
import ElectricityConsumption
    from "@/components/DashboardWidget/ProcessMonitor/AirCompressingStation/ElectricityConsumption.vue";
import AirConsumption from "@/components/DashboardWidget/ProcessMonitor/AirCompressingStation/AirConsumption.vue";

export default {
    name: "EnergyConsumption",
    components: {
        AirConsumption,
        ElectricityConsumption,
        UnitEnergyTrend, EnergyStat, VgisCell, VgisCol, VgisRow}
}
</script>

<style scoped>

</style>