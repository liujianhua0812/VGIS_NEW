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
                        <TowerSelector :station="station" v-model="towers"></TowerSelector>
                    </vgis-cell>
                    <vgis-cell style="height: 406px;" class="m-t-24">
                        <ActiveHourRatio :time-range="timeRange"></ActiveHourRatio>
                    </vgis-cell>
                </vgis-flex-column>
            </vgis-col>
            <vgis-col :span="60" class="full-h" style="overflow-y: scroll;">
                <vgis-cell :class="{ 'm-b-24': index < towers.length - 1 }" :style="`height: calc((100% - 24px * ${Math.min(towers.length, 2) - 1})/${Math.min(towers.length, 2.5)});`" v-for="(tower, index) in towers">
                    <TowerInfoCard :time-range="timeRange" :tower="tower"></TowerInfoCard>
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
import TowerInfoCard from "@/components/DashboardWidget/PowerSaving/CoolingTower/TowerInfoCard.vue";
import TowerSelector from "@/components/DashboardWidget/PowerSaving/CoolingTower/TowerSelector.vue";
import ActiveHourRatio from "@/components/DashboardWidget/PowerSaving/CoolingTower/ActiveHourRatio.vue";
import PumpInfoCard from "@/components/DashboardWidget/PowerSaving/CoolingPump/PumpInfoCard.vue";
import PowerSavingAdvice from "@/components/DashboardWidget/PowerSaving/PowerSavingAdvice.vue";
import {getNodesByModel} from "@/assets/js/api/hierarchy";

export default {
    name: "CoolingTower",
    components: {
        PowerSavingAdvice,
        PumpInfoCard,
        ActiveHourRatio,
        TowerSelector,
        TowerInfoCard,
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
            pageTitle: "冷却塔",
            towers: [],
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
                name: "冷却塔"
            }],
            timeRange: [startDate, endDate],
            station: ""
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