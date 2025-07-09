<template>
    <vgis-card title="冷机能效">
        <chiller-selector :preset="stationChillers" class="m-t-16 m-b-16" v-model="chillers"></chiller-selector>
        <div class="chart-container">
            <COP :time-range="timeRange" :chillers="chillers" style="flex-grow: 1;"></COP>
            <AverageCOP :time-range="timeRange" :chillers="chillers" style="width: 297px; flex-shrink: 0;" class="m-l-24 m-r-24"></AverageCOP>
            <ActiveHourRatio :time-range="timeRange" :chillers="chillers" style="width: 297px; flex-shrink: 0;"></ActiveHourRatio>
        </div>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import COP from "@/components/DashboardWidget/PowerSaving/Chiller/COP.vue";
import AverageCOP from "@/components/DashboardWidget/PowerSaving/Chiller/AverageCOP.vue";
import ActiveHourRatio from "@/components/DashboardWidget/PowerSaving/Chiller/ActiveHourRatio.vue";
import ChillerSelector from "@/components/DashboardWidget/PowerSaving/Chiller/ChillerSelector.vue";
import {getNodesByModel} from "@/assets/js/api/hierarchy";

export default {
    name: "CoolerEfficiency",
    props: {
        stationChillers: Array,
        timeRange: Array,
    },
    components: {ChillerSelector, ActiveHourRatio, AverageCOP, COP, VgisCard},
    data () {
        return {
            chillers: []
        }
    }
}
</script>

<style lang="scss" scoped>
    .chart-container {
        display: flex;
        height: calc(100% - 64px);
    }
</style>