<template>
  <div class="full-h full-w p-l-20">
    <vgis-breadcrumb :navs="navs"></vgis-breadcrumb>
    <div style="min-height: calc(100% - 35px);" class="flex">
      <!--左半边-->
      <div class="noc-vgis-table-list">
        <div class="flex m-15">
          <el-input class="filter" v-model="searchData" clearable @clear="getAllData(searchData)">
            <template slot="append">
              <el-button type="primary" class="iconfont icon-search" @click="getAllData(searchData)"></el-button>
            </template>
          </el-input>
          <el-button @click="addGroup" class="m-l-20" circle type="primary" icon="el-icon-plus"></el-button>
        </div>
        <div>
          <el-tree
            draggable
            :check-on-click-node="true"
            :expand-on-click-node="false"
            default-expand-all
            :data="hierarchy"
            :allow-drop="allowDrop"
            @node-drop="updatePosition"
            @node-click="selectModel"
            :highlight-current="true"
          >
            <div :class="`noc-vgis-hierarchy-item`" slot-scope="{node, data}">
              <div class="flex align-items-center justify-content-start" :style="`max-width: ${data.thumbnail?'calc(100% - 53px)':'calc(100% - 53px)'}`">
                <i v-if="data.type" class="el-icon-tickets"></i>
                <el-image v-if="!data.thumbnail" class="noc-vgis-hierarchy-icon" :src="ModelGroupIcon"></el-image>
                <div class="noc-vgis-hierarchy-name" :title="data.name">{{ data.name }}</div>
              </div>
              <el-dropdown @command="handleCommand" style="position: absolute;right: 10px">
                <span class="el-icon-more text-link"></span>
                <el-dropdown-menu v-if="data.thumbnail">
                  <el-dropdown-item :command="`editTemplate.${JSON.stringify(data)}`" class="text-oth"><span
                    class="drop-oth">Edit</span>
                  </el-dropdown-item>
                  <el-dropdown-item :command="`previewTemplate.${JSON.stringify(data)}`" class="text-oth"><span
                    class="drop-oth">Preview</span>
                  </el-dropdown-item>
                  <el-dropdown-item :command="`renameItem.${JSON.stringify(data)}`" class="text-oth"><span
                    class="drop-oth">Rename</span>
                  </el-dropdown-item>
                  <el-dropdown-item :command="`deleteItem.${JSON.stringify(data)}`" class="text-danger"><span
                    class="drop-del">Delete</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
                <el-dropdown-menu v-else>
                  <el-dropdown-item :command="`addGroup.${JSON.stringify(data)}`" class="text-oth"><span
                    class="drop-oth">New Group</span>
                  </el-dropdown-item>
                  <el-dropdown-item :command="`addTemplate.${JSON.stringify(data)}`" class="text-oth"><span
                    class="drop-oth">New Template</span>
                  </el-dropdown-item>
                  <el-dropdown-item :command="`renameItem.${JSON.stringify(data)}`" class="text-oth"><span
                    class="drop-oth">Rename</span>
                  </el-dropdown-item>
                  <el-dropdown-item :command="`deleteItem.${JSON.stringify(data)}`" class="text-danger"><span
                    class="drop-del">Delete</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-tree>
        </div>
      </div>
      <!--右半边-->
      <div class="noc-vgis-table-detail">
        <!--编辑界面-->
        <div class="full-h" v-if="ifEchartsEdit">
          <div class="flex" style="position: relative">
            <div>
              <el-button type="primary" class="back" plain @click="backGroup"><i
                class="iconfont icon-back"></i> Back
              </el-button>
            </div>
            <div class="title" :title="templateInfo.name">{{ templateInfo.name }}</div>

            <div class="save iconfont icon-save" @click="getNameToSave"></div>
          </div>
          <grapesjs-view v-if="ifEchartsEdit" ref="grapesjsView" :model="templateInfo" :saveFlag="saveFlag"
                         @saveEditor="saveEditor"></grapesjs-view>
        </div>
        <!--视图界面-->
        <div class="full-h" style="padding: 16px 8px 16px 8px;" v-show="!ifEchartsEdit">
          <div class="flex justify-content-between " style="padding: 0 10px">
            <div class="groupTitle" :title="groupTitle">{{ groupTitle }}</div>
            <el-input class="filter inner-search" v-model="searchRightData" @clear="getAllData(searchRightData)" clearable>
              <template slot="append">
                <el-button type="primary" style="font-size: 17px;" class="iconfont icon-search"
                           @click="getAllData(searchRightData)"></el-button>
              </template>
            </el-input>
          </div>
          <div class="allGroups">
            <div class="groupItem first-add">
                <div>
                  <el-button size="large" circle type="primary" class="iconfont icon-add"
                             @click="addTemplate"></el-button>
                </div>
                <div class="first-add-text">Create a new template</div>
            </div>
            <div class="groupItem" v-for="item in templates">
              <div class="groupItemIn">
                <img :src="`${imgHost}${item.thumbnail}?raw=true`" style="width: 100%; height: 100%">
              </div>
              <div class="groupItemBottom">
                <div class="groupItemName" ><span class="blockName" :title="item.name">{{ item.name }}</span>
                  <el-dropdown @command="handleCommand" class="groupItemMoreEdit">
                    <span class="el-icon-more pointer"></span>
                    <el-dropdown-menu>
                      <el-dropdown-item :command="`editTemplate.${JSON.stringify(item)}`" class="text-oth"><span
                        class="drop-oth">Edit</span>
                      </el-dropdown-item>
                      <el-dropdown-item :command="`previewTemplate.${JSON.stringify(item)}`" class="text-oth"><span
                        class="drop-oth">Preview</span>
                      </el-dropdown-item>
                      <el-dropdown-item :command="`renameItem.${JSON.stringify(item)}`" class="text-oth"><span
                        class="drop-oth">Rename</span>
                      </el-dropdown-item>
                      <el-dropdown-item :command="`deleteItem.${JSON.stringify(item)}`" class="text-danger"><span
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
    <save-editor-view v-if="dialogVisibility.saveEditorView" dialogId="saveEditorView" :info="templateInfo"
                      :dialogVisibility="dialogVisibility.saveEditorView"
                      @action-finished="actionFinished"></save-editor-view>
    <preview-dialog v-if="dialogVisibility.previewDialog" :dialogVisibility="dialogVisibility.previewDialog"
                    dialogId="previewDialog" :model="previewData" @action-finished="actionFinished"></preview-dialog>
    <add-group-view v-if="dialogVisibility.addGroupView" :dialogVisibility="dialogVisibility.addGroupView"
                    dialogId="addGroupView" :info="addGroupData" @action-finished="actionFinished"></add-group-view>
    <exit-editor-view v-if="dialogVisibility.exitEditorView" :dialogVisibility="dialogVisibility.exitEditorView"
                      dialogId="exitEditorView" @action-finished="actionFinished"></exit-editor-view>
    <delete-view v-if="dialogVisibility.deleteView" :dialogVisibility="dialogVisibility.deleteView"
                 dialogId="deleteView" :info="deleteData"
                 @action-finished="actionFinished"></delete-view>
    <add-template-view v-if="dialogVisibility.addTemplateView" dialogId="addTemplateView"
                       :dialogVisibility="dialogVisibility.addTemplateView" @action-finished="actionFinished"
                       @addTemplate="addTemplateName"></add-template-view>
    <rename-view v-if="dialogVisibility.renameView" :dialogVisibility="dialogVisibility.renameView" :info="renameData"
                 dialogId="renameView" @action-finished="actionFinished"></rename-view>
  </div>
