const tripList = () => import('appViews/car/TripList')
const trip = () => import('appViews/car/Trip')
const tripShare = () => import('appViews/car/TripShare')

export default [
  {
    path: '/tripList',
    name: 'tripList',
    component: tripList,
    meta:{
      title: '行程信息',
      wxShareType: true
    }
  },
  {
    path: '/trip',
    name: 'trip',
    component: trip,
    meta:{
      title: '我的行程',
      wxShareType: 'custom'
    }
  },
  {
    path: '/tripShare',
    name: 'tripShare',
    component: tripShare,
    meta:{
      title: '行程分享',
      wxShareType: false
    }
  }
]