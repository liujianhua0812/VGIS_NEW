<template>
  <div class="full-h full-w m-l-20">
    <vgis-breadcrumb :navs="navs"></vgis-breadcrumb>
    <div style="min-height: calc(100% - 35px);" class="flex">
      <div class="noc-vgis-model-list">
        <div class="flex m-15">
          <el-input class="filter" v-model="filters.model.value" clearable @clear="getHierarchy" @keyup.native.enter="getHierarchy">
            <template slot="append">
              <el-button type="primary" icon="el-icon-search" @click="getHierarchy"></el-button>
            </template>
          </el-input>
          <el-dropdown @command="handleCommand" v-auth="{ resources: 'Model', action: 'Admin' }">
            <el-button class="m-l-20" circle type="primary" icon="el-icon-plus"></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="addModel">{{$t("action.addModel")}}</el-dropdown-item>
              <el-dropdown-item command="addGroup">{{$t("action.addGroup")}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div v-if="hierarchy.length === 0" class="text-center text-info m-t-40">
          Click
          <el-button type="primary" circle icon="el-icon-plus" size="small"></el-button>
          to add group/model.
        </div>
        <el-tree
          v-else
          class="m-r-15"
          draggable
          :allow-drop="verifyTarget"
          default-expand-all
          :data="hierarchy"
          @node-drop="updatePosition"
          @node-click="selectModel">
          <div class="noc-vgis-hierarchy-item" slot-scope="{node, data}">
            <div class="flex align-items-center justify-content-start" style="flex-grow: 1;">
              <el-image class="noc-vgis-hierarchy-icon" v-if="data.type ==='ModelGroup'" :src="ModelGroupIcon"></el-image>
              <el-image class="noc-vgis-hierarchy-icon" v-else :src="data.icon"></el-image>
              <span class="noc-vgis-hierarchy-name" style="flex-grow: 1;">{{data.name}}</span>
            </div>
            <el-dropdown @command="handleCommand" v-auth="{ resources: 'Model', action: 'Admin' }">
              <span class="el-icon-more text-link"></span>
              <el-dropdown-menu v-if="data.type === 'ModelGroup'">
                <el-dropdown-item :command="`addModel[${data.id}]`">{{$t("action.addModel")}}</el-dropdown-item>
                <el-dropdown-item :command="`addGroup[${data.id}]`">{{$t("action.addGroup")}}</el-dropdown-item>
                <el-dropdown-item :command="`editGroup[${data.id}]`" divided>{{$t("action.rename")}}</el-dropdown-item>
                <el-dropdown-item :command="`deleteGroup[${data.id}]`" class="text-danger">{{$t("action.delete")}}</el-dropdown-item>
              </el-dropdown-menu>
              <el-dropdown-menu v-else>
                <el-dropdown-item :command="`editModel[${data.id}]`">{{$t("action.edit")}}</el-dropdown-item>
                <el-dropdown-item :command="`deleteModel[${data.id}]`" class="text-danger">{{$t("action.delete")}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-tree>
      </div>
      <div class="noc-vgis-model-detail">
        <div v-if="$route.params.modelId" style="height: calc(100% - 20px)">
          <el-tabs v-model="generalMode" active-name="detail" @tab-click="switchTab">
            <el-tab-pane name="detail" :label="$t('label.model.setting')"></el-tab-pane>
            <el-tab-pane name="instance" :label="$t('label.model.instance')" v-auth="{ resources: 'Model Instance' }"></el-tab-pane>
          </el-tabs>
          <router-view :key="Math.random()" @model-changed="getHierarchy"></router-view>
        </div>
        <div v-else class="flex align-items-center justify-content-center full-h text-info">
          {{$t("message.model.selectModel")}}
        </div>
      </div>
    </div>
    <add-edit-model v-auth="{ resources: 'Model', action: 'Admin' }" :model="addEditModelData" dialog-id="addEditModel" :dialog-visibility="dialogVisibility.addEditModel" @action-finished="actionFinished"></add-edit-model>
    <add-edit-group v-auth="{ resources: 'Model', action: 'Admin' }" :group="addEditGroupData" dialog-id="addEditGroup" :dialog-visibility="dialogVisibility.addEditGroup" @action-finished="actionFinished"></add-edit-group>
  </div>
</template>

<script>

  import { validate } from "@/utils";
  import VgisBreadcrumb from "../Standard/vgis-breadcrumb.vue"
  import ModelGroupIcon from '../../assets/images/icons/ModelGroupIcon.png'
  import AddEditGroup from "./Model/AddEditGroup";
  import AddEditModel from "./Model/AddEditModel";
  import VgisRow from '../Standard/vgis-row'
  import VgisCol from '../Standard/vgis-col'
  import VgisFlexColumn from '../Standard/vgis-flex-column'
  import VgisCell from '../Standard/vgis-cell'
  import { getModelList, getModelDetail, updateModel, deleteModel } from "@/assets/js/api/model";
  import { updateModelGroup, deleteModelGroup } from "@/assets/js/api/model-group";

  export default {
    name: "ModelPage",
    components: {
      VgisBreadcrumb,
      AddEditModel,
      AddEditGroup,
      VgisRow,
      VgisCol,
      VgisFlexColumn,
      VgisCell
    },
    props: {
      modelId: String,
      instanceId: String
    },
    computed: {
      navs () {
        let navs = [{
          name: this.$t('menu.home'),
          url: '/admin'
        }]
        if (this.$route.name === "ModelListPage") {
          navs.push({
            name: this.$t('menu.models'),
          })
        }
        else if (this.$route.name === "ModelDetailPage") {
          navs.push({
            name: this.$t('menu.models'),
            url: '/data/model/'
          })
          navs.push({
            name: this.$t('menu.model'),
          })
        }
        else if (this.$route.name === "InstanceListPage") {
          navs.push({
            name: this.$t('menu.models'),
            url: '/data/model/'
          })
          navs.push({
            name: this.$t('menu.model'),
            url: `/data/model/${this.$route.params.modelId}`
          })
          navs.push({
            name: this.$t('menu.instances'),
          })
        }
        else if (this.$route.name === "InstanceDetailPage") {
          navs.push({
            name: this.$t('menu.models'),
            url: '/data/model/'
          })
          navs.push({
            name: this.$t('menu.model'),
            url: `/data/model/${this.$route.params.modelId}`
          })
          navs.push({
            name: this.$t('menu.instances'),
            url: `/data/model/${this.$route.params.modelId}/instance`
          })
          navs.push({
            name: this.$t('menu.instance'),
          })
        }
        return navs
      }
    },
    data() {
      return {
        dialogVisibility: {
          addEditGroup: false,
          addEditModel: false,
        },
        addEditGroupData: {},
        addEditModelData: {},
        selectedModel: {
          static_attributes: [],
          time_series: [],
          model_relations: [],
          model_instances: []
        },
        filters: {
          model: {
            value: ""
          }
        },
        generalMode: this.$route.name.indexOf("Instance") !== -1 ? 'instance' : 'detail',
        hierarchy: [],
        hierarchyMap: {},
        ModelGroupIcon,
      }
    },
    methods: {
      validate,
      actionFinished (dialogId, success) {
        this.dialogVisibility[dialogId] = false
        if (success) {
          this.getHierarchy()
        }
      },
      switchTab (tab) {
        if (tab.name === 'instance') {
          this.$router.push({ name: "InstanceListPage", params: { modelId: this.$route.params.modelId } })
        }
        else {
          this.$router.push({ name: "ModelDetailPage", params: { modelId: this.$route.params.modelId } })
        }
      },
      verifyTarget (dragNode, dropNode, type) {
        return dropNode.data.type === 'ModelGroup' || type !== 'inner';
      },
      updatePosition (dragNode, dropNode, type) {
        let dragItem = this.hierarchyMap[dragNode.data.id]
        if (dragItem.type === 'ModelGroup') {
          updateModelGroup(dragItem.id, Object.assign({}, dragItem, {
            groupId: type === 'inner' ? dropNode.data.id : (dropNode.data.groupId || 'null')
          })).then(result => {
            this.getHierarchy()
          }).catch(err => {
            this.getHierarchy()
          })
        }
        else if (dragItem.type === 'Model') {
          updateModel(dragItem.id, Object.assign({}, dragItem, {
            groupId: type === 'inner' ? dropNode.data.id : (dropNode.data.groupId || 'null')
          })).then(result => {
            this.getHierarchy()
          }).catch(err => {
            this.getHierarchy()
          })
        }
      },
      flattenData (hierarchy) {
        let result = {}
        for(let i = 0; i < hierarchy.length; i++) {
          result[hierarchy[i].id] = hierarchy[i]
          if (hierarchy[i].children && hierarchy[i].children.length > 0) {
            Object.assign(result, this.flattenData(hierarchy[i].children))
          }
        }
        return result
      },
      getHierarchy() {
        getModelList({ query: this.filters.model.value }).then(result => {
          this.hierarchy = result.data
          this.hierarchyMap = this.flattenData(this.hierarchy)
          if (this.selectedModel.id) {
            Object.assign(this.selectedModel, this.hierarchyMap[this.selectedModel.id])
          }
        })
      },
      handleCommand (command) {
        let pattern = /([a-zA-Z]+)\[(.*)]/
        let match = command.match(pattern)
        if (match && match.length === 3) {
          this[match[1]](match[2])
        }
        else{
          this[command]()
        }
      },
      addGroup(groupId = null) {
        this.addEditGroupData = {
          groupId: groupId,
          name: '',
          rank: 1
        }
        this.dialogVisibility.addEditGroup = true
      },
      editGroup (groupId) {
        this.addEditGroupData = Object.assign({}, this.hierarchyMap[groupId])
        this.dialogVisibility.addEditGroup = true
      },
      deleteGroup (groupId) {
        let group = this.hierarchyMap[groupId]
        if (group.children && group.children.length > 0) {
          return this.$message({
            type: 'error',
            duration: 3000,
            showClose: true,
            message: this.$t("message.model.haveAttachment"),
          })
        }
        this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
          confirmButtonText: this.$t("action.confirm"),
          cancelButtonText: this.$t("action.cancel"),
          type: 'warning'
        }).then(() => {
          deleteModelGroup(groupId).then(result => {
            this.$message({
              type: 'success',
              message: this.$t("message.model.groupDeleted"),
              showClose: true
            })
            this.getHierarchy()
          })
        })
      },
      selectModel (data) {
        let model = this.hierarchyMap[data.id]
        if (model.type === 'Model' && this.selectedModel.id !== data.id) {
          this.$router.push({ name: "ModelDetailPage", params: { modelId: data.id } })
        }
      },
      getModelDetail (id) {
        getModelDetail(id).then(result => {
          this.selectedModel = result.data
          this.selectedModel.model_instances = []
          this.selectedModel.data_tables = []
          this.inspectInstance()
        })
      },
      addModel(groupId = null) {
        this.addEditModelData = {
          modelId: '',
          groupId: groupId,
          name: '',
          icon: ''
        }
        this.dialogVisibility.addEditModel = true
      },
      editModel (modelId = null) {
        this.addEditModelData = Object.assign({}, this.hierarchyMap[modelId])
        this.dialogVisibility.addEditModel = true
      },
      deleteModel (modelId) {
        this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
          confirmButtonText: this.$t("action.confirm"),
          cancelButtonText: this.$t("action.cancel"),
          type: 'warning'
        }).then(() => {
          deleteModel(modelId).then(result => {
            this.$message({
              type: 'success',
              message: this.$t("message.model.deleted"),
              showClose: true
            })
            this.getHierarchy()
          })
        })
      },
    },
    created() {
      this.getHierarchy()
    }
  }
