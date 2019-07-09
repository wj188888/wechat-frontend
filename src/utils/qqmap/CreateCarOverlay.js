import CreateOverlay from './CreateOverlay'
import BrowserAnimation from './BrowserAnimation'
import IconConfig from './IconConfig'
let iconConf = new IconConfig()
let bAnimation = new BrowserAnimation()

function c(t, e) {
  let n = e.lng - t.lng,
    o = e.lat - t.lat,
    r = Math.atan2(n, o),
    i = 180 * r / Math.PI;
  return i
}

function l(t, e) {
  let n = Math.abs((t - e) % 360);
  return n < 2 || 360 - n < 2
}

function f(t, e) {
  if (e > t)for (; e - t > 180;)e -= 360; else for (; t - e > 180;)e += 360;
  return e
}

function p(t, e) {
  return Math.abs(t.lat - e.lat) < 1e-5 && Math.abs(t.lng - e.lng) < 1e-5
}

let A = function t(e, n, o) {
    null === e && (e = Function.prototype);
    let r = Object.getOwnPropertyDescriptor(e, n);
    if (void 0 === r) {
      let i = Object.getPrototypeOf(e);
      return null === i ? void 0 : t(i, n, o)
    }
    if ("value" in r)return r.value;
    let a = r.get;
    if (void 0 !== a)return a.call(o)
  },
  state1 = 1,
  state2 = 2,
  state3 = 3,
  state4 = 4;

export default class CreateCarOverlay extends CreateOverlay{
  constructor (t) {
    super(t)
    this.id = this.dom.id = t.id || 0;
    this.angle = t.angle;
    this.type = t.type;
    let icon = iconConf.get("cartype");
    this.useAngle = icon[this.type].angle;
    this.dom.className = "map-car-marker";
    this.domStyle[bAnimation.style.transitionTimingFunction] = "linear";
    this.domTip = document.createElement("div");
    this.domTipStyle = this.domTip.style;
    this.domTipStyle[bAnimation.style.transitionTimingFunction] = "linear";
    this.domTipStyle.display = "none";
    this.domTip.className = "tip";
    this.domTipStyle.top = -icon[this.type].height / 2 - 20 + "px";
    this.domTipStyle.left = icon[this.type].width / 2 + "px";
    this.domCar = document.createElement("div");
    this.domCarStyle = this.domCar.style;
    this.domCarStyle[bAnimation.style.transitionTimingFunction] = "linear";
    this.domCar.className = "car " + icon[this.type].klass;
    if(t.icon){
      this.domCarStyle.backgroundImage = "url(" + t.icon + ")";
      if(t.width && t.height){
        this.domCarStyle.width = t.width + "px";
        this.domCarStyle.height = t.height + "px";
        this.domCarStyle.backgroundSize = t.width + "px " + t.height + "px";
        this.domTipStyle.top = -t.height / 2 + "px";
        this.domTipStyle.left = t.width / 2 + "px";
      }
    }
    this.dom.appendChild(this.domTip);
    this.dom.appendChild(this.domCar);
    this.state = state1;
    this.animationQueue = [];
    this.index = 0;
    this._bindEvent();
  }

  _bindEvent () {
    let _this = this
    this.dom.addEventListener(bAnimation.style.transitionEnd, () => {
      _this._onTransitionEnd()
    })
  }

  _onTransitionEnd () {
    if(this.state === state4){
      this.dom.parentNode.removeChild(this.dom)
    }else{
      if(this.animationQueue && this.animationQueue.length && this.index !== this.animationQueue.length){
        this.index++
        if(this.index < this.animationQueue.length){
          this._runAnimation()
        }
      }
    }
  }

  _runAnimation () {
    this.animationQueue[this.index]();
  }

  _transitionTime (t) {
    this.domStyle[bAnimation.style.transitionDuration] = t + "ms"
    this.domCarStyle[bAnimation.style.transitionDuration] = t + "ms"
  }

  construct () {
    let _this = this;
    super.construct()
    setTimeout(function () {
      _this._transitionTime(500)
      _this.domCarStyle.opacity = 1
    }, 0)
  }

  moveTo (t, e, n) {
    let _this = this,
      r = new qq.maps.LatLng(t.lat, t.lng);
    if (!p(this.position, t)) {
      let i = this.animationQueue.length === this.index;
      if(this.useAngle){
        this.animationQueue.push(function () {
          let t = c(_this.position, r);
          _this.state = state2;
          let i = n ? _this.angle : e,
              a = l(i, t) ? 1 : 500;
          if(_this.x && _this.y){
            _this._transitionTime(a)
          }
          _this.setAngle(t)
        })
      }

      this.animationQueue.push(function () {
        _this.state = state3;
        let r = n ? 5000 : l(e, _this.angle) ? 5000 : 4000;
        if(_this.x && _this.y){
          _this._transitionTime(r)
        }
        _this.setPosition(t)
      })

      if(!n && this.useAngle){
        this.animationQueue.push(function () {
          _this.state = state1
          if(l(e, _this.angle)){
            _this._transitionTime(1)
          }else{
            _this._transitionTime(500)
          }
          _this.setAngle(e)
        })
      }

      if(i){
        this._runAnimation()
      }
    }
  }

  changeType (type) {
    this.type = type;
    let icon = iconConf().get("cartype");
    this.domCar.className = "car " + icon[this.type].klass
    this.useAngle = icon[this.type].angle
  }

  setAngle (t) {
    if(t !== this.angle){
      this.angle = f(this.angle, t)
      this.updateDomTransform()
    }else{
      this.index++
      if(this.index < this.animationQueue.length){
        this._runAnimation()
      }
    }
  }

  updateDomTransform () {
    super.updateDomTransform()
    if(this.useAngle){
      this.domCarStyle[bAnimation.style.transform] = "rotateZ(" + this.angle + "deg)"
    }
  }

  onZoomChange () {
    this._transitionTime(0)
    if(this.index < this.animationQueue.length){
      this.index = this.animationQueue.length
    }
  }

  onVisibleChange (t) {
    if("visible" === t){
      this._transitionTime(0)
      if(this.index < this.animationQueue.length){
        this.index = this.animationQueue.length
      }

    }
  }

  destroy () {
    this._transitionTime(500)
    this.domCarStyle.opacity = 0
    this.state = state4
    this.animationQueue = null
    this.dom.removeEventListener(bAnimation.style.transitionEnd, this._onTransitionEnd)
  }

  showTip (t) {
    this.domTipStyle.display = "block"
    this.domTip.innerHTML = t
  }

  hideTip () {
    this.domTipStyle.display = "none"
    this.domTipStyle.innerHTML = ""
  }

}
