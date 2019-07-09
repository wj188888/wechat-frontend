import CreateStationOverlay from './CreateStationOverlay'

export default class CreateStation {
  constructor (param) {
    let _this = this;
    this.map = param.map;
    this.remove = function () {
      try {
        _this.map.off("map.zoomchange", _this._onZoomChange);
        _this.map.off("map.removed", _this.remove);
        _this.stationMarker.setMap(null);
      } catch (t) {
      }
    };

    this._onZoomChange = function () {
      let zoomStation = param.type === 6 || param.type === 14 || param.type === 15 || param.type === 16
      if(!zoomStation) return
      if(param.type === 16){
        if(this.map.getZoom() > 14){
          this.hideStation()
        }else{
          this.showStation()
        }
      }else{
        if(this.map.getZoom() > 14){
          if(zoomStation){
            this.showStation()
          }else{
            this.showTip()
          }
        }else{
          if(zoomStation){
            this.hideStation()
          }else{
            this.hideTip()
          }
        }
      }
    };
    this._createStationMarker(param);
    this._bindEvent();
  }

  _createStationMarker (param) {
    this.stationMarker = new CreateStationOverlay(param);
    this.stationMarker.setMap(this.map.baseMap);
  }

  _bindEvent () {
    this.map.on("map.zoomchange", this._onZoomChange, this);
    this.map.on("map.removed", this.remove, this)
  }

  setPosition (latlng) {
    try {
      this.stationMarker.setPosition(latlng)
    } catch (t) {
    }
  }

  getPosition () {
    try {
      return this.stationMarker.position
    } catch (t) {
    }
  }
  
  showStation () {
    try {
      this.stationMarker.showStation()
    } catch (t) {
    }
  }
  
  hideStation () {
    try {
      this.stationMarker.hideStation()
    } catch (t) {
    }
  }
  
  showTip () {
    try {
      this.stationMarker.showTip()
    } catch (t) {
    }
  }
  
  hideTip () {
    try {
      this.stationMarker.hideTip()
    } catch (t) {
    }
  }

}

