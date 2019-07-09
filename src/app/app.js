import 'babel-polyfill'
import clipboard from 'clipboard'
import tool from 'utils/tool'
import api from './api'
import storage from 'interface/storage'
import appInterface from 'interface/index'
import Vue from 'vue'
import VueRouter from 'vue-router'
import {sync} from 'vuex-router-sync'
import routes from './routers'
import App from './App.vue'
import store from './vuex'
import filters from 'utils/filters'

global.api = api
global.Clipboard = clipboard
global.TOOL = tool
global.appStorage = storage
appInterface.init()
global.interfaceApi = appInterface.getApi()

Vue.use(VueRouter)
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))

const FastClick = require('fastclick')
FastClick.attach(document.body)
document.addEventListener("touchstart", function () {}, true)

const router = new VueRouter({
  routes
})
sync(store, router)

/**
 * 连接app大师调用方法
 */
TOOL.login = () => {
  if(TOOL.browser().undunion_app){
    JsWebviewInterface.undunionLogin()
    router.push({name: 'empty'})
  }else{
    router.push({name: 'login'})
  }
}

TOOL.back = () => {
  router.go(-1)
}

//$('body,html').height(document.body.clientHeight);
//$('body').on('touchmove touchstart', function (event) {
//  event.preventDefault();
//});

TOOL.loginCallBack = (param) => {
  appStorage.set('X-Auth-Token', param.token)
  appStorage.set('userInfo', JSON.stringify(param.user))
  if(param.wxUserCouponList || param.integral){
    store.commit('UPDATE_DIALOG', true)
    store.commit('UPDATE_COUPON', {
      integral: param.integral,
      wxUserCouponList: param.wxUserCouponList,
    })
  }else{
    store.dispatch('showSuccess', '登录成功')
  }
  TOOL.afterLogin(param)
}

TOOL.afterLogin = (param) => {
  TOOL.createPassenger()
  let orderPage = TOOL.orderCreatePage
  
  let fromPage = {}
  if (appStorage.get('fromPage')) {
    fromPage = JSON.parse(appStorage.get('fromPage'))
  }
  
  if(fromPage.name){
    if ($.inArray(fromPage.name, orderPage) === -1) {
      appStorage.remove('fromPage')
      router.replace({
        name: fromPage.name,
        query: fromPage.query
      })
    } else {
      TOOL.createOrder(fromPage, param)
    }
  } else {
    router.go(-1)
  }
}

TOOL.createPassenger = () => {
  if(appStorage.get('passengers')){
    let passengers = JSON.parse(appStorage.get('passengers'))
    api.userAddPassengers(passengers).then(res => {
      const data = TOOL.toJson(res.data)
      if (data.resultCode === '0') {
        appStorage.remove('passengers')
      }
    })
  }
}

TOOL.createOrder = (fromPage, param) => {
  let orderData = JSON.parse(appStorage.get('orderToSubmit'))
  orderData.contactTelephone = orderData.contactTelephone || param.user.phone
  orderData.formId = TOOL.getTimeStamp()
  if(!orderData){
    router.go(-1)
  }
  TOOL.orderCreated(fromPage.name, orderData)
}

TOOL.orderCreated = (pageRouter, order) => {
  let orderData = order
  store.commit('UPDATE_LOADING', true)
  let resource
  let resourceArr = TOOL.orderCreateResource
  
  for(let i = 0; i < resourceArr.length; i++){
    if(resourceArr[i].productTypeLevelTwo && appStorage.get('marketerId') && resourceArr[i].productTypeLevelTwo === appStorage.get('marketerProductTypeLevelTwo')){
      orderData.marketerId = appStorage.get('marketerId')
    }
    if(resourceArr[i].pageRouter === pageRouter){
      resource = resourceArr[i].resource
      break
    }
  }
  
  orderData.orderSource = TOOL.browserType()
  api[resource](orderData).then(res => {
    const result = TOOL.toJson(res.data)
    store.commit('UPDATE_LOADING', false)
    if (result.resultCode === '0') {
      appStorage.remove('feederOrder')
      appStorage.remove('needInvoice')
      TOOL._orderSuccess(result.resultData, pageRouter)
    }
  })
}

