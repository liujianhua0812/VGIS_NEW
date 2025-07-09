<template>
  <div class="full m-l-20">
    <vgis-breadcrumb :navs="navs"></vgis-breadcrumb>
    <el-card style="min-height: calc(100% - 35px);" shadow="none">
      <div class="flex align-items-center justify-content-between m-b-25 m-t-0">
        <div class="flex align-items-center">
          <el-input class="filter" style="width: 213px;" clearable v-model="filter.query"
                    @clear="refresh" @keyup.enter.native="refresh">
            <template slot="append">
              <el-button type="primary" icon="el-icon-search" @click="refresh"></el-button>
            </template>
          </el-input>
        </div>
      </div>
      <el-table :data="keyValueList" header-cell-class-name="table-header-cell" cell-class-name="table-cell">
        <el-table-column :label="$t('model.cctv.name')" prop="name"></el-table-column>
        <el-table-column :label="$t('model.cctv.src')" prop="src"></el-table-column>
        <el-table-column :label="$t('model.cctv.resolution')" prop="resolution"></el-table-column>
        <el-table-column :label="$t('model.cctv.fps')" prop="frameRate"></el-table-column>
        <el-table-column width="280px" :label="$t('label.basic.action')" v-if="validate($store.state.user, { resources: 'CCTV', action: 'Admin' })">
          <template slot-scope="scope">
            <el-button icon="el-icon-view" type="primary" size="mini" plain
                       @click="inspectCCTV(scope.row)">{{$t("action.view")}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <InspectCCTV v-if="dialogVisibility.inspectCCTV" :cctv="selectedCCTV" dialogId="inspectCCTV" :dialog-visibility="dialogVisibility.inspectCCTV" @action-finished="actionFinished"></InspectCCTV>
  </div>
</template>

<script>
  import {validate} from "../../utils";
  import InspectCCTV from "./CCTV/InspectCCTV";
  import VgisBreadcrumb from "../Standard/vgis-breadcrumb.vue"
  import {getCCTVList, updateCCTV, deleteCCTV, createCCTV} from "../../assets/js/api/cctv";

  export default {
    name: "CCTVPage",
    components: {
      InspectCCTV,
      VgisBreadcrumb
    },
    data() {
      return {
        navs: [{
          name: this.$t("menu.home"),
          url: '/admin'
        }, {
          name: this.$t("menu.cctv")
        }],
        dialogVisibility: {
          inspectCCTV: false
        },
        selectedCCTV: {},
        filter: {
          query: '',
        },
        formData: {
          name: '',
          src: '',
          resolution: '',
          frameRate: 25
        },
        editFormData: {},
        visible: false,
        keyValueList: []
      }
    },
    methods: {
      validate,
      actionFinished (dialogId, success) {
        this.dialogVisibility[dialogId] = false
      },
      editCCTV(record) {
        this.editFormData = Object.assign({}, record)
        this.editFormData[`${record.id}_visible`] = true
      },
      inspectCCTV(cctv) {
        this.selectedCCTV = cctv
        this.dialogVisibility.inspectCCTV = true
      },
      updateCCTV() {
        updateCCTV(this.editFormData.id, this.editFormData).then(result => {
          this.editFormData = {}
          this.refresh()
        })
      },
      createCCTV() {
        createCCTV(this.formData).then(result => {
          this.visible = false
          this.refresh()
        })
      },
      removeCCTV(record) {
        this.$confirm('Action cannot be reversed, are you sure?', 'Warning', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deleteCCTV(record.id).then(result => {
            this.$message({
              type: 'success',
              message: 'Record deleted successfully.',
              showClose: true
            })
            this.refresh()
          })
        })
      },
      refresh() {
        getCCTVList({query: this.filter.query}).then(result => {
          this.keyValueList = result.data
        })
      }
    },
    created() {
      this.refresh()
    }
  }
</script>

<style scoped>

</style>
