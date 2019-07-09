import CreateCarOverlay from './CreateCarOverlay'

export default class CreateCarLayer {
  constructor (param) {
    let _this = this;
    this.map = param.map;
    this._onZoomChange = function () {
      _this.carMarker.onZoomChange()
    };
    this.remove = function () {
      try {
        _this.map.off("map.zoomchange", _this._onZoomChange);
        _this.map.off("map.removed", _this.remove);
        _this.carMarker.setMap(null)
      } catch (t) {
      }
    };
    this._createCarMarker(param);
    this._bindEvent();
  }

  _createCarMarker (param) {
    this.carMarker = new CreateCarOverlay(param);
    this.carMarker.setMap(this.map.baseMap);
  }

  _bindEvent () {
    this.map.on("map.zoomchange", this._onZoomChange, this);
    this.map.on("map.removed", this.remove, this);
  }

  drive (t) {
    try {
      this.carMarker.moveTo({
        lat: t.lat,
        lng: t.lng
      }, t.angle, true)
    } catch (t) {
    }
  }

  getPosition () {
    try {
      return this.carMarker.position
    } catch (t) {
    }
  }

  showTip (t) {
    try {
      this.carMarker.showTip(t)
    } catch (t) {
    }
  }

  hideTip () {
    try {
      this.carMarker.hideTip()
    } catch (t) {
    }
  }

}
