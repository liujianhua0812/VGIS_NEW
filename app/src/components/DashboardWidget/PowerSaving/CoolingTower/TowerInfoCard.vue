<template>
    <vgis-card :title="tower.name">
        <div class="flex align-items-center justify-content-between m-t-16" style="height: calc(100% - 40px)">
            <EfficiencyScatter :tower="tower" :time-range="timeRange"></EfficiencyScatter>
            <TemperatureRelationScatter :tower="tower" :time-range="timeRange" class="m-l-24"></TemperatureRelationScatter>
        </div>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import EfficiencyScatter from "@/components/DashboardWidget/PowerSaving/CoolingTower/EfficiencyScatter.vue";
import TemperatureRelationScatter from "@/components/DashboardWidget/PowerSaving/CoolingTower/TemepratureRelationScatter.vue";

export default {
    name: "TowerInfoCard",
    components: {
        TemperatureRelationScatter,
        EfficiencyScatter,
        VgisCard
    },
    props: {
        timeRange: Array,
        tower: Object,
    },
}
</script>

<style scoped>

</style>