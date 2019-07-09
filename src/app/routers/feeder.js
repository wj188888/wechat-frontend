const feeder = () => import(`appViews/feeder/Feeder`)
const feederDetail = () => import(`appViews/feeder/FeederDetail`)
const feederNotice = () => import(`appViews/feeder/FeederNotice`)

export default [
  {
    path: '/feeder',
    name: 'feeder',
    component: feeder,
    meta:{
      title: '订单填写',
      wxShareType: 'custom'
    }
  },
  
  {
    path: '/feederDetail',
    name: 'feederDetail',
    component: feederDetail,
    meta:{
      title: '接送详情',
      wxShareType: false
    }
  },
  
  {
    path: '/feederNotice',
    name: 'feederNotice',
    component: feederNotice,
    meta:{
      title: '接送服务须知',
      wxShareType: false
    }
  },
]