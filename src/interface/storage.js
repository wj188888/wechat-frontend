export default {
  prefix () {
    return '_' + localStorage['StoreId']
  },
  
  /**
   * 有且与本地数据不同更新本地数据，如店铺id
   * @param storageName
   */
  update(storageName) {
    let urlParam = TOOL.getQueryString()
    let param = urlParam[storageName]
    if(storageName === 'Brand_Name' && param && param.indexOf('%') > -1){
      param = decodeURIComponent(param)
    }
    if(param){
      if(storageName === 'StoreId'){
        localStorage['StoreId'] = param
      }else if(param !== this.get(storageName)){
        this.set(storageName, param)
      }
    }
  },
  
  /**
   * 清除本地数据
   */
  removeLocalData () {
    let localDataItems = [
      'appCity',
      'sightCity',
      'taxiSearch',
      'carHailingSearch',
      'carhailingIndex',
      'carpoolbusIndex',
      'cityOutOfRange',
      'carpoolbusMap',
      'localtionNum',
      'currentLine',
      'marketerId',
    ]
    for(let i = 0; i < localDataItems.length; i++){
      this.remove(localDataItems[i])
    }
  },
  
  set (storageName, value) {
    localStorage[storageName + this.prefix()] = value
  },
  
  get (storageName) {
    if(storageName === 'StoreId'){
      return localStorage['StoreId']
    }else{
      return localStorage[storageName + this.prefix()]
    }
  },
  
  remove (storageName) {
    localStorage.removeItem(storageName + this.prefix())
  }
}
