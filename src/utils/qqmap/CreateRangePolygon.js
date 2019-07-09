export default class CreateRangePolygon {
	constructor (param) {
		let _this = this;
		this.map = param.map;
		this.remove = function () {
			try {
				_this.map.off("map.removed", _this.remove);
				_this.rangePolygon.setMap(null)
			} catch (t) {
			}
		};
		this._createPolygon(param);
		this._bindEvent();
	}

	_createPolygon (param) {
	  let opacity = param.opacity || 0.1
		this.rangePolygon = new qq.maps.Polygon({
			path: param.path,
			strokeColor: qq.maps.Color.fromHex("#ffb787", opacity),
			strokeWeight: 1,
			fillColor: new qq.maps.Color.fromHex("#ffb787", opacity),
			map: this.map.baseMap
		});
		this.rangePolygon.setMap(this.map.baseMap);
	}

	_bindEvent () {
		this.map.on("map.removed", this.remove, this);
	}

	getBounds () {
		try {
			if(this.rangePolygon){
				return this.rangePolygon.getBounds()
			}
		} catch (t) {
		}
	}

}