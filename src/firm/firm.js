import 'babel-polyfill'
import tool from '../utils/tool'
import config from '../utils/config'
import api from './api'
import storage from 'interface/storage'
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router'
import {sync} from 'vuex-router-sync'
import Firm from './Firm.vue'
import store from '../app/vuex'
import filters from '../utils/filters'

global.api = api
global.TOOL = tool
global.config = config
global.appStorage = storage


/**
 * 进入页面获取店铺名称
 */
let urlParam = TOOL.getQueryString()
if(urlParam['Brand_Name']){
  $('title').html(urlParam['Brand_Name'])
}


Vue.use(VueRouter)

Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))

const FastClick = require('fastclick')
FastClick.attach(document.body)
document.addEventListener("touchstart", function () {}, true)

const router = new VueRouter({
  routes
})

sync(store, router)

new Vue({
  store,
  router,
  render: h => h(Firm)
}).$mount('#firm')
