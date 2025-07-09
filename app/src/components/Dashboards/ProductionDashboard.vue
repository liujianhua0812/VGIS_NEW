<template>
  <div id="app">
    <vue-headful :title="`${title}`"/>
    <vgis-row :gutter="30" class="m-t-15" style="height: calc(100% - 15px)">
      <!--12 12 24 24-->
      <vgis-col :span="12" class="full-h">
        <vgis-flex-column class="full-h">
          <vgis-cell>
            <vgis-card title="Cumulative Production">
              <CumulativeProduction/>
            </vgis-card>
          </vgis-cell>
          <vgis-cell :grow="240">
            <vgis-card title="Monthly Oil Production">
              <MonthlyOilProduction/>
            </vgis-card>
          </vgis-cell>
          <vgis-cell :grow="240">
            <vgis-card title="Monthly Gas Production">
              <MonthlyGasProduction/>
            </vgis-card>
          </vgis-cell>
          <vgis-cell :grow="262">
            <vgis-card title="Monthly Oil Quality">
              <OilQualityMonitoring></OilQualityMonitoring>
            </vgis-card>
          </vgis-cell>
        </vgis-flex-column>
      </vgis-col>
      <vgis-col :span="12" class="full-h">
        <vgis-flex-column class="full-h">
          <vgis-cell :grow="634" class="m-b-20">
            <vgis-card title="Oil Production Fluctuation Analysis">
              <OilProductionFluctuationAnalysis/>
            </vgis-card>
          </vgis-cell>
          <vgis-cell class="m-b-20">
            <WellTabs/>
          </vgis-cell>
        </vgis-flex-column>
      </vgis-col>
      <vgis-col :span="24" class="full-h">
        <MapController class="p-b-20" map-name="Majnoon-Production"/>
      </vgis-col>
      <vgis-col :span="24" class="full-h">
        <vgis-flex-column class="full-h">
          <vgis-cell :grow="440">
            <vgis-row :gutter="20" class="full-h">
              <vgis-col :span="36" class="p-b-20">
                <vgis-card title="Well Status Change">
                  <HrsChokeTHP/>
                </vgis-card>
              </vgis-col>
              <vgis-col :span="36">
                <vgis-flex-column class="full-h">
                  <vgis-cell :grow="1">
                    <vgis-card title="Water by Wells">
                      <WaterByWells/>
                    </vgis-card>
                  </vgis-cell>
                  <vgis-cell :grow="1">
                    <vgis-card title="Oil by Wells">
                      <OilByWells/>
                    </vgis-card>
                  </vgis-cell>
                </vgis-flex-column>
              </vgis-col>
            </vgis-row>
          </vgis-cell>
          <vgis-cell :grow="220" class="m-b-20">
            <vgis-row :gutter="20" class="full-h">
              <vgis-col :span="36">
                <vgis-card title="Top 10 Oil Production Wells">
                  <TopTenOilProductionWells/>
                </vgis-card>
              </vgis-col>
              <vgis-col :span="36">
                <vgis-card title="Oil Production by Formation (2022)">
                  <OilProductionByFormation/>
                </vgis-card>
              </vgis-col>
            </vgis-row>
          </vgis-cell>

          <vgis-cell class="m-b-20" style="height: 200px">
            <vgis-card title="Miscellaneous">
              <Miscellaneous/>
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
        import VgisCard from "@/components/DashboardWidget/Shared/vgis-card";
        import MapController from "@/components/DashboardWidget/Production/MapController"
        import CumulativeProduction from "./Production/CumulativeProduction";
        import MonthlyOilProduction from "./Production/MonthlyOilProduction";
        import MonthlyGasProduction from "./Production/MonthlyGasProduction";
import OilProductionFluctuationAnalysis from './Production/OilProductionFluctuationAnalysis/index'
import WellTabs from "./Production/WellTabs";
import Miscellaneous from "./Production/Miscellaneous";
import OilQualityMonitoring from "./Production/OilQualityMonitoring";
import HrsOnlineByWells from "./Production/HrsOnlineByWells";
import ChokeByWells from "./Production/ChokeByWells";
import WaterByWells from "./Production/WaterByWells";
import OilByWells from "./Production/OilByWells";
import TopTenOilProductionWells from "./Production/TopTenOilProductionWells";
import OilProductionByFormation from "./Production/OilProductionbyFormation";
import HrsChokeTHP from "./Production/HrsChokeTHP";

export default {
  name: "OverviewDashboard",
  components: {
    HrsChokeTHP,
    OilProductionByFormation,
    TopTenOilProductionWells,
    OilByWells,
    WaterByWells,
    ChokeByWells,
    HrsOnlineByWells,
    OilQualityMonitoring,
    Miscellaneous,
    WellTabs,
    OilProductionFluctuationAnalysis,
    MonthlyGasProduction,
    MonthlyOilProduction,
    CumulativeProduction,
    MapController,
    MajnoonTargetDevPlan,
    DailyOilProductionComparison,
    WellDrilingPlan,
    WellStatus,
    GasProductionMonitoring,
    OilProductionMonitoring,
    OilProduction,
    VgisRow,
    VgisCol,
    VgisFlexColumn,
    VgisCell,
    VgisCard,
    VgisTitle,
  },
  data() {
    return {};
  },
  computed: {
    title() {
      return "VGIS - Production Dashboard";
    }
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
* {
  font-family: HarmonyOS_Sans;
}
</style>
