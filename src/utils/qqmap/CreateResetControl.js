export default class CreateResetControl {
  constructor (param) {
    this.position = qq.maps.ControlPosition[param.position] || qq.maps.ControlPosition.LEFT_BOTTOM;
    this.margin = param.margin || "0 0 0 10px";
    this.map = param.map;
    this.clickHandler = function () {
      // var t = this.map.getZoom();
      if(param.clickHandler){
        param.clickHandler();
      }
    };
    this._create(param);
    this._bindEvent();
  }

  _create (param) {
    this.dom = document.createElement("div");
    this.dom.className = param.cssClass || "map-reset-control";
    if(this.margin){
      this.dom.style.margin = this.margin
    }
    if(typeof param.left === 'number'){
      this.dom.style.left = param.left
    }
    this.map.baseMap.controls[this.position].push(this.dom);
  }

  _bindEvent () {
    let _this = this;
    this.dom.addEventListener("click", () => {
      _this.clickHandler()
    });
    this.map.on("map.removed", this.remove, this)
  }

  remove () {
    let _this = this;
    try {
      this.map.off("map.removed", this.remove);
      let t = this.map.baseMap.controls[this.position],
          e = t.elems.indexOf(this.dom);
      t.removeAt(e);
      this.dom.removeEventListener("click", () => {
        _this.clickHandler()
      })
    } catch (t) {
    }
  }

  setMargin (margin) {
    try {
      this.margin = margin;
      this.dom.style.margin = this.margin;
    } catch (t) {
    }
  }

  show () {
    try {
      this.dom.style.display = "block"
    } catch (t) {
    }
  }

  hide () {
    try {
      this.dom.style.display = "none"
    } catch (t) {
    }
  }

}


