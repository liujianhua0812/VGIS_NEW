<template>
    <div class="flex align-items-center flex-column">
        <h3 class="text-bold" :style="{ color }">{{label}}</h3>
        <el-button size="mini" type="primary" @click="editConfig">{{$t("action.configure")}}</el-button>
        <el-dialog width="500px" append-to-body :title="$t('form.title.editRule')" :visible.sync="dVisibility" @close="close"></el-dialog>
    </div>
</template>

<script>

import EventBus from "@/utils/EventBus";

export default {
    name: "WidgetTemplate",
    props: {
        label: String,
        color: String,
        editor: Object
    },
    watch: {
        nodeConfig: {
            handler () {
                const fullId = this.$el.parentElement.parentElement.id;
                let id = fullId.slice(5)
                this.editor.updateNodeDataFromId(id, this.nodeConfig)
            },
            deep: true
        }
    },
    data() {
        return {
            nodeId: "",
            dVisibility: false,
            testResult: "",
            testing: false,
            nodeConfig: {}
        }
    },
    i18n: {
        messages: {
            en: {},
            cn: {}
        }
    },
    methods: {
        loadConfig () {
            const fullId = this.$el.parentElement.parentElement.id;
            let id = fullId.slice(5)
            let node = this.editor.getNodeFromId(id)
            this.nodeId = id
            this.nodeConfig = Object.assign(this.nodeConfig, node.data)
        },
        editConfig () {
            this.loadConfig()
            this.dVisibility = true
        },
        close () {
            this.dVisibility = false
        },
        updateNode (nodeId, data) {},
        showTestResult (nodeId, data) {
            if (`${this.nodeId}` === `${nodeId}`) {
                this.testResult = data
            }
        },
        updateTestMode (nodeId, mode = false) {
            if (`${this.nodeId}` === `${nodeId}`) {
                this.testing = mode
                this.testResult = ""
            }
        },
        addListener () {
            EventBus.$on("update-node", this.updateNode)
            EventBus.$on("update-test-mode", this.updateTestMode)
            EventBus.$on("test-finished", this.showTestResult)
        },
        removeListener () {
            EventBus.$off("update-node", this.updateNode)
            EventBus.$off("update-test-mode", this.updateTestMode)
            EventBus.$off("test-finished", this.showTestResult)
        }
    },
    mounted() {
        this.$nextTick(this.loadConfig)
        this.addListener()
    },
    beforeDestroy() {
        this.removeListener()
    }
}
</script>

<style lang="scss" scoped>
    .test-result {
        background: #DDDDDD;
        border-radius: 3px;
    }
</style>
