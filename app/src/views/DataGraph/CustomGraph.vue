<template>
    <vgis-page :navs="navs" :page-name="pageTitle">
        <vgis-row :gutter="24" class="full-h">
            <vgis-col :span="9" class="full-h">
                <vgis-cell class="full-h">
                    <graph-selector v-model="currentChart"></graph-selector>
                </vgis-cell>
            </vgis-col>
            <vgis-col :span="12" class="full-h">
                <vgis-cell class="full-h">
                    <vgis-point-tree-card :max-selection="maxSelections[currentChart]" multiple v-model="selectedPoints"></vgis-point-tree-card>
                </vgis-cell>
            </vgis-col>
            <vgis-col :span="51" class="full-h">
                <vgis-cell class="full-h">
                    <Histogram :points="selectedPoints" v-if="currentChart === 'histogram'"></Histogram>
                    <MultipleLineChart :points="selectedPoints" v-if="currentChart === 'multiple-line'"></MultipleLineChart>
                    <RelationScatter :points="selectedPoints" v-if="currentChart === 'relation'"></RelationScatter>
                </vgis-cell>
            </vgis-col>
        </vgis-row>
    </vgis-page>
</template>

<script>
import VgisRow from "@/components/Standard/vgis-row.vue";
import VgisPage from "@/components/Standard/vgis-page.vue";
import VgisFlexColumn from "@/components/Standard/vgis-flex-column.vue";
import VgisCol from "@/components/Standard/vgis-col.vue";
import VgisCell from "@/components/Standard/vgis-cell.vue";
import VgisDeviceTreeCard from "@/components/DashboardWidget/Shared/vgis-device-tree-card.vue";
import config from "@/config";
import TableView from "@/components/DashboardWidget/DataGraph/History/TableView.vue";
import LineChartView from "@/components/DashboardWidget/DataGraph/History/LineChartView.vue";
import VgisPersonSelector from "@/components/DashboardWidget/Shared/vgis-person-selector.vue";
import VgisSimpleDatetimeSelector from "@/components/DashboardWidget/Shared/vgis-simple-datetime-selector.vue";
import VgisDateSelector from "@/components/DashboardWidget/Shared/vgis-date-selector.vue";
import GraphSelector from "@/components/DashboardWidget/DataGraph/CustomGraph/graph-selector.vue";
import Histogram from "@/components/DashboardWidget/DataGraph/CustomGraph/Histogram.vue";
import MultipleLineChart from "@/components/DashboardWidget/DataGraph/CustomGraph/MultipleLineChart.vue";
import RelationScatter from "@/components/DashboardWidget/DataGraph/CustomGraph/RelationScatter.vue";
import VgisPointTreeCard from "@/components/DashboardWidget/Shared/vgis-point-tree-card.vue";

export default {
    name: "CustomGraph",
    components: {
        VgisPointTreeCard,
        RelationScatter,
        MultipleLineChart,
        Histogram,
        GraphSelector,
        VgisDateSelector,
        VgisSimpleDatetimeSelector, VgisPersonSelector,
        LineChartView,
        TableView,
        VgisCell,
        VgisCol,
        VgisFlexColumn,
        VgisPage,
        VgisRow,
        VgisDeviceTreeCard
    },
    computed: {
        title () {
            return `${config.name} - ${this.pageTitle}`
        }
    },
    data () {
        return {
            currentChart: "histogram",
            maxSelections: {
                "histogram": 1,
                "multiple-line": 4,
                "relation": 2
            },
            selectedPoints: [],
            pageTitle: "自定义报表",
            navs: [{
                name: "总览",
                link: "/"
            }, {
                name: "报表管理"
            }, {
                name: "自定义报表"
            }]
        }
    }
}
</script>

<style scoped>
.view-selector {
    i {
        border-radius: 4px;
        background: #8C8C8C;
        padding: 4px;
        font-size: 24px;
        line-height: 24px;
        cursor: pointer;
        margin-left: 8px;
    }

    i.active {
        background: #1890FF;
    }
}

.filters {
    background: #002766;
    border-radius: 16px;

    >i {
        color: #FFFFFF;
        font-family: "HarmonyOS Sans SC";
        font-size: 24px;
        font-style: normal;
        font-weight: 400;
        margin-right: 8px;
    }

    >label {
        color: #FFFFFF;
        font-family: "HarmonyOS Sans SC";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        margin-right: 8px;
        margin-left: 32px;
    }
}
</style>