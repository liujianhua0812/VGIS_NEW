<template>
    <vgis-page :navs="navs" page-name="能耗概览">
        <vgis-row :gutter="24" class="full-h">
            <vgis-col :span="27" class="full-h">
                <vgis-flex-column class="full-h">
                    <vgis-cell :grow="1">
                        <GeneralEnergyConsumption></GeneralEnergyConsumption>
                    </vgis-cell>
                </vgis-flex-column>
            </vgis-col>
            <vgis-col :span="20" class="full-h">
                <vgis-flex-column class="full-h">
                    <vgis-cell :grow="1" class="m-b-24">
                        <EnergyAverageTrend></EnergyAverageTrend>
                    </vgis-cell>
                    <vgis-cell :grow="1" class="m-b-24">
                        <CarbonAverageTrend></CarbonAverageTrend>
                    </vgis-cell>
                    <vgis-cell :grow="1">
                        <CostAverageTrend></CostAverageTrend>
                    </vgis-cell>
                </vgis-flex-column>
            </vgis-col>
            <vgis-col :span="25" class="full-h">
                <vgis-flex-column class="full-h">
                    <vgis-cell :grow="1" class="m-b-24">
                        <CarbonProfit></CarbonProfit>
                    </vgis-cell>
                    <vgis-cell :grow="1" class="m-b-24">
                        <IndexComparison></IndexComparison>
                    </vgis-cell>
                    <vgis-cell :grow="1">
                        <TimeRangeComparison></TimeRangeComparison>
                    </vgis-cell>
                </vgis-flex-column>
            </vgis-col>
        </vgis-row>
    </vgis-page>
</template>

<script>

import VgisPage from "@/components/Standard/vgis-page.vue";

import config from "@/config"
import VgisCell from "@/components/Standard/vgis-cell.vue";
import VgisCol from "@/components/Standard/vgis-col.vue";
import ThreeDScene from "@/components/DashboardWidget/Overview/ThreeDScene.vue";
import TaskAndMalfunctionList from "@/components/DashboardWidget/Overview/TaskAndMalfunctionList.vue";
import VgisFlexColumn from "@/components/Standard/vgis-flex-column.vue";
import KeyFactors from "@/components/DashboardWidget/Overview/KeyFactors.vue";
import GeneralEnergyConsumption from "@/components/DashboardWidget/EnergyManagement/Overview/GeneralEnergyConsumption.vue";
import VgisRow from "@/components/Standard/vgis-row.vue";
import EnergyTrend from "@/components/DashboardWidget/Overview/EnergyTrend.vue";
import EnergyEfficiencyIndex from "@/components/DashboardWidget/Overview/EnergyEfficiencyIndex.vue";
import EnergyAverageTrend from "@/components/DashboardWidget/EnergyManagement/Overview/EnergyAverageTrend.vue";
import CarbonAverageTrend from "@/components/DashboardWidget/EnergyManagement/Overview/CarbonAverageTrend.vue";
import CostAverageTrend from "@/components/DashboardWidget/EnergyManagement/Overview/CostAverageTrend.vue";
import CarbonProfit from "@/components/DashboardWidget/EnergyManagement/Overview/CarbonProfit.vue";
import IndexComparison from "@/components/DashboardWidget/EnergyManagement/Overview/IndexComparison.vue";
import TimeRangeComparison from "@/components/DashboardWidget/EnergyManagement/Overview/TimeRangeComparison.vue";
export default {
    name: "Overview",
    components: {
        TimeRangeComparison,
        IndexComparison,
        CarbonProfit,
        CostAverageTrend,
        CarbonAverageTrend,
        EnergyAverageTrend,
        EnergyEfficiencyIndex,
        EnergyTrend,
        VgisRow,
        GeneralEnergyConsumption,
        KeyFactors,
        VgisFlexColumn,
        TaskAndMalfunctionList,
        ThreeDScene,
        VgisCol,
        VgisCell,
        VgisPage
    },
    data () {
        return {
            pageTitle: "能耗概览",
            navs: [{
                name: "总览",
                link: "/"
            }, {
                name: "能碳管理"
            }, {
                name: "能耗概览"
            }]
        }
    }
}
</script>

<style lang="scss" scoped>

</style>