<template>
    <vgis-row :gutter="24" class="full-h">
        <vgis-col :span="72" class="full-h">
            <vgis-cell style="height: calc(100% - 24px - 346px);" class="m-b-24">
                <vgis-card>
                    <div class="pid-container">
                        <DynamicPID class="full" :preview="false" :pid="pid"></DynamicPID>
                    </div>
                </vgis-card>
            </vgis-cell>
            <vgis-cell style="height: 346px;">
                <ExtraInfoPanel></ExtraInfoPanel>
            </vgis-cell>
        </vgis-col>
    </vgis-row>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import ExtraInfoPanel from "@/components/DashboardWidget/ProcessMonitor/AirCompressingStation/ExtraInfoPanel.vue";
import VgisRow from "@/components/Standard/vgis-row.vue";
import VgisCol from "@/components/Standard/vgis-col.vue";
import VgisCell from "@/components/Standard/vgis-cell.vue";
import DynamicPID from "@/components/Admin/PID/DynamicPID.vue";

export default {
    name: "AirCompressionStation",
    props: {
        pid: Object
    },
    components: {DynamicPID, VgisCell, VgisCol, VgisRow, ExtraInfoPanel, VgisCard},

}
</script>

<style scoped>
.pid-container {
    width: 100%;
    height: calc(100% - 20px);
    padding-top: 20px;
    display: flex;
    align-items: center;
}
</style>