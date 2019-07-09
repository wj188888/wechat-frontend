import Events from './Events'
import utils from './utils'

export default class CreateProbeControl extends Events {
  constructor(param) {
    super()
    this.map = param.map;
    this.align = qq.maps.ControlPosition[param.align] || qq.maps.ControlPosition.CENTER;
    this.margin = param.margin || "-38px 0px 0px 2px";
    this.className = param.className
    this.probeLatlng = param.probeLatlng || null
    this.content = param.content || null
    this.isDrag = false
    this.isPick = true
    this._create();
    this._bindEvent();
    this._IRAF();
  }
  
  _create() {
    let map = this.map.baseMap,
      elem = document.createElement("div");
    elem.className = this.className || 'map-probe-control';
    if (this.margin) {
      elem.style.margin = this.margin
    }
    this.dom = elem;
    map.controls[this.align].push(this.dom);
  }
  
  toLatlng(t) {
    return new qq.maps.LatLng(t.lat, t.lng)
  }
  
  show() {
    this.dom.style.display = "block"
  }
  
  hide() {
    this.dom.style.display = "none"
  }
  
  _bindEvent() {
    let map = this.map.baseMap;
    this.zoomChangedHandle = () => {
      this.probeLatlng = map.getCenter()
      map.setCenter(this.probeLatlng)
    };
    qq.maps.event.addListener(map, "zoom_changed", this.zoomChangedHandle);
    
    this.dragstartHandle = () => {
      if (this.idleTimer) {
        clearTimeout(this.idleTimer)
      }
      // this.probeLatlng = null
      this.isDrag = true
      this.isPick = true
    };
    qq.maps.event.addListener(map, "dragstart", this.dragstartHandle);
    
    this.idleHandle = () => {
      this.clearMarkers()
      this.updateProbeLatlng(map.getCenter())
    };
    qq.maps.event.addListener(map, "idle", () => {
      if(!this.isPick) return
      if (this.isApple()) {
        this.idleHandle()
      } else {
        if (this.idleTimer) {
          clearTimeout(this.idleTimer)
        }
        this.idleTimer = setTimeout(() => {
          this.idleHandle()
        }, 150)
      }
      this.isPick = false
    });
    this.map.on("map.removed", () => {
      this.remove()
    })
  }
  
  initPinch() {
    let map = this.map.baseMap;
    this.touchstartHandle = (n) => {
      this.isTouch = true;
      this.touches = [];
      map.setOptions({
        draggable: true
      });
      
      if (n.touches.length > 1) {
        this.isPinch = true;
        this.touches.push(n.touches);
        if (this.isApple()) {
          map.setOptions({
            draggable: false
          })
        }
      }
    };
    document.body.addEventListener("touchstart", this.touchstartHandle);
  
    this.touchmoveHandle = (n) => {
      let zoom = this.map.baseMap.getZoom();
      if (n.changedTouches.length > 1) {
        this.isPinch = true;
        this.touches.push(n.changedTouches);
    
        if (this.touches.length < 2) return false;
    
        if (this.moveList && this.moveList.length > 0 && !this.isApple()) {
          for (let i = 0, r = this.moveList.length; i < r; i++) {
            if (0 !== i && i !== r - 1) {
              window.cancelAnimationFrame(this.moveList[i]);
            }
          }
        }
    
        map.setOptions({
          draggable: false
        });
    
        let a = this.isZoom();
        switch (a) {
          case 0:
            return;
          case -1:
            zoom -= 1;
            break;
          case 1:
            zoom += 1
        }
        if (zoom < 0) {
          zoom = 0
        }
        if (zoom > 18) {
          zoom = 18
        }
        let s = this.updateZoom(() => {
          this.map.baseMap.setZoom(zoom)
        });
        this.moveList.push(s)
      }
    }
    document.body.addEventListener("touchmove", this.touchmoveHandle);
    
    this.touchendHandle = function (n) {
      this.isTouch = false;
      this.isPinch = false;
      setTimeout(() => {
        map.setOptions({
          draggable: true
        })
      }, 300)
    };
    document.body.addEventListener("touchend", this.touchendHandle);
  }
  
