<template>
  <el-dialog :title="title"
             width="800px" :visible.sync="dialogVisibility" @close="close">
    <el-row class="m-b-20" :gutter="5">
      <vue-markdown class="documentation" linkify emoji @rendered="update">{{protocol.documentation}}</vue-markdown>
    </el-row>
    <el-row class="m-b-20"></el-row>
  </el-dialog>
</template>

<script>

  import Prism from 'prismjs'
  import "prismjs/themes/prism-okaidia.css";
  import "prismjs/components/prism-json"
  import VueMarkdown from 'vue-markdown'

  export default {
    name: "TestProtocol",
    props: {
      dialogId: String,
      dialogVisibility: Boolean,
      model: Object,
      instance: Object,
      protocol: Object
    },
    components: {
      VueMarkdown
    },
    data() {
      return {
        title: this.$t("label.protocol.document")
      }
    },
    methods: {
      close () {
        this.$emit('action-finished', this.dialogId, false)
      },
      update: function() {
        this.$nextTick(() => {
          Prism.highlightAll();
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .documentation {
    :deep(h1,h2,h3,h4,h5,h6) {
      font-weight: bold;
      color: #000000;
    }

    :deep(.table) {
      width: 100%;

      th {
        font-family: 'HarmonyOS Sans';
        font-style: normal;
        font-weight: 700;
        font-size: 15px;
        line-height: 18px;
        color: #000000;
        padding: 8px 0;
        border-bottom: 1px solid #333333 !important;
      }

      td {
        font-family: 'HarmonyOS Sans';
        font-style: normal;
        font-weight: 500;
        font-size: 15px;
        line-height: 18px;
        color: #000000;
        padding: 16px 0;
        border-bottom: 1px solid #D4D4D4 !important;
      }

    }
  }
</style>
