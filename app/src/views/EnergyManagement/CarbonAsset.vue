<template>
    <vgis-page :navs="navs" :page-name="pageTitle" background>
        <div class="filters p-t-24 m-b-24 flex align-items-center justify-content-between">
            <div class="flex align-items-center">
                <el-button class="power-primary" size="small" type="primary" @click="addRecord">添加</el-button>
                <el-button class="power-danger-outline m-r-32" size="small" type="danger" @click="bulkDeleteRecords">删除</el-button>
                <i class="iconfont icon-filter"></i>
                <label class="m-l-8">类型</label>
                <carbon-asset-selector v-model="filter.typeId" @input="getRecords(null, true)"></carbon-asset-selector>
                <label>日期范围</label>
                <vgis-simple-date-selector style="width: 250px;" v-model="filter.dealAt" @input="getRecords(null, true)"></vgis-simple-date-selector>
            </div>
        </div>
        <el-table
                class="ttb"
                header-row-class-name="ttb-header"
                header-cell-class-name="ttb-header-cell"
                row-class-name="ttb-row"
                cell-class-name="ttb-cell"
                height="calc(100% - 110px)"
                :data="records"
                :key="rowKey"
        >
            <el-table-column width="70px">
                <template slot="header">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @input="toggleAll"></el-checkbox>
                </template>
                <template slot-scope="{ row }">
                    <el-checkbox v-model="row.checked" @input="toggleIndeterminate"></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column label="编号" width="190px">
                <template slot-scope="{ row }">
                    {{ row.assetId }}
                </template>
            </el-table-column>
            <el-table-column label="名称" width="190px">
                <template slot-scope="{ row }">
                    {{ row.name }}
                </template>
            </el-table-column>
            <el-table-column label="类型" width="190px">
                <template slot-scope="{ row }">
                    {{ row.asset_type.name }}
                </template>
            </el-table-column>
            <el-table-column label="交易日期">
                <template slot-scope="{ row }">
                    {{ new Date(row.dealAt).format("yyyy-MM-dd") }}
                </template>
            </el-table-column>
            <el-table-column label="金额（元）" width="190px">
                <template slot-scope="{ row }">
                    {{ row.price.toLocaleString() }}
                </template>
            </el-table-column>
            <el-table-column label="碳排放量（t）" width="190px">
                <template slot-scope="{ row }">
                    {{ row.carbon.toLocaleString() }}
                </template>
            </el-table-column>
            <el-table-column label="参考资料">
                <template slot-scope="{ row }">
                    {{(row.media_files || []).length === 0 ? "—" : ""}}
                    <div v-for="file in row.media_files" class="pointer" @click="downloadFile(file)">
                        <a class="text-link no-decoration">{{file.name}}</a>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="填写人" prop="recorder" width="140px">
                <template slot-scope="{ row }">
                    {{ row.user ? row.user.realName : "—" }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="130px">
                <template slot-scope="{ row }">
                    <el-button type="text" class="p-0" @click="editRecord(row)">编辑</el-button>
                    <el-button type="text" class="p-0 text-brown" @click="deleteRecord(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="vgis-pagination">
            <el-pagination
                class="pull-right"
                :background="false"
                :current-page="pagination.page"
                :total="pagination.total"
                :page-size="pagination.pagination"
                :pager-count="5"
                @current-change="updatePage"
                @size-change="updatePageSize"
                layout="total, prev, pager, next, sizes, jumper"
            ></el-pagination>
        </div>
        <AddEditAsset
            :record="formData"
            dialog-id="addEditRecord"
            v-if="dialogVisibilities.addEditRecord"
            :dialog-visibility="dialogVisibilities.addEditRecord"
            @action-finished="actionFinished"
        ></AddEditAsset>
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
import AddEditAsset from "@/components/DashboardWidget/EnergyManagement/CarbonAsset/AddEditAsset.vue";
import {getGeneralPrice} from "@/assets/js/api/price";
import {bulkDeleteCarbonAsset, deleteCarbonAsset, getCarbonAssetsList} from "@/assets/js/api/catbon-asset";
import { getFile } from "@/assets/js/api/media-file";
import {downloadFile} from "@/utils";

export default {
    name: "CarbonAsset",
    components: {
        AddEditAsset,
        CarbonAssetSelector,
        VgisSimpleDateSelector,
        VgisStatusSelector,
        VgisSimpleDatetimeSelector,
        VgisPersonSelector,
        VgisDeviceSelector,
        VgisPage
    },
    data() {
        return {
            filter: {
                typeId: "",
                dealAt: []
            },
            pageTitle: "碳资产管理",
            navs: [{
                name: "总览",
                link: "/"
            }, {
                name: "能碳管理"
            }, {
                name: "碳资产管理"
            }],
            checkAll: false,
            isIndeterminate: false,
            rowKey: Math.random(),
            records: [],
            formData: {},
            dialogVisibilities: {
                addEditRecord: false
            },
            pagination: {}
        }
    },
    methods: {
        actionFinished (success, dialogId) {
            this.dialogVisibilities[dialogId] = false
            if (success) {
                this.getRecords(this.pagination.page, false)
            }
        },
        updatePage (page) {
            this.getRecords(page, false)
        },
        updatePageSize (size) {
            this.pagination.pagination = size
            this.getRecords(this.pagination.page, false)
        },
        downloadFile (file) {
            getFile(file.id).then(result => {
                downloadFile(file.name, result.data)
                this.$message({
                    message: this.$t("message.media.downloaded"),
                    type: "success",
                    showClose: true,
                    duration: 3000,
                })
            })
        },
        getRecords (page, refresh = false) {
            this.pagination.page = refresh ? 1 : page
            getCarbonAssetsList(Object.assign({}, this.filter, this.pagination)).then(result => {
                this.records = result.data.map(item => {
                    item.checked = false
                    return item
                })
                this.pagination = result.pagination
            })
        },
        addRecord () {
            this.formData = {
                assetId: "",
                name: "",
                typeId: "",
                period: [],
                price: "",
                carbon: ""
            }
            this.dialogVisibilities.addEditRecord = true
        },
        editRecord (record) {
            this.formData = Object.assign({}, record, {
                period: [new Date(record.startAt), new Date(record.endAt)],
                attachments: record.media_files
            })
            this.dialogVisibilities.addEditRecord = true
        },
        deleteRecord (record) {
            this.$confirm("操作不可撤销，确定要删除吗？").then(() => {
                deleteCarbonAsset(record.id).then(result => {
                    this.$message({
                        message: "删除成功！",
                        showClose: true,
                        duration: 3000,
                        type: "success"
                    })
                    this.getRecords(this.pagination.page, false)
                })
            })
        },
        bulkDeleteRecords () {
            this.$confirm("操作不可撤销，确定要删除吗？").then(() => {
                bulkDeleteCarbonAsset({
                    recordIds: this.records.filter(item => item.checked).map(item => item.id)
                }).then(result => {
                    this.$message({
                        message: "删除成功！",
                        showClose: true,
                        duration: 3000,
                        type: "success"
                    })
                    this.getRecords(this.pagination.page, false)
                })
            })
        },
        toggleAll () {
            let allChecked = this.records.reduce((result, item) => result && item.checked, true)
            this.checkAll = !allChecked;
            this.isIndeterminate = false
            for(let i = 0; i < this.records.length; i++) {
                this.records[i].checked = this.checkAll
            }
            this.rowKey = Math.random()
        },
        toggleIndeterminate () {
            let allChecked = this.records.reduce((result, item) => result && item.checked, true)
            let allUnchecked = !(this.records.reduce((result, item) => result || item.checked, false))
            this.checkAll = allChecked
            this.isIndeterminate = !(allChecked || allUnchecked)
            this.rowKey = Math.random()
        }
    },
    created() {
        this.getRecords(null, true)
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
</style>