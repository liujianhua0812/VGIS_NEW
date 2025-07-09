<template>
    <vgis-page :navs="navs" :page-name="pageTitle" background>
        <template slot="header">
            <div class="flex align-items-center">
                {{pageTitle}}
                <div class="hint flex align-items-center">
                    <i class="el-icon-alarm-clock"></i>
                    <small>历史记录仅保留七天</small>
                </div>
            </div>
        </template>
        <div class="filters p-t-24 m-b-24 flex align-items-center justify-content-between">
            <div class="flex align-items-center">
                <i class="iconfont icon-filter"></i>
                <label class="m-l-8">时间段</label>
                <vgis-simple-date-selector style="width: 250px;"></vgis-simple-date-selector>
                <el-button class="power-primary m-l-32" size="small" type="primary">导出</el-button>
            </div>
        </div>
        <div style="width: 50%; height: calc(100% - 86px);">
            <el-table
                    class="ttb"
                    header-row-class-name="ttb-header"
                    header-cell-class-name="ttb-header-cell"
                    row-class-name="ttb-row"
                    cell-class-name="ttb-cell"
                    height="calc(100% - 30px)"
                    :data="records">
                <el-table-column width="70px">
                    <template slot="header">
                        <el-checkbox :indeterminate="IsIndeterminate" v-model="checkAll" @change="toggleAll"></el-checkbox>
                    </template>
                    <template slot-scope="{ row }">
                        <el-checkbox v-model="row.checked" @change="toggleIndeterminate"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column label="导出时间" width="190px">
                    <template slot-scope="{ row }">
                        {{ row.exportAt.format("yyyy-MM-dd hh:mm:ss") }}
                    </template>
                </el-table-column>
                <el-table-column label="报告名称" width="190px">
                    <template slot-scope="{ row }">
                        {{ row.name }}
                    </template>
                </el-table-column>
                <el-table-column label="时段范围">
                    <template slot-scope="{ row }">
                        {{ row.period[0].format("yyyy-MM-dd hh:mm:ss") }}至{{ row.period[1].format("yyyy-MM-dd hh:mm:ss") }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="90px">
                    <template slot-scope="{ row }">
                        <el-button type="text" class="p-0">下载</el-button>
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
        </div>
    </vgis-page>
</template>

<script>
import VgisPage from "@/components/Standard/vgis-page.vue";
import VgisDeviceSelector from "@/components/DashboardWidget/Shared/vgis-device-selector.vue";
import VgisPersonSelector from "@/components/DashboardWidget/Shared/vgis-person-selector.vue";
import VgisSimpleDatetimeSelector from "@/components/DashboardWidget/Shared/vgis-simple-datetime-selector.vue";
import VgisStatusSelector from "@/components/DashboardWidget/Shared/vgis-status-selector.vue";
import VgisSimpleDateSelector from "@/components/DashboardWidget/Shared/vgis-simple-date-selector.vue";
import CarbonAssetSelector from "@/components/DashboardWidget/EnergyManagement/CarbonAsset/carbon-asset-selector.vue";

export default {
    name: "CarbonReport",
    components: {
        CarbonAssetSelector,
        VgisSimpleDateSelector,
        VgisStatusSelector,
        VgisSimpleDatetimeSelector,
        VgisPersonSelector,
        VgisDeviceSelector,
        VgisPage
    },
    data() {
        let records = []
        let now = new Date()
        let types = [
            "开发绿证绿电",
            "买入绿证绿电",
            "开发CCER",
            "买入CCER",
            "发放配额",
        ]
        let names = [
            "华特气体",
            "邮储银行",
            "金山办公",
            "海油发展",
        ]
        for (let i = 0; i < 10; i++) {
            let start = new Date(now.getTime())
            let end = new Date(now.getTime())
            let exportAt = new Date(now.getTime())
            start.setDate(start.getDate() - 30)
            end.setDate(end.getDate() - 20)
            exportAt.setDate(exportAt.getDate() - i)
            records.push({
                id: i + 1,
                name: names[i % names.length],
                period: [start, end],
                exportAt,
                type: types[i % types.length],
                price: Math.round(Math.random() * 100000),
                carbon: Math.round(Math.random() * 1000000),
                description: "设备有不必要的超额能耗，请在不需要使用时及时停机",
                attachments: Math.random() > 0.5 ? ["交易证书.pdf"] : [],
                recorder: "张三",
                checked: false
            })
        }

        return {
            pageTitle: "碳盘查报告",
            checkAll: false,
            isIndeterminate: false,
            navs: [{
                name: "总览",
                link: "/"
            }, {
                name: "能碳管理"
            }, {
                name: "碳盘查报告"
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

  >i {
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

.hint {
  color: #BFBFBF;
  font-family: "HarmonyOS Sans SC";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px; /* 157.143% */
  margin-left: 16px;

  i {
    color: #40A9FF;
    margin-right: 5px;
  }
}
</style>