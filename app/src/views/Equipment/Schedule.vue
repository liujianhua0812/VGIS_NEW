<template>
    <vgis-page :navs="navs" :page-name="pageTitle">
        <div class="actions flex align-items-center justify-content-between">
            <div class="flex align-items-center">
                <el-button class="power-primary" size="small" type="primary">添加</el-button>
                <el-button class="power-danger-outline" size="small" type="danger">删除</el-button>
            </div>
            <div class="view-selector flex align-items-center">
                <i :class="['iconfont icon-table', { active: currentTab === 'table' }]" @click="currentTab = 'table'"></i>
                <i :class="['iconfont icon-calendar', { active: currentTab === 'calendar' }]" @click="currentTab = 'calendar'"></i>
            </div>
        </div>
        <vgis-row :gutter="24" style="height: calc(100% - 48px)">
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
import TableView from "@/components/DashboardWidget/Equipment/Schedule/TableView.vue";
import CalendarView from "@/components/DashboardWidget/Equipment/Schedule/CalendarView.vue";

export default {
    name: "Schedule",
    components: {
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
            pageTitle: "设备运行计划",
            navs: [{
                name: "总览",
                link: "/"
            }, {
                name: "设备管理"
            }, {
                name: "设备运行计划"
            }]
        }
    }
}
</script>

<style scoped>
.actions {
    margin-bottom: 16px;

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