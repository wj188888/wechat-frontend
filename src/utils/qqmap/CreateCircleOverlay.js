import CreateOverlay from './CreateOverlay'

export default class CreateCircleOverlay extends CreateOverlay{
  constructor (param) {
    super(param)
    this.dom.className = "map-circle-marker"
    this.domCircle = document.createElement("div")
    this.domCircleStyle = this.domCircle.style
    this.domCircle.className = "circle"
    this.dom.appendChild(this.domCircle)
  }

}
