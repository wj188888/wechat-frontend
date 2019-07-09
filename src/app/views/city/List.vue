<template>
  <main-box :title="title">
    <datePagination :start-time="searchKeys.startTime" @searchByDate="searchByDate">
      <group class="datetime-x">
        <calendar
          title="出行时间"
          :weeks-list="calendar.weeksList"
          :disable-past="calendar.disablePast"
          v-model="searchKeys.startTime">
        </calendar>
      </group>
    </datePagination>
    <div class="ticket-scroller">
      <scroll ref="scroll"
              :pullUpLoad="true"
              @pullingUp="onPullingUp">
        <div class="scroller-box">
          <special-ticket :title="CITY_SPECIAL_BUS" :skus="specialTicketSku" @jumpToPage="jumpToAppointBus" @showDiscountDialog="showDiscountDialog"></special-ticket>
          <express-ticket :title="CITY_EXPRESS_BUS" :skus="citySkus" @jumpToPage="jumpToBusDetail" @showDiscountDialog="showDiscountDialog"></express-ticket>
          <a class="button button-empty-white button-no-radius button-more line line-x-t" v-if="showMoreCitySkuBtn" @click="showMoreCitySkus">查看更多快车</a>
          <carpooling-ticket :title="CITY_CAR_POOL_BUS" :carpool-product="carpoolProduct" product-type-level-one="CITY_BUS" product-type-level-two="CITY_CAR_POOL_BUS"></carpooling-ticket>
          <station-ticket :title="STATION_BUS" :skus="stationSkus" @jumpToPage="jumpToSchBusDetail" @showDiscountDialog="showDiscountDialog"></station-ticket>
          <no-result :class="{'has-recommend': recommendSkus.length}" :show="showNoResult" :text="noResultText"></no-result>
          <recommend-ticket title="线路推荐" :skus="recommendSkus" @jumpToPage="jumpToBusDetail" @showDiscountDialog="showDiscountDialog" @showMoreRecommend="showMoreRecommend"></recommend-ticket>
        </div>
      </scroll>
    </div>
    <div slot="footer">
      <discount-dialog :show-discount="showDiscount" :discount-sku="discountSku" @hideDiscountDialog="hideDiscountDialog"></discount-dialog>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index'
  import DatePagination from 'appComponents/datePagination/index'
  import Scroll from 'components/betterScroll/scroll/scroll'
  import SpecialTicket from 'appComponents/searchListTicket/specialTicket'
  import ExpressTicket from 'appComponents/searchListTicket/expressTicket'
  import RecommendTicket from 'appComponents/searchListTicket/recommendTicket'
  import CarpoolingTicket from 'appComponents/searchListTicket/carpoolingTicket'
  import StationTicket from 'appComponents/searchListTicket/stationTicket'
  import DiscountDialog from 'appComponents/dialog/discountDialog'
  import NoResult from 'appComponents/noResult/index'

  import { Group, Calendar } from 'vux'
  import checkLogin from 'mixins/checkLogin'

  export default {
    components: {
      MainBox,
      DatePagination,
      Group,
      Calendar,
      Scroll,
      SpecialTicket,
      ExpressTicket,
      RecommendTicket,
      CarpoolingTicket,
      StationTicket,
      NoResult,
      DiscountDialog,
    },
    mixins: [checkLogin],
    data () {
      return {
        title: '',
        pageRouter: this.$router.name,
        pageId: '',
        productTypeLevelOne: 'CITY_BUS',
        CITY_SPECIAL_BUS: TOOL.CITY_SPECIAL_BUS,
        CITY_EXPRESS_BUS: TOOL.CITY_EXPRESS_BUS,
        STATION_BUS: TOOL.STATION_BUS,
        CITY_CAR_POOL_BUS: TOOL.CITY_CAR_POOL_BUS,
        calendar: {
          weeksList: ['日', '一', '二', '三', '四', '五', '六 '],
          disablePast: true
        },
        searchKeys: {
          type: 0, // 有城际班车则城际班车翻页, 无城际班车则城际快车翻页 0.城际快车、城际班车都返回；1.城际快车；2.城际班车
          startPlace: '',
          endPlace: '',
          startTime: '',
          pageNo: 0,
          pageSize: TOOL.pageSize
        },
        specialTicketSku: '',
        citySkus: [],
        recommendSkus:[],
        showMoreCitySkuBtn: false, // 当无城际班车或有城际班车且城际快车数量大于1显示
        stationSkus: [],
        carpoolProduct:'',
        totalPage: '',
        showNoResult: false,
        showDiscount: false,
        discountSku:'',
        noResultText: '',
      }
    },
    computed: {
      prevDisabled () {
        return TOOL.dateCompare(this.searchKeys.startTime) > 0
      },
    },
    watch: {
      'searchKeys.startTime' (newVal, oldVal) {
        if(newVal && oldVal){
          this.searchByDate()
        }
      },
      $route () {
        this.initialize()
      }
    },
    mounted () {
      this.initialize()
    },
    methods: {
      initialize () {
        this.searchKeys.startPlace = this.$route.query.startPlace
        this.searchKeys.endPlace = this.$route.query.endPlace
        this.searchKeys.startTime = this.$route.query.startTime
        this.title = this.searchKeys.startPlace + ' - ' + this.searchKeys.endPlace
        this.pageId = +this.$route.query.pageId || 1
        
        // 重置翻页页数和类型
        this.searchKeys.pageNo = 0
        this.onPullingUp()
      },
  
      cityProductFind () {
        return api.cityProductFind(this.searchKeys).then(res=>{
          return Promise.resolve(res.data);
        })
      },
  
      citySkuFind () {
        return api.citySkuFind(this.searchKeys).then(res=>{
          return Promise.resolve(res.data);
        })
      },
  
      carpoolProductFind () {
        return api.carpoolProductFind({
          productTypeLevelOne:this.productTypeLevelOne,
          productTypeLevelTwo: 'CITY_CAR_POOL_BUS',
          startPlace: this.searchKeys.startPlace,
          endPlace: this.searchKeys.endPlace
        }).then(res=>{
          return Promise.resolve(res.data);
        })
      },
  
      getAllProduct () {
        return Promise.all([
          api.cityProductFind(this.searchKeys),
          api.citySkuFind(this.searchKeys),
          api.carpoolProductFind({
            productTypeLevelOne:this.productTypeLevelOne,
            productTypeLevelTwo: 'CITY_CAR_POOL_BUS',
            startPlace: this.searchKeys.startPlace,
            endPlace: this.searchKeys.endPlace
          })
        ]);
      },
      
      async loadPageList () {
        this.$store.commit('UPDATE_LOADING', true)
        if(this.searchKeys.pageNo && this.searchKeys.pageNo >= this.totalPage){
          this.$store.commit('UPDATE_LOADING', false)
          this.$refs.scroll.forceUpdate()
          return
        }
        let specialResult, esResult, carpoolResult;
        switch (this.pageId) {
          case 1: //全部
            this.searchKeys.type = 0
            let allProduct = await this.getAllProduct()
            specialResult = allProduct[0].data
            esResult = allProduct[1].data
            carpoolResult = allProduct[2].data
            break;
          case 1001: // 快车
            this.searchKeys.type = 1
            esResult = await this.citySkuFind()
            break;
          case 1002: // 专车
            specialResult = await this.cityProductFind()
            break;
          case 1003: // 班车
            this.searchKeys.type = 2
            esResult = await this.citySkuFind()
            break;
          default: // 拼车
            carpoolResult = await this.carpoolProductFind()
        }
  
        if(specialResult && specialResult.resultCode === '0'){
          this.specialTicketSku = specialResult.resultData
        }
  
        if(carpoolResult && carpoolResult.resultCode === '0'){
          this.carpoolProduct = carpoolResult.resultData
        }
        if(esResult && esResult.resultCode === '0'){
          let esResultData = esResult.resultData
          
          if(esResultData.citySkus){
            this.citySkus = this.citySkus.concat(esResultData.citySkus.content)
          }
          if(esResultData.recommendSkus){
            this.recommendSkus = esResultData.recommendSkus
          }else{
            this.recommendSkus = []
          }
          if(esResultData.stationSkus){
            this.stationSkus = this.stationSkus.concat(esResultData.stationSkus.content)
          }
          
          //有班车或拼车则快车翻页
          if (this.stationSkus.length === 0 && !this.carpoolProduct) {
            if(esResultData.citySkus){
              this.totalPage = esResultData.citySkus.totalPages
            }
          } else {
            if (this.citySkus.length > TOOL.showSkuLen) {
              this.citySkus = this.citySkus.splice(0, TOOL.showSkuLen);
              this.showMoreCitySkuBtn = true
            }
            if(this.stationSkus.length !== 0){
              if(esResultData.stationSkus){
                this.totalPage = esResultData.stationSkus.totalPages
              }
            }
          }
        }
        
        if (this.pageId === 1 && this.citySkus.length === 0 && this.stationSkus.length === 0 && !this.carpoolProduct) {
          this.showNoResult = true
          if(!this.specialTicketSku){
            if(this.recommendSkus.length){
              this.noResultText = '今天的车跑光了耶，看看线路推荐吧'
            }else{
              this.noResultText = '该时段的车都被预定完了耶，换个试试吧~'
            }
          }else{
            if(this.recommendSkus.length){
              this.noResultText = '今天的班次跑光了耶，看看线路推荐吧'
            }else{
              this.noResultText = '今天的车跑光了耶，试试专车吧'
            }
          }
        }else{
          if((this.pageId === 1001 && this.citySkus.length === 0) || (this.pageId === 1002 && !this.specialTicketSku) || (this.pageId === 1003 && this.stationSkus.length === 0)){
            this.showNoResult = true
            if(this.pageId === 1001 && this.recommendSkus.length){
              this.noResultText = '今天的班次跑光了耶，看看线路推荐吧'
            }else{
              this.noResultText = '该时段的车都被预定完了耶，换个试试吧~'
            }
          }else{
            this.showNoResult = false
            this.noResultText = ''
          }
        }
        this.$store.commit('UPDATE_LOADING', false)
        
        setTimeout(() => {
          this.$refs.scroll.forceUpdate(true)
        }, 20)
        
        if(this.searchKeys.pageNo === 0 || this.searchKeys.pageNo < this.totalPage){
          this.searchKeys.pageNo++
        }
      },
  
      /**
       * 下拉刷新
       */
      onPullingUp () {
        if(this.searchKeys.pageNo === 0){
          this.citySkus = []
          this.stationSkus = []
          this.loadPageList()
          this.$refs.scroll.scrollTo(0, 0)
          
        }else{
          setTimeout(()=>{
            this.loadPageList()
          }, 1000)
        }
      },

      /**
       * 跳转显示更多快车页面
       */
      showMoreCitySkus () {
        this.searchKeys.startTime = TOOL.newGetDate({date: this.searchKeys.startTime, type: 'holeDate'})
        this.$router.push({
          name: 'moreCitySku',
          query: {
            startPlace: this.searchKeys.startPlace,
            endPlace: this.searchKeys.endPlace,
            startTime: this.searchKeys.startTime
          }
        })
      },

      /**
       * 优惠弹窗
       */
      showDiscountDialog (sku) {
        this.discountSku = sku
        this.showDiscount = true
      },

      hideDiscountDialog () {
        this.showDiscount = false
      },
  
      showMoreRecommend(sku) {
        this.freshRoute(sku.startupTime)
      },
      
      /**
       * 日期前一页后一页
       * @param type
       */
      searchByDate (type) {
        if (type === 'prev' && TOOL.dateCompare(this.searchKeys.startTime) <= 0) {
          return false
        }
        if (type === 'prev') {
          this.searchKeys.startTime = TOOL.changeDate(this.searchKeys.startTime, 'd', -1)
        } else if (type === 'next') {
          this.searchKeys.startTime = TOOL.changeDate(this.searchKeys.startTime, 'd', 1)
        }
        console.log('timeChange')
        this.freshRoute()
      },

      freshRoute (dateTime) {
        let startTime = dateTime || this.searchKeys.startTime
        this.searchKeys.startTime = TOOL.newGetDate({date: startTime, type: 'holeDate'})
        this.$router.replace({
          name: 'list',
          query: {
            pageId: this.pageId,
            startPlace: this.searchKeys.startPlace,
            endPlace: this.searchKeys.endPlace,
            startTime: this.searchKeys.startTime
          }
        });
      },
      
      /**
       * 清除专车本地订单数据
       */
      deleteAppointBusForm () {
        appStorage.remove('appointBus')
      },

      /**
       * 跳转专车下单页面
       */
      jumpToAppointBus () {
        if (!this.checkIsLogin()) return
        this.deleteAppointBusForm()
        this.$router.push({
          name: 'appointBus',
          query: {
            productId: this.specialTicketSku.id,
            startPlace: this.searchKeys.startPlace,
            endPlace: this.searchKeys.endPlace
          }
        })
      },

      /**
       * 清除快车本地订单数据
       */
      deleteBusDetailForm () {
        appStorage.remove('busDetail')
        appStorage.remove('feederOrder')
        appStorage.remove('feeder')
      },

      /**
       * 跳转快车下单页面
       * 车票卖完提醒
       */
      jumpToBusDetail (skuId, price, availableSeats) {
        if (availableSeats === 0) {
          this.$store.dispatch('showError', '该班次车票卖完了，试试其它班次吧');
          return
        }
        if (!this.checkIsLogin()) return
        this.deleteBusDetailForm()
        this.$router.push({
          name: 'busDetail',
          query: {
            skuId: skuId
          }
        })
      },

      /**
       * 清除班车本地订单数据
       */
      deleteSchBusDetailForm () {
        appStorage.remove('schBusDetail')
        appStorage.remove('feederOrder')
        appStorage.remove('feeder')
      },

      /**
       * 跳转班车下单页面
       * 车票卖完提醒，数据需即时从车站数据查询
       */
      jumpToSchBusDetail (skuId) {
        if (!this.checkIsLogin()) return
        this.$store.commit('UPDATE_LOADING', true)
        api.schBusDetailById(skuId).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            if (data.resultData.availableSeats === 0) {
              this.$store.dispatch('showError', '该班次车票卖完了，试试其它班次吧');
            }else{
              this.deleteSchBusDetailForm()
              let localData = {};
              localData.ticketInfo = data.resultData.stationSku
              localData.isAfterSale = data.resultData.isAfterSale
              localData.serviceTypeDTO = data.resultData.serviceInfoDTOs
              localData.needServiceFee = data.resultData.needServiceFee
              appStorage.set('schBusDetail', JSON.stringify(localData))
              this.$router.push({
                name: 'schBusDetail',
                query: {
                  skuId: skuId
                }
              })
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },


    }
  }
</script>
<style>
  .has-recommend{
    margin:60px 0 170px;
  }
</style>
<style scoped>
  .button-more{
    font-size:28px;
  }
</style>
