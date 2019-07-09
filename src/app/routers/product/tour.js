/**
 * 旅游度假
 */
import TOOL from 'utils/tool'
const sights = () => import(`appViews/sight/Sights`)
const sightOff = () => import(`appViews/sight/SightOff`)
const moreProduct = () => import(`appViews/sight/MoreProduct`)
const productSight = () => import(`appViews/sight/ProductSight`)
const productDetail = () => import(`appViews/sight/ProductDetail`)
const porderWrite = () => import(`appViews/sight/PorderWrite`)

TOOL.getMenuName()

export default [
  {
    path: '/sights',
    name: 'sights',
    component: sights,
    meta:{
      title: TOOL.TOUR_BUS,
      wxShareType: 'custom'
    }
  },
  {
    path: '/sightOff',
    name: 'sightOff',
    component: sightOff,
    meta:{
      title: '选择目的地',
      wxShareType: true
    }
  },
  {
    path: '/moreProduct',
    name: 'moreProduct',
    component: moreProduct,
    meta:{
      title: '更多产品',
      wxShareType: true
    }
  },
  {
    path: '/productSight',
    name: 'productSight',
    component: productSight,
    meta:{
      title: TOOL.TOUR_BUS,
      wxShareType: true
    }
  },
  
  {
    path: '/productDetail',
    name: 'productDetail',
    component: productDetail,
    meta:{
      title: '产品详情',
      wxShareType: 'custom'
    }
  },
  {
    path: '/porderWrite',
    name: 'porderWrite',
    component: porderWrite,
    meta:{
      title: '订单填写',
      wxShareType: 'custom'
    }
  },
]
