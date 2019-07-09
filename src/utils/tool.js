import config from './config'
import storage from 'interface/storage'

export default {
  appid: config.appid,
  component_appid: config.component_appid,
  phoneNumber: '028-85053689',
  rangeTime: '18:00',
  pageSize: 10,
  notLoginText: '您还没有登录',
  payTimer: '',
  charterPayTimer: '',
  carhailingPayTimer: '',

  CITY_BUS: '买汽车票',
  CITY_SPECIAL_BUS: '城际专车',
  CITY_EXPRESS_BUS: '城际快车',
  CITY_CAR_POOL_BUS: '城际拼车',

  STATION_BUS: '城际班车',
  STATION_FIXED_BUS: '城际班车',
  STATION_STREAM_BUS: '城际班车',

  AIRPORT_BUS: '接送飞机',
  AIRPORT_SPECIAL_BUS: '机场专车',
  AIRPORT_EXPRESS_BUS: '机场快车',

  TRAIN_STATION_BUS: '接送火车',
  TRAIN_SPECIAL_BUS: '接站专车',
  TRAIN_EXPRESS_BUS: '接站快车',

  SCHOOL_BUS:'校园专线',
  SCHOOL_SPECIAL_BUS:'校园专车',
  SCHOOL_EXPRESS_BUS:'校园快车',
  SCHOOL_CAR_POOL_BUS:'校园拼车',

  SCENIC_BUS:'景点专线',
  SCENIC_SPECIAL_BUS:'景点专车',
  SCENIC_EXPRESS_BUS:'景点快车',
  SCENIC_CAR_POOL_BUS:'景点拼车',

  TOUR_BUS: '旅游度假',
  TOUR_SCENIC: '旅游',

  WORK_BUS: '工作班车',
  WORK_SHUTTLE_BUS: '工作班车',
  WORK_COMPANY_BUS: '企业班车',

  LINE_BUS: '主题包车',
  LINE_CHARTER_BUS: '主题包车',
  LINE_CAR_POOL_BUS: '主题拼车',

  CUSTOM_BUS: '定制包车',

  CAR_HAILING:'品牌约车',
  CAR_HAILING_EXPRESS:'品牌约车',

  TAXI:'出租的士',
  TAXI_EXPRESS:'出租的士',

  CAR_RENTAL: '自驾租车',

  EXPRESS: '小件快运',

  CAR_INSPECTION: '车辆年检',


  GOODS: '连接小店',
  
  PUBLIC_BUS: '公交出行',

  /**
   * 自驾租车默认图片
   */
  carRentDefaultImg: '',
  
  /**
   * 微信页面地址
   */
  placeHolder: {
    travelDays: '',
    startPlace: '请选择出发地',
    endPlace: '请选择目的地',
    onStation: '请选择上车地点',
    offStation: '请选择下车地点',
    onTrainStation:'请选择出发火车站',
    offTrainStation:'请选择到达火车站',
    onAirport:'请选择出发机场',
    offAirport:'请选择到达机场',
  },
  
  /**
   * 年检车辆大类名称
   */
  carInspectionName: {
    CAR_TYPE_SALOON_CAR: '小微型非营运汽车',
    CAR_TYPE_PASSENGER_CAR: '营运载客汽车',
    CAR_TYPE_FREIGHT_CAR: '大中型非营运汽车',
    CAR_TYPE_MOTOR_CAR: '摩托车',
    CAR_TYPE_TRACTOR_CAR: '拖拉机和其他车辆',
  },
  
  sofa:['CITY_SPECIAL_BUS', 'AIRPORT_SPECIAL_BUS', 'TRAIN_SPECIAL_BUS', 'SCHOOL_SPECIAL_BUS', 'WORK_COMPANY_BUS'],
  
  bus:['STATION_STREAM_BUS', 'STATION_FIXED_BUS'],
  
  carInfo: [
    {key: 0, value: '5座经济轿车'},
    {key: 1, value: '5座高级轿车'},
    {key: 2, value: '7座商务'},
    {key: 3, value: '经济SUV'},
    {key: 4, value: '高级SUV'},
    {key: 5, value: '小巴'},
    {key: 6, value: '中巴'},
    {key: 7, value: '大巴'},
  ],
  
  scrollerConfigs:{
    content: '上拉加载更多',
    downContent: '松开进行加载',
    upContent: '上拉加载更多',
    loadingContent: '加载中....'
  },
  
  noDataTips: {
    airportBus: '今天其他的车都跑光了，试试专车吧',
    airportBusTody: '今天的车都跑光了，看看明天的吧',
  },
  
  showSkuLen: 3, // 快车展示更多按钮时sku显示个数
  maxPageViewTime: 2 * 60 * 1000, // 每两分钟统计一次pv、uv
  maxPageNum: 10, // 访问页面数大于10统计一次pv、uv
  hotCitiesNum: 10,
  shareURL: config.hostUrl + 'index.html?#/',
  refundNotice1: '<h3 class="h3">退票须知</h3>' +
  '<p class="p">注：目前全平台所有的交通出行产品的退票规则都是根据交通运输部《汽车客运站收费规则》中第十五条关于规定退票手续费的标准来执行，暂时不允许企业或者个人进行修改，后期我们平台会开放此功能，如有不便请您谅解，谢谢！</p>' +
  '<p class="p">1. 根据交通运输部《汽车客运站收费规则》中第十五条关于规定退票手续费的标准如下所列（退票费直接从购票款中扣划）：<br/>' +
  'A、当次客运班车开车时间两小时前办理退票，按票面金额的10%收取退票费，不足5角按5角计收；<br/>' +
  'B、当次客运班车开车时间前两小时以内办理退票，按票面金额的20%收取退票费，不足1元按1元计收；<br/>' +
  'C、当次客运班车发车后，不再办理退票。</p>' +
  '<p class="p">2. 因为您已经使用了本网站的购票服务，因此退票时，购票服务费是不退还的，谢谢理解。</p>' +
  '<p class="p warning">备注：1、超过发车时间，不允许退票。</p>' +
  '<p class="p warning pad-l">2、若需发票，请向当班司机索取。</p>',
  refundNotice2: '<h3 class="h3">退票须知</h3>' +
  '<p class="p">1.线路包车、定制包车：<br/>' +
  'A.预定发车日四天前退定，不收取退定手续费；<br/>' +
  'B.预定发车日三天前退定，收取20%退定手续费；<br/>' +
  'C.预定发车日两天前退定，收取30%退定手续费；<br/>' +
  'D.预定发车日8小时前退定，收取50%退定手续费；<br/>' +
  'E.预定发车日8小时内退定，不予退还预定款。</p>' +
  '<p class="p">2.线路拼车：<br/>' +
  '不支持线上退票。</p>' +
  '<p class="p warning">备注：1、超过发车时间，不允许退票。</p>' +
  '<p class="p warning pad-l">2、若需发票，请向当班司机索取。</p>',

  /**
   * 正则表达式
   */
  regExp: {
    telephone: /^1\d{10}$/,
    idCard15: /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/,
    idCard18: /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x)$/,
    idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    email: /(^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$)|(^$)/,
    zsNumber: /(^[1-9])+\d*$/,
    floatNumber: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/,
    userName: /^([\u4e00-\u9fa5]{2,20}|[a-zA-Z\.\s]{2,40})$/,
    nickName: /^[a-zA-Z0-9_\-\u4e00-\u9fa5]{4,16}$/
  },

  /**
   * 车辆年检时间段
   */
  carInspectionTime: [
    {text: '00:00-01:00', value:'00:00:00'},
    {text: '01:00-02:00', value:'01:00:00'},
    {text: '02:00-03:00', value:'02:00:00'},
    {text: '03:00-04:00', value:'03:00:00'},
    {text: '04:00-05:00', value:'04:00:00'},
    {text: '05:00-06:00', value:'05:00:00'},
    {text: '06:00-07:00', value:'06:00:00'},
    {text: '07:00-08:00', value:'07:00:00'},
    {text: '08:00-09:00', value:'08:00:00'},
    {text: '09:00-10:00', value:'09:00:00'},
    {text: '10:00-11:00', value:'10:00:00'},
    {text: '11:00-12:00', value:'11:00:00'},
    {text: '12:00-13:00', value:'12:00:00'},
    {text: '13:00-14:00', value:'13:00:00'},
    {text: '14:00-15:00', value:'14:00:00'},
    {text: '15:00-16:00', value:'15:00:00'},
    {text: '16:00-17:00', value:'16:00:00'},
    {text: '17:00-18:00', value:'17:00:00'},
    {text: '18:00-19:00', value:'18:00:00'},
    {text: '19:00-20:00', value:'19:00:00'},
    {text: '20:00-21:00', value:'20:00:00'},
    {text: '21:00-22:00', value:'21:00:00'},
    {text: '22:00-23:00', value:'22:00:00'},
    {text: '23:00-24:00', value:'23:00:00'}
  ],
  
  /**
   * 定位失败默认位置
   */
  defaultLocation: {
    city:'北京',
    lat: 39.90403,
    lng: 116.407526,
    county: '北京',
    detailAddress: '北京'
  },
  
  locationFail: 'locationFail',
  
  /**
   * 身份证交验规则
   */
  arrInt: [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
  arrCh: ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'],

  /**
   * 将15位身份证转换成18位
   * @param idCardNum
   * @returns {*}
   */
  change15To18 (idCardNum) {
    let idCardTemp = 0
    idCardNum = idCardNum.substr(0, 6) + '19' + idCardNum.substr(6, idCardNum.length - 6)
    for (let i = 0; i < 17; i++) {
      idCardTemp += idCardNum.substr(i, 1) * this.arrInt[i]
    }
    idCardNum += this.arrCh[idCardTemp % 11]
    return idCardNum
  },

  /**
   * 交验18位身份证的校验码是否合法
   * @param idCardNum
   * @returns {*}
   */
  check18 (idCardNum) {
    let valnum, idCardTemp = 0
    for (let i = 0; i < 17; i++) {
      idCardTemp += idCardNum.substr(i, 1) * this.arrInt[i]
    }
    valnum = this.arrCh[idCardTemp % 11]
    return valnum == idCardNum.substr(17, 1)
  },

  /**
   * 获取从今天开始后的时期
   * @param days
   */
  getAfterCurrentDay(days) {
    let dateArr = [];
    let now = new Date();
    let nowDate = this.getCurrentTime().split(' ')[0];
    dateArr.push(nowDate);
    for(let x = 1; x < days; x++) {
      let afterDateObj = new Date(now.getFullYear(), now.getMonth(), now.getDate()+x);
      dateArr.push(this.getCurrentTime(afterDateObj).split(' ')[0]);
    }
    return dateArr;
  },

  /**
   * 获取身份证信息
   * @param idCardNum
   * @returns {{birthday: *生日日期, checkBirth: *出生日期是否正确, idCardNum: *身份证号码}}
   */
  getIdCardInfo (idCardNum) {
    console.log(idCardNum)
    let len = idCardNum.length, idCardArr, birthday, checkBirth
    if (len == 15) {
      idCardArr = idCardNum.match(this.regExp.idCard15)
      birthday = new Date('19' + idCardArr[2] + '/' + idCardArr[3] + '/' + idCardArr[4])
      checkBirth = ((birthday.getYear() == Number(idCardArr[2])) && ((birthday.getMonth() + 1) == Number(idCardArr[3])) && (birthday.getDate() == Number(idCardArr[4]))) || this.dateCompare(birthday) > 0
      idCardNum = this.change15To18(idCardNum)
    } else {
      idCardArr = idCardNum.match(this.regExp.idCard18)
      birthday = new Date(idCardArr[2] + "/" + idCardArr[3] + "/" + idCardArr[4])
      checkBirth = ((birthday.getFullYear() == Number(idCardArr[2])) && ((birthday.getMonth() + 1) == Number(idCardArr[3])) && (birthday.getDate() == Number(idCardArr[4]))) || this.dateCompare(birthday) > 0
    }
    return {
      birthday: birthday,
      checkBirth: checkBirth,
      idCardNum: idCardNum
    }
  },

  /**
   * 交验身份证是否合法
   * @param idCard
   * @returns {*}
   */
  checkIdCard (idCard) {
    let idCardNum = idCard.toUpperCase()
    if (!idCardNum) {
      return {valid: false, msg: '身份证不能为空'}
    }

    if (!(this.regExp.idCard.test(idCardNum))) {
      return {valid: false, msg: '身份证格式不正确'}
    }

    let idCardInfo = this.getIdCardInfo(idCardNum)
    if (!idCardInfo.checkBirth) {
      return {valid: false, msg: '身份证里的出生日期不正确'}
    } else {
      if (!this.check18(idCardInfo.idCardNum)) {
        return {valid: false, msg: '身份证身份信息有误'}
      } else {
        return {valid: true}
      }
    }
  },

  /**
   * 格式化司机星级
   */
  renderStar (star) {
    let starNum = parseFloat(star).toFixed(1),
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
  },
  
  getRect(el) {
    if (el instanceof window.SVGElement) {
      let rect = el.getBoundingClientRect()
      return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      }
    } else {
      return {
        top: el.offsetTop,
        left: el.offsetLeft,
        width: el.offsetWidth,
        height: el.offsetHeight
      }
    }
  },

  /**
   * 获取mobiscroll时间插件默认配置
   * @param min 预售时间
   * @param max 停售时间
   * @param start 服务时段开始时间
   * @param end 服务时段结束时间
   * @returns {{}}
   */
  minuteStep: 15,
  getDateTimeConfig (min, max, start, end, headerText = false) {
    let now = new Date()
    let nowMs = new Date().getTime()
    let nowTime = this.newGetDate({type:'time'})

    if(min && max){
      if(min > max) {
        let temp = min;
        min = max;
        max = temp;
      }
      min = (min + this.minuteStep) * 60 * 1000 + nowMs
      max = max * 60 * 1000 + nowMs
      min = new Date(min)
      max = new Date(max)
    }else{
      min = now
      max = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
    }
    
    let config =  {
      min: min,
      max: max,
      dateWheels: '|MM dd DD|',
      dateFormat: 'yy-mm-dd',
      timeWheels: 'HHii',
      headerText: headerText,
      steps: {
        minute: this.minuteStep,
        zeroBased: true
      }
    }
    if(start && end){
      let compare = this.dateCompare(start, end, 'time')
      if(compare > 0) {
        config.invalid = [
          {
            start: end,
            end: start
          },
        ]
      }else{
        config.invalid = [
          {
            start: '00:00',
            end: start
          },
          {
            start: end,
            end: '23:59'
          },
        ]
        if(this.dateCompare(nowTime, end, 'time') > 0){
          config.invalid.push(new Date(min)) //如果当前时间不再可用范围则设置当天不可选
        }
      }
    }
    return config
  },

  /**
   * 获取指定日期
   * @param date 日期
   * @param type 类型
   * @param number 基数
   * @returns {Date}
   */
  changeDate (date, type, number) {
    if (String(date).match(/\-/)) {
      date = String(date).replace(/\-/g, '/')
    }
    date = new Date(date)
    switch (type) {
      case "y":
        date.setFullYear(date.getFullYear() + number);
        return date;
      case "q":
        date.setMonth(date.getMonth() + number * 3);
        return date;
      case "mon":
        date.setMonth(date.getMonth() + number);
        return date;
      case "w":
        date.setDate(date.getDate() + number * 7);
        return date;
      case "d":
        date.setDate(date.getDate() + number);
        return date;
      case "h":
        date.setHours(date.getHours() + number);
        return date;
      case "m":
        date.setMinutes(date.getMinutes() + number);
        return date;
      case "s":
        date.setSeconds(date.getSeconds() + number);
        return date;
      default:
        date.setDate(date.getDate() + number);
        return date;
    }
  },
  
  formateDate (date) {
    let tmpDate;
    if (date) {
      if (date instanceof Date) {
        tmpDate = date
      } else {
        if (String(date).match(/-/)) {
          date = String(date).replace(/-/g, '/')
        }
        tmpDate = new Date(date)
      }
    } else {
      tmpDate = new Date()
    }
    return tmpDate
  },
  
  newGetDate (dateObj) {
    function getTwoNum(number) {
      if (number < 10) {
        return '0' + number;
      } else {
        return number;
      }
    }

    let tmpDate = this.formateDate(dateObj.date)
    let year = tmpDate.getFullYear()
    let mathon = tmpDate.getMonth() + 1
    let day = tmpDate.getDate()
    let week = tmpDate.getDay()
    let hours = tmpDate.getHours()
    let minutes = tmpDate.getMinutes()
    let seconds = tmpDate.getSeconds()
    let weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    mathon = getTwoNum(mathon);
    day = getTwoNum(day);
    hours = getTwoNum(hours);
    minutes = getTwoNum(minutes);
    seconds = getTwoNum(seconds);
    switch (dateObj.type) {
      case 'time':
        return hours + ':' + minutes
        break;
      case 'date':
        return year + '-' + mathon + '-' + day
        break;
      case 'date2':
        return year + '/' + mathon + '/' + day
        break;
      case 'dateTime':
        return year + '-' + mathon + '-' + day + ' ' + hours + ':' + minutes
        break;
      case 'dateTime2':
        return year + '-' + mathon + '-' + day + ' ' + hours + ':' + minutes + ':00'
        break;
      case 'holeDate':
        return year + '-' + mathon + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
        break;
      case 'holeDate2':
        return year + '/' + mathon + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds
        break;
      case 'past':
        return (year - 1) + '-' + mathon + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
        break;
      case 'future':
        return (year + 1) + '-' + mathon + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
        break;
      case 'dateWeek':
        return mathon + ' - ' + day + ' ' + weekArr[week]
        break;
      case 'monthDayWeek':
        return mathon + '月' + day + '日' + ' ' + weekArr[week]
        break;
      case 'formatDate':
        return tmpDate
        break;
      case 'day':
        return day
        break;
      case 'futureTwoMonth':
        if (mathon === 11) {
          mathon = 1
          year = year + 1
        } else if (mathon === 12) {
          mathon = 2
          year = year + 1
        } else {
          mathon = year + 2
        }
        return year + '-' + mathon + '-' + day
        break;
      case 'formatStartupTime':
        let profix
        let tomorrow = this.changeDate(new Date(), 'd', 1)
        tomorrow = this.newGetDate({date: tomorrow, type: 'date'})
        if(this.dateCompare(dateObj.date) === 0){
          profix = '今天'
        }else if(this.dateCompare(dateObj.date, tomorrow) === 0){
          profix = '明天'
        }else{
          profix = weekArr[week]
        }
       return mathon + '月' + day + '日' + ' ' + profix
    }
  },
  
  dateCompare (beginTime, endTime) {
    let type = arguments[2] || '';
    if (!type) {
      beginTime = beginTime.toString().replace(/-/gm, '\/').split(' ')[0];
      beginTime = new Date(beginTime);
      if (endTime) {
        endTime = endTime.toString().replace(/-/gm, '\/').split(' ')[0];
        endTime = new Date(endTime);
      } else {
        endTime = new Date(this.newGetDate({type: 'date2'}))
      }
    } else if (type === 'time') {
      beginTime = new Date(this.newGetDate({type: 'date2'}) + ' ' + beginTime)
      endTime = new Date(this.newGetDate({type: 'date2'}) + ' ' + endTime)
    } else if (type === 'datetime') {
      beginTime = beginTime.toString().replace(/-/gm, '\/');
      beginTime = new Date(beginTime);
      if (endTime) {
        endTime = endTime.toString().replace(/-/gm, '\/');
        endTime = new Date(endTime);
      } else {
        endTime = new Date(this.newGetDate({type: 'holeDate2'}))
      }
    }

    beginTime = Date.parse(beginTime)
    endTime = Date.parse(endTime)
    return beginTime - endTime
  },
  
  trim (value) {
    if (value) {
      return value.toString().replace(/(^\s*)|(\s*$)/g, '');
    }
    return ''
  },
  
  formValidate (obj) {
    let validata
    for (let v = 0; v < obj.length; v++) {
      validata = this._validate(obj[v]);
      if (!validata.valid) {
        break;
      }
    }
    return validata;
  },
  
  _validate (obj) {
    let value = obj.value,
      emptyTips = obj.emptyTips,
      regTips = obj.regTips || emptyTips,
      errorTips = obj.errorTips,
      regName = obj.regName,
      ajaxValid = obj.ajaxValid,
      ajaxTips = obj.ajaxTips,
      maxNum = obj.maxNum || 0,
      minNum = obj.minNum || 0,
      minlength = obj.minlength,
      eqLength = obj.eqLength,
      minDateTime = obj.minDateTime,
      minDate = obj.minDate,
      minTime = obj.minTime;
    //为空验证
    if (regName != 'email' && typeof value !== 'number' && emptyTips != '路桥费' &&
      (value === '' ||
      value === '0' ||
      value === undefined ||
      value == TOOL.placeHolder.startPlace ||
      value == TOOL.placeHolder.endPlace ||
      value == TOOL.placeHolder.onStation ||
      value == TOOL.placeHolder.offStation ||
      value == TOOL.placeHolder.onTrainStation ||
      value == TOOL.placeHolder.offTrainStation ||
      value == TOOL.placeHolder.onAirport ||
      value == TOOL.placeHolder.offAirport ||
      value == TOOL.placeHolder.travelDays)) {
      return {valid: false, msg: emptyTips}
    } else {
      if (regName && regName != 'idCard' && !this.regExp[regName].test(value)) {
        return {valid: false, msg: regTips}
      }

      if (regName == 'idCard') {
        let idCardValidate = this.checkIdCard(value)
        if (!idCardValidate.valid) {
          return idCardValidate
        }
      }

      //最小长度
      if (minlength != undefined) {
        if (value.length < minlength) {
          return {valid: false, msg: errorTips}
        }
      }

      //长度
      if (eqLength != undefined) {
        if (value.length != eqLength) {
          return {valid: false, msg: errorTips}
        }
      }

      //重复密码校验
      if (obj.eqValue != undefined) {
        if (value != $(obj.eqValue).val()) {
          return {valid: false, msg: errorTips}
        }
      }
      //最大值检查
      if (maxNum) {
        if (+value > +maxNum) {
          return {valid: false, msg: errorTips}
        }
      }

      //最小值检查
      if (minNum) {
        if (+value < +minNum) {
          return {valid: false, msg: errorTips}
        }
      }

      if (minDateTime) {
        if (this.dateCompare(value, minDateTime, 'datetime') < 0) {
          return {valid: false, msg: errorTips}
        }
      }

      if (minDate) {
        if (this.dateCompare(value, minDate) < 0) {
          return {valid: false, msg: errorTips}
        }
      }

      if (minTime) {
        if (this.dateCompare(value, minTime, 'time') < 0) {
          return {valid: false, msg: errorTips}
        }
      }
      if (ajaxValid) {
        let ajaxCheck = true;
        if (ajaxValid == 'existPassenger') {
          let resource = api.existPassenger()
          $.ajax({
            url: resource.url,
            async: false,
            dataType: 'json',
            headers: {
              'X-Auth-Token': resource.token,
              StoreId: resource.StoreId
            },
            data: {
              idCard: value.toUpperCase()
            },
            success: function (data) {
              if (data.resultCode == 0) {
                ajaxCheck = data.resultData
              }
            }
          })
          if (ajaxCheck) {
            return {valid: false, msg: ajaxTips}
          }
        } else if(ajaxValid == 'driverExistOwn') {
          let resource = api.driverExistOwn()
          $.ajax({
            url: resource.url,
            async: false,
            dataType: 'json',
            headers: {
              'X-Auth-Token': resource.token,
              StoreId: resource.StoreId
            },
            data: {
              idNo: value
            },
            success: function (data) {
              if (data.resultCode == 0) {
                ajaxCheck = data.resultData
              }
            }
          })
          if (ajaxCheck) {
            return {valid: false, msg: ajaxTips}
          }
        }
      }
      return {valid: true};
    }
  },
  
  getTimePreMinute(minute) {
    if(minute) {
      minute = parseInt(minute);
      let nowMill = new Date().getTime();
      return new Date(nowMill+minute*60000);
    }
    return new Date();
  },
  
  changeHourToMin(time) {
      if(time) {
        let hour = parseInt(time.split(':')[0]);
        let min = parseInt(time.split(':')[1]);

        return (min + 60*hour);
      }
      return 0;
  },
  
  perapara (objvalues, isencode) {
    let parastring = "";
    for (let key in objvalues) {
      isencode = isencode || false;
      if (isencode) {
        parastring += (key + "=" + encodeURIComponent(objvalues[key]) + "&");
      }
      else {
        parastring += (key + "=" + objvalues[key] + "&");
      }
    }
    parastring = parastring.substr(0, parastring.length - 1);
    return parastring;
  },
  
  getQueryString () {
    let search = location.search
    let hash = location.hash
    let theRequest = {};
    let params = []
    if (search.indexOf("?") > -1) {
      let str = search.split('?')[1];
      let strs = str.split("&");
      params = params.concat(strs)
    }
 
    if (hash.indexOf("?") > -1) {
      let str = hash.split('?')[1];
      let strs = str.split("&");
      params = params.concat(strs)
    }
    for (let i = 0; i < params.length; i++) {
      theRequest[params[i].split("=")[0]] = decodeURIComponent(params[i].split("=")[1]);
    }
    return theRequest;
  },
  
  joinQueryString (obj) {
    let queryString = ''
    if(obj){
      for(let i in obj){
        if(obj.hasOwnProperty(i)){
          if(!queryString){
            queryString = i + '=' + obj[i]
          }else{
            queryString += '&' + i + '=' + obj[i]
          }
        }
      }
    }
    if(queryString){
      queryString  = '?' + queryString
    }
    return queryString
  },
  
  browser () {
    let u = navigator.userAgent;
    return {
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
      iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
      weixin: u.indexOf('MicroMessenger') > -1, //是否微信
      undunion_app: u.indexOf('UNDUNION_APP') > -1, //是否是连接APP
      qq: u.match(/\sQQ/i) == " qq" //是否QQ
    };
  },
  
  browserType () {
    let orderSource
    if(TOOL.browser().undunion_app){
      orderSource = 2
    }else{
      orderSource = 0
    }
    return orderSource
  },
  
  toJson (data) {
    if (typeof data == 'string') {
      return JSON.parse(data)
    } else {
      return data;
    }
  },
  
  getTimeStamp () {
    return parseInt(new Date().getTime() / 1000)
  },
  
  deleteCityShi (city) {
    if(!city) return ''
    let newCity = city
    if(city.indexOf('市') > -1 && city.substr(city.length-1,1) === '市'){
      newCity = city.substr(0, city.length - 1)
    }
    return newCity
  },
  
  getkilometer (meter) {
    if(meter < 1){
      return '< 1m'
    }else if(meter <　1000){
      return parseInt(meter) + 'm'
    }else{
      return (meter/1000).toFixed(1) + 'km'
    }
  },
  
  getViewTime (time) {
    if(time <　60){
      return '1分钟内到达'
    }else if(time <　60*60){
      return '约' +　parseInt(time/60) + '分钟后到达'
    }else{
      return '约' +　Math.floor(time/(60*60)) + '小时'+ parseInt(time%(60*60)/60) +'分钟后到达'
    }
  },
  
  getCityOrCounty (address) {
    if(address.county){
      let len = address.county.length
      if(address.county.charAt(len - 1) === '区'){
        return address.county
      }else{
        return address.city
      }
    }
    return address.city
  },
  
  menuList () {
    return [
      {pageId: 1, type: 0, productType: 'CITY_BUS', target: {name:'city'}, iconUrl: 'static/pics/CITY_BUS.png', alias: this.CITY_BUS},
      {pageId: 1001, type: 1, productType: 'CITY_EXPRESS_BUS', target: {name:'city'}, iconUrl: 'static/pics/CITY_EXPRESS_BUS.png', alias: '城际快车'},
      {pageId: 1002, type: 1, productType: 'CITY_SPECIAL_BUS', target: {name:'city'}, iconUrl: 'static/pics/CITY_SPECIAL_BUS.png', alias: '城际专车'},
      {pageId: 1003, type: 1, productType: 'STATION_BUS', target: {name:'city'}, iconUrl: 'static/pics/STATION_BUS.png', alias: '车站班车'},
      {pageId: 1004, type: 1, productType: 'CITY_CAR_POOL_BUS', target: {name:'city'}, iconUrl: 'static/pics/CITY_CAR_POOL_BUS.png', alias: '城际拼车'},

      {pageId: 3, type: 0, productType: 'AIRPORT_BUS', target: {name:'airportPickSearch'}, iconUrl: 'static/pics/AIRPORT_BUS.png', alias: this.AIRPORT_BUS},
      {pageId: 3001, type: 1, productType: 'AIRPORT_EXPRESS_BUS', target: {name: 'airportPickSearch'}, iconUrl: 'static/pics/AIRPORT_EXPRESS_BUS.png', alias: '机场快车'},
      {pageId: 3002, type: 1, productType: 'AIRPORT_SPECIAL_BUS', target: {name: 'airportPickSearch'}, iconUrl: 'static/pics/AIRPORT_SPECIAL_BUS.png', alias: '机场专车'},

      {pageId: 4, type: 0, productType: 'TOUR_BUS', target: {name:'sights'}, iconUrl: 'static/pics/TOUR_BUS.png', alias: this.TOUR_BUS},

      {pageId: 5, type: 0, productType: 'SCHOOL_BUS', target: {name: 'schoolSearch'}, iconUrl: 'static/pics/SCHOOL_BUS.png', alias: this.SCHOOL_BUS},
      {pageId: 5002, type: 1, productType: 'SCHOOL_SPECIAL_BUS', target: {name: 'schoolSearch'}, iconUrl: 'static/pics/SCHOOL_SPECIAL_BUS.png', alias: '校园专车'},
      {pageId: 5003, type: 1, productType: 'SCHOOL_EXPRESS_BUS', target: {name: 'schoolSearch'}, iconUrl: 'static/pics/SCHOOL_EXPRESS_BUS.png', alias: '校园快车'},
      {pageId: 5004, type: 1, productType: 'SCHOOL_CAR_POOL_BUS', target: {name: 'schoolSearch'}, iconUrl: 'static/pics/SCHOOL_CAR_POOL_BUS.png', alias: '校园拼车'},

      {pageId: 6, type: 0, productType: 'WORK_BUS', target: {name: 'work'}, iconUrl: 'static/pics/WORK_BUS.png', alias: this.WORK_BUS},
      {pageId: 6001, type: 1, productType: 'WORK_SHUTTLE_BUS', target: {name: 'work'}, iconUrl: 'static/pics/WORK_SHUTTLE_BUS.png', alias: '工作班车'},
      {pageId: 6002, type: 1, productType: 'WORK_COMPANY_BUS', target: {name: 'firmBus'}, iconUrl: 'static/pics/WORK_COMPANY_BUS.png', alias: '企业班车'},

      {pageId: 7, type: 0, productType: 'CUSTOM_BUS', target: {name: 'charterList'}, iconUrl: 'static/pics/CUSTOM_BUS.png', alias: this.CUSTOM_BUS},
      {pageId: 7001, type: 1, productType: 'CUSTOM_BUS', target: {name: 'charterList'}, iconUrl: 'static/pics/CUSTOM_BUS.png', alias: '定制包车'},
      {pageId: 7002, type: 1, productType: 'LINE_BUS', target: {name: 'lineCar'}, iconUrl: 'static/pics/LINE_BUS.png', alias: '线路包车'},

      {pageId: 9, type: 0, productType: 'TRAIN_STATION_BUS', target: {name: 'trainPickSearch'}, iconUrl: 'static/pics/TRAIN_STATION_BUS.png', alias: this.TRAIN_STATION_BUS},
      {pageId: 9001, type: 1, productType: 'TRAIN_EXPRESS_BUS', target: {name:'trainPickSearch'}, iconUrl: 'static/pics/TRAIN_EXPRESS_BUS.png', alias: '接站快车'},
      {pageId: 9002, type: 1, productType: 'TRAIN_SPECIAL_BUS', target: {name:'trainPickSearch'}, iconUrl: 'static/pics/TRAIN_SPECIAL_BUS.png', alias: '接站专车'},

      {pageId: 23, type: 0, productType: 'CAR_HAILING', target: {name: 'carHailingSearch'}, iconUrl: 'static/pics/CAR_HAILING.png', alias: '品牌约车'},

      {pageId: 24, type: 0, productType: 'TAXI', target: {name: 'taxiSearch'}, iconUrl: 'static/pics/TAXI.png', alias: '出租的士'},

      {pageId: 28, type: 0, productType: 'SCENIC_BUS', target: {name: 'scenicSearch'}, iconUrl: 'static/pics/SCENIC_BUS.png', alias: this.SCENIC_BUS},
      {pageId: 2801, type: 1, productType: 'SCENIC_SPECIAL_BUS', target: {name: 'scenicSearch'}, iconUrl: 'static/pics/SCENIC_SPECIAL_BUS.png', alias: '景点专车'},
      {pageId: 2802, type: 1, productType: 'SCENIC_EXPRESS_BUS', target: {name: 'scenicSearch'}, iconUrl: 'static/pics/SCENIC_EXPRESS_BUS.png', alias: '景点快车'},
      {pageId: 2803, type: 1, productType: 'SCENIC_CAR_POOL_BUS', target: {name: 'scenicSearch'}, iconUrl: 'static/pics/SCENIC_CAR_POOL_BUS.png', alias: '景点拼车'},

      {pageId: 29, type: 0, productType: 'EXPRESS', target: {name: 'expressCreate'}, iconUrl: 'static/pics/EXPRESS.png', alias: this.EXPRESS},

      {pageId: 30, type: 0, productType: 'CAR_RENTAL', target: {name: 'rent'}, iconUrl: 'static/pics/CAR_RENTAL.png', alias: this.CAR_RENTAL},

      {pageId: 31, type: 0, productType: 'CAR_INSPECTION', target: {name: 'createInsp'}, iconUrl: 'static/pics/CAR_INSPECTION.png', alias: this.CAR_INSPECTION},

      {pageId: 34, type: 0, productType: 'GOODS', target: {name: 'shopIndex'}, iconUrl: 'static/pics/GOODS.png', alias: this.GOODS},
      
      {pageId: 35, type: 0, productType: 'PUBLIC_BUS', target: {name: 'busIndex'}, iconUrl: 'static/pics/PUBLIC_BUS.png', alias: this.PUBLIC_BUS}
    ]
  },
  
  orderCreateResource: [
    {pageRouter: 'appointBus', resource: 'createCharter', productTypeLevelTwo: 'CITY_SPECIAL_BUS'},
    {pageRouter: 'schoolBusSpecial', resource: 'createCharter', productTypeLevelTwo: 'SCHOOL_SPECIAL_BUS'},
    {pageRouter: 'scenicBusSpecial', resource: 'createCharter', productTypeLevelTwo: 'SCENIC_SPECIAL_BUS'},
    {pageRouter: 'scoreBusSpecial', resource: 'createCharter', productTypeLevelTwo: ''},
  
    {pageRouter: 'busDetail', resource: 'orderCreate', productTypeLevelTwo: 'CITY_EXPRESS_BUS'},
    {pageRouter: 'airportTicket', resource: 'orderCreate', productTypeLevelTwo: 'AIRPORT_EXPRESS_BUS'},
    {pageRouter: 'trainstationTicket', resource: 'orderCreate', productTypeLevelTwo: 'TRAIN_EXPRESS_BUS'},
    {pageRouter: 'scenicBusExpress', resource: 'orderCreate', productTypeLevelTwo: 'SCENIC_EXPRESS_BUS'},
    {pageRouter: 'schoolBusExpress', resource: 'orderCreate', productTypeLevelTwo: 'SCHOOL_EXPRESS_BUS'},
    {pageRouter: 'scoreBusExpress', resource: 'orderCreate', productTypeLevelTwo: ''},
  
    {pageRouter: 'schBusDetail', resource: 'createSchBusOrder', productTypeLevelTwo: ''},
    {pageRouter: 'scoreBusStation', resource: 'createSchBusOrder', productTypeLevelTwo: ''},
  
    {pageRouter: 'airportPickCustom', resource: 'createAirportCharter', productTypeLevelTwo: 'SCHOOL_SPECIAL_BUS'},
    {pageRouter: 'airportSendCustom', resource: 'createAirportCharter', productTypeLevelTwo: 'SCHOOL_SPECIAL_BUS'},
  
    {pageRouter: 'trainPickCustom,', resource: 'orderCreateTrainCharter', productTypeLevelTwo: 'TRAIN_SPECIAL_BUS'},
    {pageRouter: 'trainSendCustom', resource: 'orderCreateTrainCharter', productTypeLevelTwo: 'TRAIN_SPECIAL_BUS'},
  
    {pageRouter: 'porderWrite', resource: 'orderCreateTour', productTypeLevelTwo: 'TOUR_SCENIC'},
    {pageRouter: 'scoreBusTour', resource: 'orderCreateTour', productTypeLevelTwo: ''},
  
    {pageRouter: 'carpoolingSelf', resource: 'orderCreateCharterLine', productTypeLevelTwo: 'LINE_CHARTER_BUS'},
    {pageRouter: 'carpooling', resource: 'orderCreateLine', productTypeLevelTwo: 'LINE_CAR_POOL_BUS'},
    {pageRouter: 'carpoolingJoin', resource: 'orderCreateExistLine', productTypeLevelTwo: 'LINE_CAR_POOL_BUS'},
  
    {pageRouter: 'carHailingSearch', resource: 'chOrderCreate', productTypeLevelTwo: 'CAR_HAILING_EXPRESS'},
    {pageRouter: 'taxiSearch', resource: 'taxiOrderCreate', productTypeLevelTwo: ''},
  
    {pageRouter: 'carpoolbusIndex', resource: 'carpoolOrderCreate', productTypeLevelTwo: 'CITY_CAR_POOL_BUS'},
    {pageRouter: 'carpoolbusMap', resource: 'carpoolOrderCreate', productTypeLevelTwo: 'CITY_CAR_POOL_BUS'},
    {pageRouter: 'busCarpooling', resource: 'carpoolOrderCreate', productTypeLevelTwo: 'CITY_CAR_POOL_BUS'},
  ],

  orderCreatePage: [
    'appointBus',
    'schoolBusSpecial',
    'scenicBusSpecial',
    'scoreBusSpecial',
  
    'busDetail',
    'airportTicket',
    'trainstationTicket',
    'scenicBusExpress',
    'schoolBusExpress',
    'scoreBusExpress',
  
    'schBusDetail',
    'scoreBusStation',
  
    'airportPickCustom',
    'airportSendCustom',
  
    'trainPickCustom',
    'trainSendCustom',
  
    'porderWrite',
    'scoreBusTour',
  
    'carpoolingSelf',
    'carpooling',
    'carpoolingJoin',
  
    'carHailingSearch',
    'carhailingIndex',
  
    'taxiSearch',
  
    'carpoolbusIndex',
    'busCarpooling',
    'carpoolbusMap',
  ],
  
  /**
   * 获取产品类别名字
   */
  getMenuName () {
    if(storage.get('productAliasItems')){
      let productAliasItems = JSON.parse(storage.get('productAliasItems'))
      let len = productAliasItems.length
      if(len > 0){
        for (let i = 0; i < len; i++){
          if(productAliasItems[i].productType){
            this[productAliasItems[i].productType] = productAliasItems[i].alias
          }
        }
      }
    }
  },
  
  /**
   * 返回要显示的排序菜单 menuNum: 一共显示多少个 column: 一行显示多少个
   */
  getMenu (menuNum, column) {
    let menuList = TOOL.menuList()
    let menuArr = []
	let col
	if(column) {
    	col = column
	}else{
		col = 3
	}
    //处理菜单排序
    if(storage.get('productAliasItems')){
      let productAliasItems = JSON.parse(storage.get('productAliasItems'))
      let len = productAliasItems.length
      if(len > 0){
        for (let i = 0; i < len; i++){
          for(let j = 0; j < menuList.length; j++){
            if(productAliasItems[i].productType === menuList[j].productType && productAliasItems[i].type === menuList[j].type){
              let target = menuList[j].target
              let alias = productAliasItems[i].alias
              target.query = {
                pageId: menuList[j].pageId,
                pageName: alias
              }

              let iconUrl = productAliasItems[i].iconUrl
              if(!iconUrl){
                iconUrl = menuList[j].iconUrl
              }

              menuArr.push({
                target: menuList[j].target,
                iconUrl: iconUrl,
                alias: alias
              })
            }
          }
        }
      }
    }else{
      menuArr = menuList.slice(0, 7)
    }
    menuArr.push({target: {name: storage.get('indexRouter')}, cos: 'more', iconUrl: 'static/pics/backhome.png', alias:'返回首页'})

    if(menuArr.length >= menuNum){
      menuArr = menuArr.slice(0, menuNum)
    }

    //空格子数量
    let emptyNum
    if(menuArr.length % col){
      emptyNum = col - menuArr.length % col
    }
    if(emptyNum){
      for(let i = 0; i < emptyNum; i++){
        menuArr.push('')
      }
    }

    //显示几行
    let row = menuArr.length/col
    let menuResult = []
    for (let i = 0; i < row; i++){
      menuResult.push(menuArr.slice(i*col, i*col + col))
    }
    return menuResult
  },

  changeDateStyle(date) {
      return date.toString().replace(/-/gm, '\/');
  },
  /**
   * 返回日期的星期
   * @param String date: 日期 如 '2017-01-22 22:22:22'
   * @return String : 返回星期 如 '周一'
   */

  getWeekName(date) {
      date = this.changeDateStyle(date);
      if(date) {
        let dateObj = new Date(date);
        let weekName = ['周日','周一','周二','周三','周四','周五','周六'];
        let week = dateObj.getDay();
        return weekName[week];
      }
      return '周日';
  },
  
  getDateName(date) {
    if(date) {
      let dateData = date.split(' ')[0];
      return dateData.substring(5);
    }
    return '06-22';
  },
  
  getTimeName(date) {
    if(date) {
      let timeData = date.split(' ')[1];
      return timeData.substring(0,5)
    }
    return '22:22';
  },
  
  // 获取当前时间 时间格式YYYY-MM-DD hh:mm:ss
  getCurrentTime(dateData) {
    let date = new Date();
    if(dateData) {
      date = dateData;
    }
    let seperator1 = "-";
    let seperator2 = ":";
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    let hours = date.getHours();
    let mins = date.getMinutes();
    let secs = date.getSeconds();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    if (hours >= 0 && hours <= 9) {
      hours = "0" + hours;
    }
    if (mins >= 0 && mins <= 9) {
      mins = "0" + mins;
    }
    if (secs >= 0 && secs <= 9) {
      secs = "0" + secs;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + " " + hours + seperator2 + mins
      + seperator2 + secs;
    return currentdate;
  },

  getCurrentTimePreMin(minute) {
    if(minute) {
      minute = parseInt(minute);
      let nowMill = new Date().getTime();
      return this.getCurrentTime(new Date(nowMill+minute*60000));
    }

  },

  /**
   * pvuv参数处理
   * @param params
   */
  saveVisitLogs (params) {
    let visitLogs = [], pageViewData = {}
    if (storage.get('visitLogs')) {
      visitLogs = JSON.parse(storage.get('visitLogs'))
    }
    pageViewData.createdTime = TOOL.newGetDate({type: 'holeDate'})
    pageViewData.fromType = storage.get('fromType')
    pageViewData = Object.assign(pageViewData, params)
    visitLogs.push(pageViewData)
    storage.set('visitLogs', JSON.stringify(visitLogs))
  },
  
  uuid (len, radix) {
    let chars = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [], i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      // rfc4122, version 4 form
      let r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  },
  
  pregQuote (str, reg) {
    return (str + "").replace(/[.\\+*?\[\^\]$(){}=!<>|:\-]/g, "\\$&")
  },
  
  /**
   * 腾讯坐标转百度坐标
   * @param point
   * @returns {*}
   * @constructor
   */
  x_pi: 3.14159265358979324 * 3000.0 / 180.0,
  tencentToBaidu (point) {
    let x = point.lng, y = point.lat;
    let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
    let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
    return {
      lng: z * Math.cos(theta) + 0.0065,
      lat: z * Math.sin(theta) + 0.006
    }
  },
  
  /**
   * 百度坐标转腾讯坐标
   * @param point
   * @returns {*}
   * @constructor
   */
  baiduToTencent (point) {
    let x = point.lng - 0.0065, y = point.lat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
    return {
      lng: z * Math.cos(theta),
      lat: z * Math.sin(theta)
    }
  },
  
  /**
   * 判断对象{}是否是空的
   * @param obj
   * @returns {boolean}
   */
  isEmptyObject(obj) {
    for(let x in obj) {
      return false;
    }
    return true;
  },
  
  getOrderListPageRouter () {
    if(storage.get('indexRouter') === 'carpoolbusMap'){
      return 'carpoolMapOrderList'
    }else{
      return 'orderList'
    }
  }
}
