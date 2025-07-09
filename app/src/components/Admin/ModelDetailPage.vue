<template>
  <div class="full-h">
    <div class="flex align-items-center justify-content-between">
      <div style="flex-grow: 1;" class="flex align-items-center justify-content-start">
        <el-image class="noc-vgis-hierarchy-icon-lg" :src="selectedModel.icon"></el-image>
        <div class="noc-vgis-model-title">
          {{$t("label.model.name", { name: selectedModel.name })}}&nbsp;&nbsp;&nbsp;{{$t("label.model.id", { id: selectedModel.modelId })}}
          <div class="text-regular">
            {{$t("label.model.label")}}: {{ !selectedModel.labels || selectedModel.labels.length === 0 ? $t("label.basic.none") : ""}}
            <el-tag effect="dark" size="mini" v-for="label in selectedModel.labels" :key="label.id" class="m-r-5">{{label.name}}</el-tag>
          </div>
        </div>
      </div>
      <el-switch v-auth="{ resources: 'Model', action: 'Admin' }" class="m-r-10" v-model="selectedModel.published" :active-text="$t('form.model.published.label')" inactive-text="" @change="switchModelStatus"></el-switch>
      <el-button v-auth="{ resources: 'Model', action: 'Admin' }" plain type="primary" class="el-icon-edit-outline" @click="editModel(selectedModel.id)"> {{$t("action.edit")}}</el-button>
    </div>
    <div class="noc-vgis-model-detail-tabs">
      <div class="noc-vgis-model-detail-tabs-entries">
        <div :class="{active: entry.name === modelEntries.value.name}" @click="switchModelDetail(entry)" v-for="entry in modelEntries.candidates" :key="entry.name">{{entry.label}}</div>
      </div>
      <div  class="noc-vgis-model-detail-tabs-actions">
        <el-select v-model="filters.series.label" multiple v-if="modelEntries.value.name === 'series'">
          <el-option v-for="label in labels" :key="label.id" :value="label.id" :label="label.name"></el-option>
        </el-select>
        <button v-auth="{ resources: 'Model', action: 'Admin' }" class="el-icon-plus" v-if="modelEntries.value.name === 'attribute'" @click="addAttribute">{{$t("action.add")}}</button>
        <button v-auth="{ resources: 'Model', action: 'Admin' }" class="el-icon-plus" v-if="modelEntries.value.name === 'series'" @click="addSeries">{{$t("action.add")}}</button>
        <button v-auth="{ resources: 'Model', action: 'Admin' }" class="el-icon-plus" v-if="modelEntries.value.name === '3d'" @click="upload3DModel">{{$t("action.add")}}</button>
        <button v-auth="{ resources: 'Model', action: 'Admin' }" class="el-icon-delete" v-if="modelEntries.value.name === '3d'" @click="upload3DModel">{{$t("action.delete")}}</button>
        <button v-auth="{ resources: 'Model', action: 'Admin' }" class="el-icon-plus" v-if="modelEntries.value.name === 'relation'" @click="addRelation">{{$t("action.add")}}</button>
        <button v-auth="{ resources: 'Model', action: 'Admin' }" class="el-icon-plus" v-if="modelEntries.value.name === 'rule'" @click="addRuleChain">{{$t("action.add")}}</button>
        <button v-auth="{ resources: 'Model', action: 'Admin' }" class="el-icon-plus" v-if="modelEntries.value.name === 'alert'" @click="addAlertTemplate">{{$t("action.add")}}</button>
        <button v-auth="{ resources: 'Model', action: 'Admin' }" class="el-icon-plus" v-if="modelEntries.value.name === 'document'" @click="addDocument">{{$t("action.add")}}</button>
        <input v-auth="{ resources: 'Model', action: 'Admin' }" type="file" ref="file-selector" style="display: none;" @change="uploadDocument"/>
      </div>
    </div>
    <el-table header-cell-class-name="table-header-cell" cell-class-name="table-cell" v-if="modelEntries.value.name === 'attribute'" :data="selectedModel.static_attributes">
      <el-table-column prop="name" :label="$t('label.data.name')"></el-table-column>
      <el-table-column :label="$t('label.data.dataType')" width="120px">
        <template slot-scope="{ row }">
          {{$t(`dict.dataType.${row.dataType}`)}}
        </template>
      </el-table-column>
      <el-table-column  :label="$t('label.data.unique')" width="80px">
        <template slot-scope="{ row }">
          {{ $t(`dict.bool.${row.unique}`) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('label.data.required')" width="100px">
        <template slot-scope="{ row }">
          {{ $t(`dict.bool.${row.required}`) }}
        </template>
      </el-table-column>
      <el-table-column prop="defaultValue" :label="$t('label.data.default')"></el-table-column>
      <el-table-column :label="$t('label.data.constraint')">
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
      <el-table-column :label="$t('label.data.label')">
        <template slot-scope="{ row }">
          <el-tag class="m-l-5 m-r-5 m-b-5" size="small" v-for="tag in row.labels" :key="tag.id" type="primary">{{tag.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('label.data.description')" prop="description"></el-table-column>
      <el-table-column :label="$t('label.basic.action')" v-if="validate($store.state.user, { resources: 'Model', action: 'Admin' })">
        <template slot-scope="{ row }">
          <el-button size="mini" plain type="primary" icon="el-icon-edit" @click="editAttribute(row)">{{$t("action.edit")}}</el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete" @click="deleteAttribute(row)">{{$t("action.delete")}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table header-cell-class-name="table-header-cell" cell-class-name="table-cell" v-if="modelEntries.value.name === 'series'" :data="selectedModel.time_series.filter(series => matchLabels(series.labels, filters.series.label))">
      <el-table-column prop="name" :label="$t('label.data.name')"></el-table-column>
      <el-table-column prop="dataType" :label="$t('label.data.dataType')">
        <template slot-scope="{ row }">
          {{$t(`dict.dataType.${row.dataType}`)}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('label.data.constraint')">
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
      <el-table-column :label="$t('label.data.label')">
        <template slot-scope="{ row }">
          <el-tag class="m-l-5 m-r-5 m-b-5" size="small" v-for="tag in row.labels" :key="tag.id" type="primary">{{tag.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('label.data.description')" prop="description"></el-table-column>
      <el-table-column :label="$t('label.basic.action')" v-if="validate($store.state.user, { resources: 'Model', action: 'Admin' })">
        <template slot-scope="{ row }">
          <el-button plain type="primary" size="mini" icon="el-icon-edit" @click="editSeries(row)">{{$t("action.edit")}}</el-button>
          <el-button plain type="danger" size="mini" icon="el-icon-delete" @click="deleteSeries(row)">{{$t("action.delete")}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table header-cell-class-name="table-header-cell" cell-class-name="table-cell" v-if="modelEntries.value.name === 'relation'" :data="selectedModel.Targets">
      <el-table-column :label="$t('model.modelRelation.source')">
        <template slot-scope="{ row }">
          {{selectedModel.name}}
        </template>
      </el-table-column>
      <el-table-column prop="model_relation.relationType" :label="$t('model.modelRelation.type')"></el-table-column>
      <el-table-column prop="name" :label="$t('model.modelRelation.target')"></el-table-column>
      <el-table-column :label="$t('label.basic.action')" v-if="validate($store.state.user, { resources: 'Model', action: 'Admin' })">
        <template slot-scope="{ row }">
          <el-button plain type="danger" icon="el-icon-delete" size="mini" @click="deleteRelation(row)">{{$t("action.delete")}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table header-cell-class-name="table-header-cell" cell-class-name="table-cell" v-if="modelEntries.value.name === 'alert'" :data="selectedModel.alert_templates">
      <el-table-column prop="name" :label="$t('label.alertTemplate.name')"></el-table-column>
      <el-table-column :label="$t('label.alertTemplate.user')">
        <template slot-scope="{ row }">
            {{ row.person_relations.map(item => item.user.realName).join(", ") }}
            {{ row.person_relations.length === 0 ? $t("label.basic.none") : "" }}
        </template>
      </el-table-column>
        <el-table-column :label="$t('label.alertTemplate.device')">
            <template slot-scope="{ row }">
                <div v-for="relation in row.device_relations">{{relation.model_instance.name}}（{{relation.model_instance.instanceId}}）</div>
                {{ row.device_relations.length === 0 ? $t("label.basic.none") : "" }}
            </template>
        </el-table-column>
      <el-table-column :label="$t('label.basic.action')" v-if="validate($store.state.user, { resources: 'Model', action: 'Admin' })">
        <template slot-scope="{ row }">
          <el-button size="mini" plain type="primary" icon="el-icon-edit" @click="editAlertTemplate(row)">{{$t("action.edit")}}</el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete" @click="deleteAlertTemplate(row)">{{$t("action.delete")}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row v-if="modelEntries.value.name === 'document'" :gutter="20">
        <div v-if="selectedModel.documents.length === 0" style="height: 300px;" class="flex justify-content-center align-items-center text-info text-regular">
            {{$t("message.media.empty")}}
        </div>
        <el-col :span="6" v-for="file in selectedModel.documents" class="m-t-20">
            <el-card class="pointer" shadow="hover">
                <div class="file-icon">
                    <i class="el-icon-document"></i>
                </div>
                <a class="file-name" :title="file.name">{{file.name}}</a>
                <div class="text-center">
                    <el-button type="text" class="p-b-0" icon="el-icon-download" @click="downloadFile(file)">{{$t('action.download')}}</el-button>
                    <el-button type="text" class="p-b-0 text-danger" icon="el-icon-delete" @click="removeDocument(file)">{{$t('action.delete')}}</el-button>
                </div>
            </el-card>
        </el-col>
    </el-row>
    <el-divider v-if="modelEntries.value.name === 'table'" direction="horizontal" class="m-t-0 m-b-0"></el-divider>
    <div class="noc-vgis-model-detail-tabs m-t-0" v-if="modelEntries.value.name === 'table'">
      <div class="noc-vgis-model-detail-tabs-entries">
        <div :class="{active: table.tableId === selectedTable.id }" v-for="table in selectedModel.data_tables" :key="table.tableId" @click="selectTable(table)">{{table.tableName}}</div>
      </div>
    </div>
    <el-table :data="tableRecords" header-cell-class-name="table-header-cell" cell-class-name="table-cell" v-if="modelEntries.value.name === 'table' && selectedTable.id" @sort-change="updateOrder">
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
    </el-table>
    <div class="text-center m-t-20" v-if="modelEntries.value.name === 'table' && selectedTable.id">
      <el-pagination hide-on-single-page :current-page="pagination.page" :page-count="pagination.totalPage" @current-change="refreshRecords"></el-pagination>
    </div>
    <el-row class="m-t-15" v-else-if="modelEntries.value.name === 'rule' && !selectedChain.id" :gutter="15">
      <div v-if="selectedModel.rule_chains.length === 0" style="height: 300px;" class="flex justify-content-center align-items-center text-info text-regular">
        {{$t("message.ruleChain.empty")}}
      </div>
      <el-col v-else :span="4" v-for="chain in selectedModel.rule_chains" :key="chain.id" class="m-b-15">
        <div class="noc-vgis-chain-card">
          <h3 class="text-bold p-l-15 p-r-15 p-t-15 text-link">{{chain.name}}</h3>
          <p class="m-t-15 text-info p-l-15 p-r-15">
            {{chain.description}}
          </p>
          <div class="m-t-15 full-w flex">
            <div class="action text-primary" :title="$t('action.edit')" @click="editRuleChain(chain)">
              <i class="el-icon-edit"></i>
            </div>
            <div class="action text-primary" :title="$t('action.view')" @click="viewRuleChain(chain)">
              <i class="el-icon-view"></i>
            </div>
            <div class="action text-danger" :title="$t('action.delete')" @click="deleteRuleChain(chain)">
              <i class="el-icon-delete"></i>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="m-t-15 full-w" style="height: calc(100% - 174px)" v-else-if="modelEntries.value.name === 'rule' && selectedChain.id" :gutter="15">
      <rule-chain-editor :chain-id="selectedChain.id" @cancel="selectedChain = {}" @finished="getModelRuleChains"></rule-chain-editor>
    </el-row>
    <add-edit-model v-auth="{ resources: 'Model', action: 'Admin' }" :model="addEditModelData" dialog-id="addEditModel" :dialog-visibility="dialogVisibility.addEditModel" @action-finished="actionFinished"></add-edit-model>
    <add-edit-attribute v-auth="{ resources: 'Model', action: 'Admin' }" v-if="selectedModel.id && dialogVisibility.addEditAttribute" :model-id="selectedModel.id" :attribute="addEditAttributeData" dialog-id="addEditAttribute" :dialog-visibility="dialogVisibility.addEditAttribute" @action-finished="actionFinished"></add-edit-attribute>
    <add-edit-series v-auth="{ resources: 'Model', action: 'Admin' }" v-if="selectedModel.id && dialogVisibility.addEditSeries" :model-id="selectedModel.id" :series="addEditSeriesData" dialog-id="addEditSeries" :dialog-visibility="dialogVisibility.addEditSeries" @action-finished="actionFinished"></add-edit-series>
    <add-edit-relation v-auth="{ resources: 'Model', action: 'Admin' }" v-if="dialogVisibility.addEditRelation" :model-id="selectedModel.id" :relation="addEditRelationData" dialog-id="addEditRelation" :dialog-visibility="dialogVisibility.addEditRelation" @action-finished="actionFinished"></add-edit-relation>
    <add-edit-rule-chain v-auth="{ resources: 'Model', action: 'Admin' }" v-if="dialogVisibility.addEditRuleChain" :model-id="selectedModel.id" :chain="addEditRuleChainData" dialog-id="addEditRuleChain" :dialog-visibility="dialogVisibility.addEditRuleChain" @action-finished="actionFinished"></add-edit-rule-chain>
    <add-edit-alert-template v-auth="{ resources: 'Model', action: 'Admin' }" v-if="dialogVisibility.addEditAlertTemplate" :model-id="selectedModel.id" :template="addEditAlertTemplateData" dialog-id="addEditAlertTemplate" :dialog-visibility="dialogVisibility.addEditAlertTemplate" @action-finished="actionFinished"></add-edit-alert-template>
  </div>
</template>

<script>
  import AddEditModel from "./Model/AddEditModel";
  import AddEditAttribute from "./Model/AddEditAttribute";
  import AddEditSeries from "./Model/AddEditSeries";
  import AddEditRelation from "./Model/AddEditRelation";
  import AddEditRuleChain from "@/components/Admin/Model/AddEditRuleChain.vue";
  import AddEditAlertTemplate from "@/components/Admin/Model/AddEditAlertTemplate.vue";
  import RichtextViewer from "./DataTable/RichtextViewer";
  import RuleChainEditor from "@/components/Admin/Model/RuleChainEditor.vue";
  import {getModelDetail, getModelTables, updateModel} from "@/assets/js/api/model";
  import {deleteStaticAttribute, getStaticAttributeList} from "@/assets/js/api/model-attribute";
  import {deleteTimeSeries, getTimeSeriesList} from "@/assets/js/api/model-series";
  import {deleteModelRelation, getModelRelationList} from "@/assets/js/api/model-relation";
  import {downloadFile, validate} from "@/utils";
  import {getTableDetail} from "@/assets/js/api/data-table";
  import {getRecordListFromModel} from "@/assets/js/api/data-table-record";
  import {getLabelList} from "@/assets/js/api/unit-label";
  import {
    getRuleChainListForInstance,
    getRuleChainListForModel,
    removeRuleChain
  } from "@/assets/js/api/model-instance-rule-chain";
  import {getAlertTemplateList, removeAlertTemplate, updateAlertTemplate} from "@/assets/js/api/model-alert-template";
  import {updateInstanceProtocol} from "@/assets/js/api/model-instance-protocol";
  import {getFile, getFileList, removeFile, uploadFile} from "@/assets/js/api/media-file";

  export default {
    name: "ModelDetailPage",
    components: {
      AddEditModel,
      AddEditAttribute,
      AddEditSeries,
      AddEditRelation,
      AddEditRuleChain,
      AddEditAlertTemplate,
      RichtextViewer,
      RuleChainEditor
    },
    data () {
      return {
        dialogVisibility: {
          addEditModel: false,
          addEditAttribute: false,
          addEditSeries: false,
          addEditRelation: false,
          addEditRuleChain: false,
          addEditAlertTemplate: false
        },
        addEditModelData: {},
        addEditAttributeData: {},
        addEditSeriesData: {},
        addEditRelationData: {},
        addEditRuleChainData: {},
        addEditAlertTemplateData: {},
        tableRecords: [],
        filters: {
          model: {
            value: ""
          },
          instance: {
            value: ""
          },
          series: {
            label: []
          },
          attribute: {
            label: []
          }
        },
        sorter: {},
        modelEntries: {
          value: {},
          candidates: [{
            name: 'attribute',
            label: this.$t("label.model.attribute")
          }, {
            name: 'series',
            label: this.$t("label.model.series")
          }, {
            name: 'relation',
            label: this.$t("label.model.relationship")
          }/*, {
            name: '3d',
            label: this.$t("label.model.3d")
          }*/, {
              name: 'document',
              label: this.$t("label.model.document")
          }/*, {
            name: 'table',
            label: this.$t("label.model.table")
          }*/, {
            name: 'rule',
            label: this.$t("label.model.ruleChain")
          }/*, {
            name: 'alert',
            label: this.$t("label.model.alert")
          }*/]
        },
        selectedTable: {},
        selectedChain: {},
        selectedModel: {
          static_attributes: [],
          time_series: [],
          model_relations: [],
          model_instances: [],
          rule_chains: [],
          alert_templates: [],
          documents: [],
        },
        pagination: {
          page: 1,
          pagination: 10,
          total: 1,
          totalPage: 1
        },
        labels: [],
      }
    },
    methods: {
      validate,
      actionFinished (dialogId, success) {
        this.dialogVisibility[dialogId] = false
        if (success) {
          if (dialogId === 'addEditModel') {
            this.$emit('model-changed')
            this.getModelDetail(this.selectedModel.id)
          }
          else if (dialogId === 'addEditAttribute') {
            this.getAttributes()
            this.getLabels()
          }
          else if (dialogId === 'addEditSeries') {
            this.getSeries()
            this.getLabels()
          }
          else if (dialogId === 'addEditRelation') {
            this.getRelations()
          }
          else if (dialogId === 'addEditRuleChain') {
            this.getModelRuleChains()
          }
          else if (dialogId === 'addEditAlertTemplate') {
            this.getAlertTemplates()
          }
        }
      },
      matchLabels (labels, references) {
        if (references.length === 0) return true
        let refs = references.reduce((result, id) => {
          result[id] = id
          return result
        }, {})
        for(let i = 0; i < labels.length; i++) {
          if (refs[labels[i].id]) return true
        }
        return false
      },
      downloadFile(file) {
          getFile(file.id).then(result => {
              downloadFile(file.name, result.data)
          })
      },
      getModelDetail (id) {
        getModelDetail(id).then(result => {
          this.selectedModel = Object.assign({}, this.selectedModel, result.data)
        })
      },
      switchModelStatus(status) {
        updateModel(this.selectedModel.id, this.selectedModel).then(result => {
          this.$message({
            type: 'success',
            message: 'Model status changed successfully.',
            showClose: true
          })
        })
      },
      editModel (modelId = null) {
        this.addEditModelData = Object.assign({}, this.selectedModel)
        this.dialogVisibility.addEditModel = true
      },
      getLabels () {
        getLabelList().then(result => {
          this.labels = result.data
        })
      },
      switchModelDetail (entry) {
        this.modelEntries.value = entry
        if (this.modelEntries.value.name === 'table') {
          this.getModelTables()
        }
        if (this.modelEntries.value.name === 'rule') {
          this.getModelRuleChains()
        }
        if (this.modelEntries.value.name === 'alert') {
          this.getAlertTemplates()
        }
        if (this.modelEntries.value.name === 'document') {
            this.getDocuments()
        }
      },
      getDocuments () {
          getFileList({ modelId: this.selectedModel.id }).then(result => {
              this.selectedModel.documents = result.data
          })
      },
      addDocument () {
          this.$refs["file-selector"].click()
      },
      uploadDocument (event) {
        let file = event.target.files[0]
        if (file) {
            let formData = new FormData();
            formData.append('file', file);
            formData.append("modelId", this.selectedModel.id)
            uploadFile(formData).then(result => {
                this.$message({
                    message: this.$t("message.media.uploaded"),
                    type: 'success',
                    showClose: true,
                    duration: 2000
                })
                this.getDocuments()
            })
        }
      },
      removeDocument (file) {
          this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
              confirmButtonText: this.$t("action.confirm"),
              cancelButtonText: this.$t("action.cancel"),
              type: 'warning'
          }).then(() => {
              removeFile(file.id).then(result => {
                  this.$message({
                      message: this.$t("message.media.deleted"),
                      type: 'success',
                      showClose: true,
                      duration: 2000
                  })
                  this.getDocuments()
              })
          })
      },
      getModelRuleChains () {
        getRuleChainListForModel(this.selectedModel.id).then(result => {
          this.selectedModel.rule_chains = result.data
          this.selectedModel = Object.assign({}, this.selectedModel)
          this.selectedChain = {}
        })
      },
      bindRuleChain (template) {
        this.addEditRuleChainData = ""
        let currentChain = template.chains.reduce((result, item) => {
          result[item.id] = item.id
          return result
        }, {})
        getRuleChainListForModel(this.$route.params.modelId).then(result => {
          this.selectedModel.rule_chains = result.data.filter(item => !currentChain[item.id])
        })
      },
      unbindRuleChain (chain, template) {
        this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
          confirmButtonText: this.$t("action.confirm"),
          cancelButtonText: this.$t("action.cancel"),
          type: 'warning'
        }).then(() => {
          updateAlertTemplate(template.modelId, template.id, Object.assign({}, template, {
            chains: template.chains.filter(item => item.id !== chain.id).map(item => item.id)
          })).then(result => {
            this.$message({
              message: this.$t("message.alertTemplate.updated"),
              type: 'success',
              showClose: true,
              duration: 2000
            })
            this.getAlertTemplates()
          })
        })
      },
      bindRuleChainWithAlert (template) {
        template.bindChain = false
        updateAlertTemplate(template.modelId, template.id, Object.assign({}, template, {
          chains: template.chains.map(item => item.id).concat([this.addEditRuleChainData])
        })).then(result => {
          this.$message({
            message: this.$t("message.alertTemplate.updated"),
            type: 'success',
            showClose: true,
            duration: 2000
          })
          this.getAlertTemplates()
        })
      },
      getModelTables () {
        getModelTables(this.selectedModel.id).then(result => {
          this.selectedModel.data_tables = result.data
          if (this.selectedModel.data_tables.length > 0) {
            this.$nextTick(() => {
              this.selectTable(this.selectedModel.data_tables[0])
            })
          }
        })
      },
      selectTable (table) {
        getTableDetail(table.tableId).then(result => {
          this.selectedTable = result.data
          this.$nextTick(() => {
            this.refreshRecords()
          })
        })
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
        getRecordListFromModel(this.selectedModel.id, this.selectedTable.id, Object.assign({}, this.pagination, this.sorter)).then(result => {
          this.tableRecords = result.data
          this.pagination = result.pagination
          this.loading = true
        })
      },
      getAlertTemplates () {
        getAlertTemplateList(this.selectedModel.id).then(result => {
          for(let i = 0; i < result.data.length; i++) {
            result.data[i].bindChain = false
          }
          this.selectedModel.alert_templates = result.data
          this.selectedModel = Object.assign({}, this.selectedModel)
        })
      },
      addAlertTemplate () {
        this.addEditAlertTemplateData = {}
        this.dialogVisibility.addEditAlertTemplate = true
      },
      editAlertTemplate (template) {
        this.addEditAlertTemplateData = Object.assign({}, template, {
            solver: template.person_relations.map(item => item.userId),
            device: template.device_relations.map(item => item.instanceId),
        })
        this.dialogVisibility.addEditAlertTemplate = true
      },
      deleteAlertTemplate (template) {
        this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
          confirmButtonText: this.$t("action.confirm"),
          cancelButtonText: this.$t("action.cancel"),
          type: 'warning'
        }).then(() => {
          removeAlertTemplate(this.selectedModel.id, template.id).then(result => {
            this.$message({
              type: 'success',
              message: this.$t("message.alertTemplate.deleted"),
              showClose: true
            })
            this.getAlertTemplates()
          })
        })
      },
      getAttributes () {
        getStaticAttributeList(this.selectedModel.id).then(result => {
          this.selectedModel.static_attributes = result.data
        })
      },
      addAttribute() {
        this.addEditAttributeData = {}
        this.dialogVisibility.addEditAttribute = true
      },
      editAttribute (attribute) {
        this.addEditAttributeData = Object.assign({}, attribute)
        this.dialogVisibility.addEditAttribute = true
        this.dialogVisibility.addEditAttribute = true
      },
      deleteAttribute (attribute) {
        this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
          confirmButtonText: this.$t("action.confirm"),
          cancelButtonText: this.$t("action.cancel"),
          type: 'warning'
        }).then(() => {
          deleteStaticAttribute(this.selectedModel.id, attribute.id).then(result => {
            this.$message({
              type: 'success',
              message: this.$t("message.attribute.deleted"),
              showClose: true
            })
            this.getAttributes()
          })
        })
      },
      getSeries() {
        getTimeSeriesList(this.selectedModel.id).then(result => {
          this.selectedModel.time_series = result.data
        })
      },
      addSeries() {
        this.addEditSeriesData = {}
        this.dialogVisibility.addEditSeries = true
      },
      upload3DModel() {

      },
      editSeries (series) {
        this.addEditSeriesData = Object.assign({}, series)
        this.dialogVisibility.addEditSeries = true
      },
      deleteSeries (series) {
        this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
          confirmButtonText: this.$t("action.confirm"),
          cancelButtonText: this.$t("action.cancel"),
          type: 'warning'
        }).then(() => {
          deleteTimeSeries(this.selectedModel.id, series.id).then(result => {
            this.$message({
              type: 'success',
              message: this.$t("message.series.deleted"),
              showClose: true
            })
            this.getSeries()
          })
        })
      },
      getRelations() {
        getModelRelationList(this.selectedModel.id).then(result => {
          this.selectedModel.Targets = result.data
        })
      },
      addRuleChain() {
        this.addEditRuleChainData = {}
        this.dialogVisibility.addEditRuleChain = true
      },
      viewRuleChain (chain) {
        this.selectedChain = Object.assign({}, chain)
      },
      editRuleChain(chain) {
        this.addEditRuleChainData = Object.assign({}, chain)
        this.dialogVisibility.addEditRuleChain = true
      },
      deleteRuleChain (chain) {
        this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
          confirmButtonText: this.$t("action.confirm"),
          cancelButtonText: this.$t("action.cancel"),
          type: 'warning'
        }).then(() => {
          removeRuleChain(chain.id).then(result => {
            this.$message({
              type: 'success',
              message: this.$t("message.ruleChain.deleted"),
              showClose: true
            })
            this.getModelRuleChains()
          })
        })
      },
      addRelation() {
        this.dialogVisibility.addEditRelation = true
      },
      editRelation (relation) {
        this.addEditGroupData = Object.assign({}, relation)
        this.dialogVisibility.addEditRelation = true
      },
      deleteRelation (target) {
        this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
          confirmButtonText: this.$t("action.confirm"),
          cancelButtonText: this.$t("action.cancel"),
          type: 'warning'
        }).then(() => {
          deleteModelRelation(this.selectedModel.id, target.model_relation.id).then(result => {
            this.$message({
              type: 'success',
              message: this.$t("message.modelRelation.deleted"),
              showClose: true
            })
            this.getRelations()
          })
        })
      },
    },
    created() {
      this.modelEntries.value = this.modelEntries.candidates[0]
      this.getModelDetail(this.$route.params.modelId)
      this.getLabels()
    }
  }
</script>

<style lang="scss" scoped>

  .noc-vgis-chain-card {
    background: #FFFFFF;
    border: 1px solid #4FACFF;
    box-sizing: border-box;
    border-radius: 4px;

    p {
      height: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    .action {
      border-top: 1px solid #4FACFF;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      flex-grow: 1;
      cursor: pointer;
    }

    .action:hover {
      font-size: 18px;
    }
  }

  .noc-vgis-hierarchy-icon-lg {
    width: 40px;
    height: 40px;
  }

  .noc-vgis-model-title {
    flex-grow: 1;
    margin-left: 16px;
    font-family: 'HarmonyOS Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;
    color: #000000;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .noc-vgis-model-detail-tabs {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px;
    background: rgba(79, 172, 255, 0.05);
    border-radius: 6px;
    margin-top: 16px;

    .noc-vgis-model-detail-tabs-entries {
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

    .noc-vgis-model-detail-tabs-actions {
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

      button.active {
        background: #4FACFF;
        color: #FFF;
      }
    }
  }
</style>
