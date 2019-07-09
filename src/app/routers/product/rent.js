/**
 * 自驾租车
 */
const rent = () => import(`appViews/rent/Rent`)
const selectRentCar = () => import(`appViews/rent/SelectRentCar`)
const rentStore = () => import(`appViews/rent/RentStore`)
const fillOrder = () => import(`appViews/rent/FillOrder`)
const rentCancelReason = () => import(`appViews/rent/RentCancelReason`)
const rentNotice = () => import(`appViews/rent/RentNotice`)
const rentInfo = () => import(`appViews/rent/RentInfo`)
const rentOrderEval = () => import(`appViews/rent/RentOrderEval`)

export default [
  {
    path: '/rent',
    name: 'rent',
    component: rent,
    meta:{
      title: '自驾租车',
      wxShareType: true
    }
  },
  {
    path: '/selectRentCar',
    name: 'selectRentCar',
    component: selectRentCar,
    meta:{
      title: '自驾租车',
      wxShareType: false
    }
  },
  {
    path: '/rentStore',
    name: 'rentStore',
    component: rentStore,
    meta:{
      title: '取车门店',
      wxShareType: false
    }
  },
  {
    path: '/fillOrder',
    name: 'fillOrder',
    component: fillOrder,
    meta:{
      title: '订单填写',
      wxShareType: false
    }
  },
  {
    path: '/rentCancelReason',
    name: 'rentCancelReason',
    component: rentCancelReason,
    meta:{
      title: '取消订单',
      wxShareType: false
    }
  },
  {
    path: '/rentNotice',
    name: 'rentNotice',
    component: rentNotice,
    meta:{
      title: '租车须知',
      wxShareType: false
    }
  },
  {
    path: '/rentInfo',
    name: 'rentInfo',
    component: rentInfo,
    meta:{
      title: '全面保障服务费',
      wxShareType: false
    }
  },
  {
    path: '/rentOrderEval',
    name: 'rentOrderEval',
    component: rentOrderEval,
    meta:{
      title: '评价详情',
      wxShareType: false
    }
  },
]
