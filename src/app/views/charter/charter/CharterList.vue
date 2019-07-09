<template>
  <main-box :title="title">
    <div class="mar20">
      <product-top-nav :show="pageId == 7" ctg="LINE_BUS" :active="1" :nav1router="jumpToLineCar"></product-top-nav>
    </div>
    <div class="ticket-scroller charter-scroller" :class="{'hide-nav':pageId != 7}" v-show="enquiryLists.length > 0">
      <scroll ref="scroll"
              :pullUpLoad="true"
              @pullingUp="onPullingUp">
        <ul class="quote-list">
          <li v-for="enquiryList in enquiryLists"
              :class="{
                'quote-gray': enquiryList.status == 3 || enquiryList.status == 4,
                'quote-blue': enquiryList.status == 0 || enquiryList.status == 1,
                'quote-orange': enquiryList.status == 2 || enquiryList.status == 5 || enquiryList.status == 6}">
            <div class="list-header clearfix">
              <p class="quote-time">申请时间<span
                class="time">{{ enquiryList.createdTime | formatDate('holeDate') }}</span></p>
              <p class="quote-status">
                <span v-if="enquiryList.status == 0">暂无报价</span>
                <span v-if="enquiryList.status == 1">
                        <span v-if="enquiryList.notifyType != 1">公司已报价</span>
                        <span v-if="enquiryList.notifyType == 1">{{enquiryList.quoteNum}}位司机报价</span>
                      </span>
                <span v-if="enquiryList.status == 2">未安排</span>
                <span v-if="enquiryList.status == 3">已失效</span>
                <span v-if="enquiryList.status == 4">已取消</span>
                <span v-if="enquiryList.status == 5">已服务</span>
                <span v-if="enquiryList.status == 6">已安排</span>
                <span v-if="enquiryList.status == 7">待支付</span>
              </p>
            </div>
            <div class="list-body line line-x"
                 @click="jumpToQuote(enquiryList.id, enquiryList.notifyType, enquiryList.status)">
              <p class="list-address">
                <i class="circle-bg-start">始</i> {{enquiryList.aAddress.city + '·' +
              enquiryList.aAddress.detailAddress}}
                </p>
              <p class="list-address mar-b-0">
                <i class="circle-bg-end">终</i> {{enquiryList.bAddress.city + '·' +
              enquiryList.bAddress.detailAddress}}
                </p>
            </div>
            <!--//0报价中, 1已报价, 2已收款, 3已失效, 4已取消, 5已服务, 6已安排, 7未付定金-->
            <div class="list-footer clearfix">
              <div class="quote-timer pull-left">
                <p v-if="enquiryList.status == 0 || enquiryList.status == 1">
                  <clocker :time="enquiryList.enquiryInvalidTime" slot="value">
                    <span>离报价结束还有</span>
                    <span class="blue">%H</span>
                    <span class="blue">:</span>
                    <span class="blue">%M</span>
                    <span class="blue">:</span>
                    <span class="blue">%S</span>
                  </clocker>
                </p>
                <p v-if="enquiryList.status == 2">正在为您安排车辆</p>
                <p v-if="enquiryList.status == 3">申请超时未处理，自动失效</p>
                <p v-if="enquiryList.status == 4">暂无可用车辆，已为您取消</p>
                <p v-if="enquiryList.status == 5">感谢您的乘坐</p>
                <p v-if="enquiryList.status == 6">已为您安排车辆，请及时乘坐</p>
                <p v-if="enquiryList.status == 7">请尽快支付订金，否则申请将自动失效</p>
              </div>
              <a v-if="enquiryList.status == 7"
                 class="button button-small button-primary pull-right"
                 @click="payCharter(enquiryList)">
                立即支付
              </a>
              <a v-else class="button button-small button-black-empty line line-box radius-box pull-right"
                 @click="jumpToQuote(enquiryList.id, enquiryList.notifyType, enquiryList.status)">
                查看详情
              </a>
            </div>
          </li>
        </ul>
      </scroll>
    </div>
    <div class="no-open" v-show="!customProduct && enquiryLists.length == 0">
      <img src="../../../../assets/no_bus.png">
      <p>当前定位城市暂未开通定制包车服务</p>
      <p>敬请期待</p>
    </div>
    <div class="no-open" v-show="customProduct && enquiryLists.length == 0">
      <img src="../../../../assets/no_bus.png">
      <p>暂未获取到您申请的定制包车服务</p>
      <p>请登陆后查看或前往申请</p>
    </div>
    <div class="charter-apply-btn">
      <input type="button" class="button button-primary"
             @click="jumpToApplyCharter"
             :disabled="!customProduct"
             :value="customProduct ? '申请包车服务' : '当前定位城市暂未开通定制包车服务'"/>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import ProductTopNav from 'appComponents/productTopNav/index.vue'
  import Scroll from 'components/betterScroll/scroll/scroll'
  import { Clocker } from 'vux'

  //0报价中, 1已报价, 2已收款, 3已失效, 4已取消, 5已服务, 6已安排, 7未付定金
  export default {
    components: {
      MainBox,
      ProductTopNav,
      Scroll,
      Clocker
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        pageId:'',
        enquiryLists: [],
        customProduct: '',
        totalPage: '',
        searchKeys: {
          pageNo: 0,
          pageSize: TOOL.pageSize
        },
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
        if(this.$route.query.pageName){
          this.title = this.$route.query.pageName
        }
        this.pageId = +this.$route.query.pageId || 7
        this.searchKeys.pageNo = 0
        this.onPullingUp()
      },
  
      /**
       * 下拉刷新
       */
      onPullingUp () {
        if(this.searchKeys.pageNo === 0){
          this.enquiryLists = []
          this.loadPageList()
          this.$refs.scroll.scrollTo(0, 0)
        }else{
          setTimeout(()=>{
            this.loadPageList()
          }, 1000)
        }
      },
      
      /**
       * 查询定制包车询价列表
       * 如有定制包车产品且询价列表为空则直接跳转到定制包车申请页面
       */
      loadPageList () {
        if(this.searchKeys.pageNo && this.searchKeys.pageNo >= this.totalPage){
          this.$refs.scroll.forceUpdate()
          return
        }
        api.customProductCheck(this.searchKeys).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            let ExistProduct = data.resultData.ExistProduct
            let ExistProductAndEnquiry = data.resultData.ExistProductAndEnquiry
            if (ExistProduct) {
              this.customProduct = ExistProduct
            }
            if (ExistProductAndEnquiry) {
              this.enquiryLists = this.enquiryLists.concat(ExistProductAndEnquiry.content)
              this.totalPage = ExistProductAndEnquiry.totalPages
            }
            if (this.customProduct && this.enquiryLists.length === 0) {
              appStorage.remove('applyCharter')
              if(appStorage.get('X-Auth-Token')){
                this.$router.replace({
                  name: 'applyCharter',
                  query:{
                    pageId: this.pageId
                  }
                })
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
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      
      jumpToLineCar () {
        this.$router.push({
          name: 'lineCar'
        })
      },

      /**
       * 跳转询价页面
       * 0报价中, 1已报价, 2已收款, 3已失效, 4已取消, 5已服务, 6已安排
       */
      jumpToQuote (enqueryId, notifyType, status) {
        if (!this.customProduct) {
          this.$store.dispatch('showError', '抱歉，定制包车产品已下线，试试线路包车吧~~');
          return false
        }

        if (status === 4) {
          this.$store.dispatch('showError', '抱歉，当前包车订单已取消，再去申请一个吧~~');
          return false
        }

        let jumpPageName
        if (status === 0) {
          jumpPageName = 'charterSuccess'
        } else if (status === 1) {
          jumpPageName = 'companyQuote'
          if (notifyType === 1) {
            jumpPageName = 'driverQuote'
          }
        } else if (status === 3) {
          jumpPageName = 'charterFail'
        } else if (status === 2 || status === 5 || status === 6) {
          jumpPageName = 'companyQuoteDetail'
          if (notifyType === 1) {
            jumpPageName = 'driverQuoteDetail'
          }
        }

        this.$router.push({
          name: jumpPageName,
          query: {
            enqueryId: enqueryId
          }
        })
      },

      /**
       * 支付
       */
      payCharter (enquiryList) {
        this.$store.commit('UPDATE_LOADING', true)
        interfaceApi.wxPay({
          enquiryId: enquiryList.id,
          productId: enquiryList.productId,
          pageRouter: this.pageRouter,
          productTypeLevelOne: 'CUSTOM_BUS_enquiry',
          wxPaySuccess: TOOL.wxPaySuccess,
          wxPayFail: TOOL.wxPayFail
        })
      },

      /**
       * 跳转申请定制包车页面
       */
      jumpToApplyCharter () {
        appStorage.remove('applyCharter')
        this.$router.push({
          name: 'applyCharter',
          query:{
            pageId: this.pageId
          }
        })
      }
    }
  }
</script>
<style scoped>
  .quote-list li {
    margin-bottom: 20px;
    background: #fff;
  }

  .list-header {
    height: 64px;
    line-height: 64px;
    font-size: 28px;
  }

  .quote-time {
    float: left;
    padding-left: 14px;
    border-left: 4PX solid #fff;
    color: #4c4c4c;
  }

  .quote-time .time {
    margin-left: 20px;
  }

  .quote-status {
    float: right;
    padding-right: 20px;
    color: #2687ea;
  }

  .list-body {
    padding: 20px 20px 30px;
  }

  .list-address {
    margin-bottom: 30px;
    font-size: 30px;
    color: #121212;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .list-address i {
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    margin-right: 20px;
    text-align: center;
    color: #fff;
    background-color: #4D4D4D;
    -webkit-border-radius: 15px;
    -moz-border-radius: 15px;
    border-radius: 15px;
    font-size: 16px;
    vertical-align: middle;
  }

  .list-footer {
    height: 86px;
    line-height: 86px;
    padding: 0 20px;
    font-size: 28px;
    color: #4c4c4c;
  }

  .blue {
    color: #2687ea;
  }

  .list-footer .button {
    width: 130px;
    margin-top: 10px;
    color: #4c4c4c;
    font-size: 28px;
  }

  .list-footer .button-primary{
    color: #fff;
  }

  .list-footer .button:after {
    border-color: #4C4C4C;
  }

  .quote-gray .quote-time {
    border-left-color: #999;
    color: #999;
  }

  .quote-gray .quote-status {
    color: #999;
  }

  .quote-gray .list-address {
    color: #999;
  }

  .quote-gray .list-address i {
    background-color: #999 !important;
  }

  .quote-blue .quote-time {
    border-left-color: #2687ea;
  }

  .quote-orange .quote-time {
    border-left-color: #ff6600;

  }

  .quote-orange .quote-status {
    color: #ff6600;
  }
</style>
