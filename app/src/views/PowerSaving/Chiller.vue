<template>
    <vgis-page :navs="navs" :page-name="pageTitle">
        <template slot="header">
            <div class="flex align-items-center justify-content-between">
                {{pageTitle}}
                <PowerSavingAdvice></PowerSavingAdvice>
            </div>
        </template>
        <vgis-date-selector v-model="timeRange" style="width: 600px;" class="m-b-16"></vgis-date-selector>
        <vgis-row :gutter="24" style="height: calc(100% - 68px);">
            <vgis-col :span="72" class="full-h">
                <vgis-cell style="height: calc((100% - 24px)/2)" class="m-b-24">
                    <vgis-row :gutter="24" class="full-h">
                        <vgis-col :span="49" class="full-h">
                            <vgis-cell class="full-h">
                                <CoolerEfficiency :station-chillers="chillers" :time-range="timeRange"></CoolerEfficiency>
                            </vgis-cell>
                        </vgis-col>
                        <vgis-col :span="23" class="full-h">
                            <vgis-cell class="full-h">
                                <CoolerPerformance :station-chillers="chillers" :time-range="timeRange"></CoolerPerformance>
                            </vgis-cell>
                        </vgis-col>
                    </vgis-row>
                </vgis-cell>
                <vgis-cell style="height: calc((100% - 24px)/2)">
                    <vgis-row :gutter="24" class="full-h">
                        <vgis-col :span="26" class="full-h">
                            <vgis-cell class="full-h">
                                <ChillerWaterTemperature :station-chillers="chillers" :time-range="timeRange"></ChillerWaterTemperature>
                            </vgis-cell>
                        </vgis-col>
                        <vgis-col :span="20" class="full-h">
                            <vgis-cell class="full-h">
                                <TemperatureComparison :station-chillers="chillers" :time-range="timeRange"></TemperatureComparison>
                            </vgis-cell>
                        </vgis-col>
                        <vgis-col :span="26" class="full-h">
                            <vgis-cell class="full-h">
                                <WorkloadAnalysis :station-chillers="chillers" :time-range="timeRange"></WorkloadAnalysis>
                            </vgis-cell>
                        </vgis-col>
                    </vgis-row>
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
import CoolerEfficiency from "@/components/DashboardWidget/PowerSaving/Chiller/CoolerEfficiency.vue";
import CoolerPerformance from "@/components/DashboardWidget/PowerSaving/Chiller/CoolerPerformance.vue";
import TemperatureComparison from "@/components/DashboardWidget/PowerSaving/Chiller/TemperatureComparison.vue";
import WorkloadAnalysis from "@/components/DashboardWidget/PowerSaving/Chiller/WorkloadAnalysis.vue";
import PowerSavingAdvice from "@/components/DashboardWidget/PowerSaving/PowerSavingAdvice.vue";
import ChillerWaterTemperature from "@/components/DashboardWidget/PowerSaving/Chiller/ChillerWaterTemperature.vue";
import VgisDateSelector from "@/components/DashboardWidget/Shared/vgis-date-selector.vue";
import {getNodeChildren, getNodesByModel} from "@/assets/js/api/hierarchy";

export default {
    name: "Chiller",
    components: {
        VgisDateSelector,
        ChillerWaterTemperature,
        PowerSavingAdvice,
        WorkloadAnalysis,
        TemperatureComparison,
        CoolerPerformance,
        CoolerEfficiency,
        VgisCell,
        VgisCol, VgisFlexColumn,
        VgisRow,
        VgisPage
    },
    data () {
        let endDate = new Date(), startDate = new Date(endDate.getTime())
        startDate.setDate(endDate.getDate() - 30)
        return {
            pageTitle: "冷水机组",
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
                name: "冷水机组"
            }],
            timeRange: [startDate, endDate],
            station: "",
            chillers: [],
        }
    },
    methods: {
        getInstance () {
            getNodesByModel("冷站").then(result => {
                if (this.$route.query.station) {
                    this.station = result.data.find(item => item.id === this.$route.query.station)
                }
                else {
                    this.station = result.data[0]
                }
                if (this.station) {
                    this.chillers = []
                    getNodeChildren(encodeURIComponent(this.station.instanceId), "CoolingSystem").then(result => {
                        let system = result.data[0]
                        if (system) {
                            getNodeChildren(encodeURIComponent(system.instanceId), "Chiller").then(result => {
                                this.chillers = this.chillers.concat(result.data)
                            })
                        }
                    })
                    getNodeChildren(encodeURIComponent(this.station.instanceId), "FreezingSystem").then(result => {
                        let system = result.data[0]
                        if (system) {
                            getNodeChildren(encodeURIComponent(system.instanceId), "Chiller").then(result => {
                                this.chillers = this.chillers.concat(result.data)
                            })
                        }
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