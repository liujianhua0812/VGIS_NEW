<template>
    <vgis-card :title="compressor.name">
        <div class="flex align-items-center justify-content-between m-t-16" style="height: calc(100% - 40px)">
            <AirTemperature :compressor="compressor" :time-range="timeRange"></AirTemperature>
            <AirPressure class="m-l-24" :compressor="compressor" :time-range="timeRange"></AirPressure>
            <DailyVacantRatio class="m-l-24" :compressor="compressor" :time-range="timeRange"></DailyVacantRatio>
        </div>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import AirPressure from "@/components/DashboardWidget/PowerSaving/AirCompressor/AirPressure.vue";
import DailyVacantRatio from "@/components/DashboardWidget/PowerSaving/AirCompressor/DailyVacantRatio.vue";
import AirTemperature from "@/components/DashboardWidget/PowerSaving/AirCompressor/AirTemperature.vue";

export default {
    name: "CompressorInfoCard",
    props: {
        compressor: Object,
        timeRange: Array
    },
    components: {
        AirTemperature,
        DailyVacantRatio,
        AirPressure,
        VgisCard
    }
}
</script>

<style scoped>

</style>