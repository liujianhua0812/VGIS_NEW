<template>
  <el-dialog v-auth="{ resources: 'Model', action: 'Admin' }" :title="title"
            width="912px" :visible.sync="dialogVisibility" @close="close">
    <el-form validate-on-rule-change v-if="!formData.isInterface" :rules="rules" label-position="top" :model="formData" ref="groupForm">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item :label="$t('form.protocol.name.label')" prop="name">
            <el-input :placeholder="$t('form.protocol.name.placeholder')" v-model="formData.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('form.protocol.protocol.label')" prop="protocolType">
            <el-select :placeholder="$t('form.protocol.protocol.placeholder')" class="full-w" v-model="formData.protocolType" @change="changeProtocol">
              <el-option v-for="type in protocolTypes" :key="type" :value="type" :label="type"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('form.protocol.interval.label')" prop="_sampleInterval">
            <el-input :placeholder="$t('form.protocol.interval.placeholder')"  class="full-w" v-model="formData._sampleInterval" type="number" min="0">
              <template slot="append">
                <el-select style="width: 100px;" v-model="formData.timeUnit" default-first-option>
                  <el-option v-for="time in timeUnit" :key="time.name" :value="time.factor" :label="time.name"></el-option>
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="formData.protocolType === 'HTTP'">
        <el-col :span="5">
          <el-form-item :label="$t('form.protocol.method.label')" prop="configuration.method">
            <el-select :placeholder="$t('form.protocol.method.placeholder')" class="full-w" v-model="formData.configuration.method" default-first-option>
              <el-option v-for="method in methods" :key="method" :value="method" :label="method"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="19">
          <el-form-item :label="$t('form.protocol.address.label')" prop="configuration.address">
            <el-input :placeholder="$t('form.protocol.address.placeholder')" v-model="formData.configuration.address"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="formData.protocolType === 'MQTT'">
        <el-col :span="24">
          <el-form-item :label="$t('form.protocol.channel.label')" prop="configuration.channel">
            <el-input :placeholder="$t('form.protocol.channel.placeholder')" v-model="formData.configuration.channel"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="formData.protocolType === 'Modbus TCP'">
        <el-col :span="14">
          <el-form-item :label="$t('form.protocol.ip.label')" prop="configuration.ipAddress">
            <el-input :placeholder="$t('form.protocol.ip.placeholder')" v-model="formData.configuration.ipAddress"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item :label="$t('form.protocol.port.label')" prop="configuration.port">
            <el-input :placeholder="$t('form.protocol.port.placeholder')" v-model="formData.configuration.port"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item :label="$t('form.protocol.deviceAddress.label')" prop="configuration.deviceAddress">
            <el-input :placeholder="$t('form.protocol.deviceAddress.placeholder')" v-model="formData.configuration.deviceAddress"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="formData.protocolType === 'Modbus Serial'">
        <el-col :span="8">
          <el-form-item :label="$t('form.protocol.com.label')" prop="configuration.com">
            <el-input :placeholder="$t('form.protocol.com.placeholder')" v-model="formData.configuration.com"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('form.protocol.baudrate.label')" prop="configuration.baudRate">
            <el-select class="full-w" v-model="formData.configuration.baudRate">
              <el-option :placeholder="$t('form.protocol.baudrate.placeholder')" v-for="baudRate in baudRates" :key="baudRate" :value="baudRate" :label="baudRate"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('form.protocol.deviceAddress.label')" prop="configuration.deviceAddress">
            <el-input :placeholder="$t('form.protocol.deviceAddress.placeholder')" v-model="formData.configuration.deviceAddress"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-tabs class="m-b-15" v-model="activeName">
        <el-tab-pane name="Header" :label="$t('form.protocol.header.label')" v-if="formData.protocolType === 'HTTP'">
          <el-table header-cell-class-name="table-header-cell" cell-class-name="table-cell" :data="formData.configuration.headers">
            <el-table-column :label="$t('form.protocol.header.key.label')">
              <template slot-scope="{ row }">
                <el-input size="mini" :disabled="row.disabled" v-model="row.name"></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="$t('form.protocol.header.value.label')">
              <template slot-scope="{ row }">
                <el-input size="mini" :disabled="row.disabled" v-model="row.value"></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="$t('form.protocol.header.description.label')">
              <template slot-scope="{ row }">
                <el-input size="mini" :disabled="row.disabled" v-model="row.description"></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="$t('label.basic.action')" width="100px" align="center">
              <template slot-scope="{ row, $index }">
                <el-button v-if="!row.disabled" type="danger" size="mini" @click="removeHeader($index)">{{$t("action.delete")}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button class="full-w m-t-5" plain type="primary" @click="addHeader">{{$t("action.add")}}</el-button>
        </el-tab-pane>
        <el-tab-pane name="Query" label="Query" v-if="formData.protocolType === 'HTTP'">
          <el-table header-cell-class-name="table-header-cell" cell-class-name="table-cell" :data="formData.configuration.query">
            <el-table-column :label="$t('form.protocol.header.key.label')">
              <template slot-scope="{ row }">
                <el-input size="mini" v-model="row.name"></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="$t('form.protocol.header.value.label')">
              <template slot-scope="{ row }">
                <el-input size="mini" v-model="row.value"></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="$t('form.protocol.header.description.label')">
              <template slot-scope="{ row }">
                <el-input size="mini" v-model="row.description"></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="$t('label.basic.action')" width="100px" align="center">
              <template slot-scope="{ row, $index }">
                <el-button type="danger" size="mini" @click="removeQuery($index)">{{$t("action.delete")}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button class="full-w m-t-5" plain type="primary" @click="addQuery">{{$t("action.add")}}</el-button>
        </el-tab-pane>
        <el-tab-pane name="Body" label="Body" v-if="formData.protocolType === 'HTTP'">
          <div class="flex align-items-center justify-content-between m-b-10">
            <div class="m-r-10">Content-Type: </div>
            <div style="flex-grow: 1;">
              <el-select class="full-w" size="mini" v-model="contentType">
                <el-option v-for="type in contentTypes" :key="type" :value="type" :label="type"></el-option>
              </el-select>
            </div>
          </div>
          <div v-if="contentType === 'application/x-www-form-urlencoded' || contentType === 'multipart/form-data'">
            <el-table header-cell-class-name="table-header-cell" cell-class-name="table-cell" :data="formData.configuration.body">
              <el-table-column label="Name">
                <template slot-scope="{ row }">
                  <el-input size="mini" v-model="row.name"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="Value">
                <template slot-scope="{ row }">
                  <el-input v-if="contentType === 'multipart/form-data' && row.type === 'File'" type="file" size="mini" v-model="row.value"></el-input>
                  <el-input v-else size="mini" v-model="row.value"></el-input>
                </template>
              </el-table-column>
              <el-table-column v-if="contentType === 'multipart/form-data'" label="Type">
                <template slot-scope="{ row }">
                  <el-select size="mini" v-model="row.type">
                    <el-option v-for="type in bodyTypes" :key="type" :value="type" :label="type"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="Description">
                <template slot-scope="{ row }">
                  <el-input size="mini" v-model="row.description"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="Action" width="100px" align="center">
                <template slot-scope="{ row, $index }">
                  <el-button type="danger" size="mini" @click="removeBody($index)">Delete</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button class="full-w m-t-5" plain type="primary" @click="addBody">Add Item</el-button>
          </div>
          <codemirror :options="{ mode: 'application/json', theme: 'base16-light', lineNumbers: true, inputStyle: 'textarea' }" v-if="contentType === 'application/json'" v-model="formData.configuration.rawBody"></codemirror>
          <codemirror :options="{ mode: 'application/xml', theme: 'base16-light', lineNumbers: true, inputStyle: 'textarea' }" v-if="contentType === 'application/xml'" v-model="formData.configuration.rawBody"></codemirror>
          <el-input v-if="contentType === 'text/plain'" type="textarea" :rows="10" v-model="formData.configuration.rawBody"></el-input>
        </el-tab-pane>
        <el-tab-pane name="Body" label="Body" v-if="formData.protocolType === 'MQTT'">
          <div class="flex align-items-center justify-content-between m-b-10">
            <div class="m-r-10">{{$t("form.protocol.dataType.label")}}</div>
            <div style="flex-grow: 1;">
              <el-select class="full-w" size="mini" v-model="formData.configuration.dataType">
                <el-option v-for="type in mqttDataTypes" :key="type" :value="type" :label="type"></el-option>
              </el-select>
            </div>
          </div>
          <codemirror :options="{ mode: 'application/json', theme: 'base16-light', lineNumbers: true, inputStyle: 'textarea' }" v-if="formData.configuration.dataType === 'JSON'" v-model="formData.configuration.rawBody"></codemirror>
          <el-input v-else type="textarea" :rows="10" v-model="formData.configuration.rawBody"></el-input>
        </el-tab-pane>
        <el-tab-pane name="Mapping" label="Data Mapping" v-if="['Modbus Serial', 'Modbus TCP'].includes(formData.protocolType)">
          <el-table :data="formData.configuration.mapping">
            <el-table-column label="Register Number">
              <template slot-scope="{ row }">
                <el-input size="mini" v-model="row.register"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="Data Type">
              <template slot-scope="{ row }">
                <el-select size="mini" v-model="row.type">
                  <el-option v-for="type in dataTypes" :key="type.value" :value="type.value" :label="type.name"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="Series">
              <template slot-scope="{ row }">
                <el-select size="mini" v-model="row.seriesId">
                  <el-option v-for="series in model.time_series" :key="series.id" :value="series.id" :label="series.name"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="Action" width="100px" align="center">
              <template slot-scope="{ row, $index }">
                <el-button type="danger" size="mini" @click="removeMapping($index)">{{$t("action.delete")}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button class="full-w m-t-5" plain type="primary" @click="addMapping">{{$t("action.add")}}</el-button>
        </el-tab-pane>
      </el-tabs>
      <el-row :gutter="10" class="noc-codemirror">
        <el-col :span="12" v-if="formData.protocolType === 'HTTP'">
          <el-form-item :label="$t('form.protocol.postAction.label')">
            <codemirror :options="{ mode: 'text/javascript', theme: 'base16-light', lineNumbers: true, inputStyle: 'textarea' }" v-model="formData.postAction"></codemirror>
          </el-form-item>
        </el-col>
        <el-col :span="formData.protocolType === 'HTTP' ? 12 :24">
          <el-form-item :label="$t('form.protocol.description.label')">
            <el-input v-model="formData.description" type="textarea" :rows="14"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form v-else label-position="top" :model="formData" ref="groupForm">
      <el-form-item v-if="formData.protocolType === 'MQTT'" :label="$t('form.protocol.address.label')">
        <el-input v-model="formData.configuration.address" :placeholder="setting.mqtt"></el-input>
      </el-form-item>
      <el-form-item v-if="formData.protocolType === 'MQTT'" :label="$t('form.protocol.channel.label')">
        <el-input v-model="formData.configuration.channel"></el-input>
      </el-form-item>
      <el-form-item :label="$t('form.protocol.postAction.label')">
        <codemirror :options="{ mode: 'text/javascript', theme: 'base16-light', lineNumbers: true, inputStyle: 'textarea' }" v-model="formData.postAction"></codemirror>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">{{$t("action.cancel")}}</el-button>
      <el-button type="primary" @click="submit">{{$t("action.confirm")}}</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import { createInstanceProtocol, updateInstanceProtocol } from "@/assets/js/api/model-instance-protocol";

  export default {
    name: "AddEditProtocol",
    props: {
      dialogId: String,
      dialogVisibility: Boolean,
      model: Object,
      instance: Object,
      protocol: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      title() {
        return !this.protocol.id ? this.$t("form.title.addAPI") : this.$t("form.title.editAPI")
      },
      setting () {
        return this.$store.state.setting
      },
      rules () {
        let that = this
        let result = {
          name: [
            { required: true, message: this.$t("form.protocol.name.error.empty"), trigger: ['change', 'blur'] }
          ],
          protocolType: [
            { required: true, message: this.$t("form.protocol.protocol.error.empty"), trigger: ['change', 'blur'] }
          ],
          _sampleInterval: [
            { required: true, message: this.$t("form.protocol.interval.error.empty"), trigger: ['change', 'blur'] },
            {
              validator(rule, value, callback, source, options) {
                if (!value) {
                  return callback(new Error(that.$t("form.protocol.interval.error.invalid")))
                }
                value = parseFloat(value)
                if (value !== Math.floor(value)) {
                  return callback(new Error(that.$t("form.protocol.interval.error.invalid")))
                }
                else if (value < 0) {
                  return callback(new Error(that.$t("form.protocol.interval.error.invalid")))
                }
                return callback()
              },
              trigger: ['change', 'blur']
            }
          ]
        }
        if (this.formData.protocolType === 'HTTP') {
          result.configuration = {
            method: [
              { required: true, message: this.$t("form.protocol.method.error.empty"), trigger: ['change', 'blur'] }
            ],
            address: [
              { required: true, message: this.$t("form.protocol.address.error.empty"), trigger: ['change', 'blur'] },
              { type: 'url', message: this.$t("form.protocol.address.error.invalid"), trigger: ['change', 'blur'] }
            ]
          }
        }
        if (this.formData.protocolType === 'MQTT') {
          result.configuration = {
            channel: [
              { required: true, message: this.$t("form.protocol.channel.error.empty"), trigger: ['change', 'blur'] }
            ],
            dataType: [
              { required: true, message: this.$t("form.protocol.dataType.error.empty"), trigger: ['change', 'blur'] }
            ]
          }
        }
        if (this.formData.protocolType === 'Modbus Serial') {
          result.configuration = {
            com: [
              { required: true, message: this.$t("form.protocol.com.error.empty"), trigger: ['change', 'blur'] }
            ],
            baudRate: [
              { required: true, message: this.$t("form.protocol.baudrate.error.empty"), trigger: ['change', 'blur'] }
            ],
            deviceAddress: [
              { required: true, message: this.$t("form.protocol.deviceAddress.error.empty"), trigger: ['change', 'blur'] }
            ]
          }
        }
        if (this.formData.protocolType === 'Modbus TCP') {
          result.configuration = {
            ipAddress: [
              { required: true, message: this.$t("form.protocol.ip.error.empty"), trigger: ['change', 'blur'] },
              {
                validator(rule, value, callback, source, options) {
                  if (!value.match(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/)) {
                    return callback(new Error(that.$t("form.protocol.ip.error.invalid")))
                  }
                  return callback()
                },
                trigger: ['change', 'blur']
              }
            ],
            port: [
              { required: true, message: this.$t("form.protocol.port.error.empty"), trigger: ['change', 'blur'] },
              {
                validator(rule, value, callback, source, options) {
                  if (!value) {
                    return callback(new Error(that.$t("form.protocol.port.error.invalid")))
                  }
                  value = parseFloat(value)
                  if (value !== Math.floor(value)) {
                    return callback(new Error(that.$t("form.protocol.port.error.invalid")))
                  }
                  else if (value < 0 || value > 65535) {
                    return callback(new Error(that.$t("form.protocol.port.error.invalid")))
                  }
                  return callback()
                },
                trigger: ['change', 'blur']
              }
            ],
            deviceAddress: [
              { required: true, message: this.$t("form.protocol.deviceAddress.error.empty"), trigger: ['change', 'blur'] }
            ]
          }
        }
        return result
      }
    },
    watch: {
      protocol: {
        handler (newValue) {
          this.flushData()
        },
        deep: true
      },
      dialogVisibility (newValue) {
        if (newValue) {
          this.flushData()
        }
      },
      contentType (newValue) {
        let headers = this.formData.configuration.headers
        for(let i = 0; i < headers.length; i++) {
          if (headers[i].name === 'Content-Type') {
            headers[i].value = newValue
          }
        }
        switch(newValue) {
          case 'application/json':
            this.formData.configuration.rawBody = this.getEmptyJSON()
            break
          case 'application/xml':
            this.formData.configuration.rawBody = this.getEmptyXml()
            break
          default:
            this.formData.configuration.rawBody = ''
            break
        }
      }
    },
    data() {
      return {
        activeName: "Header",
        formLabelWidth: "140px",
        formData: {
          name: '',
          protocolType: 'HTTP',
          sampleInterval: '',
          _sampleInterval: '',
          timeUnit: 1,
          description: '',
          postAction: this.getEmptyPostAction(),
          configuration: {
            method: '',
            address: '',
            ipAddress: '',
            port: '',
            headers: this.getDefaultHeaders(),
            query: [this.getEmptyQuery()],
            body: [],
            rawBody: '',
            com: '',
            baudRate: '',
            deviceAddress: '',
            mapping: []
          }
        },
        contentType: 'application/json',
        contentTypes: [
          'multipart/form-data',
          'application/x-www-form-urlencoded',
          'application/json',
          'application/xml',
          'text/plain'
        ],
        mqttDataTypes: ["Text", 'JSON'],
        bodyTypes: ['Text', 'File'],
        protocolTypes: ['HTTP', 'Modbus Serial', 'Modbus TCP', 'MQTT'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        baudRates: [1200, 2400, 4800, 9600, 14400, 19200, 28800, 38400, 56000, 115200, 128000, 230400, 256000],
        dataTypes: [
          { name: 'Short', value: 'SHORT'},
          { name: 'Short Swap', value: 'SHORT_SWAP'},
          { name: 'Signed', value: 'SIGNED'},
          { name: 'Signed Swap', value: 'SIGNED_SWAP'},
          { name: 'Float', value: 'FLOAT'},
          { name: 'Float Swap', value: 'FLOAT_SWAP'},
          { name: 'Float Little Endian', value: 'FLOAT_LE'},
          { name: 'Float Little Endian Swap', value: 'FLOAT_LE_SWAP'},
          { name: 'String', value: 'STRING'}
        ],
        timeUnit: [{
          name: this.$t("dict.time.second"),
          factor: 1
        }, {
          name: this.$t("dict.time.minute"),
          factor: 60
        }, {
          name: this.$t("dict.time.hour"),
          factor: 60 * 60
        }, {
          name: this.$t("dict.time.day"),
          factor: 60 * 60 * 24
        }, {
          name: this.$t("dict.time.week"),
          factor: 60 * 60 * 24 * 7
        }, {
          name: this.$t("dict.time.month"),
          factor: 30 * 60 * 60 * 24
        }, {
          name: this.$t("dict.time.year"),
          factor: 365 * 60 * 60 * 24
        }]
      }
    },
    methods: {
      close() {
        this.$emit('action-finished', this.dialogId, false)
      },
      changeProtocol () {
        if (this.formData.protocolType === "HTTP") {
          this.activeName = "Header"
        }
        else if (this.formData.protocolType === "MQTT") {
          this.activeName = "Body"
        }
        else {
          this.activeName = "Mapping"
        }
      },
      getEmptyXml () {
        return `<?xml version="1.0" encoding="UTF-8"?>\n<\!-- Enter Content Below -->`
      },
      getEmptyJSON () {
        return `{\n    "foo": "bar"\n}`
      },
      getEmptyPostAction () {
        return `function (data) {\n    /* ${this.$t('message.protocol.hint')} */\n    return data;\n}`
      },
      flushData () {
        this.formData = Object.assign({}, {
          name: '',
          protocolType: 'HTTP',
          sampleInterval: '',
          _sampleInterval: '',
          timeUnit: 1,
          description: '',
          postAction: this.getEmptyPostAction(),
          configuration: {
            method: '',
            address: '',
            ipAddress: '',
            port: '',
            headers: this.getDefaultHeaders(),
            query: [this.getEmptyQuery()],
            body: [this.getEmptyBody()],
            rawBody: '',
            com: '',
            baudRate: '',
            deviceAddress: '',
            mapping: [this.getEmptyMapping()]
          }
        }, this.protocol)
        this.simplifyTimeRange()
        if (!this.formData.postAction) {
          this.formData.postAction = this.getEmptyPostAction()
        }
      },
      simplifyTimeRange () {
        if (!this.formData.sampleInterval) {
          return this.formData.timeUnit = 1
        }
        for(let i = this.timeUnit.length - 1; i >= 0 ;i--) {
          if (this.formData.sampleInterval % this.timeUnit[i].factor === 0) {
            this.formData.timeUnit = this.timeUnit[i].factor
            this.formData._sampleInterval = this.formData.sampleInterval / this.timeUnit[i].factor
            break
          }
        }
      },
      removeHeader (index) {
        this.formData.configuration.headers.splice(index, 1)
      },
      getDefaultHeaders () {
        return [{
          name: 'Content-Type',
          value: this.contentType,
          description: '',
          disabled: true
        }]
      },
      getEmptyHeader () {
        return {
          name: '',
          value: '',
          description: '',
          disabled: false
        }
      },
      addHeader () {
        this.formData.configuration.headers = this.formData.configuration.headers.concat(this.getEmptyHeader())
      },
      removeQuery (index) {
        this.formData.configuration.query.splice(index, 1)
      },
      getEmptyQuery () {
        return {
          name: '',
          value: '',
          description: ''
        }
      },
      addQuery () {
        this.formData.configuration.query = this.formData.configuration.query.concat(this.getEmptyQuery())
      },
      removeBody (index) {
        this.formData.configuration.body.splice(index, 1)
      },
      getEmptyBody () {
        return {
          name: '',
          value: '',
          type: 'Text',
          description: '',
          disabled: false
        }
      },
      addBody () {
        this.formData.configuration.body = this.formData.configuration.body.concat(this.getEmptyBody())
      },
      removeMapping (index) {
        this.formData.configuration.mapping.splice(index, 1)
      },
      getEmptyMapping () {
        return {
          register: '',
          type: '',
          seriesId: ''
        }
      },
      addMapping () {
        this.formData.configuration.mapping = this.formData.configuration.mapping.concat(this.getEmptyMapping())
      },
      submit() {
        this.$refs.groupForm.validate(valid => {
          if (valid) {
            if (this.protocol.id) {
              updateInstanceProtocol(this.instance.id, this.protocol.id, Object.assign(this.formData, { sampleInterval: this.formData._sampleInterval * this.formData.timeUnit })).then(response => {
                this.$message({
                  message: this.$t("message.protocol.updated"),
                  type: 'success',
                  showClose: true,
                  duration: 2000
                })
                this.$emit('action-finished', this.dialogId, true)
              })
            }
            else {
              createInstanceProtocol(this.instance.id, Object.assign(this.formData, { sampleInterval: this.formData._sampleInterval * this.formData.timeUnit })).then(response => {
                this.$message({
                  message: this.$t("message.protocol.created"),
                  type: 'success',
                  showClose: true,
                  duration: 2000
                })
                this.$emit('action-finished', this.dialogId, true)
              })
            }
          }
        })
      }
    },
    created() {
      this.flushData()
    }
  }
</script>
<style lang="scss" scoped>
  .noc-codemirror {
    :deep(.CodeMirror) {
      height: 150px !important;
    }

    :deep(.el-textarea__inner) {
      height: 150px !important;
    }
  }
</style>
