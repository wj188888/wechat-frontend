/**
 * 校园专线
 */
import TOOL from 'utils/tool'
const schoolSearch = () => import(`appViews/school/Search`)
const schoolList = () => import(`appViews/school/List`)
const schoolBusSpecial = () => import(`appViews/school/BusSpecial`)
const schoolBusExpress = () => import(`appViews/school/BusExpress`)

TOOL.getMenuName()

export default [
  {
    path: '/schoolSearch',
    name: 'schoolSearch',
    component: schoolSearch,
    meta:{
      title: TOOL.SCHOOL_BUS,
      wxShareType: 'custom'
    }
  },
  {
    path: '/schoolList',
    name: 'schoolList',
    component: schoolList,
    meta:{
      title: TOOL.SCHOOL_BUS,
      wxShareType: true
    }
  },
  {
    path: '/schoolBusSpecial',
    name: 'schoolBusSpecial',
    component: schoolBusSpecial,
    meta:{
      title: TOOL.SCHOOL_SPECIAL_BUS,
      wxShareType: 'custom'
    }
  },
  {
    path: '/schoolBusExpress',
    name: 'schoolBusExpress',
    component: schoolBusExpress,
    meta:{
      title: '购票',
      wxShareType: 'custom'
    }
  },
]
