import Vue from "vue";
import Router from "vue-router";
import AdminRoutes from './admin'
import {getSessionStatus, getUserInfo, getUserStatus} from "@/assets/js/api/sso";
import { validate } from "@/utils";
import store from '../store'
import config from "../config";

const SignIn = () => import("@/components/SignInPage.vue")
const BIPanel = () => import("@/components/Layout/BIPanel.vue")
const ErrorPage = () => import("@/components/ErrorPage.vue")

// 总概览页面的路由
const Overview = () => import("@/views/Overview")

// 实时监控版块的页面路由组
const CoolingStationProcess = () => import("@/views/ProcessMonitor/CoolingStation")
const AirCompressingStationProcess = () => import("@/views/ProcessMonitor/AirCompressingStation")
const ProcessMonitor = () => import("@/views/ProcessMonitor/ProcessMonitor")

// 能碳管理版块的页面路由组
const EnergyOverview = () => import("@/views/EnergyManagement/Overview")
const ParameterManagement = () => import("@/views/EnergyManagement/ParameterManagement")
const CarbonAsset = () => import("@/views/EnergyManagement/CarbonAsset")
const CarbonReport = () => import("@/views/EnergyManagement/CarbonReport")

// 节能管理版块的页面路由组
const PowerSavingOverview = () => import("@/views/PowerSaving/Overview")
const CoolingStationPS = () => import("@/views/PowerSaving/CoolingStation")
const CoolingPumpPS = () => import("@/views/PowerSaving/CoolingPump")
const CoolingTowerPS = () => import("@/views/PowerSaving/CoolingTower")
const CoolingSystemPS = () => import("@/views/PowerSaving/CoolingSystem")
const ChillerPS = () => import("@/views/PowerSaving/Chiller")
const FreezingPumpPS = () => import("@/views/PowerSaving/FreezingPump")
const FreezingSystemPS = () => import("@/views/PowerSaving/FreezingSystem")
const AirCompressingStationPS = () => import("@/views/PowerSaving/AirCompressingStation")
const AirCompressorPS = () => import("@/views/PowerSaving/AirCompressor")
const PowerSavingTaskHistory = () => import("@/views/PowerSaving/TaskHistory")

// 故障管理版块的页面路由组
const MalfunctionOverview = () => import("@/views/Malfunction/Overview")
const MalfunctionHistory = () => import("@/views/Malfunction/History")

// 维保管理版块的页面路由组
const MaintenanceSchedule = () => import("@/views/Maintenance/Schedule")
const MaintenanceHistory = () => import("@/views/Maintenance/History")

// 报表管理版块的页面路由组
const CustomDataGraph = () => import("@/views/DataGraph/CustomGraph")
const DataHistory = () => import("@/views/DataGraph/History")

// 设备管理版块的页面路由组
const EquipmentRunningSchedule = () => import("@/views/Equipment/Schedule")

// 日志管理版块的页面路由组
const LogbookHistory = () => import("@/views/Logbook/History")

// 人员管理版块的页面路由组
const ProfileManagement = () => import("@/views/User/Profile")
const RoleManagement = () => import("@/views/User/Role.vue")

