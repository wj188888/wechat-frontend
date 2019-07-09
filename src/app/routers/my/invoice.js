/**
 * 电子发票
 */
const invoiceList = () => import(`appViews/my/e-invoice/InvoiceList`)
const invoiceHistory = () => import(`appViews/my/e-invoice/InvoiceHistory`)
const writeInvoice = () => import(`appViews/my/e-invoice/WriteInvoice`)
const moreMessage = () => import(`appViews/my/e-invoice/MoreMessage`)
const invoiceDetail = () => import(`appViews/my/e-invoice/InvoiceDetail`)
const includeTrip = () => import(`appViews/my/e-invoice/IncludeTrip`)
const resendInvoice = () => import(`appViews/my/e-invoice/ResendInvoice`)

export default [
  {
    path: '/invoiceList',
    name: 'invoiceList',
    component: invoiceList,
    meta:{
      title: '按行程开票',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/invoiceHistory',
    name: 'invoiceHistory',
    component: invoiceHistory,
    meta:{
      title: '开票记录',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/writeInvoice',
    name: 'writeInvoice',
    component: writeInvoice,
    meta:{
      title: '开票信息',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/moreMessage',
    name: 'moreMessage',
    component: moreMessage,
    meta:{
      title: '开票信息',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/invoiceDetail',
    name: 'invoiceDetail',
    component: invoiceDetail,
    meta:{
      title: '开票详情',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/includeTrip',
    name: 'includeTrip',
    component: includeTrip,
    meta:{
      title: '所含行程',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/resendInvoice',
    name: 'resendInvoice',
    component: resendInvoice,
    meta:{
      title: '重发电子发票',
      needLogin: true,
      wxShareType: false
    }
  }
]
