<template>
    <vgis-page :navs="navs" :page-name="pageTitle">
        <template slot="header">
            <div class="flex align-items-center justify-content-between">
                {{pageTitle}}
                <PowerSavingAdvice></PowerSavingAdvice>
            </div>
        </template>
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
                            <vgis-col :span="18" class="full-h">
                                <vgis-cell class="full-h">
                                    <TaskRatio :time-range="timeRange"></TaskRatio>
                                </vgis-cell>
                            </vgis-col>
                            <vgis-col :span="45" class="full-h">
                                <vgis-cell class="full-h">
                                    <TaskTrend :time-range="timeRange"></TaskTrend>
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
import PowerOverview from "@/components/DashboardWidget/PowerSaving/Overview/PowerOverview.vue";
import PendingTaskList from "@/components/DashboardWidget/PowerSaving/Overview/PendingTaskList.vue";
import TaskRatio from "@/components/DashboardWidget/PowerSaving/Overview/TaskRatio.vue";
import TaskTrend from "@/components/DashboardWidget/PowerSaving/Overview/TaskTrend.vue";
import VgisDateSelector from "@/components/DashboardWidget/Shared/vgis-date-selector.vue";
import PowerSavingAdvice from "@/components/DashboardWidget/PowerSaving/PowerSavingAdvice.vue";

export default {
    name: "Overview",
    components: {
        PowerSavingAdvice,
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
            pageTitle: "节能管理概览",
            navs: [{
                name: "总览",
                link: "/"
            }, {
                name: "节能管理"
            }, {
                name: "节能概览"
            }],
            timeRange: [startDate, endDate]
        }
    }
}
</script>

<style scoped>

</style>