TOOL._orderSuccess = (orderId, pageRouter) => {
  appStorage.remove('orderToSubmit')
  appStorage.remove('fromPage')
  if(pageRouter === 'carHailingSearch'){
    router.push({
      name: 'waitForCar',
      query:{
        orderId: orderId,
        productTypeLevelOne: 'CAR_HAILING'
      }
    })
  }else if(pageRouter === 'taxiSearch'){
    router.push({
      name: 'waitForCar',
      query:{
        orderId: orderId,
        productTypeLevelOne: 'TAXI'
      }
    })
  }else if(pageRouter === 'porderWrite') {
    router.replace({
      name: 'orderDetail',
      query: {
        orderId: orderId
      }
    })
  }else{
    router.push({
      name: 'orderDetail',
      query: {
        orderId: orderId
      }
    })
  }
}

TOOL.logout = () => {
  appStorage.remove('X-Auth-Token')
  appStorage.remove('userInfo')
  store.dispatch('showSuccess', '退出成功')
  router.go(-1)
}

TOOL.wxPayFail = (param) => {
  let productTypeLevelOne = param.productTypeLevelOne
  if(productTypeLevelOne === 'CAR_HAILING' || productTypeLevelOne === 'TAXI'){
    store.dispatch('showError', '支付失败，请重新支付！')
  }else if(productTypeLevelOne === 'CAR_INSPECTION') {
    if(param.routerName) {
        api.cancelInspection(param.tradeNo).then(res => {
            const data = TOOL.toJson(res.data);
            if(data.resultCode === '0') {

            } else {
                store.dispatch('showError', data.resultMsg);
            }
        });
        store.dispatch('showError', '支付失败，已为你取消了订单，请重新创建订单');
    } else {
        store.dispatch('showError', '支付失败，请重新支付！');
    }

  }else{
    store.dispatch('showAlert', {
      content: '<p style="text-align:center;">支付失败，请重新支付！</p>',
      onHide: ()=> {
        if(productTypeLevelOne === 'EXPRESS') {
          _jumpToExpressList();
        }else{
          _jumpToOrderList(0);
        }
      }
    })
  }
}
  
