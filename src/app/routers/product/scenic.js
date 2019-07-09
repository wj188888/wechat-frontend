/**
 * 景点专线
 */
import TOOL from 'utils/tool'
const scenicSearch = () => import(`appViews/scenic/Search`)
const scenicList = () => import(`appViews/scenic/List`)
const scenicBusSpecial = () => import(`appViews/scenic/BusSpecial`)
const scenicBusExpress = () => import(`appViews/scenic/BusExpress`)

TOOL.getMenuName()

export default [
  {
    path: '/scenicSearch',
    name: 'scenicSearch',
    component: scenicSearch,
    meta:{
      title: TOOL.SCENIC_BUS,
      wxShareType: 'custom'
    }
  },
  {
    path: '/scenicList',
    name: 'scenicList',
    component: scenicList,
    meta:{
      title: TOOL.SCENIC_BUS,
      wxShareType: true
    }
  },
  {
    path: '/scenicBusSpecial',
    name: 'scenicBusSpecial',
    component: scenicBusSpecial,
    meta:{
      title: TOOL.SCENIC_SPECIAL_BUS,
      wxShareType: 'custom'
    }
  },
  {
    path: '/scenicBusExpress',
    name: 'scenicBusExpress',
    component: scenicBusExpress,
    meta:{
      title: '购票',
      wxShareType: 'custom'
    }
  },
]