Vue.use(Router);

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: "/",
      component: BIPanel,
      children: [{
        path: '',
        name: "Overview",
        component: Overview,
        meta: {
          superOnly: false
        }
      }, {
        path: 'process/cooling_station',
        name: "CoolingStationProcessMonitor",
        component: CoolingStationProcess,
        meta: {
          superOnly: false
        }
      }, {
        path: 'process/air_compressing_station',
        name: "AirCompressingStationProcessMonitor",
        component: AirCompressingStationProcess,
        meta: {
          superOnly: false
        }
      }, {
        path: 'process/:diagramId',
        name: "ProcessMonitor",
        component: ProcessMonitor,
        meta: {
          superOnly: false
        }
      }, {
        path: 'energy',
        name: "EnergyOverview",
        component: EnergyOverview,
        meta: {
          superOnly: false
        }
      }, {
        path: 'energy/parameter',
        name: "ParameterManagement",
        component: ParameterManagement,
        meta: {
          superOnly: false
        }
      }, {
        path: 'energy/asset',
        name: "CarbonAsset",
        component: CarbonAsset,
        meta: {
          superOnly: false
        }
      }, {
        path: 'energy/report',
        name: "CarbonReport",
        component: CarbonReport,
        meta: {
          superOnly: false
        }
      }, {
        path: 'ps',
        name: "PowerSavingOverview",
        component: PowerSavingOverview,
        meta: {
          superOnly: false
        }
      }, {
        path: 'ps/cooling',
        name: "CoolingStationPS",
        component: CoolingStationPS,
        meta: {
          superOnly: false
        }
      }, {
        path: 'ps/cooling/chiller',
        name: "ChillerPS",
        component: ChillerPS,
        meta: {
          superOnly: false
        }
      }, {
        path: 'ps/cooling/pump',
        name: "CoolingPumpPS",
        component: CoolingPumpPS,
        meta: {
          superOnly: false
        }
      }, {
        path: 'ps/cooling/tower',
        name: "CoolingTowerPS",
        component: CoolingTowerPS,
        meta: {
          superOnly: false
        }
      }, {
        path: 'ps/cooling/system',
        name: "CoolingSystemPS",
        component: CoolingSystemPS,
        meta: {
          superOnly: false
        }
      }, {
        path: 'ps/freezing/pump',
        name: "FreezingPumpPS",
        component: FreezingPumpPS,
        meta: {
          superOnly: false
        }
      }, {
        path: 'ps/freezing/system',
        name: "FreezingSystemPS",
        component: FreezingSystemPS,
        meta: {
          superOnly: false
        }
      }, {
        path: 'ps/air',
        name: "AirCompressingStationPS",
        component: AirCompressingStationPS,
        meta: {
          superOnly: false
        }
      }, {
        path: 'ps/air/compressor',
        name: "AirCompressorPS",
        component: AirCompressorPS,
        meta: {
          superOnly: false
        }
      }, {
        path: 'ps/history',
        name: "PowerSavingTaskHistory",
        component: PowerSavingTaskHistory,
        meta: {
          superOnly: false
        }
      }, {
        path: 'malfunction',
        name: "MalfunctionOverview",
        component: MalfunctionOverview,
        meta: {
          superOnly: false
        }
      }, {
        path: 'malfunction/history',
        name: "MalfunctionHistory",
        component: MalfunctionHistory,
        meta: {
          superOnly: false
        }
      }, {
        path: 'maintenance/schedule',
        name: "MaintenanceSchedule",
        component: MaintenanceSchedule,
        meta: {
          superOnly: false
        }
      }, {
        path: 'maintenance/history',
        name: "MaintenanceHistory",
        component: MaintenanceHistory,
        meta: {
          superOnly: false
        }
      }, {
        path: 'graph/custom',
        name: "CustomDataGraph",
        component: CustomDataGraph,
        meta: {
          superOnly: false
        }
      }, {
        path: 'graph/history',
        name: "DataHistory",
        component: DataHistory,
        meta: {
          superOnly: false
        }
      }, {
        path: 'equipment/schedule',
        name: "EquipmentRunningSchedule",
        component: EquipmentRunningSchedule,
        meta: {
          superOnly: false
        }
      }, {
        path: 'log/history',
        name: "LogbookHistory",
        component: LogbookHistory,
        meta: {
          superOnly: false
        }
      }, {
        path: 'user',
        name: "ProfileManagement",
        component: ProfileManagement,
        meta: {
          superOnly: false
        }
      }, {
        path: 'user/role',
        name: "RoleManagement",
        component: RoleManagement,
        meta: {
          superOnly: false
        }
      }]
    },
    {
      path: "/sign_in",
      name: "SignInPage",
      component: SignIn
    }, {
      path: "/error",
      name: "ErrorPage",
      component: ErrorPage,
      props: (route) => ({
        redirectUri: route.query.redirectUri
      }),
    },
    AdminRoutes,
    {
      path: "*",
      redirect: '/'
    }
  ]
});


function isSignInPage (route) {
  return route.name === 'SignInPage'
}

function checkCode (route) {
  let code = route.query.code
  return !!code
}

function launchSSO (next) {
  if (!config.sso.enabled) {
    return next({ name: 'SignInPage' })
  }
  let query = {
    client_id: config.sso.appID,
    redirect_uri: encodeURIComponent(config.sso.callback),
    response_type: 'code',
    oauth_timestamp: new Date().getTime()
  }
  window.location.href = `${config.sso.host}/esc-sso/oauth2.0/authorize?${Object.entries(query).map(item => item.join('=')).join('&')}`
}

function getUser (route) {
  let code = route.query.code
  let redirect_uri = config.sso.callback
  return getUserInfo({ code, redirect_uri: redirect_uri })
}

function redirectTarget (route, next) {
  if (validate(store.state.user, route.meta.auth, route.meta.superOnly, route.meta.signInRequired)) {
    return next()
  }
  else if (route.name !== 'SignInPage') {
    return next({ name: 'SignInPage' })
  }
  else {
    return next()
  }
}

router.beforeEach((to, from, next) => {
  if(!isSignInPage(to)) {
    getUserStatus().then(result => {
      if (result.data) {
        store.commit('updateUserState', result.data)
        //this.verified = true
        redirectTarget(to, next)
      }
      else if (checkCode(to)) {
        getUser(to).then(user => {
          if (user.code === 200) {
            getUserStatus().then(result => {
              store.commit('updateUserState', result.data)
              redirectTarget(to, next)
            })
          }
          else {
            return next({
              name: 'ErrorPage',
              params: { msg: user.msg },
              query: { redirectUri: '/sign_in' }
            })
          }
        }).catch(err => {
          return next({
            name: 'ErrorPage',
            params: { msg: err.msg },
            query: { redirectUri: '/sign_in' }
          })
        })
      }
      else {
        launchSSO(next)
      }
    })
  }
  else {
    return next()
  }
})

export default router
