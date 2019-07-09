import 'babel-polyfill'
import tool from '../utils/tool'
import api from './api'
import storage from 'interface/storage'
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router'
import {sync} from 'vuex-router-sync'
import Driver from './Driver.vue'
import store from '../app/vuex'
import filters from '../utils/filters'

global.api = api
global.TOOL = tool
global.appStorage = storage

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
  render: h => h(Driver)
}).$mount('#driver')
