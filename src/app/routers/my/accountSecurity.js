/**
 * 账户安全
 */
const accountSecurity = () => import(`appViews/my/accountSecurity/AccountSecurity`)
const passwordSetting = () => import(`appViews/my/accountSecurity/PasswordSetting`)
const setPayPasswordStep1 = () => import(`appViews/my/accountSecurity/SetPayPasswordStep1`)
const setPayPasswordStep2 = () => import(`appViews/my/accountSecurity/SetPayPasswordStep2`)
const setPayPasswordStep3 = () => import(`appViews/my/accountSecurity/SetPayPasswordStep3`)
const changePayPasswordStep1 = () => import(`appViews/my/accountSecurity/ChangePayPasswordStep1`)


export default [
  {
    path: '/accountSecurity',
    name: 'accountSecurity',
    component: accountSecurity,
    meta:{
      title: '账户安全',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/passwordSetting',
    name: 'passwordSetting',
    component: passwordSetting,
    meta:{
      title: '密码设置',
      needLogin: true,
      wxShareType: false
    }
  },
  
  {
    path: '/setPayPasswordStep1',
    name: 'setPayPasswordStep1',
    component: setPayPasswordStep1,
    meta:{
      title: '设置支付密码',
      needLogin: true,
      wxShareType: false
    }
  },
  
  {
    path: '/setPayPasswordStep2',
    name: 'setPayPasswordStep2',
    component: setPayPasswordStep2,
    meta:{
      title: '设置支付密码',
      needLogin: true,
      wxShareType: false
    }
  },
  
  {
    path: '/setPayPasswordStep3',
    name: 'setPayPasswordStep3',
    component: setPayPasswordStep3,
    meta:{
      title: '设置支付密码',
      needLogin: true,
      wxShareType: false
    }
  },
  
  {
    path: '/changePayPasswordStep1',
    name: 'changePayPasswordStep1',
    component: changePayPasswordStep1,
    meta:{
      title: '修改支付密码',
      needLogin: true,
      wxShareType: false
    }
  },
]
