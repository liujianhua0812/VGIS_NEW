<template>
  <div>
    <div class="full-w full-h" style="display: flex">
      <div class="treeList">
        <el-tree style="height: 100%;background: inherit" :highlight-current="true" :data="treeData"
                 :props="{label: 'name'}" :accordion="true"
                 @node-click="handleNodeClick" node-key="tag"
                 :auto-expand-parent="true"
                 :current-node-key="result.treeSelect?result.treeSelect.now:''"
                 :default-expanded-keys="(result.treeSelect&&result.treeSelect.parent)?[result.treeSelect.parent]:[result.treeSelect.now]">
        </el-tree>
      </div>
      <div class="selectView">
        <div class="titleView">
          <div class="tabs">
            <div class="tab pointer" :class="{active:select==='Basic'}" @click="clickTab('Basic')">Basic</div>
            <div class="tab pointer" :class="{active:select==='Attribute'}" @click="clickTab('Attribute')">Attribute
            </div>
            <div class="tab pointer" :class="{active:select==='Series'}" @click="clickTab('Series')">Series</div>
          </div>
          <div class="result">
            <span style="color: #4FACFF;margin-right: 10px">{{ result.name || '' }}</span>
            <span>{{ result.value || '' }}</span>
          </div>
        </div>
        <div class="viewData">
          <div v-show="select==='Basic'" style="height: 100%">
            <el-table  :data="AllData.basicData"
                      style="width: 100%;color: #000" height="430" @row-click="currentChange">
              <el-table-column
                label="Basic" reserve-selection>
                <template slot-scope="{row}">
                  <el-radio v-model="result.name" :label="row.name"></el-radio>
                </template>
              </el-table-column>

              <el-table-column
                prop="value"
                label="value">
              </el-table-column>
            </el-table>
          </div>
          <div v-show="select==='Attribute'" style="height: 100%">
            <div style="padding: 12px 0 0 12px">
              <el-select v-model="filters.attribute.label" multiple>
                <el-option v-for="label in labels" :key="label.id" :value="label.id" :label="label.name"></el-option>
              </el-select>
            </div>
            <el-table
                      :data="AllData.attributeData.filter(value => matchLabels(value.labels, filters.attribute.label))"
                      style="width: 100%;color: #000" height="378"
                      @row-click="currentChange">
              <el-table-column
                label="Attribute" reserve-selection>
                <template slot-scope="{row}">
                  <el-radio v-model="result.name" :label="row.name"></el-radio>
                </template>
              </el-table-column>
              <el-table-column

                label="value">
                <template slot-scope="{row}">

                  <div v-if="row.value">
                    {{ row.value }}{{ row.unit ? row.unit.name : '' }}
                  </div>
                  <div v-else style="color: #B3B3B3">
                    No data
                  </div>
                </template>
              </el-table-column>
              <el-table-column

                label="label">
                <template slot-scope="{ row }">
                  <el-tag class="m-l-5 m-r-5 m-b-5" size="small" v-for="tag in row.labels" :key="tag.id" type="primary">
                    {{ tag.name }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-show="select==='Series'" style="height: 100%">
            <div style="padding: 12px 0 0 12px">
              <el-select v-model="filters.series.label" multiple>
                <el-option v-for="label in labels" :key="label.id" :value="label.id" :label="label.name"></el-option>
              </el-select>
            </div>
            <el-table
                      :data="AllData.seriesData.filter(value => matchLabels(value.labels, filters.series.label))"
                      height="378" style="width: 100%;color: #000"
                      @row-click="currentChange">
              <el-table-column
                label="Name" reserve-selection>
                <template slot-scope="{row}">
                  <el-radio v-model="result.name" :label="row.name"></el-radio>
                </template>
              </el-table-column>
              <el-table-column
                label="value">
                <template slot-scope="{row}">
                  <div v-if="row.value">
                    {{ row.value }}{{ row.unit ? row.unit.name : '' }}
                  </div>
                  <div v-else style="color: #B3B3B3">
                    No data
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="label">
                <template slot-scope="{ row }">
                  <el-tag class="m-l-5 m-r-5 m-b-5" size="small" v-for="tag in row.labels" :key="tag.id" type="primary">
                    {{ tag.name }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div class="footerButton">
      <el-button type="primary" @click="next">Next</el-button>
    </div>
  </div>

</template>

<script>
import {
  getHierarchy,
  getMultipleSeriesLatestValues,
  getNodeDetail, getNodesByModel, getSeriesLatestValues,
  getStaticAttributeValues
} from "../../../assets/js/api/hierarchy.js"
import {getModelInstanceDetail, getModelInstanceList} from "../../../assets/js/api/model-instance";
import {getModelDetail, getModelList} from "../../../assets/js/api/model";
import {getLabelList} from "../../../assets/js/api/unit-label";

export default {
  name: "SelectDataView",
  props: {
    selected: Object,
  },
  data() {
    return {
      result: {},
      select: this.selected.assort || 'Basic',
      treeSelect: this.selected.treeSelect || {
        now: '',
        parent: ''
      },
      treeData: [],//树形结构
      labels: [],//筛选标签
      filters: { //筛选标签的数据
        series: {
          label: []
        },
        attribute: {
          label: []
        }
      },
      AllData: {//当前选中节点的数据
        basicData: [],
        attributeData: [],
        seriesData: []
      }
    }
  },
  methods: {
    currentChange(row) {
      this.result = row
      this.result.assort = this.select
      this.result.treeSelect = this.treeSelect
    },
    next() {
      if (this.result.name) {
        this.$emit('next', this.result)

      } else {
        this.$message.error('Please select the bound data');
      }

    },
    //通过label对数据筛选
    matchLabels(labels, references) {
      if (references.length === 0) return true
      let refs = references.reduce((result, id) => {
        result[id] = id
        return result
      }, {})
      for (let i = 0; i < labels.length; i++) {
        if (refs[labels[i].id]) return true
      }
      return false
    },
    getLabels() {
      getLabelList().then(result => {
        this.labels = result.data
      })
    },
    //点击左侧树显示右侧数据内容
    getViewData(tag) {
      getNodeDetail(tag).then((res) => {
        let attributeName = [], seriesName = []
        if (res.data) {
          const instanceId = res.data.instanceId
          res.data.attribute_values.map((item) => {
            attributeName.push(item.static_attribute.name)
          })
          res.data.model.time_series.map((item) => {
            seriesName.push(item.name)
          })
          //获取基础项
          let basicArr = [{name: 'Object name', value: res.data.name, dataType: 'String'}, {
            name: 'Object ID',
            value: res.data.instanceId,
            dataType: 'String'
          }]
          if (res.data.model) {
            basicArr.push({
              name: 'Model name',
              value: res.data.model.name,
              dataType: 'String'
            })
            basicArr.push({
              name: 'Model ID',
              value: res.data.model.modelId,
              dataType: 'String'
            })
          }
          this.AllData.basicData = basicArr
          //获取静态属性值
          if (attributeName.length) {

            getStaticAttributeValues(instanceId, attributeName).then((result) => {
              let obj = result.data.reduce((r, i) => {
                r[i.name] = i
                return r
              }, {})
              //将labels，value，name混合
              getModelDetail(res.data.model.id).then(result => {
                result.data.static_attributes.map(i => {
                  obj[i.name] = Object.assign({}, obj[i.name], i)
                })
                let arr = []
                for (let item in obj) {
                  if (obj[item].dataType === 'Integer') {
                    obj[item].value = parseInt(obj[item].value)
                  } else if (obj[item].dataType === 'Decimal') {
                    obj[item].value = parseFloat(obj[item].value).toFixed(obj[item].precision)
                  }
                  arr.push(obj[item])
                }
                this.AllData.attributeData = arr
                // console.log(this.AllData.attributeData, 'this.AllData.attributeData')
              })
            })
          } else {
            this.AllData.attributeData = []
          }
          //获取series属性值
          if (seriesName.length) {
            let now = new Date()
            getSeriesLatestValues(instanceId, seriesName, 'day', 'latest', now).then(result => {

              let obj = result.data.reduce((r, i) => {
                r[i.name] = i
                return r
              }, {})
              getModelDetail(res.data.model.id).then(result => {
                result.data.time_series.map(i => {
                  obj[i.name] = Object.assign({}, obj[i.name], i || {})
                })
                let arr = []
                for (let item in obj) {
                  if (obj[item].dataType === 'Integer') {
                    obj[item].value = parseInt(obj[item].value)
                  } else if (obj[item].dataType === 'Decimal') {
                    obj[item].value = parseFloat(obj[item].value).toFixed(obj[item].precision)
                  }
                  arr.push(obj[item])
                }
                this.AllData.seriesData = arr
                // console.log(this.AllData.seriesData, 'this.AllData.seriesData')
              })
            })
          } else {
            this.AllData.seriesData = []
          }
        } else {
          this.AllData.attributeData = []
          this.AllData.seriesData = []
          this.AllData.basicData = []
        }
      })
    },
    getData() {
      getHierarchy().then((res) => {
        this.treeData = res.data
      })

    },
    //切换tab
    clickTab(res) {
      this.select = res
    },
    handleNodeClick(data, node) {
      this.treeSelect.now = data.tag
      this.treeSelect.parent = node.parent.data.tag

      this.getViewData(data.tag)
    }
  },
  created() {
    this.result = this.selected
    this.getData()
    this.getLabels()

    if (this.selected.treeSelect) {
      this.getViewData(this.selected.treeSelect.now)
    }
  },
  beforeDestroy() {
    this.result = {}
  }
}
</script>

<style lang="scss" scoped>
* {

  font-family: 'HarmonyOS_Sans';
}

.footerButton {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.treeList {
  margin-right: 16px;
  padding: 15px;
  height: 500px;
  overflow-x: scroll;
  overflow-y: scroll;
  flex: 239;
  background: #F5F5F5;
  border-radius: 8px;
}

.selectView {
  padding: 13px;
  background: #F5F5F5;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  flex: 635;

  .titleView {
    height: 30px;
    width: 100%;
    display: flex;
    justify-content: space-between;

    .tabs {
      width: 100%;
      display: flex;
      justify-content: start;

      .tab {
        height: 100%;
        border-radius: 4px;
        padding: 3px 5px;
        text-align: center;
        margin-right: 10px;
        color: #4FACFF;
        border: 1px solid #4FACFF;

        &.active {
          color: #F5F5F5;
          background: #4FACFF;
        }
      }
    }

    .result {
      height: 100%;
      padding: 3px 5px;
      white-space: nowrap;
    }
  }

  .viewData {
    background: #ffffff;
    flex-grow: 1;
    width: 100%;
    border-radius: 4px;
    margin-top: 13px;
    overflow: hidden;
  }
}

:deep(.el-radio) {
  color: #000000;
  font-weight: 400;
}

:deep(.el-table th.el-table__cell > .cell) {
  font-family: 'HarmonyOS_Sans';
  font-style: normal;
  font-size: 16px;
  color: #000000;
}

:deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #000000
}

:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
  background: rgba(79, 172, 255, 0.05);;
  color: #4FACFF;
}
</style>
