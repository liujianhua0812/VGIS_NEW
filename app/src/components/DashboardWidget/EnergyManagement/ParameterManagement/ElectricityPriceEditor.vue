<template>
    <div class="full-h">
        <div class="title m-b-16">24小时分时价格</div>
        <el-form ref="form" class="m-b-20" :model="formData" :rules="rules">
            <el-form-item prop="month" size="small">
                <div class="label">月份选择</div>
                <energy-month-selector v-model="formData.month"></energy-month-selector>
            </el-form-item>
            <el-row :gutter="12" v-for="i in 3">
                <el-col :span="2" v-for="j in 8">
                    <div class="form-item">
                        <el-form-item :prop="`price_${(i - 1) * 8 + (j - 1)}`" size="small">
                            <div class="label">{{(i - 1) * 8 + (j - 1)}}-{{(i - 1) * 8 + j}}</div>
                            <el-input placeholder="请输入" v-model="formData[`price_${(i - 1) * 8 + (j - 1)}`]">
                                <template slot="suffix">元/kWh</template>
                            </el-input>
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="2" v-if="i === 3">
                    <div class="label">&nbsp;</div>
                    <el-button class="power-primary" size="small" @click="saveForm">保存</el-button>
                    <el-button class="power-danger-outline" size="small" @click="clearForm">清空</el-button>
                </el-col>
            </el-row>
        </el-form>
        <el-table
                class="ttb"
                header-row-class-name="ttb-header"
                header-cell-class-name="ttb-header-cell"
                row-class-name="ttb-row"
                cell-class-name="ttb-cell"
                height="calc(100% - 400px)"
                :data="records"
                :key="rowKey"
        >
            <el-table-column label="年月" width="110px">
                <template slot-scope="{ row }">
                    {{ new Date(row.month).format('yyyy-MM') }}
                </template>
            </el-table-column>
            <el-table-column :label="i" v-for="i in 24">
                <template slot-scope="{ row }">
                    {{ row[`price_${i - 1}`] }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="230px">
                <template slot-scope="{ row }">
                    <el-button type="text" class="p-0" @click="editRecord(row)">编辑</el-button>
                    <el-button type="text" class="p-0 text-brown" @click="deleteRecord(row)">删除</el-button>
                    <el-button type="text" class="p-0" @click="copyToForm(row)">复制到输入框</el-button>
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
    </div>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import EnergyMonthSelector
    from "@/components/DashboardWidget/EnergyManagement/ParameterManagement/energy-month-selector.vue";
import {
    getElectricityPrice,
    createElectricityPriceRecord,
    updateElectricityPriceRecord,
    deleteElectricityPriceRecord,
    getGeneralPrice
} from "@/assets/js/api/price";

export default {
    name: "ElectricityPrice",
    components: {
        EnergyMonthSelector,
        VgisCard
    },
    computed: {
        rules () {
            let result = {
                month: [{ required: true, message: "请选择年月", trigger: ["input", "change"] }]
            }
            for(let i = 0; i < 24; i++) {
                result[`price_${i}`] = [{ required: true, message: "请输入费用", trigger: ["input", "change"] }]
            }

            return result
        }
    },
    data () {
        let forms = {
            month: ""
        }
        for(let i = 0; i < 24; i++) {
            forms[`price_${i}`] = ""
        }
        return {
            pagination: {
                pagination: 6
            },
            formData: forms,
            records: [],
            rowKey: Math.random()
        }
    },
    methods: {
        updatePage (page) {
            this.getRecords(page, false)
        },
        updatePageSize (size) {
            this.pagination.pagination = size
            this.getRecords(this.pagination.page, false)
        },
        clearForm () {
            this.formData.month = ""
            for(let i = 0; i < 24; i++) {
                this.formData[`price_${i}`] = ""
            }
        },
        saveForm () {
            this.$refs.form.validate(valid => {
                if (valid) {
                    updateElectricityPriceRecord(this.formData).then(result => {
                        this.$message({
                            message: "保存成功！",
                            showClose: true,
                            duration: 3000,
                            type: "success"
                        })
                        this.getRecords(this.pagination.page, false)
                    })
                }
            })
        },
        editRecord (record) {
            this.formData.month = record.month
            this.copyToForm(record)
        },
        deleteRecord (record) {
            this.$confirm("操作不可撤销，确定要删除吗？").then(() => {
                deleteElectricityPriceRecord(record.id).then(result => {
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
        getRecords (page, refresh = false) {
            this.pagination.page = refresh ? 1 : page
            getElectricityPrice(Object.assign({}, this.pagination)).then(result => {
                this.records = result.data
                this.pagination = result.pagination
            })
        },
        copyToForm (record) {
            for(let i = 0; i < 24; i++) {
                this.formData[`price_${i}`] = record[`price_${i}`]
            }
        }
    },
    created() {
        this.getRecords(null, true)
    }
}
</script>

<style scoped>
    .title {
        color: #FFFFFF;
        font-family: "HarmonyOS Sans SC";
        font-size: 20px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    }

    .form-item {
         div.label {
             color: #FFFFFF;
             font-family: "HarmonyOS Sans SC";
             font-size: 14px;
             font-style: normal;
             font-weight: 400;
             line-height: 22px; /* 157.143% */
         }

        input {
            color: #FFFFFF;
            border-radius: 3px;
            border: 1px solid #0050B3;
            background: #003A8C;
        }

        input::placeholder {
            color: rgba(255, 255, 255, 0.45);
            white-space: nowrap;
            font-family: "HarmonyOS Sans SC";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
        }

        span.el-input__suffix {
            color: #FFFFFF;
        }
    }
</style>