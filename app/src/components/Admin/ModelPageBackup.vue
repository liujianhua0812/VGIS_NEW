<template>
  <div class="full-h full-w m-l-20">
    <vgis-breadcrumb :navs="navs"></vgis-breadcrumb>
    <div style="min-height: calc(100% - 35px);" class="flex">
      <div class="noc-vgis-model-list">
        <div class="flex m-15">
          <el-input class="filter" v-model="filters.model.value" clearable @clear="getHierarchy" @keyup.native.enter="getHierarchy">
            <template slot="append">
              <el-button type="primary" icon="el-icon-search" @click="getHierarchy"></el-button>
            </template>
          </el-input>
          <el-dropdown @command="handleCommand" v-auth="{ resources: 'Model', action: 'Admin' }">
            <el-button class="m-l-20" circle type="primary" icon="el-icon-plus"></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="addGroup">Add Group</el-dropdown-item>
              <el-dropdown-item command="addModel">Add Model</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div v-if="hierarchy.length === 0" class="text-center text-info m-t-40">
          Click
          <el-button type="primary" circle icon="el-icon-plus" size="small"></el-button>
          to add group/model.
        </div>
        <el-tree
          v-else
          class="m-r-15"
          draggable
          :allow-drop="verifyTarget"
          default-expand-all
          :data="hierarchy"
          @node-drop="updatePosition"
          @node-click="selectModel">
          <div class="noc-vgis-hierarchy-item" slot-scope="{node, data}">
            <div class="flex align-items-center justify-content-start" style="flex-grow: 1;">
              <el-image class="noc-vgis-hierarchy-icon" v-if="data.type ==='ModelGroup'" :src="ModelGroupIcon"></el-image>
              <el-image class="noc-vgis-hierarchy-icon" v-else :src="data.icon"></el-image>
              <span class="noc-vgis-hierarchy-name" style="flex-grow: 1;">{{data.name}}</span>
            </div>
            <el-dropdown @command="handleCommand" v-auth="{ resources: 'Model', action: 'Admin' }">
              <span class="el-icon-more text-link"></span>
              <el-dropdown-menu v-if="data.type === 'ModelGroup'">
                <el-dropdown-item :command="`addModel[${data.id}]`">Add Model</el-dropdown-item>
                <el-dropdown-item :command="`addGroup[${data.id}]`">Add Group</el-dropdown-item>
                <el-dropdown-item :command="`editGroup[${data.id}]`" divided>Edit Name</el-dropdown-item>
                <el-dropdown-item :command="`deleteGroup[${data.id}]`" class="text-danger">Delete</el-dropdown-item>
              </el-dropdown-menu>
              <el-dropdown-menu v-else>
                <el-dropdown-item :command="`editModel[${data.id}]`">Edit</el-dropdown-item>
                <el-dropdown-item :command="`deleteModel[${data.id}]`" class="text-danger">Delete</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-tree>
      </div>
      <div class="noc-vgis-model-detail">
        <el-tabs v-model="generalMode" active-name="detail" v-if="selectedModel.id" @tab-click="switchTab">
          <el-tab-pane name="detail" label="Detail">
            <div class="flex align-items-center justify-content-between">
              <div style="flex-grow: 1;" class="flex align-items-center justify-content-start">
                <el-image class="noc-vgis-hierarchy-icon-lg" :src="selectedModel.icon"></el-image>
                <div class="noc-vgis-model-title">
                  Model Name: {{selectedModel.name}}&nbsp;&nbsp;&nbsp;Model Id: {{selectedModel.modelId}}
                </div>
              </div>
              <el-switch v-auth="{ resources: 'Model', action: 'Admin' }" class="m-r-10" v-model="selectedModel.published" active-text="Published" inactive-text="" @change="switchModelStatus"></el-switch>
              <el-button v-auth="{ resources: 'Model', action: 'Admin' }" plain type="primary" class="el-icon-edit-outline" @click="editModel(selectedModel.id)"> Edit</el-button>
            </div>
            <div class="noc-vgis-model-detail-tabs">
              <div class="noc-vgis-model-detail-tabs-entries">
                <div :class="{active: entry.name === modelEntries.value.name}" @click="switchModelDetail(entry)" v-for="entry in modelEntries.candidates" :key="entry.name">{{entry.label}}</div>
              </div>
              <div  class="noc-vgis-model-detail-tabs-actions">
                <el-select v-model="filters.series_meta.label" multiple v-if="modelEntries.value.name === 'series'">
                  <el-option v-for="label in labels" :key="label.id" :value="label.id" :label="label.name"></el-option>
                </el-select>
                <button class="el-icon-upload2"></button>
                <button class="el-icon-download"></button>
                <button v-auth="{ resources: 'Model', action: 'Admin' }" class="el-icon-plus" v-if="modelEntries.value.name === 'attribute'" @click="addAttribute">Add</button>
                <button v-auth="{ resources: 'Model', action: 'Admin' }" class="el-icon-plus" v-if="modelEntries.value.name === 'series'" @click="addSeries">Add</button>
                <button v-auth="{ resources: 'Model', action: 'Admin' }" class="el-icon-plus" v-if="modelEntries.value.name === 'relation'" @click="addRelation">Add</button>
              </div>
            </div>
            <el-table header-cell-class-name="table-header-cell" cell-class-name="table-cell" empty-text="Current model has no static attribute." v-if="modelEntries.value.name === 'attribute'" :data="selectedModel.static_attributes">
              <el-table-column prop="name" label="Name"></el-table-column>
              <el-table-column prop="dataType" label="DataType" width="120px"></el-table-column>
              <el-table-column label="Unique" width="80px">
                <template slot-scope="{ row }">
                  {{ row.unique ? 'Yes' : 'No' }}
                </template>
              </el-table-column>
              <el-table-column label="Required" width="100px">
                <template slot-scope="{ row }">
                  {{ row.required ? 'Yes' : 'No' }}
                </template>
              </el-table-column>
              <el-table-column prop="defaultValue" label="Default Value"></el-table-column>
              <el-table-column label="Constraint">
                <template slot-scope="{ row }">
                  <div v-if="row.dataType === 'String'">
                    <div v-if="row.min || row.min === 0">Min Length: {{row.min}}</div>
                    <div v-if="row.max || row.max === 0">Max Length: {{row.max}}</div>
                  </div>
                  <div v-if="row.dataType === 'Text'">
                    <div v-if="row.min || row.min === 0">Min Length: {{row.min}}</div>
                    <div v-if="row.max || row.max === 0">Max Length: {{row.max}}</div>
                  </div>
                  <div v-if="row.dataType === 'Enum'">Candidates:
                    <ul class="p-l-20">
                      <li v-for="value in row.candidate" :key="value">{{value}}</li>
                    </ul>
                  </div>
                  <div v-if="row.dataType === 'Integer'">
                    <div v-if="row.min || row.min === 0">Minimum: {{row.min}}</div>
                    <div v-if="row.max || row.max === 0">Maximum: {{row.max}}</div>
                    <div v-if="row.unit">Unit: {{row.unit.name}}</div>
                  </div>
                  <div v-if="row.dataType === 'Decimal'">
                    <div v-if="row.min || row.min === 0">Minimum: {{row.min}}</div>
                    <div v-if="row.max || row.max === 0">Maximum: {{row.max}}</div>
                    <div v-if="row.precision || row.precision === 0">Precision: {{row.precision}}</div>
                    <div v-if="row.unit">Unit: {{row.unit.name}}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Label">
                <template slot-scope="{ row }">
                  <el-tag class="m-l-5 m-r-5 m-b-5" size="small" v-for="tag in row.labels" :key="tag.id" type="primary">{{tag.name}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="Description" prop="description"></el-table-column>
              <el-table-column label="Actions" v-if="validate($store.state.user, { resources: 'Model', action: 'Admin' })">
                <template slot-scope="{ row }">
                  <el-button size="mini" plain type="primary" icon="el-icon-edit" @click="editAttribute(row)">Edit</el-button>
                  <el-button size="mini" plain type="danger" icon="el-icon-delete" @click="deleteAttribute(row)">Delete</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table empty-text="Current model has no time series." header-cell-class-name="table-header-cell" cell-class-name="table-cell" v-if="modelEntries.value.name === 'series'" :data="selectedModel.time_series.filter(series => matchLabels(series.labels, filters.series_meta.label))">
              <el-table-column prop="name" label="Name"></el-table-column>
              <el-table-column prop="dataType" label="DataType"></el-table-column>
              <el-table-column label="Constraint">
                <template slot-scope="{ row }">
                  <div v-if="row.dataType === 'String'">
                    <div v-if="row.min || row.min === 0">Min Length: {{row.min}}</div>
                    <div v-if="row.max || row.max === 0">Max Length: {{row.max}}</div>
                  </div>
                  <div v-if="row.dataType === 'Text'">
                    <div v-if="row.min || row.min === 0">Min Length: {{row.min}}</div>
                    <div v-if="row.max || row.max === 0">Max Length: {{row.max}}</div>
                  </div>
                  <div v-if="row.dataType === 'Enum'">Candidates:
                    <ul class="p-l-20">
                      <li v-for="value in row.candidate" :key="value">{{value}}</li>
                    </ul>
                  </div>
                  <div v-if="row.dataType === 'Integer'">
                    <div v-if="row.min || row.min === 0">Minimum: {{row.min}}</div>
                    <div v-if="row.max || row.max === 0">Maximum: {{row.max}}</div>
                    <div v-if="row.unit">Unit: {{row.unit.name}}</div>
                  </div>
                  <div v-if="row.dataType === 'Decimal'">
                    <div v-if="row.min || row.min === 0">Minimum: {{row.min}}</div>
                    <div v-if="row.max || row.max === 0">Maximum: {{row.max}}</div>
                    <div v-if="row.precision || row.precision === 0">Precision: {{row.precision}}</div>
                    <div v-if="row.unit">Unit: {{row.unit.name}}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Label">
                <template slot-scope="{ row }">
                  <el-tag class="m-l-5 m-r-5 m-b-5" size="small" v-for="tag in row.labels" :key="tag.id" type="primary">{{tag.name}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="Description" prop="description"></el-table-column>
              <el-table-column label="Actions" v-if="validate($store.state.user, { resources: 'Model', action: 'Admin' })">
                <template slot-scope="{ row }">
                  <el-button plain type="primary" size="mini" icon="el-icon-edit" @click="editSeries(row)">Edit</el-button>
                  <el-button plain type="danger" size="mini" icon="el-icon-delete" @click="deleteSeries(row)">Delete</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table empty-text="Current model has no relationship with other models." header-cell-class-name="table-header-cell" cell-class-name="table-cell" v-if="modelEntries.value.name === 'relation'" :data="selectedModel.Targets">
              <el-table-column label="Source Model">
                <template slot-scope="{ row }">
                  {{selectedModel.name}}
                </template>
              </el-table-column>
              <el-table-column prop="model_relation.relationType" label="Type"></el-table-column>
              <el-table-column prop="name" label="Target Model"></el-table-column>
              <el-table-column label="Actions" v-if="validate($store.state.user, { resources: 'Model', action: 'Admin' })">
                <template slot-scope="{ row }">
                  <el-button plain type="danger" icon="el-icon-delete" size="mini" @click="deleteRelation(row)">Delete</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-divider v-if="modelEntries.value.name === 'table'" direction="horizontal" class="m-t-0 m-b-0"></el-divider>
            <div class="noc-vgis-model-detail-tabs m-t-0" v-if="modelEntries.value.name === 'table'">
              <div class="noc-vgis-model-detail-tabs-entries">
                <div :class="{active: table.tableId === selectedTable.id }" v-for="table in selectedModel.data_tables" :key="table.tableId" @click="selectTable(table)">{{table.tableName}}</div>
              </div>
            </div>
            <el-table :data="tableRecords" header-cell-class-name="table-header-cell" cell-class-name="table-cell" v-if="modelEntries.value.name === 'table' && selectedTable.id">
              <el-table-column show-overflow-tooltip v-for="field in selectedTable.table_fields" :sortable="field.sortable" :key="field.id" :label="field.name">
                <template slot-scope="{ row }">
                  {{ row.field_values[field.id] ? row.field_values[field.id].value : '' }}
                </template>
              </el-table-column>
            </el-table>
            <div class="text-center m-t-20" v-if="modelEntries.value.name === 'table' && selectedTable.id">
              <el-pagination hide-on-single-page :current-page="pagination.table.page" :page-count="pagination.table.totalPage" @current-change="refreshRecords"></el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane name="instance" label="Object" v-auth="{ resources: 'Model Instance' }">
            <div v-if="selectedInstance.id">
              <div class="flex align-items-center justify-content-between">
                <div style="flex-grow: 1;" class="flex align-items-center justify-content-start">
                  <el-image class="noc-vgis-hierarchy-icon-lg" :src="selectedModel.icon"></el-image>
                  <div class="noc-vgis-model-title">
                    Object Name: {{selectedInstance.name}}&nbsp;&nbsp;&nbsp;
                    Object Id: {{selectedInstance.instanceId}}&nbsp;&nbsp;&nbsp;
                    Model Name: {{selectedModel.name}}&nbsp;&nbsp;&nbsp;
                    Model Id: {{selectedModel.modelId}}
                  </div>
                </div>
                <el-switch v-auth="{ resources: 'Model Instance', action: 'Admin' }" class="m-r-10" v-model="selectedInstance.published" active-text="Published" inactive-text="" @change="switchInstanceStatus"></el-switch>
                <el-button v-auth="{ resources: 'Model Instance', action: 'Admin' }" plain type="primary" class="el-icon-edit-outline" @click="editInstance(selectedInstance)"> Edit</el-button>
                <el-button plain type="primary" class="el-icon-arrow-left" @click="selectedInstance = {}"> Back</el-button>
              </div>
              <div class="noc-vgis-model-detail-tabs">
                <div class="noc-vgis-model-detail-tabs-entries">
                  <div :class="{active: entry.name === instanceEntries.value.name}" @click="switchInstanceDetail(entry)" v-for="entry in instanceEntries.candidates" :key="entry.name">{{entry.label}}</div>
                  <div v-if="selectedInstance.threeDViewPoint && Object.keys(selectedInstance.threeDViewPoint).length > 0" :class="{active: 'view' === instanceEntries.value.name}" @click="switchInstanceDetail({ name: 'view', label: 'View' })" key="View">View</div>
                </div>
                <div class="noc-vgis-model-detail-tabs-actions">
                  <el-select v-model="filters.attribute.label" multiple v-if="instanceEntries.value.name === 'attribute'">
                    <el-option v-for="label in labels" :key="label.id" :value="label.id" :label="label.name"></el-option>
                  </el-select>
                  <el-select v-model="filters.series.label" multiple v-if="instanceEntries.value.name === 'series'">
                    <el-option v-for="label in labels" :key="label.id" :value="label.id" :label="label.name"></el-option>
                  </el-select>
                  <button v-auth="{ resources: 'Model Instance', action: 'Admin' }" class="el-icon-plus" v-if="instanceEntries.value.name === 'series'" @click="addSeriesValue">Add</button>
                  <button :class="['el-icon-notebook-1', { active: seriesMode === 'history' }]" v-if="instanceEntries.value.name === 'series'" @click="seriesMode = 'history'"></button>
                  <button :class="['el-icon-s-grid', { active: seriesMode === 'realtime' }]" v-if="instanceEntries.value.name === 'series'" @click="seriesMode = 'realtime'"></button>
                  <button v-auth="{ resources: 'Model Instance', action: 'Admin' }" class="el-icon-plus" v-if="instanceEntries.value.name === 'relation'" @click="addInstanceRelation">Add</button>
                  <button v-auth="{ resources: 'Model Instance', action: 'Admin' }" class="el-icon-plus" v-if="instanceEntries.value.name === 'protocol'" @click="addProtocol">Add</button>
                </div>
              </div>
              <el-table v-if="instanceEntries.value.name === 'attribute'" header-cell-class-name="table-header-cell" cell-class-name="table-cell" :data="selectedInstance.attribute_values.filter(value => matchLabels(value.attribute.labels, filters.attribute.label))">
                <el-table-column label="Name" prop="attribute.name"></el-table-column>
                <el-table-column label="Label">
                  <template slot-scope="{ row }">
                    <el-tag class="m-l-5 m-r-5 m-b-5" size="small" v-for="tag in row.attribute.labels" :key="tag.id" type="primary">{{tag.name}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="Value">
                  <template slot-scope="{ row }">
                    <div v-if="!row.editing">
                      <div v-if="row.attribute.dataType === 'Date'">{{new Date(row.value).format('yyyy/MM/dd')}}</div>
                      <div v-else-if="row.attribute.dataType === 'DateTime'">{{new Date(row.value).format('yyyy/MM/dd hh:mm:ss')}}</div>
                      <div v-else-if="row.attribute.dataType === 'Time'">{{new Date(row.value).format('hh:mm:ss')}}</div>
                      <div v-else-if="row.attribute.dataType === 'Integer'">{{parseInt(row.value)}}{{ row.attribute.unit ? row.attribute.unit.name : '' }}</div>
                      <div v-else-if="row.attribute.dataType === 'Decimal'">{{parseFloat(row.value).toFixed(row.attribute.precision)}}{{ row.attribute.unit ? row.attribute.unit.name : '' }}</div>
                      <div v-else-if="row.attribute.dataType === 'Boolean'">{{ row.value === 'true' ? 'Yes' : 'No' }}</div>
                      <div v-else>{{ row.value }}</div>
                    </div>
                    <div v-else>
                      <el-input size="mini" v-model="row.value" v-if="row.attribute.dataType === 'String'"></el-input>
                      <el-input size="mini" v-model="row.value" type="textarea" rows="4" v-if="row.attribute.dataType === 'Text'"></el-input>
                      <el-input size="mini" v-model="row.value" :min="row.attribute.min" :max="row.attribute.max" type="number" v-if="row.attribute.dataType === 'Integer'"></el-input>
                      <el-input size="mini" v-model="row.value" :min="row.attribute.min" :max="row.attribute.max" type="number" v-if="row.attribute.dataType === 'Decimal'"></el-input>
                      <el-select size="mini" v-model="row.value" class="full-w" v-if="row.attribute.dataType === 'Enum'">
                        <el-option v-for="value in row.attribute.candidate" :key="value" :label="value" :value="value"></el-option>
                      </el-select>
                      <el-select size="mini" v-model="row.value" class="full-w" v-if="row.attribute.dataType === 'Boolean'">
                        <el-option :value="true" label="Yes"></el-option>
                        <el-option :value="false" label="No"></el-option>
                      </el-select>
                      <el-date-picker size="mini" class="full-w" v-model="row.value" type="datetime" v-if="row.attribute.dataType === 'DateTime'"></el-date-picker>
                      <el-date-picker size="mini" class="full-w" v-model="row.value" type="date" v-if="row.attribute.dataType === 'Date'"></el-date-picker>
                      <el-time-picker size="mini" class="full-w" v-model="row.value" v-if="row.attribute.dataType === 'Time'"></el-time-picker>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Description" prop="description"></el-table-column>
                <el-table-column label="Actions" v-if="validate($store.state.user, { resources: 'Model Instance', action: 'Admin' })">
                  <template slot-scope="{ row }">
                    <el-button v-if="!row.editing" type="primary" plain icon="el-icon-edit" size="mini" @click="enableInstanceAttributeEditor(row)">Edit</el-button>
                    <el-button v-else type="primary" plain icon="el-icon-check" size="mini" @click="saveInstanceAttributeValue(row)">Confirm</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-table v-loading="loading" class="full-w" v-if="instanceEntries.value.name === 'series' && seriesMode === 'history'" header-cell-class-name="table-header-cell" cell-class-name="table-cell" :data="seriesData.history">
                <el-table-column label="Time" fixed>
                  <template slot-scope="{ row }">
                    {{new Date(row.time).format('yyyy/MM/dd hh:mm:ss')}}
                  </template>
                </el-table-column>
                <el-table-column :key="series.id" :label="`${series.name}${series.unit ? ` (${series.unit.name})` : ''}`" v-for="series in selectedModel.time_series" v-if="matchLabels(series.labels, filters.series.label)">
                  <template slot-scope="{ row }">
                    <div v-if="row.data[series.id]">{{ series.dataType === 'Decimal' && (series.precision || series.precision === 0) ? parseFloat(parseFloat(row.data[series.id].value).toFixed(series.precision)) : row.data[series.id].value }}</div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="Actions" v-if="validate($store.state.user, { resources: 'Model Instance', action: 'Admin' })">
                  <template slot-scope="{ row }">
                    <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="editSeriesValue(row)">Edit</el-button>
                    <el-button type="danger" plain icon="el-icon-check" size="mini" @click="deleteSeriesValue(row)">Delete</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div v-if="instanceEntries.value.name === 'series' && seriesMode === 'history'" class="m-t-20 m-b-20 text-center">
                <el-pagination hide-on-single-page :current-page="pagination.series.page" :page-count="pagination.series.totalPage" @current-change="getSeriesValues"></el-pagination>
              </div>
              <el-row class="noc-m-t-15" v-else-if="instanceEntries.value.name === 'series' && seriesMode === 'realtime'" :gutter="15">
                <el-col :span="4" v-for="series in selectedModel.time_series" :key="series.id" class="m-b-15" v-if="matchLabels(series.labels, filters.series.label)">
                  <div class="noc-vgis-series-card">
                    <div class="noc-vgis-series-time flex align-items-center justify-content-between">
                      {{ seriesData.realtime[series.id] ? new Date(seriesData.realtime[series.id].time).format('yyyy/MM/dd hh:mm:ss') : 'Unknown' }}
                      <el-button v-auth="{ resources: 'Model Instance', action: 'Admin' }" plain class="el-icon-plus" type="primary" size="mini" @click="addSeriesValue(series)"></el-button>
                    </div>
                    <div class="flex align-items-center noc-m-t-15">
                      <div class="noc-vgis-series-name">{{series.name}}</div>
                    </div>
                    <div class="flex align-items-center noc-m-t-15">
                      <div class="noc-vgis-series-value">
                        {{ seriesData.realtime[series.id] ? formatValue(series, seriesData.realtime[series.id].value) : "?" }}
                        {{series.unit ? series.unit.name : ''}}
                      </div>
                    </div>
                    <div class="noc-m-t-15">
                      <el-button plain type="primary" style="width: 100%;" @click="showSeriesValues(series)">Historical Data</el-button>
                    </div>
                    <div class="noc-m-t-15" v-auth="{ resources: 'Model Instance', action: 'Admin' }">
                      <el-button plain type="primary" style="width: 100%;" @click="importSeriesValues(series)">Import Data</el-button>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-table v-if="instanceEntries.value.name === 'relation'" header-cell-class-name="table-header-cell" cell-class-name="table-cell" :data="selectedInstance.Parents.concat(selectedInstance.Children)">
                <el-table-column label="Source Object">
                  <template slot-scope="{ row }">
                    {{ selectedInstance.name}}
                  </template>
                </el-table-column>
                <el-table-column label="Type">
                  <template slot-scope="{ row }">
                    {{ row.instance_relation.childId === selectedInstance.id ? 'Belong To' : 'Contain' }}
                  </template>
                </el-table-column>
                <el-table-column label="Target Object">
                  <template slot-scope="{ row }">
                    {{row.name}}
                  </template>
                </el-table-column>
                <el-table-column label="Actions" v-if="validate($store.state.user, { resources: 'Model Instance', action: 'Admin' })">
                  <template slot-scope="{ row }">
                    <el-button plain type="danger" size="mini" icon="el-icon-delete" @click="deleteInstanceRelation(row)">Delete</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-divider v-if="instanceEntries.value.name === 'table'" direction="horizontal" class="m-t-0 m-b-0"></el-divider>
              <div class="noc-vgis-model-detail-tabs m-t-0" v-if="instanceEntries.value.name === 'table'">
                <div class="noc-vgis-model-detail-tabs-entries">
                  <div :class="{active: table.tableId === selectedTable.id }" v-for="table in selectedModel.data_tables" :key="table.tableId" @click="selectTable(table)">{{table.tableName}}</div>
                </div>
              </div>
              <div class="noc-vgis-model-detail-tabs" style="background: transparent;" v-if="instanceEntries.value.name === 'table'">
                <div class="noc-vgis-model-detail-tabs-entries">
<!--                  <div class="el-icon-plus" @click="addTableRecord">Add</div>-->
                </div>
              </div>
              <el-table :data="tableRecords" header-cell-class-name="table-header-cell" cell-class-name="table-cell" v-if="instanceEntries.value.name === 'table' && selectedTable.id">
                <el-table-column show-overflow-tooltip v-for="field in selectedTable.table_fields" :sortable="field.sortable" :key="field.id" :label="field.name">
                  <template slot-scope="{ row }">
                    {{ row.field_values[field.id] ? row.field_values[field.id].value : '' }}
                  </template>
                </el-table-column>
              </el-table>
              <div class="text-center m-t-20" v-if="instanceEntries.value.name === 'table' && selectedTable.id">
                <el-pagination hide-on-single-page :current-page="pagination.table.page" :page-count="pagination.table.totalPage" @current-change="refreshRecords"></el-pagination>
              </div>
              <div class="noc-m-t-15" v-if="instanceEntries.value.name === 'protocol'">
                <el-table :data="selectedInstance.protocols.filter(item => !item.isInterface)" header-cell-class-name="table-header-cell" cell-class-name="table-cell" class="m-b-40">
                  <el-table-column label="Name" prop="name"></el-table-column>
                  <el-table-column label="Protocol" prop="protocolType"></el-table-column>
                  <el-table-column label="Sample Interval">
                    <template slot-scope="{ row }">
                      {{ formatTimeRange(row.sampleInterval) }}
                    </template>
                  </el-table-column>
                  <el-table-column label="Description" prop="description"></el-table-column>
                  <el-table-column label="Status">
                    <template slot-scope="{ row }">
                      <el-switch v-model="row.isActive" @change="updateProtocolStatus(row)"></el-switch>
                    </template>
                  </el-table-column>
                  <el-table-column label="Actions">
                    <template slot-scope="{ row }">
                      <el-button v-auth="{ resources: 'Model Instance', action: 'Admin' }" plain type="primary" size="mini" icon="el-icon-edit" class="m-r-5" @click="editProtocol(row)">Edit</el-button>
                      <el-button plain type="primary" size="mini" icon="el-icon-connection" @click="testProtocol(row)">Test</el-button>
                      <el-button v-auth="{ resources: 'Model Instance', action: 'Admin' }" plain type="danger" size="mini" icon="el-icon-delete" @click="deleteProtocol(row)">Delete</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="noc-vgis-model-title m-l-0">Data Interface</div>
                <el-table header-cell-class-name="table-header-cell" cell-class-name="table-cell" :data="selectedInstance.protocols.filter(item => item.isInterface)">
                  <el-table-column label="Name" prop="name"></el-table-column>
                  <el-table-column label="Protocol" prop="protocolType"></el-table-column>
                  <el-table-column label="Description" prop="description"></el-table-column>
                  <el-table-column label="Description">
                    <template slot-scope="{ row }">
                      <el-button v-auth="{ resources: 'Model Instance', action: 'Admin' }" plain type="primary" size="mini" icon="el-icon-edit" class="m-r-5" @click="editProtocol(row)">Edit</el-button>
                      <el-button plain type="primary" size="mini" icon="el-icon-files" @click="viewProtocolDocument(row)">Document</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="noc-m-t-15" v-if="instanceEntries.value.name === 'view'">
                <view-point-viewer :tag="selectedInstance.instanceId" style="height: 800px;" v-model="selectedInstance.threeDViewPoint"></view-point-viewer>
              </div>
              <div class="noc-vgis-model-detail-tabs m-t-0" v-if="instanceEntries.value.name === 'pid' && selectedInstance.pids.length > 0">
                <div class="noc-vgis-model-detail-tabs-entries">
                  <div :class="{active: pid.id === selectedPID.id }" v-for="pid in selectedInstance.pids" :key="pid.id" @click="selectPID(pid)">
                    {{pid.name}}
                    <i class="el-icon-edit pointer" v-auth="{ resources: 'Model Instance', action: 'Admin' }" @click="editPID(pid)"></i>
                    <i class="el-icon-delete text-danger pointer" v-auth="{ resources: 'Model Instance', action: 'Admin' }" @click="deletePID(pid)"></i>
                  </div>
                  <div class="pull-right el-icon-plus" @click="addPID"></div>
                </div>
              </div>
              <div style="background: #0a1b31;" class="noc-m-t-15 p-10" v-if="instanceEntries.value.name === 'pid' && selectedInstance.pids.length > 0">
                <div ref="pid" v-if="selectedPID.id" v-html="selectedPID.map"></div>
              </div>
              <div style="height: 400px;" v-else-if="instanceEntries.value.name === 'pid'" class="noc-m-t-15 flex align-items-center justify-content-center text-info">
                <div>
                  Please upload a <b>&nbsp;Process Diagram (svg format)&nbsp;</b> first!
                  <div class="text-center noc-m-t-15">
                    <el-button slot="reference" type="primary" plain icon="el-icon-upload2" @click="addPID">Upload</el-button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div>
                <el-button v-auth="{ resources: 'Model Instance', action: 'Admin' }" type="primary" icon="el-icon-plus" plain @click="addInstance"> Add</el-button>
                <el-button type="primary" icon="el-icon-download" plain @click="downloadInstances(selectedModel.id)">Export</el-button>
                <el-input v-model="filters.instance.value" clearable style="width: 213px" class="m-l-10 filter" @clear="getInstances(selectedModel.id)" @keyup.native.enter="getInstances(selectedModel.id)">
                  <template slot="append">
                    <el-button type="primary" icon="el-icon-search" @click="getInstances(selectedModel.id)"></el-button>
                  </template>
                </el-input>
              </div>
              <el-table header-cell-class-name="table-header-cell" cell-class-name="table-cell" :data="selectedModel.model_instances" :key="randomKey">
                <el-table-column label="Name" prop="name"></el-table-column>
                <el-table-column label="ID" prop="instanceId"></el-table-column>
                <el-table-column label="Model Name">
                  <template slot-scope="{ row }">{{selectedModel.name}}</template>
                </el-table-column>
                <el-table-column label="Model ID">
                  <template slot-scope="{ row }">{{selectedModel.modelId}}</template>
                </el-table-column>
                <el-table-column label="Last Updated At">
                  <template slot-scope="{ row }">{{ new Date(row.updatedAt).format('yyyy/MM/dd hh:mm:ss') }}</template>
                </el-table-column>
                <el-table-column label="Actions">
                  <template slot-scope="{ row }">
                    <el-button plain size="mini" type="primary" class="m-r-5" icon="el-icon-view" @click="inspectInstance(row)"> View Detail</el-button>
                    <el-button v-auth="{ resources: 'Model Instance', action: 'Admin' }" plain size="mini" type="danger" icon="el-icon-delete" @click="deleteInstance(row)"> Delete</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div v-else class="flex align-items-center justify-content-center full-h text-info">
          Please select a model to view its information.
        </div>
      </div>
    </div>
    <add-edit-group v-auth="{ resources: 'Model', action: 'Admin' }" :group="addEditGroupData" dialog-id="addEditGroup" :dialog-visibility="dialogVisibility.addEditGroup" @action-finished="actionFinished"></add-edit-group>
    <add-edit-model v-auth="{ resources: 'Model', action: 'Admin' }" :model="addEditModelData" dialog-id="addEditModel" :dialog-visibility="dialogVisibility.addEditModel" @action-finished="actionFinished"></add-edit-model>
    <add-edit-attribute v-auth="{ resources: 'Model', action: 'Admin' }" v-if="selectedModel.id && dialogVisibility.addEditAttribute" :model-id="selectedModel.id" :attribute="addEditAttributeData" dialog-id="addEditAttribute" :dialog-visibility="dialogVisibility.addEditAttribute" @action-finished="actionFinished"></add-edit-attribute>
    <add-edit-series v-auth="{ resources: 'Model', action: 'Admin' }" v-if="selectedModel.id && dialogVisibility.addEditSeries" :model-id="selectedModel.id" :series="addEditSeriesData" dialog-id="addEditSeries" :dialog-visibility="dialogVisibility.addEditSeries" @action-finished="actionFinished"></add-edit-series>
    <add-edit-relation v-auth="{ resources: 'Model', action: 'Admin' }" v-if="dialogVisibility.addEditRelation" :model-id="selectedModel.id" :relation="addEditRelationData" dialog-id="addEditRelation" :dialog-visibility="dialogVisibility.addEditRelation" @action-finished="actionFinished"></add-edit-relation>
    <add-edit-instance v-auth="{ resources: 'Model Instance', action: 'Admin' }" v-if="dialogVisibility.addEditInstance" :model="selectedModel" :instance="addEditInstanceData" dialog-id="addEditInstance" :dialog-visibility="dialogVisibility.addEditInstance" @action-finished="actionFinished"></add-edit-instance>
    <add-edit-p-i-d v-auth="{ resources: 'Model Instance', action: 'Admin' }" v-if="dialogVisibility.addEditPID" :instance="selectedInstance" :pid="addEditPIDData" dialog-id="addEditPID" :dialog-visibility="dialogVisibility.addEditPID" @action-finished="actionFinished"></add-edit-p-i-d>
    <add-edit-series-value v-auth="{ resources: 'Model Instance', action: 'Admin' }" v-if="selectedInstance.id" :model="selectedModel" :instance="selectedInstance" :record="addEditSeriesValueData" :series="addEditSeriesValueData.series" dialog-id="addEditSeriesValue" :dialog-visibility="dialogVisibility.addEditSeriesValue" @action-finished="actionFinished"></add-edit-series-value>
    <show-series-data v-if="dialogVisibility.showSeriesData" :model="selectedModel" :instance="selectedInstance" :series="selectedSeries" dialog-id="showSeriesData" :dialog-visibility="dialogVisibility.showSeriesData" @action-finished="actionFinished"></show-series-data>
    <import-series-data v-auth="{ resources: 'Model Instance', action: 'Admin' }" v-if="selectedSeries.id" :model="selectedModel" :instance="selectedInstance" :series="selectedSeries" dialog-id="importSeriesData" :dialog-visibility="dialogVisibility.importSeriesData" @action-finished="actionFinished"></import-series-data>
    <add-edit-protocol v-auth="{ resources: 'Model Instance', action: 'Admin' }" v-if="selectedInstance.id" :model="selectedModel" :instance="selectedInstance" :protocol="addEditProtocolData" dialog-id="addEditProtocol" :dialog-visibility="dialogVisibility.addEditProtocol" @action-finished="actionFinished"></add-edit-protocol>
    <add-instance-relation v-auth="{ resources: 'Model Instance', action: 'Admin' }" v-if="dialogVisibility.addInstanceRelation" :model="selectedModel" :instance="selectedInstance" dialog-id="addInstanceRelation" :dialog-visibility="dialogVisibility.addInstanceRelation" @action-finished="actionFinished"></add-instance-relation>
    <test-protocol v-auth="{ resources: 'Model Instance' }" v-if="dialogVisibility.testProtocol" :model="selectedModel" :instance="selectedInstance" :protocol="selectedProtocol" dialog-id="testProtocol" :dialog-visibility="dialogVisibility.testProtocol" @action-finished="actionFinished"></test-protocol>
    <show-protocol-doc v-auth="{ resources: 'Model Instance' }" v-if="dialogVisibility.showProtocolDoc" :model="selectedModel" :instance="selectedInstance" :protocol="selectedProtocol" dialog-id="showProtocolDoc" :dialog-visibility="dialogVisibility.showProtocolDoc" @action-finished="actionFinished"></show-protocol-doc>
  </div>
</template>

<script>

  import AddInstanceRelation from "./Model/AddInstanceRelation";
  import ShowProtocolDoc from "./Model/ShowProtocolDoc";
  import TestProtocol from "./Model/TestProtocol";
  import { validate } from "../../utils";
  import VgisBreadcrumb from "../Standard/vgis-breadcrumb.vue"
  import ImportSeriesData from "./Model/ImportSeriesData";
  import ShowSeriesData from "./Model/ShowSeriesData";
  import AddEditSeriesValue from "./Model/AddEditSeriesValue";
  import ModelGroupIcon from '../../assets/images/icons/ModelGroupIcon.png'
  import AddEditGroup from "./Model/AddEditGroup";
  import AddEditModel from "./Model/AddEditModel";
  import AddEditAttribute from "./Model/AddEditAttribute";
  import AddEditSeries from "./Model/AddEditSeries";
  import AddEditRelation from "./Model/AddEditRelation";
  import AddEditInstance from "./Model/AddEditInstance";
  import AddEditPID from "./Model/AddEditPID";
  import AddEditProtocol from "./Model/AddEditProtocol";
  import VgisRow from '../Standard/vgis-row'
  import VgisCol from '../Standard/vgis-col'
  import VgisFlexColumn from '../Standard/vgis-flex-column'
  import VgisCell from '../Standard/vgis-cell'
  import {
    getModelInstanceList,
    getModelInstanceDetail,
    deleteModelInstance,
    updateModelInstance,
    downloadModelInstanceList
  } from "../../assets/js/api/model-instance";
  import { updateInstanceAttribute } from "../../assets/js/api/model-instance-attribute";
  import { getModelList, getModelDetail, getModelTables, updateModel, deleteModel } from "../../assets/js/api/model";
  import { updateModelGroup, deleteModelGroup } from "../../assets/js/api/model-group";
  import { getStaticAttributeList, updateStaticAttribute, deleteStaticAttribute } from "../../assets/js/api/model-attribute";
  import { getTimeSeriesList, updateTimeSeries, deleteTimeSeries } from "../../assets/js/api/model-series";
  import { getModelRelationList, deleteModelRelation } from "../../assets/js/api/model-relation";
  import { getInstanceSeriesValueList, getInstanceSingleSeriesValue, deleteInstanceSeriesValue } from "../../assets/js/api/model-instance-series";
  import { getInstanceProtocolList, updateInstanceProtocol, deleteInstanceProtocol } from "../../assets/js/api/model-instance-protocol";
  import {getTableDetail} from "../../assets/js/api/data-table";
  import {getRecordListFromModel, getRecordListFromInstance} from "../../assets/js/api/data-table-record";
  import {deleteInstanceRelation, getInstanceRelationList} from "../../assets/js/api/model-instance-relation";
  import { getLabelList } from "../../assets/js/api/unit-label";
  import { downloadFile } from "../../utils";
  import ViewPointViewer from "../Maps/ViewPointViewer";
  import {uploadPID} from "../../assets/js/api/pid";
  import {deletePID, getPIDList, updatePID} from "../../assets/js/api/model-instance-pid";

  export default {
    name: "ModelPage",
    components: {
      ViewPointViewer,
      VgisBreadcrumb,
      AddInstanceRelation,
      AddEditModel,
      AddEditGroup,
      AddEditAttribute,
      AddEditSeries,
      AddEditRelation,
      AddEditInstance,
      AddEditSeriesValue,
      AddEditPID,
      AddEditProtocol,
      TestProtocol,
      ShowProtocolDoc,
      ShowSeriesData,
      ImportSeriesData,
      VgisRow,
      VgisCol,
      VgisFlexColumn,
      VgisCell
    },
    props: {
      modelId: String,
      instanceId: String
    },
    computed: {
      navs () {
        return [{
          name: 'Home',
          url: '/admin'
        }, {
          name: 'Model'
        }]
      }
    },
    data() {
      return {
        dialogVisibility: {
          addEditGroup: false,
          addEditModel: false,
          addEditAttribute: false,
          addEditSeries: false,
          addEditRelation: false,
          addEditInstance: false,
          addEditSeriesValue: false,
          addEditPID: false,
          addInstanceRelation: false,
          showSeriesData: false,
          importSeriesData: false,
          addEditProtocol: false,
          testProtocol: false,
          showProtocolDoc: false
        },
        addEditInstanceData: {},
        addEditGroupData: {},
        addEditModelData: {},
        addEditAttributeData: {},
        addEditSeriesData: {},
        addEditRelationData: {},
        addEditSeriesValueData: {},
        addEditProtocolData: {},
        addEditPIDData: {},
        selectedModel: {
          static_attributes: [],
          time_series: [],
          model_relations: [],
          model_instances: []
        },
        selectedTable: {},
        selectedPID: {},
        tableRecords: [],
        selectedInstance: {},
        selectedSeries: {},
        selectedProtocol: {},
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
          series_meta: {
            label: []
          },
          attribute: {
            label: []
          }
        },
        labels: [],
        modelEntries: {
          value: {},
          candidates: [{
            name: 'attribute',
            label: 'Static Attribute'
          }, {
            name: 'series',
            label: 'Time Series'
          }, {
            name: 'relation',
            label: 'Relationship'
          }, {
            name: 'table',
            label: 'Table'
          }]
        },
        instanceEntries: {
          value: {},
          candidates: [{
            name: 'attribute',
            label: 'Static Attribute'
          }, {
            name: 'series',
            label: 'Time Series'
          }, {
            name: 'relation',
            label: 'Relationship'
          }, {
            name: 'table',
            label: 'Table'
          }, {
            name: 'pid',
            label: 'PID'
          }, {
            name: 'protocol',
            label: 'Protocol'
          }]
        },
        seriesMode: 'realtime',
        generalMode: 'detail',
        seriesData: {
          history: [],
          realtime: {}
        },
        pagination: {
          instances: {
            page: 1,
            pagination: 10,
            total: 1,
            totalPage: 1
          },
          table: {
            page: 1,
            pagination: 10,
            total: 1,
            totalPage: 1
          },
          series: {
            page: 1,
            pagination: 10,
            total: 1,
            totalPage: 1
          }
        },
        hierarchy: [],
        hierarchyMap: {},
        ModelGroupIcon,
        randomKey: '',
        defaultInterface: [{
          name: 'Attribute Data',
          protocol: 'HTTP',
          description: 'HTTP Interface to update attribute date'
        }, {
          name: 'Series Data',
          protocol: 'HTTP',
          description: 'HTTP Interface to upload series data'
        }],
        formData: {
          name: '',
          pid: ''
        },
        visible: false,
      }
    },
    watch: {
      seriesMode (newValue) {
        this.getSeriesValues()
      }
    },
    methods: {
      validate,
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
      formatValue (series, value) {
        if (series.dataType === 'Decimal') {
          value = parseFloat(value)
          if (series.precision || series.precision === 0) {
            value = parseFloat(value.toFixed(series.precision))
          }
        }
        return value
      },
      actionFinished (dialogId, success) {
        this.dialogVisibility[dialogId] = false
        if (success) {
          if (['addEditGroup', 'addEditModel'].includes(dialogId)) {
            this.getHierarchy()
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
          else if (dialogId === 'addEditInstance') {
            if (!this.selectedInstance.id) {
              this.getInstances(this.selectedModel.id)
            }
            else {
              this.getInstanceDetail(this.selectedInstance.id)
            }
          }
          else if (dialogId === 'addEditSeriesValue' || dialogId === 'importSeriesData') {
            this.getSeriesValues()
          }
          else if (dialogId === 'addEditProtocol') {
            this.getProtocols()
          }
          else if (dialogId === 'addInstanceRelation') {
            this.getInstanceRelations ()
          }
          else if (dialogId === 'addEditPID') {
            this.getInstancePIDs()
          }
        }
      },
      switchTab (tab) {
        if (tab.name === 'instance') {
          if (this.selectedModel.id) {
            this.getInstances(this.selectedModel.id)
          }
        }
        else {
          this.inspectInstance()
        }
      },
      verifyTarget (dragNode, dropNode, type) {
        return dropNode.data.type === 'ModelGroup' || type !== 'inner';
      },
      updatePosition (dragNode, dropNode, type) {
        let dragItem = this.hierarchyMap[dragNode.data.id]
        if (dragItem.type === 'ModelGroup') {
          updateModelGroup(dragItem.id, Object.assign({}, dragItem, {
            groupId: type === 'inner' ? dropNode.data.id : (dropNode.data.groupId || 'null')
          })).then(result => {
            this.getHierarchy()
          }).catch(err => {
            this.getHierarchy()
          })
        }
        else if (dragItem.type === 'Model') {
          updateModel(dragItem.id, Object.assign({}, dragItem, {
            groupId: type === 'inner' ? dropNode.data.id : (dropNode.data.groupId || 'null')
          })).then(result => {
            this.getHierarchy()
          }).catch(err => {
            this.getHierarchy()
          })
        }
      },
      flattenData (hierarchy) {
        let result = {}
        for(let i = 0; i < hierarchy.length; i++) {
          result[hierarchy[i].id] = hierarchy[i]
          if (hierarchy[i].children && hierarchy[i].children.length > 0) {
            Object.assign(result, this.flattenData(hierarchy[i].children))
          }
        }
        return result
      },
      getLabels () {
        getLabelList().then(result => {
          this.labels = result.data
        })
      },
      getHierarchy() {
        getModelList({ query: this.filters.model.value }).then(result => {
          this.hierarchy = result.data
          this.hierarchyMap = this.flattenData(this.hierarchy)
          if (this.selectedModel.id) {
            Object.assign(this.selectedModel, this.hierarchyMap[this.selectedModel.id])
          }
        })
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
      addGroup(groupId = null) {
        this.addEditGroupData = {
          groupId: groupId,
          name: '',
          rank: 1
        }
        this.dialogVisibility.addEditGroup = true
      },
      editGroup (groupId) {
        this.addEditGroupData = Object.assign({}, this.hierarchyMap[groupId])
        this.dialogVisibility.addEditGroup = true
      },
      deleteGroup (groupId) {
        let group = this.hierarchyMap[groupId]
        if (group.children && group.children.length > 0) {
          return this.$message({
            type: 'error',
            duration: 3000,
            showClose: true,
            message: 'Please delete attached model/group first!'
          })
        }
        this.$confirm('Action cannot be reversed, are you sure?', 'Warning', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deleteModelGroup(groupId).then(result => {
            this.$message({
              type: 'success',
              message: 'Group deleted successfully.',
              showClose: true
            })
            this.getHierarchy()
          })
        })
      },
      getAttributes() {
        getStaticAttributeList(this.selectedModel.id).then(result => {
          this.selectedModel.static_attributes = result.data
        })
      },
      addAttribute() {
        this.dialogVisibility.addEditAttribute = true
      },
      editAttribute (attribute) {
        this.addEditAttributeData = Object.assign({}, attribute)
        this.dialogVisibility.addEditAttribute = true
        this.dialogVisibility.addEditAttribute = true
      },
      deleteAttribute (attribute) {
        this.$confirm('Action cannot be reversed, are you sure?', 'Warning', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deleteStaticAttribute(this.selectedModel.id, attribute.id).then(result => {
            this.$message({
              type: 'success',
              message: 'Attribute deleted successfully.',
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
        this.addEditSeriesData = Object.assign({}, {})
        this.dialogVisibility.addEditSeries = true
      },
      editSeries (series) {
        this.addEditSeriesData = Object.assign({}, series)
        this.dialogVisibility.addEditSeries = true
      },
      deleteSeries (series) {
        this.$confirm('Action cannot be reversed, are you sure?', 'Warning', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deleteTimeSeries(this.selectedModel.id, series.id).then(result => {
            this.$message({
              type: 'success',
              message: 'Series deleted successfully.',
              showClose: true
            })
            this.getSeries()
          })
        })
      },
      getSeriesValues(page = 1) {
        if (this.seriesMode === 'history') {
          this.loading = true
          this.pagination.series.page = page
          getInstanceSeriesValueList (this.selectedInstance.id, this.pagination.series).then(result => {
            this.seriesData.history = result.data
            this.pagination.series = result.pagination
            this.loading = false
          })
        }
        else {
          this.pagination.series.page = 1
          Promise.all(this.selectedModel.time_series.map(series => getInstanceSingleSeriesValue(this.selectedInstance.id, series.id, { page: 1, pagination: 1 }))).then(result => {
            this.seriesData.realtime = result.map(item => item.data).reduce((res, records, index) => {
              let record = records[0]
              res[this.selectedModel.time_series[index].id] = record
              return res
            }, {})
          })
        }
      },
      showSeriesValues (series) {
        this.selectedSeries = series
        this.dialogVisibility.showSeriesData = true
      },
      importSeriesValues (series) {
        this.selectedSeries = series
        this.dialogVisibility.importSeriesData = true
      },
      addSeriesValue (series) {
        this.addEditSeriesValueData = {
          series: series
        }
        this.addEditSeriesValueData[series.id] = ''
        this.dialogVisibility.addEditSeriesValue = true
      },
      editSeriesValue (record) {
        this.addEditSeriesValueData = {
          id: [],
          time: new Date(record.time)
        }
        for(let seriesId in record.data) {
          this.addEditSeriesValueData[seriesId] = record.data[seriesId].value
          this.addEditSeriesValueData.id.push(record.data[seriesId].id)
        }
        this.dialogVisibility.addEditSeriesValue = true
      },
      deleteSeriesValue (record) {
        this.$confirm('Action cannot be reversed, are you sure?', 'Warning', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deleteInstanceSeriesValue(this.selectedInstance.id, { ids: Object.values(record.data).map(item => item.id) }).then(result => {
            this.$message({
              type: 'success',
              message: 'Record deleted successfully.',
              showClose: true
            })
            this.getSeriesValues()
          })
        })
      },
      formatTimeRange (span) {
        let yearFactor = 365 * 24 * 60 * 60
        let dayFactor = 24 * 60 * 60
        let hourFactor = 60 * 60
        let minuteFactor = 60
        let year = Math.floor(span / yearFactor)
        span -= year * yearFactor
        let day = Math.floor(span / dayFactor)
        span -= day * dayFactor
        let hour = Math.floor(span / hourFactor)
        span -= hour * hourFactor
        let min = Math.floor(span / minuteFactor)
        span -= min * minuteFactor
        return `${year ? `${year}year` : ''}${day ? `${day}day` : ''}${hour ? `${hour}h` : ''}${min ? `${min}min` : ''}${span ? `${span}s` : ''}`
      },
      getInstanceRelations () {
        getInstanceRelationList(this.selectedInstance.id).then(result => {
          this.selectedInstance.Parents = result.data.Parents || []
          this.selectedInstance.Children = result.data.Children || []
        })
      },
      getInstancePIDs () {
        getPIDList(this.selectedInstance.id).then(result => {
          this.selectedInstance.pids = result.data
          if (this.selectedPID) {
            let selection = result.data.find(item => item.id === this.selectedPID.id)
            if (selection) {
              this.selectPID(selection)
            }
            else {
              this.selectPID(result.data[0])
            }
          }
          else {
            this.selectPID(result.data[0])
          }
        })
      },
      getProtocols () {
        getInstanceProtocolList(this.selectedInstance.id).then(result => {
          this.selectedInstance.protocols = result.data
        })
      },
      addProtocol () {
        this.addEditProtocolData = {}
        this.dialogVisibility.addEditProtocol = true
      },
      editProtocol (protocol) {
        this.addEditProtocolData = JSON.parse(JSON.stringify(protocol))
        this.dialogVisibility.addEditProtocol = true
      },
      testProtocol (protocol) {
        this.selectedProtocol = protocol
        this.dialogVisibility.testProtocol = true
      },
      updateProtocolStatus (protocol) {
        updateInstanceProtocol(this.selectedInstance.id, protocol.id, protocol).then(result => {
          if (protocol.isActive) {
            this.$message({
              type: 'success',
              message: 'API activated successfully.',
              showClose: true
            })
          }
          else {
            this.$message({
              type: 'success',
              message: 'API shutdown successfully.',
              showClose: true
            })
          }
        }).catch(err => {
          protocol.isActive = !protocol.isActive
        })
      },
      viewProtocolDocument (protocol) {
        this.selectedProtocol = protocol
        this.dialogVisibility.showProtocolDoc = true
      },
      deleteProtocol (protocol) {
        this.$confirm('Action cannot be reversed, are you sure?', 'Warning', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deleteInstanceProtocol(this.selectedInstance.id, protocol.id).then(result => {
            this.$message({
              type: 'success',
              message: 'API deleted successfully.',
              showClose: true
            })
            this.getProtocols()
          })
        })
      },
      getRelations() {
        getModelRelationList(this.selectedModel.id).then(result => {
          this.selectedModel.Targets = result.data
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
        this.$confirm('Action cannot be reversed, are you sure?', 'Warning', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deleteModelRelation(this.selectedModel.id, target.model_relation.id).then(result => {
            this.$message({
              type: 'success',
              message: 'Relation deleted successfully.',
              showClose: true
            })
            this.getRelations()
          })
        })
      },
      selectModel (data) {
        let model = this.hierarchyMap[data.id]
        if (model.type === 'Model' && this.selectedModel.id !== data.id) {
          // 重置所有的Tab为默认状态
          // 二级Tab重置
          this.modelEntries.value = this.modelEntries.candidates[0]
          this.generalMode = 'detail'
          this.getModelDetail(data.id)
        }
      },
      switchModelDetail (entry) {
        this.modelEntries.value = entry
        if (this.modelEntries.value.name === 'table') {
          this.getModelTables()
        }
      },
      switchInstanceDetail (entry) {
        this.instanceEntries.value = entry
        if (entry.name === 'series') {
          this.getSeriesValues()
        }
        if (entry.name === 'table') {
          this.getModelTables()
        }
        if (entry.name === 'pid') {
          this.selectPID(this.selectedInstance.pids[0])
        }
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
      selectPID (pid) {
        this.selectedPID = pid
        if (pid) {
          this.$nextTick(() => {
            this.$refs.pid.children[0].setAttribute("width", '100%')
            this.$refs.pid.children[0].setAttribute("height", '100%')
          })
        }
      },
      selectTable (table) {
        getTableDetail(table.tableId).then(result => {
          this.selectedTable = result.data
          this.$nextTick(() => {
            this.refreshRecords()
          })
        })
      },
      refreshRecords (page) {
        if (page) {
          this.pagination.table.page = page
        }
        this.loading = true
        if (this.selectedInstance.id) {
          getRecordListFromInstance(this.selectedInstance.id, this.selectedTable.id, {}, this.pagination.table).then(result => {
            this.tableRecords = result.data
            this.pagination.table = result.pagination
            this.loading = true
          })
        }
        else {
          getRecordListFromModel(this.selectedModel.id, this.selectedTable.id, this.pagination.table).then(result => {
            this.tableRecords = result.data
            this.pagination.table = result.pagination
            this.loading = true
          })
        }
      },
      addTableRecord () {

      },
      addInstanceRelation () {
        this.dialogVisibility.addInstanceRelation = true
      },
      deleteInstanceRelation(target) {
        this.$confirm('Action cannot be reversed, are you sure?', 'Warning', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deleteInstanceRelation(this.selectedInstance.id, target.instance_relation.id).then(result => {
            this.$message({
              type: 'success',
              message: 'Relation deleted successfully.',
              showClose: true
            })
            this.getInstanceRelations()
          })
        })
      },
      getModelDetail (id) {
        getModelDetail(id).then(result => {
          this.selectedModel = result.data
          this.selectedModel.model_instances = []
          this.selectedModel.data_tables = []
          this.inspectInstance()
        })
      },
      addModel(groupId = null) {
        this.addEditModelData = {
          modelId: '',
          groupId: groupId,
          name: '',
          icon: ''
        }
        this.dialogVisibility.addEditModel = true
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
        this.addEditModelData = Object.assign({}, this.hierarchyMap[modelId])
        this.dialogVisibility.addEditModel = true
      },
      deleteModel (modelId) {
        this.$confirm('Action cannot be reversed, are you sure?', 'Warning', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deleteModel(modelId).then(result => {
            this.$message({
              type: 'success',
              message: 'Model deleted successfully.',
              showClose: true
            })
            this.getHierarchy()
          })
        })
      },
      getInstances (modelId, refresh = false) {
        if (refresh) {
          this.pagination.instances.page = 1
        }
        getModelInstanceList(modelId, Object.assign({ query: this.filters.instance.value }, this.pagination.instances)).then(result => {
          this.selectedModel.model_instances = result.data
          this.pagination.instances = result.pagination
          this.randomKey = Math.random()
        })
      },
      getInstanceDetail (instanceId) {
        getModelInstanceDetail(instanceId).then(result => {
          this.selectedInstance = result.data
          this.selectedInstance.attribute_values = this.selectedInstance.attribute_values.reduce((result, item) => {
            result[item.attributeId] = {
              value: item.value,
              editing: false
            }
            return result
          }, {})
          let attributes = this.selectedModel.static_attributes
          for(let i = 0; i < attributes.length; i++) {
            if (!this.selectedInstance.attribute_values[attributes[i].id]) {
              this.selectedInstance.attribute_values[attributes[i].id] = {
                value: '',
                editing: false,
                attribute: attributes[i]
              }
            }
            else {
              this.selectedInstance.attribute_values[attributes[i].id].attribute = attributes[i]
            }
          }
          this.selectedInstance.attribute_values = attributes.map(item => this.selectedInstance.attribute_values[item.id])
        })
      },
      switchInstanceStatus(status) {
        updateModelInstance(this.selectedModel.id, this.selectedInstance.id, this.selectedInstance).then(result => {
          this.$message({
            type: 'success',
            message: 'Instance status changed successfully.',
            showClose: true
          })
        })
      },
      downloadInstances (modelId) {
        downloadModelInstanceList(modelId, Object.assign({ query: this.filters.instance.value }, this.pagination.instances)).then(result => {
          downloadFile(`Instances - ${this.selectedModel.name}.xlsx`, result.data)
        })
      },
      inspectInstance (instance = {}) {
        if (instance.id) {
          this.getInstanceDetail(instance.id)
          this.instanceEntries.value = this.instanceEntries.candidates[0]
        }
        else {
          this.selectedInstance = instance
        }
      },
      addInstance () {
        this.addEditInstanceData = {
          modelId: this.selectedModel.id,
          name: '',
          instanceId: ''
        }
        this.dialogVisibility.addEditInstance = true
      },
      editInstance (instance) {
        this.addEditInstanceData = Object.assign({}, instance)
        this.dialogVisibility.addEditInstance = true
      },
      deleteInstance (instance) {
        this.$confirm('Action cannot be reversed, are you sure?', 'Warning', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deleteModelInstance(this.selectedModel.id, instance.id).then(result => {
            this.$message({
              type: 'success',
              message: 'Instance deleted successfully.',
              showClose: true
            })
            this.getInstances(this.selectedModel.id)
          })
        })
      },
      getAttributeValueRowKey (row) {
        return Math.random()
      },
      enableInstanceAttributeEditor (record) {
        record.editing = true
      },
      saveInstanceAttributeValue (record) {
        updateInstanceAttribute(this.selectedInstance.id, record.attribute.id, {
          value: record.value
        }).then(result => {
          record.editing = false
        })
      },
      addPID () {
        this.addEditPIDData = { name: '', pid: '' }
        this.dialogVisibility.addEditPID = true
      },
      editPID (pid) {
        this.addEditPIDData = Object.assign({}, pid)
        this.dialogVisibility.addEditPID = true
      },
      deletePID (pid) {
        this.$confirm('Action cannot be reversed, are you sure?', 'Warning', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deletePID(this.selectedInstance.id, pid.id).then(result => {
            this.$message({
              type: 'success',
              message: 'PID deleted successfully.',
              showClose: true
            })
            this.getInstancePIDs()
          })
        })
      }
    },
    created() {
      this.getLabels()
      this.getHierarchy()
    }
  }
</script>

<style lang="scss" scoped>
  .noc-m-t-15 {
    margin-top: 15px;
  }

  .noc-vgis-model-list {
    background: white;
    margin-right: 16px;
    width: 307px;
    flex-shrink: 0;
  }

  .noc-vgis-model-detail {
    padding: 16px;
    background: white;
    width: calc(100% - 307px - 48px);
    margin-right: 16px;
  }

  .noc-vgis-hierarchy-item {
    width: 100%;
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

  .noc-vgis-series-card {
    padding: 16px;
    background: #FFFFFF;
    border: 1px solid #4FACFF;
    box-sizing: border-box;
    border-radius: 4px;

    .noc-vgis-series-time {
      font-family: 'HarmonyOS Sans';
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 16px;
      color: #000000;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .noc-vgis-series-name {
      font-family: 'HarmonyOS Sans';
      font-style: normal;
      font-weight: 700;
      font-size: 14px;
      line-height: 16px;
      color: #000000;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex-grow: 1;
    }

    .noc-vgis-series-value {
      font-family: 'HarmonyOS Sans';
      font-style: normal;
      font-weight: 700;
      font-size: 14px;
      line-height: 16px;
      color: #000000;
      text-overflow: ellipsis;
      white-space: nowrap;
      min-width: 50px;
    }
  }
</style>