</template>
<script>
import VgisBreadcrumb from "../Standard/vgis-breadcrumb.vue"
import grapesjsView from "./BIEditor/GrapesjsView";
import SaveEditorView from "./BIEditor/SaveEditorView";
import exitEditorView from "./BIEditor/ExitEditorView";
import ModelGroupIcon from '@/assets/images/icons/ModelGroupIcon.png'
import {
  getAllTemplate,
  getTemplate,
  addNewTemplate,
  updateTemplate,
  delTemplate,
  addTemplateGroup,
  updateTemplateGroup,
  deleteTemplateGroup
} from '@/assets/js/api/bitemplate'
import { uploadFile } from "@/assets/js/api/media-file"
import AddGroupView from "./BIEditor/AddGroupView";
import DeleteView from "./BIEditor/DeleteView";
import AddTemplateView from "./BIEditor/AddTemplateView";
import html2canvas from "html2canvas";
import config from "../../config";
import RenameView from "./BIEditor/RenameView";
import PreviewDialog from "./BIDashComponents/PreviewDialog";
import {updateModelGroup} from "../../assets/js/api/model-group";
import {updateModel} from "../../assets/js/api/model";

export default {
  name: "grapesjs-echarts-presets",
  components: {
    PreviewDialog,
    RenameView,
    AddTemplateView,
    DeleteView,
    AddGroupView,
    SaveEditorView,
    VgisBreadcrumb,
    grapesjsView,
    exitEditorView
  },
  data() {
    return {
      templates: [],//右侧界面数据
      searchData: "",
      searchRightData: '',
      selectFlag: '',
      saveFlag: false,
      templateInfo: {
        id: null,
        name: '',
        groupId: null,
        content: '',
        project: '',
        thumbnail: ''
      },
      ifEchartsEdit: false,
      hierarchy: [],
      groupTitle: 'All Templates',
      MethodParameter: {},
      imgHost: config.backend.host + 'media/',
      dataIndex: 0,
      ModelGroupIcon,
      //对话框开关
      dialogVisibility: {
        saveEditorView: false,
        previewDialog: false,
        addGroupView: false,//添加模板组界面
        exitEditorView: false,//退出界面
        deleteView: false,//删除模板组界面
        addTemplateView: false,//新增模板界面
        renameView: false,//重命名界面
      },
      editorContentsWhenOpen:'',
      addGroupData: {},
      renameData: {},
      deleteData: {},
      previewData: {}
    }
  },
  methods: {
    //获取页面截图及编码
    getImage() {
      let iframe = this.$el.getElementsByClassName("gjs-frame")[0]
      let content = iframe.contentWindow.document.body
      html2canvas(content, {allowTaint: true}).then((canvas) => {
        //转换base64
        const capture = canvas.toDataURL('image/png');
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
          this.templateInfo.thumbnail = res.data.id
        })
      })
    },
    actionFinished(dialogId, success) {
      this.dialogVisibility[dialogId] = false
      if (success) {
        if (dialogId === "saveEditorView") {
          this.changeView(false)
          this.groupTitle = 'All Templates'
        }
        if (dialogId === 'previewDialog') {
          this.editTemplate(this.previewData)
        }
        if (dialogId === "exitEditorView") {
          if (success !== 'exit') {
            this.getNameToSave()
          } else {
            this.changeView(false)
          }
        }
        if (dialogId === 'addTemplateView') {
          this.addTemplateName(success)
        }
        if (dialogId === 'deleteView') {
          this.groupTitle = 'All Templates'
        }
        this.getAllData()
      }
    },
    //向子组件传入的数据以及打开对话框
    addGroup(obj) {
      if (obj) {
        this.addGroupData = {
          groupId: obj.id,
          name: ''
        }
      } else {
        this.addGroupData = {
          groupId: null,
          name: ''
        }
      }
      this.dialogVisibility.addGroupView = true
    },
    renameItem(obj) {
      this.renameData = {
        id: obj.id,
        name: obj.name,
        thumbnail: obj.thumbnail || undefined
      }
      this.dialogVisibility.renameView = true
    },
    //预览界面
    previewTemplate(data) {
      this.previewData = data
      this.dialogVisibility.previewDialog = true
    },
    //删除界面
    deleteItem(obj) {
      this.deleteData = {
        id: obj.id,
        thumbnail: obj.thumbnail || undefined
      }
      this.dialogVisibility.deleteView = true
    },
    // 退出模板编辑界面
    backGroup() {
      // 如果编辑器内容有变化 -> 展示确认弹框
      if(this.$refs['grapesjsView'].getProjectData() !== this.editorContentsWhenOpen){
        this.dialogVisibility.exitEditorView = true
      }
      // 否则 直接退出
      else {
        this.templateInfo={}
        this.changeView(false)
      }
    },
    //新增模板并获取从属组id
    addTemplate(obj=null) {
      if (obj) {
        this.templateInfo.groupId = obj.id
      } else {
        this.templateInfo.groupId = null
      }
      this.dialogVisibility.addTemplateView = true
    },
    //新模板名称获取并打开template编辑界面
    addTemplateName(res) {
      //重置templateInfo
      this.templateInfo.id = null
      this.templateInfo.project = ''
      this.templateInfo.content = ''
      this.templateInfo.name = res
      this.changeView(true)
    },
    saveEditor(result) {
      Object.assign(this.templateInfo, result)
    },
    //打开保存模板对话框
    getNameToSave() {
      this.saveFlag = !this.saveFlag
      this.getImage()
      this.dialogVisibility.saveEditorView = true;
    },
    //编辑模板数据
    editTemplate(data) {
      getTemplate(data.id).then((res) => {
        Object.assign(this.templateInfo, res.data)
        this.editorContentsWhenOpen=res.data.project
        this.changeView(true)
      })
    },
    //初始化数据页面
    getAllData(query) {
      getAllTemplate({query: query}).then((result) => {
        this.hierarchy = result.data
        this.templates = []
        this.getGouJianIds(result.data)
      })
    },
    //右侧模板显示界面
    getTemplates(data) {
      this.templates = []
      this.getGouJianIds(data)
    },
    //树的选择项
    handleCommand(command) {
      if(this.ifEchartsEdit){
        this.backGroup()
      }else {
        let action = command.split('.')[0]
        let acLength = action.length
        let data = command.slice(acLength + 1)
        if (data !== '') {
          this.MethodParameter = JSON.parse(data)
          this[action](this.MethodParameter)
        } else {
          this[action]()
        }
      }

    },
    // 树节点选中事件
    selectModel(data, node) {
      if (this.selectFlag !== data.id) {
        this.selectFlag = data.id
        if (!data.thumbnail) {
          this.groupTitle = data.name
          this.getTemplates(data.children)
        } else {
          this.groupTitle = data.name
          this.getTemplates([data])
        }
      } else {
        this.selectFlag = ''
        node.isCurrent = false
        this.groupTitle = 'All Templates'
        this.getAllData()
      }
    },
    //扁平化模板递归工具方法
    getGouJianIds(list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].thumbnail) {
          this.templates.push(list[i])
        }
        if (list[i].children && list[i].children.length > 0) {
          this.getGouJianIds(list[i].children)
        }
      }
    },
    //展示界面与编辑界面切换
    changeView(data) {
      this.ifEchartsEdit = data
    },
    //树的拖拽遵循的规则
    allowDrop(dragNode, dropNode, type) {
      return !dropNode.data.thumbnail || type !== 'inner';
    },
    //树结构拖拽更新逻辑
    updatePosition(dragNode, dropNode, type) {
      let item = dragNode.data
      if (!item.thumbnail) {
        updateTemplateGroup(item.id, Object.assign({}, {
          groupId: type === 'inner' ? dropNode.data.id : (dropNode.parent.data.id || 'null')
        })).then(result => {
          this.groupTitle = 'All Templates'
          this.getAllData()
        })
      } else if (item.thumbnail) {
        updateTemplate(item.id, Object.assign({}, {
          groupId: type === 'inner' ? dropNode.data.id : (dropNode.parent.data.id || 'null')
        })).then(result => {
          this.groupTitle = 'All Templates'
          this.getAllData()
        })
      }
    },
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
        name: 'Templates'
      }]
    }
  },
  created() {
    this.getAllData()
  },
}
</script>
<style lang="scss" scoped>
//.allGroups {
//  display: flex;
//}
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
  height: 138px;
  overflow: hidden;

  .groupItemIn {
    border-radius: 4px;
    width: 100%;
    height: 102px;
    background: white;
  }

  .groupItemBottom {
    border-top: 1px solid white;
    background: #f5f5f5;
    height: calc(100% - 102px);
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 0 4%;
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

.blue {
  background-color: #409eff !important;

  .noc-vgis-hierarchy-name {
    color: white;
  }

  .text-link {
    color: white !important;
  }
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

.noc-vgis-table-detail {
  width: -webkit-fill-available;
  background: white;
  margin-right: 16px;
}
:deep(.el-input-group__append .el-button, .el-input-group__append .el-select, .el-input-group__prepend .el-button, .el-input-group__prepend .el-select) {
  margin-left: -21px;
  padding: 10px;
}

.vgis-adm .el-input.filter .el-input-group__append .el-button.el-button--primary {
  border-top: 0;
}

.save {
  position: absolute;
  right: 25px;
  top: 23px;
  width: 26px;
  height: 26px;
  font-size: 26px;
  line-height: 26px;
  color: #4FACFF;
  cursor: pointer;
}

.back {
  margin: 16px 0 14px 16px;
  width: 74px;
  height: 40px;
  padding: 12px 10px;
  border: none;
}

.groupTitle {
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 40px;
  color: #000000;
  max-width: 70%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.title {
  margin: 22px 0 20px 24px;
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  color: #000000;
  max-width: 60%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.pointer {
  padding: 5px;
  border-radius: 2px;
}

.text-danger:hover {
  .drop-del {
    color: white;
  }

  background: #d94343;
}

.pointer:hover {
  color: #0AB2DB;
  background-color: #d4ebff;
}

.text-oth:hover {
  .drop-oth {
    color: white;
  }

  background: #4facff;
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

.groupItemMoreEdit {
  float: right
}

//.groupItem {
//  margin: 15px 15px 0 0;
//  flex: 0 0 20%;
//  min-width: 220px;
//  height: 151px;
//  border: 1px solid #F5F5F5;
//  border-radius: 4px;
//  overflow: hidden;
//}
//
//.groupItem:hover {
//  //transform: translate(-2px,-2px);
//  border: 1px solid #4facff;
//  box-shadow: 0px 1px 20px 2px rgba(0, 0, 0, 0.1);
//.first-add{
//  border: 1px solid #4facff;
//}
//  .groupItemBottom {
//    border-top: 1px solid #F5F5F5;
//    background: #ffffff;
//  }
//}
:deep(.el-input-group__append .el-button, .el-input-group__append .el-select, .el-input-group__prepend .el-button, .el-input-group__prepend .el-select) {
  margin-left: -21px;
  padding: 10px;
}
.icon-search:before {
  font-size: 20px;
}

.vgis-adm .el-input.filter .el-input-group__append .el-button.el-button--primary {
  border-top: 0;
}
.groupItemBottom {
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 0 7px;
}

.groupItemName {
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;

  letter-spacing: 0px;
  text-align: left;

  .blockName {
    display: inline-block;
    width: 170px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.groupItemIn {
  width: 100%;
  height: 119px;
  //background: grey;
}

.noc-vgis-table-list {
  background: white;
  margin-right: 16px;
  width: 307px;
  flex-shrink: 0;
}

.noc-vgis-hierarchy-item {
  width: 100%;
  //padding: 5px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .noc-vgis-hierarchy-icon {
    width: 16px;
    height: 16px;
    min-width: 16px;
    min-height: 16px;
  }


}

.noc-vgis-hierarchy-name {
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 18px;
  //width: 50%;
  margin-left: 5px;
  color: #000000;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

//.noc-vgis-table-detail {
//  //padding: 16px;
//  background: white;
//  //width: calc(100% - 307px - 48px);
//  margin-right: 16px;
//}
* {
  font-family: HarmonyOS Sans;
}
</style>
