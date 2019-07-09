import BrowserAnimation from './BrowserAnimation'
let bAnimation = new BrowserAnimation()

export default class CreateOverlay extends qq.maps.Overlay {
  constructor(t) {
    super()
    this.dom = document.createElement("div");
    this.domStyle = this.dom.style;
    this.position = new qq.maps.LatLng(t.lat, t.lng);
    this.width = 0;
    this.height = 0;
  }

  construct() {
    var panes = this.getPanes();
    panes.overlayMouseTarget.appendChild(this.dom);
    this.width = this.dom.offsetWidth;
    this.height = this.dom.offsetHeight;
  }

  draw() {
    var project = this.getProjection(),
        pixel = project.fromLatLngToDivPixel(this.position);
    this.x = pixel.x - this.width / 2;
    this.y = pixel.y - this.height / 2;
    if(this.offset){
      this.x += this.offset.x;
      this.y += this.offset.y;
    }
    this.updateDomTransform();
  }

  setPosition(t) {
    this.position = new qq.maps.LatLng(t.lat, t.lng);
    this.draw();
  }

  updateDomTransform() {
    this.domStyle[bAnimation.style.transform] = bAnimation.createCssTranslateString(this.x, this.y);
  }

  destroy() {
    this.dom.parentNode.removeChild(this.dom);
  }

}
