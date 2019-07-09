<template>
  <main-box :title="title" :show-more="false" :go-back="setCoupon" main-class="scrollingBox">
    <router-link class="hd-cancel fc-4c4c4c" slot="title" :to="{name: 'couponCenter', query:{pageRouter: pageRouter}}">获取优惠券</router-link>
    <ul class="coupon-nav line line-x-b">
      <li :class="{active: searchKeys.enable === 0}" @click="serarchCoupon(0)">
        <a>可使用<em v-if="useNum">（{{useNum}}）</em></a>
      </li>
      <li :class="{active: searchKeys.enable === 1}" @click="serarchCoupon(1)">
        <a>不可用<em v-if="unUseNum">（{{unUseNum}}）</em></a>
      </li>
    </ul>
    <div class="ticket-scroller" :class="{'bottom-120': searchKeys.enable === 0 && orderCoupons.length}">
      <scroll ref="scroll"
              :pullUpLoad="true"
              @pullingUp="onPullingUp">
        <div>
          <div class="coupon-box">
            <ul class="coupon-list" v-show="orderCoupons.length">
              <li class="coupon-item line line-box radius-box" :class="{'no-use': searchKeys.enable === 1}" v-for="data in orderCoupons">
                <div class="circle left-circle"></div>
                <div class="circle right-circle"></div>
                <div class="coupon-info" @click="selectCoupon(data)">
                  <div class="coupon-price-box">
                    <p class="coupon-price">
                      ¥ <em v-if="data.amountType === 1 ">{{data.minAmount + ' ~ ' + data.maxAmount}}</em>
                      <em v-else>{{data.amount}}</em>
                    </p>
                    <p>{{data.useAmountLimit ? `满${data.useAmount}元可用` : '无门槛使用'}}</p>
                  </div>
                  <div class="coupon-detail">
                    <h2 class="coupon-name">{{data.name}}</h2>
                    <div class="coupon-time">
                      <p>{{data.activeTime | formatDate('date')}} ~ {{data.invalidTime | formatDate('date')}}</p>
                      <p>{{data.weekList | weekText}} {{ data.weekLimit ? data.startupBeginTime + ' - ' + data.startupEndTime : '不限时段'}}使用</p>
                    </div>
                  </div>
                  <div class="coupon-status" v-if="searchKeys.enable !== 1">
                    <div class="check-box">
                      <input class="hide" type="radio" v-model="userCouponId" :value="data.id">
                      <i class="icon-check"></i>
                    </div>
                  </div>
                </div>
                <p class="coupon-use line line-x-t" @click="openInfoDialog(data)">使用说明</p>
              </li>
            </ul>
          </div>
          <div class="no-open" v-show="!orderCoupons.length">
            <img src="../../../assets/my/youhuiquan1.png">
            <p>您还没有优惠券，快去领券中心领取吧</p>
          </div>
        </div>
      </scroll>
    </div>
    <div slot="footer" v-show="searchKeys.enable === 0 && orderCoupons.length">
      <div class="abs-bottom-box">
        <div class="buy-right buy-w100">
          <input type="button" class="button button-primary" @click="setCoupon" value="确定"/>
        </div>
      </div>
    </div>
    <x-dialog :show="showCouponDialog" :hide-on-blur="true" @on-hide="showCouponDialog = false" class="dialog-520 coupon-dialog">
      <a class="close" @click="showCouponDialog = false"></a>
      <p class="coupon-dialog-tit">使用说明</p>
      <p class="dialog-p">优惠券名：{{couponData.name}}</p>
      <p class="dialog-p">使用限额：{{couponData.useAmountLimit ? `满${couponData.useAmount}元可用` : '无门槛使用'}}</p>
      <div class="dialog-tit-p">
        <p class="tit-p">可用时间：</p>
        <p>{{couponData.activeTime | formatDate('date')}} ~ {{couponData.invalidTime | formatDate('date')}}</p>
        <p>
          <span v-if="couponData.weekLimit">{{couponData.weekList | weekText}}</span>
          <span v-if="!couponData.weekLimit && couponData.startupTimeLimit">每天</span>
          <span>{{ couponData.startupTimeLimit ? couponData.startupBeginTime + ' - ' + couponData.startupEndTime : '不限时段'}} 使用</span>
        </p>
      </div>
      <div class="dialog-tit-p">
        <p class="tit-p">适用产品：</p>
        <p>{{couponData.suitProductTypeLevelOnes | getProductOneNames}}</p>
      </div>
      <div class="dialog-tit-p" v-if="couponData.remark">
        <p class="tit-p">使用说明：</p>
        <p>{{couponData.remark}}</p>
      </div>
    </x-dialog>
  </main-box>
