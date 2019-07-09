import utils from './utils'
import CreateRouteLayer from './CreateRouteLayer'

export default class CreateRoute {
  constructor (param) {
    this.map = param.map;
    this.callback = param.callback;
    this.remove = function () {
      try {
        this.map.off("map.removed", this.remove);
        if(this.routeLayer){
          this.routeLayer.remove()
        }
      } catch (t) {
      }
    };
    if(param.createType === 'custom'){
      this._createRouteLayer({path: param.path}, param)
    }else{
      this._requestRouteService(param)
    }

    this._bindEvent()
  }

  _requestRouteService (param) {
    let _this = this;
    this.directionsService = new qq.maps.DrivingService({
      complete : function(response){
        let directions_routes = response.detail.routes;
        for(let i = 0;i < directions_routes.length; i++){
          let route = directions_routes[i];
          _this._createRouteLayer({path: route.path}, param)
        }
      }
    })
  // LEAST_TIME:最少时间
  // LEAST_DISTANCE:最短距离
  // AVOID_HIGHWAYS:避开高速
  // REAL_TRAFFIC:实时路况
  // PREDICT_TRAFFIC:预测路况
    let policy = qq.maps.DrivingPolicy['LEAST_DISTANCE'];
    let startPoint = new qq.maps.LatLng(param.startPoint.lat, param.startPoint.lng);
    let endPoint = new qq.maps.LatLng(param.endPoint.lat, param.endPoint.lng);
    this.directionsService.setPolicy(policy);
    this.directionsService.search(startPoint, endPoint);
  }

  _createRouteLayer (pathArr, param) {
    var n = {map: this.map, path: pathArr.path};
    utils.extend(n, param);
    this.routeLayer = new CreateRouteLayer(n);
    this.callback(null, this);
  }

  _bindEvent () {
    this.map.on("map.removed", this.remove, this)
  }

  getBounds () {
    try {
      if(this.routeLayer){
        this.routeLayer.getBounds()
      }
    } catch (t) {
    }
  }

}
