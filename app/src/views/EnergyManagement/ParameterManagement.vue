<template>
    <vgis-page :navs="navs" :page-name="pageTitle">
        <div class="param-tabs">
            <span :class="['item', { active: activeTab === 'monthly' }]" @click="activeTab = 'monthly'">月度参数</span>
            <span :class="['item', { active: activeTab === 'energy' }]" @click="activeTab = 'energy'">能源价格</span>
            <span :class="['item', { active: activeTab === 'converter' }]"
                  @click="activeTab = 'converter'">转换因子</span>
        </div>
        <vgis-row :gutter="24" style="height: calc(100% - 48px)">
            <vgis-col :span="36" class="full-h" v-if="activeTab === 'monthly'">
                <vgis-cell class="full-h">
                    <MonthlyKPI></MonthlyKPI>
                </vgis-cell>
            </vgis-col>
            <vgis-col :span="36" class="full-h" v-if="activeTab === 'monthly'">
                <vgis-cell class="full-h">
                    <MonthlyProduction></MonthlyProduction>
                </vgis-cell>
            </vgis-col>
            <vgis-col :span="72" class="full-h" v-if="activeTab === 'energy'">
                <vgis-cell class="full-h">
                    <EnergyPrice></EnergyPrice>
                </vgis-cell>
            </vgis-col>
            <vgis-col :span="72" class="full-h" v-if="activeTab === 'converter'">
                <vgis-cell class="full-h">
                    <Converter></Converter>
                </vgis-cell>
            </vgis-col>
        </vgis-row>
    </vgis-page>
</template>

<script>
import VgisPage from "@/components/Standard/vgis-page.vue";
import Converter from "@/components/DashboardWidget/EnergyManagement/ParameterManagement/ConversionFactor.vue";
import EnergyPrice from "@/components/DashboardWidget/EnergyManagement/ParameterManagement/EnergyPrice.vue";
import MonthlyKPI from "@/components/DashboardWidget/EnergyManagement/ParameterManagement/MonthlyKPI.vue";
import MonthlyProduction from "@/components/DashboardWidget/EnergyManagement/ParameterManagement/MonthlyProduction.vue";
import VgisFlexColumn from "@/components/Standard/vgis-flex-column.vue";
import GeneralEnergyConsumption
    from "@/components/DashboardWidget/EnergyManagement/Overview/GeneralEnergyConsumption.vue";
import VgisRow from "@/components/Standard/vgis-row.vue";
import VgisCell from "@/components/Standard/vgis-cell.vue";
import VgisCol from "@/components/Standard/vgis-col.vue";

export default {
    name: "ParameterManagement",
    components: {
        VgisCol, VgisCell, VgisRow, GeneralEnergyConsumption, VgisFlexColumn,
        VgisPage,
        Converter,
        EnergyPrice,
        MonthlyKPI,
        MonthlyProduction
    },
    data() {
        return {
            pageTitle: "参数管理",
            navs: [{
                name: "总览",
                link: "/"
            }, {
                name: "能碳管理"
            }, {
                name: "参数管理"
            }],
            activeTab: "monthly"
        }
    },
}
</script>

<style scoped>
.param-tabs {
    margin-top: 16px;
    margin-bottom: 20px;

    .item {
        cursor: pointer;
        padding: 12px 0;
        margin-right: 32px;
        color: #FFFFFF;
        font-family: "HarmonyOS Sans SC";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
        border-bottom: 2px solid transparent;
    }

    .item.active {
        color: #40A9FF;
        border-bottom: 2px solid #40A9FF;
    }
}
</style>