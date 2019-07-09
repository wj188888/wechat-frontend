let driverServer = 'http://10.50.50.224:8090/orange-driver'

    // let hostUrl = 'http://stg-wechat.undunion.com/'
let hostUrl = 'http://dev-wechat.undunion.com/'
 // let hostUrl = 'http://10.50.50.219:8080/'

 // let hostUrl = 'https://wechat.undunion.com/'
let webUrl =  hostUrl + 'orange-wechat'
let appid = 'wxd3925e6afc44556e'
let component_appid = 'wx5d71c862912c04d9'

if (process.env.NODE_ENV === 'production'){
  driverServer = 'http://10.50.50.224:8090/orange-driver'
  hostUrl = 'http://dev-wechat.undunion.com/'
  webUrl = hostUrl + 'orange-wechat'
  appid = 'wxd3925e6afc44556e'
  component_appid = 'wx5d71c862912c04d9'
}

export default {
  driverServer,
  webUrl,
  hostUrl,
  appid,
  component_appid,
}
