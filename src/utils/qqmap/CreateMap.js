import mapParam from './mapParam'
import Events from './Events'
import CreateCar from './CreateCar'
import CreatePoint from './CreatePoint'
import CreateStore from './CreateStore'
import CreateUser from './CreateUser'
import CreateRoute from './CreateRoute'
import CreateStation from './CreateStation'

import CreateResetControl from './CreateResetControl'
import CreateProbeControl from './CreateProbeControl'

import CreateRouteLayer from './CreateRouteLayer'
import CreateGuideLayer from './CreateGuideLayer'
import CreateCarLayer from './CreateCarLayer'
import CreateRangePolygon from './CreateRangePolygon'

const U = 4;
const R = 16;
//const qq =

class CreateMap extends Events{
  constructor(mapId, param) {
    super()
    this.container = mapId;
    this.lat = param.lat;
    this.lng = param.lng;
    this.zoom = param.zoom;
    this.zoomControl = !!param.zoomControl;
    this.panControl = !!param.panControl;
    this.mapTypeControl = !!param.mapTypeControl;
    this._init()
  }
  
  _init () {
    this._createMap();
    this._bindEvent();
  }
  
  _createMap () {
    let mapConfig = {
      zoom: this.zoom || R,
      mapStyleId: qq.maps.MapStyleId.TNIT,
      zoomControl: this.zoomControl,
      panControl: this.panControl,
      mapTypeControl: this.mapTypeControl
    };
    if(this.lat && this.lng){
      mapConfig.center = new qq.maps.LatLng(this.lat, this.lng)
    }
    let elem = document.getElementById(this.container);
    elem.className += " map-background";
    this.baseMap = new qq.maps.Map(document.getElementById(this.container), mapConfig);
    this.pixelOrigin = this._getNewPixelOrigin(mapConfig.center, mapConfig.zoom);
    // this.done("map.created");
  }
  
  _bindEvent () {
    qq.maps.event.addListener(this.baseMap, "zoom_changed", () => {
      let zoom = this.getZoom();
      this.trigger("map.zoomchange", zoom);
    });
    
    qq.maps.event.addListener(this.baseMap, "click", () => {
      this.trigger("map.click")
    });
    
    qq.maps.event.addListener(this.baseMap, "dragstart", () => {
      try {
        let t = e.getCenter();
        this.trigger("map.dragstart", t)
      } catch (e) {}
    });
    
    qq.maps.event.addListener(this.baseMap, "dragend", () => {
      try {
        let t = e.getCenter();
        this.trigger("map.dragend", t)
      } catch (e) {}
    })
  }
  
  _getSize () {
    let elem = document.getElementById(this.container);
    return [elem.clientWidth, elem.clientHeight]
  }
  
  _getNewPixelOrigin (center, zoom) {
    let size = this._getSize().map(function (value) {
      return value / 2
    });
    let point = mapParam.latLngToPoint(center, zoom);
    point.x = Math.round(point.x - size[0]);
    point.y = Math.round(point.y - size[1]);
    return point
  }
  
  _getBoundsZoom (t, e) {
    let n = e.paddingTop || 0,
        o = e.paddingRight || 0,
        r = e.paddingBottom || 0,
        i = e.paddingLeft || 0,
        a = this.baseMap.getZoom(),
        s = this._getSize(),
        u = this._getBoundsSize(t, a),
        c = Math.min((s[0] - i - o) / u[0], (s[1] - n - r) / u[1]);
    let zoom = c * mapParam.scale(a);
    zoom = mapParam.zoom(zoom)
    a = Math.floor(zoom);
    return Math.max(U, Math.min(R, a))
  }
  
  _getBoundsSize (t, e) {
    let n = t.getNorthEast(),
        o = t.getSouthWest(),
        r = mapParam.latLngToPoint(n, e),
        i = mapParam.latLngToPoint(o, e);
    return [r.x - i.x, i.y - r.y];
  }
  
