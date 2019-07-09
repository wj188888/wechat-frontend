/**
 * 工作班车
 */
import TOOL from 'utils/tool'
const work = () => import(`appViews/work/Work`)
const firmBus = () => import(`appViews/work/FirmBus`)
const applyBus = () => import(`appViews/work/ApplyBus`)
const applyNext = () => import(`appViews/work/ApplyNext`)
const workTicket = () => import(`appViews/work/WorkTicket`)
const workList = () => import(`appViews/work/WorkList`)
const success = () => import(`appViews/work/Success`)

TOOL.getMenuName()

export default [
  {
    path: '/work',
    name: 'work',
    component: work,
    meta:{
      title: TOOL.WORK_SHUTTLE_BUS,
      wxShareType: 'custom'
    }
  },
  {
    path: '/firmBus',
    name: 'firmBus',
    component: firmBus,
    meta:{
      title: TOOL.WORK_COMPANY_BUS,
      wxShareType: true
    }
  },
  {
    path: '/applyBus',
    name: 'applyBus',
    component: applyBus,
    meta:{
      title: '班车申请',
      needLogin: true,
      wxShareType: true
    }
  },
  {
    path: '/applyNext',
    name: 'applyNext',
    component: applyNext,
    meta:{
      title: '班车申请',
      wxShareType: true
    }
  },
  {
    path: '/workTicket',
    name: 'workTicket',
    component: workTicket,
    meta:{
      title: TOOL.WORK_SHUTTLE_BUS,
      needLogin: true,
      wxShareType: 'custom',
    }
  },
  {
    path: '/workList',
    name: 'workList',
    component: workList,
    meta:{
      title: TOOL.WORK_SHUTTLE_BUS,
      wxShareType: true
    }
  },
  {
    path: '/success',
    name: 'success',
    component: success,
    meta:{
      title: '班车申请',
      wxShareType: true
    }
  },
]
