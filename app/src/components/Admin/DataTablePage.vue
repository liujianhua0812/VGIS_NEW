<template>
  <div class="full-h full-w m-l-20">
    <vgis-breadcrumb :navs="navs"></vgis-breadcrumb>
    <div style="min-height: calc(100% - 35px);" class="flex">
      <div class="noc-vgis-table-list">
        <div class="flex m-15">
          <el-input v-model="filter.query" class="filter" clearable @clear="getTables" @keyup.native.enter="getTables">
            <template slot="append">
              <el-button type="primary" icon="el-icon-search" @click="getTables"></el-button>
            </template>
          </el-input>
          <el-button v-auth="{ resources: 'Model', action: 'Admin' }" class="m-l-20" circle type="primary"
                     icon="el-icon-plus" @click="addTable"></el-button>
        </div>
        <div v-if="tables.length === 0" class="text-center text-info m-t-40">
          {{$t("message.table.empty")}}
        </div>
        <div class="noc-vgis-hierarchy-item" v-for="data in tables" @click="selectTable(data)">
          <div class="flex align-items-center justify-content-start" style="flex-grow: 1;">
            <span class="noc-vgis-hierarchy-name" style="flex-grow: 1;">{{data.name}}</span>
          </div>
          <el-dropdown @command="handleCommand" v-auth="{ resources: 'Model', action: 'Admin' }">
            <span class="el-icon-more text-link"></span>
            <el-dropdown-menu>
              <el-dropdown-item :command="`editTable[${data.id}]`">{{$t("action.edit")}}</el-dropdown-item>
              <el-dropdown-item :command="`deleteTable[${data.id}]`" class="text-danger">{{$t("action.delete")}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="noc-vgis-table-detail">
        <el-tabs active-name="setting" v-if="selectedTable.id" @tab-click="switchTab">
          <el-tab-pane name="setting" :label="$t('label.table.setting')">
            <div class="flex flex-align-items-center justify-content-between">
              <div style="flex-grow: 1;" class="flex align-items-center justify-content-start">
                <div class="noc-vgis-table-title">
                  {{$t("label.table.name", { name: selectedTable.name })}}
                </div>
              </div>
              <el-button v-auth="{ resources: 'Model', action: 'Admin' }" plain type="primary" class="el-icon-edit-outline" @click="editTable(selectedTable.id)"> {{$t("action.edit")}}</el-button>
            </div>
            <div class="noc-vgis-table-detail-tabs">
              <div class="noc-vgis-table-detail-tabs-entries">
                <div :class="{active: entry.name === tableEntries.value.name}" @click="switchTableDetail(entry)" v-for="entry in tableEntries.candidates" :key="entry.name">{{entry.label}}</div>
              </div>
              <div  class="noc-vgis-table-detail-tabs-actions">
                <button v-auth="{ resources: 'Model', action: 'Admin' }" class="el-icon-plus" v-if="tableEntries.value.name === 'field'" @click="addField">{{$t("action.add")}}</button>
                <button v-auth="{ resources: 'Model', action: 'Admin' }" class="el-icon-plus" v-if="tableEntries.value.name === 'relation'" @click="addRelation">{{$t("action.add")}}</button>
              </div>
            </div>
            <el-table header-cell-class-name="table-header-cell" cell-class-name="table-cell" v-if="tableEntries.value.name === 'field'" :data="selectedTable.table_fields">
              <el-table-column prop="name" :label="$t('model.table.name')"></el-table-column>
              <el-table-column :label="$t('model.table.dataType')" width="120px">
                <template slot-scope="{ row }">
                  {{$t(`dict.dataType.${row.dataType}`)}}
                </template>
              </el-table-column>
              <el-table-column :label="$t('model.table.unique')" width="80px">
                <template slot-scope="{ row }">
                  {{ $t(`dict.bool.${row.unique}`) }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('model.table.required')" width="100px">
                <template slot-scope="{ row }">
                  {{ $t(`dict.bool.${row.required}`) }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('model.table.usage')" width="100px">
                <template slot-scope="{ row }">
                  <div v-if="row.sortable">{{$t("label.table.sort")}}</div>
                  <div v-if="row.filterable">{{$t("label.table.filter")}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="defaultValue" :label="$t('model.table.default')"></el-table-column>
              <el-table-column :label="$t('model.table.constraint')">
                <template slot-scope="{ row }">
                  <div v-if="row.dataType === 'String'">
                    <div v-if="row.min || row.min === 0">{{$t("label.data.minLength", { len: row.min })}}</div>
                    <div v-if="row.max || row.max === 0">{{$t("label.data.maxLength", { len: row.max })}}</div>
                  </div>
                  <div v-if="row.dataType === 'Text'">
                    <div v-if="row.min || row.min === 0">{{$t("label.data.minLength", { len: row.min })}}</div>
                    <div v-if="row.max || row.max === 0">{{$t("label.data.maxLength", { len: row.max })}}</div>
                    <div v-if="row.richtext">{{$t("label.data.richtext")}}</div>
                  </div>
                  <div v-if="row.dataType === 'Enum'">{{$t("label.data.candidates")}}
                    <ul class="p-l-20">
                      <li v-for="value in row.candidate" :key="value">{{value}}</li>
                    </ul>
                  </div>
                  <div v-if="row.dataType === 'Integer'">
                    <div v-if="row.min || row.min === 0">{{$t("label.data.min", { value: row.min })}}</div>
                    <div v-if="row.max || row.max === 0">{{$t("label.data.max", { value: row.max })}}</div>
                    <div v-if="row.unit">{{$t("label.data.unit", { unit: row.unit.name })}}</div>
                  </div>
                  <div v-if="row.dataType === 'Decimal'">
                    <div v-if="row.min || row.min === 0">{{$t("label.data.min", { value: row.min })}}</div>
                    <div v-if="row.max || row.max === 0">{{$t("label.data.max", { value: row.max })}}</div>
                    <div v-if="row.precision || row.precision === 0">{{$t("label.data.precision", { value: row.precision })}}</div>
                    <div v-if="row.unit">{{$t("label.data.unit", { unit: row.unit.name })}}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('model.table.label')">
                <template slot-scope="{ row }">
                  <el-tag class="m-l-5 m-r-5 m-b-5" size="small" v-for="tag in row.labels" :key="tag.id" type="primary">{{tag.name}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column :label="$t('model.table.description')" prop="description"></el-table-column>
              <el-table-column :label="$t('label.basic.action')" width="200px" v-if="validate($store.state.user, { resources: 'Model', action: 'Admin' })">
                <template slot-scope="{ row }">
                  <el-button size="mini" plain type="primary" icon="el-icon-edit" @click="editField(row)">{{$t("action.edit")}}</el-button>
                  <el-button size="mini" plain type="danger" icon="el-icon-delete" @click="deleteField(row)">{{$t("action.delete")}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table header-cell-class-name="table-header-cell" cell-class-name="table-cell" v-if="tableEntries.value.name === 'relation'" :data="selectedTable.table_relations">
              <el-table-column :label="$t('model.tableRelation.modelName')" prop="modelName"></el-table-column>
              <el-table-column :label="$t('model.tableRelation.modelId')" prop="modelId"></el-table-column>
              <el-table-column :label="$t('model.tableRelation.field')" prop="table_field.name"></el-table-column>
              <el-table-column :label="$t('model.tableRelation.instanceCount')" prop="instanceNum"></el-table-column>
              <el-table-column :label="$t('label.basic.action')" v-if="validate($store.state.user, { resources: 'Model', action: 'Admin' })">
                <template slot-scope="{ row }">
                  <el-button size="mini" plain type="danger" icon="el-icon-delete" @click="deleteRelation(row)">{{$t("action.delete")}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane name="detail" :label="$t('label.table.detail')" v-if="selectedTable.table_fields.length > 0">
            <div class="noc-vgis-table-detail-tabs">
              <div class="noc-vgis-table-detail-tabs-entries">
                <div v-auth="{ resources: 'Model', action: 'Admin' }" class="el-icon-plus" @click="addRecord">{{$t("action.add")}}</div>
              </div>
            </div>
            <el-table v-loading="loading" style="width: 100%;" header-cell-class-name="table-header-cell" cell-class-name="table-cell" :data="records" @sort-change="updateOrder">
              <el-table-column
                show-overflow-tooltip
                :key="field.id"
                :label="field.name"
                :column-key="field.id"
                :prop="field.id"
                :sortable="field.sortable"
                v-for="field in selectedTable.table_fields">
                <template slot-scope="{ row }">
                  <a v-if="field.dataType === 'File' && row.field_values[field.id]" class="text-link no-decoration" @click="downloadFile(row.field_values[field.id].value)">{{$t("label.basic.file")}}</a>
                  <richtext-viewer
                    v-else-if="field.dataType === 'Text' && field.richtext && row.field_values[field.id]"
                    :content="row.field_values[field.id].value"
                    width="800px"
                    height="600px"
                  >
                  </richtext-viewer>
                  <div v-else-if="field.dataType === 'DateTime' && row.field_values[field.id]">{{new Date(row.field_values[field.id].value).format('yyyy-MM-dd hh:mm:ss')}}</div>
                  <div v-else>{{row.field_values[field.id] ? row.field_values[field.id].value : ''}}</div>
                </template>
              </el-table-column>
              <el-table-column fixed="right" :label="$t('label.basic.action')" width="200px" v-if="validate($store.state.user, { resources: 'Model', action: 'Admin' })">
                <template slot-scope="{ row }">
                  <el-button size="mini" plain type="primary" icon="el-icon-edit" @click="editRecord(row)">{{$t("action.edit")}}</el-button>
                  <el-button size="mini" plain type="danger" icon="el-icon-delete" @click="deleteRecord(row)">{{$t("action.delete")}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="text-center m-t-20">
              <el-pagination hide-on-single-page :current-page="pagination.page" :page-count="pagination.totalPage" @current-change="refreshRecords"></el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div v-else class="flex align-items-center justify-content-center full-h text-info">
          {{$t("message.table.selectTable")}}
        </div>
      </div>
    </div>
    <add-edit-table v-if="dialogVisibility.addEditTable" v-auth="{ resources: 'Model', action: 'Admin' }" :table="addEditTableData" dialog-id="addEditTable"
                    :dialog-visibility="dialogVisibility.addEditTable"
                    @action-finished="actionFinished"></add-edit-table>
    <add-edit-field v-if="dialogVisibility.addEditField" v-auth="{ resources: 'Model', action: 'Admin' }" :table-id="selectedTable.id" :field="addEditFieldData" dialog-id="addEditField"
                    :dialog-visibility="dialogVisibility.addEditField"
                    @action-finished="actionFinished"></add-edit-field>
    <add-edit-relation v-if="dialogVisibility.addEditRelation" v-auth="{ resources: 'Model', action: 'Admin' }" :table="selectedTable" :relation="addEditRelationData" dialog-id="addEditRelation"
                    :dialog-visibility="dialogVisibility.addEditRelation"
                    @action-finished="actionFinished"></add-edit-relation>
    <add-edit-record v-if="dialogVisibility.addEditRecord" v-auth="{ resources: 'Model', action: 'Admin' }" :table="selectedTable" :record="addEditRecordData" dialog-id="addEditRecord"
                       :dialog-visibility="dialogVisibility.addEditRecord"
                       @action-finished="actionFinished"></add-edit-record>
  </div>
</template>

<script>

  import RichtextViewer from "./DataTable/RichtextViewer";
  import { validate } from "../../utils";
  import AddEditTable from "./DataTable/AddEditTable";
  import AddEditField from "./DataTable/AddEditField";
  import AddEditRelation from "./DataTable/AddEditRelation";
  import AddEditRecord from "./DataTable/AddEditRecord";
  import VgisBreadcrumb from "../Standard/vgis-breadcrumb.vue"
  import {getTableList, getTableDetail, deleteTable} from "../../assets/js/api/data-table";
  import { getFieldList, deleteField } from "../../assets/js/api/data-table-field";
  import { getRelationList, deleteRelation } from "../../assets/js/api/data-table-relation";
  import { getRecordList, deleteRecord } from "../../assets/js/api/data-table-record";

  export default {
    name: "DataTablePage",
    components: {
      VgisBreadcrumb,
      AddEditTable,
      AddEditField,
      AddEditRelation,
      AddEditRecord,
      RichtextViewer
    },
    computed: {
      navs () {
        return [{
          name: this.$t("menu.home"),
          url: '/admin'
        }, {
          name: this.$t("menu.table")
        }]
      }
    },
    data() {
      return {
        tables: [],
        loading: false,
        dialogVisibility: {
          addEditTable: false,
          addEditField: false,
          addEditRelation: false,
          addEditRecord: false
        },
        addEditTableData: {},
        addEditFieldData: {},
        addEditRelationData: {},
        addEditRecordData: {},
        selectedTable: {},
        records: [],
        pagination: {
          page: 1,
          pagination: 15,
          total: 1,
          totalPage: 1
        },
        filter: {
          query: ''
        },
        sorter: {},
        tableEntries: {
          value: {},
          candidates: [{
            name: 'field',
            label: this.$t("label.table.fields")
          }, {
            name: 'relation',
            label: this.$t("label.table.association")
          }]
        },
      }
    },
    methods: {
      validate,
      downloadFile(file) {
        console.log("Downloaded!")
      },
      actionFinished(dialogId, success) {
        this.dialogVisibility[dialogId] = false
        if (success) {
          if (dialogId === 'addEditTable') {
            this.getTables()
          }
          else if (dialogId === 'addEditField') {
            this.refreshField()
          }
          else if (dialogId === 'addEditRelation') {
            this.refreshRelation()
          }
          else if (dialogId === 'addEditRecord') {
            this.refreshRecords()
          }
        }
      },
      handleCommand (command) {
        let pattern = /([a-zA-Z]+)\[(.*)]/
        let match = command.match(pattern)
        if (match && match.length === 3) {
          this[match[1]](match[2])
        }
        else{
          this[command]()
        }
      },
      switchTab (tab) {
        if (tab.name === 'setting') {
          this.getTableDetail(this.selectedTable.id)
        }
        else {
          this.refreshRecords()
        }
      },
      updateOrder({ column, prop, order }) {
        this.sorter = {
          sorter: prop,
          order: order === "ascending" ? "ASC" : "DESC"
        }
        this.refreshRecords()
      },
      refreshRecords (page) {
        if (page) {
          this.pagination.page = page
        }
        this.loading = true
        getRecordList(this.selectedTable.id, Object.assign({}, this.pagination, this.sorter)).then(result => {
          this.records = result.data
          this.pagination = result.pagination
          this.loading = false
        })
      },
      addRecord () {
        this.addEditRecordData = {}
        this.dialogVisibility.addEditRecord = true
      },
      editRecord (record) {
        this.addEditRecordData = { id: record.id }
        for(let key in record.field_values) {
          this.addEditRecordData[key] = record.field_values[key].value
        }
        this.dialogVisibility.addEditRecord = true
      },
      deleteRecord (record) {
        this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
          confirmButtonText: this.$t("action.confirm"),
          cancelButtonText: this.$t("action.cancel"),
          type: 'warning'
        }).then(() => {
          deleteRecord(this.selectedTable.id, record.id).then(result => {
            this.$message({
              type: 'success',
              message: this.$t("message.tableRecord.deleted"),
              showClose: true
            })
            this.refreshRecords()
          })
        })
      },
      refreshField () {
        getFieldList(this.selectedTable.id).then(result => {
          this.selectedTable.table_fields = result.data
        })
      },
      addField () {
        this.addEditFieldData = {}
        this.dialogVisibility.addEditField = true
      },
      editField (field) {
        this.addEditFieldData = Object.assign({}, field)
        this.dialogVisibility.addEditField = true
      },
      deleteField (field) {
        this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
          confirmButtonText: this.$t("action.confirm"),
          cancelButtonText: this.$t("action.cancel"),
          type: 'warning'
        }).then(() => {
          deleteField(this.selectedTable.id, field.id).then(result => {
            this.$message({
              type: 'success',
              message: this.$t("message.tableField.deleted"),
              showClose: true
            })
            this.refreshField()
          })
        })
      },
      refreshRelation () {
        getRelationList(this.selectedTable.id).then(result => {
          this.selectedTable.table_relations = result.data
        })
      },
      addRelation () {
        this.addEditRelationData = {}
        this.dialogVisibility.addEditRelation = true
      },
      editRelation (relation) {
        this.addEditRelationData = Object.assign({}, relation)
        this.dialogVisibility.addEditRelation = true
      },
      deleteRelation (relation) {
        this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
          confirmButtonText: this.$t("action.confirm"),
          cancelButtonText: this.$t("action.cancel"),
          type: 'warning'
        }).then(() => {
          deleteRelation(this.selectedTable.id, relation.relationId).then(result => {
            this.$message({
              type: 'success',
              message: this.$t("message.tableRelation.deleted"),
              showClose: true
            })
            this.refreshRelation()
          })
        })
      },
      switchTableDetail (entry) {
        this.tableEntries.value = entry
      },
      addTable() {
        this.addEditTableData = { name: '' }
        this.dialogVisibility.addEditTable = true
      },
      selectTable (table) {
        this.tableEntries.value = this.tableEntries.candidates[0]
        this.getTableDetail(table.id)
      },
      getTableDetail (id) {
        getTableDetail(id).then(result => {
          this.selectedTable = result.data
        })
      },
      editTable(tableId) {
        this.addEditTableData = Object.assign({}, this.tables.find(item => item.id === tableId))
        this.dialogVisibility.addEditTable = true
      },
      deleteTable(tableId) {
        this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
          confirmButtonText: this.$t("action.confirm"),
          cancelButtonText: this.$t("action.cancel"),
          type: 'warning'
        }).then(() => {
          deleteTable(tableId).then(result => {
            this.$message({
              type: 'success',
              message: this.$t("message.table.deleted"),
              showClose: true
            })
            this.getTables()
          })
        })
      },
      getTables() {
        getTableList(this.filter).then(result => {
          this.tables = result.data
        })
      }
    },
    created() {
      this.getTables()
    }
  }
