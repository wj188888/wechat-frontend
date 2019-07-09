import Events from './Events'
import utils from './utils'
import CreateUserOverlay from './CreateUserOverlay'

function l(t, e) {
  let n = 6371e3,
    o = Math.PI / 180,
    r = t.lat * o,
    i = e.lat * o,
    a = Math.sin(r) * Math.sin(i) + Math.cos(r) * Math.cos(i) * Math.cos((e.lng - t.lng) * o);
  return n * Math.acos(Math.min(a, 1))
}

let m = 50;
export default class CreateUser extends Events{
  constructor (param) {
    super()
    this.map = param.map;
    this.removed = false;
    this.remove = function () {
      try {
        this.removed = true;
        this.map.off("map.removed", this.remove);
        if(this.userMarker){
          this.userMarker.setMap(null);
        }
      } catch (t) {
      }
    };
    if(param.geo){
      this.callback = param.callback;
      this._geo(param);
    }else{
      this._createUserMarker(param);
    }
    this._bindEvent();
  }

  _geo (t) {
    let _this = this;
    let o = {lat: 30.2563122, lng: 104.3651120}; //浏览器定位坐标
    if(_this.userMarker){
      _this._setPosition({lat: o.lat, lng: o.lng})
    }else{
      utils.extend(t, {
        lat: o.lat,
        lng: o.lng
      });
      _this._createUserMarker(t);
      _this.callback(null, _this);
    }
    if(!_this.removed){
      setTimeout(function () {
        _this._geo(t)
      }, t.rate || 1000)
    }
  }

  _createUserMarker (t) {
    this.userMarker = new CreateUserOverlay(t);
    this.userMarker.setMap(this.map.baseMap);
  }

  _bindEvent () {
    this.map.on("map.removed", this.remove, this);
  }

  _setPosition (t) {
    if(m < l(this.userMarker.position, t)){
      this.userMarker.setPosition(t)
    }
  }

  setPosition (t) {
    try {
      if(this.userMarker){
        this.userMarker.setPosition(t)
      }
    } catch (t) {
    }
  }

  getPosition () {
    try {
      if(this.userMarker){
        return this.userMarker.position
      }else{
        return null
      }
    } catch (t) {
    }
  }

}
