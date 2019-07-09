<template>
  <main-box :title="title" :show-more="false">
    <router-link class="hd-cancel fc-4c4c4c" slot="title" :to="{name: 'couponCenter'}">获取优惠券</router-link>
    <ul class="coupon-nav line line-x-b">
      <li :class="{active: searchKeys.status === 0}" @click="serarchCoupon(0)">
        <a>未使用<em v-if="unUseNum">（{{unUseNum}}）</em></a>
      </li>
      <li :class="{active: searchKeys.status === 1}" @click="serarchCoupon(1)">
        <a>已使用<em v-if="useNum">（{{useNum}}）</em></a>
      </li>
      <li :class="{active: searchKeys.status === 2}" @click="serarchCoupon(2)">
        <a>已过期<em v-if="expireNum">（{{expireNum}}）</em></a>
      </li>
    </ul>
    <div class="ticket-scroller">
      <scroll ref="scroll"
              :pullUpLoad="true"
              @pullingUp="onPullingUp">
        <div>
          <div class="no-open" v-show="noData">
            <img src="../../../assets/my/youhuiquan1.png">
            <p>{{emptyText}}</p>
          </div>
          <coupon-list :datas="datas" v-show="!noData" @openInfoDialog="openInfoDialog"></coupon-list>
        </div>
      </scroll>
    </div>
    <x-dialog :show="showCouponDialog" :hide-on-blur="true" @on-hide="showCouponDialog = false" class="dialog-520 coupon-dialog">
      <a class="close" @click="showCouponDialog = false"></a>
      <p class="coupon-dialog-tit">使用说明</p>
      <!--<p class="dialog-p">优惠券名：{{couponData.name}}</p>
      <p class="dialog-p">使用限额：{{couponData.useAmountLimit ? `满${couponData.useAmount}元可用` : '无门槛使用'}}</p>-->
      <div class="dialog-tit-p">
        <P class="tit-p">优惠券名：</P>
        <P>{{couponData.name}}</P>
      </div>
      <div class="dialog-tit-p">
        <P class="tit-p">使用限额：</P>
        <P>{{couponData.useAmountLimit ? `满${couponData.useAmount}元可用` : '无门槛使用'}}</P>
      </div>
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
  import CouponList from 'appComponents/couponList/index'
  import { XDialog } from 'vux'

  export default {
    components: {
      MainBox,
      Scroll,
      CouponList,
      XDialog
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        searchKeys: {
          status: 0, // 0：未使用，1：已使用，2：已过期
          pageNo: 0,
          pageSize: TOOL.pageSize
        },
        datas: [],
        noData: false,
        couponData:{
          suitProductTypeLevelOnes:[]
        },
        showCouponDialog: false,
        expireNum: 0,
        unUseNum: 0,
        useNum: 0,
        emptyText:'您还没有优惠券，快去获取吧'
      }
    },
    mounted () {
      this.searchKeys.pageNo = 0
      this.onPullingUp()
    },
    methods: {

      /**
       * 筛选优惠券
       */
      serarchCoupon (status) {
        let text = ['您还没有优惠券，快去获取吧', '没有更多券了', '没有更多券了']
        this.emptyText = text[status]
        this.searchKeys.status = status
        this.searchKeys.pageNo = 0
        this.onPullingUp()
      },

      openInfoDialog (data) {
        this.couponData = data
        this.showCouponDialog = true
      },
  
      /**
       * 下拉刷新
       */
      onPullingUp () {
        if(this.searchKeys.pageNo === 0){
          this.datas = []
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
        api.wxUserCouponFind(this.searchKeys).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            let pageData = data.resultData.list
            this.datas = this.datas.concat(pageData.content)
            this.totalPage = pageData.totalPages
            this.noData = !this.datas.length
            this.expireNum = data.resultData.expireNum
            this.unUseNum = data.resultData.unUseNum
            this.useNum = data.resultData.useNum
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

    }

  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .fc-4c4c4c{
    color:#4c4c4c;
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
  .pad{
    padding-bottom:30px;
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
</style>
