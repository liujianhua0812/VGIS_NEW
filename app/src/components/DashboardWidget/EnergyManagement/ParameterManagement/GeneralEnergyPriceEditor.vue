<template>
    <div style="width: 50%; height: 100%;">
        <div class="filters m-b-26 flex align-items-center">
            <el-button class="power-primary" size="small" @click="addRecord">添加</el-button>
            <label>日期范围</label>
            <vgis-simple-date-selector v-model="filter.timeRange" style="width: 250px;" @input="getRecords(null, true)"></vgis-simple-date-selector>
        </div>
        <el-table
                class="ttb"
                header-row-class-name="ttb-header"
                header-cell-class-name="ttb-header-cell"
                row-class-name="ttb-row"
                cell-class-name="ttb-cell"
                height="calc(100% - 96px)"
                :data="records"
        >
            <el-table-column label="时间范围">
                <template slot-scope="{ row }">
                    <div v-if="row.startAt && row.endAt">
                        {{ new Date(row.startAt).format('yyyy-MM-dd') }} 至 {{ new Date(row.endAt).format('yyyy-MM-dd') }}
                    </div>
                    <div v-else-if="!row.startAt && !row.endAt">
                        不限
                    </div>
                    <div v-else>
                        {{ row.startAt ? new Date(row.startAt).format('yyyy-MM-dd') : "不限" }} 至 {{ row.endAt ? new Date(row.endAt).format('yyyy-MM-dd') : "不限" }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column :label="`单价（${unit}）`">
                <template slot-scope="{ row }">
                    {{ row.price }}
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
        <AddEditEnergyPrice
            :record="formData"
            :energy="{ name: energy, unit }"
            dialog-id="addEditPrice"
            v-if="dialogVisibilities.addEditPrice"
            :dialog-visibility="dialogVisibilities.addEditPrice"
            @action-finished="actionFinished"
        ></AddEditEnergyPrice>
    </div>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import AddEditEnergyPrice
    from "@/components/DashboardWidget/EnergyManagement/ParameterManagement/AddEditEnergyPrice.vue";
import { getGeneralPrice, deletePriceRecord } from "@/assets/js/api/price";
import VgisSimpleDateSelector from "@/components/DashboardWidget/Shared/vgis-simple-date-selector.vue";
import {deleteFactorValue, getFactorValues} from "@/assets/js/api/factor";

export default {
    name: "GeneralEnergyPriceEditor",
    props: {
        energy: String,
        unit: String
    },
    components: {
        VgisSimpleDateSelector,
        VgisCard,
        AddEditEnergyPrice
    },
    watch: {
        energy (newValue) {
            this.getRecords(null, true)
        }
    },
    data () {
        return {
            filter: {
                timeRange: []
            },
            records: [],
            formData: {},
            dialogVisibilities: {
                addEditPrice: false
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
        addRecord () {
            this.formData = {
                period: [],
                price: ""
            }
            this.dialogVisibilities.addEditPrice = true
        },
        editRecord (record) {
            this.formData = Object.assign({}, record, {
                period: [new Date(record.startAt), new Date(record.endAt)]
            })
            this.dialogVisibilities.addEditPrice = true
        },
        getRecords (page, refresh = false) {
            this.pagination.page = refresh ? 1 : page
            getGeneralPrice(Object.assign({}, this.filter, this.pagination, { energy: this.energy })).then(result => {
                this.records = result.data
                this.pagination = result.pagination
            })
        },
        deleteRecord (record) {
            this.$confirm("操作不可撤销，确定要删除吗？").then(() => {
                deletePriceRecord(record.id).then(result => {
                    this.$message({
                        message: "删除成功！",
                        showClose: true,
                        duration: 3000,
                        type: "success"
                    })
                    this.getRecords(this.pagination.page, false)
                })
            })
        }
    },
    created() {
        this.getRecords(null, true)
    }
}
</script>

<style scoped>
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