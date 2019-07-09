import store from '@/app/vuex'

export default {
  /**
   * 微信浏览器初始化
   * 1、从URL获取token缓存到本地
   * 注：浏览器打开只从登录页面获取token,或者token过期重新获取
   * 2、本地没有缓存支付ID则获取支付ID
   * 3、判断微信用户是否注册
   */
  init () {
    this._getUrlToken()
    this._getWxPayId()
    this._userCheckAuth()
    appStorage.removeLocalData()
  },
  
  /**
   * 微信浏览器缓存token
   */
  _getUrlToken () {
    appStorage.update('X-Auth-Token')
  },
  
  /**
   * 如没有缓存支付ID，则获取支付ID
   */
  _getWxPayId () {
    if (!TOOL.browser().weixin) return;
    if (appStorage.get('payOpenId')) return;
    let param = TOOL.getQueryString();
    
    if (!param.code) {
      let url = encodeURIComponent(window.location.href)
      let getcodeparams = {
        appid: TOOL.appid,
        response_type: 'code',
        scope: 'snsapi_base',
        state: 'state',
        component_appid: TOOL.component_appid,
        redirect_uri: url
      };
      window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?" + TOOL.perapara(getcodeparams) + "#wechat_redirect";
    } else {
      let resource = api.getOpenid()
      $.ajax({
        url: resource.url,
        async: false,
        dataType: 'json',
        headers: {
          'X-Auth-Token': resource.token,
          StoreId: resource.StoreId
        },
        data: {
          code: param.code
        },
        success: function (data) {
          if (data.resultCode === '0') {
            appStorage.set('payOpenId', data.resultData.payOpenId)
          }
        }
      })
    }
  },
  
  /**
   * 判断微信用户是否注册
   * X-Auth-Token用于做登录判断
   * logoutToken用于未登录
   * 1、注册：使用新的Token覆盖URL上Token
   * 注：修复此种情况 —— 进入首页没注册，注册后，ios微信刷新会从url上获取并存储旧的token导致bug
   * 2、未注册：将不带customerId的token赋值给logoutToken用于未登录判断，并清除用于登录判断的X-Auth-Token
   * 3、微信分享用户进入页面用于判断是否注册，注册用户就直接登录
   */
  _userCheckAuth () {
    let resource = api.userCheckAuth()
    $.ajax({
      url: resource.url,
      async: false,
      dataType: 'json',
      headers: {
        'X-Auth-Token': resource.token,
        'StoreId': resource.StoreId
      },
      success: function (data) {
        if (data.resultCode === '0') {
          appStorage.set('X-Auth-Token', data.resultData.token)
        } else {
          if (appStorage.get('X-Auth-Token')) {
            appStorage.set('logoutToken', appStorage.get('X-Auth-Token'))
          }
          appStorage.remove('X-Auth-Token')
        }
      }
    })
  },
  
  jumpToURI (url) {
    if(!url) return
    location.href = url
  },
  
  share (param) {
    if (!TOOL.browser().weixin) return
    let shareUrl
    let shareUrlHost
    let shareUrlHash
    let shareUrlArr = param.shareUrl.split('#')
    if(shareUrlArr[0].indexOf('?') > -1){
      shareUrlHost = shareUrlArr[0].split('?')[0]
    }else{
      shareUrlHost = shareUrlArr[0]
    }
    if(shareUrlArr[1].indexOf('?') > -1){
      shareUrlHash = shareUrlArr[1].split('?')[0]
    }else{
      shareUrlHash = shareUrlArr[1]
    }
    shareUrl = shareUrlHost + '?#' + shareUrlHash
    
    let search = param.shareUrl
    let theRequest = {fromType: 1}
    search = search.split('#')[1]
    if (search.indexOf("?") !== -1) {
      let str = search.split('?')[1]
      let strs = str.split("&")
      for (let i = 0; i < strs.length; i++) {
        let paramArr = ['X-Auth-Token', 'Brand_Name', 'StoreId']
        if($.inArray(strs[i].split("=")[0], paramArr) === -1){
          theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1]
        }
      }
    }
    shareUrl = shareUrl + TOOL.joinQueryString(theRequest)
    api.customShareFindConfig({shareUrl: shareUrl}).then(res => {
      const result = TOOL.toJson(res.data)
      if (result.resultCode === '0') {
        wx.config({
          debug: false,
          appId: result.resultData.appid,
          timestamp: result.resultData.timestamp,
          nonceStr: result.resultData.nonceStr,
          signature: result.resultData.signature,
          jsApiList: [
            'checkJsApi',
            'onMenuShareAppMessage',
            'onMenuShareTimeline',
            'onMenuShareQQ',
            'onMenuShareQZone',
            'onMenuShareWeibo',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'showMenuItems',
            'hideMenuItems'
          ]
        });
        
        wx.ready(function () {
          // 1. 判断当前版本是否支持指定 JS 接口，支持批量判断
          wx.checkJsApi({
            jsApiList: [
              'menuItem:share:appMessage',
              'menuItem:share:timeline',
              'menuItem:share:qq',
              'menuItem:share:QZone',
              'menuItem:share:weiboApp',
              'menuItem:profile',
              'menuItem:addContact'
            ],
            success: function (res) {
            }
          })
          
          wx.hideAllNonBaseMenuItem()
          if (param.share) {
            wx.showAllNonBaseMenuItem()
            // wx.showMenuItems({
            //   menuList: [
            //     'menuItem:share:appMessage',
            //     'menuItem:share:timeline',
            //     'menuItem:share:qq',
            //     'menuItem:share:QZone',
            //     'menuItem:share:weiboApp',
            //     'menuItem:profile',
            //     'menuItem:addContact'
            //   ]    //要显示的菜单项
            // });
            
            let shareTitle = param.shareTitle || appStorage.get('Brand_Name')
            let shareDesc = param.shareDesc || '微信购票，方便快捷，一站到家'
            
            let qqShareUrl = result.resultData.shareUrl
            if (qqShareUrl.split('#')[1].indexOf('?') === -1) {
              qqShareUrl += '?'
            }
            
            let shareConfig = {
              title: shareTitle,
              desc: shareDesc,
              link: result.resultData.url,
              imgUrl: param.shareImgUrl || appStorage.get('firmLogo'),
              success: function () {},
              cancel: function () {}
            };
            
            let browserShareConfig = {
              title: shareTitle,
              desc: shareDesc,
              link: qqShareUrl,
              imgUrl: param.shareImgUrl || appStorage.get('firmLogo'),
              success: function () {},
              cancel: function () {}
            };
            // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
            wx.onMenuShareAppMessage(shareConfig);
            
            // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
            wx.onMenuShareTimeline(shareConfig);
            
            //分享到QQ
            wx.onMenuShareQQ(browserShareConfig);
            
            //分享到腾讯微博
            wx.onMenuShareWeibo(browserShareConfig);
            
            //分享到QQ空间
            wx.onMenuShareQZone(browserShareConfig);
          }
        });
        // wx.error(function () {
        // store.dispatch('showError', '分享失败，请稍后再试')
        // });
      } else {
        // store.dispatch('showError', result.resultMsg)
      }
    })
  },
  
  aliPay () {
  
  },
  
  /**
   * 微信支付
   * [
   * tradeNo 订单号,
   * productTypeLevelOne 产品大类,
   * payType 出租车支付方式：1在线支付，2线下支付
   * mileageFee 出租车里程费
   * roadFee 出租车路桥费
   * enquiryId 询价id
   * productId 产品id
   * callBack 出租车刷新本页
   * ]
   * 注 线路拼车支付成功后跳转页面不同
   */
  wxPay (param) {
    store.commit('UPDATE_LOADING', true)
    let resource;
    switch (param.productTypeLevelOne) {
      case 'TAXI':
        resource = api.wxPayUnifiedTaxiOrder({
          openId: appStorage.get('payOpenId'),
          tradeNo: param.tradeNo,
          mileageFee: param.mileageFee,
          roadFee: param.roadFee,
          payType: param.payType,
        })
        break;
      case 'CUSTOM_BUS_enquiry':
        resource = api.unifiedOrderForEnquiry({
          openId: appStorage.get('payOpenId'),
          tradeNo: param.enquiryId,
          productId: param.productId
        })
        break;
      case 'CAR_INSPECTION':
        resource = api.unifiedCarInsOrder({
            openId: appStorage.get('payOpenId'),
            tradeNo: param.tradeNo,
        })
        break;
      default:
        resource = api.unifiedOrder({
          openId: appStorage.get('payOpenId'),
          tradeNo: param.tradeNo,
          productTypeLevelOne: param.productTypeLevelOne
        })
    }
    
    resource.then(res => {
      const data = TOOL.toJson(res.data)
      store.commit('UPDATE_LOADING', false)
      if (data.resultCode === '0') {
        if(param.productTypeLevelOne === 'TAXI' && param.payType === 2){
          if(typeof param.callBack === 'function'){
            param.callBack()
          }
        }else{
          this._wxPayBridge(data.resultData, param)
        }
      } else {
        if(param.productTypeLevelOne === 'CAR_INSPECTION'&&param.routerName) {
          api.cancelInspection(param.tradeNo).then(res => {
              const data = TOOL.toJson(res.data);
              if(data.resultCode === '0') {

              } else {
                  store.dispatch('showError', data.resultMsg);
              }
          });
          store.dispatch('showError', '支付失败，已为你取消了订单，请重新创建订单');
        } else {
          store.dispatch('showError', data.resultMsg)
        }
      }
    })
  },
  
  _wxPayBridge (data, param) {
    WeixinJSBridge.invoke('getBrandWCPayRequest', {
      appId: data.appId,
      timeStamp: data.timeStamp.toString(),
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign
    }, function (weData) {
      if (weData.err_msg === 'get_brand_wcpay_request:ok') {
        param.wxPaySuccess(param)
      }else{
        param.wxPayFail(param)
      }
    })
  },
  
}