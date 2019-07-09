import utils from './utils'
import CreateCircleOverlay from './CreateCircleOverlay'
let c = 12;

export default class CreateGuideLayer {
  constructor (param) {
    let _this = this;
    this.map = param.map;
    this.path = param.path;
    this.dash = [];
    this.dashCache = {};
    this.removed = false;
    this._onZoomChange = function (t) {
      setTimeout( () => {
        if(!_this.removed){
          _this.dash.forEach(function (t) {
            t.setMap(null)
          });

          if(_this.dashCache[t]){
            _this.dash = _this.dashCache[t]
          }else{
            _this._generateDash();
            _this.dash.forEach(function (t) {
              t.setMap(_this.map.baseMap)
            })
          }
          if(_this.map.getZoom() > 15){
          
          }else{
          
          }
        }
      }, 0)
    };
    this.remove = function () {
      try {
        _this.removed = true;
        _this.dash.forEach(function (t) {
          t.setMap(null)
        });
        _this.dash = null;
        _this.dashCache = null;
        _this.map.off("map.zoomchange", _this._onZoomChange);
        _this.map.off("map.removed", _this.remove);
      } catch (t) {
      }
    };
    this._generateDash();
    this._setBounds();
    this._create();
    this._bindEvent();
  }

  _create () {
    var t = this;
    this.dash.forEach(function (e) {
      e.setMap(t.map.baseMap)
    })
  }

  _generateDash () {
    var t = this;
    this.dash = [];
    var e = 0,
        n = this.map.latlngToPixel(this.path[0]),
        o = this.map.latlngToPixel(this.path[1]);
    this.dash.push({x: n.x, y: n.y});
    for (var r = 0, i = this.path.length; r < i - 1; r++){
      n = this.map.latlngToPixel(this.path[r]);
      o = this.map.latlngToPixel(this.path[r + 1]);
      e = this._interpolateBetweenPoints(n, o, e);
    }
    this.dash = this.dash.map(function (e) {
      var n = t.map.pixelTolatlng(e)
      return new CreateCircleOverlay({lat: n.lat, lng: n.lng});
    });
    var s = this.map.getZoom();
    this.dashCache[s] = this.dash
  }

  _bindEvent () {
    this.map.on("map.zoomchange", this._onZoomChange, this);
    this.map.on("map.removed", this.remove, this);
  }

  _interpolateBetweenPoints (t, e, n) {
    var r = utils.distance(t, e) + n;
    if (r < c){
      return r
    }
    var i = this._linearInterpolate(t, e, c - n);
    for (this.dash.push({x: i.x,y: i.y}); utils.distance(i, e) >= c;){
      i = this._linearInterpolate(i, e, c);
      this.dash.push({x: i.x, y: i.y});
    }
    return utils.distance(i, e)
  }

  _linearInterpolate (t, e, n) {
    return {
      x: (e.x - t.x) * n / utils.distance(t, e) + t.x,
      y: (e.y - t.y) * n / utils.distance(t, e) + t.y
    }
  }

  getBounds () {
    try {
      return this.bounds
    } catch (t) {
    }
  }

  _setBounds () {
    var _this = this;
    this.bounds = new qq.maps.LatLngBounds;
    this.path.forEach(function (e) {
      _this.bounds.extend(new qq.maps.LatLng(e.lat, e.lng))
    })
  }

}
