<template>
    <div class="m-l-20" style="width: calc(100% - 40px);">
        <vgis-breadcrumb :navs="navs"></vgis-breadcrumb>
        <el-card style="min-height: calc(100% - 35px);" shadow="none">
            <div class="flex align-items-center justify-content-between m-b-25 m-t-0">
                <div class="flex align-items-center">
                    <el-input class="filter" style="width: 213px;" clearable v-model="filter.name"
                              @clear="refreshData" @keyup.enter.native="refreshData">
                        <template slot="append">
                            <el-button type="primary" icon="el-icon-search" @click="refreshData"></el-button>
                        </template>
                    </el-input>
                </div>
                <el-popover v-auth="{ resources: 'Process Diagram', action: 'Admin' }" trigger="manual" width="300"
                            v-model="visible">
                    <el-form @submit.native.prevent ref="addForm" :model="formData" :rules="rules" label-position="top">
                        <el-form-item size="small" :label="$t('form.pid.name.label')" prop="name">
                            <el-input :placeholder="$t('form.pid.name.placeholder')" v-model="formData.name"></el-input>
                        </el-form-item>
                        <el-form-item size="small" :label="$t('form.pid.file.label')" prop="pid">
                            <el-upload action="#" :multiple="false" :auto-upload="false" :show-file-list="false"
                                       :on-change="selectPID">
                                <el-button size="small" type="default">{{ $t("form.pid.file.select") }}</el-button>
                                <div slot="tip" class="el-upload__tip" v-if="formData.pid">{{ formData.pid.name }}</div>
                            </el-upload>
                        </el-form-item>
                        <el-button type="primary" @click="upload">{{ $t("action.submit") }}</el-button>
                    </el-form>
                    <el-button slot="reference" type="primary" icon="el-icon-plus" @click="visible = !visible">
                        {{ $t("action.add") }}
                    </el-button>
                </el-popover>
            </div>
            <div v-if="diagrams.length === 0" style="height: 300px;"
                 class="flex justify-content-center align-items-center text-info text-regular">
                {{ $t("message.pid.empty") }}
            </div>
            <el-row :gutter="20" v-else>
                <el-col :span="4" v-for="pid in diagrams" :key="pid.id" class="m-b-15">
                    <div class="noc-vgis-pid-card">
                        <div class="flex align-items-center justify-content-between">
                          <h3 class="text-bold p-l-15 p-r-15 p-t-10 p-b-10">
                            {{ pid.name }}
                          </h3>
                          <el-button type="default" class="el-icon-s-home m-r-10" circle size="mini" v-if="!pid.isDefault" @click="setPIDAsDefault(pid)"></el-button>
                          <el-button disabled type="primary" class="el-icon-s-home m-r-10" circle size="mini" v-else></el-button>
                        </div>
                        <img alt="" class="pid-thumbnail" :src="`data:image/svg+xml;base64,${pid.map}`"/>
                        <div class="full-w flex">
                            <div class="action text-primary" :title="$t('action.view')" @click="viewPIDDetail(pid)">
                                <i class="el-icon-view"></i>
                            </div>
                            <div class="action text-primary" :title="$t('action.edit')" @click="editPID(pid)">
                                <i class="el-icon-edit"></i>
                            </div>
                            <div class="action text-primary" :title="$t('action.rename')" @click="renamePID(pid)">
                                <i class="el-icon-edit-outline"></i>
                            </div>
                            <div class="action text-primary" :title="$t('action.publish')" @click="publishPID(pid)" v-if="!pid.published">
                                <i class="el-icon-finished"></i>
                            </div>
                            <div class="action text-danger" :title="$t('action.withdraw')" @click="withdrawPID(pid)" v-else>
                                <i class="el-icon-folder-delete"></i>
                            </div>
                            <div class="action text-danger" :title="$t('action.delete')" @click="deletePID(pid)">
                                <i class="el-icon-delete"></i>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-card>
        <RenameDiagram
            dialog-id="renamePID"
            v-if="dialogVisibility.renamePID"
            :dialog-visibility="dialogVisibility.renamePID"
            :pid="renamePIDData"
            @action-finished="actionFinished"
        ></RenameDiagram>
    </div>
</template>

<script>

