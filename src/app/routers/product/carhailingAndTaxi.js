/**
 * 品牌约车
 */
const carHailingSearch = () => import(`appViews/carhailing/Search`)
const cancelCarhailing = () => import(`appViews/carhailing/CancelCarhailing`)
const waitForCar = () => import(`appViews/carhailing/WaitForCar`)
const waitForTime = () => import(`appViews/carhailing/WaitForTime`)
const holdForCar = () => import(`appViews/carhailing/HoldForCar`)
const carhailingOrderDetail = () => import(`appViews/carhailing/CarhailingOrderDetail`)

const taxiSearch = () => import(`appViews/carhailing/TaxiSearch`)
const onlinePayment = () => import(`appViews/carhailing/OnlinePayment`)

const carhailingOrderShare = () => import(`appViews/share/CarhailingOrderShare`)
const holdForCarShare = () => import(`appViews/share/HoldForCarShare`)

const setPosition = () => import(`appViews/mapAndPosition/SetPosition`)

export default [
  {
    path: '/carHailingSearch',
    name: 'carHailingSearch',
    component: carHailingSearch,
    meta:{
      title: '品牌约车',
      wxShareType: 'custom'
    }
  },
  {
    path: '/cancelCarhailing',
    name: 'cancelCarhailing',
    component: cancelCarhailing,
    meta:{
      title: '取消约车',
      wxShareType: 'false'
    }
  },
  {
    path: '/waitForCar',
    name: 'waitForCar',
    component: waitForCar,
    meta:{
      title: '品牌约车',
      wxShareType: 'false'
    }
  },
  {
    path: '/waitForTime',
    name: 'waitForTime',
    component: waitForTime,
    meta:{
      title: '品牌约车',
      wxShareType: 'false'
    }
  },
  {
    path: '/holdForCar',
    name: 'holdForCar',
    component: holdForCar,
    meta:{
      title: '品牌约车',
      wxShareType: 'custom'
    }
  },
  {
    path: '/carhailingOrderDetail',
    name: 'carhailingOrderDetail',
    component: carhailingOrderDetail,
    meta:{
      title: '订单详情',
      wxShareType: 'custom'
    }
  },
  
  {
    path: '/taxiSearch',
    name: 'taxiSearch',
    component: taxiSearch,
    meta:{
      title: '出租的士',
      wxShareType: 'false'
    }
  },
  {
    path: '/onlinePayment',
    name: 'onlinePayment',
    component: onlinePayment,
    meta:{
      title: '在线支付',
      wxShareType: 'false'
    }
  },
  
  {
    path: '/carhailingOrderShare',
    name: 'carhailingOrderShare',
    component: carhailingOrderShare,
    meta:{
      title: '品牌约车',
      wxShareType: 'true'
    }
  },
  {
    path: '/holdForCarShare',
    name: 'holdForCarShare',
    component: holdForCarShare,
    meta:{
      title: '品牌约车',
      wxShareType: 'true'
    }
  },
  
  {
    path: '/setPosition',
    name: 'setPosition',
    component: setPosition,
    meta:{
      title: '选择地址',
      wxShareType: 'false'
    }
  },
]