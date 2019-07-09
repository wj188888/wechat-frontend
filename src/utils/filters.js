import tool from './tool'
exports.customTime = item => {
  let nowTime = new Date().getTime()
  let minuteTime = 60*1000
  let hourTime = 60*minuteTime
  let dayTime = 24*hourTime
  let monthTime = dayTime * 30
  let yearTime = monthTime * 12

  let publishTime = new Date(item).getTime()
  let historyTime = parseInt(nowTime) - parseInt(publishTime)
  let descTime
  if(historyTime >= yearTime){
    //按年算
    descTime = parseInt(historyTime/yearTime) + '年前'
  }else if(historyTime< yearTime && historyTime >= monthTime){
    //按月算
    descTime = parseInt(historyTime/monthTime) + '月前'
  }else if(historyTime< monthTime && historyTime>= dayTime){
    //按天算
    descTime = parseInt(historyTime/dayTime) + '天前'
  }else if(historyTime< dayTime && historyTime>= hourTime){
    //按小时算
    descTime = parseInt(historyTime/hourTime) + '小时前'
  }else if(historyTime< hourTime && historyTime>= minuteTime){
    //按分钟算
    descTime = parseInt(historyTime/minuteTime) + '分钟前'
  }else{
    descTime = '刚刚'
  }
  return descTime
}

function getTwoNum (number) {
  if(number < 10){
    return '0' + number;
  }else{
    return number;
  }
}

/**
 * 时间处理过滤器
 * @param time 要格式话的时间
 * @param type 格式化类型
 * @returns {string}
 */
exports.formatDate =  (time, type) => {
  if(time){
    if(time.toString().indexOf('-') > -1){
      time = time.replace(/-/gm, '\/');
    }
    let tmpDate = new Date(time)
    let year = tmpDate.getFullYear()
    let mathon = tmpDate.getMonth() + 1
    let day = tmpDate.getDate()
    let week = tmpDate.getDay()
    let hours = tmpDate.getHours()
    let minutes = tmpDate.getMinutes()
    let weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    mathon = getTwoNum(mathon);
    day = getTwoNum(day);
    hours = getTwoNum(hours);
    minutes = getTwoNum(minutes);
    switch (type){
      case 'time':
        return hours + ':' + minutes
        break;
      case 'timeCh':
        let timeCh = ''
        if(hours > 0){
          timeCh = `${hours}小时`
        }
        if(minutes > 0){
          timeCh += `${minutes}分`
        }
        return timeCh
        break;
      case 'date':
        return year + '-' + mathon + '-' + day
        break;
      case 'holeDate':
        return year + '-' + mathon + '-' + day + ' ' + hours + ':' + minutes
        break;
      case 'dateWeek':
        return mathon + ' - ' + day + ' ' + weekArr[week]
        break;
      case 'monthDay':
        return mathon + '月' + day + '日'
        break;
      case 'flightTime':
        return mathon + '月' + day + '日' + ' ' + hours + ':' + minutes + ' ' + weekArr[week]
        break;
      case 'monthDayHour':
        return mathon + '月' + day + '日' + ' ' + hours + ':' + minutes
        break;
      case 'monthDayWeek':
          return mathon + '月' + day + '日' + ' ' + weekArr[week]
          break;
      case 'formatStartupTime':
        let profix
        let tomorrow = TOOL.changeDate(new Date(), 'd', 1)
        tomorrow = TOOL.newGetDate({date: tomorrow, type: 'date'})
        if(TOOL.dateCompare(time) === 0){
          profix = '今天'
        }else if(TOOL.dateCompare(time, tomorrow) === 0){
          profix = '明天'
        }else{
          profix = weekArr[week]
        }
        return mathon + '月' + day + '日' + ' ' + profix
    }
  }
}


/**
 * 时间处理过滤器
 * @param time 要格式话的时间
 * @returns {string}
 */
exports.formatViewTime = (time, type) => {
  if (type === 'm'){
    time = time * 60
  }
  if(time <　60*60){
    return parseInt(time/60) + '分'
  }else{
    let timeStr = `${Math.floor(time/(60*60))}小时`
    if(parseInt(time%(60*60)/60) > 0){
      timeStr += `${parseInt(time%(60*60)/60)}分`
    }
    return timeStr
  }
}

