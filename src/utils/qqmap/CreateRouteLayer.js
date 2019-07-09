import utils from './utils'
import CreateRouteOverlay from './CreateRouteOverlay'

let c = 80, l = 200;
export default class CreateRouteLayer {
  constructor (param) {
    this.map = param.map;
    this.path = param.path;
    this.dash = [];
    this.dashCache = {};
    this.removed = false;
    this._onZoomChange = function (t) {
      setTimeout(() => {
        if(!this.removed){
          this.dash.forEach(function (t) {
            t.setMap(null)
          });
          if(this.dashCache[t]){
            this.dash = this.dashCache[t]
          }else{
            this._generateDash()
          }
          this.dash.forEach( (t) => {
            t.setMap(this.map.baseMap)
          });
        }
      }, 0)
    };
    this.remove = function () {
      try {
        this.removed = true;
        this.outline.setMap(null);
        this.line.setMap(null);
        this.dash.forEach(function (t) {
          t.setMap(null)
        });
        this.dash = null;
        this.dashCache = null;
        this.map.off("map.zoomchange", this._onZoomChange);
        this.map.off("map.removed", this.remove);
      } catch (t) {
      }
    };
    this._generateDash();
    this._create(param);
    this._bindEvent();
  }

  _create (param) {
    this.outline = new qq.maps.Polyline({
      strokeWeight: 10,
      strokeColor: param.outlineColor || "#6296D7",
      zIndex: 9,
      path: this.path.map(function (t) {
          return new qq.maps.LatLng(t.lat, t.lng)
      })
    });
    this.outline.setMap(this.map.baseMap);
    this.line = new qq.maps.Polyline({
      strokeWeight: 8,
      strokeColor: param.lineColor || "#7ab4f5",
      zIndex: 10,
      path: this.path.map(function (t) {
        return new qq.maps.LatLng(t.lat, t.lng)
      }),
    });
    this.line.setMap(this.map.baseMap);

    this.dash.forEach((t) => {
      t.setMap(this.map.baseMap)
    });
  }

  _generateDash () {
    let _this = this;
    this.dash = [];
    let e = 0,
      n = this.map.latlngToPixel(this.path[0]),
      o = this.map.latlngToPixel(this.path[1]),
      angle = this._angle(n, o);
    this.dash.push({x: n.x, y: n.y, angle: angle});
    for (let i = 0, s = this.path.length; i < s - 1; i++){
      n = this.map.latlngToPixel(this.path[i]);
      o = this.map.latlngToPixel(this.path[i + 1]);
      e = this._interpolateBetweenPoints(n, o, e);
    }

    if(this.dash.length > l){
      !function () {
        let e = Math.ceil(_this.dash.length / l);
        _this.dash = _this.dash.filter(function (t, n) {
          return n % e === 0
        })
      }()
    }
    this.dash = this.dash.map(function (e) {
      let latlng = _this.map.pixelTolatlng(e);
      return new CreateRouteOverlay({lat: latlng.lat, lng: latlng.lng, angle: e.angle})
    });
    let u = this.map.getZoom();
    this.dashCache[u] = this.dash
  }

  _bindEvent () {
    this.map.on("map.zoomchange", this._onZoomChange, this)
    this.map.on("map.removed", this.remove, this)
  }

  _interpolateBetweenPoints (t, e, n) {
    let r = utils.distance(t, e) + n,
        i = this._angle(t, e);
    if (r < c){
      return r
    }
    let a = this._linearInterpolate(t, e, c - n);
    for (this.dash.push({x: a.x, y: a.y, angle: i}); utils.distance(a, e) >= c;){
      a = this._linearInterpolate(a, e, c);
      this.dash.push({
        x: a.x,
        y: a.y,
        angle: i
      });
    }
    return utils.distance(a, e)
  }

  _linearInterpolate (t, e, n) {
    return {
      x: (e.x - t.x) * n / utils.distance(t, e) + t.x,
      y: (e.y - t.y) * n / utils.distance(t, e) + t.y
    }
  }

  _angle (t, e) {
    return 180 * Math.atan2(e.y - t.y, e.x - t.x) / Math.PI
  }

  getBounds () {
    try {
      return this.line.getBounds()
    } catch (t) {
    }
  }

}
