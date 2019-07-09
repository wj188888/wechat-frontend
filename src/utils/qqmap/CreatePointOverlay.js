import IconConfig from './IconConfig'
import CreateOverlay from './CreateOverlay'

export default class CreatePointOverlay extends CreateOverlay {
  constructor (pointData) {
    super(pointData)
    let type = pointData.type,
        iconConfig = new IconConfig().get('pointertype');
    this.dom.className = "map-pointer-marker " + iconConfig[type].klass;
    if(pointData.tips){
      this.domTip = document.createElement("div");
      this.domTip.className = "map-pointer-tips";
      this.dom.appendChild(this.domTip)
      setInterval(() => {
        let EndTime= new Date(pointData.tips);
        let NowTime = new Date();
        let t = EndTime.getTime() - NowTime.getTime();
        let d=0;
        let h=0;
        let m=0;
        let s=0;
        if(t >= 0){
          d = Math.floor(t/1000/60/60/24);
          h = Math.floor(t/1000/60/60%24);
          m = Math.floor(t/1000/60%60);
          s = Math.floor(t/1000%60);
        }
        let innerHtml = `<p><span>${d}</span>天<span>${h}</span>时<span>${m}</span>分<span>${s}</span>秒</p><p>开始行程</p>`
        $(this.domTip).html(innerHtml)
      }, 1000);
    }
    if(pointData.stationNum && type === 9){
      $(this.dom).html(pointData.stationNum)
    }
    this.offset = iconConfig[type].offset;
    if('pointer_custom' === iconConfig[type].klass){
      if(pointData.icon){
        this.dom.style.backgroundImage = 'url(' + pointData.icon + ')'
      }
    }
    if(pointData.width && pointData.height){
      this.dom.style.width = pointData.width + "px";
      this.dom.style.height = pointData.height + "px";
      this.dom.style.backgroundSize = pointData.width + "px " + pointData.height + "px";
      this.offset = {
        x: 0,
        y: - pointData.height / 2
      }
    }
  }
}