exports.weekText =  (week) => {
  let weekTextArr = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  if(week){
    return week.map(x => weekTextArr[x-1]).join(', ');
  }
}

exports.formatInspectionTime = (time) => {
  if(!time) {
    return '';
  }
  return time.substring(5,7)+'月'+time.substring(8,10)+'日 '+time.substring(11,16);
}

/**
 * 电话
 * @param phone
 * @returns {string}
 */
exports.formatPhone =  (phone) => {
  if(phone){
    phone += '';
    return phone.substr(0, 3) + ' - ' + phone.substr(3, 4) + ' - ' + phone.substr(7, 4);
  }
}

/**
 * 电话
 * @param phone
 * @returns {string}
 */
exports.hidePhone =  (phone) => {
  if(phone){
    phone += '';
    return phone.substr(0, 3) + '****' + phone.substr(7, 4);
  }
}

/**
 * 格式化航班数据
 */
exports.getAirline =  (airport, type) => {
  if(airport){
    if(type == 'code'){
      return airport.split(' ')[1];
    }else if(type == 'name'){
      return airport.split(' ')[0];
    }
  }
}

/**
 * 格式化距离
 */
exports.formatMeter =  (meter) => {
  if(meter){
    if(meter < 1){
      return '< 1m'
    }else if(meter <　1000){
      return parseInt(meter) + 'm'
    }else{
      return (meter/1000).toFixed(1) + 'km'
    }
  }
}

/**
 * 格式化公交地铁线路名称
 */
exports.formatBusName =  (name) => {
  if(name){
    let index = name.indexOf('(') || name.indexOf('（')
    if(index > 0){
      return name.substr(0, index)
    }
    return name
  }
}

/**
 * 格式化公交地铁线路时间
 */
exports.splitTime =  (time) => {
  if(time){
    return `${time.substr(0, 2)}:${time.substr(2, 4)}`
  }
}

/**
 * 格式化司机星级
 */
exports.renderStar = (star) => {
  var starNum = parseFloat(star).toFixed(1),
      intNum = 0,
      floatNum = 0,
      halfStar = false,
      grayStar = 0,
      htmlTemp = '';
  starNum = String(starNum).split('.')
  intNum  = parseInt(starNum[0])
  floatNum = parseInt(starNum[1])
  if(floatNum > 3){
    if(floatNum <= 6){
      halfStar =  true;
    }else{
      intNum += 1
    }
  }
  if(intNum){
    for(let s = 0; s < intNum; s++){
      htmlTemp += '<span class="icon-star hole-star"></span>'
    }
  }
  if(halfStar){
    htmlTemp += '<span class="icon-star half-star"></span>'
    grayStar = 5 - intNum - 1
  }else{
    grayStar = 5 - intNum
  }

  if(grayStar){
    for(let g = 0; g < grayStar; g++){
      htmlTemp += '<span class="icon-star gray-star"></span>'
    }
  }
  return htmlTemp
}

/**
 * 获取景点包含服务
 * @param includeServices
 * @returns {string}
 */
exports.getIncludeServices = (includeServices) => {
  if(includeServices && includeServices.length > 0){
    let str = ''
    for(let i in includeServices ){
      str += includeServices[i] + '、'
    }
    return str.substr(0, str.length - 1)
  }else{
    return includeServices
  }
}

/**
 * 文本截取
 * @param text
 * @param len
 * @returns {string}
 */
exports.strSplit = (text, len) => {
  if(text && text.length > len){
    return text.substr(0, len) + '...'
  }else{
    return text
  }
}

/**
 * 获取座位数
 * @param seatsArr
 * @returns {string}
 */
exports.getSeatsText = (seatsArr) => {
  if(seatsArr && seatsArr.length > 0){
    let str = ''
    for(let i = 0; i < seatsArr.length; i++ ){
      str += seatsArr[i] + '座、'
    }
    return str.substr(0, str.length - 1)
  }
}

/**
 * 获取座位数
 * @param coupons
 * @returns {string}
 */
