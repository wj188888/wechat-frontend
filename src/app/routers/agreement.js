/**
 * 协议
 */
const registerAgreement = () => import(`appViews/agreement/RegisterAgreement`)
const charterAgreement = () => import(`appViews/agreement/charterAgreement`)
const insureAgreement = () => import(`appViews/agreement/InsureAgreement`)
const taipingAgreement2013 = () => import(`appViews/agreement/TaipingAgreement2013`)
const taipingAgreement2014 = () => import(`appViews/agreement/TaipingAgreement2014`)

export default [
  {
    path: '/registerAgreement',
    name: 'registerAgreement',
    component: registerAgreement,
    meta:{
      title: '用户服务协议',
      wxShareType: false
    }
  },
  {
    path: '/charterAgreement',
    name: 'charterAgreement',
    component: charterAgreement,
    meta:{
      title: '包车协议',
      wxShareType: false
    }
  },
  {
    path: '/insureAgreement',
    name: 'insureAgreement',
    component: insureAgreement,
    meta:{
      title: '保险协议',
      wxShareType: false
    }
  },
  {
    path: '/taipingAgreement2013',
    name: 'taipingAgreement2013',
    component: taipingAgreement2013,
    meta:{
      title: '保险协议',
      wxShareType: false
    }
  },
  {
    path: '/taipingAgreement2014',
    name: 'taipingAgreement2014',
    component: taipingAgreement2014,
    meta:{
      title: '保险协议',
      wxShareType: false
    }
  },
]
