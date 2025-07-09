<template>
  <div class="parent">
    <el-dialog
      title="Edit Range"
      :visible.sync="dialogVisible"
      custom-class="edit-dialog"
      :before-close="handleClose"
      :close-on-click-modal="false"
      @close="handleClose">
      <el-divider></el-divider>
      <div class="section-legends">
        <div class="legend">
          <span class="legendBlock yellow"></span><span> ≤ -</span>
          <el-input @input="checkInput1" v-model.number="input1"></el-input>
           %
        </div>
        <div class="legend" >
          <span class="legendBlock blue"> </span> ( {{input1*-1}} %, 0 )
        </div>
        <div class="legend" >
          <span class="legendBlock purple"> </span> [ 0, {{input2}} % )
        </div>
        <div class="legend">
          <span class="legendBlock orange"> </span><span> ≥ </span>
          <el-input @input="checkInput" v-model.number="input2"></el-input>
           %
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
    <div class="save-button" @click="saveSection">Save</div>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "EditRange",
  data() {
    return {
      input1: this.info.legendFirst * -1 ,
      input2: this.info.legendLast,
    }
  },
  props:['dialogVisible','info'],
  computed: {
  },
  methods: {
    checkInput(value){
      if(value){
        this.input2 = value.replaceAll(/[a-zA-Z]/g,'')
        this.input2 ? this.input2 = parseFloat(value) : 0
      }
      if(value > 1000){
        this.input2 = 1000
      }
      if(value <= 0){
        this.input2 = 0
      }
    },
    checkInput1(value){
      if(value){
        this.input1 = value.replaceAll(/[a-zA-Z]/g,'')
        this.input1 ? this.input1 = parseFloat(value) : 0
      }
      if(value > 1000){
        this.input1 = 1000
      }
      if(value <= 0){
        this.input1 = 0
      }
    },
    handleClose() {
      this.$emit('action-finished', false)
    },
    saveSection(){

      this.$emit('action-finished', true, this.input1 * -1, this.input2)
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  font-family: HarmonyOS_Sans;
}
:deep(.el-input__inner) {
  background-color: #0a1a2d;
  height: 20px;
  padding: 0 2px;
  border: 0.5px solid rgba(255,255,255,0.4);
  color: white;
  text-align: center;
}
:deep(.el-divider--horizontal) {
  margin: 0;
  background-color: rgba(255,255,255,0.4);
}
:deep(.el-input) {
  width: 51px;
  //margin-left: 5px;
  color: white;
}
.section-legends{
  display: flex;
  flex-direction: column;
  justify-content:space-around;
  //margin-bottom: 14px;
  //align-items: center;
  .legend{
    max-width: 160px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin:10px 0;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    //line-height: 10px;
    color: rgba(255, 255, 255, 1);
    .legendBlock{
      display: inline-block;
      width: 11px;
      height: 11px;
    }
    .orange{
      background: #e56547;
    }
    .blue{
      background-color: #3695FF;
    }
    .yellow{
      background-color: #d78615;
    }
    .purple{
      background-color: #8b6ee1;
    }
  }
}
:deep(.el-dialog__close) {
  color: white;
}

:deep(.el-dialog__headerbtn) {
  font-size: 20px;
  color: #ffffff;
  top: 10px;
  left: 124px;
}

.parent {
  :deep(.el-form-item__content){
    line-height: 0;
  }
  :deep(.el-dialog__wrapper) {
    left: 55%;
  }

  :deep(.edit-dialog) {
    background-color: #0a1a2d;
    width: 160px;
    border: 0.5px solid rgba(50, 136, 234, 0.6);
    box-shadow: 0 0 20px rgba(50, 136, 234, 0.6);
    border-radius: 8px;
  }

  :deep(.el-dialog__header) {
    padding: 12px 10px 12px 16px;
  }

  :deep(.el-dialog__title) {
    font-family: HarmonyOS_Sans;
    color: #ffffff;
    font-size: 14px;
  }

  :deep(.el-dialog__body) {
    color: #ffffff;
    padding: 0 16px;
  }

  :deep(.el-dialog__footer) {
    color: #ffffff;
    text-align: center;
    padding: 8px 16px 12px 16px;

    .save-button {
      width: 50px;
      line-height: 20px;
      height: 20px;
      border-radius: 4px;
      background-color: #2b7ad8;
      margin: auto;
    }
    .save-button:hover {
      cursor: pointer;
      background-color: #669cdc;
    }
  }

}
</style>
