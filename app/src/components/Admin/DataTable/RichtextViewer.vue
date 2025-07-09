<template>
  <el-popover trigger="click" v-else-if="field.dataType === 'Text' && field.richtext && row.field_values[field.id]" @show="loadHtml">
    <iframe ref="iframe" :width="width" :height="height"></iframe>
    <a slot="reference" class="text-link pointer">{{$t("label.data.content")}}</a>
  </el-popover>
</template>

<script>
  export default {
    name: "RichtextViewer",
    props: {
      content: String,
      width: String,
      height: String
    },
    methods: {
      loadHtml () {
        this.$nextTick(() => {
          let iframe = this.$refs.iframe
          let iframedoc = iframe.contentDocument || iframe.contentWindow.document
          iframedoc.body.innerHTML = this.content
        })
      },
    },

  }
</script>

<style scoped>

</style>
