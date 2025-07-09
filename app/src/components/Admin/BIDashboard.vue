<template>
  <div class="full-h full-w p-l-20">
    <!--上侧面包屑导航-->
    <vgis-breadcrumb :navs="navs"></vgis-breadcrumb>
    <!--preview 弹窗-->
    <PreviewDialog dialog-id="previewVis" :dialogVisibility="visibles.previewVis" :model="currentItem"
                   v-if="visibles.previewVis" @action-finished="actionFinished"/>
    <!--add group 弹窗-->
    <AddGroupConfirm dialog-id="addGroupVis" :dialogVisibility="visibles.addGroupVis" :model="currentItem"
                     v-if="visibles.addGroupVis" @action-finished="actionFinished"/>
    <!--rename 弹窗-->
    <RenameConfirm dialog-id="renameVis" :dialogVisibility="visibles.renameVis" :model="currentItem"
                   v-if="visibles.renameVis" @action-finished="actionFinished" :which="whichRename"/>
    <!--delete 弹窗-->
    <DeleteConfirm dialog-id="deleteVis" :dialogVisibility="visibles.deleteVis" :model="currentItem"
                   v-if="visibles.deleteVis" @action-finished="actionFinished" :which="whichDelete"/>
    <!--add dashboard 弹窗-->
    <AddDashConfirm dialog-id="addDashVis" :dialogVisibility="visibles.addDashVis" :model="currentItem"
                    v-if="visibles.addDashVis" @action-finished="actionFinished"/>
    <!--confirm dashboard 弹窗-->
    <SaveConfirm dialog-id="finalSaveVis" :dialogVisibility="visibles.finalSaveVis" :dashInfo="dashInfo"
                 v-if="visibles.finalSaveVis" @action-finished="actionFinished" :saveAs="saveAs" :model="currentItem"/>
    <!--编辑中退出确认操作弹窗-->
    <TryExitConfirm dialog-id="tryExitVis" :dialogVisibility="visibles.tryExitVis" v-if="visibles.tryExitVis"
                    @action-finished="actionFinished"/>
    <div style="min-height: calc(100% - 35px);" class="flex">
      <!--左侧树结构-->
      <div class="noc-vgis-table-list">
        <div class="flex m-15">
          <el-input class="filter" v-model="treeFilter" clearable @clear="getAllDashboards">
            <template slot="append">
              <el-button type="primary" class="iconfont icon-search" @click="getAllDashboards"></el-button>
            </template>
          </el-input>
          <el-button @click="addNewGroup" class="m-l-20" circle type="primary" icon="el-icon-plus"></el-button>
        </div>
        <div>
          <el-tree
            highlight-current
            draggable
            ref="myTree"
            node-key="label"
            :check-on-click-node="true"
            :expand-on-click-node="false"
            default-expand-all
            :data="treeData"
            :allow-drop="allowDrop"
            @node-drop="updatePosition"
            @node-click="selectModel">

            <div class="noc-vgis-hierarchy-item" slot-scope="{node, data}">
              <div class="flex align-items-center justify-content-start"
                   style="flex-grow: 1;" :style="`max-width: ${data.thumbnail?'calc(100% - 45px)':'calc(100% - 35px)'}`">
                <el-image class="noc-vgis-hierarchy-icon" v-if="!data.thumbnail" :src="ModelGroupIcon"></el-image>
                <span class="noc-vgis-hierarchy-name" :title="data.name" style="flex-grow: 1;">{{ data.name }}</span>
              </div>
              <el-dropdown @command="handleTreeNodeCommand">
                <span class="el-icon-more text-link"></span>
                <el-dropdown-menu v-if="data.thumbnail">
                  <el-dropdown-item :command="`editDashboard.${JSON.stringify(data)}`" class="text-oth"><span
                    class="drop-oth">Edit</span>
                  </el-dropdown-item>
                  <el-dropdown-item :command="`previewDashboard.${JSON.stringify(data)}`" class="text-oth"><span
                    class="drop-oth">Preview</span></el-dropdown-item>
                  <el-dropdown-item :command="`renameDashboard.${JSON.stringify(data)}`" class="text-oth"><span
                    class="drop-oth">Rename</span>
                  </el-dropdown-item>
                  <el-dropdown-item :command="`deleteDashboard.${JSON.stringify(data)}`" class="text-danger"><span
                    class="drop-del">Delete</span></el-dropdown-item>
                </el-dropdown-menu>
                <el-dropdown-menu v-else>
                  <el-dropdown-item :command="`addGroup.${JSON.stringify(data)}`" class="text-oth"><span
                    class="drop-oth">New Group</span>
                  </el-dropdown-item>
                  <el-dropdown-item :command="`addDashboard.${JSON.stringify(data)}`" class="text-oth"><span
                    class="drop-oth">New Dashboard</span>
                  </el-dropdown-item>
                  <el-dropdown-item :command="`renameGroup.${JSON.stringify(data)}`" class="text-oth"><span
                    class="drop-oth">Rename</span>
                  </el-dropdown-item>
                  <el-dropdown-item :command="`deleteGroup.${JSON.stringify(data)}`" class="text-danger"><span
                    class="drop-del">Delete</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-tree>
        </div>
      </div>
      <!--右侧dashboard panel-->
      <div class="noc-vgis-table-detail">
        <div v-if="ifEchartsEdit" class="full-h">
          <div class="gjs-edit-top">
            <div class="top-left">
              <div>
