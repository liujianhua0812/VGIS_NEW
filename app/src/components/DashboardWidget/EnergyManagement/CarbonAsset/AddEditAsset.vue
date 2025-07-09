<template>
    <el-dialog class="power-dialog" width="600px" title="配置转换因子" :visible.sync="dialogVisibility" @closed="close">
        <el-form class="power-form" label-position="top" ref="form" :model="formData" :rules="rules">
            <el-row :gutter="24">
                <el-col :span="12">
                    <el-form-item label="项目编号" prop="assetId">
                        <el-input v-model="formData.assetId" placeholder="请输入项目编号"></el-input>
                    </el-form-item>
                    <el-form-item label="项目类型" prop="typeId">
                        <el-select placeholder="请选择类型" clearable style="width: 100%;" v-model="formData.typeId">
                            <el-option v-for="type in types" :key="type.id" :value="type.id" :label="type.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="金额" prop="price">
                        <el-input type="number" v-model="formData.price" placeholder="请输入金额">
                            <template slot="suffix">元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="项目名称" prop="name">
                        <el-input v-model="formData.name" placeholder="请输入项目名称"></el-input>
                    </el-form-item>
                    <el-form-item label="交易时间" prop="period">
                        <el-date-picker type="date" placeholder="请选择交易时间" clearable style="width: 100%;" v-model="formData.dealAt">
                            <template slot="range-separator">—</template>
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="碳排放量" prop="carbon">
                        <el-input type="number" v-model="formData.carbon" placeholder="请输入碳排放量">
                            <template slot="suffix">t</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="参考资料上传">
                <div class="full-w">
                    <el-upload :action="mediaAPIPath" multiple show-file-list :on-change="getFileList" :on-remove="getFileList" :file-list="fileList">
                        <el-button class="power-primary el-icon-upload" size="small"> 点击上传</el-button>
                    </el-upload>
                </div>
            </el-form-item>
        </el-form>
        <div class="text-center">
            <el-button class="power-primary" @click="submit">保存</el-button>
            <el-button class="power-danger-outline" @click="close">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import ConverterSelector
    from "@/components/DashboardWidget/EnergyManagement/ParameterManagement/factor-selector.vue";
import { getAssetTypes, createCarbonAsset, updateCarbonAsset } from "@/assets/js/api/catbon-asset";
import config from "@/config";

export default {
    name: "AddEditAsset",
    components: {
        ConverterSelector
    },
    props: {
        dialogId: String,
        dialogVisibility: Boolean,
        record: Object
    },
    computed: {
        mediaAPIPath () {
            return `${config.backend.host}media`
        }
    },
    data () {
        return {
            rules: {
                assetId: [{ required: true, message: "请输入资产编号！", trigger: ["change", "blur"] }],
                name: [{ required: true, message: "请输入资产名称！", trigger: ["change", "blur"] }],
                typeId: [{ required: true, message: "请选择资产类型！", trigger: ["change", "blur"] }],
                dealAt: [{ required: true, message: "请选择资产的交易时间！", trigger: ["change", "blur"] }],
                price: [{ required: true, message: "请设置价格！", trigger: ["change", "blur"] }],
                carbon: [{ required: true, message: "请设置碳资产对应的碳排放量！", trigger: ["change", "blur"] }],
            },
            formData: {
                assetId: "",
                name: "",
                typeId: "",
                dealAt: "",
                price: "",
                carbon: "",
                attachments: []
            },
            fileList: [],
            types: []
        }
    },
    methods: {
        close () {
            this.$emit("action-finished", false, this.dialogId);
        },
        getFileList (file, fileList) {
            this.formData.attachments = fileList.filter(item => item.id || (item.response && item.response.data && item.response.data.id)).map(item => item.id || item.response.data.id)
        },
        getTypes () {
            getAssetTypes().then(result => {
                this.types = result.data
            })
        },
        submit () {
            this.$refs.form.validate(valid => {
                if (valid) {
                    [this.formData.startAt, this.formData.endAt] = this.formData.period
                    let action = null
                    if (this.formData.id) {
                        action = updateCarbonAsset(this.formData.id, this.formData)
                    }
                    else {
                        action = createCarbonAsset(this.formData)
                    }
                    action.then(result => {
                        this.$message({
                            message: "设置成功！",
                            showClose: true,
                            duration: 3000,
                            type: "success"
                        })
                        this.$emit("action-finished", true, this.dialogId);
                    })
                }
            })
        }
    },
    created() {
        this.getTypes()
        this.formData = Object.assign({}, this.record)
        this.fileList = [].concat(this.record.attachments)
        this.formData.attachments = this.record.attachments.map(item => item.id)
    }
}
</script>

<style scoped>

</style>