<template>
    <div class="rc-editor">
        <div class="rc-widgets">
            <div v-for="group in Widgets">
                <div class="rc-widgets-group-name" :style="{ color: group.color }">{{$t(group.label)}}</div>
                <el-tooltip v-for="widget in group.widgets" :content="$t(widget.description)" placement="right">
                    <el-card @dragstart.native="pickWidget($event, widget)" draggable="true" :body-style="{ padding: '10px 20px', background: group.color}" shadow="none" class="border-radius-0 text-center pointer">
                        <h4 class="m-t-0 m-b-0 text-bold text-white">{{$t(widget.label)}}</h4>
                    </el-card>
                </el-tooltip>
            </div>
        </div>
        <div id="drawflow" class="rc-workspace" tabindex="0" @drop="placeWidget" @dragover="e => e.preventDefault()"></div>
        <div class="rc-actions">
            <el-button circle type="default" :title="$t('action.back')" class="text-bold el-icon-back" @click="cancel"></el-button>
            <el-button v-if="testing" circle type="danger" :title="$t('action.test')" class="text-bold el-icon-close" @click="quitTest"></el-button>
            <el-button v-else circle type="primary" :title="$t('action.test')" class="text-bold el-icon-s-promotion" @click="test"></el-button>
            <el-button circle type="primary" :title="$t('action.save')" class="text-bold el-icon-check" @click="save" v-if="editable"></el-button>
            <el-button circle type="danger" :title="$t('action.delete')" class="text-bold el-icon-delete" @click="remove" v-if="editable"></el-button>
        </div>
        <div class="rc-test-panel" v-if="testing">
            <el-popover width="500" v-model="showTestPanel">
                <el-form class="p-10" style="border: 1px silver dashed" label-position="top">
                    <el-form-item size="small" :label="$t('label.model.instance')" class="m-b-0">
                        <el-select class="full-w" v-model="testData.instance.id" @change="selectInstance">
                            <el-option value="" :label="$t('label.basic.custom')"></el-option>
                            <el-option v-for="instance in instances" :key="instance.id" :value="instance.id" :label="`${instance.name} - ${instance.instanceId}`">
                                <span>{{instance.name}}</span>
                                <span class="pull-right">{{instance.instanceId}}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('model.instance.id')" size="small" class="m-b-0">
                        <el-input :disabled="!!testData.instance.id" v-model="testData.instance.instanceId"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('model.instance.name')" size="small" class="m-b-0">
                        <el-input :disabled="!!testData.instance.id" v-model="testData.instance.name"></el-input>
                    </el-form-item>
                    <el-tabs>
                        <el-tab-pane :label="$t('label.instance.attribute')">
                            <div style="max-height: 500px; overflow-y: scroll;">
                                <el-form-item size="small" v-for="attr in model.static_attributes" :label="attr.name" :key="attr.id" class="m-b-0">
                                    <el-input :disabled="!!testData.instance.id" v-model="testData.instance.static_attributes[attr.id]" v-if="attr.dataType === 'String'"></el-input>
                                    <el-input :disabled="!!testData.instance.id" v-model="testData.instance.static_attributes[attr.id]" type="textarea" rows="4" v-if="attr.dataType === 'Text'"></el-input>
                                    <el-input :disabled="!!testData.instance.id" v-model="testData.instance.static_attributes[attr.id]" :min="attr.min" :max="attr.max" type="number" v-if="attr.dataType === 'Integer'"></el-input>
                                    <el-input :disabled="!!testData.instance.id" v-model="testData.instance.static_attributes[attr.id]" :min="attr.min" :max="attr.max" type="number" v-if="attr.dataType === 'Decimal'"></el-input>
                                    <el-select :disabled="!!testData.instance.id" v-model="testData.instance.static_attributes[attr.id]" class="full-w" v-if="attr.dataType === 'Enum'">
                                        <el-option v-for="value in attr.candidate" :key="value" :label="value" :value="value"></el-option>
                                    </el-select>
                                    <el-select :disabled="!!testData.instance.id" v-model="testData.instance.static_attributes[attr.id]" class="full-w" v-if="attr.dataType === 'Boolean'">
                                        <el-option :value="true" label="Yes"></el-option>
                                        <el-option :value="false" label="No"></el-option>
                                    </el-select>
                                    <el-date-picker :disabled="!!testData.instance.id" class="full-w" v-model="testData.instance.static_attributes[attr.id]" type="datetime" v-if="attr.dataType === 'DateTime'"></el-date-picker>
                                    <el-date-picker :disabled="!!testData.instance.id" class="full-w" v-model="testData.instance.static_attributes[attr.id]" type="date" v-if="attr.dataType === 'Date'"></el-date-picker>
                                    <el-time-picker :disabled="!!testData.instance.id" class="full-w" v-model="testData.instance.static_attributes[attr.id]" v-if="attr.dataType === 'Time'"></el-time-picker>
                                </el-form-item>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane :label="$t('label.ruleChain.testData')">
                            <el-form-item :label="$t('label.protocol.contentType')" class="m-b-0" size="small">
                                <el-select v-model="testData.contentType">
                                    <el-option v-for="type in types" :key="type" :value="type" :label="type"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('label.ruleChain.testData')" class="m-b-0" size="small">
                                <codemirror :options="{ mode: 'application/json', theme: 'base16-light', lineNumbers: true, inputStyle: 'textarea' }" v-if="testData.contentType === 'application/json'" v-model="testData.data"></codemirror>
                                <el-input v-else type="textarea" :rows="12" v-model="testData.data"></el-input>
                            </el-form-item>
                        </el-tab-pane>
                    </el-tabs>
                </el-form>
                <div class="m-t-20">
                    <el-button size="small" class="pull-right" type="primary" @click="submitTest">{{$t("action.submit")}}</el-button>
                </div>
                <el-button slot="reference" circle type="primary" class="text-bold el-icon-setting"></el-button>
            </el-popover>
        </div>
    </div>