</template>

<script>
  import MainBox from 'components/mainBox/index'
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
        pageRouter: this.$route.name,
        fromPage: '',
        totalPage: '',
        searchKeys: {
          enable: 0, // 0：可用，1：不可用
          skuId: '',
          productId:'',
          productTypeLevelOne: '',
          startupTime: '',
          passengerNum: 0,
          ticketAmount: 0,
          ticketTotalAmount: 0,
          pageNo: 0,
          pageSize: TOOL.pageSize
        },
        orderCoupons: [],
        noData: false,
        couponData:{
          suitProductTypeLevelOnes:[]
        },
        showCouponDialog: false,
        userCouponId:'',
        localData:'',
        price: 0,
        useNum:0,
        unUseNum: 0
      }
    },
    mounted () {
      this.initialize()
    },
    methods: {
      initialize () {
        this.fromPage = this.$route.query.pageRouter
        this.searchKeys.skuId = this.$route.query.skuId
        this.searchKeys.productId = this.$route.query.productId
        this.searchKeys.productTypeLevelOne = this.$route.query.productTypeLevelOne
        this.searchKeys.startupTime = this.$route.query.startupTime
        this.searchKeys.passengerNum = this.$route.query.passengerNum
        this.searchKeys.ticketAmount = this.$route.query.ticketAmount
        this.searchKeys.ticketTotalAmount = this.$route.query.ticketTotalAmount
        this.searchKeys.activityId = this.$route.query.activityId
        this.price = this.$route.query.price
        if (appStorage.get('X-Auth-Token')) {
          this.searchKeys.pageNo = 0
          this.onPullingUp()
        }
        this.localData = JSON.parse(appStorage.get(this.fromPage))
        this.userCouponId = this.localData.discountInfo.userCouponId
      },

      openInfoDialog (data) {
        this.couponData = data
        this.showCouponDialog = true
      },

      /**
       * 筛选优惠券
       */
      serarchCoupon (enable) {
        this.searchKeys.enable = enable
        this.searchKeys.pageNo = 0
        this.onPullingUp()
      },
  
      /**
       * 下拉刷新
       */
      onPullingUp () {
        if(this.searchKeys.pageNo === 0){
          this.orderCoupons = []
          this.loadPageList()
          this.$refs.scroll.scrollTo(0, 0)
        }else{
          setTimeout(()=>{
            this.loadPageList()
          }, 1000)
        }
      },

      /**
       * 查询我的优惠券
       */
      loadPageList () {
        if(this.searchKeys.pageNo && this.searchKeys.pageNo >= this.totalPage){
          this.$refs.scroll.forceUpdate()
          return
        }
        api.wxUserCouponFindAvailableCoupon(this.searchKeys).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            if(data.resultData){
              let pageData = data.resultData.list
              this.orderCoupons = this.orderCoupons.concat(pageData.content)
              this.totalPage = pageData.totalPages
              this.unUseNum = data.resultData.unUseNum
              this.useNum = data.resultData.useNum
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

      selectCoupon (orderCoupon) {
        if(this.searchKeys.enable === 1) return
        if(this.price >= orderCoupon.amount){
          this.userCouponId = orderCoupon.id
        }else{
          this.$store.dispatch('showError', '优惠金额不能大于车票价格');
        }
      },

      setCoupon () {
        this.localData.discountInfo.userCouponId = this.userCouponId
        appStorage.set(this.fromPage, JSON.stringify(this.localData))
        this.$router.go(-1)
      }

    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .fc-4c4c4c{
    color:#4c4c4c;
  }
  .top-0{
    top:0 !important;
  }
  .coupon-box{
    position: relative;
    padding:30px 20px 0;
  }
  .coupon-nav{
    position: absolute;
    left:0;
    top:0;
    width: 100%;
    background-color:  @bg-fff;
    display:flex;
    li{
      flex:1;
      padding:25px 0;
      text-align:center;
      color:#888;
      font-size:28px;
      a{
        display:inline-block;
        width: 100%;
        line-height:30px;
        border-right:1PX solid @bc-e5e5e5;
      }
    }
    li:last-child a{
      border-right:0;
    }
    li.active{
      color: @fc-ff6600;
    }
  }
  .coupon-item{
    position: relative;
    margin-bottom: 30px;
    background-color: @bg-fff;
    font-size:24px;
    color:#888;
    &:last-child{
      margin-bottom: 0;
    }
    .circle{
      position: absolute;
      bottom:50px;
      width:20px;
      height:20px;
      background-color: @bg-f2f2f2;
      border-radius: 50%;
      z-index:100;
    }
    .left-circle{
      left: -10px;
      border-right:1px solid @bc-e5e5e5;
    }
    .right-circle{
      right: -10px;
      border-left:1px solid @bc-e5e5e5;
    }
    .coupon-info{
      position: relative;
      display: flex;
      height:175px;
      padding:30px 160px 20px 0;
    }
    .coupon-price-box{
      white-space: nowrap;
      padding:0 20px 24px;
      text-align: center;
      border-right:1px dashed @bc-e5e5e5;
    }
    .coupon-price{
      margin-bottom:30px;
      font-size:28px;
      color: @fc-ff6600;
      em{
        font-size:40px;
      }
    }
    &.no-use{
      .coupon-price,
      .coupon-name{
        color: @fc-888;
      }
    }
    .coupon-detail{
      position: relative;
      flex:1;
      padding:0 20px 0 30px;
      font-size:20px;
    }
    .coupon-name{
      width: 300px;
      margin-bottom:40px;
      line-height:1.4;
      font-size:32px;
      color:#121212;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .coupon-time{
      position: absolute;
      bottom: 0;
      left:30px;
      line-height: 1.6;
      p{
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: 300px;
      }
    }
    .coupon-use{
      line-height:60px;
      text-align:center;
    }
    .coupon-status{
      position: absolute;
      right:20px;
      bottom:24px;
      .button-size{
        width:120px;
        height:50px;
        line-height:50px;
        font-size:24px;
      }
      &.coupon-used{
        top:0;
        bottom:0;
        width:120px;
        background:url("../../../assets/my/used.png") no-repeat right center;
        background-size:100px 100px;
      }
      .coupon-percent{
        position: relative;
        width:120px;
        height:20px;
        margin-bottom:15px;
        border-radius:10px;
        background-color: @bg-ffe1cd;
        overflow:hidden;
        .percent{
          position: absolute;
          left:0;
          height:20px;
          border-radius:10px;
          transition: width 1s;
          background-color: @bg-ff6600;
        }
      }
      .coupon-percent-txt{
        text-align: center;
        margin-bottom:15px;
        color: @fc-ff6600;
      }
    }
  }
  .coupon-dialog{
    font-size:24px;
    color:#4c4c4c;
    .close{
      position: absolute;
      top:20px;
      right:20px;
      width:50px;
      height:50px;
      background:url("../../../assets/close-dialog.png") no-repeat right top;
      background-size:30px 30px;
    }
    .coupon-dialog-tit{
      margin-bottom:40px;
      font-size:28px;
    }
    .dialog-p{
      text-align: left;
      margin-bottom:20px;
    }
    .dialog-tit-p{
      position: relative;
      padding-left: 120px;
      .tit-p{
        position: absolute;
        left:0;
        top:0;
      }
      p{
        text-align: left;
        line-height:1.6;
      }
    }
  }
  .bottom-120{
    bottom:120px;
  }
</style>
