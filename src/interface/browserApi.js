import store from '@/app/vuex'

export default {
  init () {
    this._tokenCheckExpire()
    appStorage.removeLocalData()
  },
  
  jumpToURI (url) {
    if(!url) return
    location.href = url
  },
  
  share () {
  
  },
  
  aliPay () {
  
  },
  
  wxPay (param){
    store.dispatch('showError', '支付失败，请在微信支付！')
  },
  
  /**
   * 非微信浏览器打开验证token是否过期
   */
  _tokenCheckExpire () {
    if (appStorage.get('X-Auth-Token')) {
      let resource = api.tokenCheckExpire()
      $.ajax({
        url: resource.url,
        async: false,
        dataType: 'json',
        headers: {
          'X-Auth-Token': resource.token,
          StoreId: resource.StoreId
        },
        success: function (data) {
          if (data.resultCode === '0' && !data.resultData) {
            appStorage.remove('X-Auth-Token')
          }
        }
      })
    }
  },
}