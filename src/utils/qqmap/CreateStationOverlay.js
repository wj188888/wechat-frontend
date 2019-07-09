import CreateOverlay from './CreateOverlay'
import IconConfig from './IconConfig'
let iconConf = new IconConfig()

export default class CreateStationOverlay extends CreateOverlay {
  constructor (param) {
    super(param)
    let icon = iconConf.get("stationtype");
    
    this.dom.className = "map-station-marker " + icon[param.type].klass;
    if("station_custom" === icon[param.type].klass){
      if(param.icon){
        this.dom.style.backgroundImage = "url(" + param.icon + ")";
      }
      if(param.width && param.height){
        this.dom.style.width = param.width + "px";
        this.dom.style.height = param.height + "px";
        this.dom.style.backgroundSize = param.width + "px " + param.height + "px";
      }
    }
    if(param.content){
      this.domTip = document.createElement("div");
      this.domTip.className = "map-station-tips";
      this.domTip.innerHTML = param.content
      this.dom.appendChild(this.domTip)
    }
    this.clickHandler = function () {
      if(param.clickHandler){
        param.clickHandler()
      }
    };
    this._bindEvent();
  }

  _bindEvent () {
    this.dom.addEventListener("click", this.clickHandler.bind(this));
  }

  destroy () {
    super.destroy();
    this.dom.removeEventListener("click", this.clickHandler.bind(this));
  }
  
  showStation () {
    this.dom.style.opacity = 1
  }
  
  hideStation () {
    this.dom.style.opacity = 0
  }
  
  showTip () {
    this.domTip.style.opacity = 1
  }
  
  hideTip () {
    this.domTip.style.opacity = 0
  }
}
