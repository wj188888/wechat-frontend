'use strict'

import {http} from '../utils/http'
let serverAnonymous = '/a'

export default {
  /**
   * 查询首页、景点轮播广告
   * @param data
   */
  findAdByPostion: (data) => {
    return http({
      url: '/advertisement/findAdByPostion',
      data: data
    })
  },
  /**
   * 查询城际专线所有出发地
   * @param hotCitiesNum 热门城市个数
   * @param productTypeLevelOne 产品大类
   * @param productTypeLevelTwo 产品小类
   */
  cityStartupRegionCities: (hotCitiesNum, productTypeLevelOne, productTypeLevelTwo) => {
    return http({
      url: '/cityStartupRegion/cities',
      data: {
        hotCitiesNum: hotCitiesNum,
        productTypeLevelOne: productTypeLevelOne,
        productTypeLevelTwo: productTypeLevelTwo
      }
    })
  },
  
  /**
   * 查询城际专线出发地信息
   * @param keyword 搜索关键词
   * @param productTypeLevelOne 产品大类
   * @param productTypeLevelTwo 产品小类
   */
  cityStartupRegionFindByKeyword: (keyword, productTypeLevelOne, productTypeLevelTwo) => {
    return http({
      url: '/cityStartupRegion/findByKeyword',
      data: {
        keyword: keyword,
        productTypeLevelOne: productTypeLevelOne,
        productTypeLevelTwo: productTypeLevelTwo,
      }
    })
  },
  
  /**
   * 查询城际专线所有目的地
   * @param source 出发地
   * @param hotCitiesNum 热门城市个数
   * @param productTypeLevelOne 产品大类
   * @param productTypeLevelTwo 产品小类
   */
  cityLineRegionDestinations: (source, hotCitiesNum, productTypeLevelOne, productTypeLevelTwo) => {
    return http({
      url: '/cityLineRegion/destinations',
      data: {
        source: source,
        hotCitiesNum: hotCitiesNum,
        productTypeLevelOne: productTypeLevelOne,
        productTypeLevelTwo: productTypeLevelTwo,
      }
    })
  },
  
  /**
   * 查询城际专线目的地信息
   * @param source 出发地
   * @param keyword 搜索关键词
   * @param productTypeLevelOne 产品大类
   * @param productTypeLevelTwo 产品小类
   */
  cityLineRegionFindByKeyword: (source, keyword, productTypeLevelOne, productTypeLevelTwo) => {
    return http({
      url: '/cityLineRegion/findByKeyword',
      data: {
        source: source,
        keyword: keyword,
        productTypeLevelOne: productTypeLevelOne,
        productTypeLevelTwo: productTypeLevelTwo,
      }
    })
  },
  
  /**
   * 城际拼车查询所有出发地
   * @param productTypeLevelOne 产品大类
   * @param productTypeLevelTwo 产品
   */
  cityLineRegionCitiesTemplate: (productTypeLevelOne, productTypeLevelTwo) => {
    return http({
      url: '/cityStartupRegion/citiesTemplate',
      data: {
        productTypeLevelOne: productTypeLevelOne,
        productTypeLevelTwo: productTypeLevelTwo,
      }
    })
  },
  
  /**
   * 城际拼车获取所有的目的地及目的地城市
   * @param data
   */
  cityLineRegionDestinationsTemplate: (data) => {
    return http({
      url: '/cityLineRegion/destinationsTemplate',
      data: data
    })
  },
  
  /**
   * 查询城际专线上下车站点信息
   * @param id sku的id
   */
  citySkuGetStationById: (id) => {
    return http({
      url: `/citySku/${id}/getStation`
    })
  },
  
  /**
   * 查询景点专线上下车站点信息
   * @param id sku的id
   */
  scenicSkuGetStationById: (id) => {
    return http({
      url: `/scenicSku/${id}/getStation`
    })
  },
  
  /**
   * 查询景点专线上下车站点信息
   * @param id sku的id
   */
  schoolSkuGetStationById: (id) => {
    return http({
      url: `/schoolSku/${id}/getStation`
    })
  },
  
  /**
   * 获取车站班车的站外站点
   * @param productId 产品id
   */
  getStationBusWayStations: (productId) => {
    return http({
      url: `/cityProduct/getStationBusWayStations`,
      data:{
        productId: productId
      }
    })
  },
  
  /**
   * 城际专线专车查询
   * @param data
   */
  cityProductFind: (data) => {
    return http({
      url: '/cityProduct/find',
      data: data
    })
  },
  
  /**
   * 景点专线专车查询
   * @param data
   */
  scenicProductFind: (data) => {
    return http({
      url: '/scenicProduct/find',
      data: data
    })
  },
  
  /**
   * 校园专线专车查询
   * @param data
   */
  schoolProductFind: (data) => {
    return http({
      url: '/schoolProduct/find',
      data: data
    })
  },
  
  /**
   * 城际专线班车查询
   * @param data
   */
  citySkuFind: (data) => {
    return http({
      url: '/citySku/find',
      data: data
    })
  },
  
  
  /**
   * 景点专线班车查询
   * @param data
   */
  scenicSkuFind: (data) => {
    return http({
      url: '/scenicSku/find',
      data: data
    })
  },
  
  /**
   * 校园专线班车查询
   * @param data
   */
  schoolSkuFind: (data) => {
    return http({
      url: '/schoolSku/find',
      data: data
    })
  },
  
  /**
   * 查询拼车sku信息
   * @param id
   */
  carpoolSkuFindById: (id) => {
    return http({
      url: `/carpoolSku/${id}`
    })
  },
  
  /**
   * 查询拼车sku参团的信息
   * @param id
   */
  carpoolSkuDetail: (id) => {
    return http({
      url: '/carpoolSku/' + id + '/findDetail',
      data: ''
    })
  },
  
  /**
   * 统计已有拼团的信息
   * @param data
   */
  carpoolSkuStatisExistCarpool: (data) => {
    return http({
      url: '/carpoolSku/statisExistCarpool',
      data: data
    })
  },
  
  /**
   * 城际拼车列表
   * @param data
   */
  carpoolSkuFind: (data) => {
    return http({
      url: '/carpoolSku/find',
      data: data
    })
  },
  
  /**
   * 查询拼团的详细信息
   * @param id 拼团skuid
   */
  carpoolSkuCheckHasAttend: (id) => {
    return http({
      url: `/carpoolSku/${id}/checkHasAttend`
    })
  },
  
  /**
   * 根据id查找城际专线
   * @param id
   */
  citySkuFindById: (id) => {
    return http({
      url: `/citySku/${id}`
    })
  },
  
  /**
   * 根据id查找景点专线
   * @param id
   */
  scenicSkuFindById: (id) => {
    return http({
      url: `/scenicSku/${id}`
    })
  },
  
  /**
   * 根据id查找景点专线
   * @param id
   */
  schoolSkuFindById: (id) => {
    return http({
      url: `/schoolSku/${id}`
    })
  },
  
  /**
   * 根据id查找城际班车详情
   * @param id
   */
  schBusDetailById: (id) => {
    return http({
      url: `/stationSku/${id}`
    })
  },
  
  /**
   *  生成城际班车订单
   * @param data
   */
  createSchBusOrder: (data) => {
    return http({
      url: '/order/createStationOrder',
      method: 'post',
      body: true,
      data: data,
    })
  },
  
  /**
   * 根据ID查询城际专车
   * @param id
   */
  cityProductFindById: (id) => {
    return http({
      url: `/cityProduct/${id}`
    })
  },
  
  /**
   * 根据ID查询校园专车
   * @param id
   */
  schoolProductFindById: (id) => {
    return http({
      url: `/schoolProduct/${id}`
    })
  },
  
  /**
   * 根据ID查询景点专车
   * @param id
   */
  scenicProductFindById: (id) => {
    return http({
      url: `/scenicProduct/${id}`
    })
  },
  
  /**
   * 获取拼车上下车站点的范围
   * @param productId 产品ID
   * @param productTypeLevelOne 产品大类
   * @param type 站点类型 1：上车 2： 下车
   */
  productGetArea: (productId, productTypeLevelOne, type) => {
    return http({
      url: `/product/getArea`,
      data:{
        productId: productId,
        productTypeLevelOne: productTypeLevelOne,
        type: type,
      }
    })
  },
  
  /**
   * 获取拼车上下车站点的范围
   * @param id 站点类型 1：上车 2： 下车
   */
  shuttleGetAreaById: (id) => {
    return http({
      url: `/shuttle/${id}/getArea`,
    })
  },
  
  /**
   * 小件快运的范围
   * @param id 产品ID
   */
  expressProductGetArea: (id) => {
    return http({
      url: `/expressProduct/${id}/getArea`,
      
    })
  },
  
  
  /**
   * 获取接送范围
   * @param code 区域code
   */
  carpoolProductGetArea: (code) => {
    return http({
      url: `/carpoolProduct/getArea`,
      data:{
        code: code,
      }
    })
  },
  
  /**
   * 获取接送范围
   * @param code 区域code
   */
  carpoolProductGetAreaCarpool: (code) => {
    return http({
      url: `/carpoolProduct/${code.id}/getArea`,
      data:{
        code: code,
      }
    })
  },
  
  /**
   * 获取接送范围
   * @param id 产品ID
   * @param productTypeLevelOne 产品类型
   * @param start 0:A 1:B
   * @param lineType 0:A->b 1:B->a
   */
  carpoolProductGetAreaById: (id, productTypeLevelOne, start , lineType) => {
    return http({
      url: `/carpoolProduct/${id}/getArea`,
      data:{
        productTypeLevelOne: productTypeLevelOne,
        start: start,
        type: lineType
      }
    })
  },
  
  /**
   * 查询所选地址是否在城际专线包车范围内
   * @param data
   */
  productInRange: (data) => {
    return http({
      url: '/product/inRange',
      method: 'post',
      data: data
    })
  },
  
  /**
   * 判断用户选中的地点是否在接驳接送范围内
   * @param data
   */
  shuttleInRangeById: (data) => {
    let feederId = data.feederId
    delete data.feederId
    return http({
      url: `/shuttle/${feederId}/inRange`,
      method: 'post',
      data: data
    })
  },
  
  /**
   * 查询所选地址是否在机场专线包车范围内
   * @param data
   */
  airportSkuInRange: (data) => {
    return http({
      url: '/airportSku/inRange',
      data: data
    })
  },
  
  /**
   * 判断所选地点是否在车站专车范围内
   * @param data
   */
  trainStationSkuInRange: (data) => {
    return http({
      url: '/trainStationSku/inRange',
      data: data
    })
  },
  
  /**
   * 小件快运——判断取件地址是否在范围内
   * @param data
   * @returns {{url, token, StoreId}}
   */
  expressProductInRange: (data) => {
    return http({
      url: `/expressProduct/inRange`,
      method: 'post',
      data: data
    })
  },
  
  /**
   * 租车——判断地址是否在范围内
   */
  rentInRange: (data) => {
    return http({
      url: `carRental/${data.id}/inRange`,
      method: 'post',
      body: true,
      data: {latitude: data.point.latitude,longitude: data.point.longitude}
    })
  },
  
  /**
   *  生成城际专车订单
   * @param CharterOrderDTO
   */
  createCharter: (CharterOrderDTO) => {
    return http({
      url: '/order/createCharter',
      method: 'post',
      body: true,
      data: CharterOrderDTO,
    })
  },
  
  /**
   *  生成城际拼车订单--建团
   * @param carpoolCharterOrderDTO
   */
  createCharterCarpool: (carpoolCharterOrderDTO) => {
    return http({
      url: '/order/createCharterCarpool',
      method: 'post',
      body: true,
      data: carpoolCharterOrderDTO,
    })
  },
  
  /**
   *  生成城际拼车订单--参团
   * @param carpoolCharterOrderDTO
   */
  createExistCarpool: (carpoolCharterOrderDTO) => {
    return http({
      url: '/order/createExistCarpool',
      method: 'post',
      body: true,
      data: carpoolCharterOrderDTO,
    })
  },
  
  
  /**
   * 机场专线 - 根据关键字搜索出发地城市
   * @param city 出发地城市
   */
  airportFindAllAirports: (city) => {
    return http({
      url: '/airport/findAllAirports',
      data: {
        city: city
      }
    })
  },
  
  /**
   * 机场专线 - 根据关键字搜索出发地城市
   * @param keyword 出发地城市
   */
  airportFindByKeyword: (keyword) => {
    return http({
      url: '/airport/findByKeyword',
      data: {
        keyword: keyword
      }
    })
  },
  
  /**
   * 查询城际专线上下车站点信息
   * @param id sku的id
   */
  airportSkuGetStationById: (id) => {
    return http({
      url: `/airportSku/${id}/getStation`
    })
  },
  
  /**
   * 机场专线 0 是接机   1是送机
   * @param data
   */
  airportSkuFind: (data) => {
    return http({
      url: '/airportSku/find',
      data: data
    })
  },
  
  /**
   * 根据id查找机场专线
   * @param id
   */
  airportSkuFindById: (id) => {
    return http({
      url: `/airportSku/${id}`
    })
  },
  
  /**
   * 根据航班号查询航班列表
   * @param data
   */
  variflightFindByNum: (data) => {
    return http({
      url: '/variflight/findByNum',
      data: data
    })
  },
  
  /**
   * 根据起降城市查询航班列表
   * @param data
   */
  variflightFindByPlace: (data) => {
    return http({
      url: '/variflight/findByPlace',
      data: data
    })
  },
  
  /**
   * 机场专线包车查询
   * @param data
   */
  airportProductFind: (data) => {
    return http({
      url: '/airportProduct/find',
      data: data
    })
  },
  
  /**
   * 根据ID查询机场专线包车
   * @param id
   */
  airportProductFindById: (id) => {
    return http({
      url: `/airportProduct/${id}`
    })
  },
  
  
  
  /**
   *  生成机场专线定制包车订单
   * @param AirportCharterOrderDTO
   */
  createAirportCharter: (AirportCharterOrderDTO) => {
    return http({
      url: '/order/createAirportCharter',
      method: 'post',
      body: true,
      data: AirportCharterOrderDTO
    })
  },
  
  
  /**
   * 工作班车班次
   * @param data
   */
  schoolWorkFlightFindWork: (data) => {
    return http({
      url: '/schoolWorkFlight/findWork',
      data: data
    })
  },
  
  /**
   * 根据公司名称查询企业专车
   * @param data
   */
  schoolWorkFlightFindCharterWork: (data) => {
    return http({
      url: '/schoolWorkFlight/findCharterWork',
      data: data
    })
  },
  
  /**
   * 查找工作班车sku列表
   * @param data
   * @returns {{url, token, StoreId}}
   */
  workSkuFind: (data) => {
    return http({
      url: '/workSku/find',
      data: data
    })
  },
  
  /**
   * 根据id查找工作班车sku
   * @param id skuid
   * @returns {{url, token, StoreId}}
   */
  workSkuFindById: (id) => {
    return http({
      url: `/workSku/${id}`
    })
  },
  
  /**
   * 根据班次id查询分享主题
   * @param flightId
   */
  workProductFindByFlight: (flightId) => {
    return http({
      url: '/workProduct/findByFlight',
      data: {
        flightId: flightId
      }
    })
  },
  
  /**
   * 查询附近的工作班车
   */
  schoolWorkFlightFindNearWork: (currentLoc, limit) => {
    return http({
      url: '/schoolWorkFlight/findNearWork',
      data:{
        currentLoc: currentLoc,
        limit: limit
      }
    })
  },
  
  /**
   * 查询平台所有推荐的工作班车
   */
  workProductFindComment: (data) => {
    return http({
      url: '/workProduct/findComment',
      data:data
    })
  },
  
  
  /**
   * 生成校园/工作班车订单
   * @param data
   */
  createSchoolWork: (data) => {
    return http({
      url: '/order/createSchoolWork',
      method: 'post',
      body: true,
      data: data
    })
  },
  
  /**
   * 生成企业班车和校园班车包车申请
   * @param application
   */
  createSchoolWorkApplication: (application) => {
    return http({
      url: '/schoolWorkApplication/create',
      method: 'post',
      body: true,
      data: application
    })
  },
  
  /**
   * 查询工作/校园专车
   * @param id
   */
  schoolWorkApplicationFindById: (id) => {
    return http({
      url: `/schoolWorkApplication/${id}/find`
    })
  },
  
  
  
  /**
   * 查询定制线路
   */
  lineProductFind: (data) => {
    return http({
      url: '/lineProduct/find',
      data: data
    })
  },
  /**
   * 查询推荐定制线路
   */
  lineCommendFind: (data) => {
    return http({
      url: '/lineProduct/findCommend',
      data: data
    })
  },
  
  /**
   * 根据id查找线路包车详情
   */
  lineProductFindById: (id) => {
    return http({
      url: `/lineProduct/${id}`
    })
  },
  
  /**
   * 查询线路包车上下车站点
   */
  lineProductFindStations: (id) => {
    return http({
      url: `/lineProduct/${id}/findStations`
    })
  },
  
  /**
   * 根据产品id查找所有线路包车sku
   */
  lineSkuFind: (data) => {
    return http({
      url: '/lineSku/find',
      data:data
    })
  },
  
  /**
   * 根据skuId查找线路包车
   */
  lineSkuFindById: (skuId) => {
    return http({
      url: `/lineSku/${skuId}`
    })
  },
  
  /**
   * 查询分享的线路拼成信息
   * @param skuId
   */
  lineSkuFindShareLine: (skuId) => {
    return http({
      url: `/lineSku${serverAnonymous}/findShareLine`,
      data:skuId
    })
  },
  
  /**
   * 查询分享的线路拼成信息
   * @param skuId
   */
  lineSkuFindStatus: (skuId) => {
    return http({
      url: `/lineSku${serverAnonymous}/${skuId}/findStatus`
    })
  },
  
  /**
   * 查询公众号的用户名
   * @param storeId
   */
  findWxUserName: (storeId) => {
    return http({
      url: `/lineSku${serverAnonymous}/findWxUserName`,
      data:storeId
    })
  },
  
  /**
   * 查询公众号二维码
   * @param storeId
   */
  getStoreQrCodeUrl: (storeId) => {
    return http({
      url: `/store${serverAnonymous}/getStoreQrCodeUrl`,
      data: {
        storeId: storeId
      }
    })
  },
  
  /**
   * 创建线路拼车
   * @param lineOrderDTO
   */
  orderCreateLine: (lineOrderDTO) => {
    return http({
      url: '/order/createLine',
      method: 'post',
      body: true,
      data: lineOrderDTO
    })
  },
  
  /**
   * 拼线路拼车
   * @param existLineOrderDTO
   */
  orderCreateExistLine: (existLineOrderDTO) => {
    return http({
      url: '/order/createExistLine',
      method: 'post',
      body: true,
      data: existLineOrderDTO
    })
  },
  
  /**
   * 独立包车
   * @param lineCharteOrderDTO
   */
  orderCreateCharterLine: (lineCharteOrderDTO) => {
    return http({
      url: '/order/createCharterLine',
      method: 'post',
      body: true,
      data: lineCharteOrderDTO
    })
  },
  
  /**
   * 定制包车查询
   */
  customProductFind: () => {
    return http({
      url: '/customProduct/find'
    })
  },
  
  /**
   * 定制包车产品查询
   * @param data
   */
  customProductCheck: (data) => {
    return http({
      url: '/customProduct/check',
      data:data
    })
  },
  
  /**
   * 查询是否有人报价
   */
  enquiryCheckIsQuote: (enquiryId) => {
    return http({
      url: '/enquiry/checkIsQuote',
      data: {
        enquiryId: enquiryId
      }
    })
  },
  
  /**
   * 定制包车询价列表查询
   */
  enquiryFind: (data) => {
    return http({
      url: '/enquiry/find',
      data: data
    })
  },
  
  /**
   * 定制包车询价列表查询
   * @param data
   */
  enquiryFindGenerateOrderInfo: (data) => {
    return http({
      url: '/enquiry/findGenerateOrderInfo',
      data: data
    })
  },
  
  /**
   * 定制包车支付定金后查询状态
   * @param data
   */
  enquiryFindStatus: (data) => {
    return http({
      url: '/enquiry/findStatus',
      data: data
    })
  },
  
  /**
   * 定制包车询价查询
   */
  enquiryFindById: (id) => {
    return http({
      url: `/enquiry/${id}`
    })
  },
  
  /**
   * 查询询价报价列表
   */
  quoteFind: (enquiryId) => {
    return http({
      url: '/quote/find',
      data: enquiryId
    })
  },
  
  /**
   * 查询已经成交的报价
   */
  quoteFindDealQuote: (enquiryId) => {
    return http({
      url: '/quote/findDealQuote',
      data: enquiryId
    })
  },
  
  /**
   * 创建定制包车询价
   * @param enquiryDTO
   */
  enquiryCreate: (enquiryDTO) => {
    return http({
      url: '/enquiry/create',
      method: 'post',
      body: true,
      data: enquiryDTO
    })
  },
  
  /**
   *  再次提交询价
   * @param id 询价id
   * @param quoteHour 询价时间
   */
  enquiryReEdit: (id, quoteHour) => {
    return http({
      url: `/enquiry/${id}/reEdit`,
      method: 'post',
      data: quoteHour
    })
  },
  
  /**
   * 生成定制包车订单
   * @param customerCharterOrderDTO
   */
  createCustomerCharter: (customerCharterOrderDTO) => {
    return http({
      url: '/order/createCustomerCharter',
      method: 'post',
      body: true,
      data: customerCharterOrderDTO
    })
  },
  
  /**
   * 查询接站专线上下车站点信息
   * @param id sku的id
   */
  trainStationSkuGetStationById: (id) => {
    return http({
      url: `/trainStationSku/${id}/getStation`
    })
  },
  
  /**
   * 送站专线 - 根据关键字搜索出发地城市
   * @param city 出发地城市
   */
  trainStationFindAll: (city) => {
    return http({
      url: '/trainStation/findAll',
      data: {
        city: city
      }
    })
  },
  
  /**
   * 送站专线 - 根据关键字搜索出发地城市
   * @param keyword 出发地城市
   */
  trainStationFindByKeyword: (keyword) => {
    return http({
      url: '/trainStation/findByKeyword',
      data: {
        keyword: keyword
      }
    })
  },
  
  /**
   * 查询送站专线专车产品
   * @param data
   */
  trainStationProductFind: (data) => {
    return http({
      url: '/trainStationProduct/find',
      data: data
    })
  },
  
  /**
   * 查询送站专线专车产品
   * @param productId
   */
  trainStationProductFindById: (productId) => {
    return http({
      url: `/trainStationProduct/${productId}`,
    })
  },
  
  /**
   * 查询送站专线车票
   * @param data
   */
  trainStationSkuFind: (data) => {
    return http({
      url: '/trainStationSku/find',
      data: data
    })
  },
  
  /**
   * 根据id查找接站专线
   * @param id
   */
  trainStationSkuFindById: (id) => {
    return http({
      url: `/trainStationSku/${id}`
    })
  },
  
  /**
   * 查找专车可以用车辆
   * @param productId 产品id
   * @param productTypeLevelOne 产品大类
   */
  charterProductFindAvaibleCar: (productId, productTypeLevelOne) => {
    return http({
      url: `/charterProduct/${productId}/findAvaibleCar`,
      data:{
        productTypeLevelOne: productTypeLevelOne
      }
    })
  },
  
  /**
   * 查找城际拼车可以用车辆
   * @param productId 产品id
   * @param productTypeLevelOne 产品大类
   */
  charterProductFindAvaibleCarGrade: (productId, productTypeLevelOne) => {
    return http({
      url: `/charterProduct/${productId}/findAvaibleCarGrade`,
      data:{
        productTypeLevelOne: productTypeLevelOne
      }
    })
  },
  
  /**
   * 查找城际拼车可以用车辆
   * @param productId 产品id
   * @param productTypeLevelOne 产品大类
   */
  findSpecialCar: (productId, productTypeLevelOne) => {
    return http({
      url: `/integralExchange/findSpecialCar`,
      data:{
        productId: productId,
        productTypeLevelOne: productTypeLevelOne,
      }
    })
  },
  
  /**
   * 创建接站专车订单
   * @param trainCharterOrderDTO
   */
  orderCreateTrainCharter: (trainCharterOrderDTO) => {
    return http({
      url: '/order/createTrainCharter',
      method: 'post',
      body: true,
      data: trainCharterOrderDTO
    })
  },
  
  /**
   * 新增乘客信息
   * @param passengers
   */
  userAddPassengers: (passengers) => {
    return http({
      url: '/user/addPassengers',
      method: 'post',
      body: true,
      data: passengers,
    })
  },
  
  /**
   * 乘客修改
   * @param passenger
   */
  passengerEdit: (passenger) => {
    return http({
      url: '/user/updatePassenger',
      method: 'post',
      body: true,
      data: passenger,
    })
  },
  
  /**
   * 乘客列表查询
   */
  passengerFind: () => {
    return http({
      url: '/user/findPassenger'
    })
  },
  
  /**
   * 判断添加的旅客中是否存在本人
   */
  userExistOwn: () => {
    return http({
      url: '/user/existOwn'
    })
  },
  /**
   * 判断添加的驾驶员中是否存在本人
   */
  driverExistOwn: () => {
    return http({
      url: '/user/existDriverInfo',
      back: 'URL'
    })
  },
  /**
   * 驾驶员列表查询
   */
  driverFind: () => {
    return http({
      url: '/user/findDriverInfo'
    })
  },
  /**
   * 新增驾驶员信息
   * @param drivers
   */
  driverAdd: (drivers) => {
    return http({
      url: '/user/addDriverInfo',
      method: 'post',
      body: true,
      data: drivers
    })
  },
  /**
   * 编辑驾驶员信息
   * @param drivers
   */
  driverEdit: (drivers) => {
    return http({
      url: '/user/updateDriverInfo',
      method: 'post',
      body: true,
      data: drivers
    })
  },
  
  
  /**
   * 查询新增乘客是否重复
   */
  existPassenger: () => {
    return http({
      url: '/user/existPassenger',
      back: 'URL'
    })
  },
  
  /**
   * 获取常用地址一
   */
  userGetCommonAddressOne: () => {
    return http({
      url: '/user/getCommonAddressOne'
    })
  },
  
  /**
   * 修改常用地址一
   * @param address
   * @returns {{url, token, StoreId}}
   */
  userUpdateCommonAddressOne: (address) => {
    return http({
      url: '/user/updateCommonAddressOne',
      method: 'post',
      body: true,
      data: address
    })
  },
  
  /**
   * 修改常用地址二
   * @param address
   * @returns {{url, token, StoreId}}
   */
  userUpdateCommonAddressTwo: (address) => {
    return http({
      url: '/user/updateCommonAddressTwo',
      method: 'post',
      body: true,
      data: address
    })
  },
  
  /**
   * 获取常用地址二
   */
  userGetCommonAddressTwo: () => {
    return http({
      url: '/user/getCommonAddressTwo'
    })
  },
  
  /**
   * 查找店铺门店
   */
  subStoreFind: () => {
    return http({
      url: `/subStore${serverAnonymous}/find`
    })
  },
  
  /**
   * 查找店铺站点
   */
  siteFind: () => {
    return http({
      url: `/site${serverAnonymous}/find`
    })
  },
  
  /**
   * 生成城际/机场/接站班车订单信息
   * @param fixOrderDTO
   */
  orderCreate: (fixOrderDTO) => {
    return http({
      url: '/order/create',
      method: 'post',
      body: true,
      data: fixOrderDTO
    })
  },
  
  
  getOpenid: () => {
    return http({
      url: '/wxPay/getOpenid',
      back: 'URL'
    })
  },
  
  /**
   * 统一下单功能
   * @param data
   */
  unifiedOrder: (data) => {
    return http({
      url: '/wxPay/unifiedOrder',
      method: 'post',
      data: data
    })
  },
  
  /**
   * 车辆年检下单
   * @param data
   */
  unifiedCarInsOrder: (data) => {
    return http({
      url: '/wxPay/unifiedCarInsOrder',
      method: 'post',
      data: data
    })
  },
  
  /**
   * 车辆年检取消订单
   * @param id
   */
  carInspectionOrderCancel: (id) => {
    return http({
      url: `/carInspectionOrder/${id}/cancel`,
      method: 'post',
    })
  },
  
  /**
   * 车辆年检超时取消订单
   * @param id
   */
  carInspectionOrderOverTimeCancel: (id) => {
    return http({
      url: `/carInspectionOrder/${id}/overTimeCancel`,
      method: 'post',
    })
  },
  
  /**
   * 车辆年检查询订单状态
   * @param data
   */
  carInspectionOrderFindStatus: (data) => {
    return http({
      url: `/carInspectionOrder/findStatus`,
      data: data
    })
  },
  /**
   * 车辆年检订单评价
   * @param data
   */
  carInspectionOrderReview: (data) => {
    return http({
      url: `/carInspectionOrder/orderReview`,
      method: 'post',
      data: data
    })
  },
  /**
   * 车辆年检订单分享
   * @param data
   */
  carInspectionGetShareTheme: (data) => {
    return http({
      url: `/carInspectionSetting/getShareTheme`,
      data: data
    })
  },
  
  /**
   * 定制包车预付定金下单功能
   * @param data
   */
  unifiedOrderForEnquiry: (data) => {
    return http({
      url: '/wxPay/unifiedOrderForEnquiry',
      method: 'post',
      data: data
    })
  },
  
  /**
   * 根据订单号查询订单的状态
   * @param orderId
   */
  orderFindStatus: (orderId) => {
    return http({
      url: '/order/findStatus',
      data: orderId
    })
  },
  
  /**
   * 订单列表
   *
   */
  orderFind: (data) => {
    return http({
      url: '/order/find',
      data: data
    })
  },
  
  /**
   * 根据id查订单详情
   * @param orderId
   */
  orderDetailById: (orderId) => {
    return http({
      url: '/order/findDetail',
      data: orderId
    })
  },
  
  /**是否能退票
   * @param data
   */
  checkCanRefundOrder: (data) => {
    return http({
      url: '/order/checkCanRefund',
      method: 'get',
      data: data
    })
  },
  
  /**
   * 支付倒计时完成翻转订单状态
   * @param orderId
   */
  invalidOrder: (orderId) => {
    return http({
      url: `order/${orderId}/invalidOrder`,
      method: 'post'
    })
  },
  
  
  /**
   * 根据订单id查订单接驳
   * @param orderId
   */
  shuttleOrderFindByOrderId: (orderId) => {
    return http({
      url: '/shuttleOrder/find',
      data: {
        orderId: orderId
      }
    })
  },
  
  /**
   * 获取接驳须知
   * @param feederId 接驳id
   */
  shuttleFindNotice: (feederId) => {
    return http({
      url: `/shuttle/${feederId}/findNotice`,
    })
  },
  
  /**
   * 根据id查接驳订单
   * @param feederId 接驳id
   */
  shuttleOrderFindById: (feederId) => {
    return http({
      url: `/shuttleOrder/${feederId}`,
    })
  },
  
  /**
   * 根据id查接驳订单
   * @param feederId 接驳id
   */
  shuttleOrderRefund: (feederId) => {
    return http({
      url: `/shuttleOrder/${feederId}/refund`,
      method: 'post',
    })
  },
  
  /**
   * 根据id查租车订单详情
   * @param data
   */
  rentOrderDetailById: (data) => {
    return http({
      url: `/crOrder/${data.orderId}`
    })
  },
  
  /**
   * 根据订单id查询线路拼车状态
   * @param orderId
   */
  orderFindLineStatus: (orderId) => {
    return http({
      url: '/order/findLineStatus',
      data: orderId
    })
  },
  
  /**
   * 根据询价id查询询价的状态
   * @param enquiryId
   */
  enquiryFindAllStatus: (enquiryId) => {
    return http({
      url: '/enquiry/findAllStatus',
      data: {
        enquiryId: enquiryId
      }
    })
  },
  
  /**
   * 根据订单id查询线路拼车状态
   * @param id
   * @param data
   */
  lineProductGetPrices: (id, data) => {
    return http({
      url: `/lineProduct/${id}/getPrices`,
      data: data
    })
  },
  
  /**
   * 根据id查找司机详情
   * @param id
   */
  driverDetailById: (id) => {
    return http({
      url: `/driver${serverAnonymous}/${id}`
    })
  },
  
  /**查询车票列表
   * @param data
   */
  findTicketList: (data) => {
    return http({
      url: '/ticket/find',
      method: 'post',
      data: data
    })
  },
  
  /**查询当前车票列表
   * @param data
   */
  findTicketListOwn: (data) => {
    return http({
      url: '/ticket/findByOrderId',
      method: 'get',
      data: data
    })
  },
  
  /**
   * 查询当天未发车车票列表
   * @param status
   */
  findCurrentTicket: (status) => {
    return http({
      url: '/ticket/findCurrentTicket',
      data: status
    })
  },
  
  /**
   * 查询未出行的所有行程
   */
  findUnRideTickets: () => {
    return http({
      url: 'ticket/findUnRideTickets'
    })
  },
  
  /**
   * 行程分享
   * @param taskId
   */
  taskShareFindByTaskId: (taskId) => {
    return http({
      url: `/taskShare${serverAnonymous}/findByTaskId`,
      data:{
        taskId: taskId
      }
    })
  },
  
  /**
   * 根据storeId生成关注二维码
   * @param storeId
   */
  taskShareGetQrCode: (storeId) => {
    return http({
      url: `/taskShare${serverAnonymous}/getQrCode?storeId=${storeId}`,
      back: 'ewmShareUrl'
    })
  },
  
  /**
   * 根据id查找车票详情
   * @param id
   */
  ticketDetailById: (id) => {
    return http({
      url: `/ticket/${id}`
    })
  },
  
  /**
   * 验票
   * @param id
   */
  ticketCheckById: (id) => {
    return http({
      url: `/ticket/checkTicketOk?ticketId=${id}`
    })
  },
  
  /**
   * 退票
   * @param data
   */
  ticketRefundNew: (data) => {
    return http({
      url: '/wxPay/refundNew',
      method: 'post',
      data: data
    })
  },
  
  /**
   * 退票more
   * @param data
   */
  ticketRefundMore: (data) => {
    return http({
      url: '/wxPay/refundMore',
      method: 'post',
      data: data
    })
  },
  
  /**
   * 退票more
   * @param data
   */
  findRefundFee: (data) => {
    return http({
      url: '/wxPay/calServiceFee',
      method: 'post',
      data: data
    })
  },
  
  /**
   * 根据订单ID查询能退款的车票
   * @param orderId
   */
  ticketFindRefundByOrderId: (orderId) => {
    return http({
      url: '/ticket/findRefundByOrderId',
      data: {
        orderId: orderId
      }
    })
  },
  
  /**
   * 退票
   * @param data
   */
  wxPayRefundMore: (data) => {
    return http({
      url: '/wxPay/refundMore',
      method: 'post',
      data: data
    })
  },
  
  /**
   * 订单评价
   * @param data
   */
  orderEval: (data) => {
    return http({
      url: '/orderReview/create',
      method: 'post',
      data: data
    })
  },
  
  /**
   * 查询订单的详情
   * @param orderId 订单id
   * @param productTypeLevelOne 产品大类
   */
  orderReviewFindOrderDetail: (orderId, productTypeLevelOne) => {
    return http({
      url: '/orderReview/findOrderDetail',
      data: {
        orderId: orderId,
        productTypeLevelOne: productTypeLevelOne
      }
    })
  },
  
  /**
   * 根据订单号查询评价详情
   * @param data
   */
  evalDetailById: (data) => {
    return http({
      url: '/orderReview/findByOrderId',
      data: data
    })
  },
  
  /**
   * 根据司机id查询其对应的评价信息
   * @param data
   */
  evalByDriverId: (data) => {
    return http({
      url: '/orderReview/findByDriverId',
      data: data
    })
  },
  
  /**
   * 根据id生成二维码
   * @param id
   */
  getSrc: (id) => {
    return http({
      url: `/ticket/getQrCode?ticketId=${id}`,
      back: 'ewmURL'
    })
  },
  
  /**
   * 首页获取目的地
   * @param data
   */
  findDestList: (data) => {
    return http({
      url: '/tourLineRegion/destinations',
      data: data
    })
  },
  
  /**
   * 首页根据关键词搜索目的地
   * @param data
   */
  searchDestList: (data) => {
    return http({
      url: '/tourLineRegion/findDestByKeyword',
      data: data
    })
  },
  
  /**
   * 班线和产品根据目的地搜索出发地
   * @param destination
   */
  findSources: (destination) => {
    return http({
      url: '/tourLineRegion/findSources',
      data: destination
    })
  },
  
  /**
   * 查找景点推荐产品
   * @param data
   */
  findCommendProduct: (data) => {
    return http({
      url: '/tourProduct/findCommend',
      data: data
    })
  },
  
  /**
   * 根据特定的目的地查询所有产品
   * @param data
   */
  tourProductFind: (data) => {
    return http({
      url: '/tourProduct/find',
      method: 'post',
      body: true,
      data: data
    })
  },
  
  /**
   * 查询所有班次，产品
   * @param data
   */
  findAllProduct: (data) => {
    return http({
      url: '/tourProduct/findAll',
      data: data
    })
  },
  
  /**
   * 查询条件适合人群
   * @param data
   */
  findSuitablePersons: (data) => {
    return http({
      url: '/tourProduct/findSuitablePersons',
      data: data
    })
  },
  
  /**
   * 景点专线景点下单详情查找porderWrite页面
   * @param data
   */
  sightProductDetail: (data) => {
    return http({
      url: '/tourProduct/findTour',
      data: data
    })
  },
  
  /**
   * 景点专线日期价格查询sku
   * @param id
   * @param data
   */
  findSightSku: (id, data) => {
    return http({
      url: `/tourProduct/${id}/getPrices`,
      data: data
    })
  },
  
  /**
   * 景点专线详情查询productDetail页面
   * @param id
   */
  findProductDetail: (id) => {
    return http({
      url: `/tourProduct/${id}`
    })
  },
  
  /**
   * 景点专线新增订单
   * @param data
   */
  orderCreateTour: (data) => {
    return http({
      url: '/order/createTour',
      method: 'post',
      body: true,
      data: data
    })
  },
  
  /**
   * 检查用户是否通过手机认证
   */
  userCheckAuth: () => {
    return http({
      url: '/user/checkAuth',
      back: 'URL'
    })
  },
  
  /**
   * 发送短信验证码
   * @param phone
   */
  smsFind: (phone) => {
    return http({
      url: '/sms/find',
      data: phone
    })
  },
  
  /**
   * 发送短信验证码
   * @param phone
   * @param code
   */
  verifySMS: (phone, code) => {
    return http({
      url: '/user/verifySMS',
      method: 'post',
      data: {
        phone: phone,
        code: code
      }
    })
  },
  
  /**
   * 添加支付密码
   * @param password
   * @param code
   */
  addPayPassword: (password, code) => {
    return http({
      url: '/user/addPayPassword',
      method: 'post',
      data: {
        password: password,
        code: code
      }
    })
  },
  
  /**
   * 添加支付密码
   * @param password
   * @param oldPassword
   */
  resetPayPassword: (password, oldPassword) => {
    return http({
      url: '/user/resetPayPassword',
      method: 'post',
      data: {
        password: password,
        oldPassword: oldPassword
      }
    })
  },
  
  /**
   * 验证支付密码
   * @param password
   */
  verifyPayPassword: (password) => {
    return http({
      url: '/user/verifyPayPassword',
      method: 'post',
      data: {
        password: password
      }
    })
  },
  
  /**
   * 微信用户认证
   * @param data
   */
  userAuth: (data) => {
    return http({
      url: '/user/auth',
      method: 'post',
      data: data
    })
  },
  
  /**
   * 浏览器用户认证
   * @param data
   */
  userAuthByBrowser: (data) => {
    return http({
      url: '/user/authByBrowser',
      method: 'post',
      data: data
    })
  },
  
  /**
   * 用户解绑认证
   */
  userUnAuth: () => {
    return http({
      url: '/user/unAuth',
      method: 'post'
    })
  },
  
  /**
   * 分享接口
   * @param data
   */
  customShareFindConfig: (data) => {
    return http({
      url: '/customShare/findConfig',
      method: 'post',
      data: data
    })
  },
  
  getComplainItem: () => {
    return http({
      url: '/orderComplaint/getOrderComplaintItem'
    })
  },
  
  createComplain: (data) => {
    return http({
      url: '/orderComplaint/create',
      method: 'post',
      data: data
    })
  },
  
  /**
   * 车次提醒
   * @param data
   */
  findTimesInfo: (data) => {
    return http({
      url: '/message/find',
      method: 'post',
      data: data
    })
  },
  
  /**
   * 获取公司信息文案
   */
  brandBriefFind: () => {
    return http({
      url: '/brandBrief/find'
    })
  },
  
  /**
   * 验证token是否过期
   */
  tokenCheckExpire: () => {
    return http({
      url: '/token/checkExpire',
      back: 'URL'
    })
  },
  
  /**
   * 获取用户的基本信息
   */
  userGetUserInfo: () => {
    return http({
      url: '/user/getUserInfo'
    })
  },
  
  /**
   * 修改昵称
   * @param nickName 昵称
   */
  uptNickName: (nickName) => {
    return http({
      url: '/user/uptNickName',
      method: 'post',
      data:nickName
    })
  },
  
  /**
   * 更新真实姓名
   * @param realName 真实姓名
   */
  uptRealName: (realName) => {
    return http({
      url: '/user/uptRealName',
      method: 'post',
      data:realName
    })
  },
  
  /**
   * 更新身份证号码
   * @param idCard 身份证号码
   */
  uptIdCard: (idCard) => {
    return http({
      url: '/user/uptIdCard',
      method: 'post',
      data:idCard
    })
  },
  
  /**
   * 更新用户的性别
   * @param sex 性别 值为1时是男性，值为2时是女性，值为0时是未知
   */
  uptSex: (sex) => {
    return http({
      url: '/user/uptSex',
      method: 'post',
      data:sex
    })
  },
  
  /**
   * 更新邮箱
   * @param email 邮箱
   */
  uptEmail: (email) => {
    return http({
      url: '/user/uptEmail',
      method: 'post',
      data:email
    })
  },
  
  /**
   * 查询会员卡信息
   * @param id 会员卡id
   */
  memberCardFindById: (id) => {
    return http({
      url: `/memberCard/${id}`,
    })
  },
  
  /**
   * 添加会员卡信息
   * @param id 会员卡id
   */
  memberCardObtain: (id) => {
    return http({
      url: `/memberCard/${id}/obtain`,
      method: 'post',
    })
  },
  
  /**
   * 添加会员卡信息
   * @param id 会员卡id
   */
  memberCardGetQrcode: (id) => {
    return http({
      url: `/memberCard/${id}/getQrcode`,
    })
  },
  
  /**
   * 查询用户所有会员卡
   */
  wxUserMemberCardFind: () => {
    return http({
      url: '/wxUserMemberCard/find',
    })
  },
  
  /**
   * 查询用户当前会员卡状态
   * @param cardId 会员卡id
   */
  wxUserMemberCardFindById: (cardId) => {
    return http({
      url: `/wxUserMemberCard/findByCardId`,
      data:{
        cardId: cardId
      }
    })
  },
  
  /**
   * 根据价格查询保险类型
   * @param price 车票价格
   */
  insurancePlanTypeFind: (price) => {
    return http({
      url: '/insurancePlanType/find',
      data:price
    })
  },
  
  /**
   * 登录查找所有优惠券
   * @param data 分页查询条件
   */
  couponGetAvailableCoupons: (data) => {
    return http({
      url: '/coupon/getAvailableCoupons',
      data: data
    })
  },
  
  /**
   * 未登录查找所有优惠券
   * @param data 分页查询条件
   */
  couponGetAvailableCouponsA: (data) => {
    return http({
      url: `/coupon${serverAnonymous}/getAvailableCoupons`,
      data: data
    })
  },
  
  /**
   * 跟进优惠券ID查询优惠券
   * @param couponId 优惠券ID
   */
  couponFindById: (couponId) => {
    return http({
      url: `/coupon/${couponId}`
    })
  },
  
  /**
   * 查询我的优惠券
   * @param data 分页查询条件
   */
  wxUserCouponFind: (data) => {
    return http({
      url: '/wxUserCoupon/find',
      data: data
    })
  },
  
  /**
   * 跟进优惠券ID查询优惠券
   * @param couponId 优惠券ID
   */
  wxUserCouponFindById: (couponId) => {
    return http({
      url: `/wxUserCoupon/${couponId}`
    })
  },
  
  /**
   * 微信登录用户领取优惠券
   * @param couponId 优惠券ID
   */
  wxUserCouponTakeCoupon: (couponId) => {
    return http({
      url: '/wxUserCoupon/takeCoupon',
      method: 'post',
      data: {
        couponId: couponId
      }
    })
  },
  
  /**
   * 未登录用户领取优惠券
   * @param couponId 优惠券ID
   * @param phone 用户电话
   */
  wxUserCouponTakeCouponA: (couponId, phone) => {
    return http({
      url: `/wxUserCoupon${serverAnonymous}/takeCouponByPhone`,
      method: 'post',
      data: {
        couponId: couponId,
        phone: phone
      }
    })
  },
  
  /**
   * 查询满足订单的优惠券
   * @param data
   */
  wxUserCouponFindOrderCoupon: (data) => {
    return http({
      url: '/wxUserCoupon/findOrderCoupon',
      data: data
    })
  },
  
  /**
   * 查询满足订单的优惠券
   * @param data
   */
  wxUserCouponFindAvailableCoupon: (data) => {
    return http({
      url: '/wxUserCoupon/findAvailableCoupon',
      data: data
    })
  },
  
  /**
   * 获取订单优惠信息
   * @param orderDiscountDTO
   */
  getOptimalActivity: (orderDiscountDTO) => {
    return http({
      url: '/marketingActivity/getOptimalActivity',
      data: orderDiscountDTO
    })
  },
  
  /**
   * 查找积分兑换--热门兑换产品5条数据
   */
  hotExchangeProductFind: () => {
    return http({
      url: '/hotExchangeProduct/find'
    })
  },
  
  /**
   * 查找积分兑换的产品大类
   */
  getExProductOverview: () => {
    return http({
      url: 'integralExchange/getExProductOverview'
    })
  },
  
  /**
   * 查找积分兑换的产品
   */
  findExProduct: (data) => {
    return http({
      url: '/integralExchange/findExProduct',
      data: data
    })
  },
  
  /**
   * 查找积分兑换的产品城市
   * @param productTypeLevelOne
   */
  getLineAddress: (productTypeLevelOne) => {
    return http({
      url: '/integralExchange/getLineAddress',
      data: {
        productTypeLevelOne: productTypeLevelOne
      }
    })
  },
  
  /**
   * 查找积分兑换的班次列表
   */
  findExProductSku: (data) => {
    return http({
      url: '/integralExchange/findExProductSku',
      data: data
    })
  },
  
  /**
   * 查找积分抵现规则
   * @param data
   */
  getExchangeRule: (data) => {
    return http({
      url: '/integralExchange/getExchangeRule',
      data: data
    })
  },
  
  /**
   * 查找积分抵现规则
   * @param skuId
   */
  integralExchangeGetStation: (skuId, productTypeLevelOne) => {
    return http({
      url: '/integralExchange/getStation',
      data: {
        skuId: skuId,
        productTypeLevelOne: productTypeLevelOne,
        exchangeType: 0
      }
    })
  },
  
  
  /**
   * 获取旅游度假产品的价格
   * @param data
   */
  integralExchangeGetPrices: (data) => {
    return http({
      url: '/integralExchange/getPrices',
      data: data
    })
  },
  
  /**
   * 获取积分兑换明细
   * @param data
   */
  wxUserIntegralFind: (data) => {
    return http({
      url: '/wxUserIntegral/find',
      data: data
    })
  },
  
  /**
   * pv/uv记录
   * @param visitLogs
   */
  visitLogCreate: (visitLogs) => {
    return http({
      url: `/visitLog${serverAnonymous}/create`,
      method: 'post',
      body: true,
      data: visitLogs,
    })
  },
  
  /**
   * 根据店铺id查询店铺名称及公司名称
   */
  storeFind: (storeId) => {
    return http({
      url: `/store${serverAnonymous}/find`,
      data:{
        storeId: storeId
      }
    })
  },
  
  /**
   * 线路拼车放弃支付时，取消订单和车票
   * @param orderId 订单id
   */
  cancleOrderAndTicket: (orderId) => {
    return http({
      url: '/order/cancleOrderAndTicket',
      method: 'post',
      data:{
        orderId: orderId
      }
    })
  },
  /**
   * 取消自驾租车订单
   * @param data
   */
  cancelRentOrder: (data) => {
    return http({
      url: `/crOrder/${data.orderId}/cancel`,
      method: 'post',
      body: true,
      data: {cancelReason:data.cancelReason}
    })
  },
  
  /**
   * 查询司机服务产品以及司机详情--司机名片
   * @param driverId 司机id
   */
  driverGetDriverCard: (driverId) => {
    return http({
      url: `/driver/${serverAnonymous}/getDriverCard`,
      data:{
        driverId: driverId
      }
    })
  },
  
  /**
   * 查询车辆详情
   * @param carId 车辆id
   */
  carGetCarCard: (carId) => {
    return http({
      url: `/car${serverAnonymous}/getCarCard`,
      data:{
        carId: carId
      }
    })
  },
  
  /**
   * 获取网约车车型
   */
  chProductGetChCarGrade: () => {
    return http({
      url: '/chProduct/a/getChCarGrade'
    })
  },
  
  /**
   * 得到预估信息 注：经纬度小数点不能超过六位
   */
  chOrderGetEstimated: (data) => {
    return http({
      url: '/chOrder/getEstimated',
      data: data
    })
  },
  
  /**
   * 生成用车订单
   * @param chOrderDTO
   */
  chOrderCreate: (chOrderDTO) => {
    return http({
      url: '/chOrder/create',
      method: 'post',
      body: true,
      data: chOrderDTO
    })
  },
  
  /**
   * 生成用车订单
   * @param orderDTO
   */
  taxiOrderCreate: (orderDTO) => {
    return http({
      url: '/taxiOrder/create',
      method: 'post',
      body: true,
      data: orderDTO
    })
  },
  
  /**
   * 查询未完成的订单
   */
  chBaseOrderFindUnFinishedOrder: (productTypeLevelOne) => {
    return http({
      url: 'chBaseOrder/findUnFinishedOrder',
      data:{
        productTypeLevelOne: productTypeLevelOne
      }
    })
  },
  
  /**
   * 长轮询获取品牌约车订单数据
   */
  chBaseOrderPolling: (orderId, status) => {
    return http({
      url: '/chBaseOrder/polling',
      data:{
        orderId: orderId,
        status: status
      }
    })
  },
  
  /**
   * 长轮询获取品牌约车车辆数据
   */
  geoPolling: (data) => {
    return http({
      url: '/geo/polling',
      data: data
    })
  },
  
  /**
   * 取消用车
   * @param id 订单ID
   * @param cancleReason 取消用车原因
   * @param productTypeLevelOne 产品类型
   */
  chBaseOrderCancle: (id, cancleReason, productTypeLevelOne) => {
    return http({
      url: `chBaseOrder/${id}/cancle`,
      method: 'post',
      data: {
        cancleReason: cancleReason,
        productTypeLevelOne: productTypeLevelOne
      }
    })
  },
  
  /**
   * 出租车、品牌约车订单详情
   * @param id 订单ID
   * @param productTypeLevelOne 产品类型
   */
  chBaseOrderFindById: (id, productTypeLevelOne) => {
    return http({
      url: `/chBaseOrder/${id}`,
      data:{
        productTypeLevelOne:productTypeLevelOne
      }
    })
  },
  
  /**
   * 出租车支付
   */
  wxPayUnifiedTaxiOrder: (data) => {
    return http({
      url: `wxPay/unifiedTaxiOrder`,
      method: 'post',
      data: data
    })
  },
  /*
   * 小件快运——订单列表
   * */
  expressOrderFind: (data) => {
    return http({
      url: `/expressOrder/find`,
      data: data
    })
  },
  /*
   * 小件快运——订单详情
   * */
  expressOrderFindDetail: (orderId) => {
    return http({
      url: `/expressOrder/` + orderId
    })
  },
  /*
   * 小件快运——查询小件快运产品
   * */
  expressProductFind: (data) => {
    return http({
      url: `/expressProduct/find`,
      data: data
    })
  },
  /*
   * 小件快运——查询小件快运产品
   * */
  expressProductdeta: (id) => {
    return http({
      url: `/expressProduct/` + id
    })
  },
  /*
   * 小件快运——查询小件快运产品
   * */
  expressCityFind: (data) => {
    return http({
      url: `/expressProduct/findOpenCity`,
      data: data
    })
  },
  /*
   * 小件快运——查询小件快运产品
   * */
  expressCityFetch: (data) => {
    return http({
      url: `/expressProduct/findFetchCity`,
      data: data
    })
  },
  /*
   * 小件快运——下单
   * */
  expressOrderCreate: (data) => {
    return http({
      url: `/expressOrder/create`,
      method: 'post',
      body: true,
      data: data
    })
  },
  /*
   * 小件快运——取消下单
   * */
  expressOrderCancell: (id) => {
    return http({
      url: `/expressOrder/${id}/cancell`
    })
  },
  
  
  /**
   * 根据订单号查询订单的状态——小件快运
   * @param orderId
   */
  expressOrderFindStatus: (orderId) => {
    return http({
      url: '/expressOrder/findStatus',
      data: orderId
    })
  },
  /**
   * 查找租车门店
   */
  rentStoreFind: (city) => {
    return http({
      url: `site/findCarRental`,
      data: city
    })
  },
  /**
   * 查找所有租车
   */
  carRentalFindByCity: (data) => {
    return http({
      url: `carRental/findByCity`,
      method: 'post',
      data: data
    })
  },
  
  /**
   * 查找所有租车
   */
  createCrOrder: (data) => {
    return http({
      url: `crOrder/create`,
      method: 'post',
      body: true,
      data: data
    })
  },
  
  /**
   * 查找所有租车
   */
  shuttleCalPrice: (id, data) => {
    return http({
      url: `/shuttle/${id}/calPrice`,
      data: data
    })
  },
  
  /***新的拼车相关接口***/
  
  /**
   * 根据行政区域获取拼车站点
   * @param code 行政区域code
   */
  carpoolProductGetSites: (code) => {
    return http({
      url: `/carpoolProduct/getSites`,
      data: {
        code: code
      }
    })
  },
  
  /**
   * 根据行政区域获取拼车站点
   * @param id 产品id
   * @param productTypeLevelOne 产品大类
   * @param start 0:出发地  1：目的地
   * @param type 0：A-B  1：B-A
   */
  carpoolProductGetSitesById: (id, productTypeLevelOne, start, type) => {
    return http({
      url: `/carpoolProduct/${id}/getSites`,
      data: {
        productTypeLevelOne: productTypeLevelOne,
        start: start,
        type: type,
      }
    })
  },
  
  /**
   * 拼车产品查询
   */
  carpoolProductFind: (data) => {
    return http({
      url: `/carpoolProduct/find`,
      data: data
    })
  },
  
  /**
   * 拼车产品查询
   * @param productId
   * @param productTypeLevelOne
   * @param type
   */
  carpoolProductFindById: (productId, productTypeLevelOne, type) => {
    return http({
      url: `/carpoolProduct/${productId}/findById`,
      data: {
        productTypeLevelOne: productTypeLevelOne,
        type: type
      }
    })
  },
  
  /**
   * 拼车产品详情
   * @param productId
   * @param productTypeLevelOne
   */
  carpoolProductFindDetail: (productId, productTypeLevelOne) => {
    return http({
      url: `/carpoolProduct/${productId}/findDetail`,
      data: {
        productTypeLevelOne: productTypeLevelOne
      }
    })
  },
  
  
  /**
   * 计算拼车和包车价格
   * @param data
   */
  carpoolOrderCalPrice: (data) => {
    return http({
      url: `/carpoolOrder/calPrice`,
      data: data
    })
  },
  
  /**
   * 生成拼车订单
   * @param orderData
   */
  carpoolOrderCreate: (orderData) => {
    return http({
      url: `/carpoolOrder/create`,
      method: 'post',
      body: true,
      data: orderData
    })
  },
  
  /**
   * 确认上车
   * @param id
   */
  carpoolOrderConfirm: (id) => {
    return http({
      url: `carpoolOrder/${id}/confirm`,
      method: 'post'
    })
  },
  
  /**
   * 取消订单
   * @param id
   */
  carpoolOrderCancel: (id) => {
    return http({
      url: `/carpoolOrder/${id}/cancel`,
      method: 'post'
    })
  },
  
  /**
   * 拼车判断用户选中的出发地是否在接送范围内
   * @param  param[code,latitude,longitude,city,county,siteId]
   */
  carpoolProductInRange: (param) => {
    return http({
      url: `/carpoolProduct/inRange`,
      method: 'post',
      data: {
        code: param.code,
        latitude: param.latitude,
        longitude: param.longitude,
        city: param.city,
        county: param.county,
        siteId: param.siteId
      },
    })
  },
  
  /**
   * 取消订单
   * @param id
   */
  carpoolCancelCharge: (id) => {
    return http({
      url: `/carpoolOrder/${id}/calRefundCharge`,
      method: 'post'
    })
  },
  
  /**
   * 拼车目的地范围判断
   * @param id
   * @param data
   */
  carpoolProductInRangeById: (id, data) => {
    return http({
      url: `/carpoolProduct/${id}/inRange`,
      method: 'post',
      data: data
    })
  },
  
  /**
   * 拼车目的地范围判断
   * @param productTypeLevelOne
   * @param productTypeLevelTwo
   * @param keyword
   */
  citiesTemplateByKeyword: (productTypeLevelOne, productTypeLevelTwo, keyword) => {
    return http({
      url: `/cityStartupRegion/citiesTemplateByKeyword`,
      data: {
        productTypeLevelOne: productTypeLevelOne,
        productTypeLevelTwo: productTypeLevelTwo,
        keyword: keyword,
      }
    })
  },
  
  
  /**
   * 拼车目的地范围判断
   * @param place
   */
  carpoolProductGetCode: (place) => {
    return http({
      url: `carpoolProduct/getCode`,
      data: {
        place: place
      }
    })
  },
  
  /**
   * 拼车目的地范围判断
   * @param city
   */
  carpoolProductHasProduct: (city) => {
    return http({
      url: `carpoolProduct/hasProduct`,
      data: {
        city: city
      }
    })
  },
  
  /**
   * 存储区域范围
   * @param orderData
   */
  countyArea: (orderData) => {
    return http({
      url: `/countyArea/a/create`,
      method: 'post',
      body: true,
      data: orderData
    })
  },
  
  /**
   * 存储区域范围
   * @param code
   */
  countyAreaFind: (code) => {
    return http({
      url: `/countyArea/a/find`,
      data: {
        code: code
      }
    })
  },
  
  /**
   * 获取车辆检测服务类型
   * @returns {{url, token, StoreId}}
   */
  checkCarInsMode: () => {
    return http({
      url: `/carInspectionSetting/checkCarInsMode`
    })
  },
  
  /**
   * 获取车辆检测检测场地下的车辆
   */
  getOrderProductsByStore: (data) => {
    return http({
      url: `/carInspectionProduct/getOrderProductsByStore`,
      data: data
    })
  },
  /**
   * 获取车辆检测检测场地
   */
  findCarInspectionStore: () => {
    return http({
      url: `/subStore/findCarInspectionStore`
    })
  },
  /**
   * 获取车辆检测上门服务的检测大类
   */
  getParentTypesByStore: (data) => {
    return http({
      url: `/carInspectionProduct/getParentTypesByStore`,
      data: data
    })
  },
  /**
   * 获取车辆检测上门服务的检测大类
   */
  getSiteProductByParent: (data) => {
    return http({
      url: `/carInspectionProduct/getSiteProductByParent`,
      data: data
    })
  },
  /**
   * 获取车辆年检服务的价格
   * @param data
   */
  getInspectionOrderPrice: (data) => {
    return http({
      url: `/carInspectionOrder/getTotalPrice`,
      method: 'post',
      data: data
    })
  },
  /**
   * 保存车辆年检用户信息
   */
  setCarInspectionOwnerInfo: (data) => {
    return http({
      url: `/user/setCarInspectionOwnerInfo`,
      method: 'post',
      body: true,
      data: data
    })
  },
  /**
   * 获取车辆年检用户信息
   */
  getCarInspectionOwnerInfo: () => {
    return http({
      url: `/user/getCarInspectionOwnerInfo`
    })
  },
  /**
   * 判断用户是否可以下单
   */
  checkUserCanOrder: () => {
    return http({
      url: `/carInspectionOrder/checkUserCanOrder`
    })
  },
  /**
   * find历史订单
   */
  inspectionOrderFind: (data) => {
    return http({
      url: `/carInspectionOrder/find`,
      data: data
    })
  },
  /**
   * 车辆年检创建订单
   */
  createInspectionOrder: (data) => {
    return http({
      url: `/carInspectionOrder/create`,
      method: 'post',
      body: true,
      data: data
    })
  },
  /**
   * 根据id查询车辆年检订单信息
   */
  getInspectionOrderById: (id) => {
    return http({
      url: `/carInspectionOrder/${id}`
    })
  },
  /**
   * 取消车辆年检订单
   */
  cancelInspection: (id) => {
    return http({
      url: `/carInspectionOrder/${id}/cancel`,
      method: 'post'
    })
  },
  /**
   * 检测车辆年检预约服务时间是否合理
   */
  checkReserveTimeValid: (data) => {
    return http({
      url: `/carInspectionOrder/checkReserveTimeValid`,
      data: data
    })
  },
  /**
   * 查询车辆年检状态时间线
   */
  findInspectionTimeAxis: (data) => {
    return http({
      url: `/carInspectionOrderHistory/findByOrderId`,
      data: data
    })
  },
  /**
   * 前端轮询获取订单状态是否被改变
   */
  inspectionOrderPolling: (data) => {
    return http({
      url: `/carInspectionOrder/polling`,
      data: data
    })
  },
  /**
   * 前端轮询获取订单状态是否被改变
   */
  carInspectionGetMaterial: (data) => {
    return http({
      url: `/carInspectionOrder/getMaterial`,
      data: data
    })
  },
  
  /**
   * 前端轮询获取订单状态是否被改变
   * [currentLon, currentLat, limit, direct线路方向 OUT:往程，BACK:返程]
   */
  publicBusLineFindNear: (data) => {
    return http({
      url: `/publicBusLine/findNear`,
      data: data
    })
  },
  
  /**
   * 查询经过某个站点的城市公交线路信息
   * @param siteId 站点id
   */
  findCityBusBySite: (siteId) => {
    return http({
      url: `/publicBusLine/findCityBusBySite`,
      data: {
        siteId: siteId
      }
    })
  },
  
  /**
   * 搜索公交线路
   * @param key: 搜索关键字
   */
  publicBusLineFindBusLine: (key) => {
    return http({
      url: `/publicBusLine/findBusLine`,
      data: {
        key: key
      }
    })
  },
  
  /**
   * 查询某个线路的详情
   * @param id
   * @param data [currentLon, currentLat, direct]
   */
  publicBusLineFindDetail: (id, data) => {
    return http({
      url: `/publicBusLine/${id}/findDetail`,
      data: data
    })
  },
  
  /**
   * 查询某个线路的详情
   * @param id 线路ID
   * @param data [currentLong, currentLat, direct, productTypeLevelTwo]
   */
  refreshDetailBus: (id, data) => {
    return http({
      url: `/publicBusLine/${id}/refreshDetailBus`,
      data: data
    })
  },
  
  /**
   * 查询某个线路的详情
   * @param id 线路ID
   * @param data [lineSegmentId 线路段ID; direct 线路方向 OUT:往程，BACK:返程; productTypeLevelTwo 产品类别]
   */
  findSegmentNearBusLocation: (id, data) => {
    return http({
      url: `/publicBusLine/${id}/findSegmentNearBusLocation`,
      data: data
    })
  },
  
  /**
   * 查询地图上某个线路详情
   * @param id
   * @param data [nearestLineSegmentId, currentLat, currentLon, direct, productTypeLevelTwo]
   */
  findMapDetail: (id, data) => {
    return http({
      url: `/publicBusLine/${id}/findMapDetail`,
      data: data
    })
  },
  
  /**
   * 查询地图上某个线路详情
   * @param id
   * @param data [currentLon, currentLat, direct, productTypeLevelTwo]
   */
  refreshMapBus: (id, data) => {
    return http({
      url: `/publicBusLine/${id}/refreshMapBus`,
      data: data
    })
  },
  
  /**
   * 线路搜索
   * @param data [startLong, startLat, endLong, endLat]
   */
  findBusRoutPlan: (data) => {
    return http({
      url: `/publicBusLine/findBusRoutPlan`,
      data: data
    })
  },
  
  /**
   * 线路搜索
   * @param id 线路ID
   * @param data [alineSegmentId:上车线路段ID, blineSegmentId:下车线路段ID, direct:线路方向 OUT:往程，BACK:返程]
   */
  findBusRoutPlanInfo: (id, data) => {
    return http({
      url: `/publicBusLine/${id}/findBusRoutPlanInfo`,
      data: data
    })
  },
  
  /**
   * 线路搜索
   * @param data [refreshLineId:刷新线路id, refreshSiteId:刷新站点id, direct:线路方向 OUT:往程，BACK:返程, currentLon: 当前经度, currentLat: 当前纬度, productTypeLevelTwo: 产品类别]
   */
  freshAllLineInfo: (data) => {
    return http({
      url: `/publicBusLine/freshAllLineInfo`,
      data: data
    })
  },
  
  /**
   * 查询是否有新的线路调整消息
   */
  systemNoticeHasNewNotice: () => {
    return http({
      url: `/systemNotice/hasNewNotice`
    })
  },
  
  /**
   * 查询公交线路调整通知
   */
  systemNoticeFindBusNotice: (data) => {
    return http({
      url: `/systemNotice/findBusNotice`,
      data: data
    })
  },
  
  /**
   * 查询公交线路调整通知
   */
  publicBusChangeNotice: (businessId) => {
    return http({
      url: `/publicBusChangeNotice/${businessId}`,
    })
  },
  
  /**
   * 查询公交线路调整通知
   */
  uptBusNoticeToRead: (id) => {
    return http({
      method: 'post',
      url: `/systemNotice/${id}/uptBusNoticeToRead`,
    })
  },
  
  /**
   * 查询连接小店列表
   * @param keyword
   */
  goodsTypeAhead: (keyword) => {
    return http({
      url: `/goods/typeAhead`,
      data: {
        keyword: keyword
      }
    })
  },
  
  /**
   * 查询连接小店列表
   */
  goodsClassFindAll: () => {
    return http({
      url: `/goodsClass/findAll`,
    })
  },
  
  /**
   * 查询连接小店列表
   */
  findShopList: (data) => {
    return http({
      url: `/goods/find`,
      data: data
    })
  },
  
  /**
   * 通过id查询连接小店详细信息
   */
  findShopDetailById: (id) => {
    return http({
      url: `/goods/${id}`
    })
  },
  
  /**
   *  获取商品价格
   */
  getShopPrice: (data) => {
    return http({
      method: 'post',
      url: `/goodsOrder/calPrice`,
      data: data
    })
  },
  
  /**
   *  获取商品价格
   */
  getShopInventory: (data) => {
    return http({
      method: 'post',
      url: `/goodsOrder/getInventory`,
      data: data
    })
  },
  
  /**
   *  创建商品订单
   */
  createShopOrder: (data) => {
    return http({
      method: 'post',
      url: `/goodsOrder/create`,
      data: data,
      body: true
    })
  },
  
  /**
   *  取消商品订单
   */
  cancelShopOrder: (id) => {
    return http({
      method: 'post',
      url: `/goodsOrder/${id}/cancel`,
    })
  },
  
  /**
   *  商品订单完成
   */
  consumeShopOrder: (id) => {
    return http({
      method: 'post',
      url: `/goodsOrder/${id}/consume`,
    })
  },

  /**
   *  获取全名营销设置
   */
  getMarketSet: () => {
    return http({
      method: 'get',
      url: `/marketSetting/getMarketSet`,
    })
  },

  /**
   *  获取全民营销概况
   */
  getMarketInfo: () => {
    return http({
      method: 'get',
      url: `/marketer/getMarketInfo`,
    })
  },

  /**
   *  申请成为营销员
   */
  marketApply: () => {
    return http({
      method: 'get',
      url: `/marketer/apply`,
    })
  },

  /**
   *  累计关注，注册，产品等查询
   */
  marketerCustomerFind: (data) => {
    return http({
      method: 'get',
      url: `/marketerCustomer/find`,
      data: data
    })
  },

  /**
   *  微信钱包授权
   */
  marketerGrant: (data) => {
    return http({
      method: 'get',
      url: `/marketer/grant`,
      data: data,
    })
  },

  /**
   *  获取营销产品分享url
   */
  marketProShareUrl: (data) => {
    return http({
      method: 'get',
      url: `/marketer/getProductShareUrl`,
      data: data,
    })
  },

  /**
   *  获取营销产品累计订单
   */
  marketOrderFind: (data) => {
    return http({
      method: 'get',
      url: `/order/findMarketOrder`,
      data: data,
    })
  },

  /**
   *  获取营销产品关注分享二维码
   */
  marketFocusQrcode: (data) => {
    return http({
      method: 'get',
      url: `/store/getStoreQrCode`
    })
  },

  /**
   *  结算记录查询
   */
  marketSettleFind: (data) => {
    return http({
      method: 'get',
      url: `/marketSettle/find`,
      data: data
    })
  },

  /**
   *  营销提现
   */
  marketSettle: (data) => {
    return http({
      method: 'post',
      url: `/marketSettle/applySettle`,
      data: data
    })
  },

  /**
   *  获取产品二维码
   */
  getMarketShareQrCode: (data) => {
    return http({
      method: 'get',
      url: `/marketer/a/getShareQrCode`,
      data: data
    })
  },
  /**
   *  获取企业电子发票设置
   */
  findEleInvoiceSetting: (storeId) => {
    return http({
      method: 'post',
      url: `/eleInvoiceSetting/${storeId}/provideInvoice`,
    })
  },

  /**
   *  查询未开票的订单列表
   */
  findUninvoicedOrder: (data) => {
    return http({
      method: 'get',
      url: `/order/findUninvoicedOrder`,
      data:data
    })
  },

  /**
   *  电子发票--乘客开票
   */
  createEleInvoice: (data) => {
    return http({
      method: 'post',
      url: `/eleInvoice/create`,
      data: data,
      body: true
    })
  },

  /**
   *  电子发票--开票历史记录
   */
  findEleInvoice: (data) => {
    return http({
      method: 'get',
      url: `/eleInvoice/find`,
      data:data
    })
  },

  /**
   *  电子发票--发票详情
   */
  findEleInvoiceById: (id) => {
    return http({
      method: 'get',
      url: `/eleInvoice/${id}`
    })
  },

  /**
   *  电子发票--重新发送电子邮件
   */
  resendEleInvoice: (data) => {
    return http({
      method: 'post',
      url: `/eleInvoice/resend`,
      data:data
    })
  },

}
