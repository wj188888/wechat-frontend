'use strict'

import {http} from '../utils/http'
let serverAnonymous = '/a'

export default {

  /**
   * 景点专线获取预览产品信息
   * @param productId
   */
  tourProductGetPreview: (productId) => {
    return http({
      url: '/tourProduct/getPreview',
      data:{
        productId: productId
      }
    })
  },

  /**
   * 景点专线获取预览产品信息
   * @param productId
   */
  lineProductGetPreview: (productId) => {
    return http({
      url: '/lineProduct/getPreview',
      data:{
        productId: productId
      }
    })
  },
  /**
   * 获取app版本信息
   * @param data
   */
  appPackageInfo: (data) => {
      return http({
          url: '/appPackageInfo/a/getLatestPackageInfo',
          data:data
      })
  },
  
  /**
   * 获取app信息
   * @param productTypeLevelOne
   */
  appVersionFind: (productTypeLevelOne) => {
    return http({
      url: 'appVersion/find',
      data:{
        productTypeLevelOne: productTypeLevelOne
      }
    })
  },
}