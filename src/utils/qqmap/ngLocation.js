import utils from './utils'

var i = {
  permission_denied: "未授权使用定位，请检查设置后重试",
  position_unavailable: "定位失败，请退出后进入重试",
  unknown_error: "定位失败或未允许定位，请检查设置后重试",
  network_error: "网络错误，请检查设置后重试",
  timeout: "定位超时，请检查设置后重试"
}

export default location = function (t) {
  if (t) {
    var e,
        r = false,
        a = t.timeout || {},
        s = t.context;

    if(utils.isFn(a.callback)){
      e = setTimeout(function () {
        r = true
        a.callback.call(s, i.permission_denied)
      }, 3000)
    }

    var u = function (i) {
      if (!r) {
        var a = t.maptype || (o.isAlipay ? "soso" : "wgs"),
            u = {
              lat: i.coords.latitude,
              lng: i.coords.longitude,
              maptype: a,
              way: "h5"
            };

        if(utils.isFn(t.success)){
          t.success.call(s, u)
          clearTimeout(e)
        }
      }
    },

    c = function (o) {
      if (!r) {
        var u = "";
        switch (o.code) {
          case o.TIMEOUT:
            u = i.timeout
            if(utils.isFn(a.callback)){
              a.callback.call(s, u)
            }
            break;
          case o.POSITION_UNAVAILABLE:
            u = i.position_unavailable
            if(utils.isFn(t.error)){
              t.error.call(s, u)
            }
            break;
          case o.PERMISSION_DENIED:
            u = i.permission_denied
            if(utils.isFn(t.error)){
              t.error.call(s, u)
            }
            break;
          case o.UNKNOWN_ERROR:
            u = i.unknown_error
            if(utils.isFn(t.error)){
              t.error.call(s, u)
            }
        }
        clearTimeout(e)
      }
    };

    if(utils.isFn(t.loading)){
      t.loading.call(s)
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(u, c, {
          enableHighAccuracy: !0,
          timeout: a.cnt || 3e3,
          maximumAge: 2e3
        })
      }
    }

  }
}
