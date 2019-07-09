/**
 * 订单
 */
const rentOrderDetail = () => import(`appViews/order/RentOrderDetail`)
const orderDetail = () => import(`appViews/order/OrderDetail`)
const orderWait = () => import(`appViews/order/OrderWait`)
const paySuccess = () => import(`appViews/order/PaySuccess`)

const refund = () => import(`appViews/order/Refund`)
const refundMore = () => import(`appViews/order/RefundMore`)
const refundReason = () => import(`appViews/order/RefundReason`)

const orderEval = () => import(`appViews/car/OrderEval`)
const userComplain = () => import(`appViews/car/UserComplain`)

export default [
  {
    path: '/rentOrderDetail',
    name: 'rentOrderDetail',
    component: rentOrderDetail,
    meta:{
      title: '订单详情',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/orderDetail',
    name: 'orderDetail',
    component: orderDetail,
    meta:{
      title: '订单详情',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/orderWait',
    name: 'orderWait',
    component: orderWait,
    meta:{
      title: '订单详情',
      wxShareType: false
    }
  },
  {
    path: '/paySuccess',
    name: 'paySuccess',
    component: paySuccess,
    meta:{
      title: '付款成功',
      wxShareType: false
    }
  },
  
  {
    path: '/refund',
    name: 'refund',
    component: refund,
    meta:{
      title: '退票',
      wxShareType: 'false'
    }
  },
  {
    path: '/refundMore',
    name: 'refundMore',
    component: refundMore,
    meta:{
      title: '退票',
      wxShareType: 'false'
    }
  },
  {
    path: '/refundReason',
    name: 'refundReason',
    component: refundReason,
    meta:{
      title: '退票理由',
      wxShareType: 'false'
    }
  },
  
  {
    path: '/orderEval',
    name: 'orderEval',
    component: orderEval,
    meta:{
      title: '评价详情',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/userComplain',
    name: 'userComplain',
    component: userComplain,
    meta:{
      title: '投诉',
      needLogin: true,
      wxShareType: false
    }
  },
]