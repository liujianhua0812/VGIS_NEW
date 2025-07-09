<template>
    <el-cascader
            clearable
            ref="cascader"
            class="custom-selector"
            :props="{ multiple, value: 'id', label: 'name', lazyLoad: loadChildren, lazy: true, emitPath: false, checkStrictly: true }"
            v-model="selectedId"
            placeholder="选择设备"
            :disabled="disabled"
            :size="size" :options="PointTree"
            @change="updateSelection"
            @clear="updateSelection"
    >
    </el-cascader>
</template>

<script>
import {getModelList} from "@/assets/js/api/model";
import {getTimeSeriesList} from "@/assets/js/api/model-series";

export default {
    name: "PointSelector",
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        value: {
            type: Array
        },
        size: {
            type: String
        },
        multiple: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            selectedId: "",
            PointTree: []
        }
    },
    methods: {
        leafOnly(arr) {
            for (let i = 0; i < arr.length; i++) {
                arr[i].disabled = arr[i].type !== "point"
                if (arr[i].children) {
                    arr[i].children = this.leafOnly(arr[i].children)
                }
            }
            return arr
        },
        loadChildren(node, resolve) {
            if (node.data && node.data.type === "ModelGroup") {
                return resolve([])
            }
            else if (node.data && node.data.type === "Model") {
                if (!node.data.childrenLoaded) {
                    getTimeSeriesList(node.data.id).then(result => {
                        node.data.childrenLoaded = true
                        return resolve(result.data.map(item => {
                            item.type = "Series"
                            item.disabled = false
                            item.children = null
                            item.leaf = true
                            return item
                        }))
                    })
                }
                else {
                    return resolve([])
                }
            } else if (node.data && node.data.type === "Series") {
                return resolve([])
            }
        },
        getModelList() {
            getModelList().then(result => {
                this.constructPointTree(result.data)
                this.PointTree = result.data
                this.flushValue()
            })
        },
        constructPointTree(tree, seriesMap) {
            for (let i = 0; i < tree.length; i++) {
                let node = tree[i]
                node.disabled = true
                if (node.children) {
                    this.constructPointTree(node.children, seriesMap)
                }
            }
        },
        updateSelection() {
            let nodes = this.$refs.cascader.getCheckedNodes()
            if (this.multiple) {
                this.$emit("input", nodes.map(node => [node.data.modelId, node.data.id]))
            } else {
                let node = nodes[0]
                this.$emit("input", node ? [node.data.modelId, node.data.id] : null)
            }
        },
        findNode (tree, id) {
            for(let i = 0; i < tree.length; i++) {
                if (tree[i].id === id) {
                    return tree[i]
                }
                else if (tree[i].children && tree[i].children.length > 0) {
                    let item = this.findNode(tree[i].children, id)
                    if (item) {
                        return item
                    }
                }
            }
            return null
        },
        flushValue () {
            this.selectedId = this.multiple ? [] : ""
            if (this.multiple) {

            }
            else {
                let [modelId, seriesId] = this.value
                let item = this.findNode(this.PointTree, modelId)
                if (item) {
                    item.childrenLoaded = true
                    getTimeSeriesList(item.id).then(result => {
                        item.children = result.data.map(item => {
                            item.type = "Series"
                            item.disabled = false
                            item.children = null
                            item.leaf = true
                            return item
                        })
                    })
                }
                this.selectedId = this.value ? this.value[1] : ""
            }
        }
    },
    created() {
        this.getModelList()
    }
}
</script>

<style scoped>

</style>