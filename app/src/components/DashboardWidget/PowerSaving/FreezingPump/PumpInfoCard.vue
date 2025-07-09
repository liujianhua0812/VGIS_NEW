<template>
    <vgis-card :title="pump.name">
        <div class="flex align-items-center justify-content-between m-t-16" style="height: calc(100% - 40px)">
            <LiftFlowScatter :pump="pump" :time-range="timeRange"></LiftFlowScatter>
            <EfficiencyFlowScatter :pump="pump" :time-range="timeRange" class="m-l-24 m-r-24"></EfficiencyFlowScatter>
            <FrequencyDistribution :pump="pump" :time-range="timeRange"></FrequencyDistribution>
        </div>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import LiftFlowScatter from "@/components/DashboardWidget/PowerSaving/FreezingPump/LiftFlowScatter.vue";
import EfficiencyFlowScatter from "@/components/DashboardWidget/PowerSaving/FreezingPump/EfficiencyFlowScatter.vue";
import FrequencyDistribution from "@/components/DashboardWidget/PowerSaving/FreezingPump/FrequencyDistribution.vue";

export default {
    name: "PumpInfoCard",
    components: {FrequencyDistribution, EfficiencyFlowScatter, LiftFlowScatter, VgisCard},
    props: {
        timeRange: Array,
        pump: Object,
    },
}
</script>

<style scoped>

</style>