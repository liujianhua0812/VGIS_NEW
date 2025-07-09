<template>
  <el-dialog :title="$t('form.title.editStop')" :visible.sync="dialogVisibility" class="addDialog" width="545px" @close="close">
    <div class="addDiaDetail">
      <el-form ref="roamInfoForm" :model="formData" :rules="rules">
        <div style="position: relative;">
          <h1 class="m-t-0">{{$t("model.roaming.settings")}}</h1>
          <p style="margin-bottom: 0;">{{$t("form.roaming.transition.label")}}</p>
          <el-form-item class="m-b-0" prop="turnTime">
            <el-input :placeholder="$t('form.roaming.transition.placeholder')" v-model="formData.turnTime" class="newRoamName m-b-10">
              <template slot="suffix" style="top: 10px;">s</template>
            </el-input>
          </el-form-item>
          <p style="margin-bottom: 0;">{{$t("form.roaming.waiting.label")}}</p>
          <el-form-item class="m-b-0" prop="pauseTime">
            <el-input :placeholder="$t('form.roaming.waiting.placeholder')" class="newRoamName m-b-10" v-model="formData.pauseTime">
              <template slot="suffix">s</template>
            </el-input>
          </el-form-item>
          <p style="margin-bottom: 0;">{{$t("form.roaming.stopName.label")}}</p>
          <el-form-item class="m-b-0" prop="name">
            <el-input :placeholder="$t('form.roaming.stopName.placeholder')" :disabled="formData.hasRelation" v-model="formData.name" class="newRoamName m-b-10"></el-input>
          </el-form-item>
            <span>
              <el-checkbox v-model="formData.hasRelation">{{$t("form.roaming.related.label")}}</el-checkbox>
            </span>
          <el-form-item class="m-b-0" prop="equipTag">
            <el-cascader :placeholder="$t('form.roaming.related.placeholder')" :props="{ label: 'name', value: 'tag' }" style="width: 100%;" :options="hierarchy" :value="cascaderValue" @change="cascaderChange" change-on-select :disabled="!formData.hasRelation"></el-cascader>
          </el-form-item>
        </div>
        <div>
          <h1>{{$t("label.roaming.stopLocation")}}</h1>
          <div style="height: 400px;">
            <view-point-viewer :locked="true" :value="{ pos: stop.pos, rot: stop.rot, modelId: '' }"></view-point-viewer>
          </div>
        </div>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit" class="diaButton" style="margin-right: 6px;">{{$t("action.confirm")}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import ViewPointViewer from "@/components/Maps/ViewPointViewer.vue";
  import {getHierarchy} from "@/assets/js/api/data";

  export default {
    name: "AddEditStop",
    props: {
      dialogId: String,
      dialogVisibility: Boolean,
      stop: Object
    },
    components: {
      ViewPointViewer
    },
    data () {
      return {
        formData: {
          hasRelation: false,
          checked: false,
          pauseTime: 3,
          turnTime: 5,
          equipName: '',
          equipTag: '',
          editing: false,
          cacheName: '',
          name: ''
        },
        rules: {

        },
        hierarchy: [],
        flatten: [],
        tagMap: {},
        parentMap: {},
        cascaderValue: [],
      }
    },
    methods: {
      close () {
        this.$emit("action-finished", this.dialogId)
      },
      flushData () {
        Object.assign(this.formData, this.stop)
        this.cascaderValue = this.getPath()
      },
      submit () {
        this.$emit("action-finished", this.dialogId, this.formData)
      },
      cascaderChange(val) {
        this.formData.equipTag = val[val.length - 1]
        this.formData.equipName = this.tagMap[this.formData.equipTag].name
      },
      getPath () {
        let result = []
        let tag = this.formData.equipTag
        while(tag) {
          result = [tag].concat(result)
          tag = this.parentMap[tag]
        }
        return result
      },
      flatHierarchy (hierarchy) {
        let result = []
        for(let i = 0; i < hierarchy.length; i++) {
          let node = hierarchy[i]
          if (node.poi) {
            result.push(node)
          }
          if (node.children && node.children.length > 0) {
            result = result.concat(this.flatHierarchy(node.children))
          }
        }
        return result
      },
      getParentMap (hierarchy, parent) {
        let result = {}
        for(let i = 0; i < hierarchy.length; i++) {
          let node = hierarchy[i]
          result[node.tag] = parent ? parent.tag : null
          if (node.children && node.children.length > 0) {
            result = Object.assign(result, this.getParentMap(node.children, node))
          }
        }
        return result
      },
      getTagMap () {
        this.tagMap = this.flatten.reduce((result, item) => {
          result[item.tag] = item
          return result
        }, {})
      },
      //获取接口列表信息
      getHierarchy() {
        getHierarchy().then(data => {
          data = data || {};
          this.hierarchy = data.data || [];
          this.flatten = this.flatHierarchy(this.hierarchy)
          this.parentMap = this.getParentMap(this.hierarchy)
          this.getTagMap()
          this.flushData()
        })
      },
    },
    created() {
      this.getHierarchy()
    }
  }
</script>

<style lang="scss" scoped>
  .addDiaDetail {
    margin: 0 0 10px;

    h1 {
      font-size: 16px;
      font-family: HarmonyOS_Sans_Black;
      color: #333333;
      line-height: 23px;
      font-weight: 700;
      margin: 25px 0 5px 0;
    }

    span {
      display: block;
      margin: 10px 0 4px 0;
    }

  }
</style>
