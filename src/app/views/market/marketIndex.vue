<template>
  <main-box :title="title" :show-more="true" main-class="scrollingBox">
    <div class="market-index"
         :class="{'market-index-active': marketData.switchButton == 'on'}"
    >
      <p class="market-index__tip">全民营销活动已关闭，详情请联系客服人员</p>

      <div class="market-index__title">
        <p class="market-index__title-p1">当前累计金额</p>
        <p class="market-index__title-p2">{{(marketer.settleAmount+marketer.unSettleAmount)||0|formatPrice('normal')}}</p>
        <p class="market-index__title-p3">含未出现待结算 {{(marketer.lockedAmount||0)|formatPrice('normal')}} 元</p>
      </div>

      <div class="form-div mar-t-20 mar-b-20" @click="withDrawJump">
        <div class="form-div__title">可提现佣金 <span class="withdraw-price">{{marketer.unSettleAmount||0|formatPrice('normal')}}</span> 元</div>
        <div class="form-div__auto c-f-888 mar-r-20">{{withDrawText}}</div>
        <div class="form-div__icon-r"></div>
      </div>

      <div class="market-index__total relative">
        <div class="market-index__total-item" @click="jumpPage('marketCustomer')">
          <p class="market-index__total-num">{{marketer.userNum || 0}}</p>
          <p class="market-index__total-text">累计客户</p>
        </div>
        <div class="market-index__total-item" @click="jumpPage('totalRegister')">
          <p class="market-index__total-num">{{marketer.registerNum || 0}}</p>
          <p class="market-index__total-text">累计注册</p>
        </div>
        <div class="market-index__total-item" @click="jumpPage('totalFocus')">
          <p class="market-index__total-num">{{marketer.followNum || 0}}</p>
          <p class="market-index__total-text">累计关注</p>
        </div>
        <div class="market-index__total-item" @click="jumpPage('popOrder')">
          <p class="market-index__total-num">{{marketer.orderNum || 0}}</p>
          <p class="market-index__total-text">推广订单</p>
        </div>

        <div class="market__question" @click="switchDialog"></div>
      </div>

      <div class="market-product-box">
        <div class="market-product-item market-product-item1"
             v-if="popSwitch.product"
             @click="jumpPage('marketProduct')">
          <p class="pro-title">推广产品</p>
          <p>
            <span class="pro-text">赚佣金 &gt;</span>
          </p>
        </div>
        <div class="market-product-item market-product-item2"
             v-if="popSwitch.register"
             @click="jumpPage('popRegister')">
          <p class="pro-title">推广注册</p>
          <p>
            <span class="pro-text">促拉新 &gt;</span>
          </p>
        </div>
        <div class="market-product-item market-product-item3"
             v-if="popSwitch.focus"
             @click="jumpPage('popFocus')">
          <p class="pro-title">推广关注</p>
          <p>
            <span class="pro-text">获粉丝 &gt;</span>
          </p>
        </div>
      </div>

      <div class="form-div mar-t-20 mar-b-20" @click="jumpPage('accountRecord')">
        <div class="form-div__title">结算记录</div>
        <div class="form-div__icon-r"></div>
      </div>

      <div class="form-div mar-t-20 mar-b-20" @click="jumpPage('marketFAQ')">
        <div class="form-div__title">常见问题</div>
        <div class="form-div__icon-r"></div>
      </div>


      <x-dialog :show="showModal" class="dialog-demo" :class="{'display-block':showModal}">
        <div class="market-dialog" @click="switchDialog">
          <div class="market-dialog__title">累计客户</div>
          <div class="market-dialog__content">
            通过产品的分享，通过点击可成为临时客户，达成交易成为正式客户。
          </div>
          <div class="market-dialog__title">累计注册</div>
          <div class="market-dialog__content">
            通过产品的分享，如果分享的用户顺利注册成功，可成功累计注册数，领取奖励。
          </div>
          <div class="market-dialog__title">累计关注</div>
          <div class="market-dialog__content">
            通过推广关注的二维码顺利完成关注的用户，可累计新增关注数，领取奖励。
          </div>
          <div class="market-dialog__title">推广订单</div>
          <div class="market-dialog__content">
            客户成交的订单数量，根据成交金额获得对应比例的佣金。
          </div>
        </div>
      </x-dialog>

    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import { XDialog } from 'vux'

  let nowDate = new Date();

  export default {
    components: {
      MainBox,
      XDialog,
    },
    data() {
      return {
        title: this.$route.meta.title,
        showModal: false,
        marketData: {},
        marketer: {},
        weekNumSwitch: {'1': '一','2': '二','3': '三','4': '四','5': '五','6': '六','7': '七',},
        withDrawText: '',
        popSwitch: {
          product: false,
          register: false,
          focus: false,
        }
      }
    },
    mounted () {
      this.getMarketSet();
      this.getMarketInfo();
    },
    methods: {
      getMarketSet() {
        api.getMarketSet().then((res) => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.marketData = Object.assign({}, this.marketData, data.resultData);
            this.initWithDrawText();
            this.popSwitch = {
              product: !!this.marketData.marketProductSettingList && this.marketData.marketProductSettingList.length>0,
              register: !!this.marketData.registerRewardSetting && this.marketData.registerRewardSetting.switchButton==='on',
              focus: !!this.marketData.followRewardSetting && this.marketData.followRewardSetting.switchButton==='on',
            };
            console.log(this.popSwitch);
            console.log(this.marketData);
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      getMarketInfo() {
        api.getMarketInfo().then((res) => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.marketer = data.resultData || {};
            appStorage.set('marketerData',JSON.stringify(this.marketer));
            console.log(this.marketer);
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      initWithDrawText() {
        let commissionSetting = Object.assign({}, this.marketData.marketCommissionSetting);
        // 按周提现
        if(commissionSetting.unit === 'week') {
          let dayName = this.weekNumSwitch[commissionSetting.day];
          this.withDrawText = `每周${dayName}提现`;
        } else if(commissionSetting.unit === 'month') {
          this.withDrawText = `每月${commissionSetting.day}号提现`;
          if(commissionSetting.day == 28) {
            this.withDrawText = `每月最后一天号提现`;
          }
        }
      },
      withDrawJump() {
        if(!this.marketData.marketCommissionSetting) {
            return false;
        }
        if(this.marketData.switchButton !== 'on') {
          return;
        }
        let nowWeek = nowDate.getDay() || 7 ;
        let nowDay = nowDate.getDate();
        let commissionSetting = Object.assign({}, this.marketData.marketCommissionSetting);
        if(commissionSetting.unit === 'week' && commissionSetting.day!=nowWeek) {
          this.$store.dispatch('showError', this.withDrawText);
          return false;
        } else if(commissionSetting.unit === 'month' && commissionSetting.day!=nowDay) {
          this.$store.dispatch('showError', this.withDrawText);
          return false;
        }

        this.$router.push({
          name: 'marketWithdraw',
          query: {},
        })
      },
      switchDialog() {
        this.showModal = !this.showModal;
      },
      jumpPage(page) {
        if(!this.marketData.switchButton || this.marketData.switchButton !== 'on') {
          return;
        }
        this.$router.push({
          name: page
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .market__question {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 100;

    width: 26px;
    height: 26px;
    background: url("../../../assets/question.png") no-repeat center center;
    background-size: 26px 26px;
  }


  .market-index {
    width: 100%;
    height: 100%;

    overflow-y: auto;
  }
  .market-index__tip {
    width: 100%;
    height: 80px;
    line-height: 80px;
    margin-bottom: 20px;

    font-size: 28px;
    color: #f60;
    text-align: center;
    background: #fff;
  }
  .market-index__title {
    width: 100%;

    text-align: center;
    background: #fff;
  }
  .market-index__title-p1 {
    padding-top: 40px;
    font-size: 28px;
    color: #4c4c4c;
  }
  .market-index__title-p2 {
    padding-top: 30px;
    font-size: 50px;
    color: #888;
  }
  .market-index__title-p3 {
    padding-top: 22px;
    padding-bottom: 38px;
    font-size: 24px;
    color: #888;
  }

  .market-index__total {
    display: flex;

    width: 100%;
    height: 160px;

    background: #fff;
  }
  .market-index__total-item {
    width: 0;
    flex: 1;

    text-align: center;
  }
  .market-index__total-num {
     color: #888;
     font-size: 40px;
     padding-top: 38px;
   }
  .market-index__total-text {
    color: #4c4c4c;
    font-size: 24px;
    padding-top: 38px;
  }
  /*.market-product-box {
    display: flex;
    !*flex-wrap: wrap;*!
    !*justify-content: space-around;*!
    width: 100%;
    padding: 20px 0;
    margin: 20px 0;
    background: #fff;
  }
  .market-product-item {
    width: 0;
    flex: 1;
    padding: 20px;
    margin: 0 20px;
    border-radius: 10px;
    background: #b2b2b2;
  }*/
  .market-product-box {
    padding: 0 20px;
    margin: 20px 0;
    display: flex;
    flex-wrap: wrap;
    /*justify-content: flex-start;*/
    width: 100%;
    background: #fff;
  }
  .market-product-item {
    /*float: left;*/
    width: 30%;
    padding: 20px;
    margin: 20px 0;
    border-radius: 10px;
    background: #b2b2b2;
  }
  .market-product-item:nth-of-type(3n + 2) {
    margin: 20px 5%;
  }
  .pro-title {
    padding-bottom: 20px;
    font-size: 32px;
    color: #fff;
  }
  .pro-percent {
    font-size: 40px;
    color: rgba(255,255,255,.5);
  }
  .pro-text {
    font-size: 24px;
    color: rgba(255,255,255,.5);
  }

  .market-index-active {
    .market-index__tip {
      display: none;
    }
    .market-index__title-p2 {
      color: #121212;
    }
    .withdraw-price {
      color: #f60;
    }
    .market-index__total-num {
      color: #f60;
    }
    .market-product-item1 {
      background: #fdb933;
    }
    .market-product-item2 {
      background: #f58f98;
    }
    .market-product-item3 {
      background: #45b974;
    }
  }


  .dialog-demo {
    position: fixed;
    top:0;
    width: 100%;
    height: 100%;
    /*background: #fff;*/
    z-index: 1000;
    display: none;
    -webkit-transform: scale3d(1, 1, 1);
  }
  .display-block {
    display: block !important;
  }

  .market-dialog {
    padding: 15px 30px 25px;
  }
  .market-dialog__title {
    padding: 15px 0;
    font-size: 28px;
    color: #4c4c4c;
    text-align: left;
  }
  .market-dialog__content {
    font-size: 24px;
    color: #888;
    text-align: justify;
    line-height: 1.2;
  }

</style>