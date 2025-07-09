<template>
    <div class="full-w">
        <div id="dynamic_pid" class="dynamic_pid" ref="svgPid" v-html="pid.map" @click="handleClick($event)"
             @dblclick="handleDblClick($event)"></div>
        <PreviewPIDView v-if="dialogVisibility.preview" :dialog-visibility="dialogVisibility.preview"
                        dialog-id="preview" :pid="previewData" @action-finished="actionFinished"></PreviewPIDView>
        <EditAttributeValueForm
                :dialog-id="`form-${index}`"
                :dialog-visibility="point.dialogVisibility"
                :preview="preview"
                :instance-id="point.rule.configuration.instance"
                :attribute-id="point.rule.configuration.attribute[1]"
                :model-id="point.rule.configuration.attribute[0]"
                v-if="point.rule.configuration.type === 'attribute' && point.dialogVisibility"
                v-for="(point, index) in formPoints"
                @action-finished="actionFinished"
        ></EditAttributeValueForm>
        <AddSeriesValueForm
                :dialog-id="`form-${index}`"
                :dialog-visibility="point.dialogVisibility"
                :preview="preview"
                :instance-id="point.rule.configuration.instance"
                :series-id="point.rule.configuration.series[1]"
                :model-id="point.rule.configuration.series[0]"
                v-if="point.rule.configuration.type === 'series' && point.dialogVisibility"
                v-for="(point, index) in formPoints"
                @action-finished="actionFinished"
        ></AddSeriesValueForm>
        <ConfirmControlActionForm
                :dialog-id="`control-${index}`"
                :dialog-visibility="point.dialogVisibility"
                :preview="preview"
                :point-id="point.rule.id"
                :instance-id="point.rule.configuration.instance"
                :chain-id="point.rule.configuration.chain"
                :validator="point.rule.configuration.validator"
                v-if="point.dialogVisibility"
                v-for="(point, index) in controlPoints"
                @action-finished="actionFinished"
        ></ConfirmControlActionForm>
    </div>
</template>

<script>

import PreviewPIDView from "@/components/Admin/PID/PreviewPIDView.vue";
import {getNodeDetail, getSeriesLatestValues, getStaticAttributeValues} from "@/assets/js/api/hierarchy";
import {getDiagram} from "@/assets/js/api/pid";
import {getStaticAttributeList} from "@/assets/js/api/model-attribute";
import {getTimeSeriesList} from "@/assets/js/api/model-series";
import {toFixedValue} from "@/utils/Statistics";
import ProcessDiagramRequestManager from "@/utils/ProcessDiagramRequestManager";
import EditAttributeValueForm from "@/components/DashboardWidget/ProcessMonitor/EditAttributeValueForm.vue";
import AddSeriesValueForm from "@/components/DashboardWidget/ProcessMonitor/AddSeriesValueForm.vue";
import ConfirmControlActionForm from "@/components/DashboardWidget/ProcessMonitor/ConfirmControlActionForm.vue";

