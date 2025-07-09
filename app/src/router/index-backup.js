import Vue from "vue";
import Router from "vue-router";
import AdminRoutes from './admin'
import { MessageBox } from "element-ui";
import {getSessionStatus, getUserInfo, getUserStatus} from "../assets/js/api/sso";
import { validate } from "../utils";
import store from '../store'
import config from "../config";

const BIPanel = () => import("@/components/Layout/BIPanel.vue")
const SignIn = () => import("@/components/SignInPage.vue")
const ErrorPage = () => import("@/components/ErrorPage.vue")
const WelcomePage = () => import("@/components/WelcomePage.vue")
const MapTool = () => import("@/components/MapTool.vue")
const OverviewDashboard = () => import("@/components/Dashboards/OverviewDashboard.vue")
const ProductionDashboard = () => import("@/components/Dashboards/ProductionDashboard.vue")
const HSSEDashboard = () => import("@/components/Dashboards/HSSEDashboard.vue")
const PIDDashboard = () => import("@/components/Dashboards/PIDDashboard.vue")
const CustomDashboard = () => import("@/components/Dashboards/CustomDashboard.vue")
const Test = () => import("@/components/Test.vue")
Vue.use(Router);

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: WelcomePage,
      meta: {
        signInRequired: true
      }
    },
    {
      path: '/test',
      name: 'Test',
      component: Test,
      meta: {
        signInRequired: true
      }
    },
    {
      path: "/dashboard/",
      component: BIPanel,
      children: [{
        path: '',
        name: "Overview",
        component: OverviewDashboard,
        meta: {
          superOnly: false,
          auth: { resources: 'Overview' }
        }
      }, {
        path: "hsse",
        name: "HSSE",
        component: HSSEDashboard,
        meta: {
          superOnly: false,
          auth: { resources: 'HSSE' }
        }
      },
      {
        path: "production",
        name: "Production",
        component: ProductionDashboard,
        meta: {
          superOnly: false,
          auth: { resources: 'Production' }
        }
      }, {
        path: "pid",
        name: "PID",
        component: PIDDashboard,
        meta: {
          superOnly: false,
          auth: { resources: 'PID' }
        }
      }]
    },
    {
      path: "/dashboard/:dashboardId",
      name: "CustomDashboard",
      component: CustomDashboard,
      meta: {
        superOnly: false
      }
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
    {
      path: "/map",
      name: "MapTool",
      component: MapTool,
      props: (route) => ({
        dim: route.query.dim || "",
      }),
      meta: {
        superOnly: false,
        auth: { resources: 'Map Tool' }
      }
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
