/**
 * 营销
 */
const marketWithdraw = () => import(`appViews/market/marketWithdraw`);
const setWeWallet = () => import(`appViews/market/setWeWallet`);
const marketFAQ = () => import(`appViews/market/marketFAQ`);
const accountRecord = () => import(`appViews/market/accountRecord`);
const marketCustomer = () => import(`appViews/market/marketCustomer`);
const totalRegister = () => import(`appViews/market/totalRegister`);
const totalFocus = () => import(`appViews/market/totalFocus`);
const marketProduct = () => import(`appViews/market/marketProduct`);
const marketIndex = () => import(`appViews/market/marketIndex`);
const marketRecruit = () => import(`appViews/market/marketRecruit`);
const popRegister = () => import(`appViews/market/popRegister`);
const popFocus = () => import(`appViews/market/popFocus`);
const popOrder = () => import(`appViews/market/popOrder`);


export default [
  {
    path: '/marketWithdraw',
    name: 'marketWithdraw',
    component: marketWithdraw,
    meta:{
      title: '提现',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/setWeWallet',
    name: 'setWeWallet',
    component: setWeWallet,
    meta:{
      title: '设置微信钱包',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/marketFAQ',
    name: 'marketFAQ',
    component: marketFAQ,
    meta:{
      title: '常见问题',
      wxShareType: false
    }
  },
  {
    path: '/accountRecord',
    name: 'accountRecord',
    component: accountRecord,
    meta:{
      title: '结算记录',
      wxShareType: false
    }
  },
  {
    path: '/marketCustomer',
    name: 'marketCustomer',
    component: marketCustomer,
    meta:{
      title: '累计客户',
      wxShareType: true
    }
  },
  {
    path: '/totalRegister',
    name: 'totalRegister',
    component: totalRegister,
    meta:{
      title: '累计注册',
      wxShareType: true
    }
  },
  {
    path: '/totalFocus',
    name: 'totalFocus',
    component: totalFocus,
    meta:{
      title: '累计关注',
      wxShareType: true
    }
  },
  {
    path: '/marketProduct',
    name: 'marketProduct',
    component: marketProduct,
    meta:{
      title: '全民营销',
      wxShareType: true
    }
  },
  {
    path: '/marketIndex',
    name: 'marketIndex',
    component: marketIndex,
    meta:{
      title: '全民营销',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/marketRecruit',
    name: 'marketRecruit',
    component: marketRecruit,
    meta:{
      title: '全民营销推广计划',
      wxShareType: false
    }
  },
  {
    path: '/popRegister',
    name: 'popRegister',
    component: popRegister,
    meta:{
      title: '推广注册',
      wxShareType: false
    }
  },
  {
    path: '/popFocus',
    name: 'popFocus',
    component: popFocus,
    meta:{
      title: '推广关注',
      wxShareType: false
    }
  },
  {
    path: '/popOrder',
    name: 'popOrder',
    component: popOrder,
    meta:{
      title: '推广订单',
      wxShareType: false
    }
  },
]