<!--                <el-button type="primary" class="back" plain @click="visibles.tryExitVis=true"><i-->
<!--                  class="iconfont icon-back"></i> Back-->
<!--                </el-button>-->
                <el-button type="primary" class="back" plain @click="judgeChange"><i
                  class="iconfont icon-back"></i> Back
                </el-button>
              </div>
<!--              <el-button class="top-back-button" @click="visibles.tryExitVis=true"><i class="iconfont icon-back"></i>Back-->
<!--              </el-button>-->
            </div>
            <div class="top-center">{{ isEdit ? dashboardDetail.name : dashInfo.name }}</div>
            <div class="top-right iconfont icon-save" @click="changeFlag"></div>
          </div>
          <grapesjs-view ref="grapesjsView" :model="dashboardDetail" :saveFlag="saveFlag" @saveEditor="saveDashboard"></grapesjs-view>
        </div>
        <div v-if="!ifEchartsEdit" class="full-h right-groups">
          <div class="main-top-inner">
            <div class="inner-title" :title="this.groupTitle">{{ this.groupTitle }}</div>
            <el-input v-model="dashRightSearch" class="filter inner-search" clearable @clear="rightDashFilter">
              <template slot="append">
                <el-button type="primary" class="iconfont icon-search" @click="rightDashFilter"></el-button>
              </template>
            </el-input>
          </div>
          <div class="allGroups">
            <!--first add-->
            <div class="groupItem first-add">
              <div>
                <el-button size="large" circle type="primary" class="iconfont icon-add"
                           @click="addNullGroupDashboard"></el-button>
              </div>
              <div class="first-add-text">Create a new dashboard</div>
            </div>
            <!--dashboards list-->
            <div class="groupItem" v-for="data in partPanelsData">
              <div class="groupItemIn">
                <img :src="`${host}${data.thumbnail}?raw=true`" alt="" style="width: 100%; height: 100%">
              </div>
              <div class="groupItemBottom">
                <div class="groupItemName" :title="data.name">{{ data.name }}</div>
                <div class="groupItemOth">
                  <el-switch v-model="data.published" @change="changePublish(data)"></el-switch>
                  <span class="publishedText" v-show="data.published">Published</span>
                  <span class="unPublishedText" v-show="!data.published">Unpublished</span>
                  <el-dropdown @command="handleTreeNodeCommand"
                               class="groupItemMoreEdit">
                    <span class="el-icon-more pointer"></span>
                    <el-dropdown-menu>
                      <el-dropdown-item :command="`editDashboard.${JSON.stringify(data)}`" class="text-oth"><span
                        class="drop-oth">Edit</span></el-dropdown-item>
                      <el-dropdown-item :command="`previewDashboard.${JSON.stringify(data)}`" class="text-oth"><span
                        class="drop-oth">Preview</span>
                      </el-dropdown-item>
                      <el-dropdown-item :command="`renameDashboard.${JSON.stringify(data)}`" class="text-oth"><span
                        class="drop-oth">Rename</span>
                      </el-dropdown-item>
                      <el-dropdown-item :command="`saveAsTemplate.${JSON.stringify(data)}`" class="text-oth"><span
                        class="drop-oth">Save as template</span>
                      </el-dropdown-item>
                      <el-dropdown-item :command="`deleteDashboard.${JSON.stringify(data)}`" class="text-danger"
                                        divided><span
                        class="drop-del">Delete</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {
  getDashboardList,
  getDashboardDetail,
  addNewDashboard,
  updateDashboardDetail,
  updateDashboardGroup
} from '@/assets/js/api/bidashboard'
import {uploadFile} from '@/assets/js/api/media-file'
import ModelGroupIcon from '@/assets/images/icons/ModelGroupIcon.png'
import html2canvas from 'html2canvas'
import config from "../../config";
import GrapesjsView from "./BIEditor/GrapesjsView";
import VgisBreadcrumb from "../Standard/vgis-breadcrumb.vue"
import AddGroupConfirm from "./BIDashComponents/AddGroupConfirm";
import DeleteConfirm from "./BIDashComponents/DeleteConfirm";
import AddDashConfirm from "./BIDashComponents/AddDashConfirm";
import RenameConfirm from "./BIDashComponents/RenameConfirm";
import SaveConfirm from "./BIDashComponents/SaveConfirm";
import PreviewDialog from "./BIDashComponents/PreviewDialog";
import TryExitConfirm from "./BIDashComponents/TryExitConfirm"
import EventBus from "@/utils/EventBus";

