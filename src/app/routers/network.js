const network = () => import('appViews/car/Network')

export default [
  {
    path: '/network',
    name: 'network',
    component: network,
    meta:{
      title: '网点',
      wxShareType: true
    }
  }
]