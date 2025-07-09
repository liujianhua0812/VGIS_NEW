<template>
    <vgis-page :navs="navs" :page-name="pageTitle">
        <template slot="header">
            <div class="flex align-items-center justify-content-between">
                {{pageTitle}}
                <PowerSavingAdvice></PowerSavingAdvice>
            </div>
        </template>
        <vgis-row :gutter="24" style="height: calc(100% - 11px);">
            <vgis-col :span="24" class="full-h">
                <vgis-flex-column class="full-h">
                    <vgis-cell style="flex-grow: 1;">
                        <Overview :station="station"></Overview>
                    </vgis-cell>
                </vgis-flex-column>
            </vgis-col>
            <vgis-col :span="48" class="full-h">
                <vgis-flex-column class="full-h">
                    <vgis-cell style="flex-grow: 1;">
                        <AnnualAnalysis :station="station"></AnnualAnalysis>
                    </vgis-cell>
                </vgis-flex-column>
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
import PowerSavingAdvice from "@/components/DashboardWidget/PowerSaving/PowerSavingAdvice.vue";
import {getNodesByModel} from "@/assets/js/api/hierarchy";

export default {
    name: "CoolingStation",
    components: {
        PowerSavingAdvice,
        AnnualAnalysis,
        Overview,
        VgisCell,
        VgisCol, VgisFlexColumn,
        VgisRow,
        VgisPage
    },
    data () {
        return {
            pageTitle: "冷站概览",
            navs: [{
                name: "总览",
                link: "/"
            }, {
                name: "节能管理"
            }, {
                name: "节能概览",
                link: "/ps"
            }, {
                name: "冷站概览"
            }],
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