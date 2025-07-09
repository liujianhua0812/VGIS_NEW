<template>
  <div class="flex" style="height: calc(100% - 22px);">
    <div id="dynamic_pid" class="dynamic_pid" ref="svgPid" v-html="PIDData.map"></div>
  </div>

</template>

<script>

import {getNodeDetail, getSeriesLatestValues, getStaticAttributeValues,getPID} from "../../../assets/js/api/hierarchy";

export default {
  name: "DynamicPID",
  props: {
    mapName: String,
    instanceId: String,
    dynamic: Boolean,
  },
  data() {
    return {
      loopIds: [],
      PIDData: {map: ''},
    };
  },
  components: {},
  computed: {},
  methods: {
    getPid() {
      getPID(this.instanceId, this.mapName).then(data => {
        this.PIDData = data.data
        let that = this
        this.$nextTick(() => {
          that.$refs.svgPid.children[0].setAttribute("width", '100%')
          that.$refs.svgPid.children[0].setAttribute("height", '100%')
          if(that.dynamic){
            that.mountDynamics()
          }
        })
      })
    },
    // 根据target中的映射关系对应数据 返回attribute的值
    selectSection(val, target) {
      // transform
      if (target.type) {
        let arr = target.data
        if (target.type === "CtoD") {
          let inputNum = Number(val)
          for (let item of arr) {
            if (!item.range[0] && inputNum <= item.range[1]) {
              return item.target
            }
            if (!item.range[1] && inputNum >= item.range[0]) {
              return item.target
            }
            if (inputNum >= item.range[0] && inputNum <= item.range[1]) {
              return item.target
            }
          }
          return target.default
        }
        if (target.type === "DtoD") {
          for (let item of arr) {
            if (item.source === val) {
              return item.target
            }
          }
          return target.default
        }
        if (target.type === "CtoC" || target.type === "Custom") {
          let cToCFunction = new Function('return ' + target.data)
          return cToCFunction()(val)
        }
      }
      // no transform
      else {
        return val
      }
    },
    // 给 svg 元素赋样式
    assignmentAttr(firstRelation, data) {
      let attrId = firstRelation.attribute.sourceId
      let relationAttr = firstRelation.attribute.name
      let attributeValue = this.selectSection(data, firstRelation.target)
      if (relationAttr === 'text') {
        let text = $(`#dynamic_pid #${this.escapeJquery(attrId)}`)[0]
        // text > tspan > t ...
        if (text.children.length) {
          text.children[0].innerHTML = attributeValue
        }
        // text > t
        else {
          text.innerHTML = attributeValue
        }
      } else {
        $(`#dynamic_pid #${this.escapeJquery(attrId)}`).attr(`${relationAttr}`, attributeValue)
      }
    },

    linkData(item) {
      if (item.attr('relations')) {
        let relationObj = JSON.parse(item.attr('relations'))
        for (let attrName in relationObj) {
          // relationObj[attrName] 即为 此 attrName 属性对应的 rules 数组
          // 如果数组不为空，则取第一条 rule 即下面的 firstRelation
          if (relationObj[attrName].length) {
            let firstRelation = relationObj[attrName][0]
            // 请求接口参数
            // instanceId : firstRelation.source.treeSelect.now
            // names : firstRelation.source.name
            let dataType = firstRelation.source.assort
            this[dataType](firstRelation)
            if (firstRelation.target.frequency && firstRelation.target.frequency.type) {
              let loopId = setInterval(() => {
                this[dataType](firstRelation)
              }, firstRelation.target.frequency.data * firstRelation.target.frequency.unit * 1000)
              this.loopIds.push(loopId)
            }
          }
        }
      }
    },
    escapeJquery(srcString) {
      // 转义之后的结果
      let resultStr = srcString;
      // jquery中的特殊字符
      let jquerySpecialChars = ["~", "`", "@", "#", "%", "&", "=", "'", "\"", ":", ";", "<", ">", ",", "/"];
      for (let i = 0; i < jquerySpecialChars.length; i++) {
        resultStr = resultStr.replace(new RegExp(jquerySpecialChars[i],
          "g"), "\\" + jquerySpecialChars[i]);
      }
      return resultStr;
    },
    mountDynamics() {
      let allEquipment = document.querySelectorAll('#dynamic_pid *')
      $.map(allEquipment, item => $(item)).reduce((result, item) => {
        this.linkData(item)
        return result
      }, {})
    },
    clearDynamics() {
      for (let item of this.loopIds) {
        clearInterval(item)
      }
    },
    Attribute(firstRelation) {
      console.log('attribute')
      getStaticAttributeValues(firstRelation.source.treeSelect.now, [firstRelation.source.name]).then(res => {
        console.log(res.data)
        let sendData = ''
        res.data.forEach(item => {
          if (item.name === firstRelation.source.name) {
            sendData = item.value
          }
        })
        this.assignmentAttr(firstRelation, sendData)
      })
    },
    Basic(firstRelation) {
      console.log('basic')
      getNodeDetail(firstRelation.source.treeSelect.now).then(res => {
        console.log(res.data)
        let labelMap = {
          'Object name': res.data.name,
          'Object ID': res.data.instanceId,
          'Model name': res.data.model.name || '',
          'Model ID': res.data.model.modelId || '',
        }
        this.assignmentAttr(firstRelation, labelMap[firstRelation.source.name])
      })
    },
    Series(firstRelation) {
      console.log('series')
      let date = new Date()
      getSeriesLatestValues(firstRelation.source.treeSelect.now, [firstRelation.source.name], 'day', 'latest', date).then(res => {
        console.log(res.data)
        this.assignmentAttr(firstRelation, res.data[0].value)
      })
    },
  },
  mounted() {
    this.getPid()
  },
  created() {

  },
  beforeDestroy() {
    this.clearDynamics()
  }
}
</script>

<style lang="scss" scoped>
.dynamic_pid {
  //background-color: #0a121e;
  overflow: hidden;
  width: 100%;
}
</style>