  _getBounds (t) {
    let e = new qq.maps.LatLngBounds;
    t.forEach(function (t) {
      if (t.getBounds) {
        let n = t.getBounds().getNorthEast(),
            o = t.getBounds().getSouthWest();
        e.extend(n);
        e.extend(o);
      } else {
        let r = t.getPosition();
        e.extend(r)
      }
    });
    return  e;
  }
  
  _getCenter (t, e, n) {
    let o = n.paddingTop || 0,
        r = n.paddingRight || 0,
        i = n.paddingBottom || 0,
        a = n.paddingLeft || 0,
        s = mapParam.latLngToPoint(t.getNorthEast(), e),
        u = mapParam.latLngToPoint(t.getSouthWest(), e),
        c = [(r - a) / 2, (i - o) / 2],
        l = {};
    l.x = (u.x + s.x) / 2 + c[0];
    l.y = (u.y + s.y) / 2 + c[1];
    let f = mapParam.pointToLatLng(l, e);
    return new qq.maps.LatLng(f.lat, f.lng)
  }
  
  setCenter (t, e) {
    try {
      this.baseMap.setCenter(new qq.maps.LatLng(t, e))
    } catch (t) {
    }
  }
  
  getCenter () {
    try {
      let t = this.baseMap.getCenter();
      return {
        lat: t.getLat(),
        lng: t.getLng()
      }
    } catch (t) {
    }
  }
  
  setZoom (zoom) {
    try {
      this.baseMap.zoomTo(zoom)
    } catch (t) {
    }
  }
  
  getZoom () {
    try {
      return this.baseMap.getZoom()
    } catch (t) {
    }
  }
  
  setView (controls, pos) {
    try {
      controls = controls.filter(function (value) {
        if(value.getBounds){
          return value.getBounds()
        }else if(value.getPosition){
          return value.getPosition()
        }
      });
      if (0 === controls.length)return;
      let bounds = this._getBounds(controls),
          zoom = this._getBoundsZoom(bounds, pos || {}),
          point = this._getCenter(bounds, zoom, pos || {});
      this.baseMap.panTo(point)
      this.baseMap.zoomTo(zoom)
    } catch (t) {
    }
  }
  
  remove () {
    try {
      qq.maps.event.clearListeners(this.baseMap, "zoom_changed");
      qq.maps.event.clearListeners(this.baseMap, "dragend");
      this.done("map.removed");
      this.baseMap = null;
    } catch (t) {
    }
  }
  
  latlngToPixel (t) {
    try {
      let e = this.baseMap.getZoom(),
          n = this.baseMap.getCenter(),
          o = mapParam.latLngToPoint(t, e);
      this.pixelOrigin = this._getNewPixelOrigin(n, e);
      o.x = Math.round(o.x) - this.pixelOrigin.x;
      o.y = Math.round(o.y) - this.pixelOrigin.y;
      return o
    } catch (t) {
    }
  }
  
  pixelTolatlng (t) {
    try {
      let e = this.baseMap.getZoom(),
          n = this.baseMap.getCenter();
      this.pixelOrigin = this._getNewPixelOrigin(n, e);
      t.x = t.x + this.pixelOrigin.x;
      t.y = t.y + this.pixelOrigin.y;
      return mapParam.pointToLatLng(t, e)
    } catch (t) {
    }
  }
  
}

export default {
  /**
   * 创建地图
   */
  createMap: function (container, mapConfig) {
    return new CreateMap(container, mapConfig)
  },
  component: {
    Car: CreateCar,
    Pointer: CreatePoint,
    Store: CreateStore,
    User: CreateUser,
    Route: CreateRoute,
    Station: CreateStation
  },
  control: {
    ResetControl: CreateResetControl,
    ProbeControl: CreateProbeControl
  },
  vector: {
    RouteLayer: CreateRouteLayer,
    GuideLayer: CreateGuideLayer,
    CarLayer: CreateCarLayer,
    CreateRangePolygon: CreateRangePolygon
  }
}
