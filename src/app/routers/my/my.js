/**
 * 我的
 */
const commonUsedAddress = () => import(`appViews/my/CommonUsedAddress`)
const passengerInfo = () => import(`appViews/my/PassengerInfo`)

const about = () => import(`appViews/my/About`)
const registerProtocol = () => import(`appViews/my/RegisterProtocol`)
const companyIntro = () => import(`appViews/my/CompanyIntro`)
const support = () => import(`appViews/my/Support`)

const userInfo = () => import(`appViews/my/userInfo/UserInfo`)
const userNickName = () => import(`appViews/my/userInfo/UserNickName`)
const userName = () => import(`appViews/my/userInfo/UserName`)
const userIdCard = () => import(`appViews/my/userInfo/UserIdCard`)
const userEmail = () => import(`appViews/my/userInfo/UserEmail`)


export default [
  {
    path: '/commonUsedAddress',
    name: 'commonUsedAddress',
    component: commonUsedAddress,
    meta:{
      title: '常用信息',
      needLogin: true,
      wxShareType: false
    }
  },
  {
    path: '/passengerInfo',
    name: 'passengerInfo',
    component: passengerInfo,
    meta:{
      title: '常用信息',
      needLogin: true,
      wxShareType: false
    }
  },
  
  {
    path: '/about',
    name: 'about',
    component: about,
    meta:{
      title: '关于',
      wxShareType: false
    }
  },
  {
    path: '/registerProtocol',
    name: 'registerProtocol',
    component: registerProtocol,
    meta:{
      title: '注册协议',
      wxShareType: false
    }
  },
  {
    path: '/companyIntro',
    name: 'companyIntro',
    component: companyIntro,
    meta:{
      title: '公司介绍',
      wxShareType: false
    }
  },
  {
    path: '/support',
    name: 'support',
    component: support,
    meta:{
      title: '技术支持',
      wxShareType: false
    }
  },
  {
    path: '/userInfo',
    name: 'userInfo',
    component: userInfo,
    meta:{
      title: '个人信息',
      wxShareType: false
    }
  },
  {
    path: '/userNickName',
    name: 'userNickName',
    component: userNickName,
    meta:{
      title: '昵称修改',
      wxShareType: false
    }
  },
  {
    path: '/userName',
    name: 'userName',
    component: userName,
    meta:{
      title: '姓名修改',
      wxShareType: false
    }
  },
  {
    path: '/userIdCard',
    name: 'userIdCard',
    component: userIdCard,
    meta:{
      title: '身份证填写',
      wxShareType: false
    }
  },
  {
    path: '/userEmail',
    name: 'userEmail',
    component: userEmail,
    meta:{
      title: '邮箱修改',
      wxShareType: false
    }
  },
]
