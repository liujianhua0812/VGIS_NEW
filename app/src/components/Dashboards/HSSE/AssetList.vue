<template>
  <div class="assetMessage" v-if="isAsset">
      <!-- <el-collapse v-model="activeNames">
          <el-collapse-item class="assetCollapse" name="1"> -->
              <div class="noc assetInformation">
                  <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">ALL</el-checkbox>
                  <div></div>
                  <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                      <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                  </el-checkbox-group>
              </div>
          <!-- </el-collapse-item>
      </el-collapse> -->
  </div>
</template>

<script>
const cityOptions = ['Level I', 'Level II', 'Level III', 'Level IV','Level V'];
  export default {
    name: 'AssetList',
    props: {
      title: String,
      tag: String,
      location: String
    },
    components: {
    },
    watch: {
    },
    computed: {
      optionLeft() {
        return {
          direction: 2,
          limitMoveNum: 2
        }
      },
      orderStat() {
        return this.workOrders.reduce((result, record) => {
          result[record.status]++
          return result
        }, { 'Completed': 0, 'Not Started': 0, 'Processing': 0 })
      }
    },
    data() {
      return {
        activeNames: ['1'],
        isAsset: true,
        workOrders: [],
        checkAll: true,
        checkedCities: ['Level I', 'Level II', 'Level III', 'Level IV','Level V'],
        cities: cityOptions,
        isIndeterminate: false
      }
    },
    methods: {
      handleCheckAllChange(val) {
        this.$bus.$emit("AssetScreening", val ? cityOptions : [])
        this.checkedCities = val ? cityOptions : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        this.$bus.$emit("AssetScreening", value)
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      },
    },
    mounted() {
      const that=this;
      this.$nextTick(() => {
        that.$bus.$emit("AssetScreening", ['Level I', 'Level II', "Level III", 'Level IV','Level V'])
      });
    }
  }
</script>
<style>
.assetMessage{
  width: 148px;
  height: auto;
  background: #0a1a2d;
  border-radius: 8px;
}
.assetInformation{
  height: auto;
  padding-left: 5px;
  border-radius: 8px;
}
  .assetInformation .el-checkbox-group .el-checkbox:nth-child(0) .el-checkbox__label{
    color: #333333
  }
  .assetInformation .el-checkbox-group .el-checkbox:nth-child(1) .el-checkbox__label{
    background: #4FACFF;
    color: #333333
  }
  .assetInformation .el-checkbox-group .el-checkbox:nth-child(2) .el-checkbox__label{
    background: #AD4FFF;
    color: #333333
  }
  .assetInformation .el-checkbox-group .el-checkbox:nth-child(3) .el-checkbox__label{
    background: #4FFF7F;
    color: #333333
  }
  .assetInformation .el-checkbox-group .el-checkbox:nth-child(4) .el-checkbox__label{
    background: #FFD94F;
    color: #333333
  }
  .assetInformation .el-checkbox-group .el-checkbox:nth-child(5) .el-checkbox__label{
    background:#FF4F4F;
    color: #333333
  }

.assetMessage .el-checkbox__inner{
  width: 14px;
  height: 14px;
  border-radius: 50%;
}
.assetInformation .el-checkbox .el-checkbox__label{
  width: 88px;
  height: 28px;
  background: #FFFFFF;
  border-radius: 4px;
  line-height: 28px;
  text-align: center;
  margin: 4px 10px;
}
.assetInformation .el-checkbox-group{
  display: flex;
  flex-direction: column;
}
.el-collapse-item .assetCollapse{
  background: rgba(0, 0, 0, 0) !important;
}
</style>
<style lang="scss" scoped>
.assetMessage{
  width: 148px;
  height: auto;
  padding: 10px;
}
</style>
