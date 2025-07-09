<template>
  <div id="regions">
    <div class="searchMenu" id="searchMenu" v-show="isSearchCatalogue">
      <div class="searchCatalogue">
        <div class="searchCatalogueList" v-if="!isSearchVal">
          <el-tree :data="getHierarchyList" accordion :props="defaultProps" node-key="name"
            :default-expanded-keys="getHierarchyList.map(item => item.name)" @node-click="searchMap"
            ref="multipleTable">
            <template v-slot:default="{ node, data }">
              <div :class="{treeList:data.poi,treeListItem:data.children}">
                <span class="treeText" @click="closeFilterList(node.label)">{{node.label}}</span>
              </div>
            </template>
          </el-tree>
        </div>
        <template v-else>
          <template v-if="getSearchData.length === 0">
            暂无数据
          </template>
          <ul class="searchfilterList" v-else>
            <template v-for="item in getSearchData">
              <li><span v-if="item[0].poi" ref="filterName" @click="closeFilterList(item[0].name)"
                  style="font-size: 16px;">{{item[0].name}}</span>
                <template v-if="item[1]">
                  <span ref="filterName" @click="closeFilterList(item[1].name)"
                    style="color:#ddd;font-size: 16px;">{{item[1].name}}
                    <span style="color: #979797;margin-left: 20px;font-size: 16px;">what is going on</span>
                  </span>
                </template>
              </li>
            </template>
          </ul>
        </template>
      </div>
    </div>
    <!-- <div class="serchInput">
          <el-input placeholder="" v-model="searchInput" @input="getsearch()" class="input-with-select"
              @keydown.enter.native="searchMap()">
          </el-input>
          <button @click="searchMap">Search</button>
      </div> -->
    <div>
      <!-- <el-select v-model="activeNames">
            <el-option @click="showSearchList()">
            </el-option>
          </el-select> -->
      <el-collapse v-model="activeNames">
        <!-- Regions -->
        <el-collapse-item title="Regions" name="1" class="menuTitle menuTitleMenu">
          <div :class="['regionsBtns', {regionsBtnsAct: isSearchCatalogue}]" @click="showSearchList()">
            <span class="regionsBg">Regions</span>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
  import { getHierarchy, getHierarchyInfo } from "../../assets/js/api/data";
  import config from "../../config";
  export default {
    name: 'regions',
    components: {
      action: Boolean,
    },
    watch: {

    },
    data() {
      return {
        isSearchCatalogue: false, //查询
        activeNames: ['1'], //Collapse
        getHierarchyList: [],//层级树å
        getSearchData: [],
        isSearchVal: false,
        searchInput: "",
        defaultProps: {
          children: 'children',
          label: 'name',
        },
      }
    },
    methods: {
      // 获取查询
      getsearch() {
        this.isSearchCatalogue = true;
        document.getElementById("searchMenu").style.right = "105px"
        document.getElementById("searchMenu").style.left = "inherit"
        document.getElementById("searchMenu").style.width = "476px"
        if (!this.searchInput.trim()) {
          // this.isSearchCatalogue = true;
          this.isSearchVal = false;
          getHierarchy().then(data => {
            data = data || {};
            this.getHierarchyList = data.data || [];
          })
        } else {
          this.isSearchVal = true;
          this.getSearchData = this.getFiltersData(this.getHierarchyList, this.searchInput.trim());
        }
      },
      handleChange(val) {
        // this.measureTips = false//量算提示
        // this.clearFeatures();
        this.clearFeatures()
        // console.log(val);
      },
      closeFilterList(val, name) {
        this.isSearchVal = false;
        this.searchInput = val;
        this.searchMap()
      },
      getHierarchys() {
        if (!this.searchInput.trim()) {
          getHierarchy().then(data => {
            console.log(data, "ifff")
            // data = data || {};
            this.getHierarchyList = data.data;
            console.log(this.getHierarchyList, "ff")
            this.getHierarchyList.map(item => {
              console.log(item.name, "item.name")
            })

          })
        } else {
          getHierarchyInfo({ name: this.searchInput }).then(data => {
            console.log(data, "222")
            data = data || {};
            let result = data.data || [];
            this.str = '';
            if (result == null) {
              this.str += '<li>暂无数据<span class="markerContSpan"></span><span class="markerContSpan"></span></li>'
            } else {
              for (let i = 0; i < result.length; i++) {
                let value = Math.round(result[i].value * 100) / 100;
                if (!result.length) {
                  this.str += '<li>暂无数据<span class="markerContSpan"></span><span class="markerContSpan"></span></li>'
                } else {
                  this.str += '<li>' + result[i].name + ':<span class="markerContSpan">' + value + '</span><span class="markerContSpan">' + result[i].unit + '</span></li>'
                }
              }
            }
            this.$nextTick(() => {
              if (document.getElementById("markerContDetail")) {
                document.getElementById("markerContDetail").innerHTML = this.str;
              }
            })
            this.getHierarchyList = this.getFiltersData(result);
            console.log(this.getHierarchyList, "getHierarchyList")
          })
        }
      },
      showSearchList() {
        console.log("33")
        this.isSearchCatalogue = !this.isSearchCatalogue
        document.getElementById("searchMenu").style.left = "200px"
        document.getElementById("searchMenu").style.right = "inherit"
        document.getElementById("searchMenu").style.width = "260px"
        this.clearFeatures();
        this.searchInput = ""
        this.isSearchVal = false
        // this.measureTips = false
        this.isCalculate = false
        if (this.isSearchCatalogue) {
          getHierarchy().then(data => {
            data = data || {};
            console.log(data, "data")
            this.getHierarchyList = data.data || [];
            console.log(this.getHierarchyList, "this.getHierarchyList")
          })
        }
      },
      searchMap(val) {
        this.isSearchCatalogue = false;
        if (val) {
          // this.searchInput = val.name //点击search按钮 没有数据返回name
          this.isSearchCatalogue = false;
        }
        if (!this.searchInput.trim()) {
          this.setCard(
              parseFloat(this.$store.state.setting.gis.initial2D.longitude),
              parseFloat(this.$store.state.setting.gis.initial2D.latitude),
              parseInt(this.$store.state.setting.gis.initial2D.zoom)
          )
          return
        }
        this.layers.vectorLayer.removeAllFeatures();
        let queryParam = [];
        queryParam[0] = new SuperMap.REST.FilterParameter({
          name: "MJ_Wells_Surface_Location_01Jan18@Majnoon",
          attributeFilter: "WELLNAME = '" + this.searchInput + "'",
        });
        queryParam[1] = new SuperMap.REST.FilterParameter({
          name: "MJ_Facilities_Outlines@Majnoon",
          attributeFilter: "NAME = '" + this.searchInput + "'",
        });

        let queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
          queryParams: queryParam
        });
        let myQueryBySQLService = new SuperMap.REST.QueryBySQLService(this.source, {
          eventListeners: {
            "processCompleted": this.showQueryResult,
            "processFailed": this.queryError
          }
        });
        myQueryBySQLService.processAsync(queryBySQLParams);
        this.getHierarchys()
      },
      clearFeatures(val) {
        this.layers.markers.clearMarkers()
      },
    },

    mounted() {
      this.getHierarchys()
    }
  }