exports.getCouponName = (coupons) => {
  if(coupons && coupons.length > 0){
    let str = ''
    for(let i = 0; i < coupons.length; i++ ){
      str += tool[coupons[i]] + '、'
    }
    return str.substr(0, str.length - 1)
  }
}

/**
 * 价格显示
 * @param price 价格
 * @param type 返回格式
 * @returns {string}
 */
exports.formatPrice = (price, type) => {
  let number = 0;
  if(price || Number(price) === 0){
    number = (+price).toFixed(2)
  }else{
    number = '0.00'
  }
  switch (type){
    case 'normal':
      break;
    case 'yuan':
      number = number + '元'
      break;
    case 'yuanren':
      number = number + '元/人'
      break;
    default:
      number = '¥' + number
  }
  return number
}


/**
 * 产品大类名字翻译
 * @param productTypeLevelOne 产品大类
 * @returns {string}
 */
exports.getProductOneName = (productTypeLevelOne) => {
  if(productTypeLevelOne){
    return tool[productTypeLevelOne]
  }
}

/**
 * 数组产品大类名字翻译
 * @param productTypeLevelOnes 产品大类
 * @returns {string}
 */
exports.getProductOneNames = (productTypeLevelOnes) => {
  if(productTypeLevelOnes && productTypeLevelOnes.length){
    return productTypeLevelOnes.map(productTypeLevelOne => tool[productTypeLevelOne]).join('、 ');
  }else{
    return '所有产品'
  }
}

/**
 * 产品名字翻译
 * @param productTypeLevelTwo 产品小类
 * @returns {string}
 */
exports.getProductTwoName = (productTypeLevelTwo) => {
  if(productTypeLevelTwo){
    return tool[productTypeLevelTwo]
  }
}

/**
 * 获取地址城镇
 * @param address
 * @returns {string}
 */
exports.getAddressTitle = (address) => {
  if(address){
    if(address.county) {
      if(address.town){
        return address.county + '('+ address.town +')'
      }else{
        return address.county
      }
    }
    return address.city
  }
}

/**
 * 拼接详细地址
 * @param address 产品地址信息【aAddress、bAddress】
 * @param station 站点信息【onStation、offStation】
 * @returns {string}
 */
exports.getAddressStation = (address, station) => {
  if(address){
    let stationName
    let mainAddress = ''
  
    if(address.county) {
      if(address.town){
        mainAddress = `${address.county}(${address.town})`
      }else{
        mainAddress = address.county
      }
    }else{
      mainAddress = address.city
    }
    
    if(station && station.name){
      stationName = `${mainAddress} ${station.name}`
    }else{
      stationName = `${mainAddress} ${address.name || address.stationName || address.detailAddress}`
    }
    return stationName
  }
}

/**
 * 拼接省市
 * @param address 地地址信息【aAddress、bAddress】
 * @returns {string}
 */
exports.getAddress = (address) => {
  if(address){
    if(address.county) {
      if(address.town){
        return `${address.county}(${address.town})`
      }else{
        return address.county
      }
    }else{
      return address.city
    }
  }
}

/**
 * 拼接站点地址
 * @param address 产品地址信息【aAddress、bAddress】
 * @param station 站点信息【onStation、offStation】
 * @returns {string}
 */
exports.getStation = (address, station) => {
  if(address){
    if(station && station.name){
      return station.name
    }else{
      return address.name || address.stationName || address.detailAddress
    }
  }
}

/**
 * 根据车辆等级获取车型
 * @param carGrade 车辆等级
 * @returns {string}
 */
exports.getCarType = (carGrade) => {
  let carType = ''
  if(typeof carGrade === 'number'){
    carType = carGrade in TOOL.carInfo ? TOOL.carInfo[carGrade].value : ''
  }
  return carType
}

/**
 * 根据车辆等级获取车型品牌
 * @param car 车辆数据
 * @returns {string}
 */
exports.getCarBrandName = (car) => {
  return (car.brandName || car.brand) + ' ' + car.model;
}

/**
 * 根据车辆等级获取排量
 * @param displacement 车辆排量
 * @returns {string}
 */
exports.getCarDisplacement = (displacement) => {
  if(displacement && displacement.indexOf('T') > -1) {
    return displacement;
  }
  return (displacement + 'L');
}

