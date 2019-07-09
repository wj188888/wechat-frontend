export default {
  n (t, type) {
    return Object.prototype.toString.call(t) === "[object " + type + "]"
  },
  isFn (t) {
    return n(t, "Function")
  },
  isStr (t) {
    return n(t, "String")
  },
  isOb (t) {
    return n(t, "Object")
  },
  isArray (t) {
    return n(t, "Array")
  },
  isUndefined (t) {
    return n(t, "Undefined")
  },
  each (t, n, r) {
    if (t && e(n))if (r = r || t, t.length) {
      for (var i = 0, a = t.length; i < a; i++)if (n.call(r, t[i], i, t) === !1)return
    } else if (o(t))for (var u in t)if (n.call(r, t[u], u, t) === !1)return
  },
  contains (t, n) {
    var r = !1;
    return u(t, function (t) {
      if (e(n)) {
        if (n(t))return r = !0, !1
      } else if (t === n)return r = !0, !1
    }), r
  },
  arrayClone (t, n) {
    for (var e = new Array(n); n--;)e[n] = t[n];
    return e
  },
  extend (t, n) {
    for (var e in n)t[e] = n[e];
    return t
  },
  loadScript (src, n) {
    var script = document.createElement("script");
    script.type = "text/javascript",
    script.async = "async",
    script.onload = script.onreadystatechange = function () {
      if(!(this.readyState && !/^(loaded|complete)$/.test(this.readyState))){
        if(n){
          n()
        }
        script.onload = script.onreadystatechange = null
      }
    };
    script.onerror = function () {
      if(n){
        n()
      }
      script.onerror = null
    };
    script.src = src;
    document.getElementsByTagName("head")[0].appendChild(script);
  },
  distance (t, n) {
    var e = t.x - n.x, r = t.y - n.y;
    return Math.sqrt(e * e + r * r)
  },
  cutStr (t) {
    var n = t.length;
    return n > 14 ? t.substr(0, 6) + "...<br/>..." + t.substr(n - 6, n) : n < 8 ? t : n > 10 ? /\(|\[|（/.test(t.charAt(6)) ? t.substr(0, 6) + "<br/>" + t.substr(6, n) : /\)|\]|）/.test(t.charAt(7)) ? t.substr(0, 8) + "<br/>" + t.substr(8, n) : t.substr(0, 7) + "<br/>" + t.substr(7, n) : /\(|\[|（/.test(t.charAt(5)) ? /\)|\]|）/.test(t.charAt(7)) === !1 ? t.substr(0, 7) + "<br/>" + t.substr(7, n) : 8 === n ? t : t.substr(0, 8) + "<br/>" + t.substr(8, n) : /\)|\]|）/.test(t.charAt(6)) ? t.substr(0, 7) + "<br/>" + t.substr(7, n) : t.substr(0, 6) + "<br/>" + t.substr(6, n)
  },

  _joinData (t) {
    var e = [];
    for (var key in t){
      e.push(encodeURIComponent(key) + "=" + encodeURIComponent(t[key]));
    }
    return e.join("&")
  },

  xhr (param) {
  function e() {
    if (200 === n.status) {
      let e = n.responseText;
      if(json === param.dataType){
        e = JSON.parse(e)
      }
      if(param.success){
        param.success(e)
      }
    } else {
      if(param.error){
        param.error(n.status, n.statusText)
      }
    }
  }

  var n = new window.XMLHttpRequest;
  if(!param.method){
    param.method = 'get'
  }
  if('get' === param.method){
    param.data = joinData(param.data)
    param.url += (param.url.indexOf("?") === -1 ? "?" : "&") + param.data
  }

  if(!param.cache){
    param.url += (param.url.indexOf("?") === -1 ? "?" : "&") + "_=" + (new Date).getTime()
  }

  if(param.async){
    n.onreadystatechange = function () {
      if(4 === n.readyState){
        e()
      }
    }
  }

  n.open(param.method, param.url, param.async);

  if(param.headers){
    for (var key in param.headers){
      n.setRequestHeader(key, param.headers[key]);
    }
  }

  if('post' === param.method){
    n.setRequestHeader("Content-Type", "text/plain")
    n.send(JSON.stringify(param.data))
  }else{
    n.send(null)
    if(!param.async){
      e()
    }
  }

}
}
