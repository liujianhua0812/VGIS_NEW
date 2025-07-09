<template>
    <div class="m-20">
        <el-card class="m-b-20">
            <div class="flex align-items-center justify-content-between">
                <el-form @submit.native.prevent class="ac-dlg">
                    <el-form-item class="m-t-0 m-b-0">
                        <el-input v-model="filter.query" placeholder="Query by name"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 添加 -->
                <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
                    <div>
                        <el-form :model="roamData" ref="accountForm">
                            <el-form-item label="Roamname" :label-width="formLabelWidth">
                                <el-input v-model="roamData.accountName" autocomplete="off"></el-input>
                            </el-form-item>
                            <!-- <el-form-item label="Role" :label-width="formLabelWidth">
                  <el-select v-model="roamData.roleId" placeholder="Please select a role" class="accountsSelect"
                    :disabled="roamData.isSuper" clearable>
                    <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item> -->
                            <el-form-item label="Circling" :label-width="formLabelWidth">
                                <el-switch v-model="switchValue" active-text="Yes" inactive-text="No">
                                </el-switch>
                            </el-form-item>
                            <el-form-item label="ResidenceTime" :label-width="formLabelWidth">
                                <el-input v-model="roamData.accountName" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                    </span>
                </el-dialog>
                <el-popover v-auth="{ resources: 'Data', action: 'Admin' }" trigger="manual" width="300"
                    v-model="visible">
                    <el-form @submit.native.prevent label-position="top">
                        <el-form-item size="small" label="Name">
                            <el-input placeholder="Input name" v-model="formData.name"></el-input>
                        </el-form-item>
                        <el-form-item size="small" label="Path File">
                            <el-upload action="#" :multiple="false" :auto-upload="false" :show-file-list="false"
                                :on-change="selectRoute">
                                <el-button size="small" type="default">Select a File</el-button>
                                <div slot="tip" class="el-upload__tip" v-if="formData.route">{{formData.route.name}}
                                </div>
                            </el-upload>
                        </el-form-item>
                        <el-button type="primary" @click="upload">Submit</el-button>
                    </el-form>
                    <el-button slot="reference" type="primary" @click="visible = !visible">Upload</el-button>
                </el-popover>
            </div>
        </el-card>
        <el-card>
            <el-table :data="roamingRoutes">
                <el-table-column label="Name" prop="name"></el-table-column>
                <el-table-column label="Stops">
                    <template slot-scope="scope">
                        {{scope.row.stops.join('—')}}
                    </template>
                </el-table-column>
                <el-table-column label="Settings">
                    <template slot-scope="scope">
                        <ul>
                            <li v-for="(value,property) in scope.row.settings">
                                <b>{{property}}: </b>{{value}}
                            </li>
                        </ul>
                    </template>
                </el-table-column>
                <el-table-column label="Action">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-view" type="text" @click="viewDetail(scope.row)">View</el-button>
                        <el-button icon="el-icon-edit" type="text" @click="editRoam(scope.row)">Edit</el-button>
                        <el-button icon="el-icon-download" type="text" @click="download(scope.row)">Download</el-button>
                        <el-button v-auth="{ resources: 'Data', action: 'Admin' }" icon="el-icon-delete"
                            class="text-danger" type="text" @click="remove(scope.row)">Delete
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
    import { getRoutes, removeRoute, uploadRoute } from "../../assets/js/api/roaming";
    import { removeDiagram } from "../../assets/js/api/pid";
    export default {
        name: "RoamingList",
        data() {
            return {
                dialogVisible: false,
                formLabelWidth: "140px",
                switchValue: '',
                roamData: {},
                filter: {
                    query: ''
                },
                formData: {
                    name: '',
                    route: ''
                },
                visible: false,
                route: {
                    routeName: '',
                    circling: true, //是否环绕
                    stop: [{
                        name: '',
                        poi: true,
                        position: [],
                        rotation: [],
                        speed: 2,
                        tag: ''
                    }]
                },
                roamingRoutes: []
            }

        },
        methods: {
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => { });
            },
            selectRoute(file) {
                if (file.name.substr(file.name.length - 3, 3) !== 'fpf') {
                    this.$message({
                        type: 'error',
                        message: 'FPF format only.',
                        showClose: true
                    })
                }
                else {
                    this.formData.route = file.raw
                }
                return false
            },
            upload() {
                uploadRoute(this.formData).then(result => {
                    this.$message({
                        type: 'success',
                        message: 'Route uploaded successfully.',
                        showClose: true
                    })
                    this.refresh()
                    this.visible = false
                })
            },
            downloadFile(route) {
                console.log(route.id, "导出")
            },
            editRoam(route) {
                this.dialogVisible = true
            },
            viewDetail(route) {
                this.$router.push({ name: 'RoamingDetail', params: { routeId: route.id } })
            },
            remove(route) {
                this.$confirm('Action cannot be reversed, are you sure?', 'Warning', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    removeRoute(route.id).then(result => {
                        this.$message({
                            type: 'success',
                            message: 'Route deleted successfully.',
                            showClose: true
                        })
                        this.refresh()
                    })
                })
            },
            toFPF() {
                // 把json转化成fpf后缀的svg文件，存成file对象
            },
            refresh() {
                getRoutes(this.filter).then(result => {
                    this.roamingRoutes = result.data
                })
            }
        },
        created() {
            this.refresh()
        }
    }

</script>
