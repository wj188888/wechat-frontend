/**
 * 接站专线
 */
import TOOL from 'utils/tool'
const trainSendSearch = () => import(`appViews/trainstation/send/Search`)
const trainSendList = () => import(`appViews/trainstation/send/List`)
const trainSendCustom = () => import(`appViews/trainstation/send/CustomOrder`)

const trainPickSearch = () => import(`appViews/trainstation/pick/Search`)
const trainPickList = () => import(`appViews/trainstation/pick/List`)
const trainPickCustom = () => import(`appViews/trainstation/pick/CustomOrder`)

const trainstationTicket = () => import(`appViews/trainstation/Ticket`)
const trainStation = () => import(`appViews/trainstation/TrainStation`)

TOOL.getMenuName()

export default [
  {
    path: '/trainSendSearch',
    name: 'trainSendSearch',
    component: trainSendSearch,
    meta:{
      title: TOOL.TRAIN_STATION_BUS,
      wxShareType: 'custom'
    }
  },
  {
    path: '/trainSendList',
    name: 'trainSendList',
    component: trainSendList,
    meta:{
      title: TOOL.TRAIN_STATION_BUS,
      wxShareType: true
    }
  },
  {
    path: '/trainSendCustom',
    name: 'trainSendCustom',
    component: trainSendCustom,
    meta:{
      title: TOOL.TRAIN_SPECIAL_BUS,
      wxShareType: 'custom'
    }
  },
  
  {
    path: '/trainPickSearch',
    name: 'trainPickSearch',
    component: trainPickSearch,
    meta:{
      title: TOOL.TRAIN_STATION_BUS,
      wxShareType: 'custom'
    }
  },
  {
    path: '/trainPickList',
    name: 'trainPickList',
    component: trainPickList,
    meta:{
      title: TOOL.TRAIN_STATION_BUS,
      wxShareType: true
    }
  },
  {
    path: '/trainPickCustom',
    name: 'trainPickCustom',
    component: trainPickCustom,
    meta:{
      title: TOOL.TRAIN_SPECIAL_BUS,
      wxShareType: 'custom'
    }
  },
  {
    path: '/trainstationTicket',
    name: 'trainstationTicket',
    component: trainstationTicket,
    meta:{
      title: '购票',
      wxShareType: 'custom'
    }
  },
  {
    path: '/trainStation',
    name: 'trainStation',
    component: trainStation,
    meta:{
      title: '火车站选择',
      wxShareType: true
    }
  },
]
  
