<template>
  <div class="full-h">
      <vgis-sub-card no-header style="height: calc((100% - 16px) / 3)" :class="[{'m-b-8': index < stat.length - 1}]" v-for="(item, index) in stat">
          <div class="stat">
              <div class="indicator">{{item.label}}</div>
              <div class="value">
                  {{item.value}}
                  <small class="unit">{{item.unit}}</small>
              </div>
          </div>
      </vgis-sub-card>
  </div>
</template>

<script>
import VgisSubCard from "@/components/DashboardWidget/Shared/vgis-sub-card.vue";

export default {
    name: "EnergyStat",
    components: {
        VgisSubCard
    },
    data () {
        return {
            stat: [{
                label: "单位能耗",
                value: 25.5,
                unit: "kWh/m³"
            }, {
                label: "总电量",
                value: 25.5,
                unit: "kWh"
            }, {
                label: "总气量",
                value: 25.5,
                unit: "m³"
            }]
        }
    }
}
</script>

<style scoped>
  .stat {
      margin-top: 12px;
      margin-bottom: 8px;
      color: #FFF;
      /* Body/bold */
      font-family: "HarmonyOS Sans SC";
      font-style: normal;
      font-weight: 700;
      line-height: normal;

      .indicator {
          font-size: 14px;
      }

      .value {
          font-size: 24px;

          .unit {
              color: #8C8C8C;
              font-family: "HarmonyOS Sans SC";
              font-size: 12px;
              font-style: normal;
              font-weight: 400;
              line-height: normal;
          }
      }
  }
</style>