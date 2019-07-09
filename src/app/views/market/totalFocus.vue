<template>
  <main-box :title="title" :show-more="false" main-class="scrollingBox has-abs-bottom">
    <scroll ref="scroll"
            :pullUpLoad="true"
            @pullingUp="onPullingUp">
      <div v-show="dataList.length">
        <div class="form-div line line-x-b" v-for="(val, index) of dataList">
          <div class="form-div__avatar"><img :src="val.headUrl" alt=""></div>
          <div class="form-div__title">
            <p class="form-div__name form-div__single-name">{{val.nickname}}</p>
          </div>
          <div class="form-div__auto-full">
            <p class="temp-time">{{val.createdTime}}</p>
          </div>
        </div>
      </div>
      <div class="no-market" v-show="dataList.length===0">
        <div class="market-icon"></div>
        <p class="market-text">暂无累计关注</p>
      </div>
    </scroll>

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
        page: {},
        dataList: [],
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
            type: 1, // 客户类型：0：产品订单客户，1：关注用户，2：注册用户 ,
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
    }
  }
</script>
<style lang="less" scoped>
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
  .temp-time {
    padding-top: 55px;
    font-size: 24px;
    color: #888;
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