</template>

<script>

import EventBus from "@/utils/EventBus";
import Vue from 'vue'
import Widgets from "@/components/Admin/RuleChain/Widgets";
import DrawFlow from "drawflow"
import 'drawflow/dist/drawflow.min.css'

import {
    getRuleChainDetail,
    removeRuleChain,
    testRuleChain,
    updateRuleChain
} from "@/assets/js/api/model-instance-rule-chain";
import {getModelDetail} from "@/assets/js/api/model";
import {getModelInstanceDetail, getModelInstanceList} from "@/assets/js/api/model-instance";

export default {
    name: "RuleChainEditor",
    props: {
        chainId: String,
        editable: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            model: {},
            instances: [],
            chain: {},
            testData: {
                instance: {
                    id: "",
                    name: "",
                    instanceId: "",
                    static_attributes: {}
                },
                contentType: "application/json",
                data: ""
            },
            types: ["application/json", "text/plain"],
            testing: false,
            showTestPanel: false,
            Widgets
        }
    },
    methods: {
        getRuleChain () {
            getRuleChainDetail(this.chainId).then(result => {
                this.chain = result.data
                this.loadEditor()
            })
        },
        loadEditor() {
            let that = this
            let id = document.getElementById("drawflow");
            this.editor = new DrawFlow(id, Vue, this);
            this.editor.start();
            // Register widgets
            for(let i = 0; i < Widgets.length; i++) {
                let group = Widgets[i]
                if (!group.widgets) continue
                for(let j = 0; j < group.widgets.length; j++) {
                    let widget = group.widgets[j]
                    this.editor.registerNode(widget.name, widget.template, {
                        label: this.$t(widget.label),
                        color: group.color,
                        editor: this.editor
                    })
                }
            }
            this.nodes = {}
            this.editor.on('nodeCreated', id => {
                that.nodes[id] = id
            })
            this.editor.on('nodeRemoved', id => {
                delete that.nodes[id]
            })
            this.editor.on("connectionCreated", info => {
                // 每个输入点位仅允许一个输入
                const nodeInfo = this.editor.getNodeFromId(info.input_id);
                let connections = nodeInfo.inputs[info.input_class].connections
                if(connections.length > 1) {
                    const removeConnectionInfo = connections[connections.length - 1];
                    this.editor.removeSingleConnection(removeConnectionInfo.node, info.input_id, removeConnectionInfo.input, info.input_class);
                }
            });
            if (this.chain.configStr) {
                this.editor.import(this.chain.configuration)
                for(let id in this.chain.configuration.drawflow.Home.data) {
                    this.nodes[id] = id
                }
            }
        },
        releaseEditor () {  },
        selectInstance (instanceId) {
            if (instanceId) {
                let instance = this.instances.find(item => item.id === instanceId)
                this.testData.instance.name = instance.name
                this.testData.instance.instanceId = instance.instanceId
                getModelInstanceDetail(instanceId).then(result => {
                    let attributes = result.data.attribute_values
                    for(let i = 0; i < attributes.length; i++) {
                        let attr = attributes[i]
                        this.testData.instance.static_attributes[attr.attributeId] = attr.value
                    }
                })
            }
            else {
                this.testData.instance.name = ""
                this.testData.instance.instanceId = ""
                for(let id in this.testData.instance.static_attributes) {
                    this.testData.instance.static_attributes[id] = ""
                }
            }
        },
        pickWidget (event, widget) {
            widget = Object.assign({}, widget)
            delete widget.template
            event.dataTransfer.setData("node", JSON.stringify(widget))
        },
        placeWidget (event) {
            let widget = JSON.parse(event.dataTransfer.getData("node"))
            this.editor.addNode(widget.label, widget.inputs, widget.outputs, event.offsetX, event.offsetY, "", {}, widget.name, 'vue')
        },
        cancel () {
            this.$emit("cancel")
        },
        test () {
            this.testing = true
            this.getModel()
            for(let id in this.nodes) {
                const nodeInfo = this.editor.getNodeFromId(id);
                EventBus.$emit("update-test-mode", nodeInfo.id, true)
            }
        },
        quitTest () {
            this.testing = false
            for(let id in this.nodes) {
                const nodeInfo = this.editor.getNodeFromId(id);
                EventBus.$emit("update-test-mode", nodeInfo.id, false)
            }
        },
        submitTest () {
            let data = this.editor.export()
            this.testData.instance.model = this.model
            testRuleChain(data, this.testData).then(result => {
                for(let nodeId in result.data) {
                    const nodeInfo = this.editor.getNodeFromId(nodeId);
                    EventBus.$emit("test-finished", nodeInfo.id, result.data[nodeId])
                }
                this.showTestPanel = false
            })
        },
        save () {
            let data = this.editor.export()
            let formData = Object.assign({}, this.chain, { configuration: data })
            delete formData.configStr
            updateRuleChain(this.chainId, formData).then(result => {
                this.$message({
                    type: 'success',
                    message: this.$t("message.ruleChain.updated"),
                    showClose: true
                })
            })
        },
        remove () {
            this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
                confirmButtonText: this.$t("action.confirm"),
                cancelButtonText: this.$t("action.cancel"),
                type: 'warning'
            }).then(() => {
                removeRuleChain(this.chainId).then(result => {
                    this.$message({
                        type: 'success',
                        message: this.$t("message.ruleChain.deleted"),
                        showClose: true
                    })
                    this.$emit("finished")
                })
            })
        },
        getModel () {
            getModelDetail(this.$route.params.modelId).then(result => {
                this.model = result.data
                this.testData.instance.static_attributes = this.model.static_attributes.reduce((result, attr) => {
                    result[attr.id] = ""
                    return result
                }, {})
            })
            getModelInstanceList(this.$route.params.modelId).then(result => {
                this.instances = result.data
            })
        }
    },
    mounted () {
        this.getRuleChain()
    },
    beforeDestroy() {
        this.releaseEditor()
    }
}
</script>

