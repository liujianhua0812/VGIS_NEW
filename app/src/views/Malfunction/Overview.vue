<template>
    <vgis-page :navs="navs" :page-name="pageTitle">
        <vgis-date-selector v-model="timeRange" style="width: 600px;" class="m-b-16"></vgis-date-selector>
        <vgis-row :gutter="24" style="height: calc(100% - 60px)">
            <vgis-col :span="72" class="full-h">
                <vgis-flex-column class="full-h">
                    <vgis-cell style="height: 338px; flex-shrink: 0;" class="m-b-24">
                        <vgis-row :gutter="24" class="full-h">
                            <vgis-col :span="9" class="full-h">
                                <vgis-cell class="full-h">
                                    <PowerOverview :time-range="timeRange"></PowerOverview>
                                </vgis-cell>
                            </vgis-col>
                            <vgis-col :span="9" class="full-h">
                                <vgis-cell class="full-h">
                                    <LevelRatio :time-range="timeRange"></LevelRatio>
                                </vgis-cell>
                            </vgis-col>
                            <vgis-col :span="21" class="full-h">
                                <vgis-cell class="full-h">
                                    <TaskTrend :time-range="timeRange"></TaskTrend>
                                </vgis-cell>
                            </vgis-col>
                            <vgis-col :span="33" class="full-h">
                                <vgis-cell class="full-h">
                                    <MalfunctionCategory :time-range="timeRange"></MalfunctionCategory>
                                </vgis-cell>
                            </vgis-col>
                        </vgis-row>
                    </vgis-cell>
                    <vgis-cell style="flex-grow: 1;">
                        <PendingTaskList></PendingTaskList>
                    </vgis-cell>
                </vgis-flex-column>
            </vgis-col>
        </vgis-row>
    </vgis-page>
</template>

<script>
import VgisFlexColumn from "@/components/Standard/vgis-flex-column.vue";
import VgisRow from "@/components/Standard/vgis-row.vue";
import VgisCol from "@/components/Standard/vgis-col.vue";
import VgisCell from "@/components/Standard/vgis-cell.vue";
import VgisPage from "@/components/Standard/vgis-page.vue";

import config from "@/config";
import PowerOverview from "@/components/DashboardWidget/Malfunction/Overview/MalfunctionOverview.vue";
import PendingTaskList from "@/components/DashboardWidget/Malfunction/Overview/PendingTaskList.vue";
import TaskRatio from "@/components/DashboardWidget/Malfunction/Overview/LevelRatio.vue";
import TaskTrend from "@/components/DashboardWidget/Malfunction/Overview/TaskTrend.vue";
import VgisDateSelector from "@/components/DashboardWidget/Shared/vgis-date-selector.vue";
import MalfunctionCategory from "@/components/DashboardWidget/Malfunction/Overview/MalfunctionCategory.vue";
import LevelRatio from "@/components/DashboardWidget/Malfunction/Overview/LevelRatio.vue";

export default {
    name: "Overview",
    components: {
        LevelRatio,
        MalfunctionCategory,
        VgisDateSelector,
        TaskTrend,
        TaskRatio,
        PendingTaskList,
        PowerOverview,
        VgisPage,
        VgisCell,
        VgisCol,
        VgisRow,
        VgisFlexColumn
    },
    computed: {
        title () {
            return `${config.name} - ${this.pageTitle}`
        }
    },
    data () {
        let endDate = new Date(), startDate = new Date(endDate.getTime())
        startDate.setDate(endDate.getDate() - 30)
        return {
            pageTitle: "故障管理概览",
            navs: [{
                name: "总览",
                link: "/"
            }, {
                name: "故障管理"
            }, {
                name: "概览"
            }],
            timeRange: [startDate, endDate]
        }
    }
}
</script>

<style scoped>

</style>