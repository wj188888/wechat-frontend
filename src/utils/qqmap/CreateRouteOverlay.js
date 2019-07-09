import CreateOverlay from './CreateOverlay'
import BrowserAnimation from './BrowserAnimation'
let bAnimation = new BrowserAnimation()

export default class CreateRouteOverlay extends CreateOverlay{
  constructor (param) {
    super(param)
    this.angle = param.angle;
    this.dom.className = "map-arrow-marker";
    this.domArrow = document.createElement("div");
    this.domArrowStyle = this.domArrow.style;
    this.domArrow.className = "arrow";
    this.dom.appendChild(this.domArrow);
  }

  draw () {
    super.draw()
    this.domArrowStyle[bAnimation.style.transform] = "rotateZ(" + this.angle + "deg)"
  }

}
