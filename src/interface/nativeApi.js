export default {
  init () {
    JsWebviewInterface.hideUnLoadingDialog()
    let urlParam = TOOL.getQueryString()
    if(urlParam['tabBarBg']){
      appStorage.set('tabBarBg', urlParam['tabBarBg'])
    }
    if(urlParam['X-Auth-Token']){
      appStorage.set('X-Auth-Token', urlParam['X-Auth-Token'])
    }else{
      appStorage.remove('X-Auth-Token')
    }
    appStorage.removeLocalData()
  },
  
  jumpToURI (url) {
    if(!url) return
    JsWebviewInterface.openBannarLink(url)
  },
  
  share (param) {
    // JsWebviewInterface.sharedWxByHtml(JSON.stringify(param))
  },
  
  aliPay () {
  
  },
  
  wxPay (param){
    switch (param.productTypeLevelOne) {
      case 'TAXI':
        JsWebviewInterface.getPayOrderForTaxi(JSON.stringify(param))
        break;
      case 'CUSTOM_BUS_enquiry':
        JsWebviewInterface.getPayOrderForEnquiry(JSON.stringify(param))
        break;
      default:
        JsWebviewInterface.payOrder(JSON.stringify(param))
    }
  }
}

