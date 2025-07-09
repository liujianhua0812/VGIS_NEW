<template>
  <el-dialog
    width="40%"
    :visible.sync="dialogVisibility"
    :before-close="close">
    <div class="text">
      <div class="emailTitle">{{ info.Title }}</div>
      <div style="display: flex;justify-content: space-between">
        <div class="subTitle">{{ info['From Account'] }}{{ ` <${info['From Email']}>` }}</div>
        <div class="time">{{ info.Time }}</div>
      </div>
      <div class="emailContent">
        <div class="htmlContainer full-w full-h">
          <div v-html="info.Content"></div>
          <!--        <iframe class="iframeStyle" :srcdoc="info.Content" frameborder="no"></iframe>-->
        </div>
      </div>
      <div class="subTitle">{{ files.length }} Attachments</div>
      <div v-if="files.length > 0" class="content">
        <div class="fileButton" v-for="file in files" @click="loadFile(file)">
          {{
            file.name
          }}
        </div>
      </div>
      <div v-else class="nodata">None</div>
    </div>
    <div slot="footer"></div>
  </el-dialog>
</template>

<script>
import {getFile, getFileList} from "@/assets/js/api/media-file";
import {downloadFile} from "@/utils";

export default {
  name: "EmailDialog",
  props: {
    info: {
      type: Object,
      default: () => {
      }
    },
    dialogVisibility: Boolean,
  },
  data() {
    return {
      fileData: [],
      files: [],
      followIndex: 1,
      itemIndex: 1
    }
  },
  methods: {
    loadFile(file) {
      getFile(file.id).then(res => {
        downloadFile(file.name, res.data)
      })
    },
    close() {
      this.$emit('action-finished', false)
    }
  },
  created() {
    if (this.info.Attachments) {
      let arr = this.info.Attachments.split(';')
      let fileList = []
      getFileList(arr).then(res => {

        arr.map(item => {
          res.data.map(result => {
            let obj = {}
            if (result.id === item) {
              obj = {
                id: item,
                name: result.name
              }
              fileList.push(obj)
            }
          })
        })
        this.files = fileList

      })
    }
  }
}
</script>

<style lang="scss" scoped>

.text {
  padding: 0 0 16px;
}


.emailTitle {
  font-family: 'HarmonyOS_Sans';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 19px;
  color: #FFFFFF;
  margin-bottom: 13px;
}

.subTitle {
  margin: 5px 0 10px;
  font-family: 'HarmonyOS_Sans';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #FFFFFF;
}

.time {
  font-family: 'HarmonyOS_Sans';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: rgba(255, 255, 255, 0.7);;
}


.content {
  padding: 12px;
  font-family: 'HarmonyOS_Sans';
  word-break: break-word;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  overflow: scroll;
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.emailContent {
  position: relative;
  margin: 20px 0;
  padding: 10px;
  border-radius: 4px;
  height: 700px;
  background-color: #ffffff;

  .htmlContainer {
    overflow: auto;
    position: relative
  }

  .htmlContainer::-webkit-scrollbar {
    display: block;
    width: 4px;
    height: 4px;
  }

  .htmlContainer::-webkit-scrollbar-thumb {
    background: #3695FF;
    border-radius: 2px;
  }
}


.fileButton {
  display: inline;
  cursor: pointer;
  font-family: 'HarmonyOS_Sans';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  padding-right: 30px;
  border-radius: 4px;
  text-decoration-line: underline;
}

.fileButton:hover {
  color: #3695FF
}

.nodata {
  color: rgba(255, 255, 255, 0.4);
}


:deep(.el-dialog__header) {
  padding: 25px 0 0;
}

:deep(.el-dialog__footer) {
  padding: 20px 0 0;
}

:deep(.el-dialog__body) {
  padding: 0 40px
}

:deep(.el-dialog, .el-pager li) {
  background: #0A1A2D;
  border-radius: 8px;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #ffffff;
}
</style>
