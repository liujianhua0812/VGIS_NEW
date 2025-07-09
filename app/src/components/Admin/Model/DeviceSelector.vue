<template>
  <el-cascader
          clearable
          ref="selector"
          class="custom-selector"
          :disabled="disabled"
          :props="{ multiple, value: 'id', label: 'name', emitPath: false, checkStrictly: true }"
          v-model="value"
          placeholder="选择设备"
          :size="size" :options="PointTree"
          @change="updateSelection"
          @clear="updateSelection"
  >
      <template slot-scope="{ node, data }">
          <span :class="{ 'text-danger': data.special }">{{ data.name }}</span>
      </template>
  </el-cascader>
</template>

<script>
import { getHierarchy } from "@/assets/js/api/hierarchy";
import {getModelInstanceList} from "@/assets/js/api/model-instance";

export default {
    name: "DeviceSelector",
    props: {
        modelId: {
            type: String
        },
        value: {
            type: [Array, String]
        },
        size: {
            type: String
        },
        multiple: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        extra: {
            type: Array
        }
    },
    watch: {
        modelId (newValue) {
            this.getHierarchy()
        }
    },
    data () {
        return {
            selected: "",
            PointTree: []
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
            if (this.modelId) {
                getModelInstanceList(this.modelId).then(result => {
                    this.PointTree = result.data.map(item => {
                        item.disabled = false
                        return item
                    }).concat((this.extra || []).map(item => {
                        item.disabled = false
                        item.special = true
                        return item
                    }))
                })
            }
            else {
                getHierarchy().then(result => {
                    this.constructPointTree(result.data)
                    this.PointTree = result.data
                })
            }
        },
        constructPointTree (tree, seriesMap) {
            for(let i = 0; i < tree.length; i++) {
                let node = tree[i]
                node.disabled = !node.poi
                if (node.children) {
                    this.constructPointTree(node.children, seriesMap)
                }
            }
        },
        updateSelection () {
            this.$emit("input", this.value)
        }
    },
    created() {
      this.getHierarchy()
    }
}
</script>

<style scoped>

</style>