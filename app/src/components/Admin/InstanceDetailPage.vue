<template>
    <div v-if="selectedInstance.id" class="full-h">
        <div class="flex align-items-center justify-content-between">
            <div style="flex-grow: 1;" class="flex align-items-center justify-content-start">
                <el-button plain type="primary" size="mini" class="p-l-7 p-r-7 m-r-10 el-icon-arrow-left"
                           @click="$router.replace({ name: 'InstanceListPage', params: { modelId: model.id } })"></el-button>
                <el-image class="noc-vgis-hierarchy-icon-lg" :src="model.icon"></el-image>
                <div>
                    <div class="noc-vgis-instance-title"
                         v-html="$t('label.instance.info', { id: selectedInstance.instanceId, name: selectedInstance.name })"></div>
                    <div class="noc-vgis-instance-subtitle">
                        {{ $t('label.instance.model', {id: model.modelId, name: model.name}) }}
                    </div>
                    <div class="noc-vgis-instance-subtitle">
                        {{ $t("label.model.label") }}:
                        {{ !selectedInstance.labels || selectedInstance.labels.length === 0 ? $t("label.basic.none") : "" }}
                        <el-tag effect="dark" size="mini" v-for="label in selectedInstance.labels" :key="label.id"
                                class="m-r-5">{{ label.name }}
                        </el-tag>
                    </div>
                </div>
            </div>
            <el-switch v-auth="{ resources: 'Model Instance', action: 'Admin' }" class="m-r-10"
                       v-model="selectedInstance.published" :active-text="$t('form.instance.published.label')"
                       inactive-text="" @change="switchInstanceStatus"></el-switch>
            <el-button v-auth="{ resources: 'Model Instance', action: 'Admin' }" plain type="primary"
                       class="el-icon-edit-outline" @click="editInstance(selectedInstance)"> {{ $t("action.edit") }}
            </el-button>
        </div>
        <div class="noc-vgis-model-detail-tabs">
            <div class="noc-vgis-model-detail-tabs-entries">
                <div :class="{active: entry.name === instanceEntries.value.name}" @click="switchInstanceDetail(entry)"
                     v-for="entry in instanceEntries.candidates" :key="entry.name">{{ entry.label }}
                </div>
                <div v-if="selectedInstance.threeDViewPoint && Object.keys(selectedInstance.threeDViewPoint).length > 0"
                     :class="{active: 'view' === instanceEntries.value.name}"
                     @click="switchInstanceDetail({ name: 'view', label: $t('label.instance.view') })"
                     :key="$t('label.instance.view')">{{ $t("label.instance.view") }}
                </div>
            </div>
            <div class="noc-vgis-model-detail-tabs-actions">
                <el-select v-model="filters.attribute.label" multiple v-if="instanceEntries.value.name === 'attribute'">
                    <el-option v-for="label in labels" :key="label.id" :value="label.id"
                               :label="label.name"></el-option>
                </el-select>
                <el-select v-model="filters.series.label" multiple v-if="instanceEntries.value.name === 'series'">
                    <el-option v-for="label in labels" :key="label.id" :value="label.id"
                               :label="label.name"></el-option>
                </el-select>
                <button v-auth="{ resources: 'Model Instance', action: 'Admin' }" class="el-icon-plus"
                        v-if="instanceEntries.value.name === 'series'" @click="addSeriesValue">{{ $t("action.add") }}
                </button>
                <button v-auth="{ resources: 'Model Instance', action: 'Admin' }" class="el-icon-plus"
                        v-if="instanceEntries.value.name === 'document'" @click="addDocument">{{ $t("action.add") }}
                </button>
                <button v-auth="{ resources: 'Model Instance', action: 'Admin' }" class="el-icon-refresh"
                        v-if="instanceEntries.value.name === 'series'" @click="getSeriesValues()"></button>
                <button v-auth="{ resources: 'Model Instance', action: 'Admin' }" class="el-icon-refresh"
                        v-if="instanceEntries.value.name === 'attribute'"
                        @click="getInstanceDetail(selectedInstance.id)"></button>
                <button :class="['el-icon-notebook-1', { active: seriesMode === 'history' }]"
                        v-if="instanceEntries.value.name === 'series'" @click="seriesMode = 'history'"></button>
                <button :class="['el-icon-s-grid', { active: seriesMode === 'realtime' }]"
                        v-if="instanceEntries.value.name === 'series'" @click="seriesMode = 'realtime'"></button>
                <button v-auth="{ resources: 'Model Instance', action: 'Admin' }" class="el-icon-plus"
                        v-if="instanceEntries.value.name === 'relation'" @click="addInstanceRelation">
                    {{ $t("action.add") }}
                </button>
                <button v-auth="{ resources: 'Model Instance', action: 'Admin' }" class="el-icon-plus"
                        v-if="instanceEntries.value.name === 'protocol'" @click="addProtocol">{{ $t("action.add") }}
                </button>
                <button v-auth="{ resources: 'Model Instance', action: 'Admin' }" class="el-icon-plus"
                        v-if="instanceEntries.value.name === 'rule'" @click="addRuleChain">{{ $t("action.add") }}
                </button>
                <input v-auth="{ resources: 'Model Instance', action: 'Admin' }" type="file" ref="file-selector" style="display: none;" @change="uploadDocument"/>
            </div>
        </div>
        <el-table v-loading="loading.attribute" v-if="instanceEntries.value.name === 'attribute'"
                  header-cell-class-name="table-header-cell" cell-class-name="table-cell"
                  :data="selectedInstance.attribute_values.filter(value => matchLabels(value.attribute.labels, filters.attribute.label))">
            <el-table-column :label="$t('label.data.name')" prop="attribute.name"></el-table-column>
            <el-table-column :label="$t('label.data.label')">
                <template slot-scope="{ row }">
                    <el-tag class="m-l-5 m-r-5 m-b-5" size="small" v-for="tag in row.attribute.labels" :key="tag.id"
                            type="primary">{{ tag.name }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column :label="$t('label.data.value')">
                <template slot-scope="{ row }">
                    <div v-if="!row.editing">
                        <div v-if="row.attribute.dataType === 'Date'">{{ new Date(row.value).format('yyyy/MM/dd') }}
                        </div>
                        <div v-else-if="row.attribute.dataType === 'DateTime'">
                            {{ new Date(row.value).format('yyyy/MM/dd hh:mm:ss') }}
                        </div>
                        <div v-else-if="row.attribute.dataType === 'Time'">
                            {{ new Date(row.value).format('hh:mm:ss') }}
                        </div>
                        <div v-else-if="row.attribute.dataType === 'Integer'">
                            {{ parseInt(row.value) }}{{ row.attribute.unit ? row.attribute.unit.name : '' }}
                        </div>
                        <div v-else-if="row.attribute.dataType === 'Decimal'">
                            {{ parseFloat(row.value).toFixed(row.attribute.precision) }}{{
                            row.attribute.unit ? row.attribute.unit.name : ''
                            }}
                        </div>
                        <div v-else-if="row.attribute.dataType === 'Boolean'">{{
                            row.value === 'true' ? 'Yes' : 'No'
                            }}
                        </div>
                        <div v-else>{{ row.value }}</div>
                    </div>
                    <div v-else>
                        <el-input size="mini" v-model="row.value" v-if="row.attribute.dataType === 'String'"></el-input>
                        <el-input size="mini" v-model="row.value" type="textarea" rows="4"
                                  v-if="row.attribute.dataType === 'Text'"></el-input>
                        <el-input size="mini" v-model="row.value" :min="row.attribute.min" :max="row.attribute.max"
                                  type="number" v-if="row.attribute.dataType === 'Integer'"></el-input>
                        <el-input size="mini" v-model="row.value" :min="row.attribute.min" :max="row.attribute.max"
                                  type="number" v-if="row.attribute.dataType === 'Decimal'"></el-input>
                        <el-select size="mini" v-model="row.value" class="full-w"
                                   v-if="row.attribute.dataType === 'Enum'">
                            <el-option v-for="value in row.attribute.candidate" :key="value" :label="value"
                                       :value="value"></el-option>
                        </el-select>
                        <el-select size="mini" v-model="row.value" class="full-w"
                                   v-if="row.attribute.dataType === 'Boolean'">
                            <el-option :value="true" label="Yes"></el-option>
                            <el-option :value="false" label="No"></el-option>
                        </el-select>
                        <el-date-picker size="mini" class="full-w" v-model="row.value" type="datetime"
                                        v-if="row.attribute.dataType === 'DateTime'"></el-date-picker>
                        <el-date-picker size="mini" class="full-w" v-model="row.value" type="date"
                                        v-if="row.attribute.dataType === 'Date'"></el-date-picker>
                        <el-time-picker size="mini" class="full-w" v-model="row.value"
                                        v-if="row.attribute.dataType === 'Time'"></el-time-picker>
                    </div>
                </template>
            </el-table-column>
            <el-table-column :label="$t('label.data.description')" prop="description"></el-table-column>
            <el-table-column :label="$t('label.basic.action')"
                             v-if="validate($store.state.user, { resources: 'Model Instance', action: 'Admin' })">
                <template slot-scope="{ row }">
                    <el-button v-if="!row.editing" type="primary" plain icon="el-icon-edit" size="mini"
                               @click="enableInstanceAttributeEditor(row)">{{ $t("action.edit") }}
                    </el-button>
                    <el-button v-else type="primary" plain icon="el-icon-check" size="mini"
                               @click="saveInstanceAttributeValue(row)">{{ $t("action.confirm") }}
                    </el-button>
                    <el-button type="danger" plain icon="el-icon-delete" size="mini"
                               @click="deleteInstanceAttributeValue(row)">{{ $t("action.delete") }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-divider
                v-if="instanceEntries.value.name === 'series' && seriesMode === 'history' && model.time_series.length > 0"
                direction="horizontal" class="m-t-0 m-b-0"></el-divider>
        <div class="noc-vgis-model-detail-tabs m-t-0"
             v-if="instanceEntries.value.name === 'series' && seriesMode === 'history' && model.time_series.length > 0">
            <div class="noc-vgis-model-detail-tabs-entries">
                {{ $t('label.instance.columnFilter') }}
                <el-popover>
                    <div class="m-b-5">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="allSelected" @change="selectAll">{{
                            $t("label.instance.allColumn", {
                              count: seriesSelection.length,
                              total: model.time_series.length
                            })
                            }}
                        </el-checkbox>
                    </div>
                    <el-divider class="m-t-5 m-b-5"></el-divider>
                    <el-scrollbar tag="div" style="max-height: 400px; overflow-y: scroll;">
                        <el-checkbox-group v-model="seriesSelection" @change="selectSeries">
                            <div v-for="series in model.time_series" :key="series.id" class="m-t-5 m-b-5">
                                <el-checkbox :label="series.id" :value="series.id">
                                    {{ series.name }}{{ series.unit ? ` (${series.unit.name})` : '' }}
                                </el-checkbox>
                            </div>
                        </el-checkbox-group>
                    </el-scrollbar>
                    <el-button slot="reference" type="primary" size="mini"
                               class="p-5 iconfont icon-filter m-l-10"></el-button>
                </el-popover>
            </div>
        </div>
        <el-table v-loading="loading.series" class="full-w"
                  v-if="instanceEntries.value.name === 'series' && seriesMode === 'history'"
                  header-cell-class-name="table-header-cell" cell-class-name="table-cell" :data="seriesData.history">
            <el-table-column label="Time" fixed>
                <template slot-scope="{ row }">
                    {{ new Date(row.time).format('yyyy/MM/dd hh:mm:ss') }}
                </template>
            </el-table-column>
            <el-table-column :key="series.id" :label="`${series.name}${series.unit ? ` (${series.unit.name})` : ''}`"
                             v-for="series in model.time_series"
                             v-if="matchLabels(series.labels, filters.series.label) && seriesSelection.includes(series.id)">
                <template slot-scope="{ row }">
                    <div v-if="row.data[series.id]">{{
                        series.dataType === 'Decimal' && (series.precision || series.precision === 0) ? parseFloat(parseFloat(row.data[series.id].value).toFixed(series.precision)) : row.data[series.id].value
                        }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column fixed="right" :label="$t('label.basic.action')"
                             v-if="validate($store.state.user, { resources: 'Model Instance', action: 'Admin' })">
                <template slot-scope="{ row }">
                    <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="editSeriesValue(row)">
                        {{ $t("action.edit") }}
                    </el-button>
                    <el-button type="danger" plain icon="el-icon-check" size="mini" @click="deleteSeriesValue(row)">
                        {{ $t("action.delete") }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-if="instanceEntries.value.name === 'series' && seriesMode === 'history'"
             class="m-t-20 m-b-20 text-center">
            <el-pagination hide-on-single-page :current-page="pagination.series.page"
                           :page-count="pagination.series.totalPage" @current-change="getSeriesValues"></el-pagination>
        </div>
        <el-row class="m-t-15" v-else-if="instanceEntries.value.name === 'series' && seriesMode === 'realtime'"
                :gutter="15">
            <el-col :span="4" v-for="series in model.time_series" :key="series.id" class="m-b-15"
                    v-if="matchLabels(series.labels, filters.series.label)">
                <div class="noc-vgis-series-card">
                    <div class="noc-vgis-series-time flex align-items-center justify-content-between">
                        {{
                        seriesData.realtime[series.id] ? new Date(seriesData.realtime[series.id].time).format('yyyy/MM/dd hh:mm:ss') : 'Unknown'
                        }}
                        <el-button v-if="!series.isVirtual"
                                   v-auth="{ resources: 'Model Instance', action: 'Admin' }" plain class="el-icon-plus"
                                   type="primary" size="mini" @click="addSeriesValue(series)"></el-button>
                    </div>
                    <div class="flex align-items-center m-t-15">
                        <div class="noc-vgis-series-name">{{ series.name }}</div>
                    </div>
                    <div class="flex align-items-center m-t-15">
                        <div class="noc-vgis-series-value">
                            {{
                            seriesData.realtime[series.id] ? formatValue(series, seriesData.realtime[series.id].value) : "?"
                            }}
                            {{ series.unit ? series.unit.name : '' }}
                        </div>
                    </div>
                    <div class="m-t-15">
                        <el-button plain type="primary" style="width: 100%;" @click="showSeriesValues(series)">
                            {{ $t("label.instance.history") }}
                        </el-button>
                    </div>
                    <div class="m-t-15" v-auth="{ resources: 'Model Instance', action: 'Admin' }">
                        <el-button v-if="!series.isVirtual" plain type="primary" style="width: 100%;"
                                   @click="importSeriesValues(series)">{{ $t("action.import") }}
                        </el-button>
                        <el-button v-else plain type="primary" style="width: 100%;"
                                   @click="customizeCalculation(series)">{{ $t("action.configure") }}
                        </el-button>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-table v-if="instanceEntries.value.name === 'relation'" header-cell-class-name="table-header-cell"
                  cell-class-name="table-cell" :data="selectedInstance.Parents.concat(selectedInstance.Children)">
            <el-table-column :label="$t('model.instanceRelation.source')">
                <template slot-scope="{ row }">
                    {{ selectedInstance.name }}
                </template>
            </el-table-column>
            <el-table-column :label="$t('model.instanceRelation.type')">
                <template slot-scope="{ row }">
                    {{ row.instance_relation.childId === selectedInstance.id ? 'Belong To' : 'Contain' }}
                </template>
            </el-table-column>
            <el-table-column :label="$t('model.instanceRelation.target')">
                <template slot-scope="{ row }">
                    {{ row.name }}
                </template>
            </el-table-column>
            <el-table-column :label="$t('label.basic.action')"
                             v-if="validate($store.state.user, { resources: 'Model Instance', action: 'Admin' })">
                <template slot-scope="{ row }">
                    <el-button plain type="danger" size="mini" icon="el-icon-delete"
                               @click="deleteInstanceRelation(row)">{{ $t("action.delete") }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-table v-if="instanceEntries.value.name === 'alert'" header-cell-class-name="table-header-cell"
                  cell-class-name="table-cell" :data="alerts">
            <el-table-column :label="$t('label.alert.name')">
                <template slot-scope="{ row }">
                    {{ row.name }}
                </template>
            </el-table-column>
            <el-table-column :label="$t('label.alert.level')">
                <template slot-scope="{ row }">
                    {{ row.level }}
                </template>
            </el-table-column>
            <el-table-column :label="$t('label.alert.time')">
                <template slot-scope="{ row }">
                    {{ new Date(row.createdAt).format('yyyy-MM-dd hh:mm:ss') }}
                </template>
            </el-table-column>
            <el-table-column :label="$t('label.alert.status')">
                <template slot-scope="{ row }">
                    <div v-if="row.checked" class="text-success el-icon-circle-check">
                        {{ $t('dict.alert.status.checked') }}
                    </div>
                    <div v-else class="text-danger el-icon-question"> {{ $t('dict.alert.status.active') }}</div>
                </template>
            </el-table-column>
            <el-table-column :label="$t('label.alert.subject')">
                <template slot-scope="{ row }">
                    {{ row.subject }}
                </template>
            </el-table-column>
            <el-table-column :label="$t('label.basic.action')"
                             v-if="validate($store.state.user, { resources: 'Model Instance', action: 'Admin' })">
                <template slot-scope="{ row }">
                    <el-button v-if="!row.checked" plain type="danger" size="mini" icon="el-icon-circle-check"
                               @click="checkAlert(row)">{{ $t("action.alert.check") }}
                    </el-button>
                    <div class="text-info" v-else>—</div>
                </template>
            </el-table-column>
        </el-table>
        <el-divider v-if="instanceEntries.value.name === 'table'" direction="horizontal"
                    class="m-t-0 m-b-0"></el-divider>
        <div class="noc-vgis-model-detail-tabs m-t-0" v-if="instanceEntries.value.name === 'table'">
            <div class="noc-vgis-model-detail-tabs-entries">
                <div :class="{active: table.tableId === selectedTable.id }" v-for="table in model.data_tables"
                     :key="table.tableId" @click="selectTable(table)">{{ table.tableName }}
                </div>
            </div>
        </div>
        <el-table :data="tableRecords" header-cell-class-name="table-header-cell" cell-class-name="table-cell"
                  v-if="instanceEntries.value.name === 'table' && selectedTable.id" @sort-change="updateOrder">
            <el-table-column
                    show-overflow-tooltip
                    v-for="field in selectedTable.table_fields"
                    :sortable="field.sortable"
                    :key="field.id"
                    :column-key="field.id"
                    :prop="field.id"
                    :label="field.name">
                <template slot-scope="{ row }">
                    {{ row.field_values[field.id] ? row.field_values[field.id].value : '' }}
                </template>
            </el-table-column>
        </el-table>
        <div class="text-center m-t-20" v-if="instanceEntries.value.name === 'table' && selectedTable.id">
            <el-pagination hide-on-single-page :current-page="pagination.table.page"
                           :page-count="pagination.table.totalPage" @current-change="refreshRecords"></el-pagination>
        </div>
        <div class="noc-m-t-15" v-if="instanceEntries.value.name === 'protocol'">
            <el-table :data="selectedInstance.protocols.filter(item => !item.isInterface)"
                      header-cell-class-name="table-header-cell" cell-class-name="table-cell" class="m-b-40">
                <el-table-column :label="$t('model.protocol.name')" prop="name"></el-table-column>
                <el-table-column :label="$t('model.protocol.protocol')" prop="protocolType"></el-table-column>
                <el-table-column :label="$t('model.protocol.interval')">
                    <template slot-scope="{ row }">
                        {{ formatTimeRange(row.sampleInterval) }}
                    </template>
                </el-table-column>
                <el-table-column :label="$t('model.protocol.status')">
                    <template slot-scope="{ row }">
                        <el-switch v-model="row.isActive" @change="updateProtocolStatus(row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('model.protocol.chains')" align="center">
                    <template slot-scope="{ row }">
                        <div v-for="chain in row.chains" :key="chain.id">
                            <el-tag size="small" class="text-link pointer m-b-5">
                                {{ chain.name }}
                                <el-button type="text" class="text-danger el-icon-delete p-t-0 p-b-0"
                                           @click.prevent="unbindRuleChain(chain, row)"></el-button>
                            </el-tag>
                        </div>
                        <div class="text-center">
                            <el-popover v-model="row.bindChain" @show="bindRuleChain(row)"
                                        v-auth="{ resources: 'Model Instance', action: 'Admin' }">
                                <el-select size="mini" v-model="addEditRuleChainData">
                                    <el-option v-for="chain in ruleChains" :value="chain.id" :label="chain.name"
                                               :key="chain.id">
                                        <span>{{ chain.name }}</span>
                                        <span class="pull-right"
                                              v-if="chain.modelId">{{ $t('label.ruleChain.model') }}</span>
                                    </el-option>
                                </el-select>
                                <el-button size="mini" @click="bindRuleChainWithProtocol(row)">
                                    {{ $t("action.submit") }}
                                </el-button>
                                <el-button slot="reference" icon="el-icon-plus" circle size="mini"></el-button>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('model.protocol.description')" prop="description"></el-table-column>
                <el-table-column width="280px" :label="$t('label.basic.action')">
                    <template slot-scope="{ row }">
                        <el-button v-auth="{ resources: 'Model Instance', action: 'Admin' }" plain type="primary"
                                   size="mini" icon="el-icon-edit" class="m-r-5" @click="editProtocol(row)">
                            {{ $t("action.edit") }}
                        </el-button>
                        <el-button plain type="primary" size="mini" icon="el-icon-connection"
                                   @click="testProtocol(row)">{{ $t("action.test") }}
                        </el-button>
                        <el-button v-auth="{ resources: 'Model Instance', action: 'Admin' }" plain type="danger"
                                   size="mini" icon="el-icon-delete" @click="deleteProtocol(row)">
                            {{ $t("action.delete") }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="noc-vgis-model-title m-l-0">{{ $t('label.protocol.interface') }}</div>
            <el-table header-cell-class-name="table-header-cell" cell-class-name="table-cell"
                      :data="selectedInstance.protocols.filter(item => item.isInterface)">
                <el-table-column :label="$t('model.protocol.name')" prop="name"></el-table-column>
                <el-table-column :label="$t('model.protocol.protocol')" prop="protocolType"></el-table-column>
                <el-table-column :label="$t('model.protocol.status')">
                    <template slot-scope="{ row }">
                        <el-switch v-model="row.isActive" @change="updateProtocolStatus(row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('model.protocol.chains')" align="center">
                    <template slot-scope="{ row }">
                        <div v-for="chain in row.chains" :key="chain.id">
                            <el-tag size="small" class="text-link pointer m-b-5">
                                {{ chain.name }}
                                <el-button type="text" class="text-danger el-icon-delete p-t-0 p-b-0"
                                           @click.prevent="unbindRuleChain(chain, row)"></el-button>
                            </el-tag>
                        </div>
                        <div class="text-center">
                            <el-popover v-model="row.bindChain" @show="bindRuleChain(row)"
                                        v-auth="{ resources: 'Model Instance', action: 'Admin' }">
                                <el-select size="mini" v-model="addEditRuleChainData">
                                    <el-option v-for="chain in ruleChains" :value="chain.id" :label="chain.name"
                                               :key="chain.id">
                                        <span>{{ chain.name }}</span>
                                        <span class="pull-right"
                                              v-if="chain.modelId">{{ $t('label.ruleChain.model') }}</span>
                                    </el-option>
                                </el-select>
                                <el-button size="mini" @click="bindRuleChainWithProtocol(row)">
                                    {{ $t("action.submit") }}
                                </el-button>
                                <el-button slot="reference" icon="el-icon-plus" circle size="mini"></el-button>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('model.protocol.description')" prop="description"></el-table-column>
                <el-table-column :label="$t('label.basic.action')">
                    <template slot-scope="{ row }">
                        <el-button v-auth="{ resources: 'Model Instance', action: 'Admin' }" plain type="primary"
                                   size="mini" icon="el-icon-edit" class="m-r-5" @click="editProtocol(row)">
                            {{ $t("action.edit") }}
                        </el-button>
                        <el-button plain type="primary" size="mini" icon="el-icon-files"
                                   @click="viewProtocolDocument(row)">{{ $t("label.protocol.document") }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="noc-m-t-15" v-if="instanceEntries.value.name === 'view'">
            <view-point-viewer :tag="selectedInstance.instanceId" style="height: 900px;"
                               v-model="selectedInstance.threeDViewPoint"></view-point-viewer>
        </div>
        <div class="noc-vgis-model-detail-tabs m-t-0"
             v-if="instanceEntries.value.name === 'pid' && selectedInstance.pids.length > 0">
            <div class="noc-vgis-model-detail-tabs-entries">
                <div :class="{active: pid.id === selectedPID.id }" v-for="pid in selectedInstance.pids" :key="pid.id"
                     @click="selectPID(pid)">
                    {{ pid.name }}
                    <i class="el-icon-edit pointer" v-auth="{ resources: 'Model Instance', action: 'Admin' }"
                       @click="editPID(pid)"></i>
                    <i class="el-icon-delete text-danger pointer"
                       v-auth="{ resources: 'Model Instance', action: 'Admin' }" @click="deletePID(pid)"></i>
                </div>
                <div class="pull-right el-icon-plus" @click="addPID"></div>
            </div>
        </div>
        <div v-if="instanceEntries.value.name === 'pid' && selectedInstance.pids.length > 0"
             style="display: flex;justify-content: space-between;padding: 20px 0">
            <div class="pidtitle">{{ $t("action.preview") }}</div>
            <div>
                <div class="el-icon-edit-outline iconButton pointer" @click="goPidEdit"></div>
            </div>
        </div>
        <div style="height: 550px" class="noc-m-t-15 p-10"
             v-if="instanceEntries.value.name === 'pid' && selectedInstance.pids.length > 0">
            <DynamicPIDPanel v-if="selectedPID.id" key="svgPid" ref="pid" :map-name="selectedPID.name"
                             :instanceId="selectedInstance.instanceId" :dynamic="true"></DynamicPIDPanel>
        </div>
        <div style="height: 400px;" v-else-if="instanceEntries.value.name === 'pid'"
             class="noc-m-t-15 flex align-items-center justify-content-center text-info">
            <div>
                <div class="text-center" v-html="$t('message.pid.empty')"></div>
                <div class="text-center m-t-15">
                    <el-button slot="reference" type="primary" size="small" plain icon="el-icon-upload2"
                               @click="addPID">{{ $t("action.upload") }}
                    </el-button>
                </div>
            </div>
        </div>
        <el-row class="m-t-15" v-else-if="instanceEntries.value.name === 'rule' && !selectedChain.id" :gutter="15">
            <div v-if="ruleChains.length === 0" style="height: 300px;"
                 class="flex justify-content-center align-items-center text-info text-regular">
                {{ $t("message.ruleChain.empty") }}
            </div>
            <el-col v-else :span="4" v-for="chain in ruleChains" :key="chain.id" class="m-b-15">
                <div class="noc-vgis-chain-card">
                    <h3 class="text-bold p-l-15 p-r-15 p-t-15">
                        <el-tag size="small" effect="dark" v-if="chain.modelId">{{ $t('label.ruleChain.model') }}
                        </el-tag>
                        {{ chain.name }}
                    </h3>
                    <p class="m-t-15 text-info p-l-15 p-r-15">
                        {{ chain.description }}
                    </p>
                    <div class="m-t-15 full-w flex">
                        <div class="action text-primary" :title="$t('action.edit')" @click="editRuleChain(chain)"
                             v-if="!chain.modelId">
                            <i class="el-icon-edit"></i>
                        </div>
                        <div class="action text-primary" :title="$t('action.view')" @click="viewRuleChain(chain)">
                            <i class="el-icon-view"></i>
                        </div>
                        <div class="action text-danger" :title="$t('action.delete')" @click="deleteRuleChain(chain)"
                             v-if="!chain.modelId">
                            <i class="el-icon-delete"></i>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row class="m-t-15 full-w" style="height: calc(100% - 174px)"
                v-else-if="instanceEntries.value.name === 'rule' && selectedChain.id" :gutter="15">
            <rule-chain-editor :editable="!selectedChain.modelId" :chain-id="selectedChain.id"
                               @cancel="selectedChain = {}" @finished="getRuleChains"></rule-chain-editor>
        </el-row>
        <el-row v-if="instanceEntries.value.name === 'document'">
            <div v-if="documents.length === 0" style="height: 300px;" class="flex justify-content-center align-items-center text-info text-regular">
                {{$t("message.media.empty")}}
            </div>
            <div class="noc-vgis-model-detail-tabs" v-if="documents.filter(item => item.modelId).length > 0">{{$t("label.media.shared")}}</div>
            <el-row :gutter="20" v-if="documents.filter(item => item.modelId).length > 0">
                <el-col :span="6" v-for="file in documents.filter(item => item.modelId)" class="m-t-20">
                    <el-card class="pointer" shadow="hover">
                        <div class="file-icon">
                            <i class="el-icon-document"></i>
                        </div>
                        <a class="file-name" :title="file.name">{{file.name}}</a>
                        <div class="text-center">
                            <el-button type="text" class="p-b-0" icon="el-icon-download" @click="downloadFile(file)">{{$t('action.download')}}</el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <div class="noc-vgis-model-detail-tabs" v-if="documents.filter(item => !item.modelId).length > 0">{{$t("label.media.custom")}}</div>
            <el-row :gutter="20" v-if="documents.filter(item => !item.modelId).length > 0">
                <el-col :span="6" v-for="file in documents.filter(item => !item.modelId)" class="m-t-20">
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
        </el-row>
        <add-edit-instance v-auth="{ resources: 'Model Instance', action: 'Admin' }"
                           v-if="dialogVisibility.addEditInstance" :model="model" :instance="addEditInstanceData"
                           dialog-id="addEditInstance" :dialog-visibility="dialogVisibility.addEditInstance"
                           @action-finished="actionFinished"></add-edit-instance>
        <add-edit-p-i-d v-auth="{ resources: 'Model Instance', action: 'Admin' }" v-if="dialogVisibility.addEditPID"
                        :instance="selectedInstance" :pid="addEditPIDData" dialog-id="addEditPID"
                        :dialog-visibility="dialogVisibility.addEditPID"
                        @action-finished="actionFinished"></add-edit-p-i-d>
        <add-edit-series-value v-auth="{ resources: 'Model Instance', action: 'Admin' }"
                               v-if="dialogVisibility.addEditSeriesValue" :model="model" :instance="selectedInstance"
                               :record="addEditSeriesValueData" :series="addEditSeriesValueData.series"
                               dialog-id="addEditSeriesValue" :dialog-visibility="dialogVisibility.addEditSeriesValue"
                               @action-finished="actionFinished"></add-edit-series-value>
        <show-series-data v-if="dialogVisibility.showSeriesData" :model="model" :instance="selectedInstance"
                          :series="selectedSeries" dialog-id="showSeriesData"
                          :dialog-visibility="dialogVisibility.showSeriesData"
                          @action-finished="actionFinished"></show-series-data>
        <import-series-data v-auth="{ resources: 'Model Instance', action: 'Admin' }" v-if="selectedSeries.id"
                            :model="model" :instance="selectedInstance" :series="selectedSeries"
                            dialog-id="importSeriesData" :dialog-visibility="dialogVisibility.importSeriesData"
                            @action-finished="actionFinished"></import-series-data>
        <add-edit-protocol v-auth="{ resources: 'Model Instance', action: 'Admin' }" v-if="selectedInstance.id"
                           :model="model" :instance="selectedInstance" :protocol="addEditProtocolData"
                           dialog-id="addEditProtocol" :dialog-visibility="dialogVisibility.addEditProtocol"
                           @action-finished="actionFinished"></add-edit-protocol>
        <add-instance-relation v-auth="{ resources: 'Model Instance', action: 'Admin' }"
                               v-if="dialogVisibility.addInstanceRelation" :model="model" :instance="selectedInstance"
                               dialog-id="addInstanceRelation" :dialog-visibility="dialogVisibility.addInstanceRelation"
                               @action-finished="actionFinished"></add-instance-relation>
        <add-edit-rule-chain v-auth="{ resources: 'Model Instance', action: 'Admin' }"
                             v-if="dialogVisibility.addEditRuleChain" :instance-id="selectedInstance.id"
                             :chain="addEditRuleChainData" dialog-id="addEditRuleChain"
                             :dialog-visibility="dialogVisibility.addEditRuleChain"
                             @action-finished="actionFinished"></add-edit-rule-chain>
        <customize-time-series v-auth="{ resources: 'Model Instance', action: 'Admin' }"
                             v-if="dialogVisibility.customizeCalculation" :instance-id="selectedInstance.id"
                             :series="customizeCalculationData" dialog-id="customizeCalculation"
                             :dialog-visibility="dialogVisibility.customizeCalculation"
                             @action-finished="actionFinished"></customize-time-series>
        <test-protocol v-auth="{ resources: 'Model Instance' }" v-if="dialogVisibility.testProtocol" :model="model"
                       :instance="selectedInstance" :protocol="selectedProtocol" dialog-id="testProtocol"
                       :dialog-visibility="dialogVisibility.testProtocol"
                       @action-finished="actionFinished"></test-protocol>
        <show-protocol-doc v-auth="{ resources: 'Model Instance' }" v-if="dialogVisibility.showProtocolDoc"
                           :model="model" :instance="selectedInstance" :protocol="selectedProtocol"
                           dialog-id="showProtocolDoc" :dialog-visibility="dialogVisibility.showProtocolDoc"
                           @action-finished="actionFinished"></show-protocol-doc>
    </div>

</template>

<script>

import ViewPointViewer from "../Maps/ViewPointViewer";
import AddEditSeriesValue from "./Model/AddEditSeriesValue";
import AddEditAttribute from "./Model/AddEditAttribute";
import AddEditSeries from "./Model/AddEditSeries";
import AddEditRelation from "./Model/AddEditRelation";
import AddEditInstance from "./Model/AddEditInstance";
import AddInstanceRelation from "./Model/AddInstanceRelation";
import AddEditPID from "./Model/AddEditPID";
import AddEditProtocol from "./Model/AddEditProtocol";
import AddEditRuleChain from "./Model/AddEditRuleChain.vue";
import {getModelInstanceDetail, updateModelInstance} from "@/assets/js/api/model-instance";
import {deletePID, getPIDList} from "@/assets/js/api/model-instance-pid";
import {deleteInstanceRelation, getInstanceRelationList} from "@/assets/js/api/model-instance-relation";
import {
    deleteInstanceProtocol,
    getInstanceProtocolList,
    updateInstanceProtocol
} from "@/assets/js/api/model-instance-protocol";
import {
    deleteInstanceSeriesValue, getInstanceSeriesLatestValue,
    getInstanceSeriesValueList,
    getInstanceSingleSeriesValue
} from "@/assets/js/api/model-instance-series";
import {getModelDetail, getModelTables} from "@/assets/js/api/model";
import {downloadFile, validate} from "@/utils";
import {getLabelList} from "@/assets/js/api/unit-label";
import {getTableDetail} from "@/assets/js/api/data-table";
import {getRecordListFromInstance, getRecordListFromModel} from "@/assets/js/api/data-table-record";
import {deleteInstanceAttribute, updateInstanceAttribute} from "@/assets/js/api/model-instance-attribute";
import {checkAlert, getAlertList} from "@/assets/js/api/model-instance-alert";
import TestProtocol from "./Model/TestProtocol";
import ShowProtocolDoc from "./Model/ShowProtocolDoc";
import ShowSeriesData from "./Model/ShowSeriesData";
import ImportSeriesData from "./Model/ImportSeriesData";
import DynamicPIDPanel from "../DashboardWidget/Shared/DynamicPIDPanel";
import {getRuleChainListForInstance, removeRuleChain} from "@/assets/js/api/model-instance-rule-chain";
import RuleChainEditor from "@/components/Admin/Model/RuleChainEditor.vue";
import CustomizeTimeSeries from "@/components/Admin/Model/CustomizeTimeSeries.vue";
import {getFile, getFileList, removeFile, uploadFile} from "@/assets/js/api/media-file";


export default {
    name: "InstanceDetailPage",
    components: {
        CustomizeTimeSeries,
        RuleChainEditor,
        DynamicPIDPanel,
        ViewPointViewer,
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
        AddInstanceRelation,
        AddEditRuleChain
    },
    watch: {
        seriesMode(newValue) {
            this.getSeriesValues()
        }
    },
    data() {
        return {
            dialogVisibility: {
                addEditInstance: false,
                addEditSeriesValue: false,
                addEditPID: false,
                addInstanceRelation: false,
                showSeriesData: false,
                importSeriesData: false,
                addEditProtocol: false,
                testProtocol: false,
                showProtocolDoc: false,
                addEditRuleChain: false,
                customizeCalculation: false
            },
            addEditInstanceData: {},
            addEditRelationData: {},
            addEditSeriesValueData: {},
            addEditProtocolData: {},
            addEditPIDData: {},
            addEditRuleChainData: {},
            customizeCalculationData: {},
            loading: {
                attribute: false,
                series: false
            },
            allSelected: true,
            isIndeterminate: true,
            seriesSelection: [],
            instanceEntries: {
                value: {},
                candidates: [{
                    name: 'attribute',
                    label: this.$t("label.instance.attribute")
                }, {
                    name: 'series',
                    label: this.$t("label.instance.series")
                }, {
                    name: 'relation',
                    label: this.$t("label.instance.relationship")
                }, /*{
                    name: 'table',
                    label: this.$t("label.instance.table")
                }, {
                    name: 'pid',
                    label: this.$t("label.instance.pid")
                }, */{
                    name: 'rule',
                    label: this.$t("label.instance.ruleChain")
                }, {
                    name: 'document',
                    label: this.$t("label.instance.document")
                }/*, {
                    name: 'alert',
                    label: this.$t("label.instance.alert")
                }*/, {
                    name: 'protocol',
                    label: this.$t("label.instance.protocol")
                }]
            },
            filters: {
                series: {
                    label: []
                },
                attribute: {
                    label: []
                }
            },
            labels: [],
            seriesMode: 'realtime',
            seriesData: {
                history: [],
                realtime: {}
            },
            selectedInstance: {
                attribute_values: {}
            },
            sorter: {},
            model: {},
            documents: [],
            alerts: [],
            ruleChains: [],
            selectedChain: {},
            tableRecords: [],
            selectedSeries: {},
            selectedProtocol: {},
            selectedPID: {},
            selectedTable: {},
            pagination: {
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
            defaultInterface: [{
                name: 'Attribute Data',
                protocol: 'HTTP',
                description: 'HTTP Interface to update attribute date'
            }, {
                name: 'Series Data',
                protocol: 'HTTP',
                description: 'HTTP Interface to upload series data'
            }],
        }
    },
    methods: {
        downloadFile(file) {
            getFile(file.id).then(result => {
                downloadFile(file.name, result.data)
            })
        },
        goPidEdit() {
            // let routeData = this.$router.resolve({ name: 'PidEdit', params: { modelId: this.$route.params.modelId } })
            // window.open(routeData.href, '_blank')
            this.$router.push({
                name: 'PidEdit',
                params: {
                    modelId: this.$route.params.modelId,
                    pid: Object.assign({},
                        this.selectedPID,
                        {instanceId: this.selectedInstance.id},
                        {treeId: this.selectedInstance.instanceId}
                    ),

                }
            })
        },
        validate,
        actionFinished(dialogId, success) {
            this.dialogVisibility[dialogId] = false
            if (success) {
                if (dialogId === 'addEditInstance') {
                    this.getInstanceDetail(this.selectedInstance.id)
                } else if (dialogId === 'addEditSeriesValue' || dialogId === 'importSeriesData' || dialogId === 'customizeCalculation') {
                    this.getSeriesValues()
                } else if (dialogId === 'addEditProtocol') {
                    this.getProtocols()
                } else if (dialogId === 'addInstanceRelation') {
                    this.getInstanceRelations()
                } else if (dialogId === 'addEditPID') {
                    this.getInstancePIDs()
                } else if (dialogId === 'addEditRuleChain') {
                    this.getRuleChains()
                }
            }
        },
        formatTimeRange(span) {
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
        matchLabels(labels, references) {
            if (references.length === 0) return true
            let refs = references.reduce((result, id) => {
                result[id] = id
                return result
            }, {})
            for (let i = 0; i < labels.length; i++) {
                if (refs[labels[i].id]) return true
            }
            return false
        },
        getLabels() {
            getLabelList().then(result => {
                this.labels = result.data
            })
        },
        formatValue(series, value) {
            if (series.dataType === 'Decimal') {
                value = parseFloat(value)
                if (series.precision || series.precision === 0) {
                    value = parseFloat(value.toFixed(series.precision))
                }
            }
            return value
        },
        selectAll(val) {
            this.seriesSelection = val ? this.model.time_series.map(item => item.id) : [];
            this.isIndeterminate = false;
        },
        selectSeries(value) {
            let checkedCount = value.length;
            this.allSelected = checkedCount === this.model.time_series.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.model.time_series.length;
        },
        getInstanceDetail(instanceId) {
            this.loading.attribute = true
            getModelInstanceDetail(instanceId).then(result => {
                let instance = result.data
                getModelDetail(result.data.modelId).then(result => {
                    this.model = result.data
                    this.selectedInstance = instance
                    this.model.time_series.sort((s1, s2) => s1.name.localeCompare(s2.name))
                    this.seriesSelection = this.model.time_series.map(item => item.id).slice(0, 5)
                    this.selectedInstance.attribute_values = this.selectedInstance.attribute_values.reduce((result, item) => {
                        result[item.attributeId] = {
                            value: item.value,
                            editing: false
                        }
                        return result
                    }, {})
                    let attributes = this.model.static_attributes
                    for (let i = 0; i < attributes.length; i++) {
                        if (!this.selectedInstance.attribute_values[attributes[i].id]) {
                            this.selectedInstance.attribute_values[attributes[i].id] = {
                                value: '',
                                editing: false,
                                attribute: attributes[i]
                            }
                        } else {
                            this.selectedInstance.attribute_values[attributes[i].id].attribute = attributes[i]
                        }
                    }
                    this.selectedInstance.attribute_values = attributes.map(item => this.selectedInstance.attribute_values[item.id])
                    this.loading.attribute = false
                })
            })
        },
        switchInstanceStatus(status) {
            updateModelInstance(this.$route.params.modelId, this.selectedInstance.id, {published: this.selectedInstance.published}).then(result => {
                this.$message({
                    type: 'success',
                    message: 'Instance status changed successfully.',
                    showClose: true
                })
            })
        },
        switchInstanceDetail(entry) {
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
            if (entry.name === 'alert') {
                this.getAlerts()
            }
            if (entry.name === 'rule') {
                this.getRuleChains()
            }
            if (entry.name === 'document') {
                this.getDocuments()
            }
        },
        getDocuments () {
            getFileList({ instanceId: this.selectedInstance.id }).then(result => {
                this.documents = result.data
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
                formData.append("instanceId", this.selectedInstance.id)
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
        editInstance(instance) {
            this.addEditInstanceData = Object.assign({}, instance)
            this.dialogVisibility.addEditInstance = true
        },
        enableInstanceAttributeEditor(record) {
            record.editing = true
        },
        saveInstanceAttributeValue(record) {
            updateInstanceAttribute(this.selectedInstance.id, record.attribute.id, {
                value: record.value
            }).then(result => {
                record.editing = false
            })
        },
        deleteInstanceAttributeValue(record) {
            this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
                confirmButtonText: this.$t("action.confirm"),
                cancelButtonText: this.$t("action.cancel"),
                type: 'warning'
            }).then(() => {
                deleteInstanceAttribute(this.selectedInstance.id, record.attribute.id, {
                    value: record.value
                }).then(result => {
                    this.$message({
                        message: this.$t("message.attribute.deleted"),
                        type: 'success',
                        showClose: true,
                        duration: 2000
                    })
                    this.getInstanceDetail(this.$route.params.instanceId)
                })
            })
        },
        getRuleChains() {
            getRuleChainListForInstance(this.$route.params.instanceId).then(result => {
                this.ruleChains = result.data
                this.selectedChain = {}
            })
        },
        addRuleChain() {
            this.addEditRuleChainData = {}
            this.dialogVisibility.addEditRuleChain = true
        },
        viewRuleChain(chain) {
            this.selectedChain = Object.assign({}, chain)
        },
        bindRuleChain(protocol) {
            this.addEditRuleChainData = ""
            let currentChain = protocol.chains.reduce((result, item) => {
                result[item.id] = item.id
                return result
            }, {})
            getRuleChainListForInstance(this.$route.params.instanceId).then(result => {
                this.ruleChains = result.data.filter(item => !currentChain[item.id])
            })
        },
        unbindRuleChain(chain, protocol) {
            this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
                confirmButtonText: this.$t("action.confirm"),
                cancelButtonText: this.$t("action.cancel"),
                type: 'warning'
            }).then(() => {
                updateInstanceProtocol(protocol.instanceId, protocol.id, Object.assign({}, protocol, {
                    chains: protocol.chains.filter(item => item.id !== chain.id).map(item => item.id)
                })).then(result => {
                    this.$message({
                        message: this.$t("message.protocol.updated"),
                        type: 'success',
                        showClose: true,
                        duration: 2000
                    })
                    this.getProtocols()
                })
            })
        },
        bindRuleChainWithProtocol(protocol) {
            protocol.bindChain = false
            updateInstanceProtocol(protocol.instanceId, protocol.id, Object.assign({}, protocol, {
                chains: protocol.chains.map(item => item.id).concat([this.addEditRuleChainData])
            })).then(result => {
                this.$message({
                    message: this.$t("message.protocol.updated"),
                    type: 'success',
                    showClose: true,
                    duration: 2000
                })
                this.getProtocols()
            })
        },
        editRuleChain(chain) {
            this.addEditRuleChainData = Object.assign({}, chain)
            this.dialogVisibility.addEditRuleChain = true
        },
        deleteRuleChain(chain) {
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
                    this.getRuleChains()
                })
            })
        },
        getAlerts() {
            getAlertList(this.$route.params.instanceId).then(result => {
                this.alerts = result.data
            })
        },
        checkAlert(alert, checked = true) {
            checkAlert(alert.instanceId, alert.id).then(result => {
                this.$message({
                    type: "success",
                    message: this.$t('message.alert.checked'),
                    showClose: true,
                    duration: 3000
                })
                this.getAlerts()
            })
        },
        getModelTables() {
            getModelTables(this.model.id).then(result => {
                this.model.data_tables = result.data
                if (this.model.data_tables.length > 0) {
                    this.$nextTick(() => {
                        this.selectTable(this.model.data_tables[0])
                    })
                }
            })
        },
        selectTable(table) {
            getTableDetail(table.tableId).then(result => {
                this.selectedTable = result.data
                this.$nextTick(() => {
                    this.refreshRecords()
                })
            })
        },
        updateOrder({column, prop, order}) {
            this.sorter = {
                sorter: prop,
                order: order === "ascending" ? "ASC" : "DESC"
            }
            this.refreshRecords()
        },
        refreshRecords(page = 1) {
            if (page) {
                this.pagination.table.page = page
            }
            this.loading.series = true
            getRecordListFromInstance(this.selectedInstance.id, this.selectedTable.id, this.pagination.table, {}).then(result => {
                this.tableRecords = result.data
                this.pagination.table = result.pagination
                this.loading.series = true
            })
        },
        getSeriesValues(page = 1) {
            if (this.seriesMode === 'history') {
                this.loading.series = true
                this.pagination.series.page = page
                getInstanceSeriesValueList(this.selectedInstance.id, this.pagination.series).then(result => {
                    this.seriesData.history = result.data
                    this.pagination.series = result.pagination
                    this.loading.series = false
                })
            } else {
                this.pagination.series.page = 1
                getInstanceSeriesLatestValue(this.selectedInstance.id).then(result => {
                    this.seriesData.realtime = result.data.reduce((res, record, index) => {
                        res[record.seriesId] = record
                        return res
                    }, {})
                })
            }
        },
        showSeriesValues(series) {
            this.selectedSeries = series
            this.dialogVisibility.showSeriesData = true
        },
        importSeriesValues(series) {
            this.selectedSeries = series
            this.dialogVisibility.importSeriesData = true
        },
        customizeCalculation(series) {
            this.customizeCalculationData = Object.assign({}, series)
            this.dialogVisibility.customizeCalculation = true
        },
        addSeriesValue(series) {
            this.addEditSeriesValueData = {
                series: series
            }
            this.addEditSeriesValueData[series.id] = ''
            this.dialogVisibility.addEditSeriesValue = true
        },
        editSeriesValue(record) {
            this.addEditSeriesValueData = {
                id: [],
                time: new Date(record.time)
            }
            for (let seriesId in record.data) {
                this.addEditSeriesValueData[seriesId] = record.data[seriesId].value
                this.addEditSeriesValueData.id.push(record.data[seriesId].id)
            }
            this.dialogVisibility.addEditSeriesValue = true
        },
        deleteSeriesValue(record) {
            this.$confirm('Action cannot be reversed, are you sure?', 'Warning', {
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                deleteInstanceSeriesValue(this.selectedInstance.id, {ids: Object.values(record.data).map(item => item.id)}).then(result => {
                    this.$message({
                        type: 'success',
                        message: 'Record deleted successfully.',
                        showClose: true
                    })
                    this.getSeriesValues()
                })
            })
        },
        getInstanceRelations() {
            getInstanceRelationList(this.selectedInstance.id).then(result => {
                this.selectedInstance.Parents = result.data.Parents || []
                this.selectedInstance.Children = result.data.Children || []
            })
        },
        addInstanceRelation() {
            this.dialogVisibility.addInstanceRelation = true
        },
        deleteInstanceRelation(target) {
            this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
                confirmButtonText: this.$t("action.confirm"),
                cancelButtonText: this.$t("action.cancel"),
                type: 'warning'
            }).then(() => {
                deleteInstanceRelation(this.selectedInstance.id, target.instance_relation.id).then(result => {
                    this.$message({
                        type: 'success',
                        message: this.$t("message.instanceRelation.deleted"),
                        showClose: true
                    })
                    this.getInstanceRelations()
                })
            })
        },
        getProtocols() {
            getInstanceProtocolList(this.selectedInstance.id).then(result => {
                for (let i = 0; i < result.data.length; i++) {
                    result.data[i].bindChain = false
                }
                this.selectedInstance.protocols = result.data
            })
        },
        addProtocol() {
            this.addEditProtocolData = {}
            this.dialogVisibility.addEditProtocol = true
        },
        editProtocol(protocol) {
            this.addEditProtocolData = JSON.parse(JSON.stringify(protocol))
            this.dialogVisibility.addEditProtocol = true
        },
        testProtocol(protocol) {
            this.selectedProtocol = protocol
            this.dialogVisibility.testProtocol = true
        },
        updateProtocolStatus(protocol) {
            updateInstanceProtocol(this.selectedInstance.id, protocol.id, protocol).then(result => {
                if (protocol.isActive) {
                    this.$message({
                        type: 'success',
                        message: 'API activated successfully.',
                        showClose: true
                    })
                } else {
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
        viewProtocolDocument(protocol) {
            this.selectedProtocol = protocol
            this.dialogVisibility.showProtocolDoc = true
        },
        deleteProtocol(protocol) {
            this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
                confirmButtonText: this.$t("action.confirm"),
                cancelButtonText: this.$t("action.cancel"),
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
        getInstancePIDs() {
            getPIDList(this.selectedInstance.id).then(result => {
                this.selectedInstance.pids = result.data
                if (this.selectedPID) {
                    let selection = result.data.find(item => item.id === this.selectedPID.id)
                    if (selection) {
                        this.selectPID(selection)
                    } else {
                        this.selectPID(result.data[0])
                    }
                } else {
                    this.selectPID(result.data[0])
                }
            })
        },
        selectPID(pid) {
            this.selectedPID.id = 0
            this.$nextTick(() => {
                this.selectedPID = JSON.parse(JSON.stringify(pid))
            })
        },
        addPID() {
            this.addEditPIDData = {name: '', pid: ''}
            this.dialogVisibility.addEditPID = true
        },
        editPID(pid) {
            this.addEditPIDData = Object.assign({}, pid)
            this.dialogVisibility.addEditPID = true
        },
        deletePID(pid) {
            this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
                confirmButtonText: this.$t("action.confirm"),
                cancelButtonText: this.$t("action.cancel"),
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
        this.instanceEntries.value = this.instanceEntries.candidates[0]
        this.getInstanceDetail(this.$route.params.instanceId)
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

.pidtitle {
  font-family: 'HarmonyOS_Sans';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
}

.iconButton {
  color: #4FACFF;
  font-size: 20px;
  margin: 0 20px;
}

.noc-vgis-hierarchy-icon-lg {
  width: 40px;
  height: 40px;
}

.noc-vgis-instance-title {
  flex-grow: 1;
  margin-left: 16px;
  font-family: 'HarmonyOS Sans';
  font-style: normal;
  font-size: 20px;
  line-height: 24px;
  color: #000000;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.noc-vgis-instance-subtitle {
  flex-grow: 1;
  margin-left: 16px;
  margin-top: 10px;
  font-family: 'HarmonyOS Sans';
  font-style: normal;
  font-size: 16px;
  line-height: 20px;
  color: silver;
  text-overflow: ellipsis;
  white-space: nowrap;
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
    color: black;

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
