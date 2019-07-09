import IconConfig from './IconConfig'
import CreateOverlay from './CreateOverlay'
let iconConf = new IconConfig()

export default class CreateStoreOverlay extends CreateOverlay {
	constructor (pointData) {
		super(pointData)
		let type = pointData.type,
		iconConfig = iconConf.get('storetype');
		this.dom.className = "map-store-marker " + iconConfig[type].klass;
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
		this.clickHandler = function () {
			if(pointData.clickHandler){
				pointData.clickHandler();
			}
		};
		this._bindEvent(pointData);
	}

	changeType (type) {
		this.type = type;
		var icon = iconConf.get("storetype");
		this.dom.className = "map-store-marker " + icon[this.type].klass
	}

	_bindEvent (pointData) {
		this.dom.addEventListener("click", () => {
			if(pointData.type == 0){
				$('.map-store-marker').removeClass('store-max').addClass('store-min')
				this.changeType(1)
			}
			if(pointData.type == 2){
				$('.map-store-marker').removeClass('station-max').addClass('station-min')
				this.changeType(3)
			}
			this.clickHandler()
		});
	}
}
