let n = {
  R: 6378137,
  MAX_LATITUDE: 85.0511287798,
  project (center) {
    let e = Math.PI / 180,
      n = this.MAX_LATITUDE,
      o = Math.max(Math.min(n, center.lat), -n),
      r = Math.sin(o * e);
    return {
      x: this.R * center.lng * e,
      y: this.R * Math.log((1 + r) / (1 - r)) / 2
    }
  },
  unproject (t) {
    let e = 180 / Math.PI;
    return {
      lat: (2 * Math.atan(Math.exp(t.y / this.R)) - Math.PI / 2) * e,
      lng: t.x * e / this.R
    }
  }
};

export default {
  _scale: .5 / (Math.PI * n.R),
  latLngToPoint (center, zoom) {
    var newCenter = n.project(center),
      newZoom = this.scale(zoom);
    newCenter.x = newZoom * (this._scale * newCenter.x + .5);
    newCenter.y = newZoom * (-this._scale * newCenter.y + .5);
    return  newCenter
  },
  pointToLatLng (t, zoom) {
    var o = this.scale(zoom);
    t.x = (t.x / o - .5) / this._scale;
    t.y = (t.y / o - .5) / -this._scale
    return  n.unproject(t)
  },
  scale (zoom) {
    return 256 * Math.pow(2, zoom)
  },
  zoom (t) {
    return Math.log(t / 256) / Math.LN2
  }
}
