const searchBusLine = () => import(`appViews/bus/SearchBusLine`)
const busLineDetail = () => import(`appViews/bus/BusLineDetail`)

const searchBusStation = () => import(`appViews/bus/SearchBusStation`)
const busStationMap = () => import(`appViews/bus/BusStationMap`)

const busNews = () => import(`appViews/bus/BusNews`)
const busNewsDetail = () => import(`appViews/bus/BusNewsDetail`)

export default [
  {
    path: '/searchBusLine',
    name: 'searchBusLine',
    component: searchBusLine,
    meta:{
      title: '搜索线路',
      wxShareType: true
    }
  },
  {
    path: '/busLineDetail',
    name: 'busLineDetail',
    component: busLineDetail,
    meta:{
      title: '线路详情',
      wxShareType: true
    }
  },
  {
    path: '/searchBusStation',
    name: 'searchBusStation',
    component: searchBusStation,
    meta:{
      title: '线路信息',
      wxShareType: true
    }
  },
  {
    path: '/busStationMap',
    name: 'busStationMap',
    component: busStationMap,
    meta:{
      title: '线路详情',
      wxShareType: true
    }
  },
  {
    path: '/busNews',
    name: 'busNews',
    component: busNews,
    meta:{
      title: '消息中心',
      wxShareType: true
    }
  },
  {
    path: '/busNewsDetail',
    name: 'busNewsDetail',
    component: busNewsDetail,
    meta:{
      title: '消息详情',
      wxShareType: true
    }
  },
]

