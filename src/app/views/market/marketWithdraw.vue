<template>
  <main-box :title="title" :show-more="false" main-class="scrollingBox has-abs-bottom">
    <div class="form-div mar-t-20">
      <div class="form-div__title">可提现金额</div>
      <div class="form-div__auto">{{marketer.unSettleAmount||0|formatPrice('normal')}}</div>
    </div>
    <div class="form-div line line-x-t">
      <div class="form-div__auto">本次提现</div>
      <!--<div class="form-div__auto c-f-888">{{22|formatPrice}}</div>-->
      <input type="text" v-model="settleAmount" class="form-div__input text-right">
    </div>
    <div class="form-div mar-t-20" @click="jumpPage('setWeWallet')">
      <div class="form-div__title">提现账户</div>
      <div class="form-div__auto mar-r-20">
        <span v-if="!marketer.openId">去设置</span>
        <span v-else>微信钱包 （{{marketer.name}}）</span>
      </div>
      <div class="form-div__icon-r"></div>
    </div>

    <div class="mar20 mar-t-40">
      <input type="button" class="button button-primary"
             :disabled="!canWithdraw"
             @click="marketSettle"
             value="提现" />
    </div>

    <p class="p-text">
      1、金额低于{{marketData.marketCommissionSetting.amountBegin}}元时不可提现
    </p>
    <p class="p-text">
      2、预计三个工作日可到账
    </p>
    <p class="p-text">
      3、未实名认证的微信用户，将无法提现到微信零钱包
    </p>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'

  export default {
    components: {
      MainBox
    },
    data() {
        return {
          title: this.$route.meta.title,
          marketer: {},
          marketData: {
            marketCommissionSetting: {},
          },
          canWithdraw: false,
          settleAmount: 0,
        }
    },
    mounted () {
      this.getMarketSet();
      this.getMarketInfo();
    },
    methods: {
      init() {
        let promise1 = this.getMarketSet();
        let promise2 = this.getMarketInfo();
        Promise.all([promise1,promise2]).then(() => {
          if(!this.marketer.openId||this.marketer.unSettleAmount < this.marketData.marketCommissionSetting.amountBegin) {
            this.canWithdraw = false;
          } else {
            this.canWithdraw = true;
          }
        })
      },
      getMarketSet() {
        return new Promise((resolve, reject) => {
          api.getMarketSet().then((res) => {
            const data = TOOL.toJson(res.data);
            if(data.resultCode === '0') {
              this.marketData = Object.assign({}, this.marketData, data.resultData);
              console.log(this.marketData);
              resolve();
            } else {
              this.$store.dispatch('showError', data.resultMsg);
              reject();
            }
          })
        })
      },
      getMarketInfo() {
        return new Promise((resolve, reject) => {
          api.getMarketInfo().then((res) => {
            const data = TOOL.toJson(res.data);
            if(data.resultCode === '0') {
              this.marketer = data.resultData || {};
              console.log(this.marketer);
              resolve();
            } else {
              this.$store.dispatch('showError', data.resultMsg);
              reject();
            }
          })
        })
      },
      marketSettle() {
        if(this.marketer.unSettleAmount < this.settleAmount) {
          this.$store.dispatch('showError', '提现余额不足');
            return;
        }
        if(this.settleAmount < this.marketData.marketCommissionSetting.amountBegin) {
          this.$store.dispatch('showError', `提现金额不能低于${this.marketData.marketCommissionSetting.amountBegin}`);
          return;
        }
        if(this.settleAmount > this.marketData.marketCommissionSetting.amountTop) {
          this.$store.dispatch('showError', `本次提现金额不能大于${this.marketData.marketCommissionSetting.amountTop}`);
          return;
        }
        api.marketSettle(
          {settleAmount: this.settleAmount}
        ).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            console.log(data.resultData);
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      jumpPage(page) {
        this.$router.push({
          name: page,
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .p-text {
    width: 100%;
    padding: 0 20px;

    color: #888;
    font-size: 24px;
    line-height: 34px;
    word-wrap: break-word;
    word-break: break-all;
  }
</style>