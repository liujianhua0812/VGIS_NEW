<template>
    <DocumentList :documents="documents" v-if="dialogVisibility" :dialog-visibility="dialogVisibility" :dialog-id="dialogId" @action-finished="actionFinished"></DocumentList>
</template>

<script>
import DocumentList from "@/components/DashboardWidget/Maintenance/Regulation/DocumentList.vue";
import {getNodesByModel} from "@/assets/js/api/hierarchy";
import {getFileList} from "@/assets/js/api/media-file";
export default {
    name: "GeneralDocuments",
    props: {
        dialogId: String,
        dialogVisibility: Boolean,
    },
    components: {
        DocumentList
    },
    data () {
        return {
            documents: []
        }
    },
    methods: {
        actionFinished(success, dialogId) {
            this.$emit("action-finished", success, dialogId);
        },
        getDocuments () {
            getNodesByModel("总场站").then(result => {
                if (result.data.length > 0) {
                    getFileList({ instanceId: result.data[0].id }).then(result => {
                        this.documents = result.data
                    })
                }
            })
        }
    },
    created() {
        this.getDocuments()
    }
}
</script>