import Vue from 'vue'
import App from './App'
import zz from './comm/zz'
import bd from './comm/bd'
import cuCustom from './comm/colorui/components/cu-custom.vue'
Vue.component('cu-custom', cuCustom)
import wxParse from "./components/uParse/src/wxParse.vue"
Vue.component('wxParse', wxParse)

Vue.prototype.zz = zz
Vue.prototype.bd = bd
Vue.config.productionTip = false

App.mpType = 'app'
const app = new Vue({ ...App })
app.$mount()
