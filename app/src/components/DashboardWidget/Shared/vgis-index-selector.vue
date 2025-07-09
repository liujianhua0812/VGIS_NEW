<template>
  <el-cascader clearable @clear="updateSelection" class="custom-selector" :props="props" v-model="value" placeholder="选择年份" size="mini" :options="PointTree" @change="updateSelection"></el-cascader>
</template>

<script>
import {getHierarchy, getHierarchySeries} from "@/assets/js/api/hierarchy";

export default {
    name: "vgis-index-selector",
    props: {
        value: {
            type: Array
        }
    },
    data () {
        return {
            props: {
                label: "name",
                value: "id"
            },
            PointTree: []
        }
    },
    methods: {
        updateSelection() {
            this.$emit("input", this.value)
        },
        leafOnly(arr) {
            for (let i = 0; i < arr.length; i++) {
                arr[i].checked = false
                if (arr[i].children) {
                    arr[i].children = this.leafOnly(arr[i].children)
                }
            }
            return arr
        },
        getHierarchy() {
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
        constructPointTree(tree, seriesMap) {
            for (let i = 0; i < tree.length; i++) {
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
                    } else {
                        node.children = series.concat(node.children)
                    }
                }
            }
        },
    },
    created() {
        this.getHierarchy()
    }
}
</script>

<style lang="scss">
  .custom-selector {

    input {
      border-radius: 2px;
      border: 1px solid #0050B3;
      background: #003A8C;
      color: var(--Neutral-6, #BFBFBF);
      font-family: "HarmonyOS Sans SC";
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
    }
  }
</style>