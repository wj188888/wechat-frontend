/**
 * 会员卡
 */
const vipCard = () => import(`appViews/my/vipCard/VipCard`)
const vipCardList = () => import(`appViews/my/vipCard/VipCardList`)
const vipCardInfo = () => import(`appViews/my/vipCard/VipCardInfo`)


export default [
  {
    path: '/vipCard',
    name: 'vipCard',
    component: vipCard,
    meta:{
      title: '会员卡',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/vipCardList',
    name: 'vipCardList',
    component: vipCardList,
    meta:{
      title: '会员卡',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/vipCardInfo',
    name: 'vipCardInfo',
    component: vipCardInfo,
    meta:{
      title: '会员卡使用须知',
      needLogin: true,
      wxShareType: false
    }
  },
]