import {validate} from "@/utils";
import VgisBreadcrumb from "../Standard/vgis-breadcrumb.vue"
import RenameDiagram from "@/components/Admin/PID/RenameDiagram.vue";
import {getDiagrams, removeDiagram, updateDiagram, uploadPID} from "@/assets/js/api/pid";

export default {
    name: "ProcessDiagramList",
    components: {
        VgisBreadcrumb,
        RenameDiagram
    },
    data() {
        return {
            navs: [{
                name: this.$t("menu.home"),
                url: '/admin'
            }, {
                name: this.$t("menu.pid")
            }],
            filter: {
                name: '',
            },
            rules: {
                name: [{ required: true, message: this.$t("form.pid.name.error.empty"), trigger: ["change", "blur"] }],
                pid: [{ required: true, message: this.$t("form.pid.file.error.empty"), trigger: ["change", "blur"] }]
            },
            formData: {
                name: '',
                pid: ''
            },
            dialogVisibility: {
                renamePID: false
            },
            renamePIDData: "",
            visible: false,
            diagrams: []
        }
    },
    methods: {
        validate,
        actionFinished (success, dialogId) {
            this.dialogVisibility[dialogId] = false
            if (success) {
                this.refreshData()
            }
        },
        selectPID(file) {
            if (file.name.substr(file.name.length - 3, 3) !== 'svg') {
                this.$message({
                    type: 'error',
                    message: 'SVG format only.',
                    showClose: true
                })
            } else {
                this.formData.pid = file.raw
            }
            return false
        },
        upload() {
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    uploadPID(this.formData).then(result => {
                        this.$message({
                            type: 'success',
                            message: this.$t("message.pid.created"),
                            showClose: true
                        })
                        this.visible = false
                        this.refreshData()
                    })
                }
            })
        },
        editPID (pid) {
            this.$router.push({name: 'ProcessDiagramEditor', params: {diagramId: pid.id}})
        },
        renamePID (pid) {
            this.renamePIDData = Object.assign({}, pid)
            this.dialogVisibility.renamePID = true
        },
        setPIDAsDefault (pid) {
          updateDiagram(pid.id, Object.assign({}, pid, { isDefault: true })).then(result => {
            this.$message({
              type: 'success',
              message: this.$t("message.pid.published"),
              showClose: true
            })
            this.refreshData()
          })
        },
        publishPID (pid) {
            updateDiagram(pid.id, Object.assign({}, pid, { published: true })).then(result => {
                this.$message({
                    type: 'success',
                    message: this.$t("message.pid.setAsDefault"),
                    showClose: true
                })
                this.refreshData()
            })
        },
        withdrawPID (pid) {
            updateDiagram(pid.id, Object.assign({}, pid, { published: false })).then(result => {
                this.$message({
                    type: 'success',
                    message: this.$t("message.pid.withdrawn"),
                    showClose: true
                })
                this.refreshData()
            })
        },
        viewPIDDetail(pid) {
            this.$router.push({name: 'ProcessDiagramDetail', params: {diagramId: pid.id}})
        },
        deletePID (pid) {
            this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
                confirmButtonText: this.$t("action.confirm"),
                cancelButtonText: this.$t("action.cancel"),
                type: 'warning'
            }).then(() => {
                removeDiagram(pid.id).then(result => {
                    this.$message({
                        type: 'success',
                        message: this.$t("message.pid.deleted"),
                        showClose: true
                    })
                    this.refreshData()
                })
            })
        },
        refreshData () {
            getDiagrams(this.filter).then(result => {
                this.diagrams = result.data
            })
        }
    },
    created() {
        this.refreshData ()
    }
}
</script>

<style lang="scss" scoped>
.noc-vgis-pid-card {
    background: #FFFFFF;
    border: 1px solid #4FACFF;
    box-sizing: border-box;
    border-radius: 4px;

    img.pid-thumbnail {
        display: block;
        background: #56617B;
        height: 150px;
        width: 100%;
        object-fit: contain;
    }

    p {
        height: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }

    .action {
        border-top: 1px solid #4FACFF;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        flex-grow: 1;
        cursor: pointer;
    }

    .action:hover {
        font-size: 18px;
    }
}
</style>
