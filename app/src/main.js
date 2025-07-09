// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'
import App from './App'
import router from './router'
import {validate} from "./utils"
import ElementUI from 'element-ui'
import vcrontab from "vcrontab"
import VueCodemirror from 'vue-codemirror'
import en from 'element-ui/lib/locale/lang/en'
import cn from 'element-ui/lib/locale/lang/zh-CN'
import locale from 'element-ui/lib/locale'
import vueHeadful from 'vue-headful'
import VJstree from 'vue-jstree-extended'
import scroll from 'vue-seamless-scroll'
import url from './utils/url'
import config from "@/config"
import 'element-ui/lib/theme-chalk/index.css'
import VueI18n from "vue-i18n"
import enUS from './i18n/en-US'
import zhCN from './i18n/zh-CN'
import store from './store'
import * as earcut from 'earcut'
global.earcut = earcut

import {getSetting} from "./assets/js/api/system"
import {use} from "echarts/core"
import {CanvasRenderer} from "echarts/renderers"
import {
    LineChart,
    PieChart,
    BarChart,
    HeatmapChart,
    GaugeChart,
    ScatterChart,
    GraphChart,
    PictorialBarChart,
    BoxplotChart,
    TreeChart
} from "echarts/charts";
import {
    DatasetComponent,
    CalendarComponent,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    MarkLineComponent,
    MarkPointComponent,
    SingleAxisComponent, VisualMapComponent
} from "echarts/components";
import VChart from "vue-echarts"

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faBolt,
    faGear,
    faDroplet,
    faFireFlameSimple,
    faFlask,
    faOilCan,
    faLifeRing,
    faGasPump,
    faAnglesUp,
    faAnglesDown,
    faMinus,
    faOilWell,
    faPercent,
    faEnvelope
} from '@fortawesome/free-solid-svg-icons'

library.add(
    faBolt,
    faGear,
    faDroplet,
    faFlask,
    faOilCan,
    faFireFlameSimple,
    faLifeRing,
    faGasPump,
    faAnglesDown,
    faAnglesUp,
    faMinus,
    faOilWell,
    faPercent,
    faEnvelope
)
Vue.component('font-awesome-icon', FontAwesomeIcon)


use([
    CanvasRenderer,
    LineChart,
    BoxplotChart,
    BarChart,
    PieChart,
    PictorialBarChart,
    GaugeChart,
    ScatterChart,
    GraphChart,
    TreeChart,
    HeatmapChart,
    CalendarComponent,
    VisualMapComponent,
    GridComponent,
    DatasetComponent,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    MarkLineComponent,
    MarkPointComponent,
    SingleAxisComponent
]);

import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/sql/sql'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/theme/base16-light.css'
import '@codemirror/lang-json'
import './assets/css/theme.scss'
import './assets/css/vgis.scss'
import './assets/css/demo.scss'
import './assets/css/admin-theme.scss'
import './assets/css/iconfont/iconfont.css'
import './assets/css/iconfont-power-plugin/iconfont.css'
import "./assets/css/harmony-font.css"
import "./assets/css/style-malfunction-table.scss"
import "./assets/css/style-form.scss"
import "./assets/css/custom-dialog.scss"

// import "grapesjs-echarts-presets/dist/grapesjs-echarts-presets.js"
import "grapesjs-preset-webpage/dist/grapesjs-preset-webpage.min.js"
import "grapesjs/dist/css/grapes.min.css";
import "grapesjs-preset-webpage/dist/grapesjs-preset-webpage.min.css";

import grapesjs from "grapesjs";

Vue.prototype.$grapesjs = grapesjs

import VueDraggableResizable from 'vue-draggable-resizable'

window.Vue = Vue
Vue.config.silent = true

Date.prototype.format = function (fmt) {
    let MonthMap = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];
    let o = {
        "M{2}": this.getMonth() + 1,
        MF: MonthMap[this.getMonth()],
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        S: this.getMilliseconds()
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1
                    ? o[k]
                    : typeof o[k] === "number"
                        ? `${o[k]}`.padStart(2, "0")
                        : o[k]
            );
    return fmt;
};

// let oldDate = Date
// Date = function () {
//   if (arguments.length === 0) {
//     return new oldDate(2022, 12,25)
//   }
//   else {
//     return new oldDate(...arguments)
//   }
// }

// optionally import default styles
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

Vue.component('vue-draggable-resizable', VueDraggableResizable)
Vue.prototype.$bus = new Vue()
Vue.use(scroll)
Vue.use(VueCodemirror)
Vue.use(ElementUI)
Vue.use(VJstree)
Vue.use(vcrontab)
Vue.use(new VueSocketIO({
    debug: false,
    connection: SocketIO(config.backend.socket),
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    },
    options: {
        transports: ['websocket', 'polling']   //socket.io的参数请看文档
    }
}))


const messages = {
    'en': enUS,
    'cn': zhCN
}

getSetting().then(result => {
    let setting = result.data
    let language = setting.language || "cn"
    const i18n = new VueI18n({
        locale: language,
        messages
    })
    store.commit("updateSetting", {
        setting
    })

    Vue.config.productionTip = false
    Vue.component('v-chart', VChart);
    Vue.component('vue-headful', vueHeadful);
    Vue.prototype.$bus = new Vue()
    /* eslint-disable no-new */

    Vue.directive('auth', {
        inserted: function (el, binding, vnode) {
            // 根据权限设置入口开闭
            let user = vnode.context.$store.state.user
            if (!validate(user, binding.value)) {
                el.parentNode && el.parentNode.removeChild(el)
            }
        }
    })

    new Vue({
        i18n,
        router,
        store,
        render: h => h(App)
    }).$mount("#app")
})