</script>
<style lang="scss" scoped>
  .searchMenu {
    position: absolute;
    left: 200px;
    top: 0;
    z-index: 99999;
    height: 100%;
    background: #124375;
    width: auto;
    min-width: 200px;
  }

  #regions {
    // width: 107px;
    // height: 36px;
    // background: rgba(0, 0, 0, 0.7);
    // border-radius: 6px;
  }

  .searchCatalogue {
    position: relative;
  }

  .regionsBtnsAct {
    background: #124375;
  }

  .searchCatalogue h1 {
    border-left: 5px solid #ffff00;
    font-size: 18px;
    font-weight: normal;
    margin: 10px 20px;
    text-align: left;
    text-indent: 20px;
  }

  .el-tree-node__content:hover {
    background: rgba(108, 180, 255, 0.2) !important;
    background-color: rgba(108, 180, 255, 0.2) !important;
  }

  .el-tree-node:focus>.el-tree-node__content {
    /* background: #124375 !important; */
  }

  .el-tree {
    /* background: #0a1b31; */
    background: #124375;
    color: #fff;
  }

  .searchCatalogue ul {
    padding: 0;
    list-style: none;
  }

  .el-tree-node__content:hover {
    background: rgba(108, 180, 255, 0.2)!important;
    background-color: rgba(108, 180, 255, 0.2) !important;
    /* border-bottom: 1px solid rgba(255, 255, 255, 0.4); */
  }

  .el-tree-node__content>.el-tree-node__expand-icon {
    color: #93aec5;
  }

  .el-tree-node__expand-icon.is-leaf {
    color: transparent;
    cursor: default;
  }

  .treeList {
    width: 100%;
    text-align: left;
    margin-right: 10px;
    /* border-bottom: 1px solid rgba(108, 180, 255, 0.2); */
  }

  .active {
    /* border: 1px solid #fd7522; */
    /* color: #fff; */
    color: #FFFFFF;

  }

  .treeListItem {
    width: 100%;
    text-align: left;
    /* border-bottom: 1px solid rgba(108, 180, 255, 0.2); */
    color: #4FACFF;
    /* background: rgba(108, 180, 255, 0.2); */
    position: relative;
  }

  .el-tree-node__content {
    /* height: 40px; */
  }

  .disActive {
    /* color: rgb(109, 108, 108) !important */
  }

  .el-tree-node:focus>.el-tree-node__content {
    background: rgba(108, 180, 255, 0.2);
  }


  div.searchMenu .searchCatalogueList {
    margin: 20px 20px 0;
    top: 160px;
    right: 50px;
    position: absolute
  }

  .searchCatalogue ul li {
    text-align: left;
    height: 30px;
    line-height: 30px;
  }

  .searchMenu {
    // position: absolute;
    // left: 200px;
    // top: 0;
    // z-index: 99999;
    // height: 100%;
    // background: #124375;
    // width: auto;
    // min-width: 200px;
    width: 107px;
    height: 36px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 6px;
  }
</style>
