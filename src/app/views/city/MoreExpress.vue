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
          <express-ticket :title="CITY_EXPRESS_BUS" :skus="citySkus" @jumpToPage="jumpToBusDetail" @showDiscountDialog="showDiscountDialog"></express-ticket>
          <no-result :show="noSkus" text="该时段的车都被预定完了耶，换个试试吧~"></no-result>
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
  import ExpressTicket from 'appComponents/searchListTicket/expressTicket'
  import DiscountDialog from 'appComponents/dialog/discountDialog'
  import NoResult from 'appComponents/noResult/index'
  import { Group, Calendar } from 'vux'
  
  export default {
    components: {
      MainBox,
      DatePagination,
      Group,
      Calendar,
      Scroll,
      ExpressTicket,
      NoResult,
      DiscountDialog
    },
    data () {
      return {
        title: '',
        CITY_EXPRESS_BUS: TOOL.CITY_EXPRESS_BUS,
        calendar: {
          weeksList: ['日', '一', '二', '三', '四', '五', '六 '],
          disablePast: true
        },
        searchKeys: {
          type: 1, // 有城际班车则城际班车翻页, 无城际班车则城际快车翻页 0.城际快车、城际班车都返回；1.城际快车；2.城际班车
          startPlace: '',
          endPlace: '',
          startTime: '',
          pageNo: 0,
          pageSize: TOOL.pageSize
        },
        citySkus: '',
        totalPage: '',
        noSkus: false,
        showDiscount: false,
        discountSku: ''
      }
    },
    computed: {
      prevDisabled () {
        return !(TOOL.dateCompare(this.searchKeys.startTime) <= 0)
      }
    },
    watch: {
      $route () {
        this.initialize()
      }
    },
    mounted () {
      this.initialize()
    },
    methods: {
      initialize () {
        // 重置翻页页数和类型
        this.searchKeys.pageNo = 0
        this.searchKeys.startPlace = this.$route.query.startPlace
        this.searchKeys.endPlace = this.$route.query.endPlace
        this.searchKeys.startTime = this.$route.query.startTime
        this.title = this.searchKeys.startPlace + ' - ' + this.searchKeys.endPlace
        this.onPullingUp()
      },
  
      /**
       * 下拉刷新
       */
      onPullingUp () {
        if(this.searchKeys.pageNo === 0){
          this.citySkus = []
          this.loadPageList()
          this.$refs.scroll.scrollTo(0, 0)
        }else{
          setTimeout(()=>{
            this.loadPageList()
          }, 1000)
        }
      },
      
      /**
       *城际专车, 城际班车列表
       */
      loadPageList () {
        if(this.searchKeys.pageNo && this.searchKeys.pageNo >= this.totalPage){
          this.$refs.scroll.forceUpdate()
          return
        }
        api.citySkuFind(this.searchKeys).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.noSkus = !data.resultData.citySkus.content.length
            this.citySkus = this.citySkus.concat(data.resultData.citySkus.content)
            this.totalPage = data.resultData.citySkus.totalPages
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
          name: 'moreCitySku',
          query: {
            startPlace: this.searchKeys.startPlace,
            endPlace: this.searchKeys.endPlace,
            startTime: this.searchKeys.startTime
          }
        });
      },
      
      /**
       * 清除快车本地订单数据
       */
      deleteBusDetailForm () {
        appStorage.remove('busDetail')
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
        this.deleteBusDetailForm()
        this.$router.push({
          name: 'busDetail',
          query: {
            skuId: skuId,
            price: price
          }
        })
      }
    }
  }
</script>
