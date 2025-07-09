<template>
    <vgis-page :navs="navs" :page-name="pageTitle">
        <template slot="header">
            <div class="flex align-items-center justify-content-between">
                {{pageTitle}}
                <PowerSavingAdvice></PowerSavingAdvice>
            </div>
        </template>
        <vgis-date-selector v-model="timeRange" style="width: 600px;" class="m-b-16"></vgis-date-selector>
        <vgis-row :gutter="24" style="height: calc(100% - 68px)" v-if="station">
            <vgis-col :span="36" class="full-h">
                <vgis-cell style="height: calc((100% - 24px)/2);" class="m-b-24">
                    <AirPressure :station="station" :time-range="timeRange"></AirPressure>
                </vgis-cell>
                <vgis-cell style="height: calc((100% - 24px)/2);">
                    <SpecificEnergy :station="station" :time-range="timeRange"></SpecificEnergy>
                </vgis-cell>
            </vgis-col>
            <vgis-col :span="36" class="full-h">
                <vgis-cell style="height: calc((100% - 24px)/2);" class="m-b-24">
                    <AirSupply :station="station" :time-range="timeRange"></AirSupply>
                </vgis-cell>
                <vgis-cell style="height: calc((100% - 24px)/2);">
                    <LossRate :station="station" :time-range="timeRange"></LossRate>
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
import AirPressure from "@/components/DashboardWidget/PowerSaving/AirCompressionStation/AirPressure.vue";
import AirSupply from "@/components/DashboardWidget/PowerSaving/AirCompressionStation/AirSupply.vue";
import SpecificEnergy from "@/components/DashboardWidget/PowerSaving/AirCompressionStation/SpecificEnergy.vue";
import LossRate from "@/components/DashboardWidget/PowerSaving/AirCompressionStation/LossRate.vue";
import PowerSavingAdvice from "@/components/DashboardWidget/PowerSaving/PowerSavingAdvice.vue";
import {getNodesByModel} from "@/assets/js/api/hierarchy";

export default {
    name: "AirCompressingStation",
    components: {
        PowerSavingAdvice,
        LossRate,
        SpecificEnergy,
        AirSupply,
        AirPressure,
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
            pageTitle: "空压站概览",
            navs: [{
                name: "总览",
                link: "/"
            }, {
                name: "节能管理"
            }, {
                name: "节能概览",
                link: "/ps"
            }, {
                name: "空压站"
            }],
            station: "",
            timeRange: [startDate, endDate]
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