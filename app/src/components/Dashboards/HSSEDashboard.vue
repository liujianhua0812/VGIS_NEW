<template>
  <div id="app">
    <vue-headful :title="`${title}`"/>
    <vgis-row :gutter="30" class="m-t-15" style="height: calc(100% - 15px)">
      <!--24 24 24-->
      <vgis-col :span="24" class="full-h">
        <vgis-flex-column class="full-h">
          <vgis-cell style="height: 300px">
            <vgis-row :gutter="20" class="full-h">
              <vgis-col :span="36" class="full-h">
                <vgis-flex-column class="full-h">
                  <vgis-cell class="full-h">
                      <vgis-card title="Hours Worked">
                        <HoursWorked/>
                      </vgis-card>
                  </vgis-cell>
                </vgis-flex-column>
              </vgis-col>
              <vgis-col :span="36" >
                <vgis-cell class="full-h">
                  <vgis-card title="Safety Summary">
                    <SafeSummary/>
                  </vgis-card>
                </vgis-cell>
              </vgis-col>
            </vgis-row>
          </vgis-cell>
          <vgis-cell :grow="200" class="m-b-20">
            <vgis-row :gutter="20" class="full-h">
              <vgis-col :span="36">
                <vgis-card title="Monthly Work Site Safety">
                  <MonthlyWorkSiteSafety></MonthlyWorkSiteSafety>
                </vgis-card>
              </vgis-col>
              <vgis-col :span="36">
                <vgis-card title="Polluted Air Report">
                  <PollutedAirReport :time="new Date()"/>
                </vgis-card>
              </vgis-col>
            </vgis-row>
          </vgis-cell>
          <vgis-cell :grow="200" class="m-b-20" >
            <vgis-card title="Security Report">
              <SecurityReport :time="new Date()"/>
            </vgis-card>
          </vgis-cell>
        </vgis-flex-column>
      </vgis-col>
      <vgis-col :span="24" class="full-h">
        <HSSEMap class="p-b-20" map-name="Majnoon-HSSE"/>
      </vgis-col>
      <vgis-col :span="24" class="full-h">
        <vgis-flex-column class="full-h">
          <vgis-cell style="height: 170px" class="m-b-20">
            <vgis-card title="CCTV">
              <CCTV class="p-t-10"/>
            </vgis-card>
          </vgis-cell>
          <vgis-cell :grow="220"  class="m-b-20">
            <vgis-card title="E-mail Incident Statistics">
              <EmailIcidentStatistics :time="new Date()"/>
            </vgis-card>
          </vgis-cell>
          <vgis-cell :grow="220"  class="m-b-20">
            <vgis-card title="Prelim-Incident-Accident Statistics">
              <PIAStatistics :time="new Date()"/>
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
import VgisCard from "@/components/DashboardWidget/Shared/vgis-card";
import HSSEMap from "./HSSE/HSSEMap";
import SecurityReport from "./HSSE/SecurityReport";
import EmailIcidentStatistics from "./HSSE/EmailIcidentStatistics";
import PIAStatistics from "./HSSE/PIAStatistics";
import MonthlyWorkSiteSafety from "./HSSE/MonthlyWorkSiteSafety";
import HoursWorked from "./HSSE/HoursWorked";
import PollutedAirReport from "./HSSE/PollutedAirReport";
import CCTVchart from "./HSSE/CCTVchart";
import SafeSummary from "./HSSE/SafetySummary";
import CCTV from '@/components/DashboardWidget/HSSE/CCTV'


export default {
  name: "OverviewDashboard",
  components: {
    CCTV,
    SafeSummary,
    CCTVchart,
    PollutedAirReport,
    HoursWorked,
    MonthlyWorkSiteSafety,
    PIAStatistics,
    EmailIcidentStatistics,
    SecurityReport,
    HSSEMap,
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
      return "VGIS - HSSE Dashboard";
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
