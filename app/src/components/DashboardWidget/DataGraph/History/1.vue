<template>
  <div>
    <div v-for="(pointData, index) in pointsWithRecords" :key="pointData.point.instanceId" class="mb-6">
      <vgis-card :title="pointData.point.name">
        <el-table
          class="ttb"
          header-row-class-name="ttb-header"
          header-cell-class-name="ttb-header-cell"
          row-class-name="ttb-row"
          cell-class-name="ttb-cell"
          height="400px"
          :data="paginatedData(pointData)"
        >
          <el-table-column width="70px" v-if="!pointData.point.isVirtual">
            <template slot="header">
              <el-checkbox
                :indeterminate="pointData.isIndeterminate"
                v-model="pointData.checkAll"
                @change="toggleAll(pointData)"
              ></el-checkbox>
            </template>
            <template slot-scope="{ row }">
              <el-checkbox
                v-model="row.checked"
                @change="toggleIndeterminate(pointData)"
              ></el-checkbox>
            </template>
          </el-table-column>

          <el-table-column label="时间">
            <template slot-scope="{ row }">
              {{ row.time.format('yyyy-MM-dd hh:mm:ss') }}
            </template>
          </el-table-column>

          <el-table-column label="数值">
            <template slot-scope="{ row }">
              {{ formatValue(pointData.point, row.value) }}
              {{ pointData.point.unit ? pointData.point.unit.name : '' }}
            </template>
          </el-table-column>

          <el-table-column label="操作" width="130px" v-if="!pointData.point.isVirtual">
            <template slot-scope="{ row }">
              <el-button type="text" class="p-0" @click="editRecord(row, pointData)">编辑</el-button>
              <el-button type="text" class="p-0 text-brown" @click="deleteRecord(row, pointData)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="vgis-pagination">
          <el-pagination
            class="pull-right"
            :total="pointData.pagination.total"
            layout="total, prev, pager, next, sizes, jumper"
            :current-page="pointData.pagination.page"
            :page-size="pointData.pagination.size"
            @current-change="(page) => updatePage(pointData, page)"
            @size-change="(size) => updateSize(pointData, size)"
          ></el-pagination>
        </div>
      </vgis-card>
    </div>

    <AddEditRecord
      v-if="dialogVisibility.editRecord"
      dialog-id="editRecord"
      :point="editingPoint"
      :dialog-visibility="dialogVisibility.editRecord"
      :record="formData"
      @action-finished="actionFinished"
    ></AddEditRecord>
  </div>
</template>

<script>
// 原有 import 保持不变...
import VgisDeviceSelector from "@/components/DashboardWidget/Shared/vgis-device-selector.vue";
import VgisStatusSelector from "@/components/DashboardWidget/Shared/vgis-status-selector.vue";
import VgisPersonSelector from "@/components/DashboardWidget/Shared/vgis-person-selector.vue";
import VgisSimpleDatetimeSelector from "@/components/DashboardWidget/Shared/vgis-simple-datetime-selector.vue";
import VgisCard from "@/components/Standard/vgis-card.vue";
import {getNodeDetail, getNodeParents, getSeriesHistoryValues} from "@/assets/js/api/hierarchy";
import AddEditRecord from "@/components/DashboardWidget/DataGraph/History/AddEditRecord.vue";
import {deleteInstanceSeriesValue} from "@/assets/js/api/model-instance-series";
import ExcelJS from "exceljs"
import {downloadFile} from "@/utils";
import FileSaver from "file-saver"
export default {
  name: 'TableView',
  props: {
    timeRange: Array,
    point: Array
  },
  data() {
    return {
      pointsWithRecords: [],
      dialogVisibility: { editRecord: false },
      formData: {},
      editingPoint: null
    }
  },
  computed: {
    paginatedData() {
      return (pointData) => {
        let start = (pointData.pagination.page - 1) * pointData.pagination.size;
        let end = start + pointData.pagination.size;
        return pointData.records.slice(start, end);
      }
    }
  },
  watch: {
    timeRange: {
      handler() {
        this.refreshData();
      },
      deep: true
    },
    point: {
      handler() {
        this.refreshData();
      },
      deep: true
    }
  },
  methods: {
    refreshData() {
      const [startDate, endDateRaw] = this.timeRange;
      const endDate = endDateRaw || new Date();
      const start = startDate || new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

      if (!Array.isArray(this.point)) return;

      const promises = this.point.map((pt) => {
        return getSeriesHistoryValues(pt.instanceId, [pt.name], {
          startAt: start,
          endAt: endDate,
          order: 'desc'
        }).then((res) => {
          const rawData = res.data[pt.name]?.values || [];
          const records = rawData.map((item) => ({
            ...item,
            time: new Date(item.time),
            checked: false
          }));

          return {
            point: pt,
            records,
            checkAll: false,
            isIndeterminate: false,
            pagination: {
              page: 1,
              size: 10,
              total: records.length
            }
          }
        });
      });

      Promise.all(promises).then((results) => {
        this.pointsWithRecords = results;
      });
    },
    toggleAll(pointData) {
      pointData.records.forEach((item) => (item.checked = pointData.checkAll));
      pointData.isIndeterminate = false;
    },
    toggleIndeterminate(pointData) {
      const allChecked = pointData.records.every((item) => item.checked);
      const noneChecked = pointData.records.every((item) => !item.checked);
      pointData.checkAll = allChecked;
      pointData.isIndeterminate = !allChecked && !noneChecked;
    },
    updatePage(pointData, page) {
      pointData.pagination.page = page;
    },
    updateSize(pointData, size) {
      pointData.pagination.size = size;
    },
    formatValue(series, value) {
      if (series.dataType === 'Decimal') {
        value = parseFloat(value);
        if (series.precision || series.precision === 0) {
          value = parseFloat(value.toFixed(series.precision));
        }
      }
      return value;
    },
    editRecord(record, pointData) {
      this.formData = { ...record };
      this.dialogVisibility.editRecord = true;
      this.editingPoint = pointData.point;
    },
    deleteRecord(record, pointData) {
      this.$confirm('操作不可撤销，确定要删除吗？').then(() => {
        deleteInstanceSeriesValue(pointData.point.instanceId, { ids: [record.id] }).then(() => {
          this.$message({
            message: '删除成功！',
            showClose: true,
            duration: 3000,
            type: 'success'
          });
          this.refreshData();
        });
      });
    },
    actionFinished(success) {
      this.dialogVisibility.editRecord = false;
      if (success) this.refreshData();
    }
  },
  created() {
    this.refreshData();
  }
}
</script>

<style scoped>
.mb-6 {
  margin-bottom: 24px;
}
</style>
