<template>
  <el-dialog center class="wo" :modal-append-to-body="true" :append-to-body="true" :z-index="999999999" :visible.sync="dialogVisibility" title="Work Order" width="600px" @close="close">
    <el-form disabled label-position="left" label-width="150px">
      <el-form-item label="Work Order Status">
        <div class="text-success" v-if="order.status === 'Completed'">Completed</div>
        <div class="text-link" v-if="order.status === 'Processing'">Processing</div>
        <div class="text-gold" v-if="order.status === 'Not Started'">Not Started</div>
      </el-form-item>
      <el-form-item label="Order Number">
        <el-input v-model="order.orderNumber"></el-input>
      </el-form-item>
      <el-form-item label="Type">
        <el-input v-model="order.type"></el-input>
      </el-form-item>
      <el-form-item label="Functional Location">
        <el-input v-model="order.functionalLocation"></el-input>
      </el-form-item>
      <el-form-item label="Equipment">
        <el-input v-model="order.equipment"></el-input>
      </el-form-item>
      <el-form-item label="Date">
        <el-date-picker style="width: 40%" v-model="order.basicStartDate"></el-date-picker>
        ~
        <el-date-picker style="width: 40%" v-model="order.basicFinishDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="Creator">
        <el-input v-model="order.creator"></el-input>
      </el-form-item>
      <el-form-item label="LAFD">
        <el-input v-model="order.LAFD"></el-input>
      </el-form-item>
      <el-form-item label="Planner Group">
        <el-input v-model="order.plannerGroup"></el-input>
      </el-form-item>
      <el-form-item label="Main Work Center">
        <el-input v-model="order.workCenter"></el-input>
      </el-form-item>
      <el-form-item label="Description">
        <el-input type="textarea" rows="4" v-model="order.description"></el-input>
      </el-form-item>
      <el-form-item label="Cond Text">
        <el-input v-model="order.condText"></el-input>
      </el-form-item>
      <el-form-item label="Activity Type">
        <el-input v-model="order.activityType"></el-input>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
    export default {
        name: "WorkOrderDetail",
        props: {
          dialogVisibility: Boolean,
          order: Object
        },
        methods: {
          close () {
            this.$emit('action-finished')
          }
        }
    }
</script>

<style lang="scss">
  .wo {
    .el-dialog {
      background: #333333;
      color: white;

      .el-dialog__title {
        color: white;
        text-weight: 600;
      }

      .el-form-item__label {
        color: white;
      }

      .el-input__inner,.el-textarea__inner {
        width: 100%;
        color: white !important;
        line-height: 25px;
        font-size: 16px;
        background: rgba(255, 255, 255, 0.2) !important;
        border: none;
      }

      .el-form-item {
        margin-bottom: 10px;
      }
    }
  }
</style>
