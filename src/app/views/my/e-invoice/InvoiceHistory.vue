<template>
  <main-box :title="title" :show-more="false">
    <div class="scroll-box">
      <scroll ref="scroll"
              :pullUpLoad="true"
              @pullingUp="onPullingUp">
        <div>
          <div class="ticket-order">
            <ul class="order-list">
              <li class="line line-x flex-li" v-for="data in invoiceHistory">
                <div class="mes-center">
                  <div class="hd clearfix mar-t-20 mar-b-44 f-s-26 pad-0 "
                       style="height: auto">
                    <span class="c-f-4c4c4c">{{data.applyTime.substring(0,16)}}</span>
                  </div>
                  <P class="yuan"><em class="money">{{data.eleInvoiceAmount | formatPrice('normal')}}</em>元</P>
                </div>
                <div class="mes-right text-right f-s-32 relative" @click="invoiceDetail(data.id)">
                  <P class="c-f-f60 f-s-26 mar-t-20"
                     v-if="data.invoiceStatus === 1">待开票<em class="right-arrow"></em></P>
                  <P class="c-f-56ab71 f-s-26"
                     v-if="data.invoiceStatus === 2">已开票<em class="right-arrow"></em></P>
                  <P class="c-f-56ab71 f-s-26"
                     v-if="data.invoiceStatus === 3">开票失败<em class="right-arrow"></em></P>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </scroll>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import Scroll from 'components/betterScroll/scroll/scroll'
  import { XDialog } from 'vux'

  export default {
    components: {
      MainBox,
      Scroll,
      XDialog
    },
    data () {
      return {
        title: this.$route.meta.title,
        searchKeys: {
          pageNo: 0,
          pageSize: TOOL.pageSize
        },
        invoiceHistory:[],
      }
    },
    mounted () {
      this.initialize()
    },
    methods: {
      initialize () {
        this.searchKeys.pageNo = 0
        this.onPullingUp()
      },

      /**
       * 下拉刷新
       */
      onPullingUp () {
        if(this.searchKeys.pageNo === 0){
          this.invoiceHistory = [];
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
        api.findEleInvoice(this.searchKeys).then(res=>{
         const data = TOOL.toJson(res.data)
         if (data.resultCode === '0') {
         this.totalPage = data.resultData.totalPages
         this.invoiceHistory = this.invoiceHistory.concat(data.resultData.content);
         console.log(this.invoiceHistory);
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

      invoiceDetail (id) {
        this.$router.push({
          name: 'invoiceDetail',
          query:{
              id:id
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../../styles/theme.less";


  .order-list-box {
    position: relative;
  }
  .scroll-box {
    display: flex;
    flex-direction: column;

    height: 100%;
  }
  .flex-1 {
    flex: 1;
  }
  .flex-li{
    display: flex;
    flex-wrap: nowrap;
    height: 140px;
    align-items: center;
    padding: 0 20px;
    .mes-center{
      flex:1;
      height:100%;
    }
    .mes-right{
      width: 150px;
      height:100%;
    }
    .icon-com{
      left: 0 ;
      top:70px ;
    }
  }
  .start-dian {
    width: 30px;
    height:30px;
    background-color: transparent !important;
    background: url("../../../../assets/order_start.png") no-repeat left center;
    background-size: 100% 100%;
  }
  .end-dian {
    width: 30px;
    height:30px;
    background-color: transparent !important;
    background: url("../../../../assets/order_end.png") no-repeat left center;
    background-size: 100% 100%;
  }
  .dian{
    display: inline-block;
    width: 5px;
    height:5px;
    background: #121212;
    border-radius: 50%;
    vertical-align: middle;
  }
  .money{
    font-size:28px;
    color: #ff6600;
  }
  .yuan{
    font-size:28px;
    color: #4c4c4c;
  }
  .money-position{
    position: absolute;
    bottom:0;
    right:0;
    margin-bottom: 20px;
  }
  .invoice-tip{
    font-size:26px;
    color: #f60;
    height:100px;
    width: 100%;
    padding: 0 40px;
    line-height: 100px;
    background: #fff;
  }
  .right-arrow{
    display: inline-block;
    width: 13px;
    height:23px;
    background-image:url('../../../../assets/month_right.png');
    background-size: 100% 100%;
    margin-left: 20px;
    vertical-align: bottom;
  }
</style>
