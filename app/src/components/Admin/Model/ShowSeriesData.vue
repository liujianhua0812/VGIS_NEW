<template>
  <el-dialog width="600px" v-auth="{ resources: 'Model', action: 'Admin' }" :title="title"
             :visible.sync="dialogVisibility" @close="close">
    <el-date-picker class="full-w" type="datetimerange" v-model="filter.date" @change="getData()"></el-date-picker>
    <el-table :data="records" header-cell-class-name="table-header-cell" cell-class-name="table-cell">
      <el-table-column :label="$t('label.data.time')">
        <template slot-scope="{ row }">
          {{new Date(row.time).format('yyyy/MM/dd hh:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column :label="series.name">
        <template slot-scope="{ row }">
          {{series.dataType === 'Decimal' && series.precision >=0 ? parseFloat(parseFloat(row.value).toFixed(series.precision)) : row.value }}{{series.unit ? series.unit.name : ''}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('label.basic.action')">
        <template slot-scope="{ row }">
          <el-button plain type="primary" size="mini" class="m-r-5" @click="editData(row)">{{$t("action.edit")}}</el-button>
          <el-button plain type="danger" size="mini" @click="deleteData(row)">{{$t("action.delete")}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="text-center m-t-20 p-b-20">
      <el-pagination hide-on-single-page :current-page="pagination.page" :page-count="pagination.totalPage" @current-change="getData"></el-pagination>
    </div>
    <add-edit-series-value append-to-body v-if="instance.id" :model="model" :instance="instance" :record="addEditSeriesValueData" :series="addEditSeriesValueData.series" dialog-id="addEditSeriesValue" :dialog-visibility="dialogVisibilities.addEditSeriesValue" @action-finished="actionFinished"></add-edit-series-value>
  </el-dialog>
</template>

<script>

  import AddEditSeriesValue from "./AddEditSeriesValue";
  import { deleteInstanceSeriesValue } from "../../../assets/js/api/model-instance-series";
  import { getInstanceSingleSeriesValue } from "../../../assets/js/api/model-instance-series";
  import {deleteModelGroup} from "../../../assets/js/api/model-group";

  export default {
    name: "ShowSeriesData",
    components: {
      AddEditSeriesValue
    },
    props: {
      dialogId: String,
      dialogVisibility: Boolean,
      model: Object,
      instance: Object,
      series: Object
    },
    computed: {
      title() {
        return this.$t('form.title.historyData')
      },
    },
    watch: {
      dialogVisibility (newValue) {
        if (newValue) {
          this.getData()
        }
      }
    },
    data () {
      return {
        dialogVisibilities: {
          addEditSeriesValue: false
        },
        filter: {
          date: []
        },
        records: [],
        addEditSeriesValueData: {},
        pagination: {
          page: 1,
          pagination: 10,
          total_page: 1
        }
      }
    },
    methods: {
      actionFinished (dialogId, success) {
        this.dialogVisibilities[dialogId] = false
        if (success) {
          if (dialogId === 'addEditSeriesValue') {
            this.getData()
          }
        }
      },
      close () {
        this.$emit('action-finished', this.dialogId, false)
      },
      getData (page = 1) {
        this.pagination.page = page
        getInstanceSingleSeriesValue(this.instance.id, this.series.id, Object.assign({
          startAt: this.filter.date ? this.filter.date[0] : "",
          endAt: this.filter.date ? this.filter.date[1] : "",
        }, this.pagination)).then(result => {
          this.records = result.data
          this.pagination = result.pagination
        })
      },
      editData (record) {
        this.addEditSeriesValueData = {
          id: [ record.id ],
          time: new Date(record.time),
          series: this.series
        }
        this.addEditSeriesValueData[record.seriesId] = record.value
        this.dialogVisibilities.addEditSeriesValue = true
      },
      deleteData (record) {
        this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
          confirmButtonText: this.$t("action.confirm"),
          cancelButtonText: this.$t("action.cancel"),
          type: 'warning'
        }).then(() => {
          deleteInstanceSeriesValue(this.instance.id, { ids: [record.id] }).then(result => {
            this.$message({
              type: 'success',
              message: this.$t("message.series.value.deleted"),
              showClose: true
            })
            this.getData()
          })
        })
      }
    },
    created() {
      this.getData()
    }
  }
</script>

<style scoped>

</style>
