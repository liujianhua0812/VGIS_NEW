<template>
    <el-dialog class="power-dialog" width="400px" title="维保规范" append-to-body :visible.sync="dialogVisibility" @closed="close">
        <div v-if="documents.length === 0" style="height: 150px;" class="flex justify-content-center align-items-center text-info text-regular">
            暂无文档
        </div>
        <div class="document" v-for="doc in documents" @click="readDocument(doc)">
            <div class="document-info">
                <div class="document-title">{{doc.name}}</div>
                <div class="document-meta">
                    <span class="meta-item">创建时间: {{ formatDate(doc.createdAt) }}</span>
                    <span class="meta-item">更新时间: {{ formatDate(doc.updatedAt) }}</span>
                </div>
            </div>
            <el-button type="text" icon="el-icon-download text-regular text-bold" @click="downloadFile(doc)"></el-button>
        </div>
    </el-dialog>
</template>

<script>
import DocumentReader from "@/components/DashboardWidget/Maintenance/Regulation/DocumentReader.vue";
import {getFile} from "@/assets/js/api/media-file";
import {downloadFile} from "@/utils";
export default {
    name: "DocumentList",
    props: {
        dialogId: String,
        dialogVisibility: Boolean,
        documents: {
            type: Array,
            default: () => []
        }
    },
    components: {
        DocumentReader
    },
    data () {
        return {
            dialogVisibilities: {
                documentReader: false
            }
        }
    },
    methods: {
        actionFinished(success, dialogId) {
            this.dialogVisibilities[dialogId] = false
        },
        close () {
            this.$emit("action-finished", false, this.dialogId);
        },
        downloadFile(file) {
            getFile(file.id).then(result => {
                downloadFile(file.name, result.data)
            })
        },
        readDocument (doc) {
            this.docData = doc
            this.dialogVisibilities.documentReader = true
        },
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.document {
    cursor: pointer;
    color: #40A9FF;
    font-family: "HarmonyOS Sans SC";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 157.143% */
    padding: 12px 24px;
    background: #002766;
    display: flex;
    align-items: flex-start; /* 让内容顶部对齐 */
    justify-content: space-between;

    .document-info {
        flex-grow: 1;
        margin-right: 16px;
    }

    .document-title {
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 500;
        margin-bottom: 4px; /* 与下方时间信息拉开距离 */
    }

    .document-meta {
        display: flex;
        flex-direction: column; /* 让每个 meta-item 单独占一行 */
        gap: 2px; /* 行与行之间的间距 */
        font-size: 12px;
        color: #8c8c8c;
    }
}

.document:hover {
    color: #FFFFFF;
    background: #003A8C;
    .document-meta {
        color: #bfbfbf;
    }
}
</style>