TOOL.wxPaySuccess = (param) => {
  let count = 0
  let resource = '';

  if(param.productTypeLevelOne === 'CAR_INSPECTION') {
      if(param.routerName) {
          store.dispatch('showSuccess', '支付成功');
          api.getInspectionOrderById(param.tradeNo).then(res => {
              const data = TOOL.toJson(res.data);
              if(data.resultCode === '0') {
                  let orderStatus = data.resultData.status;
                  setTimeout(() => {
                      router.push({
                          name: param.routerName,
                          query: {
                              orderId: param.tradeNo,
                              status: orderStatus,
                          }
                      })
                  }, 1000);
              } else {
                  store.dispatch('showError', data.resultMsg);
              }
          });
      } else {
          store.dispatch('showSuccess', '支付成功');
          router.replace({
              name: 'timeAxis',
              query: {
                  orderId: param.tradeNo,
                  isChange: true,
              }
          })
      }

      return ;
  }

  switch (param.productTypeLevelOne) {
    case 'EXPRESS':
      resource = api.expressOrderFindStatus({
        orderId: param.tradeNo
      });
      break;
    
    case 'CUSTOM_BUS_enquiry':
      resource = api.enquiryFindStatus({
        enquiryId: param.enquiryId
      });
      break;
    
    default:
      resource = api.orderFindStatus({
        orderId: param.tradeNo
      });
  }
  
  TOOL.payTimer = setInterval(function () {
    count++;
    resource.then(res => {
      const data = TOOL.toJson(res.data);
      if (data.resultCode === '0') {
        let result = data.resultData
        if (result.status === 1) {
          clearInterval(TOOL.payTimer)
          
          switch (param.productTypeLevelOne) {
            case 'LINE_BUS':
              if(result.productTypeLevelTwo === 'LINE_CAR_POOL_BUS'){
                // carPoolStatus 拼车状态：0.未付款 1.未成团，2.未安排，3.已安排，4.已失效，5.已取消
                if(result.carPoolStatus === 1){
                  router.push({
                    name: 'carpoolingSuccess',
                    query:{
                      skuId: result.skuId
                    }
                  })
                }else if(result.carPoolStatus === 2){
                  _jumpToOrderWait(param.productTypeLevelOne, result.skuId)
                }
                
              }else if(result.productTypeLevelTwo === 'LINE_CHARTER_BUS'){
                // charterStatus 包车状态：0.未付款 1.未安排，2.已安排，3.已失效，4.已取消
                if(result.charterStatus === 1){
                  _jumpToOrderWait(param.productTypeLevelOne, result.skuId)
                }
              }
              break;
            
            case 'EXPRESS':
              router.replace({
                name: 'expressOrderSuccessShow',
                query: {
                  orderId: param.tradeNo
                }
              })
              break;
            
            case 'TAXI':
            case 'CAR_HAILING':
              router.replace({
                name: 'carhailingOrderDetail',
                query: {
                  orderId: param.tradeNo,
                  productTypeLevelOne: param.productTypeLevelOne
                }
              })
              break;
            
            case 'CUSTOM_BUS_enquiry':
              let replace = param.pageRouter !== 'charterList'
              if(replace){
                router.replace({
                  name: 'charterSuccess',
                  query: {
                    enqueryId: param.enquiryId
                  }
                })
              }else{
                router.push({
                  name: 'charterSuccess',
                  query: {
                    enqueryId: param.enquiryId
                  }
                })
              }
              break;
            
            default:
              router.push({
                name: 'paySuccess',
                query: {
                  orderId: param.tradeNo,
                  productTypeLevelOne: param.productTypeLevelOne
                }
              })
          }
        } else {
          if(count > 5){
            clearInterval(TOOL.payTimer)
            if(param.productTypeLevelOne === 'EXPRESS'){
              _jumpToExpressList();
            }else{
              _jumpToOrderList(-1)
            }
          }
        }
      } else {
        store.dispatch('showError', data.resultMsg)
      }
    })
  }, 1000);
}

let _jumpToOrderList = (status) => {
  router.push({
    name: 'orderList',
    query:{
      status: status
    }
  })
}

let _jumpToExpressList = () => {
  router.push({
    name: 'expressList'
  })
}

let _jumpToOrderWait = (productTypeLevelOne, id) => {
  router.push({
    name: 'orderWait',
    query:{
      productTypeLevelOne: productTypeLevelOne,
      id: id
    }
  })
}

router.beforeEach((to, from, next) => {
  $('.picker').remove()
  $('.mbsc-fr').remove()
  $('html').removeClass('mbsc-fr-lock')
  $('body').removeClass('mbsc-fr-lock')
  if(TOOL.browser().undunion_app){
    JsWebviewInterface.hideUnLoadingDialog()
  }
  if (TOOL.payTimer) {
    clearInterval(TOOL.payTimer)
  }
  if (TOOL.charterPayTimer) {
    clearInterval(TOOL.charterPayTimer)
  }

  /**
   * 路由切换需要登录的页面，如没有登录则提示登录
   * 订单详情会配置菜单，如果没登陆需记住路由会跳
   */
  if(to.query.marketerId){
    appStorage.set('marketerId', to.query.marketerId)
    appStorage.set('marketerProductTypeLevelTwo', to.query.productTypeLevelTwo)
  }
  
  //营销分享是否展示关注店铺
  let hidefollowUsPage = ['building', 'setPosition']
  if(appStorage.get('marketerId') && hidefollowUsPage.indexOf(to.name) === -1){
    store.commit('UPDATE_FOLLOWUS', true)
  }else{
    store.commit('UPDATE_FOLLOWUS', false)
  }
  
  if(appStorage.get('marketSetting')){
    let marketSetting = JSON.parse(appStorage.get('marketSetting'))
    let showFixMarketPage = [
      'index',
      'cityBusIndex',
      'carhailingIndex',
      'carpoolbusIndex',
      'carpoolbusMap',
      
      'city',
      'scenicSearch',
      'schoolSearch',
      
      'airportPickSearch',
      'airportSendSearch',
      
      'trainSendSearch',
      'trainSendSearch',
      
      'sights',
      'work',
      'carHailingSearch',
      'lineCar',
      
    ]
    if(showFixMarketPage.indexOf(to.name) > -1){
      store.commit('UPDATE_FIXMARKET', true)
    }else{
      store.commit('UPDATE_FIXMARKET', false)
    }
    console.log(marketSetting)
    //this.productList = marketSetting.marketProductSettingList
  }else{
    interfaceApi.share({
      share: true,
      shareUrl: shareUrl
    });
  }
  
  if (!appStorage.get('X-Auth-Token') && to.meta.needLogin) {
    let fromPage = {
      name: to.name,
      query: to.query
    }
  
    appStorage.set('fromPage', JSON.stringify(fromPage))
    if(TOOL.browser().undunion_app){
      JsWebviewInterface.undunionLogin()
      next({name: 'empty'})
    }else{
      next({name: 'login'})
    }
  } else {
    store.commit('UPDATE_LOADING', true)
    next()
  }
})

