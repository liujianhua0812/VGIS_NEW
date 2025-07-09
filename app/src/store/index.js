import Vue from 'vue'
import Vuex from 'vuex'
import locale from "element-ui/lib/locale";
import en from "element-ui/lib/locale/lang/en";
import cn from "element-ui/lib/locale/lang/zh-CN";
Vue.use(Vuex)

let locales = {
  "en": en,
  "cn": cn
};

locale.use(cn)

export default new Vuex.Store({
  state: {
    alarms: {
      production: []
    },
    hierarchyType: "",
    routerName:"",
    user: "",
    resolution: 0,
    hasWarning: false,
    setting: {}
  },
  getters: {
    // 参数列表state指的是state数据
    getAlarm(state) {
      return state.alarms.production;
    },
    getHierarchyType(type) {
      return type.hierarchyType;
    },
    getRouteType(type) {
      return type.routerName;
    }
  },
  actions: {
    setAlarmName({ commit, state }, name) {
      // 调用mutaions里面的方法
      commit("updateProductionEvent", name);
    },
    getHierarchyName({ commit, state }, name) {
      // 调用mutaions里面的方法
      commit("updateHierarchyName", name);
    },
    getRoute({ commit, state }, name) {
      // 调用mutaions里面的方法
      commit("updateRouteList", name);
    }
  },
  mutations: {
    updateSetting (state, {
      setting = {},
      instance
    }) {
      state.setting = setting
      if (instance) {
        instance.$root.$i18n.locale = setting.language;
        instance.$root.$i18n.fallbackLocale = setting.language;
      }
      locale.use(locales[setting.language])
    },
    setResolution(state, resolution) {
      state.resolution = resolution
    },
    updateProductionEvent(state, events) {
      state.alarms.production =events
    },
    updateHierarchyName(state, events) {
      state.hierarchyType = events
    },
    updateRouteList(state, events){
      state.routerName = events
    },
    updateUserState (state, user = "") {
      state.user = user
    },
    updateWarning (state, warning = false) {
      state.hasWarning = warning
    }
  }
  })
