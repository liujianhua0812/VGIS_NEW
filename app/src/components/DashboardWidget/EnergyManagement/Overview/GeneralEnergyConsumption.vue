<template>
    <vgis-card>
        <template slot="header">
            <div class="flex align-items-center">
                <vgis-date-selector v-model="timeRange"></vgis-date-selector>
            </div>
        </template>
        <div class="m-t-24" style="height: calc(100% - 48px)">
            <div style="height: calc(100% / 3);" class="flex flex-column">
                <div class="section-title">能耗统计</div>
                <EnergyOverview :time-range="timeRange" style="flex-grow: 1;"></EnergyOverview>
            </div>
            <div style="height: calc(100% / 3);" class="flex flex-column">
                <div class="section-title">碳排放</div>
                <CarbonOverview :time-range="timeRange" style="flex-grow: 1;"></CarbonOverview>
            </div>
            <div style="height: calc(100% / 3);" class="flex flex-column">
                <div class="section-title">能源费用</div>
                <CostOverview :time-range="timeRange" style="flex-grow: 1;"></CostOverview>
            </div>
        </div>
    </vgis-card>
</template>

<script>
import VgisDateSelector from "@/components/DashboardWidget/Shared/vgis-date-selector.vue";
import VgisCard from "@/components/Standard/vgis-card.vue";
import EnergyOverview from "@/components/DashboardWidget/EnergyManagement/Overview/EnergyOverview.vue";
import CarbonOverview from "@/components/DashboardWidget/EnergyManagement/Overview/CarbonOverview.vue";
import CostOverview from "@/components/DashboardWidget/EnergyManagement/Overview/CostOverview.vue";

export default {
    name: "GeneralEnergyConsumption",
    components: {
        VgisCard,
        VgisDateSelector,
        EnergyOverview,
        CarbonOverview,
        CostOverview
    },
    data () {
        return {
            timeRange: []
        }
    }
}
</script>

<style lang="scss" scoped>
 .section-title {
     margin-top: 24px;
     color: #FFFFFF;
     font-feature-settings: 'liga' off, 'clig' off;
     font-family: "HarmonyOS Sans";
     font-size: 18px;
     font-style: normal;
     font-weight: 400;
     line-height: 22px;
 }
</style>