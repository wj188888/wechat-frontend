<template>
  <main-box :title="title" :show-more="false" main-class="scrollingBox">
    <div class="scroll-box">
      <div class="top-extend" @click="choseCustomer('')">
        <span>
          <span v-if="currentIndex>0">
            {{productList[currentIndex].productTypeLevelTwo|getProductTwoName}}
          </span>
          <span v-else>全部分类</span>
          （{{dataList.length}}条）
        </span>
        <span class="top-extend__icon"></span>
        <div class="top-extend__box" v-show="showSelect">
          <div class="top-extend__item line line-x-b"
               :class="{'line-x-t':index===0}"
               @click.stop="choseCustomer(index)"
               v-for="(val, index) of productList">
            <span v-if="index>0">{{val.productTypeLevelTwo|getProductTwoName}}</span>
            <span v-else>全部分类</span>
          </div>
        </div>
      </div>
      <p class="customer-tip">
        客户的有效期为7天，超过7天累计客户将被清除，佣金将不再计算，已计算的佣金将不受影响，请知悉。
      </p>
      <div class="scroll">
        <scroll ref="scroll"
                :pullUpLoad="true"
                @pullingUp="onPullingUp">
          <div v-show="dataList.length">
            <div class="ticket-order">
              <ul class="order-list">
                <li class="line line-x mar-t-0 mar-b-20"
                    v-for="(data, index) of dataList"
                >
                  <div class="flex-li">
                    <div class="mes-center">
                      <div class="hd clearfix mar-t-25 mar-b-25 f-s-26 pad-0" style="height: auto">
                        <span class="text-gray">
                          {{data.productTypeLevelTwo | getProductTwoName}}&nbsp;&nbsp;{{(data.startupTime||data.createdTime).substring(0,16)}}
                        </span>
                      </div>
                      <div class="bd pad-0">
                        <div class="order-station f-s-28 mar-b-15">
                          <i class="start-dian mar-r-10"></i>
                          <span>{{data.aAddress.searchShowAddress}}&nbsp;</span>
                          <em class="dian" v-if="data.aAddress.stationName&&data.aAddress.name"></em>
                          <span class="rental-address-limit" v-if="data.aAddress.stationName">&nbsp;{{data.aAddress.stationName + data.aAddress.name}}</span>
                          <span class="rental-address-limit" v-else>&nbsp;{{data.aAddress.name}}</span>
                        </div>
                        <div class="order-station f-s-28 off-station">
                          <i class="end-dian mar-r-10"></i>
                          <span>{{data.bAddress.searchShowAddress}}&nbsp;</span>
                          <em class="dian" v-if="data.bAddress.stationName&&data.bAddress.name"></em>
                          <span class="rental-address-limit" v-if="data.bAddress.stationName">&nbsp;{{data.bAddress.stationName + data.bAddress.name}}</span>
                          <span class="rental-address-limit" v-else>&nbsp;{{data.bAddress.name}}</span>
                        </div>
                      </div>
                    </div>
                    <div class="mes-right text-right f-s-32 relative">
                      <P class="money-position yuan"><em class="money">{{data.actualPayment | formatPrice('normal')}}</em>元</P>
                    </div>
                  </div>

                </li>
              </ul>
            </div>
          </div>
          <div class="no-market" v-show="dataList.length===0">
            <div class="market-icon"></div>
            <p class="market-text">暂无推广订单</p>
          </div>
        </scroll>
      </div>
    </div>

  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import Scroll from 'components/betterScroll/scroll/scroll'

  import Page from '../../../utils/page'

  export default {
    components: {
      MainBox,
      Scroll,
    },
    data() {
      return {
        title: this.$route.meta.title,
        productList: [{productTypeLevelTwo:'',productTypeLevelOne:'',commissionRate:0}],
        dataList: [],
        currentIndex: 0,
        showSelect: false,
        page: {},
      }
    },
    mounted () {
      this.getMarketSet();
      this.initPage();
    },
    methods: {
      getMarketSet() {
        api.getMarketSet().then((res) => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            let dataList = data.resultData.marketProductSettingList || [];
            this.productList = [...this.productList,...dataList];
            console.log(this.productList);
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      initPage() {
        this.page = new Page({
          search: {
            productTypeLevelOne: '',
            productTypeLevelTwo: '',
          },
          refScroll: this.$refs.scroll,
          pageApi: 'marketOrderFind',
        });
        this.onPullingUp();
      },
      onPullingUp() {
        this.page.onPullingUp().then((dataList) => {
          this.dataList = this.dataList.concat(dataList);
          console.log(this.dataList);
        }).catch((err) => {
          this.$store.dispatch('showError', err);
        })
      },
      choseCustomer(index) {
        this.showSelect = !this.showSelect;
        if(index === '') {
          return;
        }
        this.currentIndex = index;
        this.page.search.pageNo = 0;
        this.page.search.productTypeLevelOne = this.productList[this.currentIndex].productTypeLevelOne;
        this.page.search.productTypeLevelTwo = this.productList[this.currentIndex].productTypeLevelTwo;
        this.dataList = [];
        this.onPullingUp();
      }
    }
  }
</script>
<style lang="less" scoped>
  .scroll-box {
    display: flex;
    flex-direction: column;

    height: 100%;
  }
  .scroll {
    position: relative;
    height: 0;
    flex: 1;
  }
  .customer-tip {
    padding: 15px 20px 15px;

    font-size: 24px;
    line-height: 1.6;
    word-break: break-all;
    word-wrap: break-word;
    color: #4c4c4c;
  }
  .form-div {
    height: 140px;
  }
  .form-div__avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    margin-right: 20px;
  img {
    width: 100px;
    height: 100px;

    border-radius: 50%;
    border: 1PX solid #e0e0e0;
  }
  }
  .form-div__title {
    line-height: 1;
  }
  .form-div__name {
    padding-top: 24px;

    font-size: 28px;
    color: #4c4c4c;
  }
  .form-div__single-name {
    padding-top: 55px;
  }
  .form-div__order {
    padding-top: 34px;
    font-size: 24px;
    color: #4c4c4c;
  }
  .order-price {
    padding-top: 82px;
    font-size: 24px;
    color: #4c4c4c;
  }
  .temp-customer {
    padding-top: 55px;
    font-size: 24px;
    color: #07d;
  }
  .outDate-customer {
    padding-top: 24px;
    font-size: 24px;
    color: #4c4c4c;
  }
  .order-price-temp {
    padding-top: 34px;
  }
  .form-div__auto-full {
    text-align: right;
  }
  .flex-li{
    display: flex;
    flex-wrap: nowrap;
    height: 170px;
    align-items: center;
    padding: 0 30px;
  .mes-left{
    width: 50px;
    height:100%;
  .check-item{
    height:100%;
    margin-bottom: 0;
    border: 0;
  }
  .check-box{
    width: 100%;
    height:100%;
    padding-left: 0;
  }
  }
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
    background: url("../../../assets/order_start.png") no-repeat left center;
    background-size: 100% 100%;
  }
  .end-dian {
    width: 30px;
    height:30px;
    background-color: transparent !important;
    background: url("../../../assets/order_end.png") no-repeat left center;
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
  .abs-bottom-box{
    height:130px;
  }
  .buy-left{
    height:100%;
  .check-item{
    padding-left: 30px;
    margin-bottom: 0;
  }
  .icon-com{
    left: 0;
    top:30px;
  }
  .check-box{
    padding-left: 50px;
    height:auto;
    line-height: normal;
  }
  label{
    margin-left: 0;
    margin-top: 30px;
  }
  .total{
    line-height: normal;
    margin-top: 15px;
  }
  }
  .buy-right{
    height:100%;
    line-height: 130px;
  input{
    height:100% !important;
  }
  }

</style>