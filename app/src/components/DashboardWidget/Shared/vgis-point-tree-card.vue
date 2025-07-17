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
            show-checkbox
            @check="handleCheck"
        >
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
            type: Array,
            default: () => []
        },
        multiple: {
            type: Boolean,
            default: true
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
                this.updateTreeSelection(newValue);
            },
            deep: true,
            immediate: true
        }
    },
    data () {
        return {
            PointTree: [],
            seriesMap: {}
        }
    },
    methods: {
        leafOnly (arr) {
            for(let i = 0; i < arr.length; i++) {
                arr[i].disabled = arr[i].type !== "point"
                if (arr[i].children) {
                    arr[i].children = this.leafOnly(arr[i].children)
                }
            }
            return arr
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
                // 数据加载完成后，设置初始选中状态
                this.$nextTick(() => {
                    this.updateTreeSelection(this.value);
                });
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
        updateTreeSelection(selectedPoints) {
            if (this.$refs.tree && Array.isArray(selectedPoints)) {
                const checkedKeys = selectedPoints.map(point => point.id);
                this.$refs.tree.setCheckedKeys(checkedKeys);
            }
        },
        handleCheck(data, checkedInfo) {
            // 获取所有选中的节点
            const checkedNodes = checkedInfo.checkedNodes.filter(node => node.type === 'point');
            
            // 如果设置了最大选择数量限制
            if (this.maxSelection && checkedNodes.length > this.maxSelection) {
                // 保留最后选择的maxSelection个节点
                const limitedNodes = checkedNodes.slice(-this.maxSelection);
                this.$refs.tree.setCheckedKeys(limitedNodes.map(node => node.id));
                this.$emit("input", limitedNodes);
            } else {
                this.$emit("input", checkedNodes);
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
    }
</style>