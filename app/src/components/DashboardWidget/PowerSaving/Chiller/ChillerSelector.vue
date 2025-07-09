<template>
    <div class="selectors">
        <div v-for="item in chillers" class="selector-item">
            <el-checkbox v-model="item.checked" @change="updateSelection(item)"></el-checkbox>
            {{item.name}}
        </div>
    </div>
</template>

<script>
import {getNodesByModel} from "@/assets/js/api/hierarchy";

export default {
    name: "ChillerSelector",
    props: {
        value: Array,
        preset: Array,
        least: {
            type: "Number",
            default: 5
        },
        defaultAll: {
            type: Boolean,
            default: true
        },
        multiple: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        preset: {
            handler (newValue) {
                this.getInstances()
            },
            deep: true
        }
    },
    data () {
        return {
            chillers: []
        }
    },
    methods: {
        updateSelection (item) {
            if (item && !this.multiple) {
                for(let i = 0; i < this.chillers.length; i++) {
                    this.chillers[i].checked = false
                }
                item.checked = true
            }
            this.$emit("input", this.chillers.filter(item => item.checked))
        },
        flushSelection () {
            if (!this.defaultAll) {
                let checkMap = this.value.reduce((result, item) => {
                    result[item] = true
                    return result
                }, {})
                for(let i = 0; i < this.chillers.length; i++) {
                    this.chillers[i].checked = !!checkMap[this.chillers[i].name]
                }
                if (this.multiple) {
                    for(let i = 0; i < Math.min(this.chillers.length, this.least); i++) {
                        this.chillers[i].checked = true
                    }
                }
                else if (this.chillers[0]) {
                    this.chillers[0].checked = true
                }
            }
            this.updateSelection()
        },
        getInstances () {
            if (this.preset) {
                this.chillers = this.preset.map(item => {
                    console.log(item)
                    return Object.assign({}, item, {checked: !!this.defaultAll})
                })
                this.flushSelection()
            }
            else {
                getNodesByModel("Chiller").then(result => {
                    this.chillers = result.data.map(item => {
                        item.checked = !!this.defaultAll
                        return item
                    })
                    this.flushSelection()
                })
            }
        }
    },
    created () {
        this.getInstances()
    }
}
</script>

<style lang="scss" scoped>
.selectors {
    display: flex;
    align-items: center;

    .selector-item {
        display: flex;
        align-items: center;
        margin-right: 16px;
        color: #FFFFFF;
        font-family: "HarmonyOS Sans SC";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 14px; /* 157.143% */

        .el-checkbox {
            margin-right: 8px;
        }
    }
}
</style>