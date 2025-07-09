<template>
  <div id="gjs"></div>
</template>

<script>

import "@/assets/js/grapesjs-echarts-presets.min"

let editor = null
export default {
  name: "grapesjsView",
  props: ['model', 'saveFlag'],
  data() {
    return {
    }
  },
  watch:{
    // emit 发送 project content 数据
    saveFlag(){
      const component = editor.Pages.getSelected().getMainComponent();
      let saveInfo = {}
      saveInfo.project = JSON.stringify(editor.getProjectData());
      saveInfo.content = `<html> <head> <script src="/js/echarts.min.js"><\/script> <script src="/js/axios.min.js"><\/script> <style>${editor.getCss({ component })}</style> </head> ${editor.getHtml({ component })} <html>`;
      this.$emit('saveEditor', Object.assign({}, this.model, saveInfo))
    },
    model(){
      editor.destroy()
      this.loadEditor()
    }
  },
  methods: {
    getProjectData () {
      return JSON.stringify(editor.getProjectData())
    },

    loadEditor() {
      let project = this.model? this.model.project : {}
      const inlineStorage = (editor) => {
        editor.Storage.add('inline', {
          load() {
            return JSON.parse(project || '{}');
          },
          store(data) {
          }
        });
      };
      editor = this.$grapesjs.init({
        height: "100%",
        container: "#gjs",
        showOffsets: true,
        fromElement: true,
        noticeOnUnload: false,
        plugins: this.model? [inlineStorage, "gjs-echarts-presets", "gjs-preset-webpage"] : ["gjs-echarts-presets", "gjs-preset-webpage"],
        pluginsOpts: {
          "gjs-echarts-presets": {
            /* Test here your options  */
            i18n: {
              locale: "zh"
            }
          },
        },
        storageManager: {
          type: this.model? "inline" : "local"
        }
      })
    },
  },
  mounted() {
    this.loadEditor()
  },
  beforeDestroy() {
    window.localStorage.removeItem('gjsProject')
    editor.destroy()
    editor = null
  }
}
</script>

<style scoped>
#gjs {
  overflow: hidden;
  /*width: 400px;*/
  height: calc(100% - 70px) !important;
  /*border: 1px solid black;*/
}
</style>