/**
 * 根据订单状态获取订单状态文案
 * @param status 订单状态
 * @param productTypeLevelOne 产品大类
 * @param tripType 行程类别，及时或预约
 * @param chStatus 品牌约车小状态 0:生成订单, 1:派单成功, 2:到达目的地, 3:行程中, 4:完成行程（待支付）, 10:开始任务(预约订单), 11:乘客取消, 12:超时失败, 13:司机取消, 14:未评价, 15:已评价
 * 订单状态 -1:品牌约车行程中, 0:待支付, 1:已支付, 2:已失效（过了支付时间） 3:已退款 4:未评价 5:已评价 6:已过期（任务已执行但未乘坐）
 * @returns {string}
 */
exports.getOrderStatusText = (status, productTypeLevelOne, tripType, chStatus) => {
  let statusText  = ''
  let orderText = [
    {text:'行程中', status: -1},
    {text:'待支付', status: 0},
    {text:'待出行', status: 1},
    {text:'已取消或超时未支付', status: 2},
    {text:'已退票', status: 3},
    {text:'待评价', status: 4},
    {text:'已评价', status: 5},
    {text:'超时未乘坐', status:6},
    {text:'已取消', status:7},
    {text:'已取车', status:8},
    {text:'退款申请中', status:11}
  ];
  let len = orderText.length
  for(let i = 0; i < len; i ++){
    if(typeof status === "number" && status === orderText[i].status){
      if(status === -1){
        if(tripType === 1){
          if(chStatus && chStatus === 1){
            statusText = '待出行'
          }else{
            statusText = '行程中'
          }
        }else{
          statusText = '行程中'
        }
      }else if(status === 2){
        statusText = (productTypeLevelOne === 'CAR_HAILING' || productTypeLevelOne === 'TAXI') ? '已取消' : '超时未支付'
      }else{
        statusText = orderText[i].text
      }
    }
  }
  return statusText
}

/**
 * 根据订单状态获取订单状态文案
 * @param status 订单状态
 * @param productTypeLevelOne 产品大类
 * @param tripType 行程类别，及时或预约
 * 订单状态 -1:品牌约车行程中, 0:待支付, 1:已支付, 2:已失效（过了支付时间） 3:已退款 4:未评价 5:已评价 6:已过期（任务已执行但未乘坐）
 * @returns {string}
 */
exports.getGoodsOrderStatusText = (status, productTypeLevelOne, tripType) => {
    let statusText  = ''
    let orderText = [
        {text:'行程中', status: -1},
        {text:'待支付', status: 0},
        {text:'已支付', status: 1},
        {text:'超时未支付', status: 2},
        {text:'已退款', status: 3},
        {text:'已完成', status: 4},
        {text:'已评价', status: 5},
        {text:'超时未乘坐', status:6},
        {text:'已取消', status:7},
        {text:'已取车', status:8},
        {text:'退款申请中', status:11}
    ];
    let len = orderText.length
    for(let i = 0; i < len; i ++){
        if(typeof status === "number" && status === orderText[i].status){
            if(status === -1){
                if(tripType === 1){
                    statusText = '未出行'
                }else{
                    statusText = '行程中'
                }
            }else{
                statusText = orderText[i].text
            }
        }
    }
    return statusText
}

/**
 * 根据订单状态获取订单状态文案
 * @param status 订单状态
 * @param carpoolStatus 订单状态
 * @param consumeType 拼车消费方式：0.先付款后乘车，1.先乘车后付款
 * 订单状态 -1:品牌约车行程中, 0:待支付, 1:已支付, 2:已失效（过了支付时间） 3:已退款 4:未评价 5:已评价 6:已过期（任务已执行但未乘坐）
 * 拼车状态 0.待支付 1.待安排，2.已安排，3.已上车，4.已取消 5.已完成
 * @returns {string}
 */
