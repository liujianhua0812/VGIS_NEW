<template>
    <vgis-card title="能耗指标">
        <el-button class="power-primary m-t-16 m-b-26" size="small" @click="addRecord">添加</el-button>
        <el-table
            class="ttb"
            header-row-class-name="ttb-header"
            header-cell-class-name="ttb-header-cell"
            row-class-name="ttb-row"
            cell-class-name="ttb-cell"
            height="calc(100% - 126px)"
            :data="pageData"
        >
            <el-table-column label="年月">
                <template slot-scope="{ row }">
                    {{ new Date(row.time).format('yyyy-MM') }}
                </template>
            </el-table-column>
            <el-table-column :label="`能耗指标${series.unit ? `（${series.unit.name}）` : ''}`">
                <template slot-scope="{ row }">
                    {{ row.value }}
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
        <AddEditMonthlyKPI
            :station="station"
            :series="series"
            :record="formData"
            dialog-id="addEditRecord"
            v-if="series && station && dialogVisibilities.addEditRecord"
            :dialog-visibility="dialogVisibilities.addEditRecord"
            @action-finished="actionFinished"
        ></AddEditMonthlyKPI>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import {getNodesByModel, getSeriesHistoryValues} from "@/assets/js/api/hierarchy";
import {getTimeSeriesList} from "@/assets/js/api/model-series";
import {deleteInstanceSeriesValue} from "@/assets/js/api/model-instance-series";
import AddEditMonthlyKPI from "@/components/DashboardWidget/EnergyManagement/ParameterManagement/AddEditMonthlyKPI.vue";

export default {
    name: "MonthlyKPI",
    components: {
        AddEditMonthlyKPI,
        VgisCard
    },
    computed: {
        pageData () {
            let start = (this.pagination.page - 1) * this.pagination.pagination
            return this.records.slice(start, start + this.pagination.pagination)
        }
    },
    data () {
        return {
            records: [],
            formData: {},
            dialogVisibilities: {
                addEditRecord: false
            },
            pagination: {
                page: 1,
                total: 0,
                pagination: 10
            },
            station: "",
            series: ""
        }
    },
    methods: {
        actionFinished (success, dialogId) {
            this.dialogVisibilities[dialogId] = false
            if (success) {
                this.refreshData()
            }
        },
        updatePage (page) {
            this.pagination.page = page
        },
        updatePageSize (size) {
            this.pagination.pagination = size
        },
        addRecord () {
            this.formData = {
                time: "",
                value: ""
            }
            this.dialogVisibilities.addEditRecord = true
        },
        editRecord (record) {
            this.formData = Object.assign({}, record)
            this.dialogVisibilities.addEditRecord = true
        },
        deleteRecord (record) {
            this.$confirm("操作不可撤销，确定要删除吗？").then(() => {
                deleteInstanceSeriesValue(this.station.id, {
                    ids: [record.id]
                }).then(result => {
                    this.$message({
                        message: "删除成功！",
                        showClose: true,
                        duration: 3000,
                        type: "success"
                    })
                    this.refreshData()
                })
            })
        },
        getSeries () {
            getNodesByModel("总场站").then(result => {
                this.station = result.data[0]
            })
            getTimeSeriesList("StationTop").then(result => {
                this.series = result.data.find(item => item.name === "能耗指标")
            })
        },
        refreshData () {
            getSeriesHistoryValues("总场站", ["能耗指标"], {}).then(result => {
                this.records = result.data["能耗指标"] ? result.data["能耗指标"].values : []
                this.pagination.total = this.records.length
            })
        }
    },
    created() {
        this.getSeries()
        this.refreshData()
    }
}
</script>

<style scoped>

</style>