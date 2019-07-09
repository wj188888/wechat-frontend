/**
 * 城际专线
 */
import TOOL from 'utils/tool'
const city = () => import(`appViews/city/Search`)
const list = () => import(`appViews/city/List`)
const appointBus = () => import(`appViews/city/BusSpecial`)
const busDetail = () => import(`appViews/city/BusExpress`)
const moreCitySku = () => import(`appViews/city/MoreExpress`)
const schBusDetail = () => import(`appViews/city/SchBusDetail`)
const busCarpooling = () => import(`appViews/carpooling/BusCarpooling`)

TOOL.getMenuName()

export default [
  {
    path: '/city',
    name: 'city',
    component: city,
    meta:{
      title: TOOL.CITY_BUS,
      wxShareType: 'custom'
    }
  },
  {
    path: '/list',
    name: 'list',
    component: list,
    meta:{
      title: TOOL.CITY_BUS,
      wxShareType: true
    }
  },
  {
    path: '/appointBus',
    name: 'appointBus',
    component: appointBus,
    meta:{
      title: TOOL.CITY_SPECIAL_BUS,
      wxShareType: 'custom'
    }
  },
  {
    path: '/busDetail',
    name: 'busDetail',
    component: busDetail,
    meta:{
      title: '购票',
      wxShareType: 'custom'
    }
  },
  {
    path: '/moreCitySku',
    name: 'moreCitySku',
    component: moreCitySku,
    meta:{
      title: TOOL.CITY_BUS,
      wxShareType: true
    }
  },
  {
    path: '/schBusDetail',
    name: 'schBusDetail',
    component: schBusDetail,
    meta:{
      title: '购票',
      wxShareType: true
    }
  },
  {
    path: '/busCarpooling',
    name: 'busCarpooling',
    component: busCarpooling,
    meta:{
      title: '城际拼车',
      wxShareType: 'false'
    }
  },
]
