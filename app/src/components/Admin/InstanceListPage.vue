<template>
  <div>
    <div>
      <el-button v-auth="{ resources: 'Model Instance', action: 'Admin' }" type="primary" icon="el-icon-plus" plain @click="addInstance"> {{$t('action.add')}}</el-button>
      <el-button type="primary" icon="el-icon-download" plain @click="downloadInstances($route.params.modelId)">{{$t('action.export')}}</el-button>
      <el-input v-model="filters.instance.value" clearable style="width: 213px" class="m-l-10 filter" @clear="getInstances($route.params.modelId)" @keyup.native.enter="getInstances($route.params.modelId)">
        <template slot="append">
          <el-button type="primary" icon="el-icon-search" @click="getInstances($route.params.modelId)"></el-button>
        </template>
      </el-input>
    </div>
    <el-table header-cell-class-name="table-header-cell" cell-class-name="table-cell" :data="instances" :key="randomKey">
      <el-table-column :label="$t('model.instance.name')" prop="name"></el-table-column>
      <el-table-column :label="$t('model.instance.id')" prop="instanceId"></el-table-column>
      <el-table-column :label="$t('model.instance.modelName')">
        <template slot-scope="{ row }">{{model.name}}</template>
      </el-table-column>
      <el-table-column :label="$t('model.instance.modelId')">
        <template slot-scope="{ row }">{{model.modelId}}</template>
      </el-table-column>
      <el-table-column :label="$t('model.instance.lastUpdatedAt')">
        <template slot-scope="{ row }">{{ new Date(row.updatedAt).format('yyyy/MM/dd hh:mm:ss') }}</template>
      </el-table-column>
      <el-table-column :label="$t('label.basic.action')">
        <template slot-scope="{ row }">
          <el-button plain size="mini" type="primary" class="m-r-5" icon="el-icon-view" @click="inspectInstance(row)"> {{$t("action.view")}}</el-button>
          <el-button v-auth="{ resources: 'Model Instance', action: 'Admin' }" plain size="mini" type="danger" icon="el-icon-delete" @click="deleteInstance(row)"> {{$t("action.delete")}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-edit-instance v-auth="{ resources: 'Model Instance', action: 'Admin' }" v-if="dialogVisibility.addEditInstance" :model="model" :instance="addEditInstanceData" dialog-id="addEditInstance" :dialog-visibility="dialogVisibility.addEditInstance" @action-finished="actionFinished"></add-edit-instance>
  </div>
</template>

<script>

  import AddEditInstance from "./Model/AddEditInstance";
  import {
    deleteModelInstance,
    downloadModelInstanceList,
    getModelInstanceList
  } from "../../assets/js/api/model-instance";
  import {downloadFile} from "../../utils";
  import {getModelDetail} from "../../assets/js/api/model";

  export default {
    name: "InstanceListPage",
    components: {
      AddEditInstance
    },
    data () {
      return {
        dialogVisibility: {
          addEditInstance: false
        },
        addEditInstanceData: {},
        instances: [],
        filters: {
          instance: {
            value: ""
          }
        },
        randomKey: "",
        pagination: {
          page: 1,
          pagination: 10,
          total: 1,
          totalPage: 1
        },
        model: {}
      }
    },
    methods: {
      actionFinished (dialogId, success) {
        this.dialogVisibility[dialogId] = false
        if (success) {
          if (dialogId === 'addEditInstance') {
            this.getInstances(this.$route.params.modelId)
          }
        }
      },
      downloadInstances (modelId) {
        downloadModelInstanceList(modelId, Object.assign({ query: this.filters.instance.value }, this.pagination)).then(result => {
          downloadFile(`Instances - ${this.model.name}.xlsx`, result.data)
        })
      },
      getInstances (modelId, refresh = false) {
        if (refresh) {
          this.pagination.page = 1
        }
        getModelInstanceList(modelId, Object.assign({ query: this.filters.instance.value }, this.pagination)).then(result => {
          this.instances = result.data
          this.pagination = result.pagination
          this.randomKey = Math.random()
        })
      },
      inspectInstance (instance = {}) {
        this.$router.push({ name: "InstanceDetailPage", params: { modelId: this.$route.params.modelId, instanceId: instance.id } })
      },
      addInstance () {
        this.addEditInstanceData = {
          modelId: this.model.id,
          name: '',
          instanceId: ''
        }
        this.dialogVisibility.addEditInstance = true
      },
      editInstance (instance) {
        this.addEditInstanceData = Object.assign({}, instance)
        this.dialogVisibility.addEditInstance = true
      },
      deleteInstance (instance) {
        this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
          confirmButtonText: this.$t("action.confirm"),
          cancelButtonText: this.$t("action.cancel"),
          type: 'warning'
        }).then(() => {
          deleteModelInstance(this.$route.params.modelId, instance.id).then(result => {
            this.$message({
              type: 'success',
              message: this.$t("message.instance.deleted"),
              showClose: true
            })
            this.getInstances(this.$route.params.modelId)
          })
        })
      },
      getModelDetail (id) {
        getModelDetail(id).then(result => {
          this.model = result.data
        })
      },
    },
    created() {
      this.getModelDetail(this.$route.params.modelId)
      this.getInstances(this.$route.params.modelId)
    }
  }
</script>

<style scoped>

</style>