</script>

<style lang="scss" scoped>
  .noc-vgis-table-list {
    background: white;
    margin-right: 16px;
    width: 307px;
    flex-shrink: 0;
  }

  .noc-vgis-hierarchy-item:hover {
    background: #FAFAFA;
  }

  .noc-vgis-hierarchy-item {
    width: 100%;
    padding: 5px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .noc-vgis-hierarchy-icon {
      width: 16px;
      height: 16px;
    }

    .noc-vgis-hierarchy-name {
      font-family: 'HarmonyOS Sans';
      font-style: normal;
      font-weight: 400;
      font-size: 15px;
      line-height: 18px;
      color: #000000;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .noc-vgis-hierarchy-icon-lg {
    width: 40px;
    height: 40px;
  }

  .noc-vgis-table-detail {
    padding: 16px;
    background: white;
    width: calc(100% - 307px - 48px);
    margin-right: 16px;
  }

  .noc-vgis-table-title {
    flex-grow: 1;
    font-family: 'HarmonyOS Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;
    color: #000000;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .noc-vgis-table-detail-tabs {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px;
    background: rgba(79, 172, 255, 0.05);
    border-radius: 6px;
    margin-top: 16px;

    .noc-vgis-table-detail-tabs-entries {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      div {
        padding: 6px;
        font-family: 'HarmonyOS Sans';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 19px;
        color: #B3B3B3;
        background: #D4EBFF;
        margin-right: 8px;
        cursor: pointer;
        border-radius: 4px;
      }

      div.active {
        background: #4FACFF;
        color: #FFF;
      }
    }

    .noc-vgis-table-detail-tabs-actions {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      button {
        padding: 8px;
        background: #D4EBFF;
        border-radius: 4px;
        font-family: 'HarmonyOS Sans';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 19px;
        color: #B3B3B3;
        border: none;
        margin-left: 8px;
        cursor: pointer;
      }
    }
  }
</style>
