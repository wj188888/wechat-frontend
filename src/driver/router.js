export default [
  {
    path: '/aboutUs',
    name: 'aboutUs',
    component: resolve => require(['./views/AboutUs.vue'], resolve),
    meta:{
      title: '关于我们',
    }
  },
  {
    path: '/carhailingFunIntro',
    name: 'carhailingFunIntro',
    component: resolve => require(['./views/CarhailingFunIntro.vue'], resolve),
    meta:{
      title: '功能介绍',
    }
  },
  {
    path: '/taxiFunIntro',
    name: 'taxiFunIntro',
    component: resolve => require(['./views/TaxiFunIntro.vue'], resolve),
    meta:{
      title: '功能介绍',
    }
  },
  {
    path: '/funcIntro',
    name: 'funcIntro',
    component: resolve => require(['./views/FuncIntro.vue'], resolve),
    meta:{
      title: '功能介绍',
    }
  },
  {
    path: '/serviceAgreement',
    name: 'serviceAgreement',
    component: resolve => require(['./views/ServiceAgreement.vue'], resolve),
    meta:{
      title: '服务协议',
    }
  },
  {
    path: '/registAgreement',
    name: 'registAgreement',
    component: resolve => require(['./views/RegistAgreement.vue'], resolve),
    meta:{
      title: '注册协议',
    }
  },
  {
    path: '/versionNotification',
    name: 'versionNotification',
    component: resolve => require(['./views/VersionNotification.vue'], resolve),
    meta:{
      title: '版本通知',
    }
  },
  {
    path: '/driverCard',
    name: 'driverCard',
    component: resolve => require(['./views/DriverCard.vue'], resolve),
    meta:{
      title: '司机名片',
    }
  },
  {
      path: '/commonProblem',
      name: 'commonProblem',
      component: resolve => require(['./views/CommonProblem.vue'], resolve),
      meta:{
          title: '常见问题',
      }
  },
  {
    path: '/settlementRule',
    name: 'settlementRule',
    component: resolve => require(['./views/settlementRule.vue'], resolve),
    meta:{
      title: '结算规则',
    }
  },
]
