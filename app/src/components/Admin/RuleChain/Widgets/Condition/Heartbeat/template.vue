<template>
    <div class="flex align-items-center flex-column">
        <h3 class="text-bold" :style="{ color }">{{label}}</h3>
        <div class="output-indicator">
            <div class="m-b-5 text-primary">{{$t('dict.bool.true')}}</div>
            <div class="text-info">{{$t('dict.bool.false')}}</div>
        </div>
    </div>
</template>

<script>

import {getNodeDetail} from "@/assets/js/api/hierarchy";
import {getModelDetail} from "@/assets/js/api/model";

export default {
    name: "HeartbeatTemplate",
    props: {
        label: String,
        color: String
    },
    data() {
        return {
            dVisibility: false,
            nodeConfig: {
                thresholds: [{
                    period: 1,
                    _period: 1,
                    unit: 1,
                }]
            },
            model: {
                static_attributes: [],
                time_series: []
            },
            cascaderData: []
        }
    },
    i18n: {
        messages: {
            en: {
                form: {
                    field: {
                        label: "Field",
                        placeholder: "Please specify a field."
                    },
                    min: {
                        label: "Minimum",
                    },
                    max: {
                        label: "Maximum"
                    },
                    relation: {
                        label: "Relation"
                    }
                }
            },
            cn: {
                form: {
                    field: {
                        label: "项目",
                        placeholder: "请选择判断项目"
                    },
                    min: {
                        label: "最小值",
                    },
                    max: {
                        label: "最大值"
                    },
                    relation: {
                        label: "与其他阈值的关系"
                    }
                }
            }
        }
    },
    methods: {
        editConfig () {
            this.dVisibility = true
        },
        close () {
            this.dVisibility = false
        },
        addThreshold () {
            this.nodeConfig.thresholds = this.nodeConfig.thresholds.concat([{
                field: "",
                min: '',
                max: '',
                relation: "Or",
                _field: {}
            }])
        },
        selectField () {
            for(let i = 0; i < this.nodeConfig.thresholds.length; i++) {
                let threshold = this.nodeConfig.thresholds[i]
                let field = threshold.field
                if (field[0] === "attr_") {
                    threshold._field = this.model.static_attributes.find(item => item.id === field[1])
                }
                else if (field[0] === "series_") {
                    threshold._field = this.model.time_series.find(item => item.id === field[1])
                }
                else {
                    threshold._field = {}
                }
            }
        },
        getNode () {
            getModelDetail(this.$route.params.modelId).then(result => {
                this.model = result.data
                this.cascaderData = [{
                    value: "attr_",
                    label: this.$t("label.model.attribute"),
                    children: result.data.static_attributes.map(item => ({
                        label: item.name,
                        value: item.id
                    }))
                }, {
                    value: "series_",
                    label: this.$t("label.model.series"),
                    children: result.data.time_series.map(item => ({
                        label: item.name,
                        value: item.id
                    }))
                }]
            })
        }
    },
    created() {
        this.getNode()
    }
}
</script>

<style lang="scss" scoped>
.output-indicator {
    position: absolute;
    right: 15px;
    top: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
}
</style>
