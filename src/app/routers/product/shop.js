/**
 * 连接小店
 */
const shopIndex = () => import(`appViews/shop/shopIndex`)
const shopDetail = () => import(`appViews/shop/shopDetail`)
const shopCreateOrder = () => import(`appViews/shop/shopCreateOrder`)
const shopOrderDetail = () => import(`appViews/shop/shopOrderDetail`)
const shopSearch = () => import(`appViews/shop/shopSearch`)

export default [
  {
    path: '/shopIndex',
    name: 'shopIndex',
    component: shopIndex,
    meta:{
      title: '商品列表',
      wxShareType: 'false'
    }
  },
  {
    path: '/shopDetail',
    name: 'shopDetail',
    component: shopDetail,
    meta:{
      title: '商品详情',
      wxShareType: 'false'
    }
  },
  {
    path: '/shopCreateOrder',
    name: 'shopCreateOrder',
    component: shopCreateOrder,
    meta:{
      title: '订单填写',
      wxShareType: 'false',
      needLogin: true,
    }
  },
  {
    path: '/shopOrderDetail',
    name: 'shopOrderDetail',
    component: shopOrderDetail,
    meta:{
      title: '订单详情',
      wxShareType: 'false'
    }
  },
  {
    path: '/shopSearch',
    name: 'shopSearch',
    component: shopSearch,
    meta:{
      title: '搜索商品',
      wxShareType: 'false'
    }
  },
]