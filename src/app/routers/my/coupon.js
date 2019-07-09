/**
 * 优惠券
 */
const couponCenter = () => import(`appViews/coupon/CouponCenter`)
const getCoupon = () => import(`appViews/coupon/GetCoupon`)
const getCouponSuccess = () => import(`appViews/coupon/GetCouponSuccess`)
const myCoupon = () => import(`appViews/coupon/MyCoupon`)
const selectCoupon = () => import(`appViews/coupon/SelectCoupon`)


export default [
  {
    path: '/couponCenter',
    name: 'couponCenter',
    component: couponCenter,
    meta:{
      title: '领券中心',
      wxShareType: false
    }
  },
  {
    path: '/getCoupon',
    name: 'getCoupon',
    component: getCoupon,
    meta:{
      title: '优惠券',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/getCouponSuccess',
    name: 'getCouponSuccess',
    component: getCouponSuccess,
    meta:{
      title: '优惠券',
      wxShareType: 'custom'
    }
  },
  {
    path: '/myCoupon',
    name: 'myCoupon',
    component: myCoupon,
    meta:{
      title: '优惠券',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/selectCoupon',
    name: 'selectCoupon',
    component: selectCoupon,
    meta:{
      title: '选择优惠券',
      wxShareType: false
    }
  },
]
