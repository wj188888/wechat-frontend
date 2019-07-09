import utils from './utils'

export default class CreateProbeIcon extends qq.maps.Overlay{
  constructor (t) {
    super()
    this._map =  t.map;
    this.clientWidth = t.clientWidth || document.body.clientWidth;
    this.clientHeight = t.clientHeight || document.body.clientHeight;
    this.position = t.position;
    this.isLight = "undefined" == typeof t.isLight || t.isLight;
    this.createIcon(t);
    this.createLabel(t);
    this.createShadow();
    this.marker = new qq.maps.Marker({
      position: this.position,
      icon: this.icon,
      map: this._map.baseMap
    });
    this.bindEvent(t);
  }

  construct () {
    if(this.isLight){
      this.getPanes().overlayMouseTarget.appendChild(this.dom)
    }
  }

  createIcon (t) {
    var e = t.iconWidth || (this.clientWidth <= 320 ? 10 : 14),
        n = t.iconHeight || (this.clientWidth <= 320 ? 10 : 14);
    this.icon = new qq.maps.MarkerImage(
      t.iconImage || "/static/images/station_geton.png",
      new qq.maps.Size(e, n),
      new qq.maps.Point(0, 0),
      new qq.maps.Point(e / 2 - 1, n / 2 - 1),
      new qq.maps.Size(e, n)
    );
    this.iconWidth = e;
    this.iconHeight = n;
  }

  createLabel (t) {
    var e = this;
    this.label = new qq.maps.Label({
      position: t.position,
      map: this._map.baseMap,
      content: '<div class="recom-label">' + utils.cutStr(t.poi.displayname) + "</div>",
      offset: new qq.maps.Size(e.leftOffset(t), -6),
      style: t.labelStyle || {
        color: "#3CBCAC",
        backgroundColor: "none",
        border: "none",
        textShadow: "-1px -1px 0 #fff, 1px -1px 0 #fff,-1px 1px 0 #fff, 1px 1px 0 #fff"
      }
    })
  }

  createShadow () {
    this.dom = document.createElement("div");
    this.dom.className = this.clientWidth <= 320 ? "ani-light ani-lighting-mini" : "ani-light ani-lighting";
    this.dom.style.position = "absolute";
  }

  bindEvent (t) {
    qq.maps.event.addListener(this.marker, "click", function () {
      if("function" == typeof t.click){
        t.click(t.position)
      }
    })
  }

  leftOffset (t) {
    var e = t.position,
      o = this._map.latlngToPixel(e),
      r = this.clientWidth,
      i = 10 * t.poi.displayname.length + 15,
      a = utils.cutStr(t.poi.displayname);
    if(a.indexOf("<br/>") > 0){
      i = t.poi.displayname.length / 2 * 10 + 25
    }
    if(o.x >= .5 * r){
      return 15
    }else{
      if(o.x + i < .5 * r){
        return 15
      }else{
        return (i + 15) * -1
      }
    }
  }

  draw () {
    var t = this.getProjection(),
        e = t.fromLatLngToDivPixel(this.position);
    this.left = e.x;
    this.top = e.y - this.iconHeight / 2;
    this.dom.style.left = this.left + "px";
    this.dom.style.top = this.top + "px";
  }

  getPosition () {
    return this.marker.getPosition()
  }

  getPixel () {
    var projection = this.getProjection();
    if(projection){
      return projection.fromLatLngToContainerPixel(this.position)
    }else{
      new qq.maps.Point(0, 0)
    }
  }

  isNearCenter () {
    var t = this.getProjection();
    if (t && "function" == typeof t.fromLatLngToContainerPixel) {
      var e = t.fromLatLngToContainerPixel(this.position);
      if (this.isLeftCenter(e) && this.isTopCenter(e))return true
    }
    return false
  }

  isLeftCenter (t) {
    var e = this.iconWidth,
        n = this.clientWidth;
    if(t.x >= .5 * n){
      return t.x + .5 * e - .5 * n <= .05 * n
    }else{
      return .5 * n - (t.x + .5 * e) <= .05 * n
    }
  }

  isTopCenter (t) {
    var e = this.iconHeight,
        n = this.clientHeight,
        o = this.clientWidth;
    if(t.y >= .5 * n){
      return t.y + .5 * e - .5 * n <= .05 * o
    }else{
      return .5 * n - (t.y + .5 * e) <= .05 * o
    }
  }

  getCenterDistance (t) {
    var e = this.iconWidth,
        n = this.iconHeight,
        o = this.clientWidth,
        r = this.clientHeight,
        i = 0,
        a = 0;
    i = Math.abs(.05 * o - Math.abs(t.x + .5 * e - .5 * o))
    a = Math.abs(.05 * r - Math.abs(t.y + .5 * n - .5 * r))
    return {
      x: i,
      y: a
    }
  }

  destroy () {
    this.unLight();
    this.marker.setMap(null);
    this.label.setMap(null);
  }

  unLight () {
    try {
      var parentNode = this.dom.parentNode;
      if(parentNode){
        parentNode.removeChild(this.dom)
      }
    } catch (t) {
    }
  }

  setVisible (t) {
    if(t){
      this.dom.style.display = "inline-block"
    }else{
      this.dom.style.display = "none"
    }
    this.marker.setVisible(t);
    this.label.setVisible(t);
  }

}