exports.getCityCarpoolOrderStatusText = (status, carpoolStatus, consumeType) => {
  let statusText  = ''
  let orderText = [
    {text:'行程中', status: -1},
    {text:'待支付', status: 0},
    {text:'行程中', status: 1},
    {text:'已取消', status: 2},
    {text:'已退票', status: 3},
    {text:'待评价', status: 4},
    {text:'已评价', status: 5},
    {text:'超时未乘坐', status:6},
    {text:'已取消', status:7},
    {text:'已取车', status:8},
    {text:'退款申请中', status:11}
  ];
  let len = orderText.length
  for(let i = 0; i < len; i ++){
    if(typeof status === "number" && status === orderText[i].status){
      if((consumeType === 0 && status === 1 ) || (consumeType === 1 && (status === 0 || status === 1))){
        if(carpoolStatus === 1){
          statusText = '待安排'
        }else if(carpoolStatus === 2){
          statusText = '未出行'
        }else if(carpoolStatus === 3){
          statusText = '行程中'
        }else{
          statusText = orderText[i].text
        }
      }else{
        statusText = orderText[i].text
      }
    }
  }
  return statusText
}

/**
 * 根据订单状态获取订单状态文案
 * @param status 订单状态
 * @param carPoolStatus 拼车小状态
 * @param availableSeats 剩余座位数
 * @param unPayCount 未支付人数
 * @param type detail为订单详情页
 * 订单状态 -1:品牌约车行程中, 0:待支付, 1:已支付, 2:已失效（过了支付时间） 3:已退款 4:未评价 5:已评价 6:已过期（任务已执行但未乘坐）
 * 拼车状态 0.未付款 1.未成团，2.未安排，3.已安排，4.已失效（过期未支付），5.已取消（司机或企业超时未响应）
 * @returns {string}
 */
exports.getCarpoolOrderStatusText = (status, carPoolStatus, availableSeats, unPayCount, type) => {
  let statusText  = ''
  let orderText = [
    {text:'行程中', status: -1},
    {text:'待支付', status: 0},
    {text:'已安排，待出行', status: 1},
    {text:'已取消', status: 2},
    {text:'拼团失败', status: 3},
    {text:'待评价', status: 4},
    {text:'已评价', status: 5},
    {text:'超时未乘坐', status:6}
  ];
  let len = orderText.length
  for(let i = 0; i < len; i ++){
    if(typeof status === "number" && status === orderText[i].status){
      if(status === 1){
        if(carPoolStatus === 1){
          statusText = type === 'detail' ? '拼团中' : `差${availableSeats || unPayCount}人成团`
        }else if(carPoolStatus === 2){
          statusText = '已成团，待安排'
        }else if(carPoolStatus === 3){
          statusText = '已安排，待出行'
        }
      }else{
        statusText = orderText[i].text
      }
    }
  }
  return statusText
}

/**
 * 根据订单状态获取订单状态文案
 * @param status 订单状态
 * 订单状态 -0待支付，1已支付，2已失效，3已退款,4已完成（目前没有评价）
 * @returns {string}
 */
exports.pressStatusTxt = (status) => {
	let statusTxt = {
		0: '待支付',
		1: '已支付',
		2: '已失效',
		3: '已退款',
		4: '已完成',
        11: '退款申请中'
	}
	return statusTxt[status]
}

/**
 * 根据订单状态获取订单状态文案
 * @param status 订单状态
 * 订单状态：-1未知状态 0待支付，1已支付，2已失效，3已退款,4未评价（已还车-自驾租车状态），5已评价，6已过期 7已取消（自驾租车状态） 8已取车（自驾租车状态） ,
 * @returns {string}
 */
exports.rentStatusTxt = (status) => {
  let statusTxt = {
    0: '待支付',
    1: '已支付',
    2: '已失效',
    3: '已退款',
    4: '已还车', // 未评价
    5: '已评价',
    6: '已过期',
    7: '已取消',
    8: '已取车',
    11: '退款申请中',
  }
  return statusTxt[status]
}

/**
 * 获取接驳订单状态文案
 * @param status
 * 订单状态： 0 待支付，1 已支付， 2 已失效（过了支付时间），3 已安排，4 已退款，5 已完成，6 退款申请中
 * @returns {*}
 */
exports.getFeederStatusText = (status) => {
  let statusTxt = {
    0: '待支付',
    1: '已支付',
    2: '已失效',
    3: '已安排',
    4: '已退款',
    5: '已完成',
    6: '退款申请中'
  }
  if(typeof status === 'number'){
    return statusTxt[status]
  }
}
