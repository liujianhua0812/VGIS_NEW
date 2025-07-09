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
        <!--        判定空数组和空数据-->
        <div v-if="!item || item.length===0" class="valueData nodata">None</div>
        <!--        follow特殊处理-->
        <div v-else-if="key==='For future follow-up'" class="reportContent">
          <div v-for="(i,k) in item[followIndex-1]" :class="`text valueData ${i?'':'nodata'}`">
            <div class="intitle">
              <div class="circle"></div>
              {{ k }}
            </div>
            <div :class="`inData ${i?'':'nodata'}`">{{ i ? i : 'None' }}</div>
          </div>
          <div class="center site-info-pagination">
            <el-pagination
              :background="true"
              :hide-on-single-page="true"
              :total="item.length"
              :page-size="1"
              :current-page.sync="followIndex"
              layout="prev, pager, next">
            </el-pagination>
          </div>
        </div>
        <!--        item特殊处理-->
        <div v-else-if="key==='item'" class="reportContent">
          <div v-for="(i,k) in item[itemIndex-1]" :class="`text valueData ${i?'':'nodata'}`">
            <div class="intitle">
              <div class="circle"></div>
              {{ k }}
            </div>
            <div :class="`inData ${i?'':'nodata'}`">{{ i ? i : 'None' }}</div>
          </div>
          <div class="center site-info-pagination">
            <el-pagination
              :background="true"
              :hide-on-single-page="true"
              :total="item.length"
              :page-size="1"
              :current-page.sync="itemIndex"
              layout="prev, pager, next">
            </el-pagination>
          </div>
        </div>
        <!--        其他普通处理-->
        <div v-else class="valueData">{{ item }}</div>
      </div>
    </div>

    <div slot="footer"></div>
  </el-dialog>
</template>

<script>

export default {
  name: "SiteSafetyDialog",
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
      followIndex: 1,
      itemIndex: 1
    }
  },
  methods: {
    close() {
      this.$emit('action-finished', false)
    }
  },
}
</script>

<style lang="scss" scoped>

.text {
  padding: 0 0 16px;
}

.center {
  display: flex;
  justify-content: center;
  background: none !important;
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
//element-ui标签样式修改
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

  :deep(.el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li) {
    background: rgba(255, 255, 255, 0);
  }
}
//对话框样式修改

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
