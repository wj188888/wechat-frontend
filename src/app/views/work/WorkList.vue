<template>
  <main-box :title="title" main-class="pad-20">
    <product-top-nav ctg="WORK_BUS" :active="0" :nav2router="jumpToFirmBus"></product-top-nav>
    <div class="ticket-scroller work-school-scroller" v-show="workTicketLists.length > 0">
      <scroll ref="scroll"
              :pullUpLoad="true"
              @pullingUp="onPullingUp">
        <div class="scroller-box">
          <normal-title css-class="pad-l-0" title="已为您搜索到周边的班车"></normal-title>
          <div class="collect-box">
            <div class="container-box line line-box radius-box" v-for="workTicketList in workTicketLists">
              <a @click="jumpToWorkTicket(workTicketList)">
                <div class="order-box">
                  <div class="start clearfix">
                    <span class="time" v-text="workTicketList.time">10:00</span>
                    <span class="circle circle-bg-start">始</span>
                    <span class="place" v-text="workTicketList.aAddress.detailAddress">青羊区</span>
                    <div class="price">
                      <p class="number" v-text="'¥' + workTicketList.price">¥2.5</p>
                    </div>
                  </div>
                  <div class="end clearfix">
                    <span class="company" v-text="workTicketList.firmName">店铺名字</span>
                    <span class="circle circle-bg-end">终</span>
                    <span class="place" v-text="workTicketList.bAddress.detailAddress">成都国际节能大厦</span>
                  </div>
                </div>
                <ticket-discount :sku="workTicketList" @showDiscountDialog="showDiscountDialog" :css-class="'pad-b-20'"></ticket-discount>
                <div class="desc line line-x-t">
                  <span class="frequency">{{ workTicketList.operationRule.week | weekText }}</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </scroll>
    </div>
    <no-result :show="workTicketLists.length === 0" text="<p>抱歉，没有找到对应的路线</p><p>试试别的吧~</p>">
      <img class="icon" src="../../../assets/no.png"/>
    </no-result>
    <div slot="footer">
      <discount-dialog :show-discount="showDiscount" :discount-sku="discountSku" @hideDiscountDialog="hideDiscountDialog"></discount-dialog>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import ProductTopNav from 'appComponents/productTopNav/index.vue'
  import Scroll from 'components/betterScroll/scroll/scroll'
  import DiscountDialog from 'appComponents/dialog/discountDialog'
  import TicketDiscount from 'appComponents/searchListTicket/ticketDiscount'
  import NormalTitle from 'appComponents/title/normalTitle'
  import NoResult from 'appComponents/noResult/index'

  export default {
    components: {
      MainBox,
      ProductTopNav,
      Scroll,
      DiscountDialog,
      TicketDiscount,
      NormalTitle,
      NoResult
    },
    data () {
      return {
        title: this.$route.meta.title,
        totalPage: '',
        searchKeys: {
          onStation: '',
          offStation: '',
          pageNo: 0,
          pageSize: TOOL.pageSize
        },
        workTicketLists: [],
        showDiscount: false,
        discountSku:''
      }
    },
    mounted () {
      this.searchKeys = {
        onStation: this.$route.query.onStation,
        offStation: this.$route.query.offStation
      }
      this.searchKeys.pageNo = 0
      this.onPullingUp()
    },
    methods: {
      /**
       * 下拉刷新
       */
      onPullingUp () {
        if(this.searchKeys.pageNo === 0){
          this.workTicketLists = []
          this.loadPageList()
          this.$refs.scroll.scrollTo(0, 0)
        }else{
          setTimeout(()=>{
            this.loadPageList()
          }, 1000)
        }
      },
      
      /**
       * 查询工作班车列表
       */
      loadPageList () {
        if(this.searchKeys.pageNo && this.searchKeys.pageNo >= this.totalPage){
          this.$refs.scroll.forceUpdate()
          return
        }
        api.schoolWorkFlightFindWork(this.searchKeys).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.workTicketLists = this.workTicketLists.concat(data.resultData.content)
            this.totalPage = data.resultData.totalPages
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
       * 跳转到购票页面
       */
      jumpToWorkTicket (workTicketList) {
        appStorage.remove('workTicket')
        this.$router.push({
          name: 'workTicket',
          query: {
            storeId: workTicketList.storeId,
            flightId: workTicketList.id,
            time: workTicketList.time,
            aAddress: workTicketList.aAddress.detailAddress,
            firmName: workTicketList.firmName,
            bAddress: workTicketList.bAddress.detailAddress,
          }
        })
      },

      /**
       * 跳转到企业专车页面
       */
      jumpToFirmBus () {
        this.$router.replace({
          name: 'firmBus',
          query: {
            onStation: this.searchKeys.onStation,
            offStation: this.searchKeys.offStation
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
    }
  }
</script>
<style lang="less" scoped>
  .container-box{
    height:auto!important;
  }
</style>
