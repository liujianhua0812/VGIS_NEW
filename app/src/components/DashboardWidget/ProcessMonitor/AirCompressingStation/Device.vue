<template>
    <vgis-row :gutter="24" class="full-h">
        <vgis-col :span="6" class="full-h">
            <vgis-cell class="full-h">
                <StatusStat></StatusStat>
            </vgis-cell>
        </vgis-col>
        <vgis-col :span="33" class="full-h">
            <vgis-cell class="full-h">
                <MalfunctionList></MalfunctionList>
            </vgis-cell>
        </vgis-col>
        <vgis-col :span="33" class="full-h">
            <vgis-cell class="full-h">
                <MaintenanceNotice></MaintenanceNotice>
            </vgis-cell>
        </vgis-col>
    </vgis-row>
</template>

<script>
import VgisRow from "@/components/Standard/vgis-row.vue";
import VgisCol from "@/components/Standard/vgis-col.vue";
import VgisCell from "@/components/Standard/vgis-cell.vue";
import MalfunctionList from "@/components/DashboardWidget/ProcessMonitor/AirCompressingStation/MalfunctionList.vue";
import MaintenanceNotice from "@/components/DashboardWidget/ProcessMonitor/AirCompressingStation/MaintenanceNotice.vue";
import StatusStat from "@/components/DashboardWidget/ProcessMonitor/AirCompressingStation/StatusStat.vue";

export default {
    name: "Device",
    components: {StatusStat, MaintenanceNotice, MalfunctionList, VgisCell, VgisCol, VgisRow}
}
</script>

<style scoped>

</style>