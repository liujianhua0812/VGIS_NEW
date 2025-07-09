<template>
  <div class="full m-l-20">
    <vgis-breadcrumb :navs="navs"></vgis-breadcrumb>
    <el-card style="min-height: calc(100% - 35px);" shadow="none">
      <div class="flex align-items-center justify-content-between m-b-25 m-t-0">
        <div class="flex align-items-center">
          <el-input class="filter" v-model="filter.query" clearable @clear="refresh"@keyup.native.enter="refresh">
            <template slot="append">
              <el-button type="primary" icon="el-icon-search" @click="refresh"></el-button>
            </template>
          </el-input>
        </div>
        <div>
          <el-button v-auth="{ resources: 'Roaming Path', action: 'Admin' }" plain type="primary" icon="el-icon-plus" @click="dialogVisible = true">{{$t("action.add")}}</el-button>
        </div>
      </div>
      <el-table header-cell-class-name="table-header-cell" cell-class-name="table-cell" :data="roamingRoutes">
        <el-table-column :label="$t('model.roaming.name')" prop="name"></el-table-column>
        <el-table-column :label="$t('model.roaming.stops')">
          <template slot-scope="scope">
            <el-popover placement="bottom" trigger="hover">
              <div>
                <el-timeline :reverse="reverse">
                  <el-timeline-item v-for="item in scope.row.stops" :key="item.id" color="#fff" size-="normal">
                    {{(!item.hasRelation ? item.name : `${item.equipName} (ID: ${item.equipTag})`)}}
                  </el-timeline-item>
                </el-timeline>
                <br/>
              </div>
              <span slot="reference">{{scope.row.stops.map(item => !item.hasRelation ? item.name : item.equipName).join('—')}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column :label="$t('model.roaming.settings')">
          <template slot-scope="scope">
            <ul>
              <li>
                <b class="settingName">{{$t('label.roaming.loop')}}: </b>
                <span v-if="!scope.row.config.loop" style="color: red;">{{$t('dict.bool.false')}}</span>
                <span v-else style="color: lightGreen;">{{$t('dict.bool.true')}}</span>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label.basic.action')">
          <template slot-scope="scope">
            <el-button v-auth="{ resources: 'Roaming Path', action: 'Admin' }" icon="el-icon-edit" type="text" @click="editRoamPath(scope.row)">{{$t("action.edit")}}</el-button>
            <el-button icon="el-icon-view" type="text" @click="viewDetail(scope.row)">{{$t("action.view")}}</el-button>
            <el-button v-auth="{ resources: 'Roaming Path', action: 'Admin' }" icon="el-icon-delete" class="text-danger" type="text"
                       @click="remove(scope.row)">{{$t("action.delete")}}
            </el-button>
<!--            <el-button icon="el-icon-download" type="text" @click="downloadFile(scope.row)">Download</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog v-auth="{ resources: 'Roaming Path', action: 'Admin' }" :title="$t('form.title.addRoute')" :visible.sync="dialogVisible" class="addNewDialog" width="463px"
               :before-close="handleClose">
      <div>
        <span style="color: #4FACFF;">{{$t("model.roaming.name")}}</span>
        <el-input v-model="newRouteName"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addNewPath" class="diaButton" style="margin-right: 6px;">{{$t("action.confirm")}}</el-button>
        <el-button @click="dialogVisible = false" class="diaButton">{{$t("action.cancel")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

  import VgisBreadcrumb from "../Standard/vgis-breadcrumb.vue"
  import {getRoutes, removeRoute, uploadRoute, getRouteFile} from "../../assets/js/api/roaming";

  export default {
    name: "RoamingList",
    components: {
      VgisBreadcrumb
    },
    data() {
      return {
        navs: [{
          name: this.$t("menu.home"),
          url: '/admin'
        }, {
          name: this.$t("menu.roaming")
        }],
        reverse: true,
        filter: {
          query: ''
        },
        formData: {
          name: '',
          route: ''
        },
        newRouteName: '',
        visible: false,
        dialogVisible: false,
        roamingRoutes: [],
        stops: []
      }
    },
    methods: {
      viewDetail(route) {
        this.$router.push({name: 'RoamingDetail', params: {routeId: route.id}})
      },
      addNewPath() {
        if (!this.newRouteName || !this.newRouteName.replace(/(^\s*)|(\s*$)/g, "")) {
          this.$message({
            message: 'Please enter a name!',
            type: 'warning'
          });
          return
        }
        this.dialogVisible = false
        this.$router.push({name: 'RoamingEditorNew', query: {routeName: this.newRouteName}})
      },
      editRoamPath(route) {
        this.$router.push({name: 'RoamingEditor', params: {routeId: route.id}})
      },
      downloadFile(route) {
        let params = {
          routeId: route.id,
        }
        getRouteFile(params).then(result => {
          this.saveJsonFile(result, route.name + ".fpf")
        })
      },
      saveJsonFile(data, filename) {
        if (!filename) filename = 'console.json'
        if (typeof data === "object") data = JSON.stringify(data)
        let blob = new Blob([data], {type: 'text/xml'})
        let e = document.createEvent('MouseEvents')
        let a = document.createElement('a')
        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
      },
      remove(route) {
        this.$confirm(this.$t('message.shared.confirm'), {
          confirmButtonText: this.$t("action.confirm"),
          cancelButtonText: this.$t("action.cancel"),
          type: 'warning'
        }).then(() => {
          removeRoute(route.id).then(result => {
            this.$message({
              type: 'success',
              message: this.$t("message.roaming.deleted"),
              showClose: true
            })
            this.refresh()
          })
        })
      },
      refresh() {
        getRoutes(this.filter).then(result => {
          this.roamingRoutes = result.data
        })
      },
      handleClose(done) {
        done();
      }
    },
    created() {
      this.refresh()
    }
  }
</script>
<style>
  .roamingList .el-button--text {
    color: #333;
    padding: 5px 0px;
  }

  .roamingList :deep(.el-input__inner) {
    background: #fff !important;
    border: 1px solid #DCDFE6 !important;
    color: #606266 !important;
    width: 100% !important;
  }

  .el-message-box__status.el-icon-warning {
    display: none;
  }

  .el-message-box__status + .el-message-box__message {
    padding-left: 0px;

  }

  .el-message-box__header {
    border-bottom: 1px solid #D8D8D8;
    padding: 18px 15px 15px;
  }

  .el-message-box__message span {
    font-size: 16px;
    font-family: HarmonyOS_Sans_Medium;
    color: #333333;
    line-height: 23px;
    margin-bottom: 5px;
    display: inline-block;
  }

  .roamingList .el-message-box__title {
    font-size: 20px !important;
  }

  .el-message-box__message p {
    font-size: 16px;
  }

  .el-message-box__btns {
    text-align: center;
    display: inline-block;
    margin-left: 53px;
    padding: 5px 15px 15px;
  }

  .el-message-box__btns button:nth-child(2) {
    width: 128px;
    height: 32px;
    background: #B33737;
    border-radius: 4px;
    border: none;
    float: left;
    font-size: 16px;
  }

  .el-message-box__btns button:nth-child(1) {
    width: 128px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #D8D8D8;
    margin-left: 8px;
    font-size: 16px;
  }

  .el-message-box__headerbtn .el-message-box__close {
    color: #B33737;
    font-size: 18px;
  }

  .el-message-box__headerbtn {
    top: 13px;
  }

  /* .roamingList.el-button--primary {
    width: 128px;
    height: 32px;
    background: #B33737;
    border-radius: 4px;
  } */

  .roamingList .el-button [class*=el-icon-] + span {
    font-weight: 600;
    font-size: 16px;
    font-family: HarmonyOS_Sans_Bold;
    /* color: #333333; */
  }

  .roamingList .el-table th > .cell {
    font-size: 16px;
    font-family: HarmonyOS_Sans_Black;
    color: #4FACFF;
  }

  .roamingList .el-icon-view:before,
  .roamingList .el-icon-edit:before,
  .roamingList .el-icon-delete:before,
  .roamingList .el-icon-download:before {
    color: #4FACFF;
    font-size: 14px;
    font-weight: bold;
    margin-right: 3px;
  }

  .roamingList .el-button--text .text-danger {
    color: #333 !important;
  }

  .roamingList .el-dialog {
    box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  .roamingList .v-modal {
    /* display: none; */
  }

  .roamingList .el-dialog__header {
    border-bottom: 1px solid #D8D8D8;
  }

  .roamingList .el-dialog__title {
    font-size: 20px;
    font-family: HarmonyOS_Sans_Bold;
    color: #4FACFF;
    line-height: 29px;
  }

  .roamingList .el-dialog__headerbtn .el-dialog__close {
    color: #B33737;
    font-size: 20px
  }

  .roamingList .el-dialog__footer {
    text-align: center;
  }

  .roamingList .diaButton {
    padding: inherit;
    width: 128px;
    height: 32px;
    border-radius: 4px;
  }

  .roamingList .el-dialog__body {
    padding: 10px 20px;
  }

  .el-popover {
    padding: 25px 20px 0;
  }

  .el-timeline-item {
    padding-bottom: 5px;
    height: 20px;
  }

  .el-timeline-item__tail {
    border-left: 2px solid #4FACFF;
    left: 1px;
    top: 4px;
  }

  .el-timeline-item__node--normal {
    width: 6px;
    height: 6px;
    background-color: #fff;
    border: 1px solid #4FACFF;
    top: 4px;
    /* border-radius: 3.5px; */
  }

  .el-timeline-item__wrapper {
    padding-left: 15px;
  }

  .el-popover__reference-wrapper,
  .el-timeline-item__content {
    font-size: 16px;
    font-family: HarmonyOS_Sans_Medium;
    color: #333333;
    line-height: 23px;
  }
</style>
