/**
 * 定制包车
 */
import TOOL from 'utils/tool'
const charterList = () => import(`appViews/charter/charter/CharterList`)
const applyCharter = () => import(`appViews/charter/charter/ApplyCharter`)
const charterSuccess = () => import(`appViews/charter/charter/CharterSuccess`)
const charterFail = () => import(`appViews/charter/charter/CharterFail`)

const companyQuote = () => import(`appViews/charter/charter/CompanyQuote`)
const companyQuoteInfo = () => import(`appViews/charter/charter/CompanyQuoteInfo`)
const companyQuoteOrder = () => import(`appViews/charter/charter/CompanyQuoteOrder`)
const companyQuoteDetail = () => import(`appViews/charter/charter/CompanyQuoteDetail`)

const driverQuote = () => import(`appViews/charter/charter/DriverQuote`)
const driverQuoteDetail = () => import(`appViews/charter/charter/DriverQuoteDetail`)

TOOL.getMenuName()
export default [
  {
    path: '/charterList',
    name: 'charterList',
    component: charterList,
    meta:{
      title: TOOL.CUSTOM_BUS,
      wxShareType: true
    }
  },
  {
    path: '/applyCharter',
    name: 'applyCharter',
    component: applyCharter,
    meta:{
      title: TOOL.CUSTOM_BUS,
      needLogin: true,
      wxShareType: true
    }
  },
  {
    path: '/charterSuccess',
    name: 'charterSuccess',
    component: charterSuccess,
    meta:{
      title: TOOL.CUSTOM_BUS,
      wxShareType: true
    }
  },
  {
    path: '/charterFail',
    name: 'charterFail',
    component: charterFail,
    meta:{
      title: TOOL.CUSTOM_BUS,
      wxShareType: true
    }
  },
  
  {
    path: '/companyQuote',
    name: 'companyQuote',
    component: companyQuote,
    meta:{
      title: '报价详情',
      wxShareType: true
    }
  },
  {
    path: '/companyQuoteInfo',
    name: 'companyQuoteInfo',
    component: companyQuoteInfo,
    meta:{
      title: '需求详情',
      wxShareType: true
    }
  },
  {
    path: '/companyQuoteOrder',
    name: 'companyQuoteOrder',
    component: companyQuoteOrder,
    meta:{
      title: '报价详情',
      wxShareType: true
    }
  },
  {
    path: '/companyQuoteDetail',
    name: 'companyQuoteDetail',
    component: companyQuoteDetail,
    meta:{
      title: TOOL.CUSTOM_BUS,
      wxShareType: true
    }
  },
  
  {
    path: '/driverQuote',
    name: 'driverQuote',
    component: driverQuote,
    meta:{
      title: '报价详情',
      wxShareType: true
    }
  },
  {
    path: '/driverQuoteDetail',
    name: 'driverQuoteDetail',
    component: driverQuoteDetail,
    meta:{
      title: TOOL.CUSTOM_BUS,
      wxShareType: true
    }
  },
  
]