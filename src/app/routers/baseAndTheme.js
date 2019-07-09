import Nav from 'appViews/base/Nav'
import appStorage from 'interface/storage'

const cityBusIndex = () => import('../theme/cityBus/Index')
const carhailingIndex = () => import('../theme/carhailing/Index')
const carpoolbusIndex = () => import('../theme/carpoolbus/Index')
const carpoolbusMap = () => import('../theme/carpoolbus/Map')
const busIndex = () => import('../theme/bus/Index')

const index = () => import('appViews/base/Index')
const login = () => import('appViews/base/Login')
const my = () => import('appViews/base/My')

const carpoolMapMy = () => import('appViews/base/CarpoolMapMy')
const building = () => import('appViews/mapAndPosition/Building')

const moreProductMenu = () => import('appViews/base/MoreProductMenu')
const ticket = () => import('appViews/base/Ticket')

const orderList = () => import('appViews/order/OrderList')
const carpoolMapOrderList = () => import('appViews/order/CarpoolMapOrderList')

const showArea = () => import('appViews/ShowArea')
const empty = () => import('appViews/Empty')


export default [
  {
    path: '*',
    redirect: '/'
  },
  {
    path: '/',
    component: Nav,
    children: [
      {
        path: '/',
        redirect: to => {
          return appStorage.get('indexRouter')
        }
      },
      {
        path: 'index',
        name: 'index',
        component: index,
        meta:{
          title: '首页',
          wxShareType: 'custom'
        }
      },
      {
        path: '/cityBusIndex',
        name: 'cityBusIndex',
        component: cityBusIndex,
        meta:{
          title: '城际班线主页',
          wxShareType: 'custom'
        }
      },
      {
        path: '/carhailingIndex',
        name: 'carhailingIndex',
        component: carhailingIndex,
        meta:{
          title: '品牌约车主页',
          wxShareType: 'custom'
        },
      },
      {
        path: '/carpoolbusIndex',
        name: 'carpoolbusIndex',
        component: carpoolbusIndex,
        meta:{
          title: '城际拼车主页',
          wxShareType: 'custom'
        },
      },
      {
        path: '/ticket',
        name: 'ticket',
        component: ticket,
        meta:{
          title: '车票',
          wxShareType: false
        }
      },
      {
        path: '/my',
        name: 'my',
        component: my,
        meta:{
          title: '个人中心',
          wxShareType: false
        }
      },
      {
        path: '/orderList',
        name: 'orderList',
        component: orderList,
        meta:{
          title: '我的订单',
          needLogin: true,
          wxShareType: false
        }
      },
    ]
  },
  {
    path: '/carpoolbusMap',
    name: 'carpoolbusMap',
    component: carpoolbusMap,
    meta:{
      title: '城际拼车主页',
      wxShareType: 'custom'
    }
  },
  {
    path: '/building',
    name: 'building',
    component: building,
    meta:{
      title: '选择地址',
      wxShareType: 'false'
    }
  },
  
  {
    path: '/busIndex',
    name: 'busIndex',
    component: busIndex,
    meta:{
      title: '城乡公交主页',
      wxShareType: true
    }
  },
  
  {
    path: '/carpoolMapMy',
    name: 'carpoolMapMy',
    component: carpoolMapMy,
    meta:{
      title: '个人中心',
      wxShareType: false
    }
  },
  
  {
    path: '/carpoolMapOrderList',
    name: 'carpoolMapOrderList',
    component: carpoolMapOrderList,
    meta:{
      title: '我的订单',
      needLogin: true,
      wxShareType: false
    }
  },
  
  {
    path: '/login',
    name: 'login',
    component: login,
    meta:{
      title: '登录',
      wxShareType: true
    }
  },
  
  {
    path: '/moreProductMenu',
    name: 'moreProductMenu',
    component: moreProductMenu,
    meta:{
      title: '更多产品',
      wxShareType: false
    }
  },
  {
    path: '/showArea',
    name: 'showArea',
    component: showArea,
    meta:{
      title: '显示区域范围',
      wxShareType: 'false'
    }
  },
  {
    path: '/empty',
    name: 'empty',
    component: empty,
    meta:{
      title: '过渡页面',
      wxShareType: 'false'
    }
  },
]
