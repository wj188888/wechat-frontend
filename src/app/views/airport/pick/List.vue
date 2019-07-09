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
    <div class="mar20">
      <product-top-nav ctg="AIRPORT_BUS" :active="0" :nav2router="jumpToAirportSendList"></product-top-nav>
    </div>
    <div class="ticket-scroller airport-scroller" v-show="!showNoResult">
      <scroll ref="scroll"
              :pullUpLoad="true"
              @pullingUp="onPullingUp">
        <div class="scroller-box">
          <special-ticket :title="AIRPORT_SPECIAL_BUS" :skus="airportProductLists" @jumpToPage="jumpToPick" @showDiscountDialog="showDiscountDialog"></special-ticket>
          <express-ticket :title="AIRPORT_EXPRESS_BUS" :skus="airTicketLists" @jumpToPage="jumpToBusDetail" @showDiscountDialog="showDiscountDialog"></express-ticket>
        </div>
      </scroll>
    </div>
    <no-result :show="showNoResult" :text="noResultText"></no-result>
    <div slot="footer">
      <discount-dialog :show-discount="showDiscount" :discount-sku="discountSku" @hideDiscountDialog="hideDiscountDialog"></discount-dialog>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index'
  import DatePagination from 'appComponents/datePagination/index'
  import Scroll from 'components/betterScroll/scroll/scroll'
  import ProductTopNav from 'appComponents/productTopNav/index'
  import SpecialTicket from 'appComponents/searchListTicket/specialTicket'
  import ExpressTicket from 'appComponents/searchListTicket/expressTicket'
  import DiscountDialog from 'appComponents/dialog/discountDialog'
  import NoResult from 'appComponents/noResult/index'
  import {Group, Calendar} from 'vux'
  import checkLogin from 'mixins/checkLogin'

  export default {
    components: {
      MainBox,
      DatePagination,
      Scroll,
      ProductTopNav,
      Group,
      Calendar,
      SpecialTicket,
      ExpressTicket,
      DiscountDialog,
      NoResult,
    },
    mixins: [checkLogin],
    data () {
      return {
        title: '',
        pageRouter: this.$router.name,
        pageId:'',
        AIRPORT_SPECIAL_BUS: TOOL.AIRPORT_SPECIAL_BUS,
        AIRPORT_EXPRESS_BUS: TOOL.AIRPORT_EXPRESS_BUS,
        calendar:{
          weeksList: ['日', '一', '二', '三', '四', '五', '六 '],
          disablePast:true
        },
        totalPage: '',
        searchKeys: {
          startPlace:'',
          endPlace:'',
          startTime:'',
          airportType: 0,
          pageNo: 0,
          pageSize: TOOL.pageSize
        },
        airportCode:'',
        airportProductLists:'',
        airTicketLists:[],
        showNoResult: false,
        showDiscount: false,
        discountSku:''
      }
    },
    computed:{
      prevDisabled(){
        return TOOL.dateCompare(this.searchKeys.startTime) > 0
      },
      noResultText () {
        if(!this.airportProductLists){
          return TOOL.noDataTips.airportBusTody
        }else{
          return TOOL.noDataTips.airportBus
        }
      }
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
        this.airportCode = this.$route.query.airportCode
        this.searchKeys.startPlace = this.$route.query.startPlace
        this.searchKeys.endPlace = this.$route.query.endPlace
        this.searchKeys.startTime = this.$route.query.startTime
        this.searchKeys.pageNo = 0
        this.title = this.searchKeys.startPlace + ' - ' + this.searchKeys.endPlace

        this.pageId = +this.$route.query.pageId || 3
        switch (this.pageId) {
          case 3:
            this.airportProductFind()
            this.onPullingUp()
            break;
          case 3001:
            this.onPullingUp()
            break;
          default: //3002
            this.airportProductFind()
        }

      },

      /**
       * 机场专线包车查询
       */
      airportProductFind () {
        this.$store.commit('UPDATE_LOADING', true)
        api.airportProductFind(this.searchKeys).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if(data.resultCode === '0'){
            this.airportProductLists = data.resultData
          }else{
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /**
       * 下拉刷新
       */
      onPullingUp () {
        if(this.searchKeys.pageNo === 0){
          this.airTicketLists = []
          this.loadPageList()
          this.$refs.scroll.scrollTo(0, 0)
        }else{
          setTimeout(()=>{
            this.loadPageList()
          }, 1000)
        }
      },
      
      loadPageList () {
        if(this.searchKeys.pageNo && this.searchKeys.pageNo >= this.totalPage){
          this.$refs.scroll.forceUpdate()
          return
        }
        api.airportSkuFind(this.searchKeys).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.totalPage = data.resultData.totalPages
            this.airTicketLists = this.airTicketLists.concat(data.resultData.content)
            this.showNoResult = this.airTicketLists.length === 0
            setTimeout(() => {
              if(this.$refs.scroll){
                this.$refs.scroll.forceUpdate(true)
              }
            }, 20)
            if(this.searchKeys.pageNo === 0 || this.searchKeys.pageNo < this.totalPage){
              this.searchKeys.pageNo++
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
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

      /**
       * 日期前一页后一页
       * @param type
       */
      searchByDate (type) {
        if(type === 'prev' && TOOL.dateCompare(this.searchKeys.startTime) <= 0){
          return false;
        }
        if(type === 'prev'){
          this.searchKeys.startTime = TOOL.changeDate(this.searchKeys.startTime, 'd', -1)
        }else if(type === 'next'){
          this.searchKeys.startTime = TOOL.changeDate(this.searchKeys.startTime, 'd', 1)
        }
        this.searchKeys.startTime = TOOL.newGetDate({date: this.searchKeys.startTime, type: 'holeDate'})
        this.$router.replace({
          name:'airportPickList',
          query:{
            pageId:this.pageId,
            startPlace: this.searchKeys.startPlace,
            endPlace: this.searchKeys.endPlace,
            startTime: this.searchKeys.startTime,
            airportCode: this.airportCode
          }
        });
      },

      /**
       * 清除机场线路订单数据
       */
      deleteAirDetailForm () {
        appStorage.remove('airportTicket')
        appStorage.remove('feederOrder')
        appStorage.remove('feeder')
      },

      /**
       * 清除机场包车订单数据
       */
      deletePickForm () {
        appStorage.remove('airportPickCustom')
      },

      jumpToAirportSendList () {
        this.$router.replace({
          name:'airportSendList',
          query: {
            pageId: this.pageId,
            startPlace: this.searchKeys.endPlace,
            endPlace: this.searchKeys.startPlace,
            startTime: this.searchKeys.startTime,
            airportCode: this.airportCode
          }
        })
      },

      /**
       * 跳转机场包车
       */
      jumpToPick () {
        if(!this.checkIsLogin()) return
        this.deletePickForm()
        this.$router.push({
          name:'airportPickCustom',
          query: {
            productId: this.airportProductLists.id,
            startPlace: this.searchKeys.startPlace,
            endPlace: this.searchKeys.endPlace,
            airportCode: this.airportCode
          }
        })
      },

      /**
       * 车票卖完提醒
       */
      jumpToBusDetail (skuId, price, availableSeats) {
        if(availableSeats === 0){
          this.$store.dispatch('showError', '该班次车票卖完了，试试其它班次吧');
          return
        }
        if(!this.checkIsLogin()) return
        this.deleteAirDetailForm()
        this.$router.push({
          name: 'airportTicket',
          query: {
            skuId: skuId
          }
        })
      }

    }
  }
</script>
