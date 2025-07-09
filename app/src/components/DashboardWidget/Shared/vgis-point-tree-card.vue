<template>
    <vgis-card title="点位选择器">
        <el-tree
            ref="tree"
            class="power-point-tree"
            node-key="id"
            default-expand-all
            :check-strictly="checkStrictly"
            :props="{ label: 'name', disabled: (data, node) => data.disabled }"
            :data="PointTree"
            @check="updateSelection"
        >
            <div slot-scope="{ node, data }" class="tree-node">
                <el-checkbox v-if="!node.disabled" v-model="data.checked" @change="updateSelection(data)"></el-checkbox>
                {{ node.label }}
            </div>
        </el-tree>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import {getHierarchy, getHierarchySeries} from "@/assets/js/api/hierarchy";

export default {
    name: "vgis-point-tree-card",
    props: {
        value: {
            type: [Array, Object]
        },
        multiple: {
            type: Boolean,
            default: false
        },
        maxSelection: {
            type: Number
        },
        checkStrictly: {
            type: Boolean,
            default: false
        }
    },
    components: {
        VgisCard
    },
    watch: {
        value: {
            handler (newValue) {
                // if (!newValue || newValue.length === 0) {
                //     let firstPoint = this.getFirstPoint(this.PointTree)
                //     if (firstPoint) {
                //         this.$refs.tree.setCheckedKeys([firstPoint.id])
                //         this.$emit("input", [firstPoint.id])
                //     }
                // }
                // else {
                //     this.$refs.tree.setCheckedKeys(newValue)
                // }
            },
            deep: true
        },
        maxSelection (newValue) {
            if (this.selection.length > newValue) {
                this.selection = this.selection.slice(this.selection.length - newValue)
                this.clearSelection(this.PointTree)
                for(let i = 0; i < this.selection.length; i++) {
                    this.selection[i].checked = true
                }
                this.$emit("input", this.selection)
            }
        }
    },
    data () {
        return {
            PointTree: this.leafOnly([]),
            selection: [],
            seriesMap: {}
        }
    },
    methods: {
        leafOnly (arr) {
            for(let i = 0; i < arr.length; i++) {
                arr[i].disabled = arr[i].type !== "point"
                arr[i].checked = false
                if (arr[i].children) {
                    arr[i].children = this.leafOnly(arr[i].children)
                }
            }
            return arr
        },
        getFirstPoint (arr) {
            for(let i = 0; i < arr.length; i++) {
                if (arr[i].type === "point") {
                    return arr[i]
                }
                else if (arr[i].children) {
                    return this.getFirstPoint(arr[i].children)
                }
            }
            return null
        },
        getHierarchy () {
            Promise.all([
                getHierarchy(),
                getHierarchySeries()
            ]).then(results => {
                this.seriesMap = results[1].data.reduce((res, series) => {
                    res[series.id] = series
                    return res
                }, {})
                this.constructPointTree(results[0].data, results[1].data.reduce((res, series) => {
                    if (!res[series.modelId]) {
                        res[series.modelId] = []
                    }
                    res[series.modelId].push(series)
                    return res
                }, {}))
                this.PointTree = this.leafOnly(results[0].data)
            })
        },
        constructPointTree (tree, seriesMap) {
            for(let i = 0; i < tree.length; i++) {
                let node = tree[i]
                if (node.children) {
                    this.constructPointTree(node.children, seriesMap)
                }
                if (node.poi && node.modelId && seriesMap[node.modelId]) {
                    let series = JSON.parse(JSON.stringify(seriesMap[node.modelId])).map(item => {
                        item.instanceId = node.id
                        item.type = "point"
                        return item
                    })
                    if (!node.children) {
                        node.children = series
                    }
                    else {
                        node.children = series.concat(node.children)
                    }
                }
            }
        },
        clearSelection (tree) {
            for(let i = 0; i < tree.length; i++) {
                tree[i].checked = false
                if (tree[i].children && tree[i].children.length > 0) {
                    this.clearSelection(tree[i].children)
                }
            }
        },
        updateSelection (data) {
            if (this.multiple) {
                if (data.checked) {
                    this.selection.push(data)
                }
                else {
                    this.selection = this.selection.filter(item => item.id !== data.id)
                }
                if (this.selection.length > this.maxSelection) {
                    this.selection = this.selection.slice(this.selection.length - this.maxSelection)
                    this.clearSelection(this.PointTree)
                    for(let i = 0; i < this.selection.length; i++) {
                        this.selection[i].checked = true
                    }
                }
                this.$emit("input", this.selection)
            }
            else {
                this.clearSelection(this.PointTree)
                data.checked = true
                this.$emit("input", data.checked ? data : null)
            }
        }
    },
    created() {
        this.getHierarchy()
    }
}
</script>

<style scoped>
    .power-point-tree {
        background: transparent;

        .el-tree-node__content:hover {
            background: rgba(255, 255, 255, 0.1);
            .el-tree-node__label {
                color: #1890FF;
            }
        }

        .el-tree-node__label {
            color: #FFFFFF;
        }

        .tree-node {
            color: #FFFFFF;
            font-family: "HarmonyOS Sans SC";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
        }
    }
</style>