</script>

<style lang="scss" scoped>
  .noc-m-t-15 {
    margin-top: 15px;
  }

  .noc-vgis-model-list {
    background: white;
    margin-right: 16px;
    width: 307px;
    flex-shrink: 0;
  }

  .noc-vgis-model-detail {
    padding: 16px;
    background: white;
    width: calc(100% - 307px - 48px);
    margin-right: 16px;
  }

  .noc-vgis-hierarchy-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .noc-vgis-hierarchy-icon {
      width: 16px;
      height: 16px;
    }

    .noc-vgis-hierarchy-name {
      font-family: 'HarmonyOS Sans';
      font-style: normal;
      font-weight: 400;
      font-size: 15px;
      line-height: 18px;
      color: #000000;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .noc-vgis-hierarchy-icon-lg {
    width: 40px;
    height: 40px;
  }

  .noc-vgis-model-title {
    flex-grow: 1;
    margin-left: 16px;
    font-family: 'HarmonyOS Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;
    color: #000000;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .noc-vgis-model-detail-tabs {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px;
    background: rgba(79, 172, 255, 0.05);
    border-radius: 6px;
    margin-top: 16px;

    .noc-vgis-model-detail-tabs-entries {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      div {
        padding: 6px;
        font-family: 'HarmonyOS Sans';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 19px;
        color: #B3B3B3;
        background: #D4EBFF;
        margin-right: 8px;
        cursor: pointer;
        border-radius: 4px;
      }

      div.active {
        background: #4FACFF;
        color: #FFF;
      }
    }

    .noc-vgis-model-detail-tabs-actions {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      button {
        padding: 8px;
        background: #D4EBFF;
        border-radius: 4px;
        font-family: 'HarmonyOS Sans';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 19px;
        color: #B3B3B3;
        border: none;
        margin-left: 8px;
        cursor: pointer;
      }

      button.active {
        background: #4FACFF;
        color: #FFF;
      }
    }
  }
</style>
