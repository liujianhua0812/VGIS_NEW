<template>
    <vgis-page :navs="navs" :page-name="pageTitle">
        <component :is="templateName" :pid="diagram" v-if="diagram"></component>
    </vgis-page>
</template>

<script>
import VgisPage from "@/components/Standard/vgis-page.vue";
import {getDiagram} from "@/assets/js/api/pid";
import DynamicPID from "@/components/Admin/PID/DynamicPID.vue";
import Default from "@/components/DashboardWidget/ProcessMonitor/Templates/Default.vue";
import AirCompressionStation from "@/components/DashboardWidget/ProcessMonitor/Templates/AirCompressionStation.vue";

export default {
    name: "ProcessMonitor",
    components: {
        DynamicPID,
        VgisPage,
        Default,
        AirCompressionStation
    },
    computed: {
        templateName () {
            if (!this.diagram) {
                return "Default"
            }
            let instance = this.diagram.model_instance
            if (instance && instance.model) {
                let template = this.validTemplates.find(item => item.name === instance.model.modelId)
                if (template) {
                    return instance.model.modelId
                }
            }
            return "Default"
        },
        pageTitle () {
            if (!this.diagram) {
                return `实时监控`
            }
            return `实时监控：${this.diagram.name}`
        },
        navs () {
            return [{
                name: "总览",
                link: "/"
            }, {
                name: "实时监控"
            }, {
                name: this.diagram.name || ""
            }]
        }
    },
    data () {
        return {
            diagram: "",
            validTemplates: [AirCompressionStation]
        }
    },
    methods: {
        getDiagram () {
            getDiagram(this.$route.params.diagramId).then(result => {
                this.diagram = result.data
                console.log("thisdiagram")
                console.log(this.diagram)
            })
        }
    },
    created() {
        this.getDiagram()
    }
}
</script>

<style scoped>

</style>