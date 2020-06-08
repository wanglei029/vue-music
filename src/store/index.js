/*
 * @Author: your name
 * @Date: 2020-06-04 12:20:01
 * @LastEditTime: 2020-06-08 23:34:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-music\src\store\index.js
 */ 
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
/* 通过mutation修改state的时候 createLogger 会在控制台打印log */
import createLogger from 'vuex/dist/logger'
Vue.use(Vuex)
const debug = process.env.NODE_ENV!=='production'
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  strict:debug,
  plugins:debug?[createLogger()]:[]
})
