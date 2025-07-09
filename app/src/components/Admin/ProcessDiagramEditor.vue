<template>
    <div class="parent">
        <div class="side-left">
            <div class="back" @click="back">
                <i class="iconfont icon-back"/><span>{{ $t("action.back") }}</span>
            </div>
            <div class="svg-tree-p">
                <el-scrollbar class="scrollbar svg-tree" wrap-class="scrollbar-wrapper" ref="views">
                    <el-tree
                            :props="{ label: 'label', children: 'children' }"
                            class="node-tree"
                            :data="domTree"
                            :default-expand-all="true"
                            :default-expanded-keys="[leftTreeExpandKey]"
                            node-key="id"
                            highlight-current
                            ref="domTree"
                            :current-node-key="currentNodeKey"
                            :accordion="true"
                            :expand-on-click-node="false"
                            @node-click="selectDOMNode"
                    >
        <span class="custom-tree-node" slot-scope="{ node, data }" :data-absolutePath="data.nodeKeyId">
          <i class="iconfont icon-rect" v-if="data.nodeName==='rect'"/>
          <i class="iconfont icon-group" v-if="data.nodeName==='g'"/>
          <i class="iconfont icon-text1" v-if="data.nodeName==='text' || data.nodeName==='tspan'"/>
          <i class="iconfont icon-line1" v-if="data.nodeName==='line' "/>
          <i class="iconfont icon-circle" v-if="data.nodeName==='circle' "/>
          <i class="iconfont icon-polygon" v-if="data.nodeName==='polygon'"/>
          <i class="iconfont icon-polyline" v-if="data.nodeName==='polyline'"/>
          <i class="iconfont icon-path" v-if="data.nodeName==='path'"/>
          <i class="iconfont icon-image" v-if="data.nodeName==='image'"/>
          <i class="iconfont icon-mask" v-if="data.nodeName==='mask'"/>
          <i class="iconfont icon-use" v-if="data.nodeName==='use'"/>
        <span>{{ node.label }}</span>
      </span>
                    </el-tree>
                </el-scrollbar>
            </div>
        </div>
        <div class="main">
            <div class="main-top">
                <div class="title">
                    <div>{{ pid && pid.name }}</div>
                </div>
                <div class="main-top-aside">
                    <div class="icons">
                        <div class="item"><i class="iconfont icon-refresh" @click="resetPidRules"/></div>
                        <div class="item"><i class="iconfont icon-view" @click="previewPid"/></div>
                        <div class="item"><i class="iconfont icon-enlarge" @click="magnifyCanvas"/></div>
                        <div class="item"><i class="iconfont icon-fullsize" @click="resetCanvas"/></div>
                        <div class="item"><i class="iconfont icon-zooming" @click="shrinkCanvas"/></div>
                    </div>
                    <div class="save">
                        <el-button class="svg-save-button" type="primary" size="small" @click="savePID">
                            {{ $t("action.save") }}
                        </el-button>
                    </div>
                </div>
            </div>
            <div class="main-bottom-svg" id="svg-canvas-parent">
                <vue-draggable-resizable :lock-aspect-ratio="true" w="auto" h="auto" :resizable="false">
                    <div ref="svg" id="draggable-svg-canvas" @wheel.prevent="handleSvgWheel($event)">
                        <div ref="svgMainC" @click="clickSvg($event)" style="background-color: #0c1c32"
                             id="svg-container-tree"
                             v-html="pid && pid.map"></div>
                    </div>
                </vue-draggable-resizable>
            </div>
        </div>
        <div class="side-right">
            <div class="right-top">
                <div class="svgId" :title="currentEleLabel">{{ currentEleLabel }}</div>
                <div class="type">{{ nodeName }}</div>
            </div>
            <div class="right-main">
                <div>
                    <div class="titleDiv">{{ $t("label.pid.instance") }}</div>
                    <el-tree
                            class="instances"
                            :props="{ label: 'name' }"
                            default-expand-all
                            :expand-on-click-node="false"
                            :data="hierarchy"
                            @current-change="selectInstance">
                        <span class="instance-tree-node" slot-scope="{ node, data }">
                            {{data.name}}
                            <i v-if="data.id === selectedInstance.id" class="el-icon-circle-check text-primary"></i>
                        </span>
                    </el-tree>
                </div>
                <div class="rules">
                    <div class="titleDivBottom">
                        <div>{{ $t("label.pid.rule") }}</div>
                        <div>
                            <el-button type="text" :disabled="!currentEle" @click="addRule">
                                <i :class="['iconfont', 'icon-add', 'title-icon-item', { disabled: !currentEle }]"/>
                            </el-button>
<!--                            <el-button type="text" :disabled="!currentEle" @click="moveRuleUp">-->
<!--                                <i :class="['iconfont', 'icon-move-up', 'title-icon-item', { disabled: !currentEle }]"/>-->
<!--                            </el-button>-->
<!--                            <el-button type="text" :disabled="!currentEle" @click="moveRuleDown">-->
<!--                                <i :class="['iconfont', 'icon-move-down', 'title-icon-item', { disabled: !currentEle }]"/>-->
<!--                            </el-button>-->
<!--                            <el-button type="text" :disabled="!currentEle" @click="deleteRule(checkedRules)">-->
<!--                                <i :class="['iconfont', 'icon-delete', 'title-icon-item', { disabled: !currentEle }]"/>-->
<!--                            </el-button>-->
                        </div>
                    </div>
                    <div class="item bottom">
                        <div class="rule-item" v-for="(rule, index) in pid.pid_anchor_points" v-if="rule.xPath === currentEle.id">
                            <div class="label">{{ rule.name }}</div>
                            <div class="icons">
                                <i class="el-icon-edit-outline title-icon-item text-primary" @click="editRule(index, rule)"></i>
                                <i class="el-icon-delete title-icon-item text-danger" @click="deleteRule(index)"></i>
                                <i class="iconfont icon-move"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <AddPIDRule
                v-if="dialog.addPIDRuleDialog"
                :dialogVisibility="dialog.addPIDRuleDialog"
                dialogId="addPIDRuleDialog"
                :pid="pid"
                :dom-instance="currentEle"
                @action-finished="actionFinished"></AddPIDRule>
        <EditPIDRule
                v-if="dialog.editPIDRuleDialog"
                :dialogVisibility="dialog.editPIDRuleDialog"
                dialogId="editPIDRuleDialog"
                :pid="pid"
                :dom-instance="currentEle"
                :rule="editRuleData.rule"
                :rule-index="editRuleData.index"
                @action-finished="actionFinished"></EditPIDRule>
        <PreviewPIDView v-if="dialog.previewPIDDialog" :dialogVisibility="dialog.previewPIDDialog"
                        dialogId="previewPIDDialog"
                        @action-finished="actionFinished" :pid="pid"/>
    </div>
</template>

<script>
import AddPIDRule from "./PID/AddPIDRule";
import EditPIDRule from "@/components/Admin/PID/EditPIDRule.vue";
import PreviewPIDView from "./PID/PreviewPIDView";
import {updatePID} from "@/assets/js/api/model-instance-pid";
import {getDiagram, updateDiagram} from "@/assets/js/api/pid";
import {getHierarchy} from "@/assets/js/api/hierarchy";