export default {
    name: "DynamicPID",
    props: {
        pid: Object,
        preview: {
            type: Boolean,
            default: false
        }
    },
    components: {
        PreviewPIDView,
        EditAttributeValueForm,
        AddSeriesValueForm,
        ConfirmControlActionForm
    },
    data() {
        return {
            dialogVisibility: {
                preview: false
            },
            previewData: {},
            equipment: {},
            loopIds: [],
            allRelations: [],
            redirectPoints: [],
            formPoints: [],
            controlPoints: []
        };
    },
    computed: {},
    methods: {
        actionFinished(success, dialogId) {
            this.dialogVisibility[dialogId] = false
            if (dialogId.match(/form-(\d+)/)) {
                let index = parseInt(dialogId.match(/form-(\d+)/)[1])
                let point = this.formPoints[index]
                point.dialogVisibility = false
            }
            if (dialogId.match(/control-(\d+)/)) {
                let index = parseInt(dialogId.match(/control-(\d+)/)[1])
                let point = this.controlPoints[index]
                point.dialogVisibility = false
            }
        },
        clearDynamics() {
            if (this.requestController) {
                this.requestController.stop()
            }
            for (let i = 0; i < this.pid.pid_anchor_points.length; i++) {
                let rule = this.pid.pid_anchor_points[i]
                if (rule.loopId) {
                    clearInterval(rule.loopId)
                }
            }
        },
        openForm(point) {
            point.dialogVisibility = true
        },
        confirmControl(point) {
            point.dialogVisibility = true
        },
        handleClick(event) {
            let target = event.target
            if (!target) {
                return
            }
            for (let i = 0; i < this.redirectPoints.length; i++) {
                if (target.isEqualNode(this.redirectPoints[i].dom)) {
                    return this.redirect(this.redirectPoints[i].rule)
                }
            }
            for (let i = 0; i < this.formPoints.length; i++) {
                if (target.isEqualNode(this.formPoints[i].dom) && this.formPoints[i].rule.configuration.trigger === "click") {
                    return this.openForm(this.formPoints[i])
                }
            }
            for (let i = 0; i < this.controlPoints.length; i++) {
                if (target.isEqualNode(this.controlPoints[i].dom)) {
                    return this.confirmControl(this.controlPoints[i])
                }
            }
        },
        handleDblClick(event) {
            let target = event.target
            if (!target) {
                return
            }
            for (let i = 0; i < this.formPoints.length; i++) {
                if (target.isEqualNode(this.formPoints[i].dom) && this.formPoints[i].rule.configuration.trigger === "dblclick") {
                    return this.openForm(this.formPoints[i])
                }
            }
        },
        redirect(rule) {
            let targetPath = `/process/${rule.configuration.target}`
            let rootPath = location.origin
            switch (rule.configuration.type) {
                case "tab":
                    window.open(`${rootPath}${targetPath}`)
                    break
                case "redirect":
                    if (this.preview) {
                        getDiagram(rule.configuration.target).then(result => {
                            this.previewData = result.data
                            this.dialogVisibility.preview = true
                        })
                    } else {
                        this.$router.push({name: "ProcessMonitor", params: {diagramId: rule.configuration.target}})
                    }
                    break
            }
        },
        getTarget(path) {
            let tree = this.$refs.svgPid.children, target = null
            try {
                for (let i = 0; i < path.length; i++) {
                    target = tree[path[i]]
                    tree = target.children
                }
            } catch (err) {
                return
            }
            return target
        },
        loadLinkRule(rule) {
            let path = rule.xPath.split("-").map(item => parseInt(item))
            let target = this.getTarget(path)
            if (target) {
                target.style = "cursor: pointer;"
                this.redirectPoints.push({
                    dom: target,
                    rule
                })
            }
        },
        loadFormRule(rule) {
            let path = rule.xPath.split("-").map(item => parseInt(item))
            let target = this.getTarget(path)
            if (target) {
                target.style = "cursor: pointer;"
                this.formPoints.push({
                    dom: target,
                    rule,
                    dialogVisibility: false
                })
            }
        },
        loadControlRule(rule) {
            let path = rule.xPath.split("-").map(item => parseInt(item))
            let target = this.getTarget(path)
            if (target) {
                target.style = "cursor: pointer;"
                this.controlPoints.push({
                    dom: target,
                    rule,
                    dialogVisibility: false
                })
            }
        },
        async loadDataRule(rule) {
            let path = rule.xPath.split("-").map(item => parseInt(item))
            let target = this.getTarget(path)
            let configuration = rule.configuration
            let attributes = [], attr = null, sery = [], series = null
            if (configuration.type === "attribute") {
                attributes = await getStaticAttributeList(configuration.attribute[0])
                attr = attributes.data.find(item => item.id === configuration.attribute[1])
                if (!attr) {
                    return
                }
            } else {
                sery = await getTimeSeriesList(configuration.series[0])
                series = sery.data.find(item => item.id === configuration.series[1])
                if (!series) {
                    return
                }
            }
            let instance = (await getNodeDetail(configuration.instance)).data
            if (!target || !instance) {
                return
            }

            function loadAndFlushData(data) {
                if (configuration.type === "attribute") {
                    if (data && (data.value || data.value === 0)) {
                        target.innerHTML = `${toFixedValue(data.value, attr.precision)} ${data.unit || ""}`
                    } else if (attr.defaultValue) {
                        target.innerHTML = `${toFixedValue(attr.defaultValue, attr.precision)} ${attr.unit ? attr.unit.name : ""}`
                    } else {
                        target.innerHTML = configuration.emptyText || ""
                    }
                } else if (configuration.type === "series") {
                    if (data && (data.value || data.value === 0)) {
                        target.innerHTML = `${toFixedValue(data.value, series.precision)} ${data.unit || ""}`
                    } else {
                        target.innerHTML = configuration.emptyText || ""
                    }
                }
            }

            this.requestController.register(
                configuration.type === "attribute" ? configuration.attribute[0] : configuration.series[0],
                instance.instanceId,
                configuration.type,
                configuration.type === "attribute" ? attr.name : series.name,
                configuration.realtime,
                configuration.refreshInterval * 1000,
                loadAndFlushData
            )
        },
        async loadEffectRule(rule) {
            let path = rule.xPath.split("-").map(item => parseInt(item))
            let target = this.getTarget(path)
            let configuration = rule.configuration
            let attributes = [], attr = null, sery = [], series = null
            if (configuration.type === "attribute") {
                attributes = await getStaticAttributeList(configuration.attribute[0])
                attr = attributes.data.find(item => item.id === configuration.attribute[1])
                if (!attr) {
                    return
                }
            } else {
                sery = await getTimeSeriesList(configuration.series[0])
                series = sery.data.find(item => item.id === configuration.series[1])
                if (!series) {
                    return
                }
            }
            let instance = (await getNodeDetail(configuration.instance)).data
            if (!target || !instance) {
                return
            }

            async function loadAndFlushEffect(data) {
                if (configuration.type === "attribute") {
                    if (data && (data.value || data.value === 0)) {
                        new Function("value", "node", `(${configuration.controller})(value, node)`)(data.value, target)
                    }
                } else if (configuration.type === "series") {
                    if (data && (data.value || data.value === 0)) {
                        try {
                            new Function("value", "node", `(${configuration.controller})(value, node)`)(data.value, target)
                        } catch (err) {
                        }
                    }
                }
            }

            this.requestController.register(
                configuration.type === "attribute" ? configuration.attribute[0] : configuration.series[0],
                instance.instanceId,
                configuration.type,
                configuration.type === "attribute" ? attr.name : series.name,
                configuration.realtime,
                configuration.refreshInterval * 1000,
                loadAndFlushEffect
            )
        },
        async loadRules() {
            this.requestController = new ProcessDiagramRequestManager()
            for (let i = 0; i < this.pid.pid_anchor_points.length; i++) {
                let rule = this.pid.pid_anchor_points[i]
                if (rule.type === "link") {
                    this.loadLinkRule(rule)
                }
                if (rule.type === "data") {
                    await this.loadDataRule(rule)
                }
                if (rule.type === "effect") {
                    await this.loadEffectRule(rule)
                }
                if (rule.type === "form") {
                    this.loadFormRule(rule)
                }
                if (rule.type === "control") {
                    this.loadControlRule(rule)
                }
            }
            this.requestController.start()
        },
        observeDOM (obj, callback) {
            let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
            if (!obj || obj.nodeType !== 1) {
                return;
            }
            if (MutationObserver) {
                // define a new observer
                let mutationObserver = new MutationObserver(callback);

                // have the observer observe for changes in children
                mutationObserver.observe(obj, { childList: true, subtree: true });
                return mutationObserver;
            }
            else if (window.addEventListener) { // browser support fallback
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        },
        disableObservation (obj, callback) {
            if (this.observer) {
                this.observer.disconnect()
                this.observer = null
            }
            else {
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        },
        updateSVG () {
            this.$refs.svgPid.children[0].setAttribute("width", '100%')
            this.$refs.svgPid.children[0].setAttribute("height", '100%')
            this.loadRules()
            this.disableObservation(this.$refs.svgPid, this.updateSVG)
        }
    },
    mounted() {
        if (this.$refs.svgPid.children[0]) {
            this.updateSVG()
        }
        else {
            this.observer = this.observeDOM(this.$refs.svgPid, this.updateSVG)
        }
    },
    beforeDestroy() {
        this.clearDynamics()
    }
}
</script>

<style lang="scss" scoped>
.dynamic_pid {
  background-color: transparent;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
</style>