<style lang="scss">
    .rc-editor {
        width: 100%;
        height: 100%;
        display: flex;
        border: 1px solid #4FACFF;
        position: relative;

        .rc-widgets {
            width: 199px;
            height: 100%;
            border-right: 1px solid #4FACFF;

            .rc-widgets-group-name {
                font-size: 14px;
                line-height: 24px;
                text-align: center;
            }

        }

        .rc-workspace {
            flex-grow: 1;
            height: 100%;
            background-image: linear-gradient(to right, #f1f1f1 1px, transparent 1px), linear-gradient(to bottom, #f1f1f1 1px, transparent 1px);
            background-size: 25px 25px;
            position: relative;
        }

        .rc-actions {
            position: absolute;
            right: 20px;
            top: 20px;
        }

        .rc-test-panel {
            position: absolute;
            right: 20px;
            bottom: 20px;
        }

        .drawflow-node {
            background: #FFFFFF;
            border: 2px solid #4FACFF;
        }

        .drawflow-node.selected {
            background: #dbeeff;
        }

        .output {
            border: 2px solid #CACACA !important;
        }

        .output:hover {
            background: #4FACFF !important;
        }

        .input {
            border: 2px solid #CACACA !important;
            background: #FFFFFF !important;
        }

        .input:hover {
            background: #4FACFF !important;
        }
    }
</style>
