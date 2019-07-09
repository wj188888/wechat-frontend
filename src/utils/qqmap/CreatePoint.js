import CreatePointOverlay from './CreatePointOverlay'
import util from './utils'

export default class CreatePoint {
  constructor (pointData) {
    this.map = pointData.map;
    this.remove = function () {
      try {
        this.map.off("map.removed", this.remove);
        this.pointerMarker.setMap(null);
        if(this.pointerLabel){
          this.pointerLabel.setMap(null)
        }
      } catch (t) {
      }
    };
    this._create(pointData);
    this._bindEvent();
  }

  _create (pointData) {
    this.pointerMarker = new CreatePointOverlay(pointData);
    this.pointerMarker.setMap(this.map.baseMap);
    if(pointData.content){
      this.pointerLabel = new qq.maps.Label({
        position: this.pointerMarker.position,
        map: this.map.baseMap,
        content: util.cutStr(pointData.content),
        offset: new qq.maps.Size(6, -7),
        zIndex: 45,
        style: {
          color: "#121212",
          backgroundColor: "none",
          border: "none",
          fontSize: "12px",
          padding: 0,
          textShadow: "-1px -1px 0 #fff, 1px -1px 0 #fff,-1px 1px 0 #fff, 1px 1px 0 #fff"
        }
      });
      this.pointerLabel.setMap(this.map.baseMap)
    }
  }

  _bindEvent () {
    this.map.on("map.removed", this.remove, this)
  }

  setPosition (t) {
    try {
      this.pointerMarker.setPosition(t);
      if(this.pointerLabel){
        this.pointerLabel.setPosition(new qq.maps.LatLng(t.lat, t.lng))
      }
    } catch (t) {
    }
  }

  getPosition () {
    try {
      return this.pointerMarker.position
    } catch (t) {
    }
  }

}
