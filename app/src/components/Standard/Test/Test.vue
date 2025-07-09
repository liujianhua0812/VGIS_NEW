<template>
  <div class="test">
    <vgis-header></vgis-header>
    <vgis-row :gutter="20" style="margin-top: 20px; height: calc(100% - 100px);">
      <vgis-col :span="72" style="height: 100%;">
        <vgis-flex-column style="height: 100%;">
          <vgis-cell>
            <vgis-title content="Alarm Monitoring"></vgis-title>
          </vgis-cell>
          <vgis-cell :grow="1">
            <vgis-row :gutter="20" style="margin-top: 10px;">
              <vgis-col :span="24">
                <vgis-card title="Alarm Statistics">
                  <alarm-mo-statistics></alarm-mo-statistics>
                </vgis-card>
              </vgis-col>
              <vgis-col :span="24">
                <vgis-card title="Cause Analysis">
                  <cause-xr-chart></cause-xr-chart>
                </vgis-card>
              </vgis-col>
              <vgis-col :span="24">
                <vgis-card title="Alarm Trend">
                  <realtime-alarm></realtime-alarm>
                </vgis-card>
              </vgis-col>
            </vgis-row>
          </vgis-cell>
          <vgis-cell style="margin-top: 20px;">
            <vgis-title content="Security Incident"></vgis-title>
          </vgis-cell>
          <vgis-cell :grow="1">
            <vgis-row :gutter="20" style="margin-top: 10px;">
              <vgis-col :span="32">
                <vgis-card title="Cause Analysis">
                  <cause-pie-chart></cause-pie-chart>
                </vgis-card>
              </vgis-col>
              <vgis-col :span="40">
                <vgis-card title="Overall by category">
                  <stacked-chart></stacked-chart>
                </vgis-card>
              </vgis-col>
            </vgis-row>
          </vgis-cell>
          <vgis-cell style="margin-top: 20px;">
            <vgis-title content="Population Monitoring"></vgis-title>
          </vgis-cell>
          <vgis-cell :grow="1" style="margin-bottom: 20px;">
            <vgis-row :gutter="20" style="margin-top: 10px;">
              <vgis-col :span="24">
                <vgis-card title="Daily in and out of suppliers">
                  <columnar-chart></columnar-chart>
                </vgis-card>
              </vgis-col>
              <vgis-col :span="24">
                <vgis-card title="Daily entry & exit details of each company">
                  <dailyentry></dailyentry>
                </vgis-card>
              </vgis-col>
              <vgis-col :span="24">
                <vgis-card title="Weekly statistics in & out of suppliers">
                  <dailyheadcount></dailyheadcount>
                </vgis-card>
              </vgis-col>
            </vgis-row>
          </vgis-cell>
        </vgis-flex-column>
      </vgis-col>
      <vgis-col :span="0" style="height: 100%;">
        <vgis-flex-column style="height: 100%;">
          <vgis-cell :grow="1">
            <vgis-card title="map"></vgis-card>
          </vgis-cell>
          <vgis-cell>
            <vgis-title content="Comprehensive Production"></vgis-title>
          </vgis-cell>
          <vgis-cell>
            <vgis-row :gutter="20" style="margin-top: 10px;">
              <vgis-col :span="24">
                <vgis-card style="height: 159px" no-header></vgis-card>
              </vgis-col>
              <vgis-col :span="24">
                <vgis-card style="height: 159px" no-header></vgis-card>
              </vgis-col>
              <vgis-col :span="24">
                <vgis-card style="height: 159px" no-header></vgis-card>
              </vgis-col>
            </vgis-row>
          </vgis-cell>
        </vgis-flex-column>
      </vgis-col>
      <vgis-col :span="0" style="height: 100%;">
        <vgis-flex-column style="height: 100%;">
          <vgis-cell>
            <vgis-title title="Real-time CCTV"></vgis-title>
          </vgis-cell>
          <vgis-cell :grow="560">
            <vgis-row :gutter="20">
              <vgis-col :span="36">
                <vgis-card title="Critical Region Monitoring"></vgis-card>
              </vgis-col>
              <vgis-col :span="36">
                <vgis-card title="Critical Region  Monitoring"></vgis-card>
              </vgis-col>
            </vgis-row>
          </vgis-cell>
          <vgis-cell :grow="339" style="margin-top: 10px; margin-bottom: 20px;">
            <vgis-row :gutter="20">
              <vgis-col :span="24">
                <vgis-card title="Regional Alarm Monitoring"></vgis-card>
              </vgis-col>
              <vgis-col :span="48">
                <vgis-card title="Alarm List"></vgis-card>
              </vgis-col>
            </vgis-row>
          </vgis-cell>
        </vgis-flex-column>
      </vgis-col>
    </vgis-row>
  </div>
</template>

<script>

    import VgisRow from '../vgis-row'
    import VgisCol from '../vgis-col'
    import VgisHeader from '../vgis-header'
    import VgisTitle from '../vgis-title'
    import VgisCard from '../vgis-card'
    import VgisFlexColumn from '../vgis-flex-column'
    import VgisCell from '../vgis-cell'
    import AlarmMoStatistics from "../../DashboardWidget/SplitScreen/HSSE/AlarmMoStatistics.vue";
    import causeXrChart from "../../DashboardWidget/SplitScreen/HSSE/causeXrChart";
    import RealtimeAlarm from "../../DashboardWidget/SplitScreen/HSSE/RealtimeAlarm";
    import causePieChart from "../../DashboardWidget/SplitScreen/HSSE/causePieChart";
    import StackedChart from "../../DashboardWidget/SplitScreen/HSSE/StackedChart";
    import ColumnarChart from "../../DashboardWidget/SplitScreen/HSSE/ColumnarChart";
    import Dailyentry from "../../DashboardWidget/SplitScreen/HSSE/Dailyentry";
    import Dailyheadcount from "../../DashboardWidget/SplitScreen/HSSE/Dailyheadcount";

    export default {
        name: "Test",
      components: {
          AlarmMoStatistics,
          causeXrChart,
          RealtimeAlarm,
          causePieChart,
          StackedChart,
          ColumnarChart,
          Dailyheadcount,
          Dailyentry,
          VgisHeader,
          VgisTitle,
          VgisCard,
          VgisRow,
          VgisCol,
          VgisFlexColumn,
          VgisCell
      }
    }
</script>

<style scoped>
  .test {
    width: 100%;
    height: 100%;
    padding: 0 20px;
    background: #081C31;
  }
</style>
