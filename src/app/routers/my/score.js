/**
 * 用户积分
 */
const myScore = () => import(`appViews/my/score/MyScore`)
const exchangeProduct = () => import(`appViews/my/score/ExchangeProduct`)
const exchangeCoupon = () => import(`appViews/my/score/ExchangeCoupon`)
const exchangeProductList = () => import(`appViews/my/score/ExchangeProductList`)
const exchangeProductSku = () => import(`appViews/my/score/ExchangeProductSku`)
const scoreBusSpecial = () => import(`appViews/my/score/ScoreBusSpecial`)
const scoreBusExpress = () => import(`appViews/my/score/ScoreBusExpress`)
const scoreBusStation = () => import(`appViews/my/score/ScoreBusStation`)
const scoreBusTourProduct = () => import(`appViews/my/score/ScoreBusTourProduct`)
const scoreBusTour = () => import(`appViews/my/score/ScoreBusTour`)
const myScoreDetail = () => import(`appViews/my/score/MyScoreDetail`)

export default [
  {
    path: '/myScore',
    name: 'myScore',
    component: myScore,
    meta:{
      title: '我的积分',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/exchangeProduct',
    name: 'exchangeProduct',
    component: exchangeProduct,
    meta:{
      title: '兑换产品',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/exchangeCoupon',
    name: 'exchangeCoupon',
    component: exchangeCoupon,
    meta:{
      title: '积分换券',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/exchangeProductList',
    name: 'exchangeProductList',
    component: exchangeProductList,
    meta:{
      title: '兑换产品',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/exchangeProductSku',
    name: 'exchangeProductSku',
    component: exchangeProductSku,
    meta:{
      title: '兑换产品',
      needLogin: true,
      wxShareType: false
    }
  },
  
  {
    path: '/scoreBusSpecial',
    name: 'scoreBusSpecial',
    component: scoreBusSpecial,
    meta:{
      title: '兑换产品',
      needLogin: true,
      wxShareType: false
    }
  },
  
  {
    path: '/scoreBusExpress',
    name: 'scoreBusExpress',
    component: scoreBusExpress,
    meta:{
      title: '兑换产品',
      needLogin: true,
      wxShareType: false
    }
  },
  
  {
    path: '/scoreBusStation',
    name: 'scoreBusStation',
    component: scoreBusStation,
    meta:{
      title: '兑换产品',
      needLogin: true,
      wxShareType: false
    }
  },
  
  {
    path: '/scoreBusTourProduct',
    name: 'scoreBusTourProduct',
    component: scoreBusTourProduct,
    meta:{
      title: '兑换产品',
      needLogin: true,
      wxShareType: false
    }
  },
  
  {
    path: '/scoreBusTour',
    name: 'scoreBusTour',
    component: scoreBusTour,
    meta:{
      title: '兑换产品',
      needLogin: true,
      wxShareType: false
    }
  },
  
  {
    path: '/myScoreDetail',
    name: 'myScoreDetail',
    component: myScoreDetail,
    meta:{
      title: '积分明细',
      needLogin: true,
      wxShareType: false
    }
  },
]
