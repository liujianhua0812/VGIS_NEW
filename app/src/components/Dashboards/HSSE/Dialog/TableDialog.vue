<template>
  <el-dialog
    width="40%"
    :visible.sync="dialogVisibility"
    :before-close="close">
    <div v-for="(item,key) in info">
      <div class="title" v-if="key!=='item'">
        <div class="circle"></div>
        {{ key }}
      </div>
      <div class="text">
        <div :class="`valueData ${item?'':'nodata'}`">{{ item ? item : 'None' }}</div>
      </div>
    </div>
    <div slot="footer"></div>
  </el-dialog>
</template>

<script>

export default {
  name: "TableDialog",
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
    }
  },
  methods: {
    close() {
      this.$emit('action-finished', false)
    }
  },
  created() {
  },
}
</script>

<style lang="scss" scoped>


.text {
  padding: 0 0 16px;
}

.circle {
  position: absolute;
  left: -10px;
  top: 50%;
  width: 4px;
  border-radius: 50%;
  height: 4px;
  background: #3695FF;
}

.title {
  position: relative;
  font-family: 'HarmonyOS_Sans';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
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

.intitle {
  position: relative;
  font-family: 'HarmonyOS_Sans';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 4px 10px;
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
    overflow: scroll;
    position: relative
  }

  .htmlContainer::-webkit-scrollbar {
    width: 4px;
    height: 4px;

  }

  .htmlContainer::-webkit-scrollbar-thumb {
    background: #3695FF;
    border-radius: 2px;
  }
}

.reportContent {
  position: relative;
  padding: 8px;
  font-family: 'HarmonyOS_Sans';
  word-break: break-word;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.valueData {
  font-family: 'HarmonyOS_Sans';
  word-break: break-word;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #FFFFFF;
}


.input-box-iframe {
  width: 1000px;
  height: 600px;
  overflow-y: scroll;
  overflow-x: hidden;
  margin: 0 auto;
  margin-bottom: 1.25rem;
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

.inData {
  padding-left: 10px;
  font-family: 'HarmonyOS_Sans';
  word-break: break-word;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #FFFFFF;
}

.nodata {
  color: rgba(255, 255, 255, 0.4);
}

.site-info-pagination {

  :deep(.el-pagination) {
    .btn-next, .el-pagination .btn-prev {
      background: rgba(255, 255, 255, 0);
    }

    .btn-next, .el-pagination .btn-prev {
      background: rgba(255, 255, 255, 0);
    }

    .el-pager .active {
      color: #3695FF !important;
    }

    button {
      .el-icon-arrow-right:before {
        content: "\e791" !important;
      }

      .el-icon-arrow-left:before {
        content: "\e792" !important;
      }

      color: #ffffff;
    }

    button:disabled {
      color: #ffffff;
      background-color: rgba(255, 255, 255, 0) !important;
    }

  }

  .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li {
    background: rgba(255, 255, 255, 0);
  }
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
