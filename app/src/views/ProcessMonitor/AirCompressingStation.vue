<template>
    <vgis-page :navs="navs" :page-name="pageTitle">
        <vgis-row :gutter="24" class="full-h">
            <vgis-col :span="72" class="full-h">
                <vgis-cell style="height: calc(100% - 24px - 346px);" class="m-b-24">
                    <vgis-card>
                        <object :data="AirCompressingStationPID" type="image/svg+xml" width="100%" height="100%">
                            Your browser does not support SVG
                        </object>
                    </vgis-card>
                </vgis-cell>
                <vgis-cell style="height: 346px;">
                    <ExtraInfoPanel></ExtraInfoPanel>
                </vgis-cell>
            </vgis-col>
        </vgis-row>
    </vgis-page>
</template>

<script>

import AirCompressingStationPID from "@/assets/images/pid/air-compressing-station.svg"
import VgisPage from "@/components/Standard/vgis-page.vue";
import VgisRow from "@/components/Standard/vgis-row.vue";
import VgisCol from "@/components/Standard/vgis-col.vue";
import VgisCell from "@/components/Standard/vgis-cell.vue";
import AirPressure from "@/components/DashboardWidget/PowerSaving/AirCompressionStation/AirPressure.vue";
import VgisCard from "@/components/Standard/vgis-card.vue";
import ExtraInfoPanel from "@/components/DashboardWidget/ProcessMonitor/AirCompressingStation/ExtraInfoPanel.vue";

export default {
    name: "AirCompressingStation",
    components: {ExtraInfoPanel, VgisCard, AirPressure, VgisCell, VgisCol, VgisRow, VgisPage},
    data () {
        return {
            pageTitle: "空压站实时监控",
            navs: [{
                name: "总览",
                link: "/"
            }, {
                name: "实时监控"
            }, {
                name: "空压站"
            }],
            AirCompressingStationPID
        }
    }
}
</script>

<style scoped>

</style>