  _IRAF () {
    let t = 0, e = ["webkit", "moz"];
    for (let n = 0; n < e.length && !window.requestAnimationFrame; ++n) {
      window.requestAnimationFrame = window[e[n] + "RequestAnimationFrame"];
      window.cancelAnimationFrame = window[e[n] + "CancelAnimationFrame"] || window[e[n] + "CancelRequestAnimationFrame"];
    }
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = (e, n) => {
        let o = (new Date).getTime(),
          r = Math.max(0, 16.7 - (o - t)),
          i = window.setTimeout(() => {
            e(o + r)
          }, r);
        t = o + r
        return i
      }
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = (t) => {
        clearTimeout(t)
      }
    }
  }
  
  updateZoom (t) {
    let n = false,
      o = () => {
        n = false;
        if (t) {
          t.apply(this, arguments)
        }
      };
    
    function e() {
      if (!n) {
        window.requestAnimationFrame(o)
        n = true
      }
    }
    
    e()
  }
  
  updateProbeLatlng (probeLatlng) {
    let _this = this
    this.probeLatlng = probeLatlng;
    this.map.baseMap.setCenter(probeLatlng);
    let geocoder = new qq.maps.Geocoder({
      complete: function (result) {
        let geoAddress = result.detail
        let lat = geoAddress.location.lat
        let lng = geoAddress.location.lng
        let geoDetailAddress = geoAddress.addressComponents.streetNumber || geoAddress.addressComponents.street
        let address = {
          address: geoDetailAddress,
          name: geoDetailAddress
        }
        if(geoAddress.nearPois.length){
          address = geoAddress.nearPois[0]
        }
        _this.majorPoi = {
          city: geoAddress.addressComponents.city,
          county: geoAddress.addressComponents.district,
          detailAddress: address.address || address.street,
          name: address.name,
          lat: lat,
          lng:lng
        }
        _this.updateProbePoi(_this.majorPoi)
      }
    });
    geocoder.getAddress(this.probeLatlng);
  }
  
  updateProbePoi (probePoi) {
    if(this.isDrag){
      let zoom = this.map.baseMap.getZoom();
      this.trigger("picked", probePoi)
      if (zoom > 15) {
        this.buildMajorLabel()
      }
    }else if(this.content){
      this.buildMajorLabel(this.content)
    }
  }
  
  clearMarkers() {
    if (this.majorLabel) {
      this.majorLabel.setMap(null)
    }
    this.majorLabel = null
  }
  
  buildMajorLabel(content) {
    if (this.majorLabel) {
      this.majorLabel.setMap(null)
    }
    this.majorLabel = new qq.maps.Label({
      position: this.toLatlng(this.majorPoi),
      map: this.map.baseMap,
      content: utils.cutStr(content || this.majorPoi.name),
      style: {
        fontSize: "14px",
        color: "#121212",
        zIndex: 1000,
        backgroundColor: "none",
        border: "none",
        textShadow: "-1px -1px 0 #fff, 1px -1px 0 #fff,-1px 1px 0 #fff, 1px 1px 0 #fff"
      }
    })
  }
  
  isZoom() {
    let e = this.getPointDistance.apply(this, this.touches[0]),
      n = this.getPointDistance.apply(this, this.touches[this.touches.length - 1]);
    if (e === n) {
      return 0
    }
    
    if (e < n) {
      return 1
    }
    
    if (e > n) {
      return -1
    }
    
    return void 0
  }
  
  isApple() {
    let ua = navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua)
  }
  
  getPointDistance(t, e) {
    if (void 0 === e) return 0;
    let n = Math.abs(e.clientX - t.clientX),
      o = Math.abs(e.clientY - t.clientY);
    return Math.sqrt(Math.pow(n, 2) + Math.pow(o, 2))
  }
  
  remove() {
    this.dom.style.display = 'none'
    this.map.baseMap.controls[this.align].remove(0);
    this.clearMarkers();
    qq.maps.event.clearListeners(this.map.baseMap, "dragstart");
    qq.maps.event.clearListeners(this.map.baseMap, "idle");
    document.body.removeEventListener("touchstart", this.touchstartHandle);
    document.body.removeEventListener("touchmove", this.touchmoveHandle);
    document.body.removeEventListener("touchend", this.touchendHandle);
  }
  
}
