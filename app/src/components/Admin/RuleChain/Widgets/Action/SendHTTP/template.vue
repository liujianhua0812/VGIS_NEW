<template>
    <div class="flex align-items-center flex-column">
        <h3 class="text-bold" :style="{ color }">{{label}}</h3>
        <el-button size="mini" type="primary" @click="editConfig">{{$t("action.configure")}}</el-button>
        <el-dialog width="800px" append-to-body :title="$t('form.title.editRule')" :visible.sync="dVisibility" @close="close">
            <el-form label-position="top">
                <el-form-item size="small" :label="$t('form.address.label')">
                    <el-input v-model="nodeConfig.address" :placeholder="$t('form.address.placeholder')">
                        <template slot="prepend">
                            <el-select v-model="nodeConfig.method" style="width: 120px;">
                                <el-option v-for="method in methods" :key="method" :value="method" :label="method"></el-option>
                            </el-select>
                        </template>
                    </el-input>
                </el-form-item>
                <el-tabs class="m-b-15" v-model="activeName">
                    <el-tab-pane name="Header" :label="$t('form.protocol.header.label')">
                        <el-table header-cell-class-name="table-header-cell" cell-class-name="table-cell" :data="nodeConfig.headers">
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
                    <el-tab-pane name="Query" label="Query">
                        <el-table header-cell-class-name="table-header-cell" cell-class-name="table-cell" :data="nodeConfig.query">
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
                    <el-tab-pane name="Body" label="Body">
                        <div class="flex align-items-center justify-content-between m-b-10">
                            <div class="m-r-10">Content-Type: </div>
                            <div style="flex-grow: 1;">
                                <el-select class="full-w" size="mini" v-model="nodeConfig.contentType">
                                    <el-option v-for="type in contentTypes" :key="type" :value="type" :label="type"></el-option>
                                </el-select>
                            </div>
                        </div>
                        <div v-if="nodeConfig.contentType === 'application/x-www-form-urlencoded' || nodeConfig.contentType === 'multipart/form-data'">
                            <el-table header-cell-class-name="table-header-cell" cell-class-name="table-cell" :data="nodeConfig.body">
                                <el-table-column label="Name">
                                    <template slot-scope="{ row }">
                                        <el-input size="mini" v-model="row.name"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Value">
                                    <template slot-scope="{ row }">
                                        <el-input v-if="nodeConfig.contentType === 'multipart/form-data' && row.type === 'File'" type="file" size="mini" v-model="row.value"></el-input>
                                        <el-input v-else size="mini" v-model="row.value"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="nodeConfig.contentType === 'multipart/form-data'" label="Type">
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
                                        <el-button type="danger" size="mini" @click="removeBody($index)">{{$t('action.delete')}}</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-button class="full-w m-t-5" plain type="primary" @click="addBody">{{$t('action.add')}}</el-button>
                        </div>
                        <codemirror :options="{ mode: 'application/json', theme: 'base16-light', lineNumbers: true, inputStyle: 'textarea' }" v-if="nodeConfig.contentType === 'application/json'" v-model="nodeConfig.rawBody"></codemirror>
                        <codemirror :options="{ mode: 'application/xml', theme: 'base16-light', lineNumbers: true, inputStyle: 'textarea' }" v-if="nodeConfig.contentType === 'application/xml'" v-model="nodeConfig.rawBody"></codemirror>
                        <el-input v-if="nodeConfig.contentType === 'text/plain'" type="textarea" :rows="10" v-model="nodeConfig.rawBody"></el-input>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <div class="text-center m-t-10">
                <el-button type="primary" @click="close">{{$t('action.save')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import WidgetTemplate from "../../template.vue"

export default {
    name: "SendHTTPTemplate",
    extends: WidgetTemplate,
    data() {
        return {
            activeName: "Header",
            contentTypes: [
                'multipart/form-data',
                'application/x-www-form-urlencoded',
                'application/json',
                'application/xml',
                'text/plain'
            ],
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "CONNECT", "HEAD", "TRACE"],
            bodyTypes: ['Text', 'File'],
            nodeConfig: {
                address: "",
                method: "",
                contentType: 'application/json',
                headers: [],
                body: [],
                query: [],
                rawBody: ""
            }
        }
    },
    i18n: {
        messages: {
            en: {
                form: {
                    address: {
                        label: "Address",
                        placeholder: "Please specify address of HTTP request."
                    }
                }
            },
            cn: {
                form: {
                    address: {
                        label: "请求地址",
                        placeholder: "请设置发送HTTP请求的地址。"
                    }
                }
            }
        }
    },
    methods: {
        removeHeader (index) {
            this.nodeConfig.headers.splice(index, 1)
        },
        getDefaultHeaders () {
            return [{
                name: 'Content-Type',
                value: this.nodeConfig.contentType,
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
            this.nodeConfig.headers = this.nodeConfig.headers.concat(this.getEmptyHeader())
        },
        removeQuery (index) {
            this.nodeConfig.query.splice(index, 1)
        },
        getEmptyQuery () {
            return {
                name: '',
                value: '',
                description: ''
            }
        },
        addQuery () {
            this.nodeConfig.query = this.nodeConfig.query.concat(this.getEmptyQuery())
        },
        removeBody (index) {
            this.nodeConfig.body.splice(index, 1)
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
            this.nodeConfig.body = this.nodeConfig.body.concat(this.getEmptyBody())
        },
    }
}
</script>

<style lang="scss" scoped>

</style>
