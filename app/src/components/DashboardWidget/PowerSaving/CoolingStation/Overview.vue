<template>
    <vgis-card>
        <vgis-date-selector v-model="timeRange" style="width: 600px;" class="m-b-16"></vgis-date-selector>
        <div class="m-t-16 flex flex-column" style="height: calc(100% - 64px);">
            <GeneralIndex :station="station" :time-range="timeRange" class="m-b-24"></GeneralIndex>
            <PowerSavingAnalysis :station="station" :time-range="timeRange"></PowerSavingAnalysis>
        </div>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import VgisDateSelector from "@/components/DashboardWidget/Shared/vgis-date-selector.vue";
import GeneralIndex from "@/components/DashboardWidget/PowerSaving/CoolingStation/GeneralIndex.vue";
import PowerSavingAnalysis from "@/components/DashboardWidget/PowerSaving/CoolingStation/PowerSavingAnalysis.vue";

export default {
    name: "Overview",
    components: {
        PowerSavingAnalysis,
        GeneralIndex,
        VgisDateSelector,
        VgisCard
    },
    props: {
        station: Object
    },
    data () {
        let endDate = new Date(), startDate = new Date(endDate.getTime())
        startDate.setDate(endDate.getDate() - 30)
        return {
            timeRange: [startDate, endDate]
        }
    }
}
</script>

<style scoped>

</style>