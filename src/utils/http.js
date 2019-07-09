import config from './config'
import TOOL from '../utils/tool'
import axios from 'axios'

axios.interceptors.request.use(request => {
  return request
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  /**
   * 非微信浏览器token失效清除token
   * @type {string[]}
   */
  let errorCode = ['403', '31', '32', '33']
  if($.inArray(response.data.resultCode, errorCode) > -1){
    if (!TOOL.browser().weixin || appStorage.get('hasAuthority')) {
      response.data.resultMsg = ''
      appStorage.remove('X-Auth-Token')
    }
  }
  return response
}, error => {
  return Promise.reject(error)
})

export const http = (param) => {
  const webServer = config[param.webserver] || config.webUrl
  const StoreId = appStorage.get('StoreId')

  let token;
  if (appStorage.get('X-Auth-Token')) {
    token = appStorage.get('X-Auth-Token')
  }else if(TOOL.browser().weixin && appStorage.get('logoutToken')){
    token = appStorage.get('logoutToken')
  }

  let httpConfig = {
    baseURL: webServer,
    url: param.url,
    method: param.method || 'get',
    //timeout: 30000,
    headers:{}
  }

  //是否需要header
  let isHeader = param.webserver !== 'driverServer'

  if(isHeader && StoreId){
    httpConfig.headers['StoreId'] = StoreId
  }

  if(isHeader && token){
    httpConfig.headers['X-Auth-Token'] = token
  }

  if (param.body) {
    httpConfig.data = param.data
  } else {
    httpConfig.params = param.data
  }

  switch (param.back) {
    case 'ewmURL':
      return webServer + param.url + '&token=' + token
      break;
    case  'ewmShareUrl':
      return webServer + param.url
      break;
    case  'URL':
      return {
        url: webServer + param.url,
        token: token,
        StoreId: StoreId
      }
      break;
    default:
      return axios(httpConfig)
  }

}
