<template>
    <vgis-page :navs="navs" :page-name="pageTitle">
        <template slot="header">
            <div class="flex align-items-center justify-content-between">
                {{pageTitle}}
                <div class="actions flex align-items-center justify-content-between">
                    <div class="view-selector flex align-items-center">
                        <i :class="['iconfont icon-table', { active: currentTab === 'table' }]" @click="currentTab = 'table'"></i>
                        <i :class="['iconfont icon-calendar', { active: currentTab === 'calendar' }]" @click="currentTab = 'calendar'"></i>
                    </div>
                </div>
            </div>
        </template>
        <vgis-row :gutter="24" class="full-h">
            <vgis-col :span="12" class="full-h">
                <vgis-cell class="full-h">
                    <VgisDeviceTreeCard check-strictly v-model="selectedDevice"></VgisDeviceTreeCard>
                </vgis-cell>
            </vgis-col>
            <vgis-col :span="60" class="full-h">
                <vgis-cell class="full-h">
                    <TableView v-if="currentTab === 'table'" :device="selectedDevice"></TableView>
                    <CalendarView v-if="currentTab === 'calendar'" :device="selectedDevice"></CalendarView>
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
import TableView from "@/components/DashboardWidget/Maintenance/Schedule/TableView.vue";
import CalendarView from "@/components/DashboardWidget/Maintenance/Schedule/CalendarView.vue";
import PowerSavingAdvice from "@/components/DashboardWidget/PowerSaving/PowerSavingAdvice.vue";

export default {
    name: "Schedule",
    components: {
        PowerSavingAdvice,
        CalendarView,
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
            selectedDevice: [],
            currentTab: "table",
            pageTitle: "维保计划",
            navs: [{
                name: "总览",
                link: "/"
            }, {
                name: "维保管理"
            }, {
                name: "维保计划"
            }]
        }
    }
}
</script>

<style scoped>

.actions {
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
}
</style>