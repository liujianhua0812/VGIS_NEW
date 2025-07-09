<template>
  <div class="full-h">
      <vgis-sub-card no-header style="height: calc((100% - 16px) / 3)" :class="[{'m-b-8': index < stat.length - 1}]" v-for="(item, index) in stat">
          <div class="stat">
              <div class="indicator">{{item.label}}</div>
              <div class="value">{{item.value}}</div>
          </div>
      </vgis-sub-card>
  </div>
</template>

<script>
import VgisSubCard from "@/components/DashboardWidget/Shared/vgis-sub-card.vue";

export default {
    name: "StatusStat",
    components: {
        VgisSubCard
    },
    data () {
        return {
            stat: [{
                label: "运行",
                value: 12,
            }, {
                label: "停机",
                value: 1,
            }, {
                label: "离线",
                value: 0,
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
      }
  }
</style>