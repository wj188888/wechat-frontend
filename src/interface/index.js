import wxApi from './wxApi'
import nativeApi from './nativeApi'
import browserApi from './browserApi'
import store from '@/app/vuex'

export default {
  /**
   * 页面初始化
   */
  init () {
    this.bootstrapApp()
    let interfaceApi = this.getApi()
    interfaceApi.init()
  },
  
  /**
   * 获取设备api接口并初始化api
   * @returns {*}
   */
  getApi () {
    if(TOOL.browser().weixin){
      let hasAuthority = appStorage.get('hasAuthority')
      if(hasAuthority){
        return browserApi
      }else{
        return wxApi
      }
    }else if (TOOL.browser().undunion_app) {
      return nativeApi
    }else{
      return browserApi
    }
  },
  
  /**
   * 通用初始化
   */
  bootstrapApp () {
    this.getStoreData()
    this.getFromType()
  },
  
  storeFind () {
    let storeId = appStorage.get('StoreId')
    return api.storeFind(storeId).then(res=>{
      return Promise.resolve(res.data);
    })
  },
  
  /**
   * 获取信息，并缓存到本地
   * 注：进入应用店铺id必传
   */
  async getStoreData () {
    appStorage.update('StoreId')
    appStorage.update('hasAuthority') //无权限订阅号
    store.dispatch('gaodeLocation');
    let storeData = await this.storeFind()
    if(storeData.resultCode === '0'){
      let result = storeData.resultData;
      appStorage.set('indexRouter', result.homeIndex || '')
      
      appStorage.set('Brand_Name', result.brandName)
      $('title').html(result.brandName)
      
      appStorage.set('firmLogo', result.firmLogo)
      appStorage.set('firmFullName', result.firmFullName)
      appStorage.set('serviceTel', result.serviceTel || '')
      appStorage.set('complainTel', result.complainTel || '')
  
      if(result.productAlias && result.productAlias.productAliasItems){
        appStorage.set('productAliasItems', JSON.stringify(result.productAlias.productAliasItems))
      }
  
      //缓存首页广告栏1
      if(result.productAlias && result.productAlias.topPicLinkItems){
        appStorage.set('topPicLinkItems', JSON.stringify(result.productAlias.topPicLinkItems))
      }else{
        appStorage.remove('topPicLinkItems')
      }
  
      //缓存首页广告栏2
      if(result.productAlias && result.productAlias.bottomPicLinkItems){
        appStorage.set('bottomPicLinkItems', JSON.stringify(result.productAlias.bottomPicLinkItems))
      }else{
        appStorage.remove('bottomPicLinkItems')
      }
  
      //是否显示行程网店栏
      if(result.productAlias && typeof result.productAlias.shortcutMenu !== undefined){
        appStorage.set('shortcutMenu', result.productAlias.shortcutMenu)
      }else{
        appStorage.set('shortcutMenu', true)
      }
  
      //缓存底部文字导航
      if(result.productAlias && result.productAlias.textLinkItems){
        appStorage.set('textLinkItems', JSON.stringify(result.productAlias.textLinkItems))
      }else{
        appStorage.remove('textLinkItems')
      }
  
      //缓存营销设置
      if(result.marketSetting){
        appStorage.set('marketSetting', JSON.stringify(result.marketSetting))
      }else{
        appStorage.remove('marketSetting')
      }
    }
  },
  
  /**
   * 来源判断
   */
  getFromType () {
    let urlParam = TOOL.getQueryString()
    let fromType = 0
    if(urlParam['fromType']){
      fromType = urlParam['fromType']
    }
    appStorage.set('fromType', fromType)
  }
  
}