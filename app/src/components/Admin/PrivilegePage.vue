<template>
  <div class="full-h full-w m-l-20">
    <vgis-breadcrumb :navs="navs"></vgis-breadcrumb>
    <div style="min-height: calc(100% - 35px);" class="flex">
      <div class="noc-vgis-model-list">
        <div class="flex m-15">
          <el-input class="filter" v-model="filter.query" clearable @keyup.native.enter="getRoles" @clear="getRoles">
            <template slot="append">
              <el-button type="primary" icon="el-icon-search" @click="getRoles"></el-button>
            </template>
          </el-input>
          <el-button v-auth="{ resources: 'Privilege', action: 'Admin' }" class="m-l-20" circle type="primary"
                     icon="el-icon-plus" @click="addRole"></el-button>
        </div>
        <div :class="['role-list-item', { active: !selectedRole.id }]" @click="inspectRole()">
          <div>{{$t("label.privilege.super")}}</div>
        </div>
        <div v-for="role in roles" :key="role.id" :class="['role-list-item', { active: selectedRole.id === role.id }]" @click="inspectRole(role)">
          <div>{{role.name}}</div>
          <el-dropdown v-auth="{ resources: 'Privilege', action: 'Admin' }" @command="handleCommand">
            <span class="text-link el-icon-more"></span>
            <el-dropdown-menu>
              <el-dropdown-item :command="`editRole[${role.id}]`">{{$t("action.edit")}}</el-dropdown-item>
              <el-dropdown-item :command="`assignRole[${role.id}]`">{{$t("action.assignPrivilege")}}</el-dropdown-item>
              <el-dropdown-item :command="`deleteRole[${role.id}]`" class="text-danger" divided>{{$t("action.delete")}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="noc-vgis-model-detail">
        <el-tabs active-name="detail">
          <el-tab-pane name="detail" :label="$t('label.privilege.detail')">
            <el-table
              cell-class-name="table-cell"
              header-cell-class-name="table-header-cell"
              row-key="id"
              default-expand-all
              :tree-props="{ children: 'children' }"
              :data="privileges.filter(item => !item.parentId)">
              <el-table-column :label="$t('model.role.name')" prop="name"></el-table-column>
              <el-table-column v-for="action in actions" :label="action.name" :key="action.id">
                <template slot-scope="{ row }">
                  <el-checkbox :disabled="!selectedRole.id || !validate($store.state.user, { resources: 'Privilege', action: 'Admin' })" v-model="row[action.id]" @change="updateRole"></el-checkbox>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <add-edit-role v-auth="{ resources: 'Privilege', action: 'Admin' }" v-if="dialogVisibility.addEditRole" dialog-id="addEditRole" :role="addEditRoleData" :dialog-visibility="dialogVisibility.addEditRole" @action-finished="actionFinished"></add-edit-role>
      <assign-role v-auth="{ resources: 'Privilege', action: 'Admin' }" v-if="dialogVisibility.assignRole" dialog-id="assignRole" :role="assignRoleData" :dialog-visibility="dialogVisibility.assignRole" @action-finished="actionFinished"></assign-role>
    </div>
  </div>
</template>

<script>

  import VgisBreadcrumb from "../Standard/vgis-breadcrumb.vue"
  import AssignRole from "./Privilege/AssignRole";
  import AddEditRole from "./Privilege/AddEditRole";
  import {
    getRole,
    getResources,
    deleteRole,
    updateRole,
    getActions
  } from "../../assets/js/api/privilege";
  import {validate} from '../../utils'

  export default {
    name: "Privilege",
    components: {
      AddEditRole,
      AssignRole,
      VgisBreadcrumb
    },
    data() {
      return {
        navs: [{
          name: this.$t("menu.home"),
          url: '/admin'
        }, {
          name: this.$t("menu.privilege")
        }],
        dialogVisibility: {
          addEditRole: false,
          assignRole: false
        },
        assignRoleData: {},
        addEditRoleData: {},
        roles: [],
        selectedRole: {},
        privileges: [],
        actions: [],
        roleOptions: [],
        cities: [],
        //
        filter: {
          query: ''
        },
        formData: {
          name: '',
          route: ''
        },
        visible: false,
        roleResource: [],
        roleAction: [],
        checkResource: [],
        checkAction: [],
        form: {
          name: '',
          defaultEntry: '',
          region: '',
          checkId: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px',
        dataSource: [],
        permissions: [],
        isBrowse: false,
        isAdmin: false,
        newRoleBrowseRights: [],
        newRoleAdminRights: [],
        newRolelist: [],
        checkStore: {},
      }
    },
    computed: {},
    created() {
      this.getRoles();
      this.getFullPrivileges()
    },
    methods: {
      validate,
      actionFinished (dialogId, success) {
        this.dialogVisibility[dialogId] = false
        if (success) {
          this.getRoles()
        }
      },
      handleCommand (command) {
        let pattern = /([a-zA-Z]+)\[(.*)]/
        let match = command.match(pattern)
        if (match && match.length === 3) {
          this[match[1]](match[2])
        }
        else{
          this[command]()
        }
      },
      addRole () {
        this.dialogVisibility.addEditRole = true
      },
      editRole (roleId) {
        this.addEditRoleData = Object.assign({}, this.roles.filter(item => item.id.toString() === roleId)[0])
        this.dialogVisibility.addEditRole = true
      },
      updateRole () {
        updateRole(this.selectedRole.id, Object.assign({}, this.selectedRole, {
          privilege: this.privileges.reduce(
            (result, privilege) => result.concat(this.actions.filter(action => privilege[action.id]).map(action => ({ actionId: action.id, resourceId: privilege.id }))),
            []
          )
        })).then(result => {
          this.$message({
            type: 'success',
            message: this.$t("message.role.privilegeUpdated"),
            showClose: true
          })
          this.getRoles()
        })
      },
      assignRole (roleId) {
        this.assignRoleData = Object.assign({}, this.roles.filter(item => item.id.toString() === roleId)[0])
        this.dialogVisibility.assignRole = true
      },
      deleteRole (roleId) {
        this.$confirm(this.$t("message.shared.confirm"), this.$t("message.shared.warning"), {
          confirmButtonText: this.$t("action.confirm"),
          cancelButtonText: this.$t("action.cancel"),
          type: 'warning'
        }).then(() => {
          deleteRole(roleId).then(result => {
            this.$message({
              type: 'success',
              message: this.$t("message.role.deleted"),
              showClose: true
            })
            this.getRoles()
          })
        })
      },
      // 拉取数据
      getRoles() {
        getRole(this.filter).then(data => {
          this.roles = data.data;
        });
      },
      getFullPrivileges () {
        Promise.all([getResources(), getActions()]).then(([resources, actions]) => {
          this.actions = actions
          let resourceMap = resources.reduce((result, resource) => {
            resource.children = []
            result[resource.id] = resource
            return result
          }, {})
          for(let i = 0; i < resources.length; i++) {
            if (resources[i].parentId) {
              resourceMap[resources[i].parentId].children.push(resources[i])
            }
            for(let j = 0; j < actions.length; j++) {
              resources[i][actions[j].id] = true
            }
          }
          this.privileges = resources
        })
      },
      flushPrivilege (role) {
        let idMap = {}
        for(let i = 0; i < this.privileges.length; i++) {
          idMap[this.privileges[i].id] = i
          for(let j = 0; j < this.actions.length; j++) {
            this.privileges[i][this.actions[j].id] = !role.id
          }
        }
        if (role.id) {
          for(let i = 0; i < role.privileges.length; i++) {
            let priv = role.privileges[i]
            this.privileges[idMap[priv.resource.id]][priv.action.id] = true
          }
        }
      },
      inspectRole(role = {}) {
        this.selectedRole = role
        this.flushPrivilege(role)
      }
    },
    mounted() {

    }
  }
</script>
<style lang="scss" scoped>

  .noc-vgis-model-list {
    background: white;
    margin-right: 16px;
    width: 307px;
    flex-shrink: 0;
  }

  .noc-vgis-model-detail {
    padding: 16px;
    background: white;
    flex-grow: 1;
    margin-right: 16px;
  }

  .role-list-item.active {
    background: rgba(79, 172, 255, 0.05);
  }

  .role-list-item {
    font-family: 'HarmonyOS Sans';
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 18px;
    color: #000000;
    padding: 6px 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
  }

</style>
