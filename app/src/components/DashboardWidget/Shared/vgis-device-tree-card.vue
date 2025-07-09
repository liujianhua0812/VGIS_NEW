<template>
    <vgis-card title="设备选择器">
        <el-tree
            ref="tree"
            class="power-point-tree"
            node-key="id"
            default-expand-all
            show-checkbox
            :check-strictly="checkStrictly"
            :props="{ label: 'name', disabled: (data, node) => !data.poi }"
            :data="PointTree"
            @check="updateSelection"
        >
        </el-tree>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import { getHierarchy } from "@/assets/js/api/hierarchy";

export default {
    name: "vgis-device-tree-card",
    props: {
        value: {
            type: Array
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
                if (!this.value || this.value.length === 0) {
                    let firstPoint = this.getFirstPoint(this.PointTree)
                    if (firstPoint) {
                        this.$refs.tree.setCheckedKeys([firstPoint.label])
                        this.$emit("input", [firstPoint.label])
                    }
                }
                else {
                    this.$refs.tree.setCheckedKeys(this.value)
                }
            },
            deep: true
        }
    },
    data () {
        return {
            PointTree: []
        }
    },
    methods: {
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
        updateSelection (node, data) {
            if (this.multiple) {
                if (this.maxSelection > 0) {
                    let selections = data.checkedKeys.slice(data.checkedKeys.length - this.maxSelection)
                    this.$refs.tree.setCheckedKeys(selections)
                    this.$emit("input", selections)
                }
                else {
                    this.$emit("input", data.checkedKeys)
                }
            }
            else {
                let ids = data.checkedNodes.map(item => item.id)
                this.$refs.tree.setCheckedKeys(ids)
                this.$emit("input", ids)
            }
        },
        getHierarchy() {
            getHierarchy().then(result => {
                this.PointTree = result.data
            })
        }
    },
    mounted () {
        if (!this.value || this.value.length === 0) {
            let firstPoint = this.getFirstPoint(this.PointTree)
            if (firstPoint) {
                this.$refs.tree.setCheckedKeys([firstPoint.label])
                this.$emit("input", [firstPoint.label])
            }
        }
        else {
            this.$refs.tree.setCheckedKeys(this.value)
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