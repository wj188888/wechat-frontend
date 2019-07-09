/**
 * 公共页面
 */
const invoice = () => import(`appViews/pages/Invoice`)
const pageCity = () => import(`appViews/pages/PageCity`)
const pageLocation = () => import(`appViews/pages/PageLocation`)
const expressCity = () => import(`appViews/pages/expressCity`)

const pageStation = () => import(`appViews/pages/PageStation`)
const station = () => import(`appViews/pages/Station`)
const appointStation = () => import(`appViews/pages/AppointStation`)
const expressStation = () => import(`appViews/pages/ExpressStation`)
const bdStation = () => import(`appViews/pages/BdStation`)
const skuStation = () => import(`appViews/pages/SkuStation`)

const outOfRange = () => import(`appViews/pages/OutOfRange`)
const showRange = () => import(`appViews/pages/ShowRange`)
const showStationRange = () => import(`appViews/pages/ShowStationRange`)

const skuSelect = () => import(`appViews/pages/SkuSelect`)
const operateTime = () => import(`appViews/pages/OperateTime`)

const setInfo = () => import(`appViews/pages/setInfo`)
const passengerList = () => import(`appViews/pages/PassengerList`)
const passengerAdd = () => import(`appViews/pages/PassengerAdd`)
const passengerEdit = () => import(`appViews/pages/PassengerEdit`)

const insureSelect = () => import(`appViews/pages/InsureSelect`)
const carTypeSelect = () => import(`appViews/pages/CarTypeSelect`)

export default [
  {
    path: '/invoice',
    name: 'invoice',
    component: invoice,
    meta:{
      title: '开票信息',
      wxShareType: false
    }
  },
  
  {
    path: '/pageCity',
    name: 'pageCity',
    component: pageCity,
    meta:{
      title: '选择城市',
      wxShareType: false
    }
  },
  {
    path: '/pageLocation',
    name: 'pageLocation',
    component: pageLocation,
    meta:{
      title: '选择城市',
      wxShareType: false
    }
  },
  {
    path: '/expressCity',
    name: 'expressCity',
    component: expressCity,
    meta:{
      title: '选择城市',
      wxShareType: false
    }
  },
  {
    path: '/pageStation',
    name: 'pageStation',
    component: pageStation,
    meta:{
      title: '选择站点',
      wxShareType: false
    }
  },
  {
    path: '/station',
    name: 'station',
    component: station,
    meta:{
      title: '选择站点',
      wxShareType: false
    }
  },
  {
    path: '/appointStation',
    name: 'appointStation',
    component: appointStation,
    meta:{
      title: '选择站点',
      wxShareType: false
    }
  },
  {
    path: '/expressStation',
    name: 'expressStation',
    component: expressStation,
    meta:{
      title: '选择站点',
      wxShareType: false
    }
  },
  {
    path: '/bdStation',
    name: 'bdStation',
    component: bdStation,
    meta:{
      title: '选择站点',
      wxShareType: false
    }
  },
  {
    path: '/skuStation',
    name: 'skuStation',
    component: skuStation,
    meta:{
      title: '选择站点',
      wxShareType: false
    }
  },
  {
    path: '/outOfRange',
    name: 'outOfRange',
    component: outOfRange,
    meta:{
      title: '接送范围',
      wxShareType: false
    }
  },
  {
    path: '/showRange',
    name: 'showRange',
    component: showRange,
    meta:{
      title: '接送范围',
      wxShareType: false
    }
  },
  {
    path: '/showStationRange',
    name: 'showStationRange',
    component: showStationRange,
    meta:{
      title: '接送范围',
      wxShareType: false
    }
  },
  {
    path: '/skuSelect',
    name: 'skuSelect',
    component: skuSelect,
    meta:{
      title: '选择时间',
      wxShareType: false
    }
  },
  {
    path: '/operateTime',
    name: 'operateTime',
    component: operateTime,
    meta:{
      title: '选择周期',
      wxShareType: false
    }
  },
  {
    path: '/setInfo',
    name: 'setInfo',
    component: setInfo,
    meta:{
      title: '设置信息',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/passengerList',
    name: 'passengerList',
    component: passengerList,
    meta:{
      title: '旅客信息',
      wxShareType: false
    }
  },
  
  {
    path: '/passengerAdd',
    name: 'passengerAdd',
    component: passengerAdd,
    meta:{
      title: '添加旅客',
      wxShareType: false
    }
  },
  {
    path: '/passengerEdit',
    name: 'passengerEdit',
    component: passengerEdit,
    meta:{
      title: '编辑旅客信息',
      wxShareType: false
    }
  },
  
  {
    path: '/insureSelect',
    name: 'insureSelect',
    component: insureSelect,
    meta:{
      title: '选择保险',
      wxShareType: false
    }
  },
  
  {
    path: '/carTypeSelect',
    name: 'carTypeSelect',
    component: carTypeSelect,
    meta:{
      title: '选择车型',
      wxShareType: false
    }
  },
]