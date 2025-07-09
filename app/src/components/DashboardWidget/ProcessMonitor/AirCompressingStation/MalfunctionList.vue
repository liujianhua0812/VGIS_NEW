<template>
  <vgis-sub-card title="报警详情">
      <div style="height: calc(100% - 36px);" class="m-t-16">
          <el-table
                  class="ttb mini"
                  header-row-class-name="ttb-header"
                  header-cell-class-name="ttb-header-cell"
                  row-class-name="ttb-row"
                  cell-class-name="ttb-cell"
                  height="100%"
                  :data="records">
              <el-table-column label="故障类型" prop="type" width="144px"></el-table-column>
              <el-table-column label="关联设备" prop="device" :show-overflow-tooltip="true">
                  <template slot-scope="{ row }">
                      {{ row.device || "—" }}
                  </template>
              </el-table-column>
              <el-table-column label="等级" width="85px">
                  <template slot-scope="{ row }">
                      <div :class="['alert', `alert-${row.level}`]">{{row.level}}</div>
                  </template>
              </el-table-column>
              <el-table-column label="时间" width="190px">
                  <template slot-scope="{ row }">
                      {{ row.time.format("yyyy-MM-dd hh:mm:ss") }}
                  </template>
              </el-table-column>
              <el-table-column label="操作" width="90px">
                  <template slot-scope="{ row }">
                      <el-button type="text" class="p-0">处理</el-button>
                  </template>
              </el-table-column>
          </el-table>
      </div>
  </vgis-sub-card>
</template>

<script>
import VgisSubCard from "@/components/DashboardWidget/Shared/vgis-sub-card.vue";

export default {
    name: "MalfunctionList",
    components: {VgisSubCard},
    data () {
        let records = []
        let now = new Date().getTime()
        let types = ["传感器", "机组导出故障", "需求不满足"]
        let devices = ["冷机", "空压机", "冷却水泵"]
        let status = ["pending", "undetermined", "solved"]
        for(let i = 0; i < 10; i++) {
            let time = new Date(now)
            time.setMinutes(i * 6)
            let s = status[i % status.length]
            records.push({
                id: i + 1,
                time,
                type: types[i % types.length],
                level: (i % 3) + 1,
                device: devices[i % devices.length],
                description: "设备有不必要的超额能耗，请在不需要使用时及时停机",
                status: s,
                solveTime: s !== "pending" ? time : null,
                solution: s !== "pending" ? "已按照任务描述处理" : null,
                solver: s !== "pending" ? "张三" : null,
                lastTime: s !== "pending" ? 1.5 : null
            })
        }
        return {
            records
        }
    }
}
</script>

<style scoped>

</style>