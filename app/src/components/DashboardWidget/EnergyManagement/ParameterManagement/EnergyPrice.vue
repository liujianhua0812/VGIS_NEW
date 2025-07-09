<template>
    <vgis-card title="能源价格">
        <div class="flex align-items-center filters m-t-16">
            <energy-resources-selector v-model="resources"></energy-resources-selector>
        </div>
        <div class="m-t-16" style="height: calc(100% - 84px);">
            <ElectricityPriceEditor v-if="resources === '电'"></ElectricityPriceEditor>
            <GeneralEnergyPriceEditor v-else :energy="resources" :unit="unitMap[resources]"></GeneralEnergyPriceEditor>
        </div>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import EnergyResourcesSelector
    from "@/components/DashboardWidget/EnergyManagement/ParameterManagement/energy-resources-selector.vue";
import ElectricityPriceEditor from "@/components/DashboardWidget/EnergyManagement/ParameterManagement/ElectricityPriceEditor.vue";
import GeneralEnergyPriceEditor from "@/components/DashboardWidget/EnergyManagement/ParameterManagement/GeneralEnergyPriceEditor.vue";
import EnergyMonthSelector
    from "@/components/DashboardWidget/EnergyManagement/ParameterManagement/energy-month-selector.vue";

export default {
    name: "EnergyPrice",
    components: {
        EnergyMonthSelector,
        EnergyResourcesSelector,
        VgisCard,
        ElectricityPriceEditor,
        GeneralEnergyPriceEditor,
    },
    data () {
        return {
            resources: "电",
            unitMap: {
                水: "元/t",
                天然气: "元/m³",
                蒸汽: "元/GJ",
            }
        }
    }
}
</script>

<style scoped>
.filters {

    >i {
        color: #FFFFFF;
        font-family: "HarmonyOS Sans SC";
        font-size: 24px;
        font-style: normal;
        font-weight: 400;
        margin-right: 8px;
    }

    > label {
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