import CreateOverlay from './CreateOverlay'
import BrowserAnimation from './BrowserAnimation'
import IconConfig from './IconConfig'
let iconConf = new IconConfig()
let bAnimation = new BrowserAnimation()

export default class CreateUserOverlay extends CreateOverlay {
  constructor (param) {
    super(param)
    var icon = iconConf.get("usertype");
    this.angle = 0;
    this.dom.className = "map-user-marker";
    this.type = param.type;
    this.domUserOuter = document.createElement("div");
    this.domUserOuterStyle = this.domUserOuter.style;
    this.domUserOuter.className = "user " + icon[this.type].klass + "-outer";
    this.dom.appendChild(this.domUserOuter);
    this.domUser = document.createElement("div");
    this.domUserStyle = this.domUser.style;
    this.domUser.className = icon[this.type].klass;
    this.domUserOuter.appendChild(this.domUser);
    if(icon[this.type].offset){
      this.offset = icon[this.type].offset;
    }
    if (appStorage.get('X-Auth-Token')) {
      let usrInfo = JSON.parse(appStorage.get('userInfo'));
      this.domUser.className = "user-avatar";
      this.domUser.style.backgroundImage = "url(" + usrInfo.headimgurl + ")";
    }
    if(param.avatar){
      this.domUser.className = icon[this.type].klass + "-avatar";
      this.domUser.style.backgroundImage = "url(" + param.avatar + ")";
    }
    this._bindEvent();
  }

  _bindEvent () {
    if(0 === this.type){
      let _this = this;
      window.addEventListener("deviceorientation", this.deviceorientation.bind(this), false)
    }
  }

  setAngle (angle) {
    this.angle = angle;
    this.updateDomTransform()
  }

  deviceorientation (t) {
    var e = 0;
    if(t.webkitCompassHeading){
      e = t.webkitCompassHeading
    }else{
      e = -t.alpha
    }
    this.setAngle(e)
  }

  updateDomTransform () {
    super.updateDomTransform()
    this.domUserOuterStyle[bAnimation.style.transform] = "rotateZ(" + this.angle + "deg)",
    this.domUserStyle[bAnimation.style.transform] = "rotateZ(" + -this.angle + "deg)"
  }

  destroy () {
    super.destroy()
    var _this = this
    window.removeEventListener("deviceorientation", ()=>{
      _this.deviceorientation()
    }, false)
  }

}
