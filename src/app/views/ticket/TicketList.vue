<template>
  <main-box :title="title" main-class="scrollingBox">
    <scroll ref="scroll"
            v-show="!showNoData"
            :pullUpLoad="true"
            @pullingUp="onPullingUp">
      <ticket :list-data="listData" type="ticket" :product-type="searchKeys.productTypeLevelOne"></ticket>
    </scroll>
    <no-ticket :show="showNoData" text="亲，您还没车票呢？">
      <input type="button" @click="jumpToBuyTicket" class="any-but button button-primary" value="车票购买"/>
    </no-ticket>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index'
  import Scroll from 'components/betterScroll/scroll/scroll'
  import Ticket from 'appComponents/ticket/index'
  import NoTicket from 'appComponents/noTicket/index'

  export default {
    components: {
      MainBox,
      Scroll,
      Ticket,
      NoTicket,
    },
    data () {
      return {
        title: this.$route.meta.title,
        listData: [],
        totalPage: '',
        showNoData: false,
        searchKeys: {
          productTypeLevelOne: '',
          pageNo: 0,
          pageSize: TOOL.pageSize
        },
        jumpPageData: [
          {productTypeLevelOne: 'CITY_BUS', jumpPageName: 'city'},
          {productTypeLevelOne: 'AIRPORT_BUS', jumpPageName: 'airportSendSearch'},
          {productTypeLevelOne: 'TOUR_BUS', jumpPageName: 'sights'},
          {productTypeLevelOne: 'WORK_BUS', jumpPageName: 'work'},
          {productTypeLevelOne: 'SCHOOL_BUS', jumpPageName: 'school'},
          {productTypeLevelOne: 'CUSTOM_BUS', jumpPageName: 'lineCar'}
        ]
      }
    },
    mounted () {
      this.showNoData = false
      this.searchKeys.pageNo = 0
      this.searchKeys.productTypeLevelOne = this.$route.query.productTypeLevelOne
      this.title = TOOL[this.$route.query.productTypeLevelOne]
      this.orderId = this.$route.query.orderId
      this.onPullingUp()
    },
    methods: {
      /**
       * 下拉刷新
       */
      onPullingUp () {
        if(this.searchKeys.pageNo === 0){
          this.listData = []
          this.loadPageList()
          this.$refs.scroll.scrollTo(0, 0)
        }else{
          setTimeout(()=>{
            this.loadPageList()
          }, 1000)
        }
      },

      /**
       * 查找车票
       */
      loadPageList () {
        if(this.searchKeys.pageNo && this.searchKeys.pageNo >= this.totalPage){
          this.$refs.scroll.forceUpdate()
          return
        }
        let apiData = this.searchKeys;
        let apiField = 'findTicketList';
        if(this.$route.query.ticketType && this.$route.query.ticketType === 'own') {
          apiField = 'findTicketListOwn';
          apiData = {orderId:this.orderId};
        }
        api[apiField](apiData).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            if(apiField === 'findTicketList'){
              this.showNoData = !data.resultData.content.length
              this.listData = this.listData.concat(data.resultData.content);
              this.totalPage = data.resultData.totalPages
            }else{
              this.showNoData = !data.resultData.length
              this.listData = data.resultData;
              this.totalPage = 0
            }
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
       * 跳转车票详情
       * 0未付款, 1未验票, 2已验票, 3已乘坐, 5已退票, 6已失效（未支付，不能支付了）, 7已过期(行程已完成了但未乘坐), 8退款申请中
       */
      jumpToTicketDetail (ticketId, status) {
        if (status === 1 || status === 2) {
          this.$router.push({
            name: 'ticketDetail',
            query: {
              ticketId: ticketId
            }
          })
        }
      },

      /**
       * 跳转车票购买
       */
      jumpToBuyTicket () {
        let jumpPageName
        for (let i = 0; i < this.jumpPageData.length; i++) {
          if (this.searchKeys.productTypeLevelOne === this.jumpPageData[i].productTypeLevelOne) {
            jumpPageName = this.jumpPageData[i].jumpPageName
          }
        }
        this.$router.push({name: jumpPageName})
      }
    }
  }
</script>
<style scoped>
  .gen-ticket-info .no-person {
    height: 100px;
    line-height: 100px;
  }
</style>
