<template>
    <div>
        <el-dialog class="power-dialog" append-to-body width="700px" title="节能建议" :visible.sync="dialogVisibility" @closed="close">
            <el-table
                class="ttb"
                header-row-class-name="ttb-header"
                header-cell-class-name="ttb-header-cell"
                row-class-name="ttb-row"
                cell-class-name="ttb-cell"
                :data="advices"
            >
                <el-table-column label="序号" width="90px">
                    <template slot-scope="{ row, $index }">{{$index + 1}}</template>
                </el-table-column>
                <el-table-column label="相关设备设施">
                    <template slot-scope="{ row, rowIndex }">{{row.facility || "—"}}</template>
                </el-table-column>
                <el-table-column label="建议内容" show-overflow-tooltip>
                    <template slot-scope="{ row, rowIndex }">{{row.description || "—"}}</template>
                </el-table-column>
                <el-table-column label="操作" width="90px">
                    <template slot-scope="{ row, $index }">
                        <el-button type="text" class="p-0" @click="submit(row, $index)">采纳</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <el-button class="power-primary" size="mini" @click="dialogVisibility = true">节能建议</el-button>
    </div>
</template>

<script>
export default {
    name: "PowerSavingAdvice",
    props: {
        level: String
    },
    data () {
        return {
            dialogVisibility: false,
            advices: [{
                facility: "2#冷却塔",
                description: "冷却水回水效率不够，建议增加"
            }, {
                facility: "3#冷却塔",
                description: "冷却水回水效率不够，建议增加"
            }, {
                facility: "4#冷却塔",
                description: "冷却水回水效率不够，建议增加"
            }, {
                facility: "5#冷却塔",
                description: "冷却水回水效率不够，建议增加"
            }]
        }
    },
    methods: {
        close () {
            this.dialogVisibility = false
        },
        submit (row, index) {
            this.advices.splice(index, 1)
            this.$message({
                message: "已根据建议创建节能任务，请及时指派人员予以处理！",
                showClose: true,
                duration: 3000,
                type: "success"
            })
        }
    }
}
</script>

<style scoped>
.info-label {
    color: #BFBFBF;
    font-family: "HarmonyOS Sans SC";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
}

.info {
    margin-top: 8px;
    margin-bottom: 16px;
    color: #FFF;
    font-family: "HarmonyOS Sans SC";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
}

.device-card {
    margin-top: 8px;
    padding: 12px;
    border-radius: 8px;
    background: #003A8C;
}

.divider {
    height: 100%;
    width: 1px;
    background: red;
}
</style>