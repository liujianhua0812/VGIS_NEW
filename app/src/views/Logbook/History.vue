<template>
    <vgis-page :navs="navs" :page-name="pageTitle" background>
        <div class="filters p-t-24 m-b-24 flex align-items-center justify-content-between">
            <div class="flex align-items-center">
                <label class="m-l-0">只看我的</label>
                <el-switch></el-switch>
            </div>
        </div>
        <el-table
                class="ttb"
                header-row-class-name="ttb-header"
                header-cell-class-name="ttb-header-cell"
                row-class-name="ttb-row"
                cell-class-name="ttb-cell"
                height="calc(100% - 110px)"
                :data="records">
            <el-table-column width="70px">
                <template slot="header">
                    <el-checkbox :indeterminate="IsIndeterminate" v-model="checkAll" @change="toggleAll"></el-checkbox>
                </template>
                <template slot-scope="{ row }">
                    <el-checkbox v-model="row.checked" @change="toggleIndeterminate"></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column label="时间" width="190px">
                <template slot-scope="{ row }">
                    {{ row.time.format("yyyy-MM-dd hh:mm:ss") }}
                </template>
            </el-table-column>
            <el-table-column label="处理人" prop="recorder" width="210px">
                <template slot-scope="{ row }">
                    {{ row.recorder || "—" }}
                </template>
            </el-table-column>
            <el-table-column label="操作内容" prop="description" :show-overflow-tooltip="true">
                <template slot-scope="{ row }">
                    {{ row.description || "—" }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="90px">
                <template slot-scope="{ row }">
                    <el-button type="text" class="p-0">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="vgis-pagination">
            <el-pagination
                    class="pull-right"
                    hide-on-single-page
                    :background="false"
                    :total="1024"
                    :page-count="10"
                    :page-size="20"
                    :pager-count="5"
                    layout="total, prev, pager, next, sizes, jumper"
            ></el-pagination>
        </div>
    </vgis-page>
</template>

<script>
import VgisPage from "@/components/Standard/vgis-page.vue";
import VgisDeviceSelector from "@/components/DashboardWidget/Shared/vgis-device-selector.vue";
import VgisPersonSelector from "@/components/DashboardWidget/Shared/vgis-person-selector.vue";
import VgisSimpleDatetimeSelector from "@/components/DashboardWidget/Shared/vgis-simple-datetime-selector.vue";
import VgisStatusSelector from "@/components/DashboardWidget/Shared/vgis-status-selector.vue";

export default {
    name: "History",
    components: {
        VgisStatusSelector,
        VgisSimpleDatetimeSelector,
        VgisPersonSelector,
        VgisDeviceSelector,
        VgisPage
    },
    data() {

        let records = []
        let now = new Date().getTime()
        let devices = ["冷机", "空压机", "冷却水泵"]
        let status = ["pending", "unsolved", "solved"]
        for (let i = 0; i < 10; i++) {
            let time = new Date(now)
            time.setMinutes(i * 6)
            let s = status[i % status.length]
            records.push({
                time,
                description: "设备有不必要的超额能耗，请在不需要使用时及时停机",
                recorder: s !== "pending" ? "张三" : null,
                checked: false
            })
        }

        return {
            pageTitle: "操作日志",
            checkAll: false,
            isIndeterminate: false,
            navs: [{
                name: "总览",
                link: "/"
            }, {
                name: "操作日志"
            }],
            records
        }
    },
    methods: {
        toggleAll (value) {
            // if (value) {
            //     for(let i = 0; i < this.records.length; i++) {
            //
            //     }
            // }
        },
        toggleIndeterminate (value) {
            // this.isIndeterminate = this.records.find(item => item.checked)
        }
    }
}
</script>

<style lang="scss" scoped>
.filters {

  i {
    color: #FFFFFF;
    font-family: "HarmonyOS Sans SC";
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    margin-right: 8px;
  }

  label {
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