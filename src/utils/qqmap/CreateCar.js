import Events from './Events'
import CreateCarOverlay from './CreateCarOverlay'

export default class CreateCar extends Events{
  constructor(param) {
    super()
    this.map = param.map;
    this.type = param.type;
    this.removed = false;
    this.polling = true;
    this.paramData = {
      lat: param.lat,
      lng: param.lng,
      orderId: param.orderId,
      productTypeLevelOne: param.productTypeLevelOne,
    };
    this.callback = param.callback;
    this._onZoomChange = function () {
      if(this.carMarker){
        this.carMarker.onZoomChange()
      }
    };

    this.remove = function () {
      try {
        this.removed = true;
        this.map.off("map.zoomchange", this._onZoomChange);
        this.map.off("map.removed", this.remove);
        if(this.carMarker){
          this.carMarker.setMap(null)
        }
      } catch (t) {
      }
    };

    this._requestLocService();
    this._bindEvent();
  }

  shutDownPolling () {
    this.polling = false;
  }

  _requestLocService () {
    if(!this.polling) return
    api.geoPolling(this.paramData).then(res => {
      const data = TOOL.toJson(res.data)
      if (data.resultCode == '0') {
        let carPointer = data.resultData.content
        this.paramData.lat = carPointer.latitude
        this.paramData.lng = carPointer.longitude
        let pointer = TOOL.baiduToTencent({
          lat: carPointer.latitude,
          lng: carPointer.longitude
        })
        let n = {
          "x": pointer.lat,
          "y": pointer.lng,
          "type": 2,
          "angle": 0
        }
        this.callback({data:data.resultData,pointer: pointer})
        if(this.carMarker){
          this._drive(n)
        }else{
          this._createCarMarker(n)
        }
        this._requestLocService(this.paramData)
      }else if(data.resultCode == '40001'){
        this._requestLocService(this.paramData)
      }
    })
  }



  _bindEvent () {
    this.map.on("map.zoomchange", this._onZoomChange, this)
    this.map.on("map.removed", this.remove, this)
  }

  _createCarMarker (t) {
    try {
      this.angle = t.angle;
      this.lat = t.x;
      this.lng = t.y;
    } catch (t) {
      return void this.callback(t)
    }
    var e = {
      angle: this.angle,
      type: this.type,
      lat: this.lat,
      lng: this.lng
    };
    this.carMarker = new CreateCarOverlay(e)
    this.carMarker.setMap(this.map.baseMap)
    this.callback(e, this)
  }

  _drive (t) {
    try {
      this.angle = t.angle;
      this.lat = t.x;
      this.lng = t.y;
    } catch (t) {
      return void this.trigger("error", t)
    }
    this.carMarker.moveTo({
      lat: this.lat,
      lng: this.lng
    }, this.angle, true)
  }

  changeType () {
    try {
      this.type = 10 * this.type;
      if(this.carMarker){
        this.carMarker.changeType(this.type)
      }
    } catch (t) {
    }
  }

  getPosition () {
    try {
      if(this.carMarker){
        return this.carMarker.position
      }else{
        return null
      }
    } catch (t) {
    }
  }

}
