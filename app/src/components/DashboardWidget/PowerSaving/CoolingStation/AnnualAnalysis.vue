<template>
    <vgis-card>
        <vgis-year-selector v-model="year" class="m-b-16"></vgis-year-selector>
        <vgis-row :gutter="24" style="height: calc(100% - 48px)">
            <vgis-col :span="72" class="full-h">
                <vgis-cell style="height: 370px;" class="m-b-24">
                    <AnnualElectricityDetail :station="station" :year="year" style="flex-grow: 1; flex-shrink: 0"></AnnualElectricityDetail>
                </vgis-cell>
                <vgis-cell style="height: calc(100% - 24px - 370px)">
                    <vgis-row :gutter="24" class="full-h">
                        <vgis-col :span="36" class="full-h">
                            <vgis-cell class="full-h">
                                <TwelveMonthElectricity :station="station" :year="year" class="full-h"></TwelveMonthElectricity>
                            </vgis-cell>
                        </vgis-col>
                        <vgis-col :span="36" class="full-h">
                            <vgis-cell class="full-h">
                                <ElectricityTemperatureRelation :station="station" :year="year"></ElectricityTemperatureRelation>
                            </vgis-cell>
                        </vgis-col>
                    </vgis-row>
                </vgis-cell>
            </vgis-col>
        </vgis-row>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import VgisYearSelector from "@/components/DashboardWidget/Shared/vgis-year-selector.vue";
import AnnualElectricityDetail
    from "@/components/DashboardWidget/PowerSaving/CoolingStation/AnnualElectricityDetail.vue";
import TwelveMonthElectricity from "@/components/DashboardWidget/PowerSaving/CoolingStation/TwelveMonthElectricity.vue";
import ElectricityTemperatureRelation
    from "@/components/DashboardWidget/PowerSaving/CoolingStation/ElectricityTemperatureRelation.vue";
import VgisRow from "@/components/Standard/vgis-row.vue";
import VgisFlexColumn from "@/components/Standard/vgis-flex-column.vue";
import VgisCol from "@/components/Standard/vgis-col.vue";
import VgisCell from "@/components/Standard/vgis-cell.vue";
import PumpSelector from "@/components/DashboardWidget/PowerSaving/CoolingPump/PumpSelector.vue";
import AirPressure from "@/components/DashboardWidget/PowerSaving/AirCompressionStation/AirPressure.vue";
import AirSupply from "@/components/DashboardWidget/PowerSaving/AirCompressionStation/AirSupply.vue";
import Overview from "@/components/DashboardWidget/PowerSaving/CoolingStation/Overview.vue";

export default {
    name: "AnnualAnalysis",
    props: {
        station: Object
    },
    components: {
        Overview,
        AirSupply, AirPressure,
        PumpSelector, VgisCell, VgisCol, VgisFlexColumn, VgisRow,
        ElectricityTemperatureRelation,
        TwelveMonthElectricity, AnnualElectricityDetail, VgisYearSelector, VgisCard
    },
    data () {
        return {
            year: new Date().getFullYear()
        }
    }
}
</script>

<style scoped>

</style>