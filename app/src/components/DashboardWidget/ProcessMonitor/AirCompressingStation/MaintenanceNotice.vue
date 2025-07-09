<template>
    <vgis-sub-card title="保养提示">
        <div style="height: calc(100% - 36px);" class="m-t-16">
            <el-table
                class="ttb mini"
                header-row-class-name="ttb-header"
                header-cell-class-name="ttb-header-cell"
                row-class-name="ttb-row"
                cell-class-name="ttb-cell"
                height="100%"
                :data="records">
                <el-table-column label="保养设备" prop="device" :show-overflow-tooltip="true">
                    <template slot-scope="{ row }">
                        {{ row.device || "—" }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" prop="description" :show-overflow-tooltip="true">
                    <template slot-scope="{ row }">
                        {{ row.description || "—" }}
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
                time,
                device: devices[i % devices.length],
                description: "到期未保养"
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