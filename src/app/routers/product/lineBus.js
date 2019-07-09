/**
 * 线路包车
 */
import TOOL from 'utils/tool'
const lineCar = () => import('appViews/charter/carpooling/LineCar')
const lineCarList = () => import('appViews/charter/carpooling/LineCarList')
const carpoolingList = () => import('appViews/charter/carpooling/CarpoolingList')
const carpooling = () => import('appViews/charter/carpooling/Carpooling')
const carpoolingSelf = () => import('appViews/charter/carpooling/CarpoolingSelf')
const carpoolingSuccess = () => import('appViews/charter/carpooling/CarpoolingSuccess')
const carpoolingFail = () => import('appViews/charter/carpooling/CarpoolingFail')
const carpoolingShare = () => import('appViews/charter/carpooling/CarpoolingShare')
const carpoolingJoin = () => import('appViews/charter/carpooling/CarpoolingJoin')
const carpoolingWaitFail = () => import('appViews/charter/carpooling/CarpoolingWaitFail')

TOOL.getMenuName()

export default [
  {
    path: '/lineCar',
    name: 'lineCar',
    component: lineCar,
    meta:{
      title: TOOL.LINE_BUS,
      wxShareType: 'custom'
    }
  },
  {
    path: '/lineCarList',
    name: 'lineCarList',
    component: lineCarList,
    meta:{
      title: TOOL.LINE_BUS,
      wxShareType: true
    }
  },
  {
    path: '/carpoolingList',
    name: 'carpoolingList',
    component: carpoolingList,
    meta:{
      title: TOOL.LINE_BUS,
      wxShareType: 'custom'
    }
  },
  {
    path: '/carpooling',
    name: 'carpooling',
    component: carpooling,
    meta:{
      title: TOOL.LINE_BUS,
      wxShareType: 'custom'
    }
  },
  {
    path: '/carpoolingSelf',
    name: 'carpoolingSelf',
    component: carpoolingSelf,
    meta:{
      title: TOOL.LINE_BUS,
      wxShareType: 'custom'
    }
  },
  {
    path: '/carpoolingSuccess',
    name: 'carpoolingSuccess',
    component: carpoolingSuccess,
    meta:{
      title: TOOL.LINE_BUS,
      wxShareType: 'custom'
    }
  },
  {
    path: '/carpoolingFail',
    name: 'carpoolingFail',
    component: carpoolingFail,
    meta:{
      title: TOOL.LINE_BUS,
      wxShareType: 'custom'
    }
  },
  {
    path: '/carpoolingShare',
    name: 'carpoolingShare',
    component: carpoolingShare,
    meta:{
      title: TOOL.LINE_BUS,
      wxShareType: 'custom'
    }
  },
  {
    path: '/carpoolingJoin',
    name: 'carpoolingJoin',
    component: carpoolingJoin,
    meta:{
      title: TOOL.LINE_BUS,
      wxShareType: 'custom'
    }
  },
  {
    path: '/carpoolingWaitFail',
    name: 'carpoolingWaitFail',
    component: carpoolingWaitFail,
    meta:{
      title: '订单详情',
      wxShareType: false
    }
  },
]