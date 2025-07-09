<template>
    <vgis-page :navs="navs" :page-name="pageTitle">
        <template slot="header">
            <div class="flex align-items-center justify-content-between">
                {{pageTitle}}
                <PowerSavingAdvice></PowerSavingAdvice>
            </div>
        </template>
        <vgis-date-selector v-model="timeRange" style="width: 600px;" class="m-b-16"></vgis-date-selector>
        <vgis-row :gutter="24" style="height: calc(100% - 68px)">
            <vgis-col :span="12" class="full-h">
                <vgis-flex-column class="full-h">
                    <vgis-cell style="flex-grow: 1;">
                        <CompressorSelector :station="station" v-model="compressors"></CompressorSelector>
                    </vgis-cell>
                    <vgis-cell style="height: 406px;" class="m-t-24">
                        <BootCombination :time-range="timeRange"></BootCombination>
                    </vgis-cell>
                </vgis-flex-column>
            </vgis-col>
            <vgis-col :span="60" class="full-h" style="overflow-y: scroll;">
                <vgis-cell :class="{ 'm-b-24': index < compressors.length - 1 }" :style="`height: calc((100% - 24px * ${Math.min(compressors.length, 2) - 1})/${Math.min(compressors.length, 2.5)});`" v-for="(compressor, index) in compressors">
                    <CompressorInfoCard :time-range="timeRange" :compressor="compressor"></CompressorInfoCard>
                </vgis-cell>
            </vgis-col>
        </vgis-row>
    </vgis-page>
</template>

<script>
import VgisPage from "@/components/Standard/vgis-page.vue";
import VgisRow from "@/components/Standard/vgis-row.vue";
import VgisFlexColumn from "@/components/Standard/vgis-flex-column.vue";
import VgisCol from "@/components/Standard/vgis-col.vue";
import VgisCell from "@/components/Standard/vgis-cell.vue";
import VgisDateSelector from "@/components/DashboardWidget/Shared/vgis-date-selector.vue";
import PumpSelector from "@/components/DashboardWidget/PowerSaving/CoolingPump/PumpSelector.vue";
import PumpInfoCard from "@/components/DashboardWidget/PowerSaving/CoolingPump/PumpInfoCard.vue";
import AirTemperature from "@/components/DashboardWidget/PowerSaving/AirCompressor/AirTemperature.vue";
import PowerOverview from "@/components/DashboardWidget/PowerSaving/Overview/PowerOverview.vue";
import AirPressure from "@/components/DashboardWidget/PowerSaving/AirCompressor/AirPressure.vue";
import DailyVacantRatio from "@/components/DashboardWidget/PowerSaving/AirCompressor/DailyVacantRatio.vue";
import BootCombination from "@/components/DashboardWidget/PowerSaving/AirCompressor/BootCombination.vue";
import CompressorSelector from "@/components/DashboardWidget/PowerSaving/AirCompressor/CompressorSelector.vue";
import PowerSavingAdvice from "@/components/DashboardWidget/PowerSaving/PowerSavingAdvice.vue";
import CompressorInfoCard from "@/components/DashboardWidget/PowerSaving/AirCompressor/CompressorInfoCard.vue";
import {getNodesByModel} from "@/assets/js/api/hierarchy";

export default {
    name: "AirCompressor",
    components: {
        CompressorInfoCard,
        PowerSavingAdvice,
        CompressorSelector,
        BootCombination,
        DailyVacantRatio,
        AirPressure,
        PowerOverview,
        AirTemperature,
        PumpInfoCard,
        PumpSelector,
        VgisDateSelector,
        VgisCell,
        VgisCol, VgisFlexColumn,
        VgisRow,
        VgisPage
    },
    data () {
        let endDate = new Date(), startDate = new Date(endDate.getTime())
        startDate.setDate(endDate.getDate() - 30)
        return {
            pageTitle: "空压机",
            compressors: [],
            navs: [{
                name: "总览",
                link: "/"
            }, {
                name: "节能管理"
            }, {
                name: "节能概览",
                link: "/ps"
            }, {
                name: "空压站概览",
                link: "/ps/air"
            }, {
                name: "空压机",
            }],
            timeRange: [startDate, endDate],
            station: ""
        }
    },
    methods: {
        getStation () {
            getNodesByModel("AirCompressionStation").then(result => {
                if (this.$route.query.station) {
                    this.station = result.data.find(item => item.id === this.$route.query.station)
                }
                else {
                    this.station = result.data[0]
                }
            })
        }
    },
    created() {
        this.getStation()
    }
}
</script>

<style scoped>

</style>