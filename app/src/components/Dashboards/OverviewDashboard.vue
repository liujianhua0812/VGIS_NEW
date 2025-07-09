<template>
  <div id="app">
    <vue-headful :title="`${title}`"/>
    <!-- 18 36 18-->
    <vgis-row :gutter="30" class="m-t-15" style="height: calc(100% - 15px)">
      <vgis-col :span="18" class="full-h">
        <vgis-flex-column class="full-h">
          <vgis-cell :grow="1">
            <vgis-card title="Oil Production">
              <OilProduction/>
            </vgis-card>
          </vgis-cell>
          <vgis-cell :grow="1" class="m-b-20">
            <vgis-row :gutter="20" class="full-h">
              <vgis-col :span="24">
                <vgis-card title="Daily Oil Production Comparison">
                  <DailyOilProductionComparison/>
                </vgis-card>
              </vgis-col>
              <vgis-col :span="48">
                <vgis-card title="Reservoir Production Dynamic">
                  <ReservoirProductionDynamic/>
                </vgis-card>
              </vgis-col>
            </vgis-row>
          </vgis-cell>
          <vgis-cell :grow="1" class="m-b-20">
            <vgis-row :gutter="20" class="full-h">
              <vgis-col :span="24">
                <vgis-card title="Well Driling Plan">
                  <WellDrilingPlan/>
                </vgis-card>
              </vgis-col>
              <vgis-col :span="48">
                <vgis-card title="Majnoon 600K Target Development Plan">
                  <MajnoonTargetDevPlan/>
                </vgis-card>
              </vgis-col>
            </vgis-row>
          </vgis-cell>
        </vgis-flex-column>
      </vgis-col>
      <vgis-col :span="36" class="full-h">
        <vgis-flex-column class="full-h">
        <vgis-cell :grow="2">
          <MapController class="p-b-20" map-name="Majnoon-Production"/>
        </vgis-cell>
        <vgis-cell :grow="1" class="m-b-20">
          <vgis-row :gutter="20" class="full-h">
            <vgis-col :span="24">
              <vgis-card title="Oil Production Monitoring">
                <OilProductionMonitoring/>
              </vgis-card>
            </vgis-col>
            <vgis-col :span="24">
              <vgis-card title="Gas Production Monitoring">
                <GasProductionMonitoring/>
              </vgis-card>
            </vgis-col>
            <vgis-col :span="24">
              <vgis-card title="Well Status">
                <WellStatus/>
              </vgis-card>
            </vgis-col>
          </vgis-row>
        </vgis-cell>
        </vgis-flex-column>
      </vgis-col>
      <vgis-col :span="18" class="full-h">
        <vgis-flex-column class="full-h">
          <vgis-cell style="height: 244px">
            <vgis-card title="Security">
              <CCTV/>
            </vgis-card>
          </vgis-cell>
          <vgis-cell :grow="1" class="m-b-20">
            <vgis-card
              title="Process Flow Diagram">
              <dynamic-p-i-d-panel map-name="Demo" instanceId="Majnoon" :dynamic="false"></dynamic-p-i-d-panel>
            </vgis-card>
          </vgis-cell>
        </vgis-flex-column>
      </vgis-col>
    </vgis-row>
  </div>
</template>
<script>
// import VgisCard from "@/components/Standard/vgis-card";
import VgisRow from "@/components/Standard/vgis-row";
import VgisCol from "@/components/Standard/vgis-col";
import VgisFlexColumn from "@/components/Standard/vgis-flex-column";
import VgisCell from "@/components/Standard/vgis-cell";
import VgisTitle from "@/components/Standard/vgis-title";
import OilProduction from './Overview/OilProduction'
import OilProductionMonitoring from "./Overview/OilProductionMonitoring";
import GasProductionMonitoring from "./Overview/GasProductionMonitoring";
import WellStatus from "./Overview/WellStatus";
import WellDrilingPlan from "./Overview/WellDrilingPlan";
import DailyOilProductionComparison from "./Overview/DailyOilProductionComparison";
import MajnoonTargetDevPlan from './Overview/MajnoonTargetDevPlan'
import DynamicPIDPanel from "@/components/DashboardWidget/Shared/DynamicPIDPanel";
import VgisCard from "@/components/DashboardWidget/Shared/vgis-card";
import CCTV from "@/components/DashboardWidget/Overview/CCTV"
import MapController from "@/components/DashboardWidget/Production/MapController"
import AnnualProductionMonitoring from "./Overview/AnnualProductionMonitoring";
import ReservoirProductionDynamic from "./Overview/ReservoirProductionDynamic";

export default {
  name: "OverviewDashboard",
  components: {
    ReservoirProductionDynamic,
    AnnualProductionMonitoring,
    MapController,
    MajnoonTargetDevPlan,
    DailyOilProductionComparison,
    WellDrilingPlan,
    WellStatus,
    GasProductionMonitoring,
    OilProductionMonitoring,
    OilProduction,
    DynamicPIDPanel,
    VgisRow,
    VgisCol,
    VgisFlexColumn,
    VgisCell,
    VgisCard,
    VgisTitle,
    CCTV,
  },
  data() {
    return {};
  },
  computed: {
    title() {
      return "VGIS - Overview Dashboard";
    }
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
* {
  font-family: HarmonyOS_Sans serif;
}
</style>
