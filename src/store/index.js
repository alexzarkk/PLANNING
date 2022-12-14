/*
 * @Author: InsHomePgup
 * @Date: 2022-05-07 13:01:20
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-06-14 09:19:43
 * @FilePath: \sport-planing\src\store\index.js
 * @Description:
 *
 *
 */
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import lineTrack from './modules/lineTrack.js';
import timeCount from './modules/timeCount';
// console.log("引入的模块====",lineTrack)

const store = new Vuex.Store({
    modules: {
        lineTrack: lineTrack,
        timeCount: timeCount
    }
});
export default store;
