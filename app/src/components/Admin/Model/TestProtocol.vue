<template>
  <el-dialog v-auth="{ resources: 'Model', action: 'Admin' }" :title="title"
             width="705px" :visible.sync="dialogVisibility" @close="close">
    <el-row class="m-b-20" :gutter="5">
      <el-col :span="12">
        <div class="code-header">Header</div>
        <codemirror :options="{ mode: 'text/plain', theme: 'base16-light', lineNumbers: true, inputStyle: 'textarea' }" v-model="responseHeaders"></codemirror>
      </el-col>
      <el-col :span="12">
        <div class="code-header">Body</div>
        <codemirror :options="{ mode: 'application/json', theme: 'base16-light', lineNumbers: true, inputStyle: 'textarea' }" v-model="responseBody"></codemirror>
      </el-col>
    </el-row>
    <el-row class="m-b-20"></el-row>
  </el-dialog>
</template>

<script>

  import { testInstanceProtocol } from "../../../assets/js/api/model-instance-protocol";

  export default {
    name: "TestProtocol",
    props: {
      dialogId: String,
      dialogVisibility: Boolean,
      model: Object,
      instance: Object,
      protocol: Object
    },
    data() {
      return {
        title: 'Test Protocol',
        responseHeaders: '',
        responseBody: ''
      }
    },
    methods: {
      close () {
        this.$emit('action-finished', this.dialogId, false)
      },
      testInstanceProtocol () {
        testInstanceProtocol (this.instance.id, this.protocol.id).then(result => {
          this.responseHeaders = Object.entries(result.data.headers).map(item => item.join(': ')).join('\n')
          try {
            this.responseBody = JSON.stringify(result.data.body)
          }
          catch (err) {
            this.responseBody = result.data.body
          }
        })
      }
    },
    created() {
      this.testInstanceProtocol()
    }
  }
</script>

<style lang="scss" scoped>
  .code-header {
    font-family: 'HarmonyOS Sans';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: #4FACFF;
    border-bottom: 1px solid #B3B3B3;
  }
</style>