export default {
  watch: {},
  data() {
    return {
      editorContentsWhenOpen:'',
      //-------------------------------panel
      host: config.backend.host + 'media/',
      dashRightSearch: '',
      saveFlag: false, // flag 改变 子组件监听到并传送 project 数据
      project: '',
      content: '',
      //--------------------------------tree
      ModelGroupIcon,
      treeFilter: '',
      selectFlag: '',
      //------------------------------------
      dashboardDetail: {}, // 右侧 editor 中回显的 project 数据
      saveAs: 'dashToDash',
      whichRename: '',
      whichDelete: '',
      visibles: {
        finalSaveVis: false,
        previewVis: false,
        addGroupVis: false,
        renameVis: false,
        deleteVis: false,
        addDashVis: false,
        tryExitVis: false,
      },
      groupTitle: 'All Dashboard',
      isEdit: false,
      treeData: [],
      currentItem: {},
      ifEchartsEdit: false, // 控制展示 dashboard 阵列 || 编辑页面
      flatList: [], // 根据是否有 thumbnail 属性扁平化后的数组
      partPanelsData: [],
      dashInfo: {}, // 负责临时数据的回显
    }
  },
  components: {
    GrapesjsView,
    PreviewDialog,
    SaveConfirm,
    AddGroupConfirm,
    RenameConfirm,
    AddDashConfirm,
    DeleteConfirm,
    VgisBreadcrumb,
    TryExitConfirm
  },
  computed: {
    navs() {
      return [{
        name: 'Home',
        url: '/admin'
      }, {
        name: 'BI Editor',
        url: ''
      }, {
        name: 'Dashboard'
      }]
    }
  },
  created() {
    this.getAllDashboards()
  },
  mounted() {
  },
  methods: {
    // 判断编辑器内容是否有变化
    judgeChange(){
      // 如果编辑器内容有变化 -> 展示确认弹框
      if(this.$refs['grapesjsView'].getProjectData() !== this.editorContentsWhenOpen){
        this.visibles.tryExitVis = true
      }
      // 否则 直接退出
      else {
        this.ifEchartsEdit = false
      }
    },
    //------------------------------------tree------------------------------------
    allowDrop(draggingNode, dropNode, type) {
      return !(dropNode.data.thumbnail && type === 'inner');
    },
    // 树节点拖动回调 修改group信息
    updatePosition(node, lastGo, location, event) {
      if (location === 'after' || location === 'before') {
        let groupId = lastGo.data.groupId
        if (node.data.thumbnail) {
          updateDashboardDetail({id: node.data.id, groupId: groupId}).then(res => {
            this.getAllDashboards()
          })
        } else {
          updateDashboardGroup({id: node.data.id, name: node.data.name, groupId: groupId}).then(res => {
            this.getAllDashboards()
          })
        }
      } else {
        let innerGroupId = lastGo.data.id
        if (node.data.thumbnail) {
          updateDashboardDetail({id: node.data.id, groupId: innerGroupId}).then(res => {
            this.getAllDashboards()
          })
        } else {
          updateDashboardGroup({id: node.data.id, name: node.data.name, groupId: innerGroupId}).then(res => {
            this.getAllDashboards()
          })
        }
      }
    },
    // 节点选中事件 用来判断是否需要取消选中 并设置右侧 panels 中显示的 dashboard
    selectModel(data, node) {
      if (this.selectFlag !== data.id) {
        this.selectFlag = data.id
        this.groupTitle = data.name
        if (data.thumbnail) {
          this.partPanelsData = [data]
        } else {
          this.partPanelsData = data.children.filter(item => {
            return item.thumbnail
          })
        }
      } else {
        this.groupTitle = 'All Dashboard'
        this.selectFlag = ''
        node.isCurrent = false
        this.partPanelsData = this.flatList
      }
    },
    //----------------------------------tree end----------------------------------
    //------------------------------------panel-----------------------------------
    rightDashFilter() {
      this.partPanelsData = this.flatList.filter(item => {
        return item.name.includes(this.dashRightSearch)
      })
    },
    // 修改 publish 状态
    changePublish(data) {
      data.published = data.published ? 'true' : 'false'
      updateDashboardDetail(data).then(res => {
        this.getAllDashboards()
        EventBus.$emit("dashboard-updated")
      })
    },
    changeFlag() {
      this.saveFlag = !this.saveFlag
    },
    //----------------------------------panel end---------------------------------
    addNullGroupDashboard() {
      this.visibles.addDashVis = true
    },
    actionFinished(dialogId, success, info) {
      this.groupTitle = 'All Dashboard'
      this.getAllDashboards()
      EventBus.$emit("dashboard-updated")
      // 关闭 dialogId 对应的 dialog
      this.visibles[dialogId] = false
      if (success) {
        if (dialogId === 'previewVis') {
          getDashboardDetail(this.currentItem).then(res => {
            this.dashboardDetail = res.data
            this.isEdit = true
            this.ifEchartsEdit = true
          })
        }
        if (dialogId === 'addGroupVis') {
        }
        if (dialogId === 'renameVis') {
        }
        if (dialogId === 'addDashVis') {
          this.dashInfo = Object.assign({}, info, {groupId: this.currentItem.id})
          this.dashboardDetail = info
          this.ifEchartsEdit = true
          this.isEdit = false
        }
        if (dialogId === 'finalSaveVis') {
          this.submitSaveDash(info)
        }
        if (dialogId === 'tryExitVis') {
          if (success === 'save') {
            if (this.isEdit) {
              this.dashInfo = this.currentItem
            }
            this.visibles.finalSaveVis = true
          } else {
            this.ifEchartsEdit = false
          }
        }
      }
    },
    // 右侧 panels 中第一个 panel 新建 dashboard 事件
    addNewGroup() {
      this.currentItem = {}
      this.visibles.addGroupVis = true
    },
    // 树节点command指令
    async handleTreeNodeCommand(command) {
      let action = (command.split('.'))[0]
      let acLength = action.length
      let commandObject = command.slice(acLength + 1)
      this.currentItem = JSON.parse(commandObject)
      switch (action) {
        case 'addGroup' :
          this.visibles.addGroupVis = true
          break;
        case 'addDashboard':
          this.dashboardDetail = null
          this.visibles.addDashVis = true
          break;
        case 'renameGroup':
          this.whichRename = 'group'
          this.visibles.renameVis = true
          break;
        case 'deleteGroup':
          this.whichDelete = 'group'
          this.visibles.deleteVis = true
          break;
        case 'editDashboard':
          await new Promise(() =>
            getDashboardDetail(this.currentItem).then(res => {
              this.dashboardDetail = res.data
              console.log('res.dataa',res.data)
              this.editorContentsWhenOpen = res.data.project
              this.isEdit = true
              this.ifEchartsEdit = true
            })
          );
          break;
        case 'previewDashboard':
          this.visibles.previewVis = true
          break;
        case 'renameDashboard':
          this.whichRename = 'dashboard'
          this.visibles.renameVis = true
          break;
        case 'deleteDashboard':
          this.whichDelete = 'dashboard'
          this.visibles.deleteVis = true
          break;
        case 'saveAsTemplate':
          this.saveAs = 'dashToTemp'
          this.visibles.finalSaveVis = true
          break;
      }
    },
    // dashboard save
    submitSaveDash(data) {
      let iframe = this.$el.getElementsByClassName("gjs-frame")[0]
      let el = iframe.contentWindow.document.body
      //获取页面dom
      html2canvas(el, {allowTaint: true}).then((canvas) => {
        //转换base64
        const capture = canvas.toDataURL('image/png');
        // 本地下载
        // this.downLoadFile("simple", capture);
        let base = window.atob(capture.substring(capture.indexOf(',') + 1))
        let length = base.length
        let url = new Uint8Array(length)
        while (length--) {
          url[length] = base.charCodeAt(length)
        }
        let file = new File([url], `${new Date().getTime()}.png`, {
          type: 'image/png'
        })
        let param = new FormData(); //创建form对象
        param.append('file', file);//通过append向form对象添加数据
        uploadFile(param).then((res) => {
          // 转换 cascader 数据
          if (Array.isArray(data.groupId)) {
            data.groupId = data.groupId[data.groupId.length - 1]
          }
          // 如果 进行的是 编辑dashboard 操作
          if (this.isEdit) {
            let editDetail = {
              name: data.name,
              groupId: data.groupId,
              id: this.currentItem.id,
              content: this.dashInfo.content,
              project: this.dashInfo.project,
              thumbnail: res.data.id,
            }
            updateDashboardDetail(editDetail).then(res => {
              this.getAllDashboards()
              this.ifEchartsEdit = false
              EventBus.$emit("dashboard-updated")
              // this.$message.success('edit Dashboard Success !')
            })
          } else {
            // 如果 进行的是 新建dashboard 操作
            let allNewDashDetail = Object.assign({}, data, {
              thumbnail: res.data.id,
              content: this.dashInfo.content,
              project: this.dashInfo.project
            })
            addNewDashboard(allNewDashDetail).then((res) => {
              this.getAllDashboards()
              this.ifEchartsEdit = false
              EventBus.$emit("dashboard-updated")
              // this.$message.success('New Dashboard Success !')
            })
          }
        })
      })
    },
    // el-tree 扁平化
    flatArray(list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].thumbnail) {
          this.flatList.push(list[i])
        }
        if (list[i].children && list[i].children.length > 0) {
          this.flatArray(list[i].children)
        }
      }
    },
    // 右上角 save 按钮 保存 project 信息 并调出最终保存 dialog
    saveDashboard(contentAndProject) {
      this.dashInfo = Object.assign({}, this.dashInfo, contentAndProject)
      if (this.isEdit) {
        this.dashInfo = Object.assign({}, this.currentItem, contentAndProject)
      }
      this.visibles.finalSaveVis = true
    },
    getAllDashboards() {
      getDashboardList({query: this.treeFilter}).then((res) => {
        this.treeData = res.data
        this.flatList = []
        this.flatArray(res.data)
        this.partPanelsData = this.flatList
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.icon-search:before {
  font-size: 20px;
}


:deep(.el-input-group__append .el-button, .el-input-group__append .el-select, .el-input-group__prepend .el-button, .el-input-group__prepend .el-select) {
  margin-left: -21px;
  padding: 10px;
}

.vgis-adm .el-input.filter .el-input-group__append .el-button.el-button--primary {
  border-top: 0;
}

.noc-vgis-hierarchy-item {
  .el-dropdown {
    position: absolute;
    right: 10px;
  }
}

.noc-vgis-hierarchy-item {
  width: 100%;
  padding: 3px 16px 3px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .noc-vgis-hierarchy-icon {
    min-width: 16px;
    height: 16px;
  }

  .noc-vgis-hierarchy-name {
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    margin-left: 5px;
    line-height: 21px;
    color: #000000;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.text-danger:hover {
  .drop-del {
    color: white;
  }

  background: #d94343;
}

.text-oth:hover {
  .drop-oth {
    color: white;
  }

  background: #4facff;
}

.noc-vgis-table-list {
  background: white;
  margin-right: 16px;
  width: 307px;
  flex-shrink: 0;
}

:deep(.el-tree-node__content) {
  height: 33px;
}

:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
  background-color: #409eff !important;

  .noc-vgis-hierarchy-name {
    color: white;
  }

  .text-link {
    color: white !important;
  }
}

.groupItemName {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon-search:before {
  font-size: 20px;
}

.icon-back {
  margin-right: 5px;
}

:deep(.el-button--default) {
  background-color: #dceeff;
  color: #4facff;
}

:deep(.el-button--default:hover) {
  background-color: #4facff;
  color: white;
}

.main-top-inner {
  display: flex;
  padding:0 10px;
  justify-content: space-between;
}

.groupItemOth {
  .pointer {
    padding: 5px;
    border-radius: 2px;
  }

  .pointer:hover {
    color: #0AB2DB;
    background-color: #d4ebff;
  }
}

.groupItemMoreEdit {
  float: right
}



.publishedText {
  color: #4facff;
  margin-left: 5px;
  font-size:10px;
}

.unPublishedText {
  color: #929292;
  margin-left: 5px;
  font-size:10px;
}

.inner-title {
  font-weight: 700;
  font-size: 24px;
  line-height: 40px;
  max-width: 800px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.inner-search {
  width: 200px;
  float: right
}

.first-add {
  background-color: #d4ebff;
  width: 100%;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.first-add-text {
  color: #4facff
}

.allGroups {
  display: flex;
  width: 100%;
  flex-flow: row wrap;
  justify-content: flex-start;
}
.groupItem {
  border-radius: 4px;
  border: 1px solid #F5F5F5;
  margin: 8px;
  flex: 0 0 18.76%;
  min-width: 220px;
  height: 177px;
  overflow: hidden;

  .groupItemIn {
    border-radius: 4px;
    width: 100%;
    height: 119px;
    background: white;
  }

  .groupItemBottom {
    border-top: 1px solid white;
    background: #f5f5f5;
    height: 56px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 1% 4%;
  }
}

.groupItem:hover {
  border-radius: 4px;
  border: 1px solid #4facff;
  box-shadow: 0 1px 20px 2px rgba(0, 0, 0, 0.1);

  .groupItemBottom {
    border-top: 1px solid #F5F5F5;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    background: #ffffff;
  }

  .groupItemIn {
    border-radius: 10px;
  }
}

.gjs-edit-top {
  display: flex;
  align-items: center;
  position: relative;
  padding: 15px;

  .top-left {
    flex: 0 0 9%;
    height: 40px;
  }

  .top-center {
    font-size: 20px;
    font-weight: bold;
    line-height: 40px;
    flex: 0 0 82%;
  }

  .top-right {
    cursor: pointer;
    font-size: 32px;
    line-height: 40px;
    position: absolute;
    right: 32px;
    color: #409eff;
  }
}

.right-groups {
  padding: 16px 8px 16px 8px;
}

.noc-vgis-table-detail {
  background: white;
  margin-right: 16px;
  width: -webkit-fill-available;
}

.top-back-button {
  height: 40px;
}
.back {
  width: 74px;
  height: 40px;
  padding: 12px 10px;
  border: none;
}
* {
  font-family: HarmonyOS Sans;
}
</style>
