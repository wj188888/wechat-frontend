/**
 * 车辆年检服务
 */
const createInsp = () => import(`appViews/inspection/CreateInsp`)
const appointSuccess = () => import(`appViews/inspection/AppointSuccess`)
const historyOrder = () => import(`appViews/inspection/HistoryOrder`)
const waitAppoint = () => import(`appViews/inspection/WaitAppoint`)
const timeAxis = () => import(`appViews/inspection/TimeAxis`)

export default [
  {
    path: '/createInsp',
    name: 'createInsp',
    component: createInsp,
    meta:{
      title: '车辆年检',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/appointSuccess',
    name: 'appointSuccess',
    component: appointSuccess,
    meta:{
      title: '车辆年检',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/historyOrder',
    name: 'historyOrder',
    component: historyOrder,
    meta:{
      title: '历史订单',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/waitAppoint',
    name: 'waitAppoint',
    component: waitAppoint,
    meta:{
      title: '预约服务人员',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/timeAxis',
    name: 'timeAxis',
    component: timeAxis,
    meta:{
      title: '年检状态',
      needLogin: true,
      wxShareType: true
    }
  },
]