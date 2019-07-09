/**
 * 司机车辆相关
 */
const driver = () => import(`appViews/car/Driver`)
const driverList = () => import(`appViews/pages/DriverList`)
const driverAdd = () => import(`appViews/pages/DriverAdd`)
const driverEdit = () => import(`appViews/pages/DriverEdit`)
const driverCard = () => import(`appViews/driver/DriverCard`)
const carPreview = () => import(`appViews/driver/CarPreview`)

export default [
  {
    path: '/driver',
    name: 'driver',
    component: driver,
    meta:{
      title: '司机信息',
      wxShareType: true
    }
  },
  {
    path: '/driverList',
    name: 'driverList',
    component: driverList,
    meta:{
      title: '选择驾驶员',
      wxShareType: false
    }
  },
  {
    path: '/driverAdd',
    name: 'driverAdd',
    component: driverAdd,
    meta:{
      title: '添加驾驶员',
      wxShareType: false
    }
  },
  {
    path: '/driverEdit',
    name: 'driverEdit',
    component: driverEdit,
    meta:{
      title: '编辑驾驶员信息',
      wxShareType: false
    }
  },
  {
    path: '/driverCard',
    name: 'driverCard',
    component: driverCard,
    meta:{
      title: '司机名片',
      wxShareType: 'custom'
    }
  },
  {
    path: '/carPreview',
    name: 'carPreview',
    component: carPreview,
    meta:{
      title: '车辆预览',
      wxShareType: 'custom'
    }
  },
]