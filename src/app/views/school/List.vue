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
          <special-ticket :title="SCHOOL_SPECIAL_BUS" :skus="specialTicketSku" @jumpToPage="jumpToAppointBus" @showDiscountDialog="showDiscountDialog"></special-ticket>
          <express-ticket :title="SCHOOL_EXPRESS_BUS" :skus="expressSkus" @jumpToPage="jumpToBusDetail" @showDiscountDialog="showDiscountDialog"></express-ticket>
          <no-result :show="showNoResult" :text="noResultText"></no-result>
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
      NoResult,
      DiscountDialog,
    },
    mixins: [checkLogin],
    data () {
      return {
        title: '',
        pageRouter: this.$router.name,
        pageId: '',
        productTypeLevelOne: 'SCHOOL_BUS',
        SCHOOL_SPECIAL_BUS: TOOL.SCHOOL_SPECIAL_BUS,
        SCHOOL_EXPRESS_BUS: TOOL.SCHOOL_EXPRESS_BUS,
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
        expressSkus: [],
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
        this.pageId = +this.$route.query.pageId || 5
        
        // 重置翻页页数和类型
        this.searchKeys.pageNo = 0
        this.onPullingUp()
      },
  
      schoolProductFind () {
        return api.schoolProductFind(this.searchKeys).then(res=>{
          return Promise.resolve(res.data);
        })
      },
  
      schoolSkuFind () {
        return api.schoolSkuFind(this.searchKeys).then(res=>{
          return Promise.resolve(res.data);
        })
      },
      
      getAllProduct () {
        return Promise.all([
          api.schoolProductFind(this.searchKeys),
          api.schoolSkuFind(this.searchKeys)
        ]);
      },
  
      async loadPageList () {
        if(this.searchKeys.pageNo && this.searchKeys.pageNo >= this.totalPage){
          this.$refs.scroll.forceUpdate()
          return
        }
        let specialResult, esResult;
        switch (this.pageId) {
          case 5: //全部
            this.searchKeys.type = 0
            let allProduct = await this.getAllProduct()
            specialResult = allProduct[0].data
            esResult = allProduct[1].data
            break;
          case 5002: // 专车
            specialResult = await this.schoolProductFind()
            break;
          default: // 快车 5003
            this.searchKeys.type = 1
            esResult = await this.schoolSkuFind()
        }
    
        if(specialResult.resultCode === '0'){
          this.specialTicketSku = specialResult.resultData
        }
    
        let esResultData = esResult.resultData
        if(esResult.resultCode === '0'){
          this.expressSkus = esResultData.schoolSkus && this.expressSkus.concat(esResultData.schoolSkus.content)
          this.totalPage = esResultData.schoolSkus && esResultData.schoolSkus.totalPages
        }
    
        if (this.pageId === 5 && this.expressSkus.length === 0) {
          this.showNoResult = true
          if(!this.specialTicketSku){
            this.noResultText = '该时段的车都被预定完了耶，换个试试吧~'
          }else{
            this.noResultText = '今天的车跑光了耶，试试专车吧'
          }
        }else{
          if((this.pageId === 5002 && !this.specialTicketSku) || (this.pageId === 5003 && this.expressSkus.length === 0)){
            this.showNoResult = true
            this.noResultText = '该时段的车都被预定完了耶，换个试试吧~'
          }else{
            this.showNoResult = false
            this.noResultText = ''
          }
        }
        setTimeout(() => {
          if(this.$refs.scroll){
            this.$refs.scroll.forceUpdate(true)
          }
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
          this.expressSkus = []
          this.loadPageList()
          this.$refs.scroll.scrollTo(0, 0)
        }else{
          setTimeout(()=>{
            this.loadPageList()
          }, 1000)
        }
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
        if (type === 'prev' && TOOL.dateCompare(this.searchKeys.startTime) <= 0) {
          return false
        }
        if (type === 'prev') {
          this.searchKeys.startTime = TOOL.changeDate(this.searchKeys.startTime, 'd', -1)
        } else if (type === 'next') {
          this.searchKeys.startTime = TOOL.changeDate(this.searchKeys.startTime, 'd', 1)
        }
        this.searchKeys.startTime = TOOL.newGetDate({date: this.searchKeys.startTime, type: 'holeDate'})
        this.$router.replace({
          name: 'schoolList',
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
        appStorage.remove('schoolBusSpecial')
      },

      /**
       * 跳转专车下单页面
       */
      jumpToAppointBus () {
        if (!this.checkIsLogin()) return
        this.deleteAppointBusForm()
        this.$router.push({
          name: 'schoolBusSpecial',
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
        appStorage.remove('schoolBusExpress')
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
          name: 'schoolBusExpress',
          query: {
            skuId: skuId
          }
        })
      },

      /**
       * 跳转城际拼车列表
       * 车票卖完提醒
       */
      jumpToCityCarpoolList () {
        this.$router.push({
          name: 'schoolCarpoolList',
          query: {
            startPlace: this.searchKeys.startPlace,
            endPlace: this.searchKeys.endPlace,
            startTime: this.searchKeys.startTime
          }
        })
      },

    }
  }
</script>