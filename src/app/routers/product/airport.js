/**
 * 机场专线
 */
import TOOL from 'utils/tool'
const airportSendSearch = () => import(`appViews/airport/send/Search`)
const airportSendList = () => import(`appViews/airport/send/List`)
const airportSendCustom = () => import(`appViews/airport/send/CustomOrder`)

const airportPickSearch = () => import(`appViews/airport/pick/Search`)
const airportPickList = () => import(`appViews/airport/pick/List`)
const airportPickCustom = () => import(`appViews/airport/pick/CustomOrder`)

const airportTicket = () => import(`appViews/airport/Ticket`)
const airPortCity = () => import(`appViews/airport/AirPortCity`)
const flightChoose = () => import(`appViews/airport/FlightChoose`)
const flightNumber = () => import(`appViews/airport/FlightNumber`)
const flightList = () => import(`appViews/airport/FlightList`)
const airportList = () => import(`appViews/airport/AirportList`)

TOOL.getMenuName()

export default [
  {
    path: '/airportSendSearch',
    name: 'airportSendSearch',
    component: airportSendSearch,
    meta:{
      title: TOOL.AIRPORT_BUS,
      wxShareType: 'custom'
    }
    
  },
  {
    path: '/airportSendList',
    name: 'airportSendList',
    component: airportSendList,
    meta:{
      title: TOOL.AIRPORT_BUS,
      wxShareType: true
    }
  },
  {
    path: '/airportSendCustom',
    name: 'airportSendCustom',
    component: airportSendCustom,
    meta:{
      title: TOOL.AIRPORT_SPECIAL_BUS,
      wxShareType: 'custom'
    }
  },
  {
    path: '/airportPickSearch',
    name: 'airportPickSearch',
    component: airportPickSearch,
    meta:{
      title: TOOL.AIRPORT_BUS,
      wxShareType: 'custom'
    }
  },
  {
    path: '/airportPickList',
    name: 'airportPickList',
    component: airportPickList,
    meta:{
      title: TOOL.AIRPORT_BUS,
      wxShareType: true
    }
  },
  {
    path: '/airportPickCustom',
    name: 'airportPickCustom',
    component: airportPickCustom,
    meta:{
      title: TOOL.AIRPORT_SPECIAL_BUS,
      wxShareType: 'custom'
    }
  },
  {
    path: '/airportTicket',
    name: 'airportTicket',
    component: airportTicket,
    meta:{
      title: '购票',
      wxShareType: 'custom'
    }
  },
  {
    path: '/airPortCity',
    name: 'airPortCity',
    component: airPortCity,
    meta:{
      title: '选择城市',
      wxShareType: false
    }
  },
  {
    path: '/flightChoose',
    name: 'flightChoose',
    component: flightChoose,
    meta:{
      title: '选择航班',
      wxShareType: false
    }
  },
  {
    path: '/flightNumber',
    name: 'flightNumber',
    component: flightNumber,
    meta:{
      title: '选择航班',
      wxShareType: false
    }
  },
  {
    path: '/flightList',
    name: 'flightList',
    component: flightList,
    meta:{
      title: '航班列表',
      wxShareType: false
    }
  },
  {
    path: '/airportList',
    name: 'airportList',
    component: airportList,
    meta:{
      title: '机场选择',
      wxShareType: false
    }
  }
  
]