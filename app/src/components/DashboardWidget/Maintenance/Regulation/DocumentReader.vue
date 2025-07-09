<template>
    <el-dialog class="power-dialog" append-to-body width="50%" :title="document.name" :visible.sync="dialogVisibility" @closed="close">
        <div v-html="document.content"></div>
    </el-dialog>
</template>

<script>

export default {
    name: "DocumentReader",
    props: {
        dialogId: String,
        dialogVisibility: Boolean,
        document: Object
    },
    data () {
        return {
            docData: {},
            dialogVisibilities: {
                documentReader: false
            }
        }
    },
    methods: {
        close () {
            this.$emit("action-finished", false, this.dialogId);
        },
        readDocument (doc) {

        }
    }
}
</script>

<style>
</style>