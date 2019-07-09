/**
 * 车票
 */
const ticketList = () => import(`appViews/ticket/TicketList`)
const checkList = () => import(`appViews/ticket/CheckList`)
const ticketDetail = () => import(`appViews/ticket/TicketDetail`)

export default [
  {
    path: '/ticketList',
    name: 'ticketList',
    component: ticketList,
    meta:{
      title: '车票列表',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/checkList',
    name: 'checkList',
    component: checkList,
    meta:{
      title: '验票',
      wxShareType: false
    }
  },
  {
    path: '/ticketDetail',
    name: 'ticketDetail',
    component: ticketDetail,
    meta:{
      title: '车票详情',
      needLogin: true,
      wxShareType: false
    }
  },
]