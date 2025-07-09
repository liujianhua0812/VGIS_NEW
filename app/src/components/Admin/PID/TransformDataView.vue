<template>
  <div class="full-h full-w">
    <div class="titleData">
      <div class="Source">
        <div class="li blue">Source</div>
        <div class="li enable">{{ source.name }}</div>
        <div class="li enable">{{ source.unit ? source.unit.name : '' }}</div>
        <div class="li enable">{{ source.dataType }}</div>
        <div class="li enable">{{ source.value }}</div>
      </div>
      <div class="Target">
        <div class="li blue">Target</div>
        <div class="li">{{ info.name }}</div>
        <div class="li">{{ info.value }}</div>
        <div class="li"></div>
        <div class="li"></div>
      </div>
    </div>
    <div class="bacgroundTra">
      <span class="titleTime">Transform:</span>
      <el-radio v-model="showMore" :label="false">No</el-radio>
      <el-radio v-model="showMore" :label="true">Yes</el-radio>
      <div class="realtimeButton">
        <span class="titleTime">Real time: </span>
        <el-radio v-model="realTime.type" :label="false">No</el-radio>
        <el-radio v-model="realTime.type" :label="true">Yes</el-radio>
        <span class="titleTime">Interval: </span>
        <el-input v-model="realTime.data" class="inputSelect" style="width: 300px;" type="number" min="0" :disabled="!realTime.type">
          <el-select v-model="realTime.unit" slot="append"
                     style="width: 100px" :disabled="!realTime.type">
            <el-option label="Second" value="1"></el-option>
            <el-option label="Minute" value="60"></el-option>
            <el-option label="Hour" value="3600"></el-option>
          </el-select>
        </el-input>

      </div>

      <div v-if="showMore" class="ruleView">
        <div class="tabs">
          <div class="tab pointer" :class="{active:select==='DtoD'}" @click="clickTab('DtoD')">Discrete > Discrete</div>
          <div v-if="!isDiscrete(source.dataType)" class="tab pointer" :class="{active:select==='CtoD'}"
               @click="clickTab('CtoD')">Continues > Discrete
          </div>
          <div v-if="!isDiscrete(source.dataType)&&!isDiscrete(info.name)" class="tab pointer"
               :class="{active:select==='CtoC'}" @click="clickTab('CtoC')">Continues > Continues
          </div>
          <div class="tab pointer" :class="{active:select==='Custom'}" @click="clickTab('Custom')">Custom</div>
        </div>
        <div class="head" v-if="select==='DtoD'||select==='CtoD'">
          <!--          默认数据-->
          <div class="leftHead" >
            <div class="titleDefault">Default</div>
            <div v-if="info.name==='fill'||info.name==='color'" class="defaultData">
              <el-color-picker v-model="defaultVal" show-alpha :predefine="predefineColors"></el-color-picker>
              <el-input v-model="defaultVal" :readonly="true"></el-input>
            </div>
            <div v-else-if="info.name==='visibility'" class="defaultData">
              <el-select v-model="defaultVal">
                <el-option label="visible" value="visible"></el-option>
                <el-option label="hidden" value="hidden"></el-option>
                <el-option label="collapse" value="collapse"></el-option>
                <el-option label="inherit" value="inherit"></el-option>
              </el-select>
            </div>
            <div v-else class="defaultData">
              <el-input v-model="defaultVal" placeholder="NULL" >
              </el-input>
            </div>
          </div>
        </div>
        <div v-show="select==='DtoD'" class="rules">
          <div v-for="(item,index) in ruleData.dd" :key="index" class="rule">
            <!--              左侧列表-->
            <div v-if="source.dataType==='Enum'" style="flex: 9;">
              <el-select v-model="item.source" clearable filterable allow-create class="full-w full-h">
                <el-option v-for="i in source.candidate" :label="i" :value="i"></el-option>
              </el-select>
            </div>
            <div v-else-if="source.dataType==='Boolean'" style="flex: 9;">
              <el-select v-model="item.source" class="full-w full-h">
                <el-option label="No" :value="false"></el-option>
                <el-option label="Yes" :value="true"></el-option>
              </el-select>
            </div>
            <div v-else-if="source.dataType==='String'||source.dataType==='Text'" style="flex: 9;">
              <el-select v-model="item.source" clearable filterable allow-create class="full-w full-h">
                <!--                历史数据获取-->
                <el-option v-for="item in sourceHistory" :label="item" :value="item"></el-option>
              </el-select>
            </div>
            <div v-else-if="source.dataType==='Integer'||source.dataType==='Decimal'" style="flex: 9;">
              <el-input v-model="item.source" type="number"></el-input>
            </div>
            <div v-else style="flex: 9;">
              <el-input v-model="item.source"></el-input>
            </div>

            <span class="blue el-icon-arrow-right fontCD"></span>
            <!--              右侧列表-->
            <div v-if="info.name==='fill'||info.name==='color'" style="display: flex;flex: 9">
              <el-color-picker v-model="item.target" show-alpha :predefine="predefineColors"></el-color-picker>
              <el-input v-model="item.target" :readonly="true"></el-input>
            </div>
            <div v-else-if="info.name==='visibility'" style="display: flex;flex: 9">
              <el-select v-model="item.target">
                <el-option label="visible" value="visible"></el-option>
                <el-option label="hidden" value="hidden"></el-option>
                <el-option label="collapse" value="collapse"></el-option>
                <el-option label="inherit" value="inherit"></el-option>
              </el-select>
            </div>
            <div v-else style="display: flex;flex: 9">
              <el-input v-model="item.target"></el-input>
            </div>

            <div v-if="index>0" @click="deleteRules(ruleData.dd,index)" class="el-icon-delete blue pointer"></div>
            <div v-else class="blue"></div>
          </div>
          <div :class="rule?'green':'red'">{{ rule ? '√ Correct' : '! Error' }}</div>
          <el-button type="primary" @click="addRules('DtoD')">Add</el-button>
        </div>
        <div v-show="select==='CtoD'" class="rules">
          <div class="rule" v-for="(item,index) in ruleData.cd" :key="index">
            <div class="range">
              <span class="blue fontCD">[</span>
              <el-input v-model="item.range[0]" type="number"></el-input>
              <span class="fontCD">,</span>
              <el-input v-model="item.range[1]" type="number"></el-input>
              <span class="blue fontCD">]</span>
            </div>
            <span class="blue el-icon-arrow-right fontCD"></span>

            <div v-if="info.name==='fill'||info.name==='color'" style="display: flex;flex: 9">
              <el-color-picker v-model="item.target" show-alpha :predefine="predefineColors"></el-color-picker>
              <el-input v-model="item.target" :readonly="true"></el-input>
            </div>
            <div v-else-if="info.name==='visibility'" style="display: flex;flex: 9">
              <el-select v-model="item.target">
                <el-option label="visible" value="visible"></el-option>
                <el-option label="hidden" value="hidden"></el-option>
                <el-option label="collapse" value="collapse"></el-option>
                <el-option label="inherit" value="inherit"></el-option>
              </el-select>
            </div>
            <div v-else style="display: flex;flex: 9">
              <el-input v-model="item.target"></el-input>
            </div>

            <div v-if="index>0" @click="deleteRules(ruleData.cd,index)" class="el-icon-delete blue pointer"></div>
            <div v-else class="blue"></div>
          </div>
          <div :class="rule?'green':'red'">{{ rule ? '√ Correct' : '! Error' }}</div>
          <el-button type="primary" @click="addRules('CtoD')">Add</el-button>
        </div>
        <div v-show="select==='CtoC'" class="rules" style="display: flex;">
          <div style="white-space: nowrap;margin-right: 10px"><span>{{ info.name }} = </span></div>
          <div style="flex-grow: 1">
            <el-input
              type="textarea"
              :rows="3"
              :placeholder="ruleData.cc||`请输入算术表达式，变量名为value，例：value+1`"
              v-model="ruleData.cc">
            </el-input>
            <div :class="rule?'green':'red'">{{ rule ? '√ Correct' : '! Error' }}</div>
          </div>

        </div>
        <div v-show="select==='Custom'" class="rules">
          <el-input
            type="textarea"
            :rows="15"
            :placeholder="ruleData.c||`请输入function(value)js表达式，入参变量为value，输出为result
            例：var a=1;
             result=value*a`"
            v-model="ruleData.c">
          </el-input>
          <div :class="rule?'green':'red'">{{ rule ? '√ Correct' : '! Error' }}</div>
        </div>
      </div>
    </div>
    <div class="footerButton">
      <el-button style="color:#4FACFF;border-color:#4FACFF;" @click="back">Back</el-button>
      <el-button type="primary" @click="finished">Finish</el-button>
    </div>
  </div>
</template>

<script>

import {getSeriesDomain} from "../../../assets/js/api/model-instance-series";

export default {
  name: "TransformDataView",
  props: {
    source: Object,
    info: Object,
    editData: Object,
  },
  components: {},
  data() {
    return {
      predefineColors: ['#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'],
      sourceHistory: [],
      defaultVal: this.editData.default || '',
      select: this.editData.type || 'DtoD',
      ruleData: {
        dd: (this.editData.type && this.editData.type === 'DtoD') ? this.editData.data : [{
          source: "",
          target: ''
        }],
        cd: (this.editData.type && this.editData.type === 'CtoD') ? this.editData.data : [{
          range: ['', ''],
          target: ''
        }],
        cc: (this.editData.type && this.editData.type === 'CtoC') ? this.editData.prev : '',
        c: (this.editData.type && this.editData.type === 'Custom') ? this.editData.prev : ''
      },
      rule: false, //内容判断
      showMore: !!this.editData.type,
      realTime: {

      },
      result: {}
    }
  },
  watch: {
    select(newVal, oldVal) {
      if (newVal === 'DtoD') {
        this.rule = this.determineInput(this.ruleData.dd)
      }
      if (newVal === 'CtoD') {
        this.rule = this.determineInputArr(this.ruleData.cd)
      }
      if (newVal === 'CtoC') {
        this.rule = this.determineExpression(this.ruleData.cc)
      }
      if (this.select === 'Custom') {
        this.rule = this.determineExpression(this.ruleData.c)
      }
    },
    ruleData: {
      handler(newVal, oldVal) {
        if (this.select === 'DtoD') {
          this.rule = this.determineInput(newVal.dd)
        }
        if (this.select === 'CtoD') {
          this.rule = this.determineInputArr(newVal.cd)
        }
        if (this.select === 'CtoC') {
          this.rule = this.determineExpression(newVal.cc)
        }
        if (this.select === 'Custom') {
          this.rule = this.determineExpression(newVal.c)
        }
      },
      deep: true
    },
    source() {
      if (this.source.assort === 'Series' && this.source.dataType !== "Decimal" && this.source.dataType !== "Integer") {
        getSeriesDomain(this.source.modelId, this.source.treeSelect.now, this.source.id).then((res) => {
            this.sourceHistory=res.data
          }
        )
      }

      //绑定数据刷新，清空编辑规则
      this.ruleData = {
        dd: [{
          source: "",
          target: ''
        }],
        cd: [{
          range: ['', ''],
          target: ''
        }],
        cc: '',
        c: ''
      }
    }
  },
  methods: {
    //DtoD规则判定
    determineInput(obj) {
      for (let item of obj) {
        if (!item.source || !item.target) {
          return false
        }
      }
      return true
    },
    //CtoD规则判定
    determineInputArr(obj) {
      for (let i = 0; i < obj.length; i++) {
        if (!obj[i].target) {
          return false
        }
        if (!obj[i].range[0] && !obj[i].range[1]) {
          return false
        }
        if (obj[i].range[0] >= obj[i].range[1] && obj[i].range[1]) {
          return false
        }

      }
      return true
    },
    //判断离散数据
    isDiscrete(target) {
      if (target === 'Integer' || target === 'Decimal' || target === 'x' || target === 'y' || target === 'width' || target === 'height' || target === 'rotate') {
        return false
      } else {
        return true
      }
    },
    //添加新列表规则
    addRules(type) {
      if (type === 'DtoD') {
        this.ruleData.dd.push({
          name: "",
          target: ''
        })
      }
      if (type === 'CtoD') {
        this.ruleData.cd.push({
          range: ["", ""],
          target: ''
        })
      }
    },
    //删除某行规则
    deleteRules(arr, index) {
      setTimeout(() => {
        arr.splice(index, 1)
      }, 1)
    },
    //CtoC和Custom规则格式判定
    determineExpression(expression) {
      if(!expression){
        return false
      }
      try {
        let result = '', value = Number(this.source.value);
        eval(expression)
        return true
      } catch (e) {
        return false
      }
    },
    //返回上层
    back() {
      this.$emit('back')
    },
    //确定最终传输结果
    finished() {
      //将之前传入的绑定数据和属性数据放入result
      this.result = {
        attribute: this.info,
        source: this.source,
        target:{
          frequency: this.realTime,
        }
      }
      //断是否需要transform
      if (this.showMore) {
        //transform为yes
        //判断绑定的数据类型分四类，传四种不同的数据
        switch (this.select) {
          case "DtoD":
            if (this.rule && this.ruleData.dd) {
              this.result.target = {
                type: 'DtoD',
                default: this.defaultVal||this.info.value,
                frequency: this.realTime,
                data: this.ruleData.dd,
              }
              this.$emit('finished', this.result)
            } else {
              this.$message.error('Please corrects expression');
            }
            break;
          case "CtoD":
            if (this.rule && this.ruleData.cd) {
              this.result.target = {
                type: 'CtoD',
                default: this.defaultVal||this.info.value,
                frequency: this.realTime,
                data: this.ruleData.cd,
              }
              this.$emit('finished', this.result)
            } else {
              this.$message.error('Please corrects expression');
            }
            break;
          case "CtoC":
            if (this.rule && this.ruleData.cc) {
              this.result.target = {
                type: 'CtoC',
                frequency: this.realTime,
                prev:this.ruleData.cc,
                data: `function a(value){
                value=Number(value)
                return ${this.ruleData.cc}
                }`
              }
              this.$emit('finished', this.result)
            } else {
              this.$message.error('Please corrects expression');
            }
            break;
          case "Custom":
            if (this.rule && this.ruleData.c) {
              this.result.target = {
                type: 'Custom',
                frequency: this.realTime,
                prev: this.ruleData.c,
                data: `function a(value){
                let result=''
                ${this.ruleData.c}
                return result
                }`
              }
              this.$emit('finished', this.result)
            } else {
              this.$message.error('Please corrects expression');
            }
            break;
        }
      }else{
        this.$emit('finished', this.result)
      }
    },
    clickTab(str) {
      this.select = str
    }
  },
  created() {
    this.realTime=Object.assign({type: false,
      data: '1',
      unit: '1'},this.editData.frequency||{})
    if (this.editData.type === 'DtoD') {
      this.rule = this.determineInput(this.ruleData.dd)
    }
    if (this.editData.type === 'CtoD') {
      this.rule = this.determineInputArr(this.ruleData.cd)
    }
    if (this.editData.type === 'CtoC') {
      this.rule = this.determineExpression(this.ruleData.cc)
    }
    if (this.editData.type === 'Custom') {
      this.rule = this.determineExpression(this.ruleData.c)
    }
  }
}
</script>

<style lang="scss" scoped>
* {

  font-family: 'HarmonyOS_Sans';
}

.fontCD {
  font-size: 25px;
  padding: 0 4px;
}

.footerButton {
  display: flex;
  justify-content: center;
  padding: 20px;
}


.titleData {
  background: #F5F5F5;
  width: 100%;
  border-radius: 8px;
  margin-bottom: 12px;
  padding: 9px 20px;

  .blue {
    color: #4FACFF;
  }

  .enable {
    color: #B3B3B3;;
  }

  .Source {
    display: flex;
    width: 100%;
    justify-content: space-between;
    border-bottom: 1px solid #D4D4D4;
    margin-bottom: 8px;
    padding-bottom: 8px;

    .li {
      flex: 1;
    }
  }

  .Target {
    display: flex;
    justify-content: space-between;

    .li {
      flex: 1;
    }
  }
}

.bacgroundTra {
  background: #F5F5F5;
  width: 100%;
  padding: 23px 13px;
  border-radius: 8px;
  .titleTime {
    font-family: 'HarmonyOS_Sans';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    color: #333333;
    margin-right: 10px;
  }
  .realtimeButton {
    //display: flex;
    align-items: center;
    .inputSelect{
      :deep(.el-input-group__append) {
        background: white;
        border-color: #4FACFF;
      }
      &.is-disabled{
        :deep(.el-input-group__append) {
          background:#f5f7fa ;
        }
      }
    }

  }

  .ruleView {
    border-radius: 8px;
    width: 100%;
    margin-top: 23px;
    padding: 10px;
    background: #ffffff;

    .head {
      padding-bottom: 20px;
      margin: 0 20px 20px;
      display: flex;
      //justify-content: space-between;
      border-bottom: 1px solid #4FACFF;

      .leftHead {
        flex: 1;

        .titleDefault {
          color: #000000;
          font-style: normal;
          font-weight: 400;
          font-size: 16px;
        }

        .defaultData {
          padding-top: 10px;
          display: flex;
          max-width: 200px;
        }
      }

      .rightHead {
        flex: 1;
        //justify-content: end;




      }
    }

    .rules {
      margin: 0 20px;


      .rule {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 20px;

        .range {
          flex: 9;
          display: flex;
          align-items: center;
        }


        :deep(.el-select) {
          flex: 9;
        }

        .blue {
          flex: 1;
          text-align: center;
          color: #4FACFF;
        }
      }


      .green {
        color: #5FDF32
      }

      .red {
        color: #DF3232
      }
    }

    .tabs {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-bottom: 15px;

      .tab {
        height: 100%;
        border-radius: 4px;
        padding: 3px 5px;
        text-align: center;
        margin-right: 20px;
        color: #4FACFF;
        border: 1px solid #4FACFF;

        &.active {
          color: #F5F5F5;
          background: #4FACFF;
        }
      }
    }
  }
}
</style>
