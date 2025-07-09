<template>
    <vgis-page :navs="navs" :page-name="pageTitle">
        <vgis-row :gutter="24" class="full-h">
            <vgis-col :span="72" class="full-h">
                <vgis-cell class="full-h">
                    <vgis-card>
                        <object :data="CoolingStationPID" type="image/svg+xml" width="100%" height="100%">
                            Your browser does not support SVG
                        </object>
                    </vgis-card>
                </vgis-cell>
            </vgis-col>
        </vgis-row>
    </vgis-page>
</template>

<script>

import CoolingStationPID from "@/assets/images/pid/cooling-station.svg"
import VgisPage from "@/components/Standard/vgis-page.vue";
import VgisRow from "@/components/Standard/vgis-row.vue";
import VgisCol from "@/components/Standard/vgis-col.vue";
import VgisCell from "@/components/Standard/vgis-cell.vue";
import AirPressure from "@/components/DashboardWidget/PowerSaving/AirCompressionStation/AirPressure.vue";
import VgisCard from "@/components/Standard/vgis-card.vue";

export default {
    name: "CoolingStation",
    components: {VgisCard, AirPressure, VgisCell, VgisCol, VgisRow, VgisPage},
    data () {
        return {
            pageTitle: "冷站实时监控",
            navs: [{
                name: "总览",
                link: "/"
            }, {
                name: "实时监控"
            }, {
                name: "冷站"
            }],
            CoolingStationPID
        }
    }
}
</script>

<style scoped>

</style>