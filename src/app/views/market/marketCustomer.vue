<template>
  <main-box :title="title" :show-more="false" main-class="scrollingBox">
    <div class="scroll-box">
      <div class="top-extend" @click="choseCustomer('')">
        <span>{{customers[currentIndex].name}} （{{dataList.length}}条）</span>
        <span class="top-extend__icon"></span>
        <div class="top-extend__box" v-show="showSelect">
          <div class="top-extend__item line line-x-b"
               :class="{'line-x-t':index===0}"
               @click.stop="choseCustomer(index)"
               v-for="(val, index) of customers">{{val.name}}</div>
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
            <div v-for="(val, index) of dataList">
              <!--临时用户-->
              <div class="form-div line line-x-b" v-if="val.status == 0">
                <div class="form-div__avatar"><img :src="val.headUrl" alt=""></div>
                <div class="form-div__title">
                  <p class="form-div__name form-div__single-name">{{val.marketerPhone}}</p>
                </div>
                <div class="form-div__auto-full">
                  <p class="temp-customer">临时客户</p>
                </div>
              </div>
              <!--正式用户-->
              <div class="form-div line line-x-b" v-if="val.status == 1">
                <div class="form-div__avatar "><img :src="val.headUrl" alt=""></div>
                <div class="form-div__title">
                  <p class="form-div__name">{{val.marketerPhone}}</p>
                  <p class="form-div__order">订单：{{val.orderNum || 0}}</p>
                </div>
                <div class="form-div__auto-full">
                  <p class="order-price">
                    成交金额：{{val.orderAmount|formatPrice}}
                  </p>
                </div>
              </div>
              <!--过期用户-->
              <div class="form-div line line-x-b" v-if="val.status == 2">
                <div class="form-div__avatar"><img :src="val.headUrl" alt=""></div>
                <div class="form-div__title">
                  <p class="form-div__name form-div__single-name">{{val.marketerPhone}}</p>
                </div>
                <div class="form-div__auto-full">
                  <p class="outDate-customer">已过期</p>
                  <p class="order-price order-price-temp">
                    成交金额：{{val.orderAmount|formatPrice}}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="no-market" v-show="dataList.length===0">
            <div class="market-icon"></div>
            <p class="market-text">暂无累计客户</p>
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
        customers: [
          {name: '全部分类', value: ''},
          {name: '临时客户', value: 0},
          {name: '正式客户', value: 1},
          {name: '过期客户', value: 2},
        ],
        dataList: [],
        currentIndex: 0,
        showSelect: false,
        page: {},
      }
    },
    mounted () {
      this.initPage();
    },
    methods: {
      initPage() {
        this.page = new Page({
          search: {
            status: '', // 客户状态 0-临时客户 1-绑定客户 2-过期客户 ,
            type: 0, // 客户类型：0：产品订单客户，1：关注用户，2：注册用户 ,
          },
          refScroll: this.$refs.scroll,
          pageApi: 'marketerCustomerFind',
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
        this.page.search.status = this.customers[this.currentIndex].value;
        this.page.search.pageNo = 0;
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
    padding: 15px 20px 25px;

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
</style>