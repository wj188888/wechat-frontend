'use strict'

import {http} from '../utils/http'
let serverAnonymous = '/a'

export default {
  /**
   * 根据店铺id查询店铺名称及公司名称
   */
  storeFind: () => {
    return http({
      webserver:'driverServer',
      url: `/store${serverAnonymous}/find`,
      back: 'URL'
    })
  },

  /**
   * app版本获取
   */
  appVersionFind: ( ) => {
    return http({
      webserver:'driverServer',
      url: '/appVersion' + serverAnonymous + '/find',
    })
  },
  /**
   * 查询司机服务产品以及司机详情--司机名片
   * @param driverId 司机id
   */
  driverGetDriverCard: (driverId) => {
    return http({
    webserver:'driverServer',
      url: '/driver' + serverAnonymous + '/getDriverCard',
      data:{
        driverId: driverId
      }
    })
  },

  /**
   * 查询公众号的用户名
   * @param storeId
   */
  findWxUserName: (storeId) => {
    return http({
      url: '/lineSku'+ serverAnonymous +'/findWxUserName',
      data:storeId
    })
  },
  
  /**
   * 查询公众号二维码
   * @param storeId
   */
  getStoreQrCodeUrl: (storeId) => {
    return http({
      url: `/store${serverAnonymous}/getStoreQrCodeUrl`,
      data: {
        storeId: storeId
      }
    })
  },

}