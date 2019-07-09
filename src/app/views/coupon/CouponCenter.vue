<template>
  <main-box :title="title" :show-more="false">
    <router-link class="hd-cancel fc-4c4c4c" slot="title" :to="{name: 'myCoupon'}">查看我的</router-link>
    <div class="ticket-scroller top-0">
      <scroll ref="scroll"
              :pullUpLoad="true"
              @pullingUp="onPullingUp">
        <coupon-list :datas="datas" type="all" @exchangeCoupon="exchangeCoupon" :from-page="fromPage" @openInfoDialog="openInfoDialog"></coupon-list>
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
    <div slot="footer">
      <pay-dialog :show="showPayDialog" @verifyPayPassword="verifyPayPasswordCoupon"></pay-dialog>
    </div>
  </main-box>
</template>

<script>
  import MainBox from 'components/mainBox/index'
  import Scroll from 'components/betterScroll/scroll/scroll'
  import PayDialog from 'appComponents/dialog/payDialog'
  import CouponList from 'appComponents/couponList/index'
  import { XDialog } from 'vux'
  
  export default {
    components: {
      MainBox,
      Scroll,
      CouponList,
      XDialog,
      PayDialog
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        searchKeys: {
          pageNo: 0,
          pageSize: TOOL.pageSize
        },
        fromPage:'',
        resource: '',
        datas: [],
        noData: false,
        couponData:{
          suitProductTypeLevelOnes:[]
        },
        showCouponDialog: false,
        exchangeCouponId: '',
        payPassword: '',
        showPayDialog: false,
      }
    },
    mounted () {
      this.fromPage = this.$route.query.pageRouter
      this.resource = 'couponGetAvailableCoupons'
      if (!appStorage.get('X-Auth-Token')) {
        this.resource = 'couponGetAvailableCouponsA'
      }
      this.searchKeys.pageNo = 0
      this.onPullingUp()
    },
    methods: {
      openInfoDialog (data) {
        this.couponData = data
        this.showCouponDialog = true
      },
      
      exchangeCoupon(couponId) {
        let usrInfo = JSON.parse(appStorage.get('userInfo'));
        if(!usrInfo.whetherSetPayPS){
          this.$store.dispatch('showConfirm', {
            title: '支付密码提示',
            confirmText: '立即设置',
            cancelText: '暂不设置',
            content: '使用积分换券需要输入平台支付密码<br/>您还没有设置支付密码',
            onConfirm: () => {
              this.$router.push({
                name: 'setPayPasswordStep1'
              })
            },
            onCancel: () => {}
          })
        }else{
          this.showPayDialog = true;
          this.exchangeCouponId = couponId;
        }
      },
      
      verifyPayPasswordCoupon (payPassword) {
        this.payPassword = payPassword
        this.$store.commit('UPDATE_LOADING', true)
        api.verifyPayPassword(this.payPassword).then(res => {
          this.$store.commit('UPDATE_LOADING', false)
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.showPayDialog = false
            api.wxUserCouponTakeCoupon(this.exchangeCouponId).then(res=>{
              const dataCoupon = TOOL.toJson(res.data)
              if (dataCoupon.resultCode === '0') {
                if(this.fromPage){
                  this.$store.dispatch('showSuccess', '兑换成功');
                  this.$router.go(-1)
                }else{
                  this.$router.push({
                    name: 'getCouponSuccess',
                    query:{
                      myCouponId: dataCoupon.resultData.id,
                      couponId: this.exchangeCouponId,
                    }
                  })
                }
              } else {
                this.$store.dispatch('showError', dataCoupon.resultMsg);
              }
            })
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
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
        api[this.resource](this.searchKeys).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.noData = !data.resultData.content.length
            this.datas = this.datas.concat(data.resultData.content)
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