router.afterEach((to, form) => {
  /**
   * wxShareType：true 打开分享， false关闭分享，custom 企业后台自定义分享
   */
  if(TOOL.browser().undunion_app){
    if(to.name === 'commonUsedAddress' || to.name === 'passengerInfo'){
      JsWebviewInterface.nowWebTitle('tabPage')
    }else{
      JsWebviewInterface.nowWebTitle(to.name)
    }
    
  }
  let len = TOOL.shareURL.length
  let shareUrl = TOOL.shareURL.substr(0, len-1) + to.fullPath
  if (!to.meta.wxShareType) {
    interfaceApi.share({
      share: false,
      shareUrl: shareUrl
    });

  } else if(to.meta.wxShareType !== 'custom'){
    interfaceApi.share({
      share: true,
      shareUrl: shareUrl
    });
  }
  store.commit('UPDATE_LOADING', false)

  /**
   * pv uv 处理
   */
  let visitLogs = [], pageViewData = {}
  if (appStorage.get('visitLogs')) {
    visitLogs = JSON.parse(appStorage.get('visitLogs'))
  }
  pageViewData.createdTime = TOOL.newGetDate({type: 'holeDate'})
  pageViewData.fromType = appStorage.get('fromType')
  
  /**
   * 如页面访问数大于等于30或访问时间大于统计间隔，则向后台发送访问记录并清除本地数据
   * 否则存储页面访问记录
   */
  if (visitLogs.length >= TOOL.maxPageNum ||
    (visitLogs.length > 0 && TOOL.dateCompare(pageViewData.createdTime, visitLogs[0].createdTime, 'datetime') >= TOOL.maxPageViewTime )) {
    api.visitLogCreate(visitLogs).then(res => {
      const result = TOOL.toJson(res.data)
      if (result.resultCode === '0') {
        appStorage.remove('visitLogs')
      }
    })
  } else {
    //产品详情页在页面上单独处理
    let productPage = [
      'appointBus', //城际专线
      'busDetail',
      'schBusDetail',
      
      'airportSendCustom', //机场
      'airportPickCustom',
      'airportTicket',
      
      'trainSendCustom', //接站
      'trainPickCustom',
      'trainTicket',
  
      'schoolBusSpecial', //校园专线
      'schoolBusExpress',
  
      'scenicBusSpecial', //景点专线
      'scenicBusExpress',
      
      'noteDetail', //旅游度假
      'productDetail',
      'porderWrite',
      
      'applyCharter', //定制包车
      'companyQuote',
      'companyQuoteOrder',
      'driverQuote',
      
      'workTicket', //工作
      
      'carHailingSearch', //品牌约车
      'taxiSearch', //出租的士
      
      'carpoolbusIndex', // 拼车页面
      'carpoolbusMap',
      'busCarpooling',
       'shopDetail',
       'shopCreateOrder',
    ]
    if ($.inArray(to.name, productPage) === -1) {
      pageViewData.url = to.name
      visitLogs.push(pageViewData)
    }
    appStorage.set('visitLogs', JSON.stringify(visitLogs))
  }
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
