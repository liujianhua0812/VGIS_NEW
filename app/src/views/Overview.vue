<template>
  <div class="overview">
      <vue-headful :title="`${title}`"/>
      <vgis-row :gutter="24" class="full-h">
          <vgis-col :span="18" class="full-h">
              <vgis-flex-column class="full-h">
                  <vgis-cell :grow="1">
                      <GeneralEnergyConsumption></GeneralEnergyConsumption>
                  </vgis-cell>
              </vgis-flex-column>
          </vgis-col>
          <vgis-col :span="36" class="full-h">
              <vgis-flex-column class="full-h">
                  <vgis-cell :grow="2" class="m-b-24">
                      <ThreeDScene></ThreeDScene>
                  </vgis-cell>
                  <vgis-cell :grow="1">
                      <TaskAndMalfunctionList></TaskAndMalfunctionList>
                  </vgis-cell>
              </vgis-flex-column>
          </vgis-col>
          <vgis-col :span="18" class="full-h">
              <vgis-flex-column class="full-h">
                  <vgis-cell class="m-b-24">
                      <KeyFactors></KeyFactors>
                  </vgis-cell>
                  <vgis-cell class="m-b-24">
                        <EnergyEfficiencyIndex></EnergyEfficiencyIndex>
                  </vgis-cell>
                  <vgis-cell :grow="1">
                        <EnergyTrend></EnergyTrend>
                  </vgis-cell>
              </vgis-flex-column>
          </vgis-col>
      </vgis-row>
  </div>
</template>

<script>

import VgisRow from "@/components/Standard/vgis-row"
import VgisFlexColumn from "@/components/Standard/vgis-flex-column"
import VgisCol from "@/components/Standard/vgis-col"
import VgisCell from "@/components/Standard/vgis-cell"

import GeneralEnergyConsumption from "@/components/DashboardWidget/Overview/GeneralEnergyConsumption.vue";
import EnergyEfficiencyIndex from "@/components/DashboardWidget/Overview/EnergyEfficiencyIndex.vue";
import EnergyTrend from "@/components/DashboardWidget/Overview/EnergyTrend.vue";
import ThreeDScene from "@/components/DashboardWidget/Overview/ThreeDScene.vue";
import TaskAndMalfunctionList from "@/components/DashboardWidget/Overview/TaskAndMalfunctionList.vue";
import KeyFactors from "@/components/DashboardWidget/Overview/KeyFactors.vue";

import config from "@/config"
export default {
    name: "Overview",
    components: {
        VgisRow,
        VgisCol,
        VgisFlexColumn,
        VgisCell,
        GeneralEnergyConsumption,
        EnergyEfficiencyIndex,
        EnergyTrend,
        ThreeDScene,
        TaskAndMalfunctionList,
        KeyFactors
    },
    computed: {
        title () {
            return `${config.name} - 概览`
        }
    }
}
</script>

<style lang="scss" scoped>
    .overview {
        margin: 24px;
        height: calc(100% - 60px);
    }
</style>