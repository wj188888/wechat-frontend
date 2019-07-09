/**
 * 小件快运
 */
const expressList = () => import(`appViews/express/ExpressList`)
const expressCreate = () => import(`appViews/express/ExpressCreate`)
const expressNoticeDelivery = () => import(`appViews/express/ExpressNoticeDelivery`)
const expressBCity = () => import(`appViews/express/ExpressBCity`)
const expressOrderDetail = () => import(`appViews/express/ExpressOrderDetail`)
const expressOrderShare = () => import(`appViews/express/ExpressOrderShare`)
const expressOrderSuccessShow = () => import(`appViews/express/ExpressOrderSuccessShow`)

export default [
  {
    path: '/expressList',
    name: 'expressList',
    component: expressList,
    meta:{
      title: '我的快递',
      needLogin: true,
      wxShareType: 'false'
    }
  },
  {
    path: '/expressCreate',
    name: 'expressCreate',
    component: expressCreate,
    meta:{
      title: '小件快运',
      wxShareType: 'false'
    }
  },
  {
    path: '/expressNoticeDelivery',
    name: 'expressNoticeDelivery',
    component: expressNoticeDelivery,
    meta:{
      title: '寄件须知',
      wxShareType: 'false'
    }
  },
  {
    path: '/expressBCity',
    name: 'expressBCity',
    component: expressBCity,
    meta:{
      title: '城市选择',
      wxShareType: 'false'
    }
  },
  {
    path: '/expressOrderDetail',
    name: 'expressOrderDetail',
    component: expressOrderDetail,
    meta:{
      title: '订单详情',
      wxShareType: 'custom'
    }
  },
  {
    path: '/expressOrderShare',
    name: 'expressOrderShare',
    component: expressOrderShare,
    meta:{
      title: '小件快运',
      wxShareType: 'false'
    }
  },
  {
    path: '/expressOrderSuccessShow',
    name: 'expressOrderSuccessShow',
    component: expressOrderSuccessShow,
    meta:{
      title: '小件快运',
      wxShareType: 'false'
    }
  },
]