export default {
    name: "ProcessDiagramEditor",
    components: {
        PreviewPIDView,
        AddPIDRule,
        EditPIDRule
    },
    data() {
        return {
            leftTreeExpandKey: 0,
            currentNodeKey: '',
            resizeZoom: '',
            pid: "",
            svgProperties: {
                x: 'X',
                y: 'Y',
                fill: 'Fill',
                color: 'Color',
                visibility: 'Visibility',
                width: 'Width',
                height: 'Height',
                rotate: 'Rotate',
                text: 'Text',
                stroke: 'Stroke',
                'stroke-width': 'StrokeWidth'
            },
            checkedRules: [],
            currentEle: '',
            currentEleLabel: '',
            nodeName: '',
            model: {},
            list: [],
            dialog: {
                addPIDRuleDialog: false,
                editPIDRuleDialog: false,
                previewPIDDialog: false,
            },
            editRuleData: {},
            svgItemAttributes: [],
            nodeKeyId: 0,
            domTree: [],
            hierarchy: [],
            selectedInstance: ""
        };
    },
    computed: {
        currentEleDom() {
            return this.currentEle ? $(`#${this.currentEle}`)[0] : ''
        },
        relations() {
            return this.currentEle ? JSON.parse($(`#${this.currentEle}`)[0].getAttribute('relations')) : ''
        },
    },
    methods: {
        clickSvg(e) {
            // svg 对应元素高亮
            let node = e.target
            let svg = this.domTree[0].node
            if (this.$refs.svgMainC.isEqualNode(node)) {
                return this.highlightNodeOnSVG()
            }
            else if (svg.isEqualNode(node)) {
                return this.highlightNodeOnSVG()
            }
            let item = node, path = []
            while (!svg.isEqualNode(item)) {
                let siblings = item.parentNode.children
                for(let i = 0; i < siblings.length; i++) {
                    if (item.isEqualNode(siblings[i])) {
                        path = [i].concat(path)
                    }
                }
                item = item.parentNode
            }
            path = [0].concat(path)
            this.currentNodeKey = path.join("-")
            let tree = this.domTree, selectedItem = null
            for(let i = 0; i < path.length; i++) {
                selectedItem = tree[path[i]]
                tree = tree[path[i]].children
            }
            this.highlightNodeOnSVG(selectedItem)
            // let id = ''
            // if (node.getAttribute('id')) {
            //     id = node.getAttribute('id')
            // } else {
            //     id = node.parentElement.getAttribute('id')
            // }
            // this.refreshAttr(this.$refs['domTree'].getNode(node.nodeKeyId))
            // this.refreshRuleList(this.currentEle)
            // // 树节点对应 node 高亮
            // this.$refs['domTree'].setCurrentKey(node.nodeKeyId);
            // this.leftTreeExpandKey = this.$refs['domTree'].getNode(node.nodeKeyId).parent.key
            // this.nodeScroll()
        },
        nodeScroll() {
            setTimeout(() => {
                this.$nextTick(() => {
                    // 获取所有节点
                    let liList = this.$refs["domTree"].$el.getElementsByClassName('is-current');
                    liList[0].scrollIntoView()
                    let scrollBar = this.$refs.views.$el.querySelector('.scrollbar-wrapper');
                    scrollBar.scrollTop -= 15
                })
            }, 0);
        },
        svgInnerHtml() {
            return $(`#svg-container-tree`)[0].innerHTML
        },
        // 重置pid所有rules映射关系
        resetPidRules() {
            this.$confirm('Action cannot be reversed, are you sure?', 'Warning', {
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                $('*').attr('relations', '')
                this.refreshRuleList()
            }).catch(() => {
            })
        },
        // 保存
        savePID() {
            this.resetSvg()
            let svgDocDom = $(`#svg-container-tree`)[0].innerHTML
            let svgFile = new File([svgDocDom], this.pid.name, {type: 'image/svg+xml'})
            updateDiagram(this.pid.id, {
                nodeId: this.selectedInstance ? this.selectedInstance.id : "null",
                rules: this.pid.pid_anchor_points
            }).then(result => {
                this.$message({
                    message: this.$t("message.pid.updated"),
                    type: 'success',
                    showClose: true,
                    duration: 2000
                })
            })
            // updatePID(this.pid.instanceId, this.pid.id, Object.assign({}, this.pid, {pid: svgFile})).then(response => {
            //     sessionStorage.setItem('pid', JSON.stringify(Object.assign({}, this.pid, {map: svgDocDom})))
            //     this.$message({
            //         message: 'Updated successfully.',
            //         type: 'success',
            //         showClose: true,
            //         duration: 2000
            //     })
            // })
        },
        // 上移选中的 rule
        moveRuleUp() {
            if (this.checkedRules.length === 1) {
                let index = this.list.indexOf(this.checkedRules[0])
                if (index) {
                    this.list.splice(index, 1)
                    this.list = [...this.list.slice(0, index - 1), ...this.checkedRules, ...this.list.slice(index - 1)]
                    this.setResortedRelations()
                    this.$nextTick(() => {
                        this.$refs['rules-tree'].setCheckedKeys([this.checkedRules[0].nodekey]);
                    })
                }
            }
        },
        // 下移选中的 rule
        moveRuleDown() {
            if (this.checkedRules.length === 1) {
                let index = this.list.indexOf(this.checkedRules[0])
                this.list.splice(index, 1)
                this.list = [...this.list.slice(0, index + 1), ...this.checkedRules, ...this.list.slice(index + 1)]
                this.setResortedRelations()
                this.$nextTick(() => {
                    this.$refs['rules-tree'].setCheckedKeys([this.checkedRules[0].nodekey]);
                })
            }
        },
        // list 重新排序 => attrs 中的 relations 字段也重新排序
        setResortedRelations() {
            let newRelations = {}
            let oldRelations = JSON.parse(this.currentEleDom.getAttribute('relations'))
            newRelations = this.list.reduce((result, item) => {
                for (let key in oldRelations) {
                    if (key === item.attr) {
                        if (result[key]) {
                            result[key].push(item.detail)
                        } else {
                            result[key] = [item.detail]
                        }
                    }
                }
                return result
            }, {})
            this.currentEleDom.setAttribute('relations', JSON.stringify(newRelations))
        },
        // 预览pid图（带动效）
        previewPid() {
            this.resetSvg()
            this.dialog.previewPIDDialog = true
        },
        addRule () {
            // TODO: 在这里添加规则
            this.dialog.addPIDRuleDialog = true
        },
        // 编辑映射规则
        editRule(index, rule) {
            this.editRuleData = {
                rule, index
            }
            this.dialog.editPIDRuleDialog = true
        },
        // 删除规则(一个或多个)
        deleteRule(index) {
            if (!(index instanceof Array)) {
                index = [index]
            }
            let indexMap= index.reduce((res, idx) => {
                res[idx] = true
                return res
            }, {})
            this.pid.pid_anchor_points = this.pid.pid_anchor_points.filter((item, idx) => !indexMap[idx])
        },
        // 规则列表选中事件，修改已选中列表
        rulesListCheck(checkedKeys, checked) {
            this.checkedRules = checked.checkedNodes
        },
        // 添加映射规则
        addRules(item) {
            this.model = {attribute: item, source: {treeSelect: {now: this.pid.treeId}}}
            console.log(this.model, 'to child')
            this.dialog.addPIDRuleDialog = true
        },
        // 点击放大icon 放大svg
        magnifyCanvas() {
            this.$refs.svg.style.zoom ? this.$refs.svg.style.zoom = parseInt(this.$refs.svg.style.zoom, 10) * 1.02 + '%' : this.$refs.svg.style.zoom = '102%'
        },
        // 点击缩小icon 缩小svg
        shrinkCanvas() {
            this.$refs.svg.style.zoom ? this.$refs.svg.style.zoom = parseInt(this.$refs.svg.style.zoom, 10) / 1.02 + '%' : this.$refs.svg.style.zoom = '98%'
        },
        // 重置svg画布大小
        resetCanvas() {
            this.$refs.svg.style.zoom = '100%';
        },
        // 鼠标滚轮放大缩小 svg
        handleSvgWheel(event) {
            let obj = this.$refs.svg;
            return this.svgZoom(obj, event);
        },
        svgZoom(obj, event) {
            // 一开始默认是100%
            let zoom = parseInt(obj.style.zoom, 10) || 100;
            // 滚轮滚一下wheelDelta的值增加或减少120
            zoom += event.wheelDelta / 12;
            if (zoom > 0) {
                obj.style.zoom = zoom + "%";
            }
            return false;
        },
        // 重置svg图片的高亮状态
        resetSvg() {
            if (this.currentEle && this.currentEle.length) {
                // $(`#${this.currentEle}`).removeClass('mySvgCustomClass')
                let allSelect = $(`#${this.escapeJquery(this.currentEle)}`)
                if (allSelect) {
                    allSelect.removeClass('mySvgCustomClass')
                }
            }
        },
        // 刷新 rule list
        refreshRuleList(idName) {
            this.list = []
            if (idName) {
                let currentDom = document.getElementById(idName)
                if (currentDom && currentDom.getAttribute('relations')) {
                    let relationGroup = JSON.parse(currentDom.getAttribute('relations'))
                    // 把所有 relations 中所有 rule 赋给 rule list
                    if (relationGroup) {
                        for (let key in relationGroup) {
                            for (let item of relationGroup[key]) {
                                this.list.push({
                                    attr: `${item['attribute'].name}`,
                                    label: `${item['source'].treeSelect.now}-${item['source'].name}`,
                                    assort: `${item['source'].assort}`,
                                    nodekey: JSON.stringify(item),
                                    detail: item,
                                })
                            }
                        }
                    }
                }
            }
        },
        escapeJquery(srcString) {
            // 转义之后的结果
            let resultStr = srcString;
            // jquery中的特殊字符
            let jquerySpecialChars = ["~", "`", "@", "#", "%", "&", "=", "'", "\"", ":", ";", "<", ">", ",", "/"];
            for (let i = 0; i < jquerySpecialChars.length; i++) {
                resultStr = resultStr.replace(new RegExp(jquerySpecialChars[i],
                    "g"), "\\" + jquerySpecialChars[i]);
            }
            return resultStr;
        },
        highlightNodeOnSVG (node) {
            if (this.currentEle) {
                this.currentEle.node.classList.remove("mySvgCustomClass")
                this.currentEle = ""
            }
            if (node) {
                node.node.classList.add("mySvgCustomClass")
                this.currentEle = node
            }
        },
        // 树节点点击 =>  1.触发svg图片的高亮  &&  2.右侧attribute联动  &&  3.右侧ruleList联动
        selectDOMNode (data, node, v) {
            // 高亮svg中的对应元素
            this.highlightNodeOnSVG(data)
            // // 2-----------------
            // this.refreshAttr(node)
            // // 3-----------------
            // this.refreshRuleList(this.currentEle)
        },
        getNodeName (tagName, id, className) {
            let result = tagName
            if (id) {
                result += "#id"
            }
            else if (className) {
                result += ("." + className.split(" ").join("."))
            }
            return result
        },
        // dom树转换为可迭代数组 用来支持el-tree的展示
        nodesToArray(nodes, parentPath = []) {
            let result = []
            for(let i = 0; i < nodes.length; i++) {
                let node = nodes[i]
                let tag = node.tagName
                let id = node.id
                let className = node.getAttribute("class") || ""
                let path = parentPath.concat(i)
                let item = {
                    id: path.join("-"),
                    label: this.getNodeName(tag, id, className),
                    node
                }
                if (node.children.length > 0) {
                    item.children = this.nodesToArray(node.children, path)
                }
                else {
                    item.children = []
                }
                result.push(item)
            }
            return result
        },
        // 初始化svg dom tree
        initSvgDomTree() {
            let rootNode = this.$refs.svgMainC
            let childrenList = rootNode.children
            let realSvg = null
            for(let i = 0; i < childrenList.length; i++) {
                let node = childrenList[i]
                if (node.toString() === '[object SVGSVGElement]') {
                    realSvg = node
                }
            }
            if (realSvg) {
                this.domTree = this.nodesToArray([realSvg])
            }
        },
        // 树节点拖动回调 修改svg信息
        updatePosition(node, lastGo, location, event) {
            this.setResortedRelations()
        },
        allowDrop(draggingNode, dropNode, type) {
            return type !== 'inner';
        },
        allowDrag() {
            return true;
        },
        // 路由返回
        back() {
            this.$router.go(-1)
        },
        actionFinished (success, dialogId, extra) {
            this.dialog[dialogId] = false
            if (success) {
                if (dialogId === 'addPIDRuleDialog') {
                    this.pid.pid_anchor_points = this.pid.pid_anchor_points.concat([extra])
                }
                if (dialogId === 'editPIDRuleDialog') {
                    this.pid.pid_anchor_points[this.editRuleData.index] = extra
                }
            }
        },
        loadEditor () {
            this.initSvgDomTree()
            let child = $('#svg-container-tree'), parent = $('#svg-canvas-parent')
            let widthComp = parent.width() / child.width(), heightComp = parent.height() / child.height()
            if (widthComp > heightComp) {
                this.resizeZoom = heightComp
            } else {
                this.resizeZoom = widthComp
            }
            child.css('zoom', this.resizeZoom)
        },
        getDiagram(reload = true) {
            getDiagram(this.$route.params.diagramId).then(result => {
                this.pid = result.data
                if (this.pid.model_instance) {
                    this.selectedInstance = this.pid.model_instance
                }
                if (reload) {
                    this.$nextTick(() => {
                        this.loadEditor()
                    })
                }
            })
        },
        selectInstance (data, node) {
            if (!data.poi) {
                return
            }
            if (!this.selectedInstance || this.selectedInstance.id !== data.id) {
                this.selectedInstance = data
            }
            else {
                this.selectedInstance = ""
            }
        },
        getHierarchy () {
            getHierarchy().then(result => {
                this.hierarchy = result.data
            })
        },
    },
    created () {
        this.getHierarchy()
    },
    mounted() {
        this.getDiagram(true)
    }
}
</script>

<style lang="scss" scoped>

.rules-tree {
  :deep(.el-tree-node__content) {
    height: 40px;
    padding-left: 10px !important;
  }

  :deep(.el-tree-node__content > .el-tree-node__expand-icon) {
    display: none;
  }

  .rules-tree-node {
    width: 90%;
    display: flex;
    justify-content: space-between;
    align-items: center;

  }

  .rule-list-label {
    max-width: 75%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .icons {
    color: #4FACFF;
    font-size: 10px;

    .icon-item {
      margin-right: 4px;
      font-weight: 700
    }

    .icon-move {
      cursor: move;
      margin-right: 4px;
      font-size: 13px;
    }
  }
}

//#draggable-svg-canvas{
//  left: 50%;
//  top: 50%;
//  transform: translate(-50%, -50%) !important;
//}

.parent {
  display: flex;
  height: calc(100% - 60px);
  width: 100%;
}

.main {
  background: -webkit-linear-gradient(top, transparent 30px, #d3d3d3 31px), -webkit-linear-gradient(left, transparent 30px, #d3d3d3 31px);
  background-size: 31px 31px;
  flex: 1;

  .main-top {
    position: relative;
    z-index: 2;

    .main-top-aside {
      display: flex;
      padding: 0 20px;
      align-items: center;
      justify-content: space-between;
      height: 42px;
      background-color: white;

      .svg-save-button {
        font-weight: 500
      }

      .icons {
        display: flex;

        .iconfont {
          font-size: 20px;
        }

        .item {
          font-size: 20px;
          cursor: pointer;
          margin-right: 27px;

          img {
            cursor: pointer;
            width: 100%;
          }
        }
      }
    }

    .title {
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #B3B3B3;
    }
  }

  .main-bottom-svg {
    height: calc(100% - 42px);
    overflow: hidden
  }
}

.side-left {
  width: 306px;
  border: 1px solid #D4D4D4;
  background-color: white;
  height: 100%;
  z-index: 2;

  .back {
    cursor: pointer;
    color: #4FACFF;
    display: flex;
    padding-left: 15px;
    align-items: center;
    height: 42px;
    background-color: #d4ebff;

    .icon-back {
      margin-right: 6px;
    }
  }

  .node-tree {
    padding: 10px;
  }

  .svg-tree {
    height: 100%;
    //overflow: scroll;
  }

  .svg-tree-p {
    height: calc(100% - 42px);
    //overflow: scroll;
  }
}

.side-right {
  z-index: 2;
  background-color: white;
  border: 1px solid #D4D4D4;
  width: 355px;
  height: 100%;
  overflow: scroll;

  .right-top {
    height: 50px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    align-items: center;

    .svgId {
      font-size: 24px;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .type {
      font-size: 18px;
      font-weight: 400;
    }
  }

  .right-main {
    .instances {
      max-height: 300px;
      overflow: scroll;
    }

    .item {
      background-color: white;
    }

    .top {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 18px 16px 6px 16px;

      .attr-item {
        width: 48%;
        height: 56px;
        background-color: #f5f5f5;
        padding: 7px 11px;
        margin-bottom: 10px;

        .name-add {
          font-size: 16px;
          display: flex;
          justify-content: space-between;
          white-space: nowrap;

          .name {
            max-width: 70%;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .icon-add1 {
            color: #4FACFF;
            cursor: pointer;
          }
        }

        .value {
          font-size: 14px;
          color: #B2B2B2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    .bottom {
      background-color: white;
    }

    .titleDiv {
      height: 42px;
      background-color: #efefef;
      font-weight: 700;
      font-size: 16px;
      display: flex;
      align-items: center;
      padding-left: 12px;
    }

    .titleDivBottom {
      height: 42px;
      background-color: #efefef;
      font-weight: 700;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 12px;

      .title-icon-item.disabled {
        color: #A0A0A0;
      }

      .title-icon-item {
        color: #4FACFF;
        cursor: pointer;
      }
    }
  }
}

.svg-tree :deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
  background-color: #4facff;
}

.side-left ::-webkit-scrollbar {
  display: block;
}

.instance-tree-node {
  width: 100%;
  padding-right: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rule-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;

  .icons {
    cursor: pointer;
  }
}
</style>
<style>
.mySvgCustomClass {
    stroke: red;
    stroke-width: 2;
}
</style>
