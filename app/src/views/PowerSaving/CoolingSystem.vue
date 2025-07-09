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
            <vgis-col :span="72" class="full-h">
                <vgis-cell style="height: calc((100% - 24px) / 2)" class="m-b-24">
                    <TemperatureChange v-if="system" :system="system" :time-range="timeRange"></TemperatureChange>
                </vgis-cell>
                <vgis-cell style="height: calc((100% - 24px) / 2)" class="m-b-24">
                    <PressureChange v-if="system" :system="system" :time-range="timeRange"></PressureChange>
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
import Overview from "@/components/DashboardWidget/PowerSaving/CoolingStation/Overview";
import AnnualAnalysis from "@/components/DashboardWidget/PowerSaving/CoolingStation/AnnualAnalysis.vue";
import CoolerEfficiency from "@/components/DashboardWidget/PowerSaving/Chiller/CoolerEfficiency.vue";
import CoolerPerformance from "@/components/DashboardWidget/PowerSaving/Chiller/CoolerPerformance.vue";
import CoolerWaterTemperature from "@/components/DashboardWidget/PowerSaving/Chiller/ChillerWaterTemperature.vue";
import TemperatureComparison from "@/components/DashboardWidget/PowerSaving/Chiller/TemperatureComparison.vue";
import WorkloadAnalysis from "@/components/DashboardWidget/PowerSaving/Chiller/WorkloadAnalysis.vue";
import TemperatureChange from "@/components/DashboardWidget/PowerSaving/CoolingSystem/TemperatureChange.vue";
import PressureChange from "@/components/DashboardWidget/PowerSaving/CoolingSystem/PressureChange.vue";
import VgisDateSelector from "@/components/DashboardWidget/Shared/vgis-date-selector.vue";
import PowerSavingAdvice from "@/components/DashboardWidget/PowerSaving/PowerSavingAdvice.vue";
import {getNodeChildren, getNodesByModel} from "@/assets/js/api/hierarchy";

export default {
    name: "CoolingSystem",
    components: {
        PowerSavingAdvice,
        VgisDateSelector,
        PressureChange,
        TemperatureChange,
        WorkloadAnalysis,
        TemperatureComparison,
        CoolerWaterTemperature,
        CoolerPerformance,
        CoolerEfficiency,
        AnnualAnalysis,
        Overview,
        VgisCell,
        VgisCol, VgisFlexColumn,
        VgisRow,
        VgisPage
    },
    data () {
        let endDate = new Date(), startDate = new Date(endDate.getTime())
        startDate.setDate(endDate.getDate() - 30)
        return {
            pageTitle: "冷却水系统",
            navs: [{
                name: "总览",
                link: "/"
            }, {
                name: "节能管理"
            }, {
                name: "节能概览",
                link: "/ps"
            }, {
                name: "冷站概览",
                link: "/ps/cooling"
            }, {
                name: "冷却水系统"
            }],
            system: "",
            timeRange: [startDate, endDate]
        }
    },
    methods: {
        getInstance () {
            getNodesByModel("冷站").then(result => {
                let station = null
                if (this.$route.query.station) {
                    station = result.data.find(item => item.id === this.$route.query.station)
                }
                else {
                    station = result.data[0]
                }
                if (station) {
                    getNodeChildren(station.instanceId, "CoolingSystem").then(result => {
                        this.system = result.data[0]
                    })
                }
            })
        }
    },
    created() {
        this.getInstance()
    }
}
</script>

<style scoped>

</style>