import Vue from 'vue'
import App from './App'
import zz from './comm/zz'
import bd from './comm/bd'
import cuCustom from './comm/colorui/components/cu-custom.vue'
Vue.component('cu-custom', cuCustom)
import wxParse from "./components/uParse/src/wxParse.vue"
Vue.component('wxParse', wxParse)
import store from './store'

import { router, RouterMount } from './router.js'  //路径换成自己的
Vue.use(router)

import uView from "uview-ui";
Vue.use(uView);

Vue.prototype.zz = zz
Vue.prototype.bd = bd
Vue.prototype.$store = store
Vue.config.productionTip = false

import zwlogMixin from '@/mixins/zwlog';
Vue.mixin(zwlogMixin);

App.mpType = 'app'
const app = new Vue({
	...App,
	// store
})


//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
RouterMount(app, router, '#app')
// #endif

// #ifndef H5
app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif