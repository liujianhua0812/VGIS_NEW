<template>
    <div class="full m-l-20">
        <vgis-breadcrumb :navs="navs"></vgis-breadcrumb>
        <div style="height: calc(100% - 35px);" class="flex">
            <div class="noc-vgis-alert-list">
                <div class="flex m-15 justify-content-center">
                    <el-switch v-model="modelView" :active-text="$t('label.alert.modelView')" :inactive-text="$t('label.alert.instanceView')"></el-switch>
                </div>
                <div class="flex align-items-center m-15">
                    <el-input class="filter" v-model="filter.query" clearable @clear="getHierarchy" @keyup.native.enter="getHierarchy">
                        <template slot="append">
                            <el-button type="primary" icon="el-icon-search" @click="getHierarchy"></el-button>
                        </template>
                    </el-input>
                    <div class="m-l-10 text-center" style="width: 100px;">
                        <div>{{$t("label.alert.recursive")}}</div>
                        <el-checkbox v-model="filter.cc" @change="getAlerts"></el-checkbox>
                    </div>
                </div>
                <el-tree
                        v-show="!modelView"
                        :expand-on-click-node="false"
                        v-loading="loading.hierarchy"
                        class="m-r-15"
                        draggable
                        :allow-drop="false"
                        default-expand-all
                        @node-click="filterByNode"
                        :data="hierarchy">
                    <div class="noc-vgis-hierarchy-item" slot-scope="{node, data}">
                        <div class="flex align-items-center justify-content-start" style="flex-grow: 1;">
                            <el-image v-if="!data.poi && modelMap[data.tag]" class="noc-vgis-hierarchy-icon" :src="modelMap[data.tag].icon"></el-image>
                            <el-image v-else-if="data.poi && modelMap[data.type]" class="noc-vgis-hierarchy-icon" :src="modelMap[data.type].icon"></el-image>
                            <span class="noc-vgis-hierarchy-name" style="flex-grow: 1;">{{data.name}}</span>
                        </div>
                    </div>
                </el-tree>
                <el-tree
                        v-show="modelView"
                        :expand-on-click-node="false"
                        v-loading="loading.hierarchy"
                        class="m-r-15"
                        draggable
                        :allow-drop="false"
                        default-expand-all
                        @node-click="filterByNode"
                        :data="models">
                    <div class="noc-vgis-hierarchy-item" slot-scope="{node, data}">
                        <div class="flex align-items-center justify-content-start" style="flex-grow: 1;">
                            <el-image class="noc-vgis-hierarchy-icon" :src="data.icon"></el-image>
                            <span class="noc-vgis-hierarchy-name" style="flex-grow: 1;">{{data.name}}</span>
                        </div>
                    </div>
                </el-tree>
            </div>
            <div class="noc-vgis-alert-detail">
                <div class="flex align-items-center justify-content-between">
                    <div>
                        <label class="m-r-10 text-primary">{{$t("label.alert.name")}}</label>
                        <el-cascader
                                v-model="filter.event.value"
                                :options="templateFilterData"
                                :props="{ value: 'id', label: 'name' }"
                                clearable
                                @change="getAlerts()"
                        >
                            <template slot-scope="{ node, data }">
                                <span>
                                    <span v-if="node.isLeaf" :style="{ 'border-radius': '50%', display: 'inline-block', background: data.color, width: '12px', height: '12px' }"></span>
                                    {{ data.name }}
                                </span>
                                <span v-if="!node.isLeaf && data.children.length > 0"> ({{ data.children.length }}) </span>
                                <span v-else-if="node.isLeaf"> ({{ data.level }}) </span>
                            </template>
                        </el-cascader>
                        <label class="m-l-20 m-r-10 text-primary">{{$t("label.alert.status")}}</label>
                        <el-select clearable v-model="filter.status.value" @change="getAlerts">
                            <el-option v-for="item in filter.status.candidates" :key="item.value" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <div>
                        <label class="m-r-10 text-primary">{{$t("label.alert.time")}}</label>
                        <el-date-picker type="datetime" v-model="filter.startAt" clearable @change="getAlerts"></el-date-picker>
                        ~
                        <el-date-picker type="datetime" v-model="filter.endAt" clearable @change="getAlerts"></el-date-picker>
                    </div>
                </div>
                <el-table v-loading="loading.alert" :data="alerts" header-cell-class-name="table-header-cell" cell-class-name="table-cell">
                    <el-table-column :label="$t('label.alert.name')">
                        <template slot-scope="{ row }">
                            <el-tag size="mini" :color="row.color" style="border: none;">
                                <span class="text-bold" :style="{ color: RGB2Gray(row.color) > 100 ? '#000000' : '#FFFFFF' }">{{row.name}}（{{row.level}}）</span>
                            </el-tag>
                            <div class="text-bold">{{row.subject}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="`${$t('label.alert.time')} & ${$t('label.alert.location')}`">
                        <template slot-scope="{ row }">
                            <div>{{new Date(row.createdAt).format('yyyy-MM-dd hh:mm:ss')}}</div>
                            <el-divider class="m-t-5 m-b-5"></el-divider>
                            <div v-for="(item, index) in getPath(row.model_instance.instanceId)" class="text-primary">
                                {{item.name}}
                                <span class="text-info" v-if="index !== getPath(row.model_instance.instanceId).length - 1">↴</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('label.alert.status')">
                        <template slot-scope="{ row }">
                            <div v-if="row.checked" class="text-success el-icon-circle-check"> {{$t('dict.alert.status.checked')}}</div>
                            <div v-else class="text-danger el-icon-question"> {{$t('dict.alert.status.active')}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('label.alert.content')">
                        <template slot-scope="{ row }">
                            {{row.content}}
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('label.basic.action')" v-if="validate($store.state.user, { resources: 'Alert', action: 'Admin' })">
                        <template slot-scope="{ row }">
                            <div v-if="!row.checked" class="m-b-5">
                                <el-button plain type="warning" size="mini" icon="el-icon-circle-check"> {{$t("action.alert.check")}}</el-button>
                            </div>
                            <div class="m-b-5">
                                <el-button plain type="warning" size="mini" class="el-icon-s-promotion"> {{$t("action.alert.sendEmail")}}</el-button>
                            </div>
                            <div class="m-b-5">
                                <el-button plain type="warning" size="mini" class="el-icon-s-comment"> {{$t("action.alert.sendSMS")}}</el-button>
                            </div>
                            <div>
                                <el-button plain type="warning" size="mini" class="el-icon-phone"> {{$t("action.alert.sendVoice")}}</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="text-center m-t-20">
                    <el-pagination :current-page="pagination.page" :page-count="pagination.total_page" @current-change="getAlerts"></el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import VgisBreadcrumb from "@/components/Standard/vgis-breadcrumb.vue";
    import { getAlertTemplateList } from "@/assets/js/api/alert_template";
    import { getModelList } from "@/assets/js/api/model";
    import { getHierarchy } from "@/assets/js/api/hierarchy";
    import { getAlertList } from "@/assets/js/api/alert";
    import { validate } from "@/utils";
    import { RGB2Gray } from "@/utils/color";

    export default {
        name: "AlertListPage",
        props: {

        },
        components: {
            VgisBreadcrumb
        },
        computed: {
            templateFilterData () {
                let templates = this.templates
                let models = Object.values(this.models), _models = models.reduce((result, item) => {
                    result[item.id] = item
                    item.children = []
                    return result
                }, {})
                for(let i = 0; i < templates.length; i++) {
                    _models[templates[i].modelId].children.push({
                        id: templates[i].name,
                        name: templates[i].name,
                        level: templates[i].level,
                        color: templates[i].color
                    })
                }
                return models.filter(item => item.children.length > 0)
            }
        },
        data () {
            return {
                navs: [{
                    name: this.$t("menu.home"),
                    url: '/admin'
                }, {
                    name: this.$t("menu.alert")
                }],
                loading: {
                    hierarchy: false,
                    alert: false
                },
                modelView: false,
                filter: {
                    cc: true,
                    query: "",
                    instanceId: "",
                    modelId: "",
                    status: {
                        value: "",
                        candidates: [{
                            name: this.$t('dict.alert.status.active'),
                            value: false
                        }, {
                            name: this.$t('dict.alert.status.checked'),
                            value: true
                        }]
                    },
                    event: {
                        value: "",
                        candidates: []
                    },
                    startAt: "",
                    endAt: ""
                },
                hierarchy: [],
                flatten: {},
                models: {},
                alerts: [],
                templates: [],
                pagination: {
                    page: 1,
                    total_page: 1,
                    total: 1,
                    pagination: 10
                },
            }
        },
        methods: {
            validate,
            RGB2Gray,
            filterByNode (node) {
                if (!node.tag) {
                    this.filter.instanceId = ""
                    this.filter.modelId = node.modelId
                }
                else if (node.poi) {
                    this.filter.instanceId = node.tag
                    this.filter.modelId = ""
                }
                else {
                    this.filter.instanceId = node.parentId
                    this.filter.modelId = node.tag
                }
                this.getAlerts()
            },
            getPath (instanceId) {
                let path = []
                while (this.flatten[instanceId]) {
                    path = [this.flatten[instanceId]].concat(path)
                    instanceId = this.flatten[instanceId].parentId
                }
                return path
            },
            getHierarchy () {
                this.loading.hierarchy = true

                function flattenData (forest, parentId = null) {
                    let result = {}
                    for(let i = 0; i < forest.length; i++) {
                        let tree = forest[i]
                        if (tree.poi) {
                            result[tree.tag] = tree
                        }
                        tree.parentId = parentId
                        if (tree.children && tree.children.length > 0) {
                            Object.assign(result, flattenData(tree.children, tree.poi ? tree.tag : parentId))
                        }
                    }
                    return result
                }

                getHierarchy().then(result => {
                    this.hierarchy = result.data
                    this.flatten = flattenData(result.data)
                    this.loading.hierarchy = false
                })
                getModelList({ flat: true }).then(result => {
                    this.models = result.data
                    this.modelMap = result.data.reduce((result, item) => {
                        result[item.modelId] = item
                        return result
                    }, {})
                })
            },
            getAlerts (page) {
                if (typeof page === "number") {
                    this.pagination.page = page
                }
                this.loading.alert = true
                console.log(this.filter.event.value)
                getAlertList(Object.assign({}, this.filter, {
                    status: this.filter.status.value,
                    event: this.filter.event.value[1],
                }, this.pagination)).then(result => {
                    this.alerts = result.data
                    this.pagination = result.pagination
                    this.loading.alert = false
                })
            },
            getAlertTemplates () {
                getAlertTemplateList().then(result => {
                    this.templates = result.data
                })
            }
        },
        created () {
            this.getHierarchy()
            this.getAlerts()
            this.getAlertTemplates()
        }
    }
</script>

<style scoped lang="scss">
.noc-vgis-alert-list {
    height: calc(100% - 20px);
    overflow-y: scroll;
    background: white;
    margin-right: 16px;
    width: 307px;
    flex-shrink: 0;
}

.noc-vgis-alert-detail {
    height: calc(100% - 20